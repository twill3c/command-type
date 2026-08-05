import { describe, expect, it } from "vitest";
import {
  categoriesById,
  dataset,
  questionsForLevel,
  resolveQuestions,
} from "../data";
import type { Level } from "../types";

// 期待値の正は SPEC §4 の表(データから導出しない — 前提検算)
const EXPECTED_CATEGORY_COUNTS: Record<string, { level: Level; count: number }> = {
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
};

// 前提検算: SPEC §4 の表自体が「合計 150・各レベル 50」を満たすことを検算してから使う
const sumOf = (level: Level) =>
  Object.values(EXPECTED_CATEGORY_COUNTS)
    .filter((v) => v.level === level)
    .reduce((a, v) => a + v.count, 0);

it("前提検算: 期待表の合計が 150、各レベル 50 である", () => {
  expect(sumOf("beginner")).toBe(50);
  expect(sumOf("intermediate")).toBe(50);
  expect(sumOf("advanced")).toBe(50);
});

describe("T-001: 件数", () => {
  it("commands.json は 150 件ちょうど", () => {
    expect(dataset.commands).toHaveLength(150);
  });
});

describe("T-002: レベル別件数", () => {
  it.each(["beginner", "intermediate", "advanced"] as const)(
    "%s は 50 件",
    (level) => {
      expect(questionsForLevel(level)).toHaveLength(50);
    },
  );
});

describe("T-003: カテゴリ別件数が SPEC §4 と完全一致", () => {
  it("13 カテゴリが定義されている", () => {
    expect(dataset.categories).toHaveLength(13);
    expect(Object.keys(EXPECTED_CATEGORY_COUNTS).sort()).toEqual(
      dataset.categories.map((c) => c.id).sort(),
    );
  });

  it.each(Object.entries(EXPECTED_CATEGORY_COUNTS))(
    "%s の件数とレベル",
    (id, expected) => {
      const actual = dataset.commands.filter((c) => c.category === id);
      expect(actual).toHaveLength(expected.count);
      expect(categoriesById.get(id)?.level).toBe(expected.level);
    },
  );
});

describe("T-004: cmd の一意性", () => {
  it("重複 0 件", () => {
    const seen = new Set(dataset.commands.map((c) => c.cmd));
    expect(seen.size).toBe(dataset.commands.length);
  });
});

describe("T-005: cmd の文字種", () => {
  it("全件が [a-z0-9+._-]+ に一致", () => {
    for (const c of dataset.commands) {
      expect(c.cmd).toMatch(/^[a-z0-9+._-]+$/);
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

describe("T-007: category の参照整合", () => {
  it("全件が定義済みカテゴリ id を指す", () => {
    for (const c of dataset.commands) {
      expect(categoriesById.has(c.category), c.cmd).toBe(true);
    }
  });

  it("未定義カテゴリの解決は即時エラーになる", () => {
    const bad = [{ cmd: "ls", desc: "ダミーの説明ダミーの説明", category: "no-such" }];
    expect(() => resolveQuestions(bad, categoriesById)).toThrow(/未定義カテゴリ/);
  });
});
