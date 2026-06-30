import Link from 'next/link'
import type { DailyReport } from '@/lib/types'

interface DailyCardProps {
  report: DailyReport
}

export default function DailyCard({ report }: DailyCardProps) {
  return (
    <Link href={`/daily/${report.date}`}>
      <article className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {report.date}
          </h3>
          <span className="text-sm text-gray-500">{report.stats.total} 篇</span>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-sm text-gray-600">LLM {report.stats.llm}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-gray-600">Skill {report.stats.skill}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-sm text-gray-600">Agent {report.stats.agent}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
