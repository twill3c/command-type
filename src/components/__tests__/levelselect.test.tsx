import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LevelSelect } from "../LevelSelect";

const noop = () => {};

function render(track: "linux" | "python" | "typescript"): string {
  return renderToStaticMarkup(
    <LevelSelect track={track} onTrackChange={noop} onSelect={noop} />,
  );
}

describe("T-032: トラック切替 UI(F-15)", () => {
  it("登録済みトラックのタブが datasets 由来で全件表示される", () => {
    const html = render("linux");
    expect(html).toContain("Linux");
    expect(html).toContain("Python");
    expect(html).toContain("TypeScript");
  });

  it("選択中トラックのタブに active が付く", () => {
    const html = render("python");
    expect(html).toMatch(/track-tab active[^>]*>[^<]*Python/);
  });

  it("トラックに応じた説明が表示される(python)", () => {
    const html = render("python");
    expect(html).toContain("組み込み関数");
    expect(html).not.toContain("ナビゲーション");
  });

  it("トラックに応じた説明が表示される(typescript)", () => {
    const html = render("typescript");
    expect(html).toContain("基本型");
    expect(html).not.toContain("ナビゲーション");
  });

  it("レベル 4 モード(初級・中級・上級・ミックス)のカードが出る", () => {
    const html = render("typescript");
    for (const label of ["初級", "中級", "上級", "ミックス"]) {
      expect(html).toContain(label);
    }
  });

  it("T-035: グループ見出し(§1)が描画される", () => {
    const html = render("linux");
    for (const label of [
      "インフラ・OS",
      "データ・分析",
      "Web・フロントエンド",
      "バックエンド・AI",
    ]) {
      expect(html).toContain(label);
    }
  });
});
