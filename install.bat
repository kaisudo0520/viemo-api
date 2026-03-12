@echo off
chcp 65001 >nul 2>&1
echo [DEBUG] Code page set
echo [DEBUG] Current dir: %CD%

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)

echo [DEBUG] Node.js found
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [DEBUG] Node version: %NODE_VER%

cd /d "%~dp0"
echo [DEBUG] Script dir: %CD%

echo.
echo ========================================
echo   Vimeo Subtitle Upload Tool - Install
echo ========================================
echo.

echo Installing packages...
npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Installation failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installation complete!
echo ========================================
echo.
echo Please run start.bat to launch
echo.
pause
