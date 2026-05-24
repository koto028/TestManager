# TestManager — タスク管理アプリ

カンバン方式のタスク管理 Web アプリ（Trello 風）。スクール演習として要件定義→設計→実装の一連の流れを体験するプロジェクト。

---

## バージョン履歴

| バージョン | フェーズ | 主要技術 | 実装場所 | 状態 |
|-----------|---------|---------|---------|------|
| **v2.x（現在）** | Phase 2 — Spring Boot + React | Java 21 / Spring Boot 3.4.1 / PostgreSQL 16 / React + Vite | `backend/` `frontend/` | 開発中 |
| v1.x | Phase 1 — プロトタイプ | HTML/CSS/JS + Express + MySQL | `trello-app/` | 完了（参照用） |

> **現在の開発対象は v2.x**（`backend/` + `frontend/`）です。`trello-app/` は Phase 1 の成果物として参照用に残しています。

---

## 技術スタック（v2.x）

| レイヤー | 技術 | バージョン |
|---------|------|----------|
| バックエンド | Java / Spring Boot | 21 / 3.4.1 |
| ORM / DB マイグレーション | Spring Data JPA / Flyway | — |
| データベース | PostgreSQL（Docker） | 16 |
| ビルドツール | Gradle (Kotlin DSL) | — |
| フロントエンド | React + TypeScript + Vite | — |
| HTTP クライアント | TanStack Query (React Query) | — |
| ルーティング | React Router DOM | — |

---

## クイックスタート（v2.x）

ターミナルを **3 つ** 開いて順番に実行します。

### 1. データベース起動

```powershell
docker compose up -d
```

### 2. バックエンド起動（ポート 8080）

```powershell
cd backend
.\gradlew bootRunSafe
```

### 3. フロントエンド起動（ポート 5173）

```powershell
cd frontend
npm run dev
```

> `predev` フックが起動前にポート 5173 を自動解放します。バックエンドの `bootRunSafe` も同様に 8080 を自動解放します。

### 動作確認

| 確認内容 | URL |
|---------|-----|
| バックエンド疎通 | http://localhost:8080/api/health |
| ボード一覧画面 | http://localhost:5173/ |
| ボード詳細画面 | http://localhost:5173/boards/1 |

---

## ディレクトリ構成

```
TestManager/
├── backend/                  # Spring Boot バックエンド (v2.x)
│   ├── src/main/java/        # エンティティ・DTO・サービス・コントローラー
│   └── src/main/resources/
│       └── db/migration/     # Flyway マイグレーション SQL
├── frontend/                 # React フロントエンド (v2.x)
│   ├── src/
│   │   ├── api/              # バックエンド API 呼び出し
│   │   ├── components/       # 共通コンポーネント
│   │   └── pages/            # 画面コンポーネント
│   └── vite.config.ts        # /api → localhost:8080 プロキシ設定
├── docs/                     # 設計ドキュメント一覧
├── scripts/                  # ポート解放スクリプト
├── .github/                  # Issue テンプレート・PR テンプレート
├── docker-compose.yml        # PostgreSQL 16 コンテナ
├── CLAUDE.md                 # Claude Code 開発ルール
├── CONTRIBUTING.md           # 開発フロー・ブランチ命名規則
└── trello-app/               # Phase 1 プロトタイプ（参照用）
```

---

## ドキュメント一覧

### 要件・設計（docs/）

| ドキュメント | 内容 |
|------------|------|
| [要件定義書](./要件定義書【タスク管理アプリ】.md) | 背景・目的・スコープ・用語定義（ハブ文書） |
| [機能要件.md](./docs/機能要件.md) | 機能要件（FR）一覧 |
| [非機能要件.md](./docs/非機能要件.md) | 非機能要件（NFR）一覧 |
| [画面設計.md](./docs/画面設計.md) | 画面構成・UI 要素 |
| [基本設計.md](./docs/基本設計.md) | 画面遷移・シーケンス・データフロー |
| [データベース設計.md](./docs/データベース設計.md) | ER 図・テーブル定義 |
| [API設計.md](./docs/API設計.md) | REST API 仕様 |
| [技術選定.md](./docs/技術選定.md) | 技術スタックの選定理由 |
| [受け入れ基準.md](./docs/受け入れ基準.md) | 課題合格条件（AC 一覧） |

### 開発ルール・フロー

| ドキュメント | 内容 |
|------------|------|
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Issue → ブランチ → PR の開発フロー全体 |
| [CLAUDE.md](./CLAUDE.md) | Claude Code が厳守する開発ルール |

### Phase 1 プロトタイプ（参照用）

| ドキュメント | 内容 |
|------------|------|
| [trello-app/README.md](./trello-app/README.md) | Phase 1 アプリの起動手順 |
| [trello-app/開発フェーズ.md](./trello-app/開発フェーズ.md) | Phase 1 の実装進捗記録 |

---

## 開発フロー（概要）

```
gh issue create                          # 1. Issue を作成
git switch -c <type>/issue-<番号>-<説明>  # 2. ブランチを作成
# 実装・コミット                           # 3. 実装
gh pr create                             # 4. PR を作成 (closes #番号 を含める)
```

詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

---

## DB マイグレーション

スキーマ変更は `backend/src/main/resources/db/migration/` に Flyway ファイルを追加します。

```
V{次の番号}__{説明}.sql   例: V2__add_due_date_to_cards.sql
```

`application.yml` の `ddl-auto: validate` により、マイグレーションファイルなしのスキーマ変更はエラーになります。

---

## 改訂履歴

| 版数 | 日付 | 内容 |
|-----|------|------|
| 3.0 | 2026/05/25 | v2.x（Spring Boot + React）対応に全面改訂。バージョン履歴・クイックスタート・ドキュメントハブとして再構成 |
| 2.0 | 2026/05/21 | 要件定義書ハブ化。詳細を docs/ に分割 |
| 1.0 | 2026/05/19 | 初版作成（Phase 1 プロトタイプ） |
