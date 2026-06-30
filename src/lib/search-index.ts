import type { Paper, DailyReport } from './types'

export interface SearchItem {
  type: 'paper' | 'daily'
  title: string
  date: string
  slug: string
  authors: string
  tags: string[]
  oneLiner: string
  abstract: string
}

export function buildSearchIndex(papers: Paper[], reports: DailyReport[]): SearchItem[] {
  const items: SearchItem[] = []

  for (const paper of papers) {
    items.push({
      type: 'paper',
      title: paper.title,
      date: paper.date,
      slug: paper.slug,
      authors: paper.authors,
      tags: paper.tags,
      oneLiner: paper.oneLiner || '',
      abstract: '',
    })
  }

  for (const report of reports) {
    for (const cat of report.categories) {
      for (const p of cat.papers) {
        items.push({
          type: 'daily',
          title: p.title,
          date: report.date,
          slug: report.slug,
          authors: p.authors,
          tags: [cat.name],
          oneLiner: '',
          abstract: p.abstract.slice(0, 200),
        })
      }
    }
  }

  return items
}
