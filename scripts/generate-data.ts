import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const KNOWLEDGE_DIR = path.join(process.cwd(), '..', 'Knowledge', '05.研究领域')
const PAPERS_DIR = path.join(KNOWLEDGE_DIR, 'arxiv 论文解读')
const DAILY_DIR = path.join(KNOWLEDGE_DIR, 'arXiv 论文日报')
const DATA_DIR = path.join(process.cwd(), 'data')

// ---- Paper helpers ----

function extractOrgMetadata(content: string) {
  const sourceMatch = content.match(/#\+source:\s*(.+)/)
  const authorsMatch = content.match(/#\+authors:\s*(.+)/)
  return {
    source: sourceMatch ? sourceMatch[1].trim() : '',
    authors: authorsMatch ? authorsMatch[1].trim() : '',
  }
}

function extractOneLiner(content: string): string {
  const match = content.match(/\*一句话入选理由\*[：:]\s*(.+)/)
  return match ? match[1].trim() : ''
}

function getSlugFromFilepath(filepath: string): string {
  const basename = path.basename(filepath, '.md')
  return basename.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

function findMarkdownFiles(dir: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath))
    } else if (entry.name.endsWith('.md') && !entry.name.endsWith('.bak')) {
      results.push(fullPath)
    }
  }
  return results
}

function toDateStr(d: unknown, fallback: string): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10)
  if (typeof d === 'string' && d.length >= 10) return d.slice(0, 10)
  return fallback
}

// ---- Daily helpers ----

function parseDailyReportContent(content: string, date: string) {
  const stats = { total: 0, llm: 0, skill: 0, agent: 0 }
  const totalMatch = content.match(/\*\*论文总数\*\*[:：]\s*(\d+)/)
  const llmMatch = content.match(/\*\*LLM 相关\*\*[:：]\s*(\d+)/)
  const skillMatch = content.match(/\*\*skill 相关\*\*[:：]\s*(\d+)/)
  const agentMatch = content.match(/\*\*agent 相关\*\*[:：]\s*(\d+)/)
  if (totalMatch) stats.total = parseInt(totalMatch[1])
  if (llmMatch) stats.llm = parseInt(llmMatch[1])
  if (skillMatch) stats.skill = parseInt(skillMatch[1])
  if (agentMatch) stats.agent = parseInt(agentMatch[1])

  const categories: { name: string; count: number; papers: { title: string; authors: string; date: string; link: string; category: string; abstract: string }[] }[] = []
  const categoryRegex = /## .+?\((\d+)\s*篇\)\s*\n([\s\S]*?)(?=\n## |$)/g
  let catMatch
  while ((catMatch = categoryRegex.exec(content)) !== null) {
    const count = parseInt(catMatch[1])
    const section = catMatch[2]
    const headerMatch = catMatch[0].match(/## .+?\(/)
    const name = headerMatch ? headerMatch[0].replace(/##\s*/, '').replace(/\s*\(/, '').trim() : ''
    const papers: { title: string; authors: string; date: string; link: string; category: string; abstract: string }[] = []
    const paperRegex = /### \d+\.\s+(.+?)\n\s*- \*\*作者\*\*[:：]\s*(.+?)\n\s*- \*\*日期\*\*[:：]\s*(.+?)\n\s*- \*\*链接\*\*[:：]\s*\[(.+?)\]\((.+?)\)\n\s*- \*\*分类\*\*[:：]\s*(.+?)\n\s*\n\s*\*\*摘要\*\*[:：]\s*\n>\s*([\s\S]*?)(?=\n\s*### |\n\s*## |$)/g
    let paperMatch
    while ((paperMatch = paperRegex.exec(section)) !== null) {
      papers.push({
        title: paperMatch[1].trim(),
        authors: paperMatch[2].trim(),
        date: paperMatch[3].trim(),
        link: paperMatch[5].trim(),
        category: paperMatch[6].trim(),
        abstract: paperMatch[7].trim(),
      })
    }
    categories.push({ name, count, papers })
  }
  return { date, slug: date, stats, categories }
}

// ---- Main ----

console.log('📦 Generating data files...')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

// Papers
const files = findMarkdownFiles(PAPERS_DIR).filter(f => {
  const basename = path.basename(f)
  return basename.includes('-paper-') || basename.includes('-论文解读') || basename.includes('-论文精读')
})

const papers = files.map(filepath => {
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  const orgMeta = extractOrgMetadata(content)
  const slug = getSlugFromFilepath(filepath)
  const dir = path.dirname(filepath)
  const basename = path.basename(filepath, '.md')
  const cardPng = path.join(dir, `${basename.replace('-paper-', '-card-')}.png`)
  const cardImage = fs.existsSync(cardPng) ? path.basename(cardPng) : undefined
  return {
    slug,
    title: data.title || slug,
    date: toDateStr(data.date, basename.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || ''),
    source: data.source || orgMeta.source || 'arXiv',
    authors: orgMeta.authors || '',
    tags: data.tags || [],
    content,
    cardImage,
    oneLiner: extractOneLiner(content),
  }
}).sort((a, b) => b.date.localeCompare(a.date))

console.log(`  📖 Found ${papers.length} paper interpretations`)

const papersIndex = papers.map(({ content: _, ...rest }) => rest)
fs.writeFileSync(path.join(DATA_DIR, 'papers-index.json'), JSON.stringify(papersIndex, null, 2), 'utf-8')
console.log(`  ✅ papers-index.json (${papersIndex.length} items)`)

const papersDir = path.join(DATA_DIR, 'papers')
if (!fs.existsSync(papersDir)) fs.mkdirSync(papersDir, { recursive: true })
for (const paper of papers) {
  fs.writeFileSync(path.join(papersDir, `${paper.slug}.json`), JSON.stringify(paper, null, 2), 'utf-8')
}
console.log(`  ✅ papers/ (${papers.length} detail files)`)

// Daily reports
const dailyFiles = fs.existsSync(DAILY_DIR)
  ? fs.readdirSync(DAILY_DIR).filter(f => f.endsWith('-arXiv 日报.md') || f.endsWith('-论文日报.md'))
  : []

const reports = dailyFiles.map(f => {
  const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : ''
  const content = fs.readFileSync(path.join(DAILY_DIR, f), 'utf-8')
  return parseDailyReportContent(content, date)
}).filter(r => r.date).sort((a, b) => b.date.localeCompare(a.date))

console.log(`  📅 Found ${reports.length} daily reports`)
fs.writeFileSync(path.join(DATA_DIR, 'daily-reports.json'), JSON.stringify(reports, null, 2), 'utf-8')
console.log(`  ✅ daily-reports.json (${reports.length} items)`)

// Top5
const top5Files = fs.existsSync(DAILY_DIR)
  ? fs.readdirSync(DAILY_DIR).filter(f => f.endsWith('-Top5 精选.md'))
  : []

const top5 = top5Files.map(f => {
  const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : ''
  const raw = fs.readFileSync(path.join(DAILY_DIR, f), 'utf-8')
  const content = raw.replace(/^---[\s\S]*?---\s*/, '')
  const papersList: { rank: number; title: string; oneLiner: string; interpretationLink?: string }[] = []
  const tableRegex = /\|\s*(\d)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g
  let match
  while ((match = tableRegex.exec(content)) !== null) {
    const rank = parseInt(match[1])
    if (rank >= 1 && rank <= 5) {
      const linkMatch = match[4].match(/\[解读\]\((.+?)\)/)
      papersList.push({ rank, title: match[2].trim(), oneLiner: match[3].trim(), interpretationLink: linkMatch ? linkMatch[1] : undefined })
    }
  }
  return { date, slug: date, papers: papersList, criteria: [] }
}).filter(s => s.date && s.papers.length > 0).sort((a, b) => b.date.localeCompare(a.date))

console.log(`  🏆 Found ${top5.length} top5 selections`)
fs.writeFileSync(path.join(DATA_DIR, 'top5.json'), JSON.stringify(top5, null, 2), 'utf-8')
console.log(`  ✅ top5.json (${top5.length} items)`)

console.log('  🎉 Done!')
