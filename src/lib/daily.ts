import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { DailyReport, DailyPaper, Top5Selection, Top5Item } from './types'

const DAILY_DIR = path.join(process.cwd(), '..', 'Knowledge', '05.研究领域', 'arXiv 论文日报')

function parseDailyReportContent(content: string, date: string): DailyReport {
  const stats = {
    total: 0,
    llm: 0,
    skill: 0,
    agent: 0,
  }

  // Parse stats
  const totalMatch = content.match(/\*\*论文总数\*\*[:：]\s*(\d+)/)
  const llmMatch = content.match(/\*\*LLM 相关\*\*[:：]\s*(\d+)/)
  const skillMatch = content.match(/\*\*skill 相关\*\*[:：]\s*(\d+)/)
  const agentMatch = content.match(/\*\*agent 相关\*\*[:：]\s*(\d+)/)

  if (totalMatch) stats.total = parseInt(totalMatch[1])
  if (llmMatch) stats.llm = parseInt(llmMatch[1])
  if (skillMatch) stats.skill = parseInt(skillMatch[1])
  if (agentMatch) stats.agent = parseInt(agentMatch[1])

  // Parse categories and papers
  const categories: DailyReport['categories'] = []
  const categoryRegex = /## .+?\((\d+)\s*篇\)\s*\n([\s\S]*?)(?=\n## |$)/g
  let catMatch

  while ((catMatch = categoryRegex.exec(content)) !== null) {
    const count = parseInt(catMatch[1])
    const section = catMatch[2]

    // Extract category name from the header
    const headerMatch = catMatch[0].match(/## .+?\(/)
    const name = headerMatch ? headerMatch[0].replace(/##\s*/, '').replace(/\s*\(/, '').trim() : ''

    const papers: DailyPaper[] = []
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

  return {
    date,
    slug: date,
    stats,
    categories,
  }
}

export function getAllDailyReports(): DailyReport[] {
  if (!fs.existsSync(DAILY_DIR)) return []

  const files = fs.readdirSync(DAILY_DIR)
    .filter(f => f.endsWith('-arXiv 日报.md') || f.endsWith('-论文日报.md'))

  return files
    .map(f => {
      const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/)
      const date = dateMatch ? dateMatch[1] : ''
      const content = fs.readFileSync(path.join(DAILY_DIR, f), 'utf-8')
      return parseDailyReportContent(content, date)
    })
    .filter(r => r.date)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getDailyReportByDate(date: string): DailyReport | undefined {
  const reports = getAllDailyReports()
  return reports.find(r => r.date === date)
}

export function getAllTop5Selections(): Top5Selection[] {
  if (!fs.existsSync(DAILY_DIR)) return []

  const files = fs.readdirSync(DAILY_DIR)
    .filter(f => f.endsWith('-Top5 精选.md'))

  return files
    .map(f => {
      const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/)
      const date = dateMatch ? dateMatch[1] : ''
      const raw = fs.readFileSync(path.join(DAILY_DIR, f), 'utf-8')
      const { content } = matter(raw)

      // Parse table rows
      const papers: Top5Item[] = []
      const tableRegex = /\|\s*(\d)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g
      let match
      while ((match = tableRegex.exec(content)) !== null) {
        const rank = parseInt(match[1])
        if (rank >= 1 && rank <= 5) {
          // Extract link from the interpretation column
          const linkMatch = match[4].match(/\[解读\]\((.+?)\)/)
          papers.push({
            rank,
            title: match[2].trim(),
            oneLiner: match[3].trim(),
            interpretationLink: linkMatch ? linkMatch[1] : undefined,
          })
        }
      }

      return { date, slug: date, papers, criteria: [] }
    })
    .filter(s => s.date && s.papers.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
}
