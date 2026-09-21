"use client"

import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { Link } from "@/i18n/navigation"
import { container, sectionTitle } from "@/lib/landing-styles"
import { CAL_EMBED_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

export default function ThanksPage() {
  const t = useTranslations("thanks")

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.05)_0%,var(--background)_70%)] pt-[calc(var(--nav-h)+3rem)] pb-24">
      <div className={cn(container, "max-w-[900px] text-center")}>
        <Link
          href="/"
          className="mb-8 inline-block text-[0.9rem] font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          {t("backHome")}
        </Link>
        <h1 className={sectionTitle}>{t("title")}</h1>
        <p className="mx-auto mt-5 max-w-[560px] text-[1.1rem] leading-[1.7] text-muted-foreground">
          {t("subtitle")}
        </p>
        <p className="mt-3 text-[0.9rem] font-medium text-brand-dark">
          {t("supporting")}
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-brand-dark/8 bg-background shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <p className="border-b border-brand-dark/6 bg-muted/50 px-4 py-3 text-[0.85rem] font-semibold text-brand-dark">
            {t("calendarLabel")}
          </p>
          <iframe
            src={CAL_EMBED_URL}
            title={t("calendarLabel")}
            className="h-[700px] w-full border-0"
            loading="lazy"
            allow="camera; microphone; fullscreen"
          />
        </div>

        <div className="mt-8">
          <LandingButton asChild variant="outlineDark">
            <a href={CAL_EMBED_URL} target="_blank" rel="noreferrer">
              {t("calendarLabel")}
            </a>
          </LandingButton>
        </div>
      </div>
    </main>
  )
}
