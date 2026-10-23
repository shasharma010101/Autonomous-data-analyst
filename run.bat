@echo off
title Autonomous Data Analyst - Server
color 0E
cls
echo ======================================================================
echo                 AUTONOMOUS DATA ANALYST - AI AGENT
echo               Local Web Server & Application Launcher
echo ======================================================================
echo.
echo  [*] Starting Autonomous Data Analyst Server...
echo  [*] Target URL: http://localhost:8000/
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
if %errorlevel% neq 0 (
    echo [!] Fallback: Opening index.html directly in browser...
    start "" "%~dp0index.html"
)
pause
