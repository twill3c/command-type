/** トラック(学習科目)識別子(SPEC §1・§4)。 */
export type TrackId =
  | "linux"
  | "sql"
  | "python"
  | "typescript"
  | "java"
  | "git"
  | "docker"
  | "htmlcss"
  | "powershell";

/** data/tracks/*.json の track 要素。 */
export interface TrackDef {
  id: TrackId;
  name: string;
}

/** レベル識別子(SPEC §4)。 */
export type Level = "beginner" | "intermediate" | "advanced";

/** プレイ可能なモード: 3 レベル + 全カテゴリ混合のミックス(F-14)。 */
export type PlayLevel = Level | "mix";

/** data/tracks/*.json の categories 要素。 */
export interface CategoryDef {
  id: string;
  name: string;
  level: Level;
}

/** data/tracks/*.json の commands 要素。 */
export interface CommandEntry {
  cmd: string;
  desc: string;
  category: string;
}

/** data/tracks/*.json 全体(トラック 1 つ分)。 */
export interface Dataset {
  version: string;
  track: TrackDef;
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
