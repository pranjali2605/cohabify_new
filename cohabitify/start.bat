@echo off
echo Starting CoHabitify Full-Stack Application...
echo.

echo Starting MongoDB (if running locally)...
echo Make sure MongoDB is installed and running on your system
echo.

echo Starting Backend Server...
start "CoHabitify Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start "CoHabitify Frontend" cmd /k "npm run dev"

echo.
echo CoHabitify is starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
