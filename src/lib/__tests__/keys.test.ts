import { describe, expect, it } from "vitest";
import { keyToAction } from "../keys";

describe("T-031: キー入力フィルタ(N-03: 半角英数のみ)", () => {
  it("Enter / Backspace はアクションになる", () => {
    expect(keyToAction("Enter")).toEqual({ type: "enter" });
    expect(keyToAction("Backspace")).toEqual({ type: "backspace" });
  });

  it("コマンド文字種(小文字英数と +._-)は char になる", () => {
    for (const ch of ["a", "z", "0", "9", "+", ".", "_", "-"]) {
      expect(keyToAction(ch)).toEqual({ type: "char", ch });
    }
  });

  it("大文字は小文字に正規化される", () => {
    expect(keyToAction("A")).toEqual({ type: "char", ch: "a" });
  });

  it("IME・制御キー・全角は拒否される", () => {
    for (const key of ["あ", "Process", "Shift", "Tab", " ", "ｌ", "漢"]) {
      expect(keyToAction(key), key).toBeNull();
    }
  });
});
