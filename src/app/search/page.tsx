'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { Suspense } from 'react'

interface SearchItem {
  type: 'paper' | 'daily'
  title: string
  date: string
  slug: string
  authors: string
  oneLiner: string
  abstract: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchIndex, setSearchIndex] = useState<SearchItem[]>([])

  useEffect(() => {
    fetch('/search-index.json')
      .then(r => r.json())
      .then(data => setSearchIndex(data))
      .catch(() => setSearchIndex([]))
  }, [])

  const fuse = useMemo(
    () =>
      new Fuse(searchIndex, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'oneLiner', weight: 0.3 },
          { name: 'authors', weight: 0.2 },
          { name: 'abstract', weight: 0.1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [searchIndex]
  )

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      const fuseResults = fuse.search(query, { limit: 50 })
      setResults(fuseResults.map(r => r.item))
      setLoading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, fuse])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 搜索论文</h1>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="输入论文标题、作者、关键词..."
          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          autoFocus
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Results */}
      {loading && <p className="text-gray-500 text-center py-8">搜索中...</p>}

      {!loading && query && results.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          没有找到匹配 &ldquo;{query}&rdquo; 的结果
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">找到 {results.length} 条结果</p>
          {results.map((item, idx) => (
            <Link
              key={`${item.type}-${item.slug}-${idx}`}
              href={item.type === 'paper' ? `/papers/${item.slug}` : `/daily/${item.slug}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded shrink-0">
                  {item.type === 'paper' ? '解读' : '日报'}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-1">
                📅 {item.date} {item.authors && `· 👤 ${item.authors}`}
              </div>
              {item.oneLiner && (
                <p className="text-sm text-gray-600 line-clamp-2">{item.oneLiner}</p>
              )}
              {item.abstract && !item.oneLiner && (
                <p className="text-sm text-gray-600 line-clamp-2">{item.abstract}</p>
              )}
            </Link>
          ))}
        </div>
      )}

      {!query && (
        <p className="text-gray-400 text-center py-12">
          输入关键词开始搜索
        </p>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">加载中...</div>}>
      <SearchContent />
    </Suspense>
  )
}
