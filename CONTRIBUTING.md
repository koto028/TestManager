# 開発ルール

## 基本原則

- **master ブランチへの直接プッシュは禁止**
- すべての変更は **Issue → ブランチ → PR** の順で行う
- PR は必ず関連 Issue を `closes #番号` で紐付ける

---

## 1. Issue を登録する

作業を始める前に、必ず GitHub Issue を作成する。

| ラベル | 用途 |
|--------|------|
| `feature` | 新機能の追加・改善 |
| `bug` | 不具合の修正 |
| `chore` | リファクタリング・依存更新・ドキュメント整備 |

Issue テンプレートを使用して、概要・目的・詳細を記入すること。

---

## 2. ブランチを作成する

Issue 番号を必ずブランチ名に含める。

### ブランチ命名規則

```
<type>/issue-<番号>-<説明>
```

| type | 用途 |
|------|------|
| `feature` | 新機能 |
| `fix` | バグ修正 |
| `chore` | リファクタリング・メンテナンス |
| `docs` | ドキュメントのみの変更 |

### 例

```
feature/issue-12-add-card-drag-drop
fix/issue-34-fix-board-loading-error
chore/issue-5-update-spring-boot
docs/issue-8-update-api-readme
```

### ブランチ作成コマンド

```bash
git switch -c feature/issue-<番号>-<説明>
```

---

## 3. 実装・コミット

コミットメッセージはプレフィックスを付けて日本語で書く。

```
feat: カードのドラッグ&ドロップに対応
fix: ボード読み込み時のエラーを修正
chore: Spring Boot を 3.4.2 に更新
docs: API の README を更新
```

---

## 4. Pull Request を作成する

PR 作成時のルール：

- タイトルは `[#Issue番号] 変更内容の概要` の形式
- 本文の `closes #番号` で Issue を紐付ける
- PR テンプレートの全項目を記入する

### 例

```
タイトル: [#12] カードのドラッグ&ドロップ機能を追加
```

---

## フロー全体図

```
Issue 作成
  ↓
ブランチ作成 (feature/issue-12-xxx)
  ↓
実装・コミット
  ↓
PR 作成 (closes #12 を記載)
  ↓
master へマージ
  ↓
ブランチ削除
```
