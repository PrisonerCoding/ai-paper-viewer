import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllDailyReports, getDailyReportByDate } from '@/lib/daily'
import DailyPapersList from './DailyPapersList'

interface PageProps {
  params: Promise<{ date: string }>
}

export function generateStaticParams() {
  return getAllDailyReports().map(r => ({ date: r.date }))
}

export default async function DailyDetailPage({ params }: PageProps) {
  const { date } = await params
  const report = getDailyReportByDate(date)

  if (!report) {
    notFound()
  }

  const categories = report.categories.map(c => c.name)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/daily" className="hover:text-blue-600">论文日报</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{report.date}</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          📄 arXiv 论文日报 — {report.date}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            📊 总计 {report.stats.total} 篇
          </span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            🤖 LLM {report.stats.llm} 篇
          </span>
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
            🛠 Skill {report.stats.skill} 篇
          </span>
          <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
            🤝 Agent {report.stats.agent} 篇
          </span>
        </div>
      </header>

      {/* Client-side filter + list */}
      <DailyPapersList categories={categories} papersByCategory={report.categories} />

      {/* Navigation */}
      <div className="mt-8">
        <Link href="/daily" className="text-blue-600 hover:text-blue-800 text-sm">
          ← 返回日报列表
        </Link>
      </div>
    </div>
  )
}
