"use client";

import { useEffect, useState } from "react";
import { datasets } from "@/core/data";
import { loadHighScore } from "@/core/highscore";
import type { PlayLevel, TrackId } from "@/core/types";
import { browserStore } from "@/lib/storage";

const PLAY_LEVELS: PlayLevel[] = ["beginner", "intermediate", "advanced", "mix"];

const LEVEL_LABEL: Record<PlayLevel, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
  mix: "ミックス",
};

/** トラック×モードのカード説明(§4 のカテゴリ群の要約)。 */
const LEVEL_DESC: Record<TrackId, Record<PlayLevel, string>> = {
  linux: {
    beginner: "ナビゲーション・テキスト処理・権限管理の基本 50 コマンド",
    intermediate: "プロセス・圧縮転送・ネットワーク・パッケージ管理の 50 コマンド",
    advanced: "ディスク・性能分析・診断・セキュリティ・開発の 50 コマンド",
    mix: "全 13 カテゴリ・150 コマンドから出題(落下速度は中級相当)",
  },
  python: {
    beginner: "組み込み関数・文字列・コレクションの基本 50 問",
    intermediate: "イテレーション・ファイル/OS・標準ライブラリ・例外の 50 問",
    advanced: "特殊メソッド・collections・型ヒント・非同期ほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  typescript: {
    beginner: "基本型・配列・文字列メソッドの基本 50 問",
    intermediate: "Object/JSON・非同期・クラス・コレクションの 50 問",
    advanced: "ユーティリティ型・型演算・DOM・ツールほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
};

const TAGLINE: Record<TrackId, string> = {
  linux:
    "落ちてくる Linux コマンドを、底に着く前にタイプして Enter。150 コマンドを遊びながら覚える。",
  python:
    "落ちてくる Python の関数・メソッドを、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  typescript:
    "落ちてくる TypeScript の構文・API を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
};

/**
 * トラック・レベル選択画面(F-02 / F-14 / F-15)。
 * タブは datasets 登録済みトラックのみ表示し(F-15)、
 * 表示中トラックのモード別ハイスコアを出す(F-12)。
 */
export function LevelSelect({
  track,
  onTrackChange,
  onSelect,
}: {
  track: TrackId;
  onTrackChange: (track: TrackId) => void;
  onSelect: (level: PlayLevel) => void;
}) {
  // ハイスコアはクライアントでのみ読める(静的エクスポートの prerender 対策)
  const [scores, setScores] = useState<Record<PlayLevel, number> | null>(null);
  useEffect(() => {
    const store = browserStore();
    setScores({
      beginner: loadHighScore(store, track, "beginner"),
      intermediate: loadHighScore(store, track, "intermediate"),
      advanced: loadHighScore(store, track, "advanced"),
      mix: loadHighScore(store, track, "mix"),
    });
  }, [track]);

  return (
    <div className="select">
      <h1 className="title">
        <span className="prompt">&gt;</span> command-type
      </h1>
      <div className="track-tabs" role="tablist" aria-label="トラック選択">
        {[...datasets.values()].map((d) => (
          <button
            key={d.track.id}
            role="tab"
            aria-selected={d.track.id === track}
            className={
              d.track.id === track ? "track-tab active" : "track-tab"
            }
            onClick={() => onTrackChange(d.track.id)}
          >
            {d.track.name}
          </button>
        ))}
      </div>
      <p className="tagline">{TAGLINE[track]}</p>
      <div className="level-list">
        {PLAY_LEVELS.map((level) => (
          <button
            key={level}
            className={`level-card level-${level}`}
            onClick={() => onSelect(level)}
          >
            <span className={`badge badge-${level}`}>{LEVEL_LABEL[level]}</span>
            <span className="level-desc">{LEVEL_DESC[track][level]}</span>
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
