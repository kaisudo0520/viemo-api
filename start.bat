@echo off
chcp 65001 >nul 2>&1
echo [DEBUG] Starting...

cd /d "%~dp0"
echo [DEBUG] Script dir: %CD%

if not exist node_modules (
    echo [ERROR] Not installed. Please run install.bat first
    pause
    exit /b 1
)

echo [DEBUG] node_modules found
echo.
echo ========================================
echo   Vimeo Subtitle Upload Tool
echo   http://localhost:3000
echo ========================================
echo.
echo Press Ctrl+C to stop server
echo.

start http://localhost:3000

node src/server.js
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server failed to start
    echo Check if port 3000 is already in use
    pause
    exit /b %errorlevel%
)
