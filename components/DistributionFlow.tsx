"use client"

import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { FlowRail } from "@/components/visuals/FlowRail"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { Link } from "@/i18n/navigation"
import {
  container,
  sectionHeader,
  sectionTitleWhite,
} from "@/lib/landing-styles"
import { sectionHref } from "@/lib/sections"

export default function DistributionFlow() {
  const t = useTranslations("distributionFlow")
  const sectionRef = useRevealOnScroll()
  const chain = t.raw("flow") as string[]
  const commercial = t.raw("commercialFlow") as string[]
  const financial = t.raw("financialFlow") as string[]

  return (
    <section
      id="flow"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="bg-brand-bg-dark py-24 text-white"
    >
      <div className={container}>
        <div className={sectionHeader}>
          <h2 data-reveal className={sectionTitleWhite}>
            {t("headline")}
          </h2>
          <p data-reveal className="mt-[1.1rem] text-[1.05rem] leading-[1.7] text-white/65">
            {t("content")}
          </p>
        </div>

        <div data-reveal className="mb-8">
          <FlowRail items={chain} variant="dark" />
        </div>
        <p data-reveal className="mx-auto mb-16 max-w-[680px] text-center text-[1rem] leading-[1.7] text-white/70">
          {t("closing")}
        </p>

        <div data-reveal className="rounded-3xl border border-white/10 bg-white/4 p-8 md:p-12">
          <h3 className="mb-10 text-center text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold tracking-[-0.02em] text-white">
            {t("coreHeadline")}
          </h3>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-[0.78rem] font-bold tracking-[0.1em] text-brand-cyan uppercase">
                {t("commercialLabel")}
              </p>
              <FlowRail items={commercial} variant="dark" className="justify-start" />
            </div>
            <div>
              <p className="mb-4 text-[0.78rem] font-bold tracking-[0.1em] text-brand-cyan uppercase">
                {t("financialLabel")}
              </p>
              <FlowRail items={financial} variant="dark" className="justify-start" />
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="h-8 w-px bg-brand-cyan/50" aria-hidden />
            <span className="rounded-full bg-brand-cyan px-6 py-2.5 text-[0.95rem] font-bold text-brand-dark">
              {t("mergeLabel")}
            </span>
          </div>
        </div>

        <div data-reveal className="mt-12 flex justify-center">
          <LandingButton asChild variant="lime" className="max-md:w-full">
            <Link href={sectionHref("modules")}>{t("cta")}</Link>
          </LandingButton>
        </div>
      </div>
    </section>
  )
}
