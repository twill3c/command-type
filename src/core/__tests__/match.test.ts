import { describe, expect, it } from "vitest";
import { matchInput } from "../match";

describe("T-012: 入力照合(F-04)", () => {
  it("空入力: 一致 0・ミスなし・未完", () => {
    expect(matchInput("grep", "")).toEqual({
      matchedLength: 0,
      missIndex: null,
      complete: false,
    });
  });

  it("部分一致(正しい途中入力)", () => {
    expect(matchInput("grep", "gr")).toEqual({
      matchedLength: 2,
      missIndex: null,
      complete: false,
    });
  });

  it("1 文字ミス: 最初の不一致位置を返す", () => {
    expect(matchInput("grep", "gx")).toEqual({
      matchedLength: 1,
      missIndex: 1,
      complete: false,
    });
  });

  it("完全一致", () => {
    expect(matchInput("grep", "grep")).toEqual({
      matchedLength: 4,
      missIndex: null,
      complete: true,
    });
  });

  it("打ち過ぎ(target より長い): 超過位置がミス", () => {
    expect(matchInput("grep", "grepx")).toEqual({
      matchedLength: 4,
      missIndex: 4,
      complete: false,
    });
  });

  it("先頭からミス", () => {
    expect(matchInput("grep", "x")).toEqual({
      matchedLength: 0,
      missIndex: 0,
      complete: false,
    });
  });
});
