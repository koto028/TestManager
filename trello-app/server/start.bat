@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo [エラー] Node.js が見つかりません。
  echo https://nodejs.org/ から LTS をインストールし、ターミナルを開き直してください。
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo npm install を実行します...
  call npm install
  if errorlevel 1 (
    echo [エラー] npm install に失敗しました。
    pause
    exit /b 1
  )
)

if not exist ".env" (
  echo .env がありません。.env.example をコピーして DB 設定を編集してください。
  copy .env.example .env
)

echo.
echo サーバーを起動します: http://localhost:3000/index.html
echo 停止するには Ctrl+C
echo.
node server.js
