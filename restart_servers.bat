@echo off
echo ==========================================
echo   Wave - Restart All Servers
echo ==========================================
echo.
echo Killing all Node processes...
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul
echo.

echo Starting Backend (port 3002)...
start "Wave-Backend" cmd /k "cd /d e:\SMT_Tool\backend && npm run dev"
timeout /t 5 /nobreak >nul

echo Starting Dashboard (port 3000)...
start "Wave-Dashboard" cmd /k "cd /d e:\SMT_Tool\dashboard && npm start"
timeout /t 5 /nobreak >nul

echo Starting Frontend (port 3001)...
start "Wave-Frontend" cmd /k "cd /d e:\SMT_Tool\frontend && npm start"

echo.
echo ==========================================
echo   All servers starting! Check new windows.
echo ==========================================
pause
