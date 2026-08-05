# loop-runbook.md — command-type のループ実行手引き

7 段階プロトコル(AGENTS.md 共通規律)を本プロジェクトで回すときの具体手順。

## ループの開始から完了まで

```bash
# 1. 計画: 対象の F-xx / T-xxx を決め、ループを開始
python harness/looplog.py append --loop loop_XXX --event loop_start \
  --data "goal=..." 'spec_refs=["F-04"]' scaffold_version=1.6.0 agent=claude-code

# 2. 文脈読込: SPEC.md の該当節・TEST_SPEC.md の対応ケース・直近ループの summary を読む

# 3. テスト先行: TEST_SPEC.md に行を足し、赤を確認
npx vitest run          # 赤の確認も test_run として記録する

# 4. 実装: 編集 2 回ごとに
npm run verify:fast     # fail したらその場で failure を分類コード付きで記録

# 5. 検証(完了条件)
npm run verify          # パイプ・ページャ禁止。exit code で判定(bungo-type HC-004)

# 7. 完了
python harness/looplog.py append --loop loop_XXX --event loop_end \
  --data outcome=success failure_count=N "summary=..."
python harness/looplog.py validate
python harness/looplog.py summary --loop loop_XXX   # 完了報告に含める
```

## worktree 並列(P1 で npm 環境が整ってから)

```bash
# main checkout で(並走ループの要求 ID 独立性を確認してから)
python harness/wtctl.py open --loop loop_XXX    # npm ci → ベースライン測定
cd ../command-type.worktrees/loop_XXX           # ここでループを回す
python ../../command-type/harness/wtctl.py check  # PR 前必須
# マージ後、main checkout で
python harness/wtctl.py close --loop loop_XXX
```

`.wt/gate.json`: test_command=`npx vitest run` / setup_command=`npm ci`。
上限(500 行・30 ファイル)の変更はレジストリ経由のみ。超過したら要求 ID 境界で分割する。

## 落とし穴(先行プロジェクトの教訓)

- 品質ゲートコマンドに `| tail` 等を付けない — exit code が握り潰され虚偽 pass になる(bungo-type HC-004)
- looplog の記録は worktree 内から実行してよい(v1.6.0 で project 自動検出が worktree 対応済み — HC-008)
- CI アーティファクトに隠しディレクトリを含める場合は `include-hidden-files: true`(bungo-type HC-005)
- 合成フィクスチャの期待値は導出前提をテスト内で検算する(HC-004 / TEST_SPEC 実行規約)
