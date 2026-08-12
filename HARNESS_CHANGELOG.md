# HARNESS_CHANGELOG.md — ハーネス改訂台帳(command-type)

原則: **エージェントがミスをするたびに、そのミスが二度と起きないようハーネスを改良する。**
起票条件: 同一失敗コード累計 2 回(LL-10)、または severity S1(LL-12)。

各エントリは「どの失敗が、どの文書のどの改訂を生み、効いたかをどう確認するか」を 1 レコードで残す。
共通規範(scaffold ブロック)に関わる改訂は、本台帳への起票の上、
レジストリ(harness-kit/scaffold-kit/registry)改訂 → `scaffoldctl update` の経路で行う。

---

## HC-001

| 項目 | 内容 |
|---|---|
| 起票日 | 2026-08-05 |
| トリガー | `TOOL-ENV` × 2(loop_002: npm scripts の bash が WSL bash に解決され vitest 起動不能 / loop_003: `VERIFY_SKIP_BUILD=1` の env プレフィックスが cmd で解釈不能)— ツーストライク(LL-10) |
| 診断 | Windows では npm scripts が cmd 経由で実行されるため、bungo-type から流用した bash 前提の構成が 2 箇所で破れた。(1) cmd の PATH 解決は `bash` を WSL(System32)に向けることがあり、Linux 用ネイティブ依存が不在で vitest が落ち、lint も数百秒級に低速化する (2) `VAR=x cmd` の env プレフィックス構文は cmd に存在しない |
| 改訂 | 恒久修正: verify を bash 実装(verify.sh)から **Node 実装(scripts/verify.mjs)へ移行**し、シェル依存を根本から排除。--fast フラグ方式(env プレフィックス不使用)、VERIFY_SKIP_BUILD は後方互換で維持。cmd / PowerShell / Git Bash / Linux CI で同一動作 |
| 種別 | tooling(プロジェクト所有の scripts/verify.mjs / package.json) |
| SCAFFOLD_VERSION | 1.6.1(変更なし — registry 管理外)|
| 効果検証 | 2026-08-05 確認: verify:fast が PowerShell 起動・Git Bash 起動の双方で PASS(WSL bash 経由時の vitest 起動不能・lint 数百秒化も消滅)。フル verify(build 込み)も loop_003・loop_004 で連続 PASS。以後 TOOL-ENV 再発 0 件 |
| propagation | command-type のみ。bash 版 verify.sh を持つ bungo-type で同種の TOOL-ENV が再発した場合、verify.mjs の registry 昇格(managed file 化)を検討する |
| 状態 | Closed |

## HC-002

| 項目 | 内容 |
|---|---|
| 起票日 | 2026-08-12 |
| トリガー | `PROC-SKIP` × 2(loop_016: 赤確認の test_run を verify 後にまとめて後追い記録 / loop_022: test_run の passed 件数を出力確認前に推定値で記録)— ツーストライク(LL-10) |
| 診断 | いずれも「テスト実行 → 即時・実測値で記録」の規律が、テスト実行とログ記録が別コマンドに分かれているために破れた。実行結果の要約(passed/failed)を目視で転記する手作業が挟まり、省略・推定の余地が生まれている |
| 改訂 | 運用規律の強化: test_run の記録は、テスト実行コマンドと**同一のシェル呼び出し内で**件数を機械的に抽出して append する(例: vitest 出力を grep で拾い変数展開で --data へ渡す)。推定値・後追い記録を禁止する運用を本台帳に明文化。恒久化(looplog にテスト実行ラッパを追加)は再発時に検討 |
| 種別 | process(運用規律。ツール変更なし) |
| SCAFFOLD_VERSION | 1.7.1(変更なし) |
| 効果検証 | loop_023 以降の test_run レコードが全件実測値であること(correction による訂正が発生しないこと)で確認する |
| propagation | 同一 looplog 運用の他プロジェクト(bungo-type 等)にも同じ手順を推奨。再発時は looplog.py への `run` サブコマンド追加(実行と記録の一体化)を registry 経由で検討 |
| 状態 | Open(loop_023 以降で効果検証中) |

## HC-003

(次のエントリ)
