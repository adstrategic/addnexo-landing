import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import ContactPage from "@/components/ContactPage"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { getSiteUrl } from "@/lib/email-brand"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "seo" })
  const siteUrl = getSiteUrl()
  const path = `/${locale}/contact`

  return {
    title: t("contactTitle"),
    description: t("contactDesc"),
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        en: `${siteUrl}/en/contact`,
        es: `${siteUrl}/es/contact`,
        "x-default": `${siteUrl}/es/contact`,
      },
    },
    openGraph: {
      title: t("contactTitle"),
      description: t("contactDesc"),
      url: `${siteUrl}${path}`,
      siteName: "ADDNEXO",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("contactTitle"),
      description: t("contactDesc"),
    },
  }
}

export default async function ContactRoute({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div id="page-wrapper">
      <Navbar />
      <ContactPage />
      <Footer />
    </div>
  )
}
