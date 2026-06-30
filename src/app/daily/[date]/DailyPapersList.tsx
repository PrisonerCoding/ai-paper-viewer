'use client'

import { useState, useMemo } from 'react'
import CategoryFilter from '@/components/CategoryFilter'

interface Paper {
  title: string
  authors: string
  date: string
  link: string
  category: string
  abstract: string
}

interface Category {
  name: string
  count: number
  papers: Paper[]
}

interface DailyPapersListProps {
  categories: string[]
  papersByCategory: Category[]
}

export default function DailyPapersList({ categories, papersByCategory }: DailyPapersListProps) {
  const [activeCategory, setActiveCategory] = useState('全部')

  const allCategories = ['全部', ...categories]

  const filteredPapers = useMemo(() => {
    if (activeCategory === '全部') {
      return papersByCategory.flatMap(c =>
        c.papers.map(p => ({ ...p, categoryName: c.name }))
      )
    }
    const cat = papersByCategory.find(c => c.name === activeCategory)
    return cat ? cat.papers.map(p => ({ ...p, categoryName: cat.name })) : []
  }, [papersByCategory, activeCategory])

  return (
    <div>
      <div className="mb-6">
        <CategoryFilter
          categories={allCategories}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      <div className="space-y-4">
        {filteredPapers.map((paper, idx) => (
          <article
            key={`${paper.title}-${idx}`}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 flex-1">{paper.title}</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full shrink-0">
                {paper.categoryName}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
              <span>👤 {paper.authors}</span>
              <span>📅 {paper.date}</span>
              <span>🏷 {paper.category}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
              {paper.abstract}
            </p>
            <a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              查看 arXiv 原文 →
            </a>
          </article>
        ))}
      </div>
    </div>
  )
}
