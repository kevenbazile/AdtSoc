@echo off
echo ========================================
echo Business Jarvis Enterprise Installation
echo ========================================
echo.

echo Step 1: Installing Dependencies...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo Step 2: Setting up Business Jarvis...
mkdir C:\BusinessJarvis
cd C:\BusinessJarvis

echo Step 3: Extracting application files...
xcopy /E /I "%~dp0\app" "." >nul

echo Step 4: Installing backend dependencies...
cd backend
call npm install

echo Step 5: Setting up database...
call npx prisma generate
call npx prisma migrate deploy

echo Step 6: Installing frontend dependencies...
cd ..\frontend
call npm install

echo Step 7: Building production version...
call npm run build

echo Step 8: Creating Windows service...
cd ..\backend
call npm install -g pm2
call pm2 start ecosystem.config.js
call pm2 save
call pm2 startup

echo.
echo ========================================
echo Business Jarvis Installation Complete!
echo ========================================
echo.
echo Dashboard URL: http://localhost:3000
echo API URL: http://localhost:5000
echo.
echo Next Steps:
echo 1. Configure customer organization
echo 2. Set up monitoring agents
echo 3. Train customer personnel
echo.
pause
