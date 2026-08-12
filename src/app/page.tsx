"use client";

import { useCallback, useState } from "react";
import { saveHighScore } from "@/core/highscore";
import type { SessionState } from "@/core/session";
import type { PlayLevel, TrackId } from "@/core/types";
import { browserStore } from "@/lib/storage";
import { GameScreen } from "@/components/GameScreen";
import { LevelSelect } from "@/components/LevelSelect";
import { ResultScreen } from "@/components/ResultScreen";

type Screen =
  | { name: "select" }
  | { name: "play"; track: TrackId; level: PlayLevel; seed: number }
  | { name: "result"; state: SessionState; newRecord: boolean };

export default function Home() {
  const [screen, setScreen] = useState<Screen>({ name: "select" });

  const startPlay = useCallback((track: TrackId, level: PlayLevel) => {
    // シードは UI 層で採る(core は乱数を持たない — AGENTS §4)
    setScreen({ name: "play", track, level, seed: Date.now() >>> 0 });
  }, []);

  const handleFinish = useCallback((state: SessionState) => {
    const newRecord = saveHighScore(browserStore(), state.level, state.score);
    setScreen({ name: "result", state, newRecord });
  }, []);

  return (
    <main>
      {screen.name === "select" && (
        // トラック選択 UI は P7(F-15)。それまでは linux 固定
        <LevelSelect onSelect={(level) => startPlay("linux", level)} />
      )}
      {screen.name === "play" && (
        <GameScreen
          key={screen.seed}
          track={screen.track}
          level={screen.level}
          seed={screen.seed}
          onFinish={handleFinish}
        />
      )}
      {screen.name === "result" && (
        <ResultScreen
          state={screen.state}
          newRecord={screen.newRecord}
          onRetry={() => startPlay(screen.state.track, screen.state.level)}
          onBack={() => setScreen({ name: "select" })}
        />
      )}
    </main>
  );
}
