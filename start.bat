@echo off
REM BloodLink Startup Script for Windows

echo.
echo 8 BloodLink Startup Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed.
    echo   Please download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check MySQL
echo.
echo Checking MySQL connection...
mysql -u root -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Could not connect to MySQL
    echo   Make sure MySQL is installed and running
    echo.
)

REM Start backend
echo.
echo Starting BloodLink Backend Server...
echo    Server: http://localhost:3000
cd backend
call npm install >nul 2>&1
start "BloodLink Backend" npm run dev
timeout /t 3
cd ..

REM Start frontend
echo.
echo Starting BloodLink Frontend Server...
echo    Server: http://localhost:5173
call npm install >nul 2>&1
start "BloodLink Frontend" npm run dev

echo.
echo ========================================
echo [OK] BloodLink is running!
echo.
echo Open your browser: http://localhost:5173
echo.
echo Available Logins:
echo   - Donor:    http://localhost:5173/login-donor.html
echo   - Hospital: http://localhost:5173/login-hospital.html
echo   - Staff:    http://localhost:5173/login-staff.html
echo.
echo Press any key to continue...
echo ========================================
pause
