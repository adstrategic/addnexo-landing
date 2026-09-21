export const SITE_URL = "https://www.addnexo.com"

export const CAL_EMBED_URL = "https://cal.com/adstrategic-mml9qb/30min"

export const INDUSTRY_OPTIONS = [
  "fresh-produce",
  "food-distribution",
  "import-export",
  "wholesale",
  "agricultural",
  "inventory-intensive",
  "other",
] as const

export type IndustryOption = (typeof INDUSTRY_OPTIONS)[number]
