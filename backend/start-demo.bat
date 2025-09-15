@echo off
echo � Starting Business Jarvis Demo Environment
echo ============================================

echo.
echo � Installing dependencies...
call npm install

echo.
echo � Starting Business Jarvis backend...
echo   - Backend API: http://localhost:5000
echo   - n8n Editor: http://localhost:5678
echo.
echo ⏳ This may take 30-60 seconds to fully start...
echo.

call npm run dev
