import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import ContactPage from "@/components/ContactPage"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "seo" })

  return {
    title: t("contactTitle"),
    description: t("contactDesc"),
    openGraph: {
      title: t("contactTitle"),
      description: t("contactDesc"),
    },
    twitter: {
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
