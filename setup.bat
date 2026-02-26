@echo off
echo Setting up BountyAI Security Scanner...
echo.

REM Install root dependencies
echo Installing frontend dependencies...
call npm install

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
cd ..

REM Create backend .env file if it doesn't exist
if not exist backend\.env (
    echo Creating backend .env file...
    copy backend\.env.example backend\.env
    echo Created backend\.env
)

echo.
echo Setup complete!
echo.
echo To start the application:
echo   npm run start        # Start both frontend ^& backend
echo.
echo Or run separately:
echo   npm run dev          # Frontend only (http://localhost:5173)
echo   npm run backend      # Backend only (http://localhost:3001)
echo.
echo See README.md for more information
pause
