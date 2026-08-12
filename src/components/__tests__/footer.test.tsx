import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Footer } from "../Footer";

describe("T-034: ライセンス表記フッター(F-16)", () => {
  const html = renderToStaticMarkup(<Footer />);

  it("MIT License の明示と著作権者名がある", () => {
    expect(html).toContain("MIT License");
    expect(html).toContain("坂田哲朗");
  });

  it("LICENSE へのリンクがある", () => {
    expect(html).toMatch(
      /href="https:\/\/github\.com\/twill3c\/command-type\/blob\/main\/LICENSE"/,
    );
  });
});
