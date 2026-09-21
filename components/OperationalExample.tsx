"use client"

import { useTranslations } from "next-intl"

import { TraceabilityChain } from "@/components/visuals/TraceabilityChain"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import {
  container,
  sectionHeader,
  sectionSubtitle,
  sectionTitle,
} from "@/lib/landing-styles"

export default function OperationalExample() {
  const t = useTranslations("operationalExample")
  const sectionRef = useRevealOnScroll()
  const chain = t.raw("chain") as string[]

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="border-y border-black/4 bg-muted/40 py-24"
    >
      <div className={container}>
        <div className={sectionHeader}>
          <h2 data-reveal className={sectionTitle}>
            {t("headline")}
          </h2>
          <p data-reveal className={sectionSubtitle}>
            {t("content")}
          </p>
          <p data-reveal className="mt-3 text-[0.85rem] font-medium text-muted-foreground italic">
            {t("privacy")}
          </p>
        </div>

        <div
          data-reveal
          className="mx-auto grid max-w-[900px] gap-8 rounded-3xl border border-brand-dark/8 bg-background p-8 md:grid-cols-[280px_1fr] md:p-10"
        >
          <div className="rounded-2xl border border-dashed border-brand-dark/20 bg-muted/50 p-6">
            <p className="mb-4 text-[0.72rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
              Produce label
            </p>
            <dl className="flex flex-col gap-3">
              {(
                [
                  ["product", t("product")],
                  ["origin", t("origin")],
                  ["lot", t("lot")],
                  ["packDate", t("packDate")],
                ] as const
              ).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[0.75rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                    {t(`labels.${key}`)}
                  </dt>
                  <dd className="text-[1.05rem] font-bold text-brand-dark">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-4 text-[0.78rem] font-bold tracking-[0.1em] text-primary uppercase">
              ADDNEXO
            </p>
            <TraceabilityChain items={chain} />
          </div>
        </div>
      </div>
    </section>
  )
}
