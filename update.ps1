# AI Paper Viewer - Quick Update Script
# Double-click to run, or: powershell -ExecutionPolicy Bypass -File update.ps1

Write-Host "[1/3] Syncing data from Obsidian..." -ForegroundColor Cyan
pnpm update

Write-Host ""
Write-Host "[2/3] Data summary:" -ForegroundColor Cyan
$papers = (Get-Content data/papers-index.json | Select-String '"slug"').Count
Write-Host "  Papers: $papers"

Write-Host ""
$confirm = Read-Host "[3/3] Push to GitHub? (y/n)"
if ($confirm -eq 'y' -or $confirm -eq 'Y') {
    git add -A
    $today = Get-Date -Format "yyyy-MM-dd"
    git commit -m "data: update $today"
    git push origin master
    Write-Host "Done! GitHub Actions will deploy automatically." -ForegroundColor Green
} else {
    Write-Host "Skipped push. Data updated locally only." -ForegroundColor Yellow
}
Write-Host ""
Read-Host "Press Enter to exit"
