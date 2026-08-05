import raw from "../../data/commands.json";
import type {
  CategoryDef,
  CommandEntry,
  Dataset,
  Level,
  PlayLevel,
  Question,
} from "./types";

/** 出題データの正本(data/commands.json)。配分の正は SPEC §4。 */
export const dataset = raw as Dataset;

export const categoriesById: ReadonlyMap<string, CategoryDef> = new Map(
  dataset.categories.map((c) => [c.id, c]),
);

/** commands をカテゴリ解決済みの Question 列に変換する(未定義カテゴリは即時エラー)。 */
export function resolveQuestions(
  commands: readonly CommandEntry[],
  categories: ReadonlyMap<string, CategoryDef>,
): Question[] {
  return commands.map((entry) => {
    const cat = categories.get(entry.category);
    if (!cat) {
      throw new Error(`未定義カテゴリ: ${entry.category}(${entry.cmd})`);
    }
    return {
      cmd: entry.cmd,
      desc: entry.desc,
      categoryId: cat.id,
      categoryName: cat.name,
      level: cat.level,
    };
  });
}

/** 指定レベルに属する全出題(F-02: レベル対応カテゴリのみ)。 */
export function questionsForLevel(level: Level): Question[] {
  return resolveQuestions(dataset.commands, categoriesById).filter(
    (q) => q.level === level,
  );
}

/** プレイモードの母集団。ミックスは全 150(F-14)。 */
export function questionsForPlay(level: PlayLevel): Question[] {
  if (level === "mix") {
    return resolveQuestions(dataset.commands, categoriesById);
  }
  return questionsForLevel(level);
}
