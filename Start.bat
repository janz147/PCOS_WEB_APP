@echo off
cd /d %~dp0

echo Starting PCOS Web App...
docker compose up -d --build

timeout /t 8 /nobreak >nul
start http://localhost

pause