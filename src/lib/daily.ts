import fs from 'fs'
import path from 'path'
import type { DailyReport, Top5Selection } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')

let cachedReportsIndex: Pick<DailyReport, 'date' | 'slug' | 'stats' | 'categories'>[] | null = null
let cachedTop5: Top5Selection[] | null = null

export function getAllDailyReports(): Pick<DailyReport, 'date' | 'slug' | 'stats' | 'categories'>[] {
  if (cachedReportsIndex) return cachedReportsIndex
  const filePath = path.join(DATA_DIR, 'daily-reports-index.json')
  if (!fs.existsSync(filePath)) return []
  cachedReportsIndex = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return cachedReportsIndex!
}

export function getDailyReportByDate(date: string): DailyReport | undefined {
  const filePath = path.join(DATA_DIR, 'daily', `${date}.json`)
  if (!fs.existsSync(filePath)) return undefined
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function getAllTop5Selections(): Top5Selection[] {
  if (cachedTop5) return cachedTop5
  const filePath = path.join(DATA_DIR, 'top5.json')
  if (!fs.existsSync(filePath)) return []
  cachedTop5 = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return cachedTop5!
}
