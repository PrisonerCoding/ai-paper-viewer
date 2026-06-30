import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Paper } from './types'

const PAPERS_DIR = path.join(process.cwd(), '..', 'Knowledge', '05.研究领域', 'arxiv 论文解读')

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
  // Remove date prefix like "2026-05-22-"
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

export function getAllPapers(): Paper[] {
  const files = findMarkdownFiles(PAPERS_DIR)

  const papers: Paper[] = files
    .filter(f => {
      const basename = path.basename(f)
      // Skip collection files and non-paper files
      return basename.includes('-paper-') || basename.includes('-论文解读') || basename.includes('-论文精读')
    })
    .map(filepath => {
      const raw = fs.readFileSync(filepath, 'utf-8')
      const { data, content } = matter(raw)
      const orgMeta = extractOrgMetadata(content)
      const slug = getSlugFromFilepath(filepath)

      // Find card image
      const dir = path.dirname(filepath)
      const basename = path.basename(filepath, '.md')
      const cardPng = path.join(dir, `${basename.replace('-paper-', '-card-')}.png`)
      const cardImage = fs.existsSync(cardPng) ? path.basename(cardPng) : undefined

      return {
        slug,
        title: data.title || slug,
        date: data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date || basename.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || ''),
        source: data.source || orgMeta.source || 'arXiv',
        authors: orgMeta.authors || '',
        tags: data.tags || [],
        content,
        cardImage,
        oneLiner: extractOneLiner(content),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  return papers
}

export function getPaperBySlug(slug: string): Paper | undefined {
  const papers = getAllPapers()
  return papers.find(p => p.slug === slug)
}

export function getAllPaperSlugs(): string[] {
  return getAllPapers().map(p => p.slug)
}
