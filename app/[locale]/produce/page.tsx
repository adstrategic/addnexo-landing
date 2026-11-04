import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import ProduceLandingPage, {
  type HeroVariantKey,
} from "@/components/ProduceLandingPage"
import { getSiteUrl } from "@/lib/email-brand"

function normalizeVariant(raw?: string | string[] | null): HeroVariantKey {
  const val = Array.isArray(raw) ? raw[0] : raw
  if (val === "cost" || val === "excel" || val === "erp") {
    return val
  }
  return "erp"
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ v?: string | string[] }>
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params
  const resolvedSearch = await searchParams
  const variant = normalizeVariant(resolvedSearch?.v)

  const tSeo = await getTranslations({ locale, namespace: "seo" })
  const tProduce = await getTranslations({ locale, namespace: "produce" })

  const variantH1 = tProduce(`hero.variants.${variant}.h1`)
  const title = `${variantH1} | ADDNEXO`
  const description = tSeo("produceDesc")
  const siteUrl = getSiteUrl()
  const path = `/${locale}/produce`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        en: `${siteUrl}/en/produce`,
        es: `${siteUrl}/es/produce`,
        "x-default": `${siteUrl}/en/produce`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: "ADDNEXO",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function ProducePage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const resolvedSearch = await searchParams
  const variant = normalizeVariant(resolvedSearch?.v)

  return <ProduceLandingPage initialVariant={variant} />
}
