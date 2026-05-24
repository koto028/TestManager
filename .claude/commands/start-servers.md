# start-servers

タスクマネージャーの全サーバー（DB・バックエンド・フロントエンド）を起動し、ボード画面が表示できる状態にする。

## 実行手順

以下を順番に行ってください。

### 1. Docker (PostgreSQL) を起動

```powershell
docker compose up -d
```

`taskmanager-db` コンテナが `healthy` になるまで待つ。

```powershell
docker compose ps
```

### 2. ポートの解放確認

8080・5173 を占有しているプロセスがあれば自動解放する。

```powershell
@(8080, 5173) | ForEach-Object {
  $conn = Get-NetTCPConnection -LocalPort $_ -State Listen -ErrorAction SilentlyContinue
  if ($conn) {
    Stop-Process -Id $conn.OwningProcess -Force
    Write-Host "Port $_ cleared."
  }
}
```

### 3. バックエンドを起動（ターミナル A）

```powershell
cd backend
.\gradlew bootRunSafe
```

または PowerShell スクリプトで起動：

```powershell
.\scripts\start-backend.ps1
```

起動確認：

```powershell
curl http://localhost:8080/api/health
```

`{"ok":true}` が返れば OK。

### 4. フロントエンドを起動（ターミナル B）

```powershell
cd frontend
npm run dev
```

`predev` フックが 5173 を自動解放してから Vite を起動する。

起動確認：

```powershell
curl -s http://localhost:5173/api/boards
```

### 5. ブラウザで確認

```powershell
Start-Process "http://localhost:5173"
Start-Process "http://localhost:5173/boards/1"
```

| 画面 | URL |
|------|-----|
| ボード一覧 | http://localhost:5173/ |
| ボード詳細 | http://localhost:5173/boards/1 |

## ポート一覧（変更禁止）

| サービス | ポート |
|---------|--------|
| PostgreSQL | 5432 |
| バックエンド | 8080 |
| フロントエンド | 5173 |

Vite の proxy 設定が `/api → localhost:8080` に固定されているため、ポートは変更しないこと。
