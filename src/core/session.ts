import { SESSION_LIVES, SESSION_QUESTIONS } from "./config";
import { fallDurationMs, updateAltitude } from "./fall";
import { matchInput } from "./match";
import { buildQueue } from "./queue";
import { clearScore } from "./score";
import type { PlayLevel, Question } from "./types";

/** 出題 1 件の結末。dropped = 底到達(F-06)。 */
export type QuestionOutcome = "cleared" | "dropped";

export interface QuestionResult {
  question: Question;
  outcome: QuestionOutcome;
  /** この出題中に不一致 Enter を押した回数(復習対象の判定に使う)。 */
  enterMisses: number;
}

/**
 * セッション状態(F-05〜F-09)。すべて純関数で遷移し、時間(dtMs)と乱数(seed)は
 * 外から注入する(AGENTS §4)。
 */
export interface SessionState {
  level: PlayLevel;
  status: "playing" | "finished";
  queue: Question[];
  index: number;
  input: string;
  /** 現在の出題の高度。1 = 出現位置、0 = 底。 */
  altitude: number;
  lives: number;
  cleared: number;
  combo: number;
  score: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  /** セッション全体の不一致 Enter 回数。 */
  enterMisses: number;
  /** 現在の出題中の不一致 Enter 回数。 */
  currentEnterMisses: number;
  elapsedMs: number;
  results: QuestionResult[];
}

export function startSession(level: PlayLevel, seed: number): SessionState {
  return {
    level,
    status: "playing",
    queue: buildQueue(level, seed, SESSION_QUESTIONS),
    index: 0,
    input: "",
    altitude: 1,
    lives: SESSION_LIVES,
    cleared: 0,
    combo: 0,
    score: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    enterMisses: 0,
    currentEnterMisses: 0,
    elapsedMs: 0,
    results: [],
  };
}

/** 現在落下中の出題。終了後は null。 */
export function currentQuestion(state: SessionState): Question | null {
  return state.status === "playing" ? (state.queue[state.index] ?? null) : null;
}

/** 次の出題へ進める。キューを使い切ったら終了(F-07)。 */
function advance(state: SessionState): SessionState {
  const index = state.index + 1;
  const finished = index >= state.queue.length || state.lives <= 0;
  return {
    ...state,
    index,
    input: "",
    altitude: 1,
    currentEnterMisses: 0,
    status: finished ? "finished" : "playing",
  };
}

/** 経過時間を注入して高度を進める。底到達でミス(F-06)。 */
export function tick(state: SessionState, dtMs: number): SessionState {
  if (state.status !== "playing") return state;
  const duration = fallDurationMs(state.level, state.cleared);
  const altitude = updateAltitude(state.altitude, dtMs, duration);
  const next = { ...state, altitude, elapsedMs: state.elapsedMs + dtMs };
  if (altitude > 0) return next;

  const question = currentQuestion(state);
  if (!question) return next;
  return advance({
    ...next,
    lives: next.lives - 1,
    combo: 0,
    results: [
      ...next.results,
      { question, outcome: "dropped", enterMisses: next.currentEnterMisses },
    ],
  });
}

/** 1 文字入力。正打/誤打を計数する(F-04 / T-018)。 */
export function typeChar(state: SessionState, ch: string): SessionState {
  const question = currentQuestion(state);
  if (!question) return state;
  const correct = question.cmd[state.input.length] === ch;
  return {
    ...state,
    input: state.input + ch,
    totalKeystrokes: state.totalKeystrokes + 1,
    correctKeystrokes: state.correctKeystrokes + (correct ? 1 : 0),
  };
}

/** Backspace(打鍵数には数えない)。 */
export function backspace(state: SessionState): SessionState {
  if (state.status !== "playing" || state.input.length === 0) return state;
  return { ...state, input: state.input.slice(0, -1) };
}

/** Enter 確定(F-05)。完全一致でクリア、不一致はミス(入力保持・コンボ 0)。 */
export function pressEnter(state: SessionState): SessionState {
  const question = currentQuestion(state);
  if (!question) return state;

  if (!matchInput(question.cmd, state.input).complete) {
    return {
      ...state,
      combo: 0,
      enterMisses: state.enterMisses + 1,
      currentEnterMisses: state.currentEnterMisses + 1,
    };
  }

  return advance({
    ...state,
    score: state.score + clearScore(state.altitude, state.combo),
    combo: state.combo + 1,
    cleared: state.cleared + 1,
    results: [
      ...state.results,
      { question, outcome: "cleared", enterMisses: state.currentEnterMisses },
    ],
  });
}
