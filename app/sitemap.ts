import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/email-brand"
import { routing } from "@/i18n/routing"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const pages = ["", "/produce", "/contact"] as const

  return routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" || page === "/produce" ? ("weekly" as const) : ("monthly" as const),
      priority: page === "" ? 1 : page === "/produce" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${siteUrl}/${l}${page}`])
        ),
      },
    }))
  )
}
