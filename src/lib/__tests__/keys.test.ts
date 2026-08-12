import { describe, expect, it } from "vitest";
import { keyToAction } from "../keys";

describe("T-031: キー入力フィルタ(N-03: 半角英数記号のみ・大文字小文字区別)", () => {
  it("Enter / Backspace はアクションになる", () => {
    expect(keyToAction("Enter")).toEqual({ type: "enter" });
    expect(keyToAction("Backspace")).toEqual({ type: "backspace" });
  });

  it("出題文字種(英数と +._/-)は char になる", () => {
    for (const ch of ["a", "z", "0", "9", "+", ".", "_", "-", "/"]) {
      expect(keyToAction(ch)).toEqual({ type: "char", ch });
    }
  });

  it("大文字はそのまま保持される(N-03: 大文字小文字を区別)", () => {
    for (const ch of ["A", "P", "Z"]) {
      expect(keyToAction(ch)).toEqual({ type: "char", ch });
    }
  });

  it("IME・制御キー・全角は拒否される", () => {
    for (const key of ["あ", "Process", "Shift", "Tab", " ", "ｌ", "漢"]) {
      expect(keyToAction(key), key).toBeNull();
    }
  });
});
