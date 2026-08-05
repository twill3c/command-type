import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FallingCommand } from "../FallingCommand";
import type { Question } from "@/core/types";

const q: Question = {
  cmd: "grep",
  desc: "パターンに一致する行を検索する",
  categoryId: "text-edit",
  categoryName: "テキスト処理・ファイル編集",
  level: "beginner",
};

describe("T-030: 落下表示(F-03)", () => {
  it("cmd・解説文・カテゴリ名の 3 点が揃って描画される", () => {
    const html = renderToStaticMarkup(
      <FallingCommand question={q} input="" altitude={1} />,
    );
    expect(html).toContain("grep");
    expect(html).toContain("パターンに一致する行を検索する");
    expect(html).toContain("テキスト処理・ファイル編集");
  });

  it("入力済みの一致部分が typed 表示に分割される(F-04)", () => {
    const html = renderToStaticMarkup(
      <FallingCommand question={q} input="gr" altitude={0.8} />,
    );
    expect(html).toContain(">gr</span>");
    expect(html).toContain(">ep</span>");
  });

  it("残り高度 25% 未満で danger 表示になる(SPEC §7)", () => {
    const safe = renderToStaticMarkup(
      <FallingCommand question={q} input="" altitude={0.5} />,
    );
    const danger = renderToStaticMarkup(
      <FallingCommand question={q} input="" altitude={0.2} />,
    );
    expect(safe).not.toContain("danger");
    expect(danger).toContain("danger");
  });

  it("高度が top 位置に反映される", () => {
    const html = renderToStaticMarkup(
      <FallingCommand question={q} input="" altitude={0.75} />,
    );
    expect(html).toContain("top:25%");
  });
});
