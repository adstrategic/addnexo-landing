import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import AppShowcase from "@/components/AppShowcase"
import Benefits from "@/components/Benefits"
import CTABanner from "@/components/CTABanner"
import Features from "@/components/Features"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import HowItWorks from "@/components/HowItWorks"
import Navbar from "@/components/Navbar"
import Problems from "@/components/Problems"
import Stats from "@/components/Stats"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "seo" })

  return {
    title: t("homeTitle"),
    description: t("homeDesc"),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDesc"),
    },
    twitter: {
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
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Problems />
        <HowItWorks />
        <Benefits />
        <AppShowcase />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
