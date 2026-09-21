"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { Link } from "@/i18n/navigation"
import {
  container,
  sectionHeader,
  sectionSubtitle,
  sectionTag,
  sectionTitle,
} from "@/lib/landing-styles"
import { sectionHref } from "@/lib/sections"
import { cn } from "@/lib/utils"

export default function RealProblem() {
  const t = useTranslations()
  const sectionRef = useRevealOnScroll()
  const questions = t.raw("painQuestions.items") as Array<{
    question: string
    solution: string
  }>
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="bg-background py-24"
    >
      <div className={container}>
        <div className={sectionHeader}>
          <h2 data-reveal className={sectionTitle}>
            {t("realProblem.headline")}
          </h2>
          <p data-reveal className={sectionSubtitle}>
            {t("realProblem.content")}
          </p>
          <p data-reveal className="mt-5 text-[1.02rem] leading-[1.7] text-foreground">
            {t("realProblem.body")}
          </p>
        </div>

        <div data-reveal className="mx-auto max-w-[800px]">
          <p className={sectionTag}>{t("painQuestions.intro")}</p>
          <h3 className="mb-8 text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-[-0.02em] text-brand-dark">
            {t("painQuestions.headline")}
          </h3>

          <ul className="flex flex-col gap-3">
            {questions.map((item, i) => {
              const isOpen = open === i
              return (
                <li
                  key={i}
                  className="overflow-hidden rounded-2xl border border-brand-dark/8 bg-muted/40"
                >
                  <button
                    type="button"
                    className="flex w-full items-start gap-4 px-5 py-5 text-left transition-[background] duration-200 hover:bg-muted/80 active:scale-[0.995]"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-dark text-[0.8rem] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-[1rem] font-semibold leading-[1.5] text-brand-dark">
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "mt-1 text-primary transition-transform duration-200",
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
                      <p className="border-t border-brand-dark/6 px-5 pt-0 pb-5 pl-[4.25rem] text-[0.95rem] leading-[1.65] text-muted-foreground">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-10 flex justify-center">
            <LandingButton asChild variant="dark" className="max-md:w-full">
              <Link href={sectionHref("flow")}>{t("painQuestions.cta")}</Link>
            </LandingButton>
          </div>
        </div>
      </div>
    </section>
  )
}
