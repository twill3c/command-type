import { questionsForPlay } from "./data";
import { mulberry32 } from "./rng";
import type { PlayLevel, Question, TrackId } from "./types";

/**
 * セッションの出題キューを生成する(F-02 / F-11 / F-14)。
 * 指定トラック・モードの母集団(レベル別 50、ミックスはトラック全件)を
 * Fisher–Yates でシャッフルし、先頭 count 件を返す。同一シードは同一順序を保証する。
 */
export function buildQueue(
  track: TrackId,
  level: PlayLevel,
  seed: number,
  count: number,
): Question[] {
  const pool = [...questionsForPlay(track, level)];
  const rng = mulberry32(seed);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
