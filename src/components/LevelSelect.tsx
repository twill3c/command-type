"use client";

import { useEffect, useState } from "react";
import { loadHighScore } from "@/core/highscore";
import type { PlayLevel } from "@/core/types";
import { browserStore } from "@/lib/storage";

const LEVELS: { level: PlayLevel; label: string; desc: string }[] = [
  {
    level: "beginner",
    label: "初級",
    desc: "ナビゲーション・テキスト処理・権限管理の基本 50 コマンド",
  },
  {
    level: "intermediate",
    label: "中級",
    desc: "プロセス・圧縮転送・ネットワーク・パッケージ管理の 50 コマンド",
  },
  {
    level: "advanced",
    label: "上級",
    desc: "ディスク・性能分析・診断・セキュリティ・開発の 50 コマンド",
  },
  {
    level: "mix",
    label: "ミックス",
    desc: "全 13 カテゴリ・150 コマンドから出題(落下速度は中級相当)",
  },
];

/** レベル選択画面(F-02 / F-14)。モード別ハイスコアを表示する(F-12)。 */
export function LevelSelect({
  onSelect,
}: {
  onSelect: (level: PlayLevel) => void;
}) {
  // ハイスコアはクライアントでのみ読める(静的エクスポートの prerender 対策)
  const [scores, setScores] = useState<Record<PlayLevel, number> | null>(null);
  useEffect(() => {
    const store = browserStore();
    setScores({
      beginner: loadHighScore(store, "beginner"),
      intermediate: loadHighScore(store, "intermediate"),
      advanced: loadHighScore(store, "advanced"),
      mix: loadHighScore(store, "mix"),
    });
  }, []);

  return (
    <div className="select">
      <h1 className="title">
        <span className="prompt">&gt;</span> command-type
      </h1>
      <p className="tagline">
        落ちてくる Linux コマンドを、底に着く前にタイプして Enter。
        150 コマンドを遊びながら覚える。
      </p>
      <div className="level-list">
        {LEVELS.map(({ level, label, desc }) => (
          <button
            key={level}
            className={`level-card level-${level}`}
            onClick={() => onSelect(level)}
          >
            <span className={`badge badge-${level}`}>{label}</span>
            <span className="level-desc">{desc}</span>
            <span className="level-score">
              ハイスコア {scores ? scores[level] : "—"}
            </span>
          </button>
        ))}
      </div>
      <p className="input-hint">クリックまたはタップでレベルを選択</p>
    </div>
  );
}
