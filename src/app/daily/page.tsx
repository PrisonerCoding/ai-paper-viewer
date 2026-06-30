import { getAllDailyReports, getAllTop5Selections } from '@/lib/daily'
import DailyCard from '@/components/DailyCard'
import Top5Table from '@/components/Top5Table'

export default function DailyPage() {
  const reports = getAllDailyReports()
  const top5Selections = getAllTop5Selections()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📅 论文日报</h1>
        <p className="text-gray-600">共 {reports.length} 天日报，{top5Selections.length} 天 Top5 精选</p>
      </div>

      {/* Top5 Selections */}
      {top5Selections.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top5 精选</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {top5Selections.slice(0, 6).map(sel => (
              <Top5Table key={sel.date} selection={sel} />
            ))}
          </div>
        </section>
      )}

      {/* Daily Reports */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 每日报告</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map(report => (
            <DailyCard key={report.date} report={report} />
          ))}
        </div>
      </section>
    </div>
  )
}
