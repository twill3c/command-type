# HARNESS_CHANGELOG.md — ハーネス改訂台帳(command-type)

原則: **エージェントがミスをするたびに、そのミスが二度と起きないようハーネスを改良する。**
起票条件: 同一失敗コード累計 2 回(LL-10)、または severity S1(LL-12)。

各エントリは「どの失敗が、どの文書のどの改訂を生み、効いたかをどう確認するか」を 1 レコードで残す。
共通規範(scaffold ブロック)に関わる改訂は、本台帳への起票の上、
レジストリ(harness-kit/scaffold-kit/registry)改訂 → `scaffoldctl update` の経路で行う。

---

## HC-001

(次のエントリ)
