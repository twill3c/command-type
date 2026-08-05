import { FALL_BASE_MS, FALL_GROWTH_PER_CLEAR } from "./config";
import type { Level } from "./types";

/**
 * 現在の落下所要時間(ms)。クリア数に応じて漸増する速度の逆数(F-09)。
 * duration = base / (1 + growth * cleared)
 */
export function fallDurationMs(level: Level, cleared: number): number {
  return FALL_BASE_MS[level] / (1 + FALL_GROWTH_PER_CLEAR * cleared);
}

/** 高度(1 = 出現位置、0 = 底)を経過時間ぶん進める。0 で下限クランプ(F-06)。 */
export function updateAltitude(
  altitude: number,
  dtMs: number,
  durationMs: number,
): number {
  return Math.max(0, altitude - dtMs / durationMs);
}
