import { getAllPapers } from '@/lib/papers'
import PaperCard from '@/components/PaperCard'
import PapersFilter from './PapersFilter'

export default function PapersPage() {
  const papers = getAllPapers()

  // Extract unique dates for filtering
  const dates = [...new Set(papers.map(p => p.date))].sort().reverse()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📖 论文解读</h1>
        <p className="text-gray-600">共 {papers.length} 篇深度解读</p>
      </div>

      <PapersFilter papers={papers} dates={dates} />
    </div>
  )
}
