@echo off
cd /d "%~dp0"
echo 原稿をサイト用HTMLに写し、GitHub へ送ります。
node scripts\publish-notes.mjs --push
echo.
pause
exit /b

:: ===== 使い方メモ（この下は実行されません） =====
::
:: 【ターミナルでの実行】
::   .\サイトに載せる.cmd
::   または
::   npm run サイトに載せる
::
:: 【毎日の作業手順】
::   1. 日本語原稿を 原稿\blog\notes\ に置く（ファイル名は英数字とハイフン。例：satofarms-autumn-note.md）
::   2. 同じファイル名で英語を 原稿\blog-en\notes\ に置く
::   3. 2行目は日付だけ（日本語：2026.8.29　英語：August 29, 2026）
::   4. このファイルをダブルクリックする（または上のコマンド）
::   5. GitHub へ送ったあと、satofarms.com で表示を確認する
::
:: 写しだけ見て、まだ送りたくないとき：
::   npm run 原稿を写す
:: ================================================
