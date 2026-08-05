# deploy.md — 公開構成と手順

## 公開先

- **本番 URL**: https://command-type.vercel.app
- GitHub: https://github.com/twill3c/command-type (private)
- Vercel プロジェクト: `command-type`(GitHub 連携済み)

## デプロイフロー

`main` への push で Vercel が自動ビルド・自動デプロイする(GitHub 連携)。
手動で本番デプロイする場合はリポジトリ直下で:

```bash
vercel deploy --prod
```

構成はルート配置の Next.js 静的エクスポート(`output: "export"`、N-01)。
web/ サブディレクトリ構成ではないため Root Directory 設定は不要(HC-006 の罠は対象外)。

## URL の使い分け(ハマりどころ)

チームには Vercel の Standard Protection が有効なため、URL によって挙動が異なる:

| URL | 挙動 |
|---|---|
| `command-type.vercel.app` | **公開**(本番ドメイン)。共有はこちら |
| `command-type-<team>.vercel.app` / デプロイ個別 URL | Vercel ログインへ 302(チーム内確認用) |

検証を curl 等で行うときは必ず `command-type.vercel.app` に対して行うこと。
`HEAD` はログインページも 200 を返すため、到達確認はタイトルや本文で行う(bungo-type と同構成)。

## デプロイ後の確認

1. https://command-type.vercel.app で `<title>command-type</title>` が返ること
2. レベル選択 → ゲーム開始 → 1 コマンドクリアまでの実機確認(ブラウザまたは playwright スモーク)
3. コンソールエラー 0 件
