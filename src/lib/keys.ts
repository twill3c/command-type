/**
 * キーボードイベントをゲーム操作へ変換する(N-03)。
 * 出題文字種([A-Za-z0-9+._-])のみ受け付け、IME 由来のキー("Process"、
 * 全角文字などの複数文字/範囲外キー)は null で無視する。
 * 大文字小文字は区別し、打鍵どおりに保持する(N-03: `Promise.all` 等の大文字対応)。
 */
export type KeyAction =
  | { type: "char"; ch: string }
  | { type: "backspace" }
  | { type: "enter" };

export function keyToAction(key: string): KeyAction | null {
  if (key === "Enter") return { type: "enter" };
  if (key === "Backspace") return { type: "backspace" };
  if (/^[a-zA-Z0-9+._-]$/.test(key)) {
    return { type: "char", ch: key };
  }
  return null;
}
