"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { LandingButton } from "@/components/landing-button"
import { Link } from "@/i18n/navigation"
import { sections } from "@/lib/sections"

gsap.registerPlugin(ScrollTrigger)

export default function CTABanner() {
  const t = useTranslations()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-cta-animate]", {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id={sections.contact}
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-brand-cyan to-sky-500 px-8 py-28 text-center before:pointer-events-none before:absolute before:top-[-50%] before:left-[-10%] before:h-[200%] before:w-1/2 before:rotate-30 before:bg-white/10 before:content-['']"
    >
      <div className="relative mx-auto max-w-[720px]">
        <p
          data-cta-animate
          className="mb-4 text-[0.82rem] font-bold tracking-[0.12em] text-brand-dark/70 uppercase"
        >
          {t("ctaBanner.eyebrow")}
        </p>
        <h2
          data-cta-animate
          className="mb-5 text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.12] font-black tracking-[-0.04em] text-brand-dark"
        >
          {t("ctaBanner.title1")}
          <br />
          {t("ctaBanner.title2")}
        </h2>
        <p
          data-cta-animate
          className="mb-10 text-[1.05rem] leading-[1.7] text-brand-dark/75"
        >
          {t("ctaBanner.subtitle")}
        </p>
        <div data-cta-animate className="flex flex-wrap items-center justify-center gap-4">
          <LandingButton asChild variant="dark" size="lg">
            <Link href="/contact">{t("ctaBanner.ctaPrimary")}</Link>
          </LandingButton>
          <LandingButton asChild variant="outlineDark" size="lg">
            <a
              href="https://wa.me/17542549069"
              target="_blank"
              rel="noopener noreferrer"
            >
              +1 (754) 254-9069
            </a>
          </LandingButton>
        </div>
        <p data-cta-animate className="mt-6 text-[0.84rem] text-brand-dark/60">
          <a
            href="https://addstrategic.com"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            addstrategic.com
          </a>{" "}
          •{" "}
          <a
            href="https://instagram.com/addstrategic"
            target="_blank"
            rel="noreferrer"
            className="ml-2.5 underline"
          >
            @addstrategic
          </a>
        </p>
      </div>
    </section>
  )
}
