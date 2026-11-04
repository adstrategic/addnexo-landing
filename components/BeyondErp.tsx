"use client"

import { Camera, MessageSquareText, Mic, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { FlowRail } from "@/components/visuals/FlowRail"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { Link } from "@/i18n/navigation"
import {
  container,
  sectionHeader,
  sectionSubtitle,
  sectionTag,
  sectionTitle,
} from "@/lib/landing-styles"

const CARD_ICONS: LucideIcon[] = [Mic, MessageSquareText, Camera]

export default function BeyondErp() {
  const t = useTranslations("beyondErp")
  const tImpl = useTranslations("implementation")
  const sectionRef = useRevealOnScroll()

  const cards = t.raw("cards") as Array<{ title: string; desc: string }>
  const buyerFlow = tImpl.raw("buyerFlow") as string[]

  return (
    <section
      id="innovation"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="border-b border-black/4 bg-background py-24"
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
            {t("subheadline")}
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = CARD_ICONS[i] ?? Mic
            return (
              <article
                key={card.title}
                data-reveal
                className="rounded-2xl border border-brand-dark/8 bg-muted/30 p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mb-2.5 text-[1.12rem] font-extrabold tracking-[-0.02em] text-brand-dark">
                  {card.title}
                </h3>
                <p className="text-[0.95rem] leading-[1.65] text-muted-foreground">
                  {card.desc}
                </p>
              </article>
            )
          })}
        </div>

        <div
          data-reveal
          className="rounded-3xl border border-brand-cyan/30 bg-brand-bg-dark p-8 text-white md:p-12"
        >
          <h3 className="mb-4 text-[clamp(1.4rem,2.5vw,1.9rem)] font-extrabold tracking-[-0.02em] text-white">
            {tImpl("buyerHeadline")}
          </h3>
          <p className="mb-8 max-w-[760px] text-[1.02rem] leading-[1.7] text-white/65">
            {tImpl("buyerContent")}
          </p>
          <FlowRail
            items={buyerFlow}
            variant="dark"
            className="mb-8 justify-start"
          />
          <LandingButton asChild variant="lime" className="max-md:w-full">
            <Link href="/contact">{tImpl("buyerCta")}</Link>
          </LandingButton>
        </div>
      </div>
    </section>
  )
}

