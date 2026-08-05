import type { QuestionResult, SessionState } from "./session";

/** 結果画面用の集計(F-10)。 */
export interface SessionSummary {
  score: number;
  cleared: number;
  total: number;
  /** 正打鍵 / 総打鍵。打鍵ゼロのときは 1。 */
  accuracy: number;
  /** 正打鍵 / 経過分。経過ゼロのときは 0。 */
  cpm: number;
  /** 全出題の結果(出題順)。成功も含め復習一覧に使う(F-10)。 */
  attempted: QuestionResult[];
  /** 復習対象: 落下した出題、または不一致 Enter があった出題。 */
  missed: QuestionResult[];
}

export function summarize(state: SessionState): SessionSummary {
  const accuracy =
    state.totalKeystrokes === 0
      ? 1
      : state.correctKeystrokes / state.totalKeystrokes;
  const minutes = state.elapsedMs / 60000;
  const cpm = minutes === 0 ? 0 : state.correctKeystrokes / minutes;
  return {
    score: state.score,
    cleared: state.cleared,
    total: state.queue.length,
    accuracy,
    cpm,
    attempted: [...state.results],
    missed: state.results.filter(
      (r) => r.outcome === "dropped" || r.enterMisses > 0,
    ),
  };
}
