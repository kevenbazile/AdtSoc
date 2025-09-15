@echo off
echo Ì∫Ä Starting Business Jarvis Demo Environment
echo ============================================

echo.
echo Ì≥¶ Installing dependencies...
call npm install

echo.
echo Ì¥ß Starting Business Jarvis backend...
echo   - Backend API: http://localhost:5000
echo   - n8n Editor: http://localhost:5678
echo.
echo ‚è≥ This may take 30-60 seconds to fully start...
echo.

call npm run dev
