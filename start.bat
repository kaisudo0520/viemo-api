@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist node_modules (
    echo [錯誤] 尚未安裝，請先執行 install.bat
    pause
    exit /b 1
)

echo ========================================
echo   Vimeo 字幕批量上傳工具
echo   http://localhost:3000
echo ========================================
echo.
echo 按 Ctrl+C 停止伺服器
echo.

start http://localhost:3000
node src/server.js
