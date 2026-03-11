@echo off
chcp 65001 >nul
echo ========================================
echo   Vimeo 字幕批量上傳工具 - 安裝
echo ========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [錯誤] 未偵測到 Node.js，請先安裝：https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js %NODE_VER%
echo.
echo 正在安裝套件...
echo.

cd /d "%~dp0"
npm install

if %errorlevel% neq 0 (
    echo.
    echo [錯誤] 安裝失敗，請檢查上方錯誤訊息
    pause
    exit /b 1
)

echo.
echo ========================================
echo   安裝完成！執行 start.bat 啟動工具
echo ========================================
echo.
pause
