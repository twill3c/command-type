import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Footer } from "../Footer";

describe("T-034: ライセンス表記フッター(F-16)", () => {
  const html = renderToStaticMarkup(<Footer />);

  it("統一書式「MIT License © 2026 坂田哲朗 ・ GitHub」で表示する", () => {
    const text = html.replace(/<[^>]+>/g, "");
    expect(text).toContain("MIT License");
    expect(text).toContain("© 2026 坂田哲朗 ・ GitHub");
  });

  it("LICENSE へのリンクがある", () => {
    expect(html).toMatch(
      /href="https:\/\/github\.com\/twill3c\/command-type\/blob\/main\/LICENSE"/,
    );
  });
});
