"use client";

import { useCallback, useState } from "react";
import { saveHighScore } from "@/core/highscore";
import type { SessionState } from "@/core/session";
import type { Level } from "@/core/types";
import { browserStore } from "@/lib/storage";
import { GameScreen } from "@/components/GameScreen";
import { LevelSelect } from "@/components/LevelSelect";
import { ResultScreen } from "@/components/ResultScreen";

type Screen =
  | { name: "select" }
  | { name: "play"; level: Level; seed: number }
  | { name: "result"; state: SessionState; newRecord: boolean };

export default function Home() {
  const [screen, setScreen] = useState<Screen>({ name: "select" });

  const startPlay = useCallback((level: Level) => {
    // シードは UI 層で採る(core は乱数を持たない — AGENTS §4)
    setScreen({ name: "play", level, seed: Date.now() >>> 0 });
  }, []);

  const handleFinish = useCallback((state: SessionState) => {
    const newRecord = saveHighScore(browserStore(), state.level, state.score);
    setScreen({ name: "result", state, newRecord });
  }, []);

  return (
    <main>
      {screen.name === "select" && <LevelSelect onSelect={startPlay} />}
      {screen.name === "play" && (
        <GameScreen
          key={screen.seed}
          level={screen.level}
          seed={screen.seed}
          onFinish={handleFinish}
        />
      )}
      {screen.name === "result" && (
        <ResultScreen
          state={screen.state}
          newRecord={screen.newRecord}
          onRetry={() => startPlay(screen.state.level)}
          onBack={() => setScreen({ name: "select" })}
        />
      )}
    </main>
  );
}
