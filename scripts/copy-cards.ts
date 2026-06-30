import fs from 'fs'
import path from 'path'

const SOURCE_DIR = path.join(process.cwd(), '..', 'Knowledge', '05.研究领域', 'arxiv 论文解读')
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'cards')

console.log('🖼️  Copying card images...')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

function findCardImages(dir: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findCardImages(fullPath))
    } else if (entry.name.endsWith('.png') && entry.name.includes('-card-')) {
      results.push(fullPath)
    }
  }
  return results
}

const cardImages = findCardImages(SOURCE_DIR)
let copied = 0

for (const img of cardImages) {
  const basename = path.basename(img)
  const dest = path.join(OUTPUT_DIR, basename)
  fs.copyFileSync(img, dest)
  copied++
}

console.log(`  ✅ Copied ${copied} card images to ${OUTPUT_DIR}`)
