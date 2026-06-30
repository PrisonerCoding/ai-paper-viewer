#!/bin/bash
# 快速更新脚本 - 从 Obsidian 同步数据并推送

set -e

echo "📦 从 Obsidian 同步数据..."
pnpm update

echo ""
echo "📊 数据统计："
echo "  论文解读: $(cat data/papers-index.json | grep '"slug"' | wc -l) 篇"
echo "  论文日报: $(cat data/daily-reports-index.json | grep '"date"' | wc -l) 天"
echo "  Top5 精选: $(cat data/top5.json | grep '"date"' | wc -l) 天"

echo ""
read -p "是否提交并推送到 GitHub? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add -A
    git commit -m "data: update papers and daily reports $(date +%Y-%m-%d)"
    git push origin master
    echo "✅ 已推送到 GitHub，GitHub Actions 将自动部署"
else
    echo "ℹ️  已跳过推送，数据已更新到本地"
fi
