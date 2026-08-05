import type { PlayLevel } from "./types";

/**
 * 保存先の抽象(F-12)。UI 層で localStorage を渡す。
 * core は Web API に直接依存しない(AGENTS §4)。
 */
export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

const keyFor = (level: PlayLevel) => `command-type:highscore:${level}`;

/** レベル別ハイスコア。未保存・壊れた値は 0。 */
export function loadHighScore(store: KeyValueStore, level: PlayLevel): number {
  const raw = store.get(keyFor(level));
  if (raw === null) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** 既存を上回ったときのみ保存する。更新したら true。 */
export function saveHighScore(
  store: KeyValueStore,
  level: PlayLevel,
  score: number,
): boolean {
  if (score <= loadHighScore(store, level)) return false;
  store.set(keyFor(level), String(score));
  return true;
}
