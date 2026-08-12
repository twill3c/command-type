# command-type

**▶ 遊ぶ: https://command-type.vercel.app**

Linux コマンドの「落ちものゲーム × タイピング練習」。
コマンド文字列が短い解説文・カテゴリ名とともに画面上部から落ちてくる。
底に着く前にタイプして Enter — 打鍵の速さと正確さを鍛えながら、150 個の主要コマンドを覚える。

- **150 コマンド / 13 カテゴリ / 3 レベル**(初級・中級・上級 各 50)+ 全カテゴリ混合の**ミックス**
- レベルに応じたカテゴリから出題(対応表は [SPEC.md](SPEC.md) §4)
- 1 セッション 20 問・ライフ 3。スコアは速度ボーナス + コンボ
- 効果音(Web Audio 合成・🔊 トグル)とクリア/落下フラッシュ演出
- 結果画面で出題コマンドを解説付きで復習、モード別ハイスコア保存

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
