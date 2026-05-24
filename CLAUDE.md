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

## Docker

```bash
# DB 起動
docker compose up -d

# バックエンド起動
cd backend && ./gradlew bootRun
```
