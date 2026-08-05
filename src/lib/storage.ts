import type { KeyValueStore } from "@/core/highscore";

/** localStorage を KeyValueStore に適合させる(F-12)。失敗時は静かに無視する。 */
export function browserStore(): KeyValueStore {
  return {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        /* プライベートモード等では保存しない */
      }
    },
  };
}
