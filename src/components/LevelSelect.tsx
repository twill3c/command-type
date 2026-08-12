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
  sql: {
    beginner: "問い合わせ・集計・データ操作の基本 50 問",
    intermediate: "結合・データ型・関数・日付時刻の 50 問",
    advanced: "ウィンドウ関数・DDL・JSON・グラフほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
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
  pyml: {
    beginner: "NumPy・pandas の基本 50 問",
    intermediate: "可視化・scikit-learn(前処理/モデル/評価)の 50 問",
    advanced: "PyTorch・Transformers・GBDT・実験運用ほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  pyauto: {
    beginner: "Excel・ファイル整理・CSV 処理の基本 50 問",
    intermediate: "HTTP/API・スクレイピング・ブラウザ・定期実行の 50 問",
    advanced: "メール通知・PDF/画像・GUI・堅牢化ほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  r: {
    beginner: "ベクトル・データフレーム・tidyverse の基本 50 問",
    intermediate: "apply 族・統計解析・分布・ggplot2 の 50 問",
    advanced: "文字列・モデリング・レポート・環境ほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  react: {
    beginner: "フック・コンポーネント・状態管理の基本 50 問",
    intermediate: "ルーティング・Next.js・スタイリング・フォームの 50 問",
    advanced: "パフォーマンス・テスト・アニメーションほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  aws: {
    beginner: "主要サービス・S3・IAM の基本 50 問",
    intermediate: "コンピュート・ネットワーク・DB・CLI/SDK の 50 問",
    advanced: "IaC・監視・セキュリティ・コスト・設計ほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  typescript: {
    beginner: "基本型・配列・文字列メソッドの基本 50 問",
    intermediate: "Object/JSON・非同期・クラス・コレクションの 50 問",
    advanced: "ユーティリティ型・型演算・DOM・ツールほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  java: {
    beginner: "基本構文・文字列・コレクションの基本 50 問",
    intermediate: "継承・例外・Stream・標準ライブラリの 50 問",
    advanced: "並行処理・入出力・日時・モダン Java ほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  git: {
    beginner: "基本操作・ブランチ・リモート同期の基本 50 問",
    intermediate: "履歴調査・取り消し・タグ・設定の 50 問",
    advanced: "履歴改変・内部構造・フックほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  docker: {
    beginner: "コンテナ操作・イメージ・Compose の基本 50 問",
    intermediate: "Kubernetes 基本・ワークロード・公開・配布の 50 問",
    advanced: "運用・セキュリティ・Helm・内部構造ほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  htmlcss: {
    beginner: "文書構造・フォーム・CSS 基本プロパティの 50 問",
    intermediate: "レイアウト・配色・属性・レスポンシブの 50 問",
    advanced: "アニメーション・セレクタ・モダン CSS ほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
  powershell: {
    beginner: "基本コマンドレット・パイプライン・構文の 50 問",
    intermediate: "システム管理・ネットワーク・データ処理の 50 問",
    advanced: "オブジェクト・ジョブ・リモート管理ほか 50 問",
    mix: "全 13 カテゴリ・150 問から出題(落下速度は中級相当)",
  },
};

const TAGLINE: Record<TrackId, string> = {
  linux:
    "落ちてくる Linux コマンドを、底に着く前にタイプして Enter。150 コマンドを遊びながら覚える。",
  sql: "落ちてくる SQL:2023 のキーワード・関数を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  python:
    "落ちてくる Python の関数・メソッドを、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  pyml: "落ちてくる Python 機械学習ライブラリの API を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  pyauto:
    "落ちてくる Python 業務自動化の API を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  r: "落ちてくる R の関数・パッケージを、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  react:
    "落ちてくる React / フロントエンドの API を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  aws: "落ちてくる AWS のサービス名・API を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  typescript:
    "落ちてくる TypeScript の構文・API を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  java: "落ちてくる Java の構文・API を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  git: "落ちてくる Git のコマンド・概念を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  docker:
    "落ちてくる Docker / Kubernetes の語彙を、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  htmlcss:
    "落ちてくる HTML タグ・CSS プロパティを、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
  powershell:
    "落ちてくる PowerShell コマンドレットを、底に着く前にタイプして Enter。150 語を遊びながら覚える。",
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
    <div className={`select track-${track}`}>
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
