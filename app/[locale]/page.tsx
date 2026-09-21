import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import AppShowcase from "@/components/AppShowcase"
import CTABanner from "@/components/CTABanner"
import DistributionFlow from "@/components/DistributionFlow"
import Economics from "@/components/Economics"
import FAQ from "@/components/FAQ"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import History from "@/components/History"
import Implementation from "@/components/Implementation"
import JsonLd from "@/components/JsonLd"
import Markets from "@/components/Markets"
import Modules from "@/components/Modules"
import Navbar from "@/components/Navbar"
import OperationalExample from "@/components/OperationalExample"
import OriginStrip from "@/components/OriginStrip"
import RealProblem from "@/components/RealProblem"
import { getSiteUrl } from "@/lib/email-brand"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "seo" })
  const siteUrl = getSiteUrl()
  const path = `/${locale}`

  return {
    title: t("homeTitle"),
    description: t("homeDesc"),
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        "x-default": `${siteUrl}/es`,
      },
    },
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDesc"),
      url: `${siteUrl}${path}`,
      siteName: "ADDNEXO",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDesc"),
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div id="page-wrapper">
      <JsonLd locale={locale} />
      <Navbar />
      <main>
        <Hero />
        <OriginStrip />
        <RealProblem />
        <DistributionFlow />
        <Economics />
        <Modules />
        <Markets />
        <OperationalExample />
        <History />
        <Implementation />
        <AppShowcase />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
