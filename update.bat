@echo off
chcp 65001 >nul
echo [1/3] Syncing data from Obsidian...
call pnpm update

echo.
echo [2/3] Data summary:
for /f %%i in ('findstr /c:"slug" data\papers-index.json ^| find /c "slug"') do set papers=%%i
echo   Papers: %papers%

echo.
set /p confirm="[3/3] Push to GitHub? (y/n): "
if /i "%confirm%"=="y" (
    git add -A
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do set today=%%c-%%a-%%b
    git commit -m "data: update %today%"
    git push origin master
    echo Done! GitHub Actions will deploy automatically.
) else (
    echo Skipped push. Data updated locally only.
)
pause
