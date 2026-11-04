"use client"

import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { Link } from "@/i18n/navigation"
import {
  container,
  sectionHeader,
  sectionSubtitle,
  sectionTitle,
} from "@/lib/landing-styles"

export default function Implementation() {
  const t = useTranslations("implementation")
  const sectionRef = useRevealOnScroll()
  const steps = t.raw("steps") as Array<{ num: string; title: string; desc: string }>

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="bg-background py-24"
    >
      <div className={container}>
        <div className={sectionHeader}>
          <h2 data-reveal className={sectionTitle}>
            {t("headline")}
          </h2>
          <p data-reveal className={sectionSubtitle}>
            {t("offer")}
          </p>
        </div>

        <ol className="mx-auto mb-12 grid max-w-[1000px] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.num}
              data-reveal
              className="rounded-2xl border border-brand-dark/8 bg-muted/30 p-6"
            >
              <span className="mb-3 block font-mono text-[0.85rem] font-bold text-primary">
                {step.num}
              </span>
              <h3 className="mb-2 text-[1.08rem] font-extrabold tracking-[-0.02em] text-brand-dark">
                {step.title}
              </h3>
              <p className="text-[0.92rem] leading-[1.65] text-muted-foreground">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>

        <div data-reveal className="mb-16 flex justify-center px-1">
          <LandingButton asChild variant="lime" size="lg" className="max-md:w-full">
            <Link href="/contact">{t("cta")}</Link>
          </LandingButton>
        </div>

        <div
          data-reveal
          className="rounded-3xl border border-brand-dark/8 bg-muted/40 p-8 md:p-12"
        >
          <h3 className="mb-4 text-[clamp(1.4rem,2.5vw,1.9rem)] font-extrabold tracking-[-0.02em] text-brand-dark">
            {t("customHeadline")}
          </h3>
          <p className="mb-4 max-w-[720px] text-[1.02rem] leading-[1.7] text-muted-foreground">
            {t("customContent")}
          </p>
          <p className="mb-8 text-[1.05rem] font-semibold text-brand-dark">
            {t("customHighlight")}
          </p>
          <LandingButton asChild variant="outlineDark" className="max-md:w-full">
            <a
              href="https://addstrategic.com"
              target="_blank"
              rel="noreferrer"
            >
              {t("customCta")}
            </a>
          </LandingButton>
        </div>
      </div>
    </section>
  )
}
