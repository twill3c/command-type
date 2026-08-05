#!/usr/bin/env bash
# =====================================================================
# 品質ゲート + ループ観測ログ(bungo-type の実績パターンをミラー)
#
# すべての変更はこのスクリプトの green を完了条件とする(AGENTS.md §3)。
# 実行結果は .loop/verify.jsonl に追記され、各ステップの詳細ログは
# .loop/<step>.log に残る。エージェントは fail 時にまず該当ログを読むこと。
# パイプ・ページャを通さず素で実行し、exit code で判定する(bungo-type HC-004)。
#
# 環境変数:
#   VERIFY_SKIP_BUILD=1  … next build をスキップ(高速ループ用)
# =====================================================================
set -u

mkdir -p .loop
SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "no-git")
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PASS=true

declare -A RESULT

run_step() {
  local name="$1"
  shift
  local start
  start=$(date +%s)
  if "$@" > ".loop/${name}.log" 2>&1; then
    RESULT[$name]="pass"
  else
    RESULT[$name]="fail"
    PASS=false
  fi
  local dur=$(( $(date +%s) - start ))
  echo "  [${RESULT[$name]}] ${name} (${dur}s)"
}

echo "verify @ ${SHA} ${TS}"
run_step typecheck npx tsc --noEmit
run_step lint      npm run -s lint
run_step test      npx vitest run --coverage

if [ "${VERIFY_SKIP_BUILD:-0}" != "1" ]; then
  run_step build npm run -s build
else
  RESULT[build]="skipped"
  echo "  [skipped] build (VERIFY_SKIP_BUILD=1)"
fi

printf '{"ts":"%s","sha":"%s","typecheck":"%s","lint":"%s","test":"%s","build":"%s","pass":%s}\n' \
  "$TS" "$SHA" "${RESULT[typecheck]}" "${RESULT[lint]}" "${RESULT[test]}" "${RESULT[build]}" "$PASS" \
  >> .loop/verify.jsonl

if [ "$PASS" = true ]; then
  echo "verify: PASS"
  exit 0
else
  echo "verify: FAIL — 詳細は .loop/<step>.log を確認"
  exit 1
fi
