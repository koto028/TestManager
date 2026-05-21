# シンプルタスクボード（Trello 風）

**3 層構成**（フロント → API → MySQL）のスクール課題向けアプリです。  
**シングルユーザー**（ログインなし・ボード 1 枚固定）で、マルチユーザー対応はしません。

## 構成

| 層 | 技術 | ディレクトリ |
| ---- | ---- | ------------ |
| フロント | HTML / CSS / JavaScript | `index.html`, `style.css`, `app.js` |
| バックエンド | Node.js + Express | `server/server.js` |
| DB | MySQL 8.x | `server/db/schema.sql`, `seed.sql` |

```
ブラウザ → fetch → Express API → MySQL
```

## スコープ（やらないこと）

- ログイン / ユーザー登録
- 複数ボード
- ユーザー間のデータ共有

## セットアップ

### 1. MySQL

```sql
CREATE DATABASE trello_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
mysql -u root -p trello_app < server/db/schema.sql
mysql -u root -p trello_app < server/db/seed.sql
```

### 2. 環境変数

```bash
cd server
copy .env.example .env
```

`.env` の `DB_USER` / `DB_PASSWORD` を環境に合わせて編集。

### 3. サーバー起動

```bash
cd server
npm install
npm start
```

ブラウザで **http://localhost:3000/index.html** を開く。

> `index.html` を直接ダブルクリックすると API に接続できません。必ずサーバー経由で開いてください。

## API

| メソッド | パス | 説明 |
| -------- | ---- | ---- |
| GET | `/api/board` | ボード・リスト・カード一覧 |
| POST | `/api/lists/:listId/cards` | カード追加 `{ "title": "..." }` |
| DELETE | `/api/cards/:cardId` | カード削除 |
| GET | `/api/health` | DB 接続確認 |

## ER 図（テーブル）

```
boards (1) ──< lists (N) ──< cards (N)
```

詳細は `server/db/ER図.md` および要件定義書 第 7.5 章を参照。
