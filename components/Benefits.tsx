"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { sections } from "@/lib/sections"
import {
  container,
  sectionHeader,
  sectionSubtitleMuted,
  sectionTagLime,
  sectionTitleWhite,
} from "@/lib/landing-styles"

gsap.registerPlugin(ScrollTrigger)

const ICONS = ["⚡", "🤖", "🎯", "📊", "🔍", "📈", "⏱️", "🔒"]

export default function Benefits() {
  const t = useTranslations()
  const sectionRef = useRef<HTMLElement>(null)
  const items = t.raw("benefits.items") as Array<{ title: string; desc: string }>

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-section-header]", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      })
      gsap.from("[data-benefit-item]", {
        opacity: 0,
        y: 30,
        stagger: 0.08,
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
    <section id={sections.benefits} ref={sectionRef} className="bg-brand-dark px-8 py-28">
      <div className={container}>
        <div data-section-header className={sectionHeader}>
          <span className={sectionTagLime}>{t("benefits.badge")}</span>
          <h2 className={sectionTitleWhite}>
            {t("benefits.title1")}
            <br />
            {t("benefits.title2")}
          </h2>
          <p className={sectionSubtitleMuted}>{t("benefits.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((b, i) => (
            <div
              key={i}
              data-benefit-item
              className="rounded-xl border border-white/8 bg-white/5 p-6 transition-[background,transform] duration-250 hover:-translate-y-0.5 hover:bg-white/9"
            >
              <span className="mb-4 block text-[1.8rem]">{ICONS[i]}</span>
              <h3 className="mb-2 text-[1.02rem] font-bold text-white">{b.title}</h3>
              <p className="text-[0.95rem] leading-[1.65] font-light text-[#F8FAFC]/80">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
