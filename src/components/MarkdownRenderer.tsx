import { remark } from 'remark'
import html from 'remark-html'

interface MarkdownRendererProps {
  content: string
}

export default async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Remove org-mode metadata lines
  const cleaned = content
    .replace(/^#\+.*$/gm, '')
    .replace(/^\* 【.*】\*$/gm, '')

  const processed = await remark().use(html, { sanitize: false }).process(cleaned)
  const htmlContent = processed.toString()

  return (
    <div
      className="prose prose-gray max-w-none
        prose-headings:scroll-mt-20
        prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4
        prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-lg prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-2
        prose-p:leading-7 prose-p:mb-4
        prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:px-3 prose-th:py-2 prose-th:bg-gray-50
        prose-td:border prose-td:border-gray-300 prose-td:px-3 prose-td:py-2
        prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline
        prose-strong:font-semibold
        prose-ul:list-disc prose-ol:list-decimal
        prose-li:my-1"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
