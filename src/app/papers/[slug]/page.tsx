import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPaperSlugs, getPaperBySlug } from '@/lib/papers'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import PaperHeader from '@/components/PaperHeader'
import TableOfContents from '@/components/TableOfContents'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPaperSlugs().map(slug => ({ slug }))
}

function extractMetadata(content: string) {
  const readingTime = content.match(/>\s*\*\*阅读时间\*\*[:：]\s*(.+)/)?.[1]?.trim() || ''
  const paperTitle = content.match(/>\s*\*\*论文\*\*[:：]\s*(.+)/)?.[1]?.trim() || ''
  const authors = content.match(/>\s*\*\*作者\*\*[:：]\s*(.+)/)?.[1]?.trim() || ''
  const institution = content.match(/>\s*\*\*机构\*\*[:：]\s*(.+)/)?.[1]?.trim() || ''
  const arxiv = content.match(/>\s*\*\*arXiv\*\*[:：]\s*\[(.+?)\]\((.+?)\)/)
  const arxivId = arxiv?.[1] || ''
  const arxivLink = arxiv?.[2] || ''
  const category = content.match(/>\s*\*\*分类\*\*[:：]\s*(.+)/)?.[1]?.trim() || ''
  const reason = content.match(/>\s*\*\*入选理由\*\*[:：]\s*(.+)/)?.[1]?.trim() || ''
  return { readingTime, paperTitle, authors, institution, arxivId, arxivLink, category, reason }
}

function extractSections(content: string) {
  const sections: { id: string; title: string; level: number }[] = []
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = title.toLowerCase().replace(/[^\w一-鿿]+/g, '-').replace(/^-|-$/g, '')
    sections.push({ id, title, level })
  }
  return sections
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { slug } = await params
  const paper = getPaperBySlug(slug)

  if (!paper) {
    notFound()
  }

  // Remove frontmatter from content for rendering
  const contentWithoutFrontmatter = paper.content.replace(/^---[\s\S]*?---\s*/, '')
  const metadata = extractMetadata(paper.content)
  const sections = extractSections(contentWithoutFrontmatter)

  // Add id attributes to headings for anchor links
  const processedContent = contentWithoutFrontmatter.replace(
    /^(#{2,3})\s+(.+)$/gm,
    (match, hashes, title) => {
      const id = title.trim().toLowerCase().replace(/[^\w一-鿿]+/g, '-').replace(/^-|-$/g, '')
      return `${hashes} <a id="${id}"></a>${title}`
    }
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">首页</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/papers" className="hover:text-blue-600 transition-colors">论文解读</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-700 truncate max-w-[300px] inline-block align-bottom">{paper.title}</span>
      </nav>

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Paper Header Card */}
          <PaperHeader
            title={paper.title}
            date={paper.date}
            metadata={metadata}
            oneLiner={paper.oneLiner}
            tags={paper.tags}
          />

          {/* Card Image */}
          {paper.cardImage && (
            <div className="mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <img
                  src={`/ai-paper-viewer/cards/${paper.cardImage}`}
                  alt={paper.title}
                  className="w-full max-w-2xl mx-auto rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 lg:p-10">
              <MarkdownRenderer content={processedContent} />
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <Link
              href="/papers"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回论文列表
            </Link>
          </div>
        </div>

        {/* Sidebar - Table of Contents */}
        {sections.length > 0 && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <TableOfContents sections={sections} />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
