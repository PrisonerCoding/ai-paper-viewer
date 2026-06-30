import Link from 'next/link'
import { getAllPapers } from '@/lib/papers'
import { getAllTop5Selections } from '@/lib/daily'
import PaperCard from '@/components/PaperCard'
import Top5Table from '@/components/Top5Table'
import SearchBar from '@/components/SearchBar'

export default function HomePage() {
  const papers = getAllPapers()
  const top5Selections = getAllTop5Selections()
  const latestPapers = papers.slice(0, 12)
  const latestTop5 = top5Selections[0]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          📄 AI 论文查看器
        </h1>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          基于 arXiv 论文日报和论文解读，方便浏览和阅读 AI 领域最新研究
        </p>
        <div className="max-w-md mx-auto">
          <SearchBar />
        </div>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <span className="text-gray-500">
            📊 {papers.length} 篇解读
          </span>
          <span className="text-gray-500">
            📅 {top5Selections.length} 天日报
          </span>
        </div>
      </section>

      {/* Latest Top5 */}
      {latestTop5 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">🏆 最新 Top5 精选</h2>
            <Link href="/daily" className="text-sm text-blue-600 hover:text-blue-800">
              查看全部 →
            </Link>
          </div>
          <Top5Table selection={latestTop5} />
        </section>
      )}

      {/* Latest Papers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">📖 最新论文解读</h2>
          <Link href="/papers" className="text-sm text-blue-600 hover:text-blue-800">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestPapers.map(paper => (
            <PaperCard key={paper.slug} paper={paper} />
          ))}
        </div>
      </section>
    </div>
  )
}
