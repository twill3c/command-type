import { describe, expect, it } from "vitest";
import {
  backspace,
  currentQuestion,
  pressEnter,
  startSession,
  tick,
  typeChar,
} from "../session";
import type { SessionState } from "../session";
import { summarize } from "../results";

const SEED = 7;

function typeString(state: SessionState, s: string): SessionState {
  return [...s].reduce((st, ch) => typeChar(st, ch), state);
}

describe("T-018: 結果集計(F-10)", () => {
  it("正確率: 正打鍵 / 総打鍵(前提検算: 期待値を計数から明示的に導出)", () => {
    const s0 = startSession("linux", "beginner", SEED);
    const target = currentQuestion(s0)!.cmd;
    // 打鍵列: 誤打 1(空白は cmd 文字種に現れない)→ 不一致 Enter → Backspace →
    // 正打 len でクリア。Backspace は打鍵数に数えないため、
    // 期待正確率 = len / (len + 1)
    let s = typeChar(s0, " ");
    s = pressEnter(s); // 不一致 Enter(F-05: 入力保持・ミス記録)
    s = backspace(s);
    s = pressEnter(typeString(s, target));
    const sum = summarize(s);
    const expectedTotal = 1 + target.length;
    expect(sum.accuracy).toBeCloseTo(target.length / expectedTotal, 10);
    expect(sum.cleared).toBe(1);
    // Enter ミスを含む出題は、クリアできていても復習対象として missed に載る
    expect(sum.missed.map((m) => m.question.cmd)).toContain(target);
  });

  it("CPM: 正打鍵 / 経過分(前提検算: 経過 12 秒 = 0.2 分を tick で注入)", () => {
    const s0 = startSession("linux", "beginner", SEED);
    const target = currentQuestion(s0)!.cmd;
    let s = tick(s0, 6000);
    s = tick(s, 6000); // 経過 12000ms(落下途中 — beginner 基準未満で落下しない)
    s = pressEnter(typeString(s, target));
    const sum = summarize(s);
    expect(sum.cpm).toBeCloseTo(target.length / (12000 / 60000), 6);
  });

  it("打鍵ゼロ・経過ゼロの既定値(正確率 1・CPM 0)", () => {
    const sum = summarize(startSession("linux", "beginner", SEED));
    expect(sum.accuracy).toBe(1);
    expect(sum.cpm).toBe(0);
  });

  it("全出題一覧: クリアも含め出題順で attempted に載る(F-10)", () => {
    const s0 = startSession("linux", "beginner", SEED);
    const first = currentQuestion(s0)!.cmd;
    let s = pressEnter(typeString(s0, first)); // 1 問目クリア
    const second = currentQuestion(s)!.cmd;
    s = pressEnter(typeString(s, second)); // 2 問目クリア
    s = tick(s, 60000); // 3 問目は落下
    const sum = summarize(s);
    expect(sum.attempted.map((r) => r.question.cmd)).toEqual([
      first,
      second,
      expect.any(String),
    ]);
    expect(sum.attempted.map((r) => r.outcome)).toEqual([
      "cleared",
      "cleared",
      "dropped",
    ]);
    // missed は attempted の部分集合(落下 1 件のみ)
    expect(sum.missed).toHaveLength(1);
    expect(sum.missed[0].outcome).toBe("dropped");
  });

  it("ミス一覧: 落下した出題が missed に載る", () => {
    const s0 = startSession("linux", "beginner", SEED);
    const dropped = tick(s0, 60000); // 基準値超の経過で確実に落下
    const sum = summarize(dropped);
    expect(sum.missed.map((m) => m.question.cmd)).toContain(
      currentQuestion(s0)!.cmd,
    );
  });
});
