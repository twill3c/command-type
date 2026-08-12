import docker from "../../data/tracks/docker.json";
import git from "../../data/tracks/git.json";
import java from "../../data/tracks/java.json";
import linux from "../../data/tracks/linux.json";
import python from "../../data/tracks/python.json";
import typescript from "../../data/tracks/typescript.json";
import type {
  CategoryDef,
  CommandEntry,
  Dataset,
  Level,
  PlayLevel,
  Question,
  TrackId,
} from "./types";

/**
 * 出題データの正本(data/tracks/*.json)。配分の正は SPEC §4(トラック別表)。
 * トラックを追加したら import して登録する(python: P5 / typescript: P6)。
 */
export const datasets: ReadonlyMap<TrackId, Dataset> = new Map([
  ["linux", linux as Dataset],
  ["python", python as Dataset],
  ["typescript", typescript as Dataset],
  ["java", java as Dataset],
  ["git", git as Dataset],
  ["docker", docker as Dataset],
]);

function trackDataset(track: TrackId): Dataset {
  const d = datasets.get(track);
  if (!d) throw new Error(`未登録トラック: ${track}`);
  return d;
}

const categoryMaps = new Map<TrackId, ReadonlyMap<string, CategoryDef>>();

/** 指定トラックのカテゴリ定義(id → 定義)。 */
export function categoriesFor(
  track: TrackId,
): ReadonlyMap<string, CategoryDef> {
  const cached = categoryMaps.get(track);
  if (cached) return cached;
  const map = new Map(trackDataset(track).categories.map((c) => [c.id, c]));
  categoryMaps.set(track, map);
  return map;
}

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

/** 指定トラック・レベルに属する全出題(F-02: レベル対応カテゴリのみ)。 */
export function questionsForLevel(track: TrackId, level: Level): Question[] {
  return resolveQuestions(
    trackDataset(track).commands,
    categoriesFor(track),
  ).filter((q) => q.level === level);
}

/** プレイモードの母集団。ミックスはトラック全件(F-14)。 */
export function questionsForPlay(track: TrackId, level: PlayLevel): Question[] {
  if (level === "mix") {
    return resolveQuestions(trackDataset(track).commands, categoriesFor(track));
  }
  return questionsForLevel(track, level);
}
