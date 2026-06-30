import fs from 'fs'
import path from 'path'
import type { DailyReport, Top5Selection } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')

let cachedReports: DailyReport[] | null = null
let cachedTop5: Top5Selection[] | null = null

export function getAllDailyReports(): DailyReport[] {
  if (cachedReports) return cachedReports
  const filePath = path.join(DATA_DIR, 'daily-reports.json')
  if (!fs.existsSync(filePath)) return []
  cachedReports = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return cachedReports!
}

export function getDailyReportByDate(date: string): DailyReport | undefined {
  const reports = getAllDailyReports()
  return reports.find(r => r.date === date)
}

export function getAllTop5Selections(): Top5Selection[] {
  if (cachedTop5) return cachedTop5
  const filePath = path.join(DATA_DIR, 'top5.json')
  if (!fs.existsSync(filePath)) return []
  cachedTop5 = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return cachedTop5!
}
