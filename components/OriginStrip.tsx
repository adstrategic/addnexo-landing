"use client"

import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { Link } from "@/i18n/navigation"
import { container, sectionSubtitle, sectionTitle } from "@/lib/landing-styles"
import { sectionHref } from "@/lib/sections"
import { cn } from "@/lib/utils"

export default function OriginStrip() {
  const t = useTranslations("origin")
  const sectionRef = useRevealOnScroll()
  const timeline = t.raw("timeline") as string[]

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="border-b border-black/4 bg-gradient-to-b from-muted to-background py-20"
    >
      <div className={cn(container, "max-w-[900px] text-center")}>
        <div data-reveal className="mb-10 flex items-center justify-center gap-3">
          {timeline.map((item, i) => (
            <div key={item} className="flex items-center gap-3">
              <span
                className={cn(
                  "rounded-full px-4 py-2 text-[0.85rem] font-bold tracking-[-0.01em]",
                  i === timeline.length - 1
                    ? "bg-brand-dark text-white"
                    : "border border-brand-dark/12 bg-background text-brand-dark"
                )}
              >
                {item}
              </span>
              {i < timeline.length - 1 ? (
                <span className="text-primary" aria-hidden>
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <h2 data-reveal className={sectionTitle}>
          {t("headline")}
        </h2>
        <p data-reveal className={cn(sectionSubtitle, "mx-auto max-w-[680px]")}>
          {t("content")}
        </p>
        <p
          data-reveal
          className="mx-auto mt-6 max-w-[560px] text-[1.05rem] font-semibold leading-[1.6] text-brand-dark"
        >
          {t("highlight")}
        </p>
        <div data-reveal className="mt-10 flex justify-center">
          <LandingButton asChild variant="outlineDark" className="max-md:w-full">
            <Link href={sectionHref("story")}>{t("cta")}</Link>
          </LandingButton>
        </div>
      </div>
    </section>
  )
}
