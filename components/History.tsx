"use client"

import { useTranslations } from "next-intl"

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import {
  container,
  sectionHeader,
} from "@/lib/landing-styles"
import { cn } from "@/lib/utils"

export default function History() {
  const t = useTranslations("history")
  const sectionRef = useRevealOnScroll()
  const timeline = t.raw("timeline") as Array<{ name: string; desc: string }>

  return (
    <section
      id="story"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="bg-brand-bg-dark py-24 text-white"
    >
      <div className={container}>
        <div className={sectionHeader}>
          <h2
            data-reveal
            className="text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-extrabold tracking-[-0.03em] text-white"
          >
            {t("headline")}
          </h2>
        </div>

        <ol className="mx-auto mb-14 max-w-[800px]">
          {timeline.map((item, i) => (
            <li
              key={item.name}
              data-reveal
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              {i < timeline.length - 1 ? (
                <span
                  className="absolute top-10 left-[15px] h-[calc(100%-2.5rem)] w-px bg-white/15"
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  "relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold",
                  i === timeline.length - 1
                    ? "bg-brand-cyan text-brand-dark"
                    : "border border-white/25 bg-white/8 text-white"
                )}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="mb-2 text-[1.25rem] font-extrabold tracking-[-0.02em] text-white">
                  {item.name}
                </h3>
                <p className="text-[1rem] leading-[1.7] text-white/65">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <p
          data-reveal
          className="mx-auto max-w-[680px] text-center text-[1.1rem] font-semibold leading-[1.7] text-brand-cyan"
        >
          {t("keyStatement")}
        </p>
      </div>
    </section>
  )
}
