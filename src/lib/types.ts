export interface Paper {
  slug: string
  title: string
  date: string
  source: string
  authors: string
  tags: string[]
  content: string
  cardImage?: string
  oneLiner?: string
}

export interface DailyPaper {
  title: string
  authors: string
  date: string
  link: string
  category: string
  abstract: string
}

export interface DailyReport {
  date: string
  slug: string
  stats: {
    total: number
    llm: number
    skill: number
    agent: number
  }
  categories: {
    name: string
    count: number
    papers: DailyPaper[]
  }[]
}

export interface Top5Item {
  rank: number
  title: string
  oneLiner: string
  interpretationLink?: string
}

export interface Top5Selection {
  date: string
  slug: string
  papers: Top5Item[]
  criteria: string[]
}
