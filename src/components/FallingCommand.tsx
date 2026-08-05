import { matchInput } from "@/core/match";
import type { Question } from "@/core/types";

/**
 * 落下中の出題(F-03): コマンド・解説文・カテゴリ名の 3 点セット。
 * 高度(1 → 0)を top 位置に写像し、25% 未満で danger 表示(SPEC §7)。
 * 純粋な表示コンポーネント — 状態遷移は core/session が持つ。
 */
export function FallingCommand({
  question,
  input,
  altitude,
}: {
  question: Question;
  input: string;
  altitude: number;
}) {
  const m = matchInput(question.cmd, input);
  const typed = question.cmd.slice(0, m.matchedLength);
  const rest = question.cmd.slice(m.matchedLength);
  const danger = altitude < 0.25;

  return (
    <div
      className={danger ? "falling danger" : "falling"}
      style={{ top: `${(1 - altitude) * 100}%` }}
    >
      <span className={`badge badge-${question.level}`}>
        {question.categoryName}
      </span>
      <div className="falling-cmd">
        <span className="cmd-typed">{typed}</span>
        <span className="cmd-rest">{rest}</span>
      </div>
      <p className="falling-desc">{question.desc}</p>
    </div>
  );
}
