import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'search-index.json')

console.log('🔍 Generating search index...')

interface SearchItem {
  type: 'paper' | 'daily'
  title: string
  date: string
  slug: string
  authors: string
  tags: string[]
  oneLiner: string
  abstract: string
}

const items: SearchItem[] = []

// Load papers
const papersIndexPath = path.join(DATA_DIR, 'papers-index.json')
if (fs.existsSync(papersIndexPath)) {
  const papers = JSON.parse(fs.readFileSync(papersIndexPath, 'utf-8'))
  for (const p of papers) {
    items.push({
      type: 'paper',
      title: p.title,
      date: p.date,
      slug: p.slug,
      authors: p.authors || '',
      tags: p.tags || [],
      oneLiner: p.oneLiner || '',
      abstract: '',
    })
  }
  console.log(`  📖 Found ${papers.length} paper interpretations`)
}

// Load daily reports
const reportsPath = path.join(DATA_DIR, 'daily-reports.json')
if (fs.existsSync(reportsPath)) {
  const reports = JSON.parse(fs.readFileSync(reportsPath, 'utf-8'))
  for (const r of reports) {
    for (const cat of r.categories) {
      for (const p of cat.papers) {
        items.push({
          type: 'daily',
          title: p.title,
          date: r.date,
          slug: r.slug,
          authors: p.authors || '',
          tags: [cat.name],
          oneLiner: '',
          abstract: (p.abstract || '').slice(0, 200),
        })
      }
    }
  }
  console.log(`  📅 Found ${reports.length} daily reports`)
}

console.log(`  📊 Total search items: ${items.length}`)

const outputDir = path.dirname(OUTPUT_FILE)
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(items, null, 2), 'utf-8')
console.log(`  ✅ Written to ${OUTPUT_FILE}`)
