"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"

import { LandingButton } from "@/components/landing-button"
import { Link } from "@/i18n/navigation"
import { sectionHref } from "@/lib/sections"
import { cn } from "@/lib/utils"

const SLIDE_IMAGES = [
  { desktop: "/scs-dashboard-pc.png", mobile: "/scs-dasboard1-phone.png" },
  { desktop: "/scs-dasboard1-pc.png", mobile: "/scs-dasboard2-phone.png" },
  { desktop: "/scs-dashboard2-pc.png", mobile: "/scs-homepage-phone.png" },
  { desktop: "/scs-homepage-pc.png", mobile: "/scs-homepage-phone.png" },
]

export default function Hero() {
  const t = useTranslations()
  const [activeSlide, setActiveSlide] = useState(0)

  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const mockupRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  const slides = t.raw("hero.slides") as Array<{ label: string }>

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDE_IMAGES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from(badgeRef.current, { opacity: 0, y: 24, duration: 0.6 })
        .from(titleRef.current, { opacity: 0, y: 50, duration: 0.9 }, "-=0.3")
        .from(subtitleRef.current, { opacity: 0, y: 30, duration: 0.7 }, "-=0.4")
        .from(ctasRef.current, { opacity: 0, y: 20, duration: 0.6 }, "-=0.35")
        .from(mockupRef.current, { opacity: 0, y: 80, duration: 1.1 }, "-=0.3")
        .from(scrollHintRef.current, { opacity: 0, duration: 0.5 }, "-=0.1")

      gsap.to(scrollHintRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
        delay: 1.5,
      })
    }, mockupRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brand-bg-dark px-8 pt-[calc(var(--nav-h)+4rem)] pb-20 text-center"
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/addnexov1-og-nwm.mp4" type="video/mp4" />
      </video>
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.72)_0%,rgba(37,99,235,0.65)_100%),radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(56,189,248,0.07)_0%,transparent_60%),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(15,23,42,0.6)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="relative z-[1] w-full max-w-[860px]">
        <div
          ref={badgeRef}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/12 px-4 py-1.5 text-[0.82rem] font-semibold tracking-[0.04em] text-brand-cyan"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-brand-cyan" />
          {t("hero.badge")}
        </div>

        <h1
          ref={titleRef}
          className="mb-6 text-[clamp(2.6rem,6.5vw,5rem)] leading-[1.08] font-black tracking-[-0.04em] text-white text-shadow-[0_4px_16px_rgba(15,23,42,0.6)]"
        >
          {t("hero.title1")}
          <br />
          <em className="not-italic text-brand-cyan text-shadow-[0_2px_8px_rgba(15,23,42,0.6),0_0_20px_rgba(56,189,248,0.4)]">
            {t("hero.titleAccent")}
          </em>
          <br />
          {t("hero.title2")}
        </h1>

        <p
          ref={subtitleRef}
          className="mx-auto mb-10 max-w-[600px] text-[clamp(1rem,2vw,1.2rem)] leading-[1.7] text-white/95 text-shadow-[0_2px_8px_rgba(15,23,42,0.5)]"
        >
          {t("hero.subtitle")}
        </p>

        <div
          ref={ctasRef}
          className="flex flex-wrap items-center justify-center gap-4 max-md:flex-col max-md:items-stretch"
        >
          <LandingButton asChild variant="lime" className="max-md:justify-center">
            <Link href="/contact">{t("hero.ctaPrimary")}</Link>
          </LandingButton>
          <LandingButton asChild variant="ghost" className="max-md:justify-center">
            <Link href={sectionHref("howItWorks")}>
              {t("hero.ctaSecondary")}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </LandingButton>
        </div>
      </div>

      <div
        ref={mockupRef}
        className="relative z-10 mt-16 flex w-full max-w-[950px] flex-col items-center"
      >
        <div
          className="pointer-events-none absolute -z-10 size-[300px] animate-[float-glow_8s_infinite_alternate_ease-in-out] rounded-full bg-brand-cyan opacity-35 blur-[100px] max-[1100px]:top-[-10%] max-[1100px]:left-[10%]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -z-10 size-[300px] animate-[float-glow_8s_infinite_alternate_ease-in-out] rounded-full bg-primary opacity-35 blur-[100px] [animation-delay:2s] max-[1100px]:right-[10%] max-[1100px]:bottom-[-10%]"
          aria-hidden
        />

        <div className="relative w-full overflow-hidden rounded-[20px] border border-white/12 bg-[#0f172a] shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
          <div className="relative z-[5] flex h-9 items-center border-b border-white/8 bg-[#1e293b] px-5">
            <div className="flex gap-2">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="mx-auto w-full max-w-[280px] rounded-md bg-black/30 px-8 py-0.5 text-center font-mono text-[0.75rem] tracking-[0.5px] text-white/50">
              addnexo.com/app/dashboard
            </div>
          </div>
          <div className="relative aspect-video w-full overflow-hidden bg-[#0f172a]">
            {slides.map((slide, idx) => (
              <Image
                key={idx}
                src={SLIDE_IMAGES[idx].desktop}
                alt={slide.label}
                fill
                className={cn(
                  "object-cover transition-opacity duration-800",
                  idx === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                priority={idx === 0}
              />
            ))}
          </div>
        </div>

        <div className="absolute right-[-3rem] bottom-[-3rem] z-[15] w-[220px] drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 max-[1100px]:right-[-1rem] max-[1100px]:bottom-[-2rem] max-[1100px]:w-[180px] max-md:relative max-md:right-auto max-md:bottom-auto max-md:mx-auto max-md:-mt-12 max-md:ml-6 max-md:w-40 max-md:drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
          <div className="relative rounded-[40px] border-4 border-slate-600 bg-[#090d16] p-2.5 shadow-[inset_0_0_8px_rgba(255,255,255,0.15)]">
            <div className="absolute top-3.5 left-1/2 z-20 h-[18px] w-[60px] -translate-x-1/2 rounded-xl bg-[#090d16]" />
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[30px] bg-[#0f172a]">
              {slides.map((slide, idx) => (
                <Image
                  key={idx}
                  src={SLIDE_IMAGES[idx].mobile}
                  alt={slide.label}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-800",
                    idx === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"
                  )}
                  priority={idx === 0}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="z-20 mt-20 flex gap-2.5 max-md:mt-8">
          {SLIDE_IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "h-2.5 cursor-pointer rounded-full bg-white/30 p-0 transition-all duration-300 hover:scale-110 hover:bg-white/60",
                idx === activeSlide ? "w-6 rounded-[5px] bg-brand-cyan" : "w-2.5"
              )}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Ver slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 z-[1] -translate-x-1/2 text-white/40"
        aria-hidden
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 12l7 7 7-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  )
}
