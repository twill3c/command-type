import type { PlayLevel, TrackId } from "./types";

/**
 * 保存先の抽象(F-12)。UI 層で localStorage を渡す。
 * core は Web API に直接依存しない(AGENTS §4)。
 */
export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

const keyFor = (track: TrackId, level: PlayLevel) =>
  `command-type:highscore:${track}:${level}`;

/** トラック導入(P7)前のキー。linux の値として読み継ぐ(F-12)。 */
const legacyKeyFor = (level: PlayLevel) => `command-type:highscore:${level}`;

function parseScore(raw: string | null): number {
  if (raw === null) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** トラック×モード別ハイスコア。未保存・壊れた値は 0。 */
export function loadHighScore(
  store: KeyValueStore,
  track: TrackId,
  level: PlayLevel,
): number {
  const raw = store.get(keyFor(track, level));
  if (raw === null && track === "linux") {
    return parseScore(store.get(legacyKeyFor(level)));
  }
  return parseScore(raw);
}

/** 既存(旧キー含む)を上回ったときのみ新キーへ保存する。更新したら true。 */
export function saveHighScore(
  store: KeyValueStore,
  track: TrackId,
  level: PlayLevel,
  score: number,
): boolean {
  if (score <= loadHighScore(store, track, level)) return false;
  store.set(keyFor(track, level), String(score));
  return true;
}
