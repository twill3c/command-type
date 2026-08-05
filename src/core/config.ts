import type { Level } from "./types";

/** セッション定数(SPEC F-07)。 */
export const SESSION_QUESTIONS = 20;
export const SESSION_LIVES = 3;

/** 落下: レベル別の基準落下時間(ms)。上級ほど速い(SPEC F-09)。 */
export const FALL_BASE_MS: Record<Level, number> = {
  beginner: 14000,
  intermediate: 11000,
  advanced: 8000,
};

/** 落下: クリア 1 回ごとの速度上昇率(SPEC F-09)。 */
export const FALL_GROWTH_PER_CLEAR = 0.06;

/** スコア算式の定数(SPEC F-08)。 */
export const SCORE_BASE = 100;
export const SCORE_ALTITUDE_MAX = 100;
export const SCORE_COMBO_STEP = 10;
export const SCORE_COMBO_CAP = 10;
