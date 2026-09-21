"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import {
  container,
  sectionHeader,
  sectionTitle,
} from "@/lib/landing-styles"
import { cn } from "@/lib/utils"

export default function FAQ() {
  const t = useTranslations("faq")
  const sectionRef = useRevealOnScroll()
  const items = t.raw("items") as Array<{ q: string; a: string }>
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="bg-background py-24"
    >
      <div className={cn(container, "max-w-[800px]")}>
        <div className={sectionHeader}>
          <h2 data-reveal className={sectionTitle}>
            {t("headline")}
          </h2>
        </div>

        <ul data-reveal className="flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <li
                key={i}
                className="overflow-hidden rounded-2xl border border-brand-dark/8 bg-muted/30"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-[background] duration-200 hover:bg-muted/60 active:scale-[0.995]"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[1.02rem] font-semibold text-brand-dark">
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-xl text-primary transition-transform duration-200",
                      isOpen && "rotate-45"
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-brand-dark/6 px-5 pt-0 pb-5 text-[0.95rem] leading-[1.7] text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
