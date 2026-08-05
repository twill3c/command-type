"use client";

import { summarize } from "@/core/results";
import type { SessionState } from "@/core/session";
import type { Level } from "@/core/types";

const LEVEL_LABEL: Record<Level, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

/** 結果画面(F-10)。スコア・正確率・CPM と、復習用のミス一覧を表示する。 */
export function ResultScreen({
  state,
  newRecord,
  onRetry,
  onBack,
}: {
  state: SessionState;
  newRecord: boolean;
  onRetry: () => void;
  onBack: () => void;
}) {
  const sum = summarize(state);
  const accuracyPct = Math.round(sum.accuracy * 1000) / 10;

  return (
    <div className="result">
      <h1 className="title">
        <span className="prompt">&gt;</span> リザルト —{" "}
        {LEVEL_LABEL[state.level]}
      </h1>

      <div className="result-cards">
        <div className="result-card">
          <span className="result-label">スコア</span>
          <strong className="result-value">{sum.score}</strong>
          {newRecord && <span className="new-record">NEW RECORD!</span>}
        </div>
        <div className="result-card">
          <span className="result-label">クリア</span>
          <strong className="result-value">
            {sum.cleared} / {sum.total}
          </strong>
        </div>
        <div className="result-card">
          <span className="result-label">正確率</span>
          <strong className="result-value">{accuracyPct}%</strong>
        </div>
        <div className="result-card">
          <span className="result-label">CPM</span>
          <strong className="result-value">{Math.round(sum.cpm)}</strong>
        </div>
      </div>

      {sum.missed.length > 0 && (
        <section className="review">
          <h2 className="review-title">復習しよう({sum.missed.length} 件)</h2>
          <ul className="review-list">
            {sum.missed.map((r) => (
              <li key={r.question.cmd} className="review-item">
                <code className="review-cmd">{r.question.cmd}</code>
                <span className="review-desc">
                  {r.question.desc}
                  <span className="review-cat">
                    ({r.question.categoryName})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="result-actions">
        <button className="btn btn-primary" onClick={onRetry}>
          もう一度
        </button>
        <button className="btn" onClick={onBack}>
          レベル選択へ
        </button>
      </div>
    </div>
  );
}
