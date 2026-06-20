"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { LandingButton } from "@/components/landing-button"
import { Link } from "@/i18n/navigation"
import { sectionHref } from "@/lib/sections"
import {
  container,
  sectionSubtitle,
  sectionTag,
  sectionTitle,
} from "@/lib/landing-styles"

gsap.registerPlugin(ScrollTrigger)

export default function AppShowcase() {
  const t = useTranslations()

  const HIGHLIGHTS = [
    { label: t("showcase.h1Title"), desc: t("showcase.h1Desc") },
    { label: t("showcase.h2Title"), desc: t("showcase.h2Desc") },
    { label: t("showcase.h3Title"), desc: t("showcase.h3Desc") },
    { label: t("showcase.h4Title"), desc: t("showcase.h4Desc") },
  ]

  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0,
        x: -40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      })
      gsap.from(imageRef.current, {
        opacity: 0,
        x: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      })
      gsap.from("[data-showcase-highlight]", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.08)_0%,var(--background)_70%)] px-8 py-28"
    >
      <div className={`${container} grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20`}>
        <div ref={textRef}>
          <span className={sectionTag}>{t("showcase.badge")}</span>
          <h2 className={sectionTitle}>
            {t("showcase.title1")}
            <br />
            {t("showcase.title2")}
          </h2>
          <p className={sectionSubtitle}>{t("showcase.subtitle")}</p>
          <ul className="mt-8 flex flex-col gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <li key={i} data-showcase-highlight className="flex items-start gap-4">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-dark text-[0.75rem] font-bold text-brand-cyan">
                  ✓
                </span>
                <div className="flex flex-col gap-0.5">
                  <strong className="block text-[0.95rem] font-bold text-foreground">
                    {h.label}
                  </strong>
                  <span className="text-[0.88rem] text-muted-foreground">{h.desc}</span>
                </div>
              </li>
            ))}
          </ul>
          <LandingButton asChild variant="dark" className="mt-10">
            <Link href={sectionHref("contact")}>{t("showcase.cta")}</Link>
          </LandingButton>
        </div>

        <div ref={imageRef} className="relative order-first mt-4 lg:order-last lg:mt-0">
          <div className="relative">
            <div className="overflow-hidden rounded-[20px] border border-white/12 bg-[#0f172a] shadow-[0_8px_30px_rgba(0,0,0,0.13)] transition-transform duration-300 hover:-translate-y-0.5">
              <div className="flex h-8 items-center border-b border-white/5 bg-[#1e293b] px-4">
                <div className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-[#ef4444]" />
                  <span className="size-2 rounded-full bg-[#f59e0b]" />
                  <span className="size-2 rounded-full bg-[#10b981]" />
                </div>
                <div className="mx-auto w-full max-w-[240px] rounded bg-black/25 px-6 py-0.5 text-center font-mono text-[0.72rem] text-white/60">
                  addnexo.com/app/dashboard
                </div>
              </div>
              <Image
                src="/scs-dashboard-pc.png"
                alt="ADDNEXO ERP Vista de la aplicación"
                width={1200}
                height={800}
                className="block w-full"
              />
            </div>

            <div className="absolute -bottom-10 -left-10 z-10 w-[180px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] max-lg:w-[130px] max-lg:-bottom-6 max-lg:-left-4">
              <div className="relative rounded-[36px] border-[3.5px] border-[#1e293b] bg-[#090d16] p-2 shadow-[inset_0_0_4px_rgba(255,255,255,0.2)]">
                <div className="absolute top-3 left-1/2 z-[15] h-3.5 w-[50px] -translate-x-1/2 rounded-[10px] bg-[#090d16]" />
                <div className="aspect-[9/19.5] overflow-hidden rounded-[28px] bg-[#0f172a]">
                  <Image
                    src="/scs-dasboard1-phone.png"
                    alt="ADDNEXO ERP Mobile"
                    width={360}
                    height={780}
                    className="size-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
