"use client"

import { useTranslations } from "next-intl"

import { AmericasMap } from "@/components/visuals/AmericasMap"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import {
  container,
  sectionHeader,
  sectionTitle,
} from "@/lib/landing-styles"

export default function Markets() {
  const t = useTranslations("markets")
  const sectionRef = useRevealOnScroll()
  const industries = t.raw("industries") as Array<{ title: string; desc: string }>

  return (
    <section
      id="industries"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="bg-background py-24"
    >
      <div className={container}>
        <div className={sectionHeader}>
          <h2 data-reveal className={sectionTitle}>
            {t("industriesHeadline")}
          </h2>
        </div>

        <div className="mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <article
              key={industry.title}
              data-reveal
              className="rounded-2xl border border-brand-dark/8 bg-muted/30 p-6"
            >
              <h3 className="mb-2 text-[1.08rem] font-extrabold tracking-[-0.02em] text-brand-dark">
                {industry.title}
              </h3>
              <p className="text-[0.92rem] leading-[1.65] text-muted-foreground">
                {industry.desc}
              </p>
            </article>
          ))}
        </div>

        <div className={sectionHeader}>
          <h2 data-reveal className={sectionTitle}>
            {t("geoHeadline")}
          </h2>
        </div>

        <div data-reveal>
          <AmericasMap />
        </div>
      </div>
    </section>
  )
}
