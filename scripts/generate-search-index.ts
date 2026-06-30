import fs from 'fs'
import path from 'path'
import { getAllPapers } from '../src/lib/papers'
import { getAllDailyReports } from '../src/lib/daily'
import { buildSearchIndex } from '../src/lib/search-index'

const OUTPUT_DIR = path.join(process.cwd(), 'public')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'search-index.json')

console.log('🔍 Generating search index...')

const papers = getAllPapers()
console.log(`  📖 Found ${papers.length} paper interpretations`)

const reports = getAllDailyReports()
console.log(`  📅 Found ${reports.length} daily reports`)

const index = buildSearchIndex(papers, reports)
console.log(`  📊 Total search items: ${index.length}`)

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), 'utf-8')
console.log(`  ✅ Written to ${OUTPUT_FILE}`)
