@echo off
chcp 65001 >nul
echo 📦 从 Obsidian 同步数据...
call pnpm update

echo.
echo 📊 数据统计：
for /f %%i in ('findstr /c:"slug" data\papers-index.json ^| find /c "slug"') do set papers=%%i
echo   论文解读: %papers% 篇

echo.
set /p confirm="是否提交并推送到 GitHub? (y/n): "
if /i "%confirm%"=="y" (
    git add -A
    for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set today=%%a-%%b-%%c
    git commit -m "data: update papers and daily reports %today%"
    git push origin master
    echo ✅ 已推送到 GitHub，GitHub Actions 将自动部署
) else (
    echo ℹ️  已跳过推送，数据已更新到本地
)
pause
