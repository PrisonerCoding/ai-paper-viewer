import fs from 'fs'
import path from 'path'
import type { Paper } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')

function loadPapersFromJson(): Paper[] {
  const indexPath = path.join(DATA_DIR, 'papers-index.json')
  if (!fs.existsSync(indexPath)) return []

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as Omit<Paper, 'content'>[]

  return index.map(item => {
    const detailPath = path.join(DATA_DIR, 'papers', `${item.slug}.json`)
    if (fs.existsSync(detailPath)) {
      const detail = JSON.parse(fs.readFileSync(detailPath, 'utf-8')) as Paper
      return detail
    }
    return { ...item, content: '' }
  })
}

let cachedPapers: Paper[] | null = null

export function getAllPapers(): Paper[] {
  if (cachedPapers) return cachedPapers
  cachedPapers = loadPapersFromJson()
  return cachedPapers
}

export function getPaperBySlug(slug: string): Paper | undefined {
  const papers = getAllPapers()
  return papers.find(p => p.slug === slug)
}

export function getAllPaperSlugs(): string[] {
  return getAllPapers().map(p => p.slug)
}
