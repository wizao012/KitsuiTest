# フレッツ光クロスBIZ LP — GitHub納品用ソース

2026年9月17日時点の最新LP（Ver1.5）のソース・画像の軽量納品版です。未使用の旧画像・UI部品・過去案・履歴ファイルを除外しています。使用中の画像とフォントは再圧縮せず、画質を維持しています。
比較画像を、元の光のハイウェイ構図を保ちながら発光を抑えた画像に更新した状態です。

## 必要環境・起動方法

Node.js 22.13.0以上とpnpmを使用します。依存関係の取得にはインターネット接続が必要です。

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

起動後、ターミナルに表示されるローカルURLを開きます。

## ビルド・ビルド結果のローカル確認

```bash
pnpm build
pnpm start
```

React 19 / TypeScript / Vite / vinextを利用しています。Cloudflare Workers互換のサーバー出力は`dist/server/`、静的素材は`dist/client/`に生成されます。不要ファイルを除外した軽量版でもビルド成功と素材参照を確認しています。クリーンインストールは未検証です。

## GitHubへの登録

ZIPを解凍し、このREADMEとpackage.jsonがあるフォルダをリポジトリのルートとして登録してください。隠しファイルの`.gitignore`と`.openai/hosting.json`も含めてください。

```bash
git init
git add .
git commit -m "Initial LP delivery"
git branch -M main
git remote add origin <作成したGitHubリポジトリのURL>
git push -u origin main
```

GitHubリポジトリへのソース納品用です。GitHub Pagesでそのまま公開する静的HTMLパッケージではありません。現状の配信先はSitesです。別のホスティング先へ移行する場合は、その環境に合わせた配信設定が必要です。

## 主な編集箇所

| ファイル | 内容 |
| --- | --- |
| `app/page.tsx` | ページ全体の構成 |
| `app/original-sections.json` | メインLPのテキスト・画像参照・HTML |
| `app/cta-refinement.css` | CTAと比較セクションの調整 |
| `app/white-lp.css` | 白ベースのデザイン調整 |
| `app/brushup.css` | 元LPのブラッシュアップ |
| `app/faq-data.ts` | FAQの質問・回答 |
| `app/contact.tsx` | 問い合わせ・エリア確認フォーム |
| `app/layout.tsx` | ページタイトル・説明・検索設定 |
| `public/ver1.5/highway-natural.webp` | 最新の比較画像 |
| `public/` | 表示に使用する画像素材 |

CSSはlayout.tsxの読み込み順に適用されます。後から読み込まれるCSSに上書きがあるため、変更時は読み込み順も確認してください。

## 引き継ぎ時の確認事項

- 現状はデザイン確認版です。フォームは入力確認までで、問い合わせの送信・保存、提供エリアの実判定は行いません。本運用では送信先との接続が必要です。
- 郵便番号検索ではzipcloudへ郵便番号を送信します。
- 運営会社情報・個人情報保護方針は確認版の案内です。正式内容への差し替えが必要です。
- `app/layout.tsx`は検索エンジン向けにnoindex/nofollowを設定しています。正式公開時の方針に合わせて変更してください。
- 電話番号・料金・キャンペーン条件は公開前に運営者側で最終確認してください。
- `.openai/hosting.json`は既存Sitesの識別設定です。APIキーではありません。`vite.config.ts`が参照しているため、このまま起動する場合は残してください。
- APIキー、認証トークン、`.env`、`node_modules`、ビルド成果物、Git履歴は含めていません。

## 納品元

確認用サイト: https://flets-cross-biz-renewal.wiz-marketing.chatgpt.site/
ソースコミット: 2d131b8518e5ddf665791267445554ee5c745c7d
