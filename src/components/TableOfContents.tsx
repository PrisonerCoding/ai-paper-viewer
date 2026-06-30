'use client'

import { useState, useEffect, useMemo } from 'react'

interface Section {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  sections: Section[]
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  // Deduplicate sections by id
  const uniqueSections = useMemo(() => {
    const seen = new Set<string>()
    return sections.filter(({ id }) => {
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
  }, [sections])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    uniqueSections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [uniqueSections])

  if (uniqueSections.length === 0) return null

  return (
    <nav className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        目录
      </h3>
      <ul className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
        {uniqueSections.map(({ id, title, level }, idx) => (
          <li key={`${id}-${idx}`}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`block py-1 px-2 text-sm rounded transition-colors ${
                level === 3 ? 'pl-6' : 'pl-2'
              } ${
                activeId === id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {title.length > 30 ? title.slice(0, 30) + '...' : title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
