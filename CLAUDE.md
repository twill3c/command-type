# CLAUDE.md

@AGENTS.md

上記ハーネスがこのリポジトリの正本ルール。要点のみ再掲する:

- 仕様の正本は SPEC.md、出題データの正本は `data/commands.json`(配分は SPEC §4)。
  変更は スペック → テスト → 実装(データ)の順。
- すべてのタスクは 7 段階ループプロトコル(AGENTS.md 末尾の共通規律)で進め、
  `python harness/looplog.py append` で `logs/loops/{loop_id}.jsonl` に記録する。
  失敗は気づいた瞬間に FAILURE_TAXONOMY のコード付きで記録する。
- 完了条件は `npm run verify` green + `looplog.py validate` 合格。
  品質ゲートコマンドはパイプを通さず素で実行し、exit code で判定する。
- worktree 並列は `python harness/wtctl.py open/check/close`。PR 前の `check` 合格必須。
- `src/core` は純関数のみ(時間・乱数は注入)・カバレッジ 90% 以上を維持。
- scaffold ブロック(AGENTS.md 末尾)と `.wt/gate.json` の上限は直接編集しない。
