# Claude Code 開発ルール

このファイルは Claude Code が**厳守しなければならない**ルールを定義します。

## 絶対ルール

### 1. master への直接プッシュ禁止

`git push origin master` は**いかなる状況でも実行しない**。
必ず feature/fix/chore/docs ブランチを作成してから PR 経由でマージする。

### 2. 作業前に Issue を確認・作成する

実装作業を始める前に、対応する GitHub Issue が存在するか確認する。
存在しない場合は `gh issue create` で Issue を作成してから着手する。

### 3. ブランチ命名規則を厳守する

```
<type>/issue-<番号>-<説明（英小文字・ハイフン区切り）>
```

- `feature/` — 新機能
- `fix/` — バグ修正
- `chore/` — リファクタリング・依存更新・設定変更
- `docs/` — ドキュメントのみ

例: `feature/issue-12-add-card-drag-drop`

### 4. PR には必ず Issue を紐付ける

PR 本文に `closes #<Issue番号>` を含める。
紐付けのない PR は作成しない。

---

## 開発フロー（毎回この順番で実施）

```
1. gh issue create  （または既存 Issue を確認）
2. git switch -c <type>/issue-<番号>-<説明>
3. 実装・コミット
4. gh pr create --title "[#番号] 概要" --body "closes #番号 ..."
```

---

## 技術スタック

- **バックエンド**: Java 21 / Spring Boot 3.4.1 / Spring Data JPA / Flyway
- **DB**: PostgreSQL 16（Docker で起動）
- **ビルド**: Gradle (Kotlin DSL)
- **フロントエンド**: React（Next.js は使用しない）

## DB マイグレーション

スキーマ変更は必ず `backend/src/main/resources/db/migration/` に Flyway マイグレーションファイルを追加する。
Hibernate の `ddl-auto` は `validate` のままにし、直接スキーマを変更しない。

命名規則: `V{次の番号}__{説明}.sql`（例: `V2__add_due_date_to_cards.sql`）

## 起動手順

### 使用ポート（固定・変更不可）

| サービス | ポート | URL |
|---------|--------|-----|
| PostgreSQL | 5432 | — |
| バックエンド (Spring Boot) | 8080 | http://localhost:8080 |
| フロントエンド (Vite) | 5173 | http://localhost:5173 |

### 起動コマンド（ポート競合を自動解消）

ターミナルを **3つ** 開いて順番に実行する。

```powershell
# ターミナル 1 — DB
docker compose up -d

# ターミナル 2 — バックエンド（ポート 8080 を自動解放してから起動）
.\scripts\start-backend.ps1
# または Gradle タスクで直接実行
cd backend; .\gradlew bootRunSafe

# ターミナル 3 — フロントエンド（ポート 5173 を自動解放してから起動）
cd frontend; npm run dev   # predev で 5173 を自動解放してから Vite を起動
```

### 動作確認 URL

| 確認内容 | URL |
|---------|-----|
| バックエンド疎通 | http://localhost:8080/api/health |
| ボード一覧画面 | http://localhost:5173/ |
| ボード詳細画面 | http://localhost:5173/boards/1 |

### ポート競合時の対処（プログラム的解決）

- **フロント**: `npm run dev` の `predev` フックが `scripts/free-port.mjs` を実行し、5173 を占有するプロセスを自動停止する
- **バックエンド**: `.\gradlew bootRunSafe` タスクが 8080 を占有するプロセスを自動停止してから `bootRun` を実行する
- **手動で解放したい場合**: `scripts/start-backend.ps1` / `scripts/start-frontend.ps1` を実行する

> **注意**: ポート番号は変更しない。フロントの Vite proxy が `/api → localhost:8080` に固定されており、番号を変えると連携が壊れる。
