@echo off
cd /d e:\SMT_Tool\backend
echo Installing authentication packages...
npm install jsonwebtoken bcryptjs
echo.
echo Done! Now restart the backend server.
pause
