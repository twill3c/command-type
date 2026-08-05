/**
 * キーボードイベントをゲーム操作へ変換する(N-03)。
 * コマンド文字種([a-z0-9+._-])のみ受け付け、IME 由来のキー("Process"、
 * 全角文字などの複数文字/範囲外キー)は null で無視する。
 * 大文字は小文字へ正規化する(コマンドはすべて小文字 — T-005)。
 */
export type KeyAction =
  | { type: "char"; ch: string }
  | { type: "backspace" }
  | { type: "enter" };

export function keyToAction(key: string): KeyAction | null {
  if (key === "Enter") return { type: "enter" };
  if (key === "Backspace") return { type: "backspace" };
  if (/^[a-zA-Z0-9+._-]$/.test(key)) {
    return { type: "char", ch: key.toLowerCase() };
  }
  return null;
}
