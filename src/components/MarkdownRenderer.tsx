import { remark } from 'remark'
import html from 'remark-html'

interface MarkdownRendererProps {
  content: string
}

export default async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Remove org-mode metadata lines and image references
  const cleaned = content
    .replace(/^#\+.*$/gm, '')
    .replace(/^\* 【.*】\*$/gm, '')
    .replace(/!\[\[.*?\]\]/g, '') // Remove Obsidian image references

  const processed = await remark()
    .use(html, { sanitize: false })
    .process(cleaned)
  const htmlContent = processed.toString()

  return (
    <div
      className="prose prose-gray max-w-none
        prose-headings:scroll-mt-20
        prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-gray-200
        prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-gray-800
        prose-h3:text-lg prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-gray-700
        prose-p:leading-7 prose-p:mb-4 prose-p:text-gray-700
        prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-800
        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-code:text-pink-600 prose-code:font-mono
        prose-table:border-collapse prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm
        prose-th:border prose-th:border-gray-200 prose-th:px-4 prose-th:py-3 prose-th:bg-gray-50 prose-th:font-semibold prose-th:text-left
        prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-3
        prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline prose-a:decoration-blue-300 prose-a:underline-offset-2
        prose-strong:font-semibold prose-strong:text-gray-900
        prose-ul:list-disc prose-ol:list-decimal
        prose-li:my-1.5 prose-li:text-gray-700
        prose-hr:border-gray-200 prose-hr:my-8"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
