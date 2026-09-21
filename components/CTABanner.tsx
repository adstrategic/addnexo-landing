"use client"

import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { Link } from "@/i18n/navigation"
import { container } from "@/lib/landing-styles"
import { sectionHref } from "@/lib/sections"

export default function CTABanner() {
  const t = useTranslations("finalCta")
  const sectionRef = useRevealOnScroll()

  return (
    <section
      id="contact"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="bg-brand-bg-dark py-24 text-center text-white"
    >
      <div className={container}>
        <h2
          data-reveal
          className="mx-auto mb-5 max-w-[800px] text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-extrabold tracking-[-0.03em] text-white"
        >
          {t("headline")}
        </h2>
        <p
          data-reveal
          className="mx-auto mb-4 max-w-[560px] text-[1.1rem] leading-[1.7] text-white/70"
        >
          {t("subheadline")}
        </p>
        <p data-reveal className="mx-auto mb-10 max-w-[480px] text-[0.9rem] text-white/50">
          {t("supporting")}
        </p>

        <div
          data-reveal
          className="mb-10 flex flex-wrap items-center justify-center gap-4 max-md:flex-col max-md:items-stretch"
        >
          <LandingButton asChild variant="lime" size="lg" className="max-md:w-full max-md:justify-center">
            <Link href="/contact">{t("primary")}</Link>
          </LandingButton>
          <LandingButton asChild variant="ghost" size="lg" className="max-md:w-full max-md:justify-center">
            <Link href={sectionHref("proof")}>{t("secondary")}</Link>
          </LandingButton>
        </div>

        <p
          data-reveal
          className="mx-auto max-w-[640px] text-[0.98rem] leading-[1.7] text-white/60"
        >
          {t("finalMessage")}
        </p>
      </div>
    </section>
  )
}
