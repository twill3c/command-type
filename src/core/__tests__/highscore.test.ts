import { describe, expect, it } from "vitest";
import { loadHighScore, saveHighScore } from "../highscore";
import type { KeyValueStore } from "../highscore";

function fakeStore(): KeyValueStore & { dump(): Map<string, string> } {
  const m = new Map<string, string>();
  return {
    get: (k) => m.get(k) ?? null,
    set: (k, v) => void m.set(k, v),
    dump: () => m,
  };
}

describe("T-019: ハイスコア(F-12)", () => {
  it("未保存はレベルによらず 0", () => {
    const store = fakeStore();
    expect(loadHighScore(store, "beginner")).toBe(0);
    expect(loadHighScore(store, "advanced")).toBe(0);
  });

  it("上回ったときのみ更新される", () => {
    const store = fakeStore();
    expect(saveHighScore(store, "beginner", 100)).toBe(true);
    expect(saveHighScore(store, "beginner", 50)).toBe(false);
    expect(loadHighScore(store, "beginner")).toBe(100);
    expect(saveHighScore(store, "beginner", 120)).toBe(true);
    expect(loadHighScore(store, "beginner")).toBe(120);
  });

  it("レベル別に独立して保存される", () => {
    const store = fakeStore();
    saveHighScore(store, "beginner", 100);
    saveHighScore(store, "advanced", 200);
    expect(loadHighScore(store, "beginner")).toBe(100);
    expect(loadHighScore(store, "advanced")).toBe(200);
  });

  it("壊れた保存値は 0 として扱う", () => {
    const store = fakeStore();
    store.set("command-type:highscore:beginner", "not-a-number");
    expect(loadHighScore(store, "beginner")).toBe(0);
  });
});
