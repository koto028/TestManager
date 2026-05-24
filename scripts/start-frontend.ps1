# フロントエンド起動スクリプト（ポート 5173 を解放してから起動）
$PORT = 5173

$conn = Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    Write-Host "Port $PORT is in use. Stopping process (PID $($conn.OwningProcess))..." -ForegroundColor Yellow
    Stop-Process -Id $conn.OwningProcess -Force
    Start-Sleep -Seconds 2
}

Write-Host "Starting frontend on port $PORT..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\frontend"
npm run dev
