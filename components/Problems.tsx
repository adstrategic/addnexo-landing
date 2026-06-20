"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { LandingButton } from "@/components/landing-button"
import { Link } from "@/i18n/navigation"
import { sectionHref } from "@/lib/sections"
import {
  container,
  sectionSubtitleMuted,
  sectionTagLime,
  sectionTitleWhite,
} from "@/lib/landing-styles"

gsap.registerPlugin(ScrollTrigger)

export default function Problems() {
  const t = useTranslations()
  const sectionRef = useRef<HTMLElement>(null)
  const items = t.raw("problems.items") as string[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-problems-header]", {
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      })
      gsap.from("[data-problem-item]", {
        opacity: 0,
        x: 30,
        stagger: 0.07,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-brand-dark px-8 py-28">
      <div className={cnGrid(container)}>
        <div data-problems-header className="sticky top-[calc(var(--nav-h)+2rem)] max-md:static">
          <span className={sectionTagLime}>{t("problems.badge")}</span>
          <h2 className={sectionTitleWhite}>
            {t("problems.title1")}
            <br />
            {t("problems.title2")}
          </h2>
          <p className={sectionSubtitleMuted}>{t("problems.subtitle")}</p>
          <LandingButton asChild variant="lime" className="mt-8">
            <Link href={sectionHref("contact")}>{t("problems.cta")}</Link>
          </LandingButton>
        </div>

        <ul className="flex flex-col gap-3.5">
          {items.map((p, i) => (
            <li
              key={i}
              data-problem-item
              className="flex items-start gap-4 rounded-xl border border-white/8 bg-white/5 px-5 py-4 text-[0.95rem] text-[#F8FAFC] transition-colors hover:bg-white/8"
            >
              <span className="mt-0.5 shrink-0 text-base font-bold text-[#ff6b6b]" aria-hidden>
                ✕
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function cnGrid(containerClass: string) {
  return `${containerClass} grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20`
}
