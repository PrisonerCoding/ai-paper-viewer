# AI 论文查看器

基于 Obsidian 知识库中的 arXiv 论文日报和论文解读构建的静态网站。

## 功能

- 📖 **论文解读浏览** — 298+ 篇深度论文解读，按日期筛选
- 📅 **论文日报查看** — 88+ 天日报，LLM/Skill/Agent 分类筛选
- 🏆 **Top5 精选** — 每日精选论文卡片展示
- 🔍 **全文搜索** — Fuse.js 客户端搜索，支持标题、作者、关键词

## 技术栈

- Next.js 14 (App Router, Static Export)
- Tailwind CSS + Typography
- gray-matter + remark (Markdown 解析)
- Fuse.js (客户端搜索)
- GitHub Pages (部署)

## 开发

```bash
# 安装依赖
pnpm install

# 生成搜索索引 + 复制卡片图片
pnpm prebuild

# 启动开发服务器
pnpm dev

# 构建静态站点
pnpm build
```

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页
│   ├── papers/               # 论文解读列表 + 详情
│   ├── daily/                # 论文日报列表 + 详情
│   └── search/               # 搜索页面
├── components/               # UI 组件
└── lib/                      # 数据解析层
scripts/
├── generate-search-index.ts  # 生成搜索索引
└── copy-cards.ts             # 复制卡片图片
```

## 数据来源

数据来自 Obsidian 知识库：
- `Knowledge/05.研究领域/arxiv 论文解读/` — 论文深度解读
- `Knowledge/05.研究领域/arXiv 论文日报/` — 每日论文日报

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。
