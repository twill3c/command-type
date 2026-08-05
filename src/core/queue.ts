import { questionsForLevel } from "./data";
import { mulberry32 } from "./rng";
import type { Level, Question } from "./types";

/**
 * セッションの出題キューを生成する(F-02 / F-11)。
 * 指定レベルの母集団を Fisher–Yates でシャッフルし、先頭 count 件を返す。
 * 同一シードは同一順序を保証する(テスト再現性)。
 */
export function buildQueue(level: Level, seed: number, count: number): Question[] {
  const pool = [...questionsForLevel(level)];
  const rng = mulberry32(seed);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
