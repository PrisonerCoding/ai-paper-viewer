import Link from 'next/link'
import type { Paper } from '@/lib/types'

interface PaperCardProps {
  paper: Paper
}

export default function PaperCard({ paper }: PaperCardProps) {
  return (
    <Link href={`/papers/${paper.slug}`}>
      <article className="group h-full bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs text-gray-500 shrink-0">{paper.date}</span>
          {paper.cardImage && (
            <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">有卡片</span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {paper.title}
        </h3>

        {paper.oneLiner && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{paper.oneLiner}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {paper.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  )
}
