"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { sections } from "@/lib/sections"
import {
  container,
  sectionHeader,
  sectionSubtitle,
  sectionTag,
  sectionTitle,
} from "@/lib/landing-styles"

gsap.registerPlugin(ScrollTrigger)

export default function HowItWorks() {
  const t = useTranslations()
  const sectionRef = useRef<HTMLElement>(null)
  const steps = t.raw("howItWorks.steps") as Array<{
    title: string
    desc: string
    tag: string
  }>

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
      gsap.from("[data-hiw-step]", {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
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
    <section
      id={sections.howItWorks}
      ref={sectionRef}
      className="bg-gradient-to-b from-background to-muted px-8 py-28"
    >
      <div className={container}>
        <div data-section-header className={sectionHeader}>
          <span className={sectionTag}>{t("howItWorks.badge")}</span>
          <h2 className={sectionTitle}>
            {t("howItWorks.title1")}
            <br />
            {t("howItWorks.title2")}
          </h2>
          <p className={sectionSubtitle}>{t("howItWorks.subtitle")}</p>
        </div>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} data-hiw-step className="relative text-left">
              <div className="mb-4 text-[4.5rem] leading-none font-black tracking-[-0.05em] text-muted">
                {`0${i + 1}`}
              </div>
              {i < 2 && (
                <div
                  className="pointer-events-none absolute top-9 right-[-1.5rem] hidden h-0.5 w-12 bg-gradient-to-r from-muted to-transparent md:block"
                  aria-hidden
                />
              )}
              <span className="mb-3.5 inline-block rounded-full bg-brand-dark/8 px-3 py-1 text-[0.76rem] font-bold tracking-[0.08em] text-brand-dark uppercase">
                {step.tag}
              </span>
              <h3 className="mb-3 text-[1.3rem] font-bold tracking-[-0.025em] text-brand-dark">
                {step.title}
              </h3>
              <p className="text-[0.98rem] leading-[1.7] font-light text-muted-foreground">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
