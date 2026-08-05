"use client";

import { useEffect, useRef, useState } from "react";
import { SESSION_LIVES } from "@/core/config";
import { matchInput } from "@/core/match";
import {
  backspace,
  currentQuestion,
  pressEnter,
  startSession,
  tick,
  typeChar,
} from "@/core/session";
import type { SessionState } from "@/core/session";
import type { PlayLevel } from "@/core/types";
import { keyToAction } from "@/lib/keys";
import { isMuted, playClear, playDrop, playMissEnter, setMuted } from "@/lib/sound";
import { browserStore } from "@/lib/storage";
import { FallingCommand } from "./FallingCommand";

/**
 * ゲーム画面(F-03〜F-06)。時間は requestAnimationFrame の経過差分として
 * core の tick に注入する(N-02)。キー入力は window の keydown で受け、
 * 入力欄を持たないことで IME の介在を避ける(N-03)。
 */
export function GameScreen({
  level,
  seed,
  onFinish,
}: {
  level: PlayLevel;
  seed: number;
  onFinish: (state: SessionState) => void;
}) {
  const [state, setState] = useState<SessionState>(() =>
    startSession(level, seed),
  );
  const [muted, setMutedState] = useState(false);
  useEffect(() => {
    setMutedState(isMuted(browserStore()));
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(browserStore(), next);
  };

  // 状態遷移の検出で効果音を鳴らす(F-13)。判定は core のカウンタ差分のみ
  const prev = useRef({
    cleared: 0,
    enterMisses: 0,
    lives: SESSION_LIVES,
  });
  useEffect(() => {
    const p = prev.current;
    if (!muted) {
      if (state.cleared > p.cleared) playClear(state.combo);
      if (state.enterMisses > p.enterMisses) playMissEnter();
      if (state.lives < p.lives) playDrop();
    }
    prev.current = {
      cleared: state.cleared,
      enterMisses: state.enterMisses,
      lives: state.lives,
    };
  }, [state.cleared, state.enterMisses, state.lives, state.combo, muted]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = now - last;
      last = now;
      setState((s) => tick(s, dt));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const action = keyToAction(e.key);
      if (!action) return;
      e.preventDefault();
      setState((s) => {
        if (action.type === "char") return typeChar(s, action.ch);
        if (action.type === "backspace") return backspace(s);
        return pressEnter(s);
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (state.status === "finished") onFinish(state);
  }, [state, onFinish]);

  const question = currentQuestion(state);
  const m = question ? matchInput(question.cmd, state.input) : null;
  const okLen = m ? m.matchedLength : state.input.length;

  return (
    <div className="game">
      <header className="hud">
        <span className="hud-item">
          スコア <strong>{state.score}</strong>
        </span>
        <span className="hud-item">
          コンボ <strong>{state.combo}</strong>
        </span>
        <span className="hud-item">
          {Math.min(state.index + 1, state.queue.length)} / {state.queue.length}
        </span>
        <span className="hud-item hud-lives" aria-label="残りライフ">
          {"♥".repeat(state.lives)}
          <span className="lives-lost">
            {"♥".repeat(SESSION_LIVES - state.lives)}
          </span>
        </span>
        <button
          className="btn-sound"
          onClick={toggleMute}
          aria-label={muted ? "効果音をオンにする" : "効果音をオフにする"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </header>

      <div className="stage">
        {question && (
          <FallingCommand
            question={question}
            input={state.input}
            altitude={state.altitude}
          />
        )}
        <div className="ground" />
        {state.cleared > 0 && (
          <div key={`c${state.cleared}`} className="flash flash-clear" />
        )}
        {state.lives < SESSION_LIVES && (
          <div key={`d${state.lives}`} className="flash flash-drop" />
        )}
      </div>

      <div className="input-line" aria-live="polite">
        <span className="prompt">&gt;</span>
        <span className="input-ok">{state.input.slice(0, okLen)}</span>
        <span className="input-miss">{state.input.slice(okLen)}</span>
        <span className="caret" />
      </div>
      <p className="input-hint">タイプして Enter — Backspace で修正</p>
    </div>
  );
}
