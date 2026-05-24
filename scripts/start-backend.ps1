# バックエンド起動スクリプト（ポート 8080 を解放してから起動）
$PORT = 8080

$conn = Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    Write-Host "Port $PORT is in use. Stopping process (PID $($conn.OwningProcess))..." -ForegroundColor Yellow
    Stop-Process -Id $conn.OwningProcess -Force
    Start-Sleep -Seconds 2
}

Write-Host "Starting backend on port $PORT..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\backend"
& "./gradlew" bootRun
