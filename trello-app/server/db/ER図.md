# ER 図（Mermaid）— タスク管理アプリ

MySQL テーブル設計に対応する ER 図。`schema.sql` と整合する。

## PNG 画像（提出用）

| ファイル | 内容 |
| -------- | ---- |
| [er-concept.png](./er-concept.png) | 概念 ER 図 |
| [er-physical.png](./er-physical.png) | 物理 ER 図（全列） |
| [er-fk.png](./er-fk.png) | FK リレーション図 |

ソース（Mermaid）: `er-concept.mmd` / `er-physical.mmd` / `er-fk.mmd`

---

## 1. 概念 ER 図（エンティティと関連）

```mermaid
erDiagram
    boards ||--|{ lists : "1 対多"
    lists ||--|{ cards : "1 対多"

    boards {
        string id PK
        string title
    }
    lists {
        string id PK
        string board_id FK
        string title
        int sort_order
    }
    cards {
        string id PK
        string list_id FK
        string title
        int sort_order
    }
```

| 関連 | カーディナリティ | 意味 |
| ---- | ---------------- | ---- |
| boards ── lists | **1 : N** | 1 つのボードに複数リスト（Phase 2 は 3 列固定） |
| lists ── cards | **1 : N** | 1 つのリストに複数カード（0 件可） |

---

## 2. 物理 ER 図（MySQL テーブル）

```mermaid
erDiagram
    boards ||--|{ lists : "fk_lists_board"
    lists ||--|{ cards : "fk_cards_list"

    boards {
        int_unsigned id PK "AUTO_INCREMENT"
        varchar_255 title "NOT NULL"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
        timestamp updated_at "ON UPDATE CURRENT_TIMESTAMP"
    }
    lists {
        int_unsigned id PK "AUTO_INCREMENT"
        int_unsigned board_id FK "NOT NULL"
        varchar_255 title "NOT NULL"
        int_unsigned sort_order "DEFAULT 0"
        timestamp created_at
        timestamp updated_at
    }
    cards {
        int_unsigned id PK "AUTO_INCREMENT"
        int_unsigned list_id FK "NOT NULL"
        text title "NOT NULL"
        int_unsigned sort_order "DEFAULT 0"
        timestamp created_at
        timestamp updated_at
    }
```

---

## 3. リレーション詳細

```mermaid
erDiagram
    boards {
        int id PK "id"
    }
    lists {
        int id PK "id"
        int board_id FK "→ boards.id"
    }
    cards {
        int id PK "id"
        int list_id FK "→ lists.id"
    }

    boards ||--o{ lists : "board_id"
    lists ||--o{ cards : "list_id"
```

| FK 名 | 子テーブル.列 | 親テーブル.列 | ON DELETE | ON UPDATE |
| ----- | ------------- | ------------- | --------- | --------- |
| fk_lists_board | lists.board_id | boards.id | CASCADE | CASCADE |
| fk_cards_list | cards.list_id | lists.id | CASCADE | CASCADE |

---

## 4. データ例（seed 適用後）

```mermaid
erDiagram
    boards ||--|{ lists : ""
    lists ||--|{ cards : ""

    boards {
        int id "1"
        string title "マイタスクボード"
    }
    lists {
        int id "1"
        string title "やること"
    }
    lists {
        int id "2"
        string title "進行中"
    }
    lists {
        int id "3"
        string title "完了"
    }
    cards {
        int id "1"
        string title "はじめてのタスク"
    }
```

> **Note:** Mermaid の erDiagram では同一エンティティの複数インスタンス表現に制限があるため、データ例は上記のとおり簡略表示とする。実データは `seed.sql` を参照。

**seed.sql の内容**

```
boards (id=1, マイタスクボード)
  ├── lists (id=1, やること)
  │     └── cards (id=1, はじめてのタスク)
  ├── lists (id=2, 進行中)
  └── lists (id=3, 完了)
```

---

## 5. 関連ファイル

| ファイル | 内容 |
| -------- | ---- |
| `schema.sql` | CREATE TABLE（DDL） |
| `seed.sql` | 初期データ（DML） |
| `../要件定義書【タスク管理アプリ】.md` 第 7.5 章 | 列定義の詳細 |

---

## 6. スコープ外（ER に含めない）

シングルユーザー・マルチ非対応のため、以下のエンティティは **Phase 2 では定義しない**。

| エンティティ | 理由 |
| ------------ | ---- |
| users | ログイン・マルチユーザー非対応 |
| memberships | ボード共有非対応 |
| sessions | 認証なし |
