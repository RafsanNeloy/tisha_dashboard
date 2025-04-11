@echo off

REM Navigate to the backend directory
cd backend

REM Start the backend server
start npm start

REM Navigate back to the frontend root directory
cd ..

REM Start the frontend server
start npm start