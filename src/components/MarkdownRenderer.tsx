import { remark } from 'remark'
import html from 'remark-html'

interface MarkdownRendererProps {
  content: string
}

function preprocessContent(content: string): string {
  let processed = content

  // Remove org-mode metadata lines and image references
  processed = processed
    .replace(/^#\+.*$/gm, '')
    .replace(/^\* 【.*】\*$/gm, '')
    .replace(/!\[\[.*?\]\]/g, '')

  // Convert Part headers into styled section dividers
  processed = processed.replace(
    /^## (Part [A-D] ·.+)$/gm,
    '<div class="section-divider"><h2 class="section-title">$1</h2></div>'
  )

  // Convert emoji-prefixed h3 headers into styled cards
  processed = processed.replace(
    /^### (🎯|🔬|💡|🧠|🔍|🚀|🗺️|📌|💬|🌊|🔗|⭐).+$/gm,
    (match) => {
      const title = match.replace('### ', '')
      return `<div class="insight-card"><h3 class="insight-title">${title}</h3></div>`
    }
  )

  // Convert "一句话" italic lines into highlight boxes
  processed = processed.replace(
    /^\*一句话：(.+)\*$/gm,
    '<div class="one-liner-box"><p class="one-liner-text">💡 $1</p></div>'
  )

  // Convert "核心信息" lists into styled boxes
  processed = processed.replace(
    /\*\*核心信息：\*\*\n((?:- .+\n?)+)/g,
    '<div class="core-info-box"><p class="core-info-title">📋 核心信息</p>$1</div>'
  )

  // Convert checklist items
  processed = processed.replace(
    /^- \[x\] (.+)$/gm,
    '<div class="checklist-item">✅ $1</div>'
  )

  return processed
}

export default async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const cleaned = preprocessContent(content)

  const processed = await remark()
    .use(html, { sanitize: false })
    .process(cleaned)
  const htmlContent = processed.toString()

  return (
    <div className="paper-content">
      <style dangerouslySetInnerHTML={{ __html: `
        .paper-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
          color: #1f2937;
          line-height: 1.8;
        }
        .paper-content h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #e5e7eb;
        }
        .paper-content h2 {
          font-size: 1.375rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .paper-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .paper-content p {
          margin-bottom: 1rem;
          line-height: 1.8;
        }
        .paper-content strong {
          font-weight: 600;
          color: #111827;
        }
        .paper-content em {
          color: #6b7280;
          font-style: italic;
        }
        .paper-content a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .paper-content a:hover {
          color: #1d4ed8;
        }
        .paper-content ul, .paper-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .paper-content ul {
          list-style-type: disc;
        }
        .paper-content ol {
          list-style-type: decimal;
        }
        .paper-content li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        .paper-content blockquote {
          border-left: 4px solid #3b82f6;
          background: linear-gradient(135deg, #eff6ff, #f0f9ff);
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          border-radius: 0 0.75rem 0.75rem 0;
          font-size: 0.95rem;
        }
        .paper-content blockquote p {
          margin-bottom: 0.5rem;
          color: #374151;
        }
        .paper-content blockquote p:last-child {
          margin-bottom: 0;
        }
        .paper-content pre {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #e2e8f0;
          padding: 1.25rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid #334155;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .paper-content code {
          background: #f1f5f9;
          color: #e11d48;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }
        .paper-content pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        .paper-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .paper-content th {
          background: #f8fafc;
          font-weight: 600;
          text-align: left;
          padding: 0.75rem 1rem;
          border-bottom: 2px solid #e2e8f0;
        }
        .paper-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .paper-content tr:hover td {
          background: #f8fafc;
        }
        .paper-content hr {
          border: none;
          height: 2px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 2rem 0;
        }

        /* Special sections */
        .section-divider {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          margin: 2rem 0 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
        }
        .section-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          margin: 0 !important;
          color: white !important;
          border: none !important;
          padding: 0 !important;
        }
        .insight-card {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 1px solid #f59e0b;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          margin: 1.5rem 0;
        }
        .insight-title {
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          color: #92400e !important;
          margin: 0 !important;
        }
        .one-liner-box {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border-left: 4px solid #10b981;
          border-radius: 0 0.75rem 0.75rem 0;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
        }
        .one-liner-text {
          font-weight: 500;
          color: #065f46;
          margin: 0;
          font-size: 1.05rem;
        }
        .core-info-box {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 0.75rem;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
        }
        .core-info-title {
          font-weight: 600;
          color: #0369a1;
          margin-bottom: 0.5rem;
        }
        .checklist-item {
          padding: 0.5rem 0;
          color: #374151;
        }
      `}} />
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  )
}
