import { describe, expect, it } from "vitest";
import {
  categoriesFor,
  datasets,
  questionsForLevel,
  resolveQuestions,
} from "../data";
import type { Level, TrackId } from "../types";

/**
 * 期待値の正は SPEC §4 のトラック別表(データから導出しない — 前提検算)。
 * トラックを追加したら、この期待表にも §4 の表を書き写すこと(T-001〜T-007 が
 * 登録済み全トラックへ自動適用される)。
 */
interface TrackExpectation {
  total: number;
  charset: RegExp;
  categories: Record<string, { level: Level; count: number }>;
}

const TRACK_EXPECTATIONS: Record<TrackId, TrackExpectation | undefined> = {
  linux: {
    total: 150,
    charset: /^[a-z0-9+._-]+$/,
    categories: {
      "nav-basic": { level: "beginner", count: 18 },
      "text-edit": { level: "beginner", count: 17 },
      "perm-user": { level: "beginner", count: 15 },
      "sysinfo-proc": { level: "intermediate", count: 14 },
      "archive-transfer": { level: "intermediate", count: 12 },
      "network-comm": { level: "intermediate", count: 12 },
      "pkg-env": { level: "intermediate", count: 12 },
      "adv-file-disk": { level: "advanced", count: 9 },
      "perf-analysis": { level: "advanced", count: 9 },
      "adv-net-diag": { level: "advanced", count: 8 },
      "term-bg": { level: "advanced", count: 8 },
      "security-crypto": { level: "advanced", count: 8 },
      "dev-debug": { level: "advanced", count: 8 },
    },
  },
  python: undefined, // P5(loop_015)で §4.2 の表を書き写す
  typescript: undefined, // P6(loop_016)で §4.3 の表を書き写す
};

const availableTracks = [...datasets.keys()];

it("登録済みの全トラックに期待表がある(§4 との対応漏れ検知)", () => {
  for (const track of availableTracks) {
    expect(TRACK_EXPECTATIONS[track], `${track} の期待表`).toBeDefined();
  }
});

// 前提検算: 期待表自体が「合計 total・各レベル 50」を満たすことを検算してから使う
describe.each(availableTracks)("前提検算(%s)", (track) => {
  const exp = TRACK_EXPECTATIONS[track]!;
  const sumOf = (level: Level) =>
    Object.values(exp.categories)
      .filter((v) => v.level === level)
      .reduce((a, v) => a + v.count, 0);

  it("期待表の合計が total、各レベル 50 である", () => {
    expect(sumOf("beginner") + sumOf("intermediate") + sumOf("advanced")).toBe(
      exp.total,
    );
    expect(sumOf("beginner")).toBe(50);
    expect(sumOf("intermediate")).toBe(50);
    expect(sumOf("advanced")).toBe(50);
  });
});

describe.each(availableTracks)("データ検証(%s)", (track) => {
  const exp = TRACK_EXPECTATIONS[track]!;
  const dataset = datasets.get(track)!;
  const categories = categoriesFor(track);

  describe("T-001: 件数", () => {
    it(`commands は ${exp.total} 件ちょうど`, () => {
      expect(dataset.commands).toHaveLength(exp.total);
    });
  });

  describe("T-002: レベル別件数", () => {
    it.each(["beginner", "intermediate", "advanced"] as const)(
      "%s は 50 件",
      (level) => {
        expect(questionsForLevel(track, level)).toHaveLength(50);
      },
    );
  });

  describe("T-003: カテゴリ別件数が SPEC §4 と完全一致", () => {
    it("カテゴリ集合が期待表と一致する", () => {
      expect(dataset.categories.map((c) => c.id).sort()).toEqual(
        Object.keys(exp.categories).sort(),
      );
    });

    it.each(Object.entries(exp.categories))(
      "%s の件数とレベル",
      (id, expected) => {
        const actual = dataset.commands.filter((c) => c.category === id);
        expect(actual).toHaveLength(expected.count);
        expect(categories.get(id)?.level).toBe(expected.level);
      },
    );
  });

  describe("T-004: cmd の一意性(トラック内)", () => {
    it("重複 0 件", () => {
      const seen = new Set(dataset.commands.map((c) => c.cmd));
      expect(seen.size).toBe(dataset.commands.length);
    });
  });

  describe("T-005: cmd の文字種(トラック別 charset)", () => {
    it(`全件が ${exp.charset} に一致`, () => {
      for (const c of dataset.commands) {
        expect(c.cmd).toMatch(exp.charset);
      }
    });
  });

  describe("T-006: desc の長さ", () => {
    it("全件 8〜40 文字", () => {
      for (const c of dataset.commands) {
        expect(c.desc.length, `${c.cmd}: ${c.desc}`).toBeGreaterThanOrEqual(8);
        expect(c.desc.length, `${c.cmd}: ${c.desc}`).toBeLessThanOrEqual(40);
      }
    });
  });

  describe("T-007: 参照整合", () => {
    it("track id がキーと一致する", () => {
      expect(dataset.track.id).toBe(track);
    });

    it("全件が定義済みカテゴリ id を指す", () => {
      for (const c of dataset.commands) {
        expect(categories.has(c.category), c.cmd).toBe(true);
      }
    });
  });
});

describe("T-007: 未定義の参照はエラー", () => {
  it("未定義カテゴリの解決は即時エラーになる", () => {
    const bad = [
      { cmd: "ls", desc: "ダミーの説明ダミーの説明", category: "no-such" },
    ];
    expect(() => resolveQuestions(bad, categoriesFor("linux"))).toThrow(
      /未定義カテゴリ/,
    );
  });

  it("未登録トラックの参照は即時エラーになる", () => {
    expect(() => categoriesFor("no-such" as TrackId)).toThrow(/未登録トラック/);
  });
});
