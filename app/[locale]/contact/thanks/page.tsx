import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import ThanksPage from "@/components/ThanksPage"
import { getSiteUrl } from "@/lib/email-brand"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "seo" })

  return {
    title: t("thanksTitle"),
    description: t("thanksDesc"),
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${getSiteUrl()}/${locale}/contact/thanks`,
    },
  }
}

export default async function ThanksRoute({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div id="page-wrapper">
      <Navbar />
      <ThanksPage />
      <Footer />
    </div>
  )
}
