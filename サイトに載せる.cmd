@echo off
cd /d "%~dp0"
echo 原稿をサイト用HTMLに写し、GitHub へ送ります。
node scripts\publish-notes.mjs --push
echo.
pause
