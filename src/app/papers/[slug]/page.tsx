import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPaperSlugs, getPaperBySlug } from '@/lib/papers'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPaperSlugs().map(slug => ({ slug }))
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { slug } = await params
  const paper = getPaperBySlug(slug)

  if (!paper) {
    notFound()
  }

  // Remove frontmatter from content for rendering
  const contentWithoutFrontmatter = paper.content.replace(/^---[\s\S]*?---\s*/, '')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/papers" className="hover:text-blue-600">论文解读</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{paper.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{paper.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>📅 {paper.date}</span>
          {paper.authors && <span>👤 {paper.authors}</span>}
          {paper.source && (
            <a
              href={paper.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              🔗 arXiv 原文
            </a>
          )}
        </div>
        {paper.oneLiner && (
          <p className="mt-3 text-gray-700 italic border-l-4 border-blue-300 pl-4">
            {paper.oneLiner}
          </p>
        )}
        {paper.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {paper.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Card Image */}
      {paper.cardImage && (
        <div className="mb-8">
          <img
            src={`/ai-paper-viewer/cards/${paper.cardImage}`}
            alt={paper.title}
            className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Content */}
      <article className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <MarkdownRenderer content={contentWithoutFrontmatter} />
      </article>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Link href="/papers" className="text-blue-600 hover:text-blue-800 text-sm">
          ← 返回论文列表
        </Link>
      </div>
    </div>
  )
}
