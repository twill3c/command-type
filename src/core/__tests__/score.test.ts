import { describe, expect, it } from "vitest";
import {
  SCORE_ALTITUDE_MAX,
  SCORE_BASE,
  SCORE_COMBO_CAP,
  SCORE_COMBO_STEP,
} from "../config";
import { clearScore } from "../score";

describe("T-016: スコア算式(F-08)", () => {
  // 算式: base + round(altitude * altitudeMax) + min(combo, cap) * comboStep
  // combo は「このクリアの直前までの連続クリア数」

  it("最速クリア(高度 1・コンボ 0)= base + altitudeMax", () => {
    expect(clearScore(1, 0)).toBe(SCORE_BASE + SCORE_ALTITUDE_MAX);
  });

  it("高度 0.5・コンボ 3 の合成", () => {
    expect(clearScore(0.5, 3)).toBe(
      SCORE_BASE + Math.round(0.5 * SCORE_ALTITUDE_MAX) + 3 * SCORE_COMBO_STEP,
    );
  });

  it("ギリギリクリア(高度 0)でも base は入る", () => {
    expect(clearScore(0, 0)).toBe(SCORE_BASE);
  });

  it("コンボボーナスは cap で頭打ち", () => {
    expect(clearScore(0, SCORE_COMBO_CAP + 5)).toBe(
      SCORE_BASE + SCORE_COMBO_CAP * SCORE_COMBO_STEP,
    );
  });
});
