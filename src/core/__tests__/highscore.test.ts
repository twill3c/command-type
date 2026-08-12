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
  it("未保存はトラック・レベルによらず 0", () => {
    const store = fakeStore();
    expect(loadHighScore(store, "linux", "beginner")).toBe(0);
    expect(loadHighScore(store, "python", "advanced")).toBe(0);
  });

  it("上回ったときのみ更新される", () => {
    const store = fakeStore();
    expect(saveHighScore(store, "linux", "beginner", 100)).toBe(true);
    expect(saveHighScore(store, "linux", "beginner", 50)).toBe(false);
    expect(loadHighScore(store, "linux", "beginner")).toBe(100);
    expect(saveHighScore(store, "linux", "beginner", 120)).toBe(true);
    expect(loadHighScore(store, "linux", "beginner")).toBe(120);
  });

  it("トラック×レベル別に独立して保存される", () => {
    const store = fakeStore();
    saveHighScore(store, "linux", "beginner", 100);
    saveHighScore(store, "python", "beginner", 200);
    saveHighScore(store, "typescript", "advanced", 300);
    expect(loadHighScore(store, "linux", "beginner")).toBe(100);
    expect(loadHighScore(store, "python", "beginner")).toBe(200);
    expect(loadHighScore(store, "typescript", "advanced")).toBe(300);
    expect(loadHighScore(store, "typescript", "beginner")).toBe(0);
  });

  it("T-021: ミックスは 3 レベルと独立に保存される(F-14)", () => {
    const store = fakeStore();
    saveHighScore(store, "linux", "mix", 300);
    expect(loadHighScore(store, "linux", "mix")).toBe(300);
    expect(loadHighScore(store, "linux", "beginner")).toBe(0);
    expect(loadHighScore(store, "linux", "intermediate")).toBe(0);
    expect(loadHighScore(store, "linux", "advanced")).toBe(0);
  });

  it("壊れた保存値は 0 として扱う", () => {
    const store = fakeStore();
    store.set("command-type:highscore:linux:beginner", "not-a-number");
    expect(loadHighScore(store, "linux", "beginner")).toBe(0);
  });

  describe("旧キーの読み継ぎ(F-12: トラック導入前は linux の値)", () => {
    it("新キーが無ければ旧キー(モードのみ)を linux として読む", () => {
      const store = fakeStore();
      store.set("command-type:highscore:beginner", "80");
      expect(loadHighScore(store, "linux", "beginner")).toBe(80);
      // linux 以外のトラックには波及しない
      expect(loadHighScore(store, "python", "beginner")).toBe(0);
      expect(loadHighScore(store, "typescript", "beginner")).toBe(0);
    });

    it("新キーがあれば旧キーより優先される", () => {
      const store = fakeStore();
      store.set("command-type:highscore:beginner", "80");
      store.set("command-type:highscore:linux:beginner", "60");
      expect(loadHighScore(store, "linux", "beginner")).toBe(60);
    });

    it("保存の比較にも旧キーの値が効く(下回る保存は拒否)", () => {
      const store = fakeStore();
      store.set("command-type:highscore:beginner", "80");
      expect(saveHighScore(store, "linux", "beginner", 50)).toBe(false);
      expect(saveHighScore(store, "linux", "beginner", 90)).toBe(true);
      expect(loadHighScore(store, "linux", "beginner")).toBe(90);
      // 旧キーは書き換えない(新キーへ保存する)
      expect(store.dump().get("command-type:highscore:beginner")).toBe("80");
    });
  });
});
