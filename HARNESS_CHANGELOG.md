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
| 効果検証 | 2026-08-05 確認: verify:fast が PowerShell 起動・Git Bash 起動の双方で PASS(WSL bash 経由時の vitest 起動不能・lint 数百秒化も消滅)。フル verify(build 込み)の PASS は loop_003 完了時に確認 |
| propagation | command-type のみ。bash 版 verify.sh を持つ bungo-type で同種の TOOL-ENV が再発した場合、verify.mjs の registry 昇格(managed file 化)を検討する |
| 状態 | Verifying |

## HC-002

(次のエントリ)
