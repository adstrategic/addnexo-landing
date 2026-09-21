import { getTranslations } from "next-intl/server"

import { getSiteUrl } from "@/lib/email-brand"

type Props = {
  locale: string
}

export default async function JsonLd({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "faq" })
  const seo = await getTranslations({ locale, namespace: "seo" })
  const siteUrl = getSiteUrl()
  const faqItems = t.raw("items") as Array<{ q: string; a: string }>

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ADDNEXO",
    url: siteUrl,
    logo: `${siteUrl}/addnexo.png`,
    parentOrganization: {
      "@type": "Organization",
      name: "ADDSTRATEGIC LLC",
      url: "https://addstrategic.com",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-754-254-9069",
      contactType: "sales",
      email: "adstrategicbusiness@gmail.com",
      availableLanguage: ["English", "Spanish"],
    },
  }

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ADDNEXO",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: seo("homeDesc"),
    url: `${siteUrl}/${locale}`,
    offers: {
      "@type": "Offer",
      description: "Free demo. Implementation included.",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "ADDSTRATEGIC LLC",
    },
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ADDNEXO",
    url: siteUrl,
    inLanguage: [locale === "es" ? "es" : "en"],
  }

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  const schemas = [organization, software, website, faqPage]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
