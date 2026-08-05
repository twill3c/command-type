import { describe, expect, it } from "vitest";
import { FALL_BASE_MS, FALL_GROWTH_PER_CLEAR } from "../config";
import { fallDurationMs, updateAltitude } from "../fall";

describe("T-015: 落下速度の漸増(F-09)", () => {
  // 前提検算: 算式は duration = base / (1 + growth * cleared)。
  // growth > 0 である限り cleared について単調減少になる — この前提自体を先に確認する
  it("前提検算: growth は正", () => {
    expect(FALL_GROWTH_PER_CLEAR).toBeGreaterThan(0);
  });

  it("クリア 0 はレベル基準値そのもの", () => {
    expect(fallDurationMs("beginner", 0)).toBe(FALL_BASE_MS.beginner);
    expect(fallDurationMs("advanced", 0)).toBe(FALL_BASE_MS.advanced);
  });

  it("算式どおり: base / (1 + growth * cleared)", () => {
    const expected =
      FALL_BASE_MS.intermediate / (1 + FALL_GROWTH_PER_CLEAR * 7);
    expect(fallDurationMs("intermediate", 7)).toBeCloseTo(expected, 10);
  });

  it("クリア数が増えると落下時間は単調減少", () => {
    for (let n = 0; n < 19; n++) {
      expect(fallDurationMs("beginner", n + 1)).toBeLessThan(
        fallDurationMs("beginner", n),
      );
    }
  });

  it("レベル基準: 上級ほど速い(基準値が小さい)", () => {
    expect(FALL_BASE_MS.advanced).toBeLessThan(FALL_BASE_MS.intermediate);
    expect(FALL_BASE_MS.intermediate).toBeLessThan(FALL_BASE_MS.beginner);
  });
});

describe("T-014 補助: 高度更新(F-06)", () => {
  it("経過時間ぶんだけ比例して下がる", () => {
    expect(updateAltitude(1, 5000, 10000)).toBeCloseTo(0.5, 10);
  });

  it("0 で下限クランプ(負にならない)", () => {
    expect(updateAltitude(0.1, 5000, 10000)).toBe(0);
  });
});
