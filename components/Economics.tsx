"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { CostWaterfall } from "@/components/visuals/CostWaterfall"
import { TraceabilityChain } from "@/components/visuals/TraceabilityChain"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import {
  container,
  sectionHeader,
  sectionSubtitle,
  sectionTag,
  sectionTitle,
} from "@/lib/landing-styles"

export default function Economics() {
  const t = useTranslations("economics")
  const sectionRef = useRevealOnScroll()
  const costs = t.raw("costComponents") as string[]
  const metrics = t.raw("metrics") as string[]

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="bg-background py-24"
    >
      <div className={container}>
        <div className={sectionHeader}>
          <p data-reveal className={sectionTag}>
            {t("eyebrow")}
          </p>
          <h2 data-reveal className={sectionTitle}>
            {t("headline")}
          </h2>
          <p data-reveal className={sectionSubtitle}>
            {t("content")}
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal>
            <h3 className="mb-6 text-[1.25rem] font-extrabold tracking-[-0.02em] text-brand-dark">
              {t("secondaryHeadline")}
            </h3>
            <CostWaterfall components={costs} />
            <p className="mt-6 text-[1rem] leading-[1.6] font-semibold text-brand-dark">
              {t("closing")}
            </p>
          </div>

          <div data-reveal>
            <div className="mb-7 overflow-hidden rounded-2xl border border-brand-dark/8 bg-muted/40 p-2 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                <Image
                  src="/viendo dasboard de addnexo.jpeg"
                  alt={t("lotHeadline")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            </div>

            <h3 className="mb-4 text-[clamp(1.4rem,2.5vw,1.85rem)] font-extrabold tracking-[-0.02em] text-brand-dark">
              {t("lotHeadline")}
            </h3>
            <p className="mb-4 text-[1.02rem] leading-[1.7] text-muted-foreground">
              {t("lotContent")}
            </p>
            <p className="mb-8 text-[1rem] font-semibold text-brand-dark">
              {t("lotSecondary")}
            </p>
            <TraceabilityChain
              items={[
                "Lot",
                "Inventory",
                "Orders",
                "Dispatches",
                "Invoices",
                "Liquidation",
                "Margin",
              ]}
              className="mb-8"
            />
            <ul className="grid gap-2 sm:grid-cols-2">
              {metrics.map((metric) => (
                <li
                  key={metric}
                  className="rounded-xl border border-brand-dark/8 bg-muted/50 px-4 py-3 text-[0.9rem] font-medium text-foreground"
                >
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
