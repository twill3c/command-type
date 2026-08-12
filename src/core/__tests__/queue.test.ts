import { describe, expect, it } from "vitest";
import { categoriesFor, datasets } from "../data";
import { buildQueue } from "../queue";

describe("T-010: シード付き出題キュー(F-11)", () => {
  it("同一シードで同一順序", () => {
    const a = buildQueue("linux", "beginner", 42, 20);
    const b = buildQueue("linux", "beginner", 42, 20);
    expect(a.map((q) => q.cmd)).toEqual(b.map((q) => q.cmd));
  });

  it("異なるシードで順序が変わる(50C20 の空間で衝突しない前提の代表 2 シード)", () => {
    const a = buildQueue("linux", "beginner", 1, 20);
    const b = buildQueue("linux", "beginner", 2, 20);
    expect(a.map((q) => q.cmd)).not.toEqual(b.map((q) => q.cmd));
  });

  it("長さ 20・セッション内重複なし", () => {
    const q = buildQueue("linux", "intermediate", 7, 20);
    expect(q).toHaveLength(20);
    expect(new Set(q.map((x) => x.cmd)).size).toBe(20);
  });

  it("母集団(50件)を超える要求は母集団サイズに切り詰める", () => {
    const q = buildQueue("linux", "advanced", 7, 999);
    expect(q).toHaveLength(50);
    expect(new Set(q.map((x) => x.cmd)).size).toBe(50);
  });
});

describe("T-020: ミックスモードの出題キュー(F-14)", () => {
  it("母集団は選択中トラックの全件・重複なし", () => {
    const total = datasets.get("linux")!.commands.length;
    const q = buildQueue("linux", "mix", 5, 999);
    expect(q).toHaveLength(total);
    expect(new Set(q.map((x) => x.cmd)).size).toBe(total);
  });

  it("3 レベルすべてのカテゴリが出現し得る", () => {
    const q = buildQueue("linux", "mix", 5, 150);
    const levels = new Set(q.map((x) => x.level));
    expect(levels).toEqual(new Set(["beginner", "intermediate", "advanced"]));
  });

  it("同一シードで再現する", () => {
    const a = buildQueue("linux", "mix", 11, 20).map((x) => x.cmd);
    const b = buildQueue("linux", "mix", 11, 20).map((x) => x.cmd);
    expect(a).toEqual(b);
  });
});

describe("T-011: トラック×レベル→カテゴリのフィルタ(F-02)", () => {
  const tracks = [...datasets.keys()];
  const levels = ["beginner", "intermediate", "advanced"] as const;
  const cases = tracks.flatMap((track) =>
    levels.map((level) => ({ track, level })),
  );

  it.each(cases)(
    "$track / $level のキューは該当トラック・レベルのカテゴリのみ",
    ({ track, level }) => {
      const categories = categoriesFor(track);
      const q = buildQueue(track, level, 123, 50);
      expect(q.length).toBeGreaterThan(0);
      for (const item of q) {
        // 該当トラックのカテゴリ定義に存在し、レベルが一致する(他トラック混入なし)
        expect(categories.get(item.categoryId)?.level).toBe(level);
      }
    },
  );
});
