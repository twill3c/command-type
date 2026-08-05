import {
  SCORE_ALTITUDE_MAX,
  SCORE_BASE,
  SCORE_COMBO_CAP,
  SCORE_COMBO_STEP,
} from "./config";

/**
 * クリア 1 回の得点(F-08)。
 * 基礎点 + 残り高度ボーナス(速く打つほど高い)+ コンボボーナス(cap で頭打ち)。
 * combo は「このクリアの直前までの連続クリア数」。
 */
export function clearScore(altitude: number, combo: number): number {
  return (
    SCORE_BASE +
    Math.round(altitude * SCORE_ALTITUDE_MAX) +
    Math.min(combo, SCORE_COMBO_CAP) * SCORE_COMBO_STEP
  );
}
