# command-type

**▶ 遊ぶ: https://command-type.vercel.app**

Linux・SQL:2023・Python・Python ML・TypeScript・Java・Git・Docker/Kubernetes・HTML/CSS・PowerShell の
「落ちものゲーム × タイピング練習」。
出題(コマンド・関数・構文)が短い解説文・カテゴリ名とともに画面上部から落ちてくる。
底に着く前にタイプして Enter — 打鍵の速さと正確さを鍛えながら、トラックごとに 150 の語彙を覚える。

- **10 トラック × 各 150 問(計 1,500 問)**、各 13 カテゴリ / 3 レベル(各 50)+ 全カテゴリ混合の**ミックス**
- トラックごとにコミュニティ標準のブランドカラーを基調色に採用(SPEC §7.1)
- トラックとレベルに応じたカテゴリから出題(対応表は [SPEC.md](SPEC.md) §4)
- 1 セッション 20 問・ライフ 3。スコアは速度ボーナス + コンボ
- 効果音(Web Audio 合成・🔊 トグル)とクリア/落下フラッシュ演出
- 結果画面で出題を解説付きで復習、トラック×モード別ハイスコア保存

## 技術構成

- Next.js (App Router) + TypeScript、静的エクスポート
- ゲームロジックは `src/core/`(純関数・時間と乱数は注入・カバレッジ 90%+)
- GitHub 連携の Vercel で公開
- 開発はハーネスエンジニアリング / ループエンジニアリング
  (scaffold v1.6.0 / loop-observability / worktree-kit)で行う — 規範は [AGENTS.md](AGENTS.md)

## 開発

```bash
npm ci
npm run dev       # 開発サーバ
npm run verify    # 完了条件(typecheck + lint + test + build)
```

仕様の正本は [SPEC.md](SPEC.md)、テスト仕様は [TEST_SPEC.md](TEST_SPEC.md)、
出題データの正本は [data/tracks/](data/tracks/) のトラック別 JSON。

## 実装フェーズ

| フェーズ | 内容 | 状態 |
|---|---|---|
| P0 | 立ち上げ(仕様・データ・ハーネス) | 完了 |
| P1 | core ロジック + データ検証テスト | 完了 |
| P2 | UI + Vercel 公開 | 完了 |
| P3 | 磨き込み(効果音・演出・ミックスモード) | 完了 |

## License

MIT License — Copyright (c) 2026 坂田哲朗([LICENSE](LICENSE))。
ハーネスツール(`harness/`・`schema/`)を含むリポジトリ全体が対象。
出題データの出典・執筆方針(解説文はすべて書き下ろしオリジナル)は
[docs/data-provenance.md](docs/data-provenance.md) を参照。
