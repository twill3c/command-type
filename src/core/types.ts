/** レベル識別子(SPEC §4)。 */
export type Level = "beginner" | "intermediate" | "advanced";

/** プレイ可能なモード: 3 レベル + 全カテゴリ混合のミックス(F-14)。 */
export type PlayLevel = Level | "mix";

/** data/commands.json の categories 要素。 */
export interface CategoryDef {
  id: string;
  name: string;
  level: Level;
}

/** data/commands.json の commands 要素。 */
export interface CommandEntry {
  cmd: string;
  desc: string;
  category: string;
}

/** data/commands.json 全体。 */
export interface Dataset {
  version: string;
  levels: Record<Level, string>;
  categories: CategoryDef[];
  commands: CommandEntry[];
}

/** 出題 1 件(カテゴリ情報を解決済み)。 */
export interface Question {
  cmd: string;
  desc: string;
  categoryId: string;
  categoryName: string;
  level: Level;
}
