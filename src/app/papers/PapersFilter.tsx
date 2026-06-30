'use client'

import { useState, useMemo } from 'react'
import type { Paper } from '@/lib/types'
import PaperCard from '@/components/PaperCard'

interface PapersFilterProps {
  papers: Paper[]
  dates: string[]
}

export default function PapersFilter({ papers, dates }: PapersFilterProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')

  const filtered = useMemo(
    () => (selectedDate ? papers.filter(p => p.date === selectedDate) : papers),
    [papers, selectedDate]
  )

  return (
    <div>
      {/* Date filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedDate('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedDate === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {dates.slice(0, 20).map(d => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedDate === d
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500 mb-4">
        {selectedDate ? `${selectedDate} · ${filtered.length} 篇` : `共 ${filtered.length} 篇`}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(paper => (
          <PaperCard key={paper.slug} paper={paper} />
        ))}
      </div>
    </div>
  )
}
