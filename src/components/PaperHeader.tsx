interface PaperMetadata {
  readingTime: string
  paperTitle: string
  authors: string
  institution: string
  arxivId: string
  arxivLink: string
  category: string
  reason: string
}

interface PaperHeaderProps {
  title: string
  date: string
  metadata: PaperMetadata
  oneLiner?: string
  tags: string[]
}

export default function PaperHeader({ title, date, metadata, oneLiner, tags }: PaperHeaderProps) {
  return (
    <header className="mb-8">
      {/* Main Title */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>

        {/* One Liner */}
        {oneLiner && (
          <p className="text-gray-700 italic border-l-4 border-blue-400 pl-4 mb-6 text-lg">
            {oneLiner}
          </p>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {metadata.paperTitle && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">📄</span>
              <div>
                <span className="text-gray-500">论文</span>
                <p className="text-gray-900 font-medium">{metadata.paperTitle}</p>
              </div>
            </div>
          )}

          {metadata.authors && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">👤</span>
              <div>
                <span className="text-gray-500">作者</span>
                <p className="text-gray-900">{metadata.authors}</p>
              </div>
            </div>
          )}

          {metadata.institution && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">🏛️</span>
              <div>
                <span className="text-gray-500">机构</span>
                <p className="text-gray-900">{metadata.institution}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">📅</span>
            <div>
              <span className="text-gray-500">日期</span>
              <p className="text-gray-900">{date}</p>
            </div>
          </div>

          {metadata.category && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">🏷️</span>
              <div>
                <span className="text-gray-500">分类</span>
                <p className="text-gray-900">{metadata.category}</p>
              </div>
            </div>
          )}

          {metadata.readingTime && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">⏱️</span>
              <div>
                <span className="text-gray-500">阅读时间</span>
                <p className="text-gray-900">{metadata.readingTime}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
          {metadata.arxivLink && (
            <a
              href={metadata.arxivLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              arXiv 原文
              {metadata.arxivId && <span className="text-gray-300">({metadata.arxivId})</span>}
            </a>
          )}
        </div>
      </div>

      {/* Reason for Selection */}
      {metadata.reason && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">⭐</span>
            <div>
              <span className="text-amber-800 font-medium text-sm">入选理由</span>
              <p className="text-amber-900 mt-1">{metadata.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  )
}
