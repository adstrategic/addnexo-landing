import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/email-brand"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/*/contact/thanks"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
