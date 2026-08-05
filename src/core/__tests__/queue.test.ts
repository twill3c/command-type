import { describe, expect, it } from "vitest";
import { categoriesById } from "../data";
import { buildQueue } from "../queue";

describe("T-010: シード付き出題キュー(F-11)", () => {
  it("同一シードで同一順序", () => {
    const a = buildQueue("beginner", 42, 20);
    const b = buildQueue("beginner", 42, 20);
    expect(a.map((q) => q.cmd)).toEqual(b.map((q) => q.cmd));
  });

  it("異なるシードで順序が変わる(50C20 の空間で衝突しない前提の代表 2 シード)", () => {
    const a = buildQueue("beginner", 1, 20);
    const b = buildQueue("beginner", 2, 20);
    expect(a.map((q) => q.cmd)).not.toEqual(b.map((q) => q.cmd));
  });

  it("長さ 20・セッション内重複なし", () => {
    const q = buildQueue("intermediate", 7, 20);
    expect(q).toHaveLength(20);
    expect(new Set(q.map((x) => x.cmd)).size).toBe(20);
  });

  it("母集団(50件)を超える要求は母集団サイズに切り詰める", () => {
    const q = buildQueue("advanced", 7, 999);
    expect(q).toHaveLength(50);
    expect(new Set(q.map((x) => x.cmd)).size).toBe(50);
  });
});

describe("T-011: レベル→カテゴリのフィルタ(F-02)", () => {
  it.each(["beginner", "intermediate", "advanced"] as const)(
    "%s のキューは該当レベルのカテゴリのみ",
    (level) => {
      const q = buildQueue(level, 123, 50);
      for (const item of q) {
        expect(categoriesById.get(item.categoryId)?.level).toBe(level);
      }
    },
  );
});
