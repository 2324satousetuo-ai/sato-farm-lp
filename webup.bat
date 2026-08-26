@echo off
chcp 65001 > nul
cd /d "C:\Users\節雄\OneDrive\デスクトップ\佐藤農園LP"

echo ================================
echo   佐藤農園LP　Webアップ開始
echo ================================
echo.

:: 日時を手入力
set /p PUBLISH_DATE="公開日時を入力してください（例：2026年8月27日 10:00公開）: "

echo.
echo 【公開日時】%PUBLISH_DATE% で登録します。
echo.

git add .
git commit -m "%PUBLISH_DATE% 公開"

echo.
echo GitHubへアップ中...
git push

echo.
echo ================================
echo   完了！
echo   satofarms.com を確認してください
echo ================================
echo.
pause
