import Link from 'next/link'
import type { Top5Selection } from '@/lib/types'

interface Top5TableProps {
  selection: Top5Selection
}

export default function Top5Table({ selection }: Top5TableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          🏆 Top5 精选 — {selection.date}
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {selection.papers.map(paper => (
          <div key={paper.rank} className="px-5 py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                {paper.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{paper.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{paper.oneLiner}</p>
              </div>
              {paper.interpretationLink && (
                <Link
                  href={`/papers/${extractSlugFromLink(paper.interpretationLink)}`}
                  className="text-xs text-blue-600 hover:text-blue-800 shrink-0"
                >
                  解读 →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function extractSlugFromLink(link: string): string {
  // Link format: ./arxiv 论文解读/2026-06-30-paper-xxx.md
  const basename = link.split('/').pop() || ''
  return basename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
}
