"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Home,
  MessageSquareText,
  Mic,
  Play,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useLocale, useTranslations } from "next-intl"

import FeatureMarquee from "@/components/FeatureMarquee"
import { LandingButton } from "@/components/landing-button"
import VideoModal from "@/components/VideoModal"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import {
  createDiagnosticSchema,
  type DiagnosticFormValues,
} from "@/lib/contact-schema"
import { container } from "@/lib/landing-styles"
import { cn } from "@/lib/utils"

export type HeroVariantKey = "cost" | "excel" | "erp" | "voice"

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

type ReceiptLine = {
  label: string
  timing: string
  amount: string
  type: "base" | "hidden" | "shrink"
}

type CompetitorRow = {
  name: string
  verdict: string
  cost: string
  timeline: string
  reality: string
}

type DifferentiatorMetric = {
  code: string
  title: string
  desc: string
}

type VoicePillar = {
  title: string
  desc: string
}

type PricingRow = {
  users: string
  price: string
  desc: string
  highlight: boolean
}

type FaqItem = {
  q: string
  a: string
}

function fireConversionEvent(variant: HeroVariantKey, company: string) {
  if (typeof window === "undefined") return

  const payload = {
    event: "form_submit",
    form_id: "produce_diagnostic_call",
    landing_variant: variant,
    company_name: company,
    timestamp: new Date().toISOString(),
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)

  if (typeof window.gtag === "function") {
    window.gtag("event", "form_submit", {
      event_category: "lead",
      event_label: `produce_${variant}`,
      value: 90,
    })
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", "form_submit", {
      content_name: "produce_diagnostic_call",
      variant,
    })
  }

  window.dispatchEvent(new CustomEvent("form_submit", { detail: payload }))
}

export default function ProduceLandingPage({
  initialVariant = "erp",
}: {
  initialVariant?: HeroVariantKey
}) {
  const t = useTranslations("produce")
  const tNavbar = useTranslations("navbar")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const variant: HeroVariantKey = initialVariant
  const [receiptMode, setReceiptMode] = useState<"blind" | "true">("blind")
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [videoOpen, setVideoOpen] = useState(false)
  const [ctaMode, setCtaMode] = useState<"form" | "calendar">("form")
  const [voiceMuted, setVoiceMuted] = useState(true)
  const [landingsOpen, setLandingsOpen] = useState(false)
  const voiceVideoRef = useRef<HTMLVideoElement>(null)
  const landingsDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        landingsDropdownRef.current &&
        !landingsDropdownRef.current.contains(event.target as Node)
      ) {
        setLandingsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleLanguage = () => {
    const nextLocale = locale === "es" ? "en" : "es"
    const query = variant !== "erp" ? `?v=${variant}` : ""
    router.replace(`${pathname}${query}`, { locale: nextLocale })
  }

  const toggleVoiceAudio = () => {
    const vid = voiceVideoRef.current
    if (!vid) return
    const nextMuted = !voiceMuted
    vid.muted = nextMuted
    setVoiceMuted(nextMuted)
    if (!nextMuted) {
      vid.currentTime = 0
      void vid.play()
    }
  }

  const heroChips = t.raw("hero.chips") as string[]
  const voicePillars = t.raw("voiceSuperpower.pillars") as VoicePillar[]
  const receiptLines = t.raw("problem.receipt.lines") as ReceiptLine[]
  const outreachSteps = t.raw("fieldOperations.outreachSteps") as string[]
  const competitors = t.raw("whyUnsolved.competitors") as CompetitorRow[]
  const commercialSteps = t.raw("howItWorks.commercialSteps") as string[]
  const financialSteps = t.raw("howItWorks.financialSteps") as string[]
  const differentiatorMetrics = t.raw(
    "differentiator.metrics"
  ) as DifferentiatorMetric[]
  const pricingRows = t.raw("pricing.rows") as PricingRow[]
  const faqItems = t.raw("faq.items") as FaqItem[]
  const ctaBullets = t.raw("finalCta.bullets") as string[]

  const diagnosticSchema = useMemo(
    () =>
      createDiagnosticSchema({
        name: t("finalCta.form.errors.name"),
        company: t("finalCta.form.errors.company"),
        contact: t("finalCta.form.errors.contact"),
      }),
    [t]
  )

  const form = useForm<DiagnosticFormValues>({
    resolver: zodResolver(diagnosticSchema),
    defaultValues: {
      name: "",
      company: "",
      contact: "",
      painPoint: "",
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (values: DiagnosticFormValues) => {
    setSubmitError("")

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          company: values.company,
          contact: values.contact,
          message: values.painPoint,
          variant,
          source: "produce-diagnostic",
        }),
      })

      if (!response.ok) {
        throw new Error("Submission failed")
      }

      fireConversionEvent(variant, values.company)
      setIsSuccess(true)
    } catch {
      setSubmitError(t("finalCta.form.errors.submit"))
    }
  }

  const scrollToDiagnostic = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById("diagnostic-call")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
      const firstInput = target.querySelector("input")
      if (firstInput) {
        setTimeout(() => firstInput.focus({ preventScroll: true }), 450)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#040812] text-[#f8fafc] selection:bg-brand-cyan/30 selection:text-white">
      {/* Minimal High-Conversion Sticky Header */}
      <header className="fixed top-0 right-0 left-0 z-50 h-[72px] border-b border-white/10 bg-[#040812]/90 backdrop-blur-xl">
        <div
          className={cn(
            container,
            "flex h-full items-center justify-between gap-2 px-3.5 sm:gap-4 sm:px-8"
          )}
        >
          <div className="flex items-center gap-2 sm:gap-3.5">
            <Link
              href="/produce"
              className="shrink-0 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-brand-cyan"
              aria-label="ADDNEXO Wholesale Produce System"
            >
              <Image
                src="/addnexo.png"
                alt="ADDNEXO"
                width={150}
                height={44}
                style={{ width: "auto" }}
                className="h-7 w-auto object-contain sm:h-10"
                priority
              />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-brand-cyan/50 hover:bg-white/10 hover:text-white sm:px-3.5 sm:py-2"
            >
              <Home className="size-3.5 text-brand-cyan" aria-hidden="true" />
              <span className="hidden sm:inline">{t("nav.home")}</span>
              <span className="sm:hidden">{t("nav.homeShort")}</span>
            </Link>

            {/* Desplegable de Landings en las páginas de conversión */}
            <div className="relative" ref={landingsDropdownRef}>
              <button
                type="button"
                onClick={() => setLandingsOpen((prev) => !prev)}
                aria-expanded={landingsOpen}
                aria-haspopup="true"
                className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-brand-cyan/50 hover:bg-white/10 hover:text-white sm:px-3 sm:py-2"
              >
                <span>{tNavbar("landings")}</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 text-slate-400 transition-transform duration-200",
                    landingsOpen && "rotate-180 text-brand-cyan"
                  )}
                  aria-hidden="true"
                />
              </button>

              {landingsOpen && (
                <div className="absolute top-[calc(100%+10px)] left-0 z-50 w-68 rounded-xl border border-white/15 bg-[#0a1326] p-2 shadow-[0_24px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:w-72">
                  <div className="px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.08em] text-brand-cyan uppercase">
                    {tNavbar("landingsDropdown.title")}
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    <Link
                      href="/produce?v=cost"
                      onClick={() => setLandingsOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-white/8 hover:text-white sm:text-[0.82rem]",
                        variant === "cost"
                          ? "bg-brand-cyan/15 font-bold text-brand-cyan"
                          : "text-slate-200"
                      )}
                    >
                      {tNavbar("landingsDropdown.variantCost")}
                    </Link>
                    <Link
                      href="/produce?v=excel"
                      onClick={() => setLandingsOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-white/8 hover:text-white sm:text-[0.82rem]",
                        variant === "excel"
                          ? "bg-brand-cyan/15 font-bold text-brand-cyan"
                          : "text-slate-200"
                      )}
                    >
                      {tNavbar("landingsDropdown.variantExcel")}
                    </Link>
                    <Link
                      href="/produce?v=erp"
                      onClick={() => setLandingsOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-white/8 hover:text-white sm:text-[0.82rem]",
                        variant === "erp"
                          ? "bg-brand-cyan/15 font-bold text-brand-cyan"
                          : "text-slate-200"
                      )}
                    >
                      {tNavbar("landingsDropdown.variantErp")}
                    </Link>
                    <Link
                      href="/produce?v=voice"
                      onClick={() => setLandingsOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/8 hover:text-white sm:text-[0.82rem]",
                        variant === "voice"
                          ? "bg-brand-cyan/15 font-bold text-brand-cyan"
                          : "text-brand-cyan"
                      )}
                    >
                      {tNavbar("landingsDropdown.variantVoice")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <nav
            aria-label="Page sections"
            className="hidden items-center gap-6 xl:flex"
          >
            <a
              href="#voice-superpower"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-brand-cyan"
            >
              {t("nav.voice")}
            </a>
            <a
              href="#landed-cost-problem"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {t("nav.problem")}
            </a>
            <a
              href="#parallel-flows"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {t("nav.howItWorks")}
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {t("nav.pricing")}
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {t("nav.faq")}
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-md border border-white/15 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-200 transition-colors hover:border-brand-cyan/50 hover:text-white sm:px-3"
              aria-label="Switch language"
            >
              {locale === "es" ? "EN" : "ES"}
            </button>
            <LandingButton
              asChild
              variant="navCta"
              className="px-3 py-1.5 text-xs whitespace-nowrap sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <a href="#diagnostic-call" onClick={scrollToDiagnostic}>
                <span className="hidden md:inline">{t("nav.cta")}</span>
                <span className="md:hidden">
                  {locale === "es" ? "Diagnóstico" : "Book Call"}
                </span>
              </a>
            </LandingButton>
          </div>
        </div>
      </header>

      <main>
        {/* 1. HERO (3 Interchangeable Variants via ?v=cost | ?v=excel | ?v=erp + Unified Hero Video) */}
        <section
          id="hero"
          className="relative overflow-hidden border-b border-white/10 pt-[calc(72px+3.5rem)] pb-20 sm:pt-[calc(72px+5rem)] sm:pb-28"
        >
          {/* Unified Hero Video Background (same as main page) */}
          <video
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/scs-dashboard-pc.png"
            preload="metadata"
          >
            <source src="/addnexov1-og-nwm.mp4" type="video/mp4" />
          </video>

          {/* Atmospheric Multi-Layer Overlay for High Contrast */}
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(115deg,rgba(4,8,18,0.93)_0%,rgba(6,13,30,0.86)_52%,rgba(8,28,48,0.82)_100%),radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(56,189,248,0.22)_0%,transparent_65%)]"
            aria-hidden="true"
          />

          <div
            className={cn(
              container,
              "relative z-10 grid grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12"
            )}
          >
            <div className="lg:col-span-7">
              <h1 className="font-heading max-w-[18ch] text-[clamp(2.35rem,5vw,4.3rem)] leading-[1.05] font-bold tracking-[-0.038em] text-balance text-white">
                {t(`hero.variants.${variant}.h1`)}
              </h1>

              <p className="mt-6 max-w-[580px] text-lg leading-[1.68] text-pretty text-slate-200">
                {t(`hero.variants.${variant}.subheadline`)}
              </p>

              <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <LandingButton
                  asChild
                  variant="lime"
                  size="lg"
                  className="justify-center font-bold shadow-[0_14px_36px_rgba(56,189,248,0.28)]"
                >
                  <a href="#diagnostic-call" onClick={scrollToDiagnostic}>
                    {t("ctaPrimary")}
                    <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                  </a>
                </LandingButton>

                <LandingButton
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setVideoOpen(true)}
                  className="justify-center border border-white/20 bg-white/8 font-semibold text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
                >
                  <Play
                    className="mr-1.5 size-4 fill-brand-cyan text-brand-cyan"
                    aria-hidden="true"
                  />
                  {t("watchVideo")}
                </LandingButton>
              </div>

              {/* Capability Pills */}
              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                {heroChips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3.5 py-1.5 text-xs font-semibold text-brand-cyan backdrop-blur-md"
                  >
                    <span className="size-1.5 rounded-full bg-brand-cyan" />
                    {chip}
                  </span>
                ))}
              </div>

              <p className="mt-5 max-w-[520px] text-sm leading-relaxed font-medium text-pretty text-slate-300">
                {t("socialProof")}
              </p>
            </div>

            {/* Right Column: Cockpit-Framed Live Economic Unit Lot Ledger */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-white/15 bg-[#081022]/90 p-2 shadow-[0_28px_70px_-12px_rgba(56,189,248,0.28)] backdrop-blur-xl">
                {/* Tech Corner Brackets */}
                <div
                  className="pointer-events-none absolute top-0 left-0 size-8 rounded-tl-3xl border-t-2 border-l-2 border-brand-cyan/70"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute right-0 bottom-0 size-8 rounded-br-3xl border-r-2 border-b-2 border-brand-cyan/70"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute top-0 left-1/2 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-cyan/70 to-transparent"
                  aria-hidden="true"
                />

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1325]">
                  {variant === "voice" ? (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0f1a30] px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-[0.04em] text-brand-cyan">
                          <Mic className="size-3.5" aria-hidden="true" />
                          {t("hero.voicePreview.header")}
                        </span>
                        <span className="font-mono text-xs text-slate-300">
                          {t("hero.voicePreview.origin")}
                        </span>
                      </div>

                      <div className="divide-y divide-white/10 px-4 py-3 text-sm sm:px-5">
                        <div className="py-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-brand-cyan">
                              <Mic className="size-3.5" aria-hidden="true" />
                              {t("hero.voicePreview.step1Tag")}
                            </span>
                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                              {t("hero.voicePreview.step1Status")}
                            </span>
                          </div>
                          <p className="mt-1.5 font-medium text-white">
                            {t("hero.voicePreview.step1Title")}
                          </p>
                        </div>

                        <div className="py-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-brand-cyan">
                              <MessageSquareText
                                className="size-3.5"
                                aria-hidden="true"
                              />
                              {t("hero.voicePreview.step2Tag")}
                            </span>
                            <span className="rounded-full bg-brand-cyan/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-brand-cyan">
                              {t("hero.voicePreview.step2Status")}
                            </span>
                          </div>
                          <p className="mt-1.5 font-medium text-white">
                            {t("hero.voicePreview.step2Title")}
                          </p>
                        </div>

                        <div className="py-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-brand-cyan">
                              <Send className="size-3.5" aria-hidden="true" />
                              {t("hero.voicePreview.step3Tag")}
                            </span>
                            <span className="rounded-full bg-brand-cyan/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-brand-cyan">
                              {t("hero.voicePreview.step3Status")}
                            </span>
                          </div>
                          <p className="mt-1.5 font-medium text-white">
                            {t("hero.voicePreview.step3Title")}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-white/10 bg-[#070d1c] p-3">
                        <Image
                          src="/hombre-en-officina-usando-addnexo.jpeg"
                          alt="Executive operating ADDNEXO by voice and AI assistant"
                          width={900}
                          height={520}
                          className="aspect-[16/10] w-full rounded-lg border border-white/10 object-cover"
                          priority
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0f1a30] px-5 py-3.5">
                        <span className="font-mono text-xs font-bold tracking-[0.04em] text-brand-cyan">
                          {t("hero.ledgerPreview.header")}
                        </span>
                        <span className="font-mono text-xs text-slate-300">
                          {t("hero.ledgerPreview.origin")}
                        </span>
                      </div>

                      <div className="divide-y divide-white/10 px-4 py-2 text-sm sm:px-5">
                        <div className="grid grid-cols-12 items-end gap-3 py-2.5 text-xs font-semibold tracking-[0.02em] text-slate-300 uppercase">
                          <div className="col-span-5">
                            {t("hero.ledgerPreview.colItem")}
                          </div>
                          <div className="col-span-3 text-right leading-tight">
                            {t("hero.ledgerPreview.colSheet")}
                          </div>
                          <div className="col-span-4 text-right leading-tight text-brand-cyan">
                            {t("hero.ledgerPreview.colAddnexo")}
                          </div>
                        </div>

                        <div className="grid grid-cols-12 items-center gap-2 py-3 tabular-nums">
                          <div className="col-span-5 font-medium text-slate-200">
                            {t("hero.ledgerPreview.growerLabel")}
                          </div>
                          <div className="col-span-3 text-right font-mono text-slate-300">
                            {t("hero.ledgerPreview.growerSheet")}
                          </div>
                          <div className="col-span-4 text-right font-mono font-semibold text-white">
                            {t("hero.ledgerPreview.growerLive")}
                          </div>
                        </div>

                        <div className="grid grid-cols-12 items-center gap-2 py-3 tabular-nums">
                          <div className="col-span-5 font-medium text-slate-200">
                            {t("hero.ledgerPreview.postInvoiceLabel")}
                          </div>
                          <div className="col-span-3 text-right font-mono text-xs text-amber-300">
                            {t("hero.ledgerPreview.postInvoiceSheet")}
                          </div>
                          <div className="col-span-4 text-right font-mono font-semibold text-brand-cyan">
                            {t("hero.ledgerPreview.postInvoiceLive")}
                          </div>
                        </div>

                        <div className="grid grid-cols-12 items-center gap-2 py-3 tabular-nums">
                          <div className="col-span-5 font-semibold text-white">
                            {t("hero.ledgerPreview.unitCostLabel")}
                          </div>
                          <div className="col-span-3 text-right font-mono text-rose-300 line-through">
                            {t("hero.ledgerPreview.unitCostSheet")}
                          </div>
                          <div className="col-span-4 text-right font-mono font-bold text-white">
                            {t("hero.ledgerPreview.unitCostLive")}
                          </div>
                        </div>

                        <div className="grid grid-cols-12 items-center gap-2 py-3.5 tabular-nums">
                          <div className="col-span-5 font-semibold text-slate-200">
                            {t("hero.ledgerPreview.marginVerdictLabel")}
                          </div>
                          <div className="col-span-3 text-right font-mono text-xs text-slate-300">
                            {t("hero.ledgerPreview.marginVerdictSheet")}
                          </div>
                          <div className="col-span-4 text-right font-mono text-xs font-bold text-rose-300">
                            {t("hero.ledgerPreview.marginVerdictLive")}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/10 bg-[#070d1c] p-3">
                        <Image
                          src="/scs-dashboard-pc.png"
                          alt="ADDNEXO operational and financial control dashboard"
                          width={900}
                          height={520}
                          className="h-auto w-full rounded-lg border border-white/10 object-cover"
                          priority
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. AUTO-FLUID FEATURE SLIDER (Pauses on Hover) */}
        <FeatureMarquee />

        {/* 3. CORE SUPERPOWER: 100% Voice Operation & Conversational Executive Assistant */}
        <section
          id="voice-superpower"
          className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_80%_60%_at_18%_35%,rgba(20,184,166,0.16)_0%,rgba(56,189,248,0.09)_42%,rgba(5,10,22,1)_80%)] py-20 sm:py-28"
        >
          <div className={cn(container, "px-5 sm:px-8")}>
            {/* Centered High-Impact Statement */}
            <div className="mx-auto max-w-[820px] text-center">
              <h2 className="font-heading text-[clamp(2rem,4.2vw,3.35rem)] leading-[1.08] font-bold tracking-[-0.035em] text-balance text-white">
                {t("voiceSuperpower.h2")}
              </h2>
              <p className="mx-auto mt-5 max-w-[680px] text-lg leading-[1.7] text-pretty text-slate-200">
                {t("voiceSuperpower.subtitle")}
              </p>
            </div>

            {/* Asymmetric Split Stage: Left = Vertical Voice PO Video Holder | Right = Executive Assistant & Pillars */}
            <div className="mt-14 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
              {/* Left 5 Cols: Vertical Phone Cockpit Holder for Voice Creation Video */}
              <div className="relative flex flex-col justify-between rounded-3xl border border-white/15 bg-[#071124]/90 p-5 shadow-[0_28px_70px_-15px_rgba(20,184,166,0.22)] backdrop-blur-xl sm:p-7 lg:col-span-5">
                <div
                  className="pointer-events-none absolute top-0 left-0 size-8 rounded-tl-3xl border-t-2 border-l-2 border-brand-cyan/70"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute right-0 bottom-0 size-8 rounded-br-3xl border-r-2 border-b-2 border-brand-cyan/70"
                  aria-hidden="true"
                />

                <div>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/35 bg-brand-cyan/15 px-3 py-1.5 font-mono text-[11px] font-bold text-brand-cyan sm:text-xs">
                      <Mic className="size-3.5 shrink-0" aria-hidden="true" />
                      <span>{t("voiceSuperpower.videoLabel")}</span>
                    </div>

                    <button
                      type="button"
                      onClick={toggleVoiceAudio}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:border-brand-cyan hover:bg-brand-cyan hover:text-brand-dark"
                    >
                      {voiceMuted ? (
                        <>
                          <Volume2 className="size-3.5" aria-hidden="true" />
                          {t("voiceSuperpower.unmuteBtn")}
                        </>
                      ) : (
                        <>
                          <VolumeX className="size-3.5" aria-hidden="true" />
                          {t("voiceSuperpower.muteBtn")}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Vertical 9:16 Phone Bezel Holder (No Cropping) */}
                  <div className="mx-auto w-full max-w-[300px] sm:max-w-[330px]">
                    <div className="relative rounded-[34px] border-4 border-slate-700/90 bg-[#050914] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
                      <div
                        className="pointer-events-none absolute top-3.5 left-1/2 z-20 h-3.5 w-16 -translate-x-1/2 rounded-full bg-black/80"
                        aria-hidden="true"
                      />
                      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[26px] bg-black">
                        <video
                          ref={voiceVideoRef}
                          src="/muestra%20como%20crear%20una%20orden%20de%20compra%20por%20voz.mp4"
                          autoPlay
                          loop
                          muted={voiceMuted}
                          playsInline
                          controls
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spoken Voice Command Transcript Box */}
                <div className="mt-6 rounded-2xl border border-brand-cyan/30 bg-[#0b1930] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand-cyan text-brand-dark">
                      <Mic className="size-4" aria-hidden="true" />
                    </div>
                    <p className="font-mono text-xs leading-relaxed font-medium text-white sm:text-sm">
                      {t("voiceSuperpower.videoCaption")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Executive Conversational Assistant + Office Photo + 3 Delegation Pillars */}
              <div className="flex flex-col justify-between gap-6 lg:col-span-7">
                <div className="flex-1 rounded-3xl border border-white/15 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-7">
                  <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/15">
                    <Image
                      src="/hombre-en-officina-usando-addnexo.jpeg"
                      alt="Distributor owner managing operations with ADDNEXO conversational assistant"
                      width={720}
                      height={480}
                      className="aspect-[16/9] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#050b18]/85 px-3.5 py-1.5 text-xs font-bold text-brand-cyan backdrop-blur-md">
                      <MessageSquareText className="size-3.5" aria-hidden="true" />
                      AI Executive Assistant
                    </div>
                  </div>

                  <h3 className="font-heading text-xl leading-snug font-bold tracking-[-0.02em] text-white sm:text-2xl">
                    {t("voiceSuperpower.assistantTitle")}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.65] text-slate-300 sm:text-base">
                    {t("voiceSuperpower.assistantDesc")}
                  </p>

                  {/* Live Q&A Conversation Cards */}
                  <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#0a1326] p-4">
                      <p className="text-xs font-bold text-brand-cyan">
                        {t("voiceSuperpower.assistantPrompt1")}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-200 sm:text-sm">
                        {t("voiceSuperpower.assistantReply1")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a1326] p-4">
                      <p className="text-xs font-bold text-brand-cyan">
                        {t("voiceSuperpower.assistantPrompt2")}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-200 sm:text-sm">
                        {t("voiceSuperpower.assistantReply2")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Voice & Delegation Pillars */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {voicePillars.map((pillar) => (
                    <div
                      key={pillar.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-colors hover:border-brand-cyan/40 hover:bg-white/[0.06]"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <CheckCircle2
                          className="size-4 shrink-0 text-brand-cyan"
                          aria-hidden="true"
                        />
                        <h3 className="font-heading text-base font-bold text-white">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-xs leading-[1.6] text-slate-300 sm:text-sm">
                        {pillar.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CONCRETE PROBLEM: The $42,000 Avocado Container Receipt & Cooler Chaos */}
        <section
          id="landed-cost-problem"
          className="border-b border-white/10 bg-[radial-gradient(ellipse_65%_50%_at_80%_20%,rgba(245,158,11,0.09)_0%,rgba(10,17,34,1)_70%)] py-20 sm:py-28"
        >
          <div
            className={cn(
              container,
              "grid grid-cols-1 items-start gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14"
            )}
          >
            <div className="lg:col-span-5">
              <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-white">
                {t("problem.h2")}
              </h2>

              <p className="mt-5 max-w-[500px] text-base leading-[1.7] text-pretty text-slate-200">
                {t("problem.lead")}
              </p>

              <p className="mt-4 max-w-[500px] text-base leading-[1.7] text-pretty text-slate-300">
                {t("problem.body")}
              </p>

              {/* Contextual Warehouse Cooler Photo */}
              <div className="mt-7 overflow-hidden rounded-2xl border border-amber-400/25 bg-[#070d1b] shadow-xl">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/hombre-en-bodega-buscando.jpeg"
                    alt="Warehouse operator searching through paper records in produce cooler"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                </div>
                <p className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed font-medium text-amber-200">
                  {t("problem.coolerPhotoCaption")}
                </p>
              </div>

              <p className="mt-6 max-w-[500px] rounded-xl border border-brand-cyan/35 bg-brand-cyan/10 p-5 text-base leading-[1.6] font-bold text-pretty text-white">
                {t("problem.marginCallout")}
              </p>

              <div className="mt-8">
                <LandingButton asChild variant="lime" size="lg">
                  <a href="#diagnostic-call" onClick={scrollToDiagnostic}>
                    {t("ctaPrimary")}
                  </a>
                </LandingButton>
              </div>
            </div>

            {/* Visual Receipt Card */}
            <div className="lg:col-span-7 lg:sticky lg:top-[96px]">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#060b19] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                <div className="border-b border-white/10 bg-[#0d162c] px-6 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-mono text-sm font-bold tracking-[0.06em] text-white uppercase">
                      {t("problem.receipt.title")}
                    </h3>
                    <span className="font-mono text-xs text-brand-cyan">
                      {t("problem.receipt.meta")}
                    </span>
                  </div>

                  {/* Interactive Mode Switch */}
                  <div
                    role="group"
                    aria-label="Landed cost calculation view"
                    className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2"
                  >
                    <button
                      type="button"
                      onClick={() => setReceiptMode("blind")}
                      className={cn(
                        "rounded-lg border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors sm:text-sm",
                        receiptMode === "blind"
                          ? "border-rose-400/50 bg-rose-500/15 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
                      )}
                    >
                      {t("problem.receipt.toggleBlind")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReceiptMode("true")}
                      className={cn(
                        "rounded-lg border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors sm:text-sm",
                        receiptMode === "true"
                          ? "border-brand-cyan/60 bg-brand-cyan/15 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
                      )}
                    >
                      {t("problem.receipt.toggleTrue")}
                    </button>
                  </div>
                </div>

                <ul className="divide-y divide-white/10 px-6 py-2">
                  {receiptLines.map((item, idx) => {
                    const isBase = item.type === "base"
                    return (
                      <li
                        key={idx}
                        className="flex flex-wrap items-center justify-between gap-3 py-3.5 tabular-nums"
                      >
                        <div className="min-w-[220px] flex-1">
                          <div
                            className={cn(
                              "text-sm sm:text-base",
                              isBase
                                ? "font-bold text-white"
                                : "font-medium text-slate-200"
                            )}
                          >
                            {item.label}
                          </div>
                          <div className="mt-0.5 font-mono text-xs text-slate-300">
                            {item.timing}
                          </div>
                        </div>

                        <div className="text-right font-mono transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                          {isBase ? (
                            <span className="text-base font-bold text-white">
                              {item.amount}
                            </span>
                          ) : receiptMode === "blind" ? (
                            <span className="inline-flex items-baseline gap-1.5 text-sm font-semibold text-amber-300">
                              <span>{item.amount}</span>
                              <span className="text-xs text-slate-300">
                                {t("problem.receipt.unlinkedTag")}
                              </span>
                            </span>
                          ) : (
                            <span className="inline-block translate-x-0 text-sm font-bold text-brand-cyan sm:text-base">
                              {item.amount}
                            </span>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>

                <div
                  className={cn(
                    "border-t-2 border-dashed px-6 py-6 transition-colors",
                    receiptMode === "blind"
                      ? "border-rose-400/40 bg-rose-950/25"
                      : "border-brand-cyan/40 bg-brand-cyan/10"
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-4 tabular-nums">
                    <span className="font-mono text-xs font-bold tracking-[0.05em] text-slate-200 uppercase sm:text-sm">
                      {receiptMode === "blind"
                        ? t("problem.receipt.blindTotalLabel")
                        : t("problem.receipt.trueTotalLabel")}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-2xl font-black tracking-[-0.03em] sm:text-3xl",
                        receiptMode === "blind"
                          ? "text-rose-300"
                          : "text-brand-cyan"
                      )}
                    >
                      {receiptMode === "blind"
                        ? t("problem.receipt.blindTotalValue")
                        : t("problem.receipt.trueTotalValue")}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[520px] text-sm text-pretty text-slate-200">
                    {receiptMode === "blind"
                      ? t("problem.receipt.blindSub")
                      : t("problem.receipt.trueSub")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FIELD OPERATIONS: AI Quality Reports at Dock, Guided Dispatch & Automated Buyer Outreach */}
        <section
          id="field-operations"
          className="border-b border-white/10 bg-[linear-gradient(160deg,#050b18_0%,#0a1e2e_52%,#060d1c_100%)] py-20 sm:py-28"
        >
          <div className={cn(container, "px-5 sm:px-8")}>
            <div className="max-w-[760px]">
              <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.9rem)] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-white">
                {t("fieldOperations.h2")}
              </h2>
              <p className="mt-4 max-w-[620px] text-base leading-[1.7] text-pretty text-slate-200 sm:text-lg">
                {t("fieldOperations.subtitle")}
              </p>
            </div>

            {/* 3 Real Warehouse Photo Cards (Receiving -> AI Quality Report -> Guided Dispatch) */}
            <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-3">
              {/* Card 1: Receiving Merchandise */}
              <article className="group overflow-hidden rounded-3xl border border-white/15 bg-[#081224]/90 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-cyan/50">
                <div className="relative aspect-[16/11] w-full overflow-hidden">
                  <Image
                    src="/recibiendo mercancia con addnexo.jpeg"
                    alt="Receiving produce pallets on the dock with ADDNEXO"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl leading-snug font-bold text-white">
                    {t("fieldOperations.receivingTitle")}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.68] text-slate-300 sm:text-base">
                    {t("fieldOperations.receivingDesc")}
                  </p>
                </div>
              </article>

              {/* Card 2: Delivering AI Quality Report */}
              <article className="group overflow-hidden rounded-3xl border border-white/15 bg-[#081224]/90 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-cyan/50">
                <div className="relative aspect-[16/11] w-full overflow-hidden">
                  <Image
                    src="/entregando reporte addnexo.jpeg"
                    alt="AI-generated quality inspection report delivered with ADDNEXO"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl leading-snug font-bold text-white">
                    {t("fieldOperations.reportTitle")}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.68] text-slate-300 sm:text-base">
                    {t("fieldOperations.reportDesc")}
                  </p>
                </div>
              </article>

              {/* Card 3: Warehouse Dispatch */}
              <article className="group overflow-hidden rounded-3xl border border-white/15 bg-[#081224]/90 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-cyan/50">
                <div className="relative aspect-[16/11] w-full overflow-hidden">
                  <Image
                    src="/haciendo despacho con addnexo.jpeg"
                    alt="Warehouse team executing dispatch with ADDNEXO"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl leading-snug font-bold text-white">
                    {t("fieldOperations.dispatchTitle")}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.68] text-slate-300 sm:text-base">
                    {t("fieldOperations.dispatchDesc")}
                  </p>
                </div>
              </article>
            </div>

            {/* Automated Buyer Outreach Engine Banner */}
            <div className="relative mt-10 overflow-hidden rounded-3xl border border-brand-cyan/35 bg-[#061527]/95 p-7 shadow-[0_24px_60px_-15px_rgba(56,189,248,0.2)] sm:p-10">
              <div
                className="pointer-events-none absolute top-0 left-0 size-8 rounded-tl-3xl border-t-2 border-l-2 border-brand-cyan/70"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute right-0 bottom-0 size-8 rounded-br-3xl border-r-2 border-b-2 border-brand-cyan/70"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/15 px-3.5 py-1 text-xs font-bold text-brand-cyan">
                    <Send className="size-3.5" aria-hidden="true" />
                    Automated Commercial Engine
                  </div>
                  <h3 className="font-heading text-2xl leading-tight font-bold text-white sm:text-3xl">
                    {t("fieldOperations.outreachTitle")}
                  </h3>
                  <p className="mt-3 max-w-[640px] text-base leading-[1.7] text-slate-200">
                    {t("fieldOperations.outreachDesc")}
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <div className="flex flex-col gap-2.5">
                    {outreachSteps.map((step, idx) => (
                      <div
                        key={step}
                        className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-cyan font-mono text-xs font-bold text-brand-dark">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. HOW IT WORKS: Two Parallel Connected Flows Running as One System */}
        <section
          id="parallel-flows"
          className="border-b border-white/10 bg-[#050914] bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] py-20 sm:py-28"
        >
          <div className={cn(container, "px-5 sm:px-8")}>
            <div className="max-w-[680px]">
              <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-white">
                {t("howItWorks.h2")}
              </h2>
              <p className="mt-4 max-w-[540px] text-base leading-[1.7] text-pretty text-slate-200">
                {t("howItWorks.subtitle")}
              </p>
            </div>

            <div className="mt-12 rounded-3xl border border-white/15 bg-[#081022]/95 p-6 shadow-2xl backdrop-blur-md sm:p-10">
              {/* Stream 1: Commercial Flow */}
              <div>
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="font-mono text-sm font-bold tracking-[0.06em] text-brand-cyan uppercase">
                    {t("howItWorks.commercialTitle")}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {commercialSteps.map((step, i) => (
                    <div key={step} className="flex items-center gap-2 sm:gap-3">
                      <span className="rounded-xl border border-white/15 bg-[#0f1a30] px-4 py-2.5 text-sm font-bold text-white">
                        {step}
                      </span>
                      {i < commercialSteps.length - 1 && (
                        <ArrowRight
                          className="size-4 shrink-0 text-brand-cyan"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Parallel Real-Time Sync Bridge */}
              <div className="my-7 flex items-center gap-4 border-y border-dashed border-brand-cyan/35 py-4 text-sm text-slate-200">
                <svg
                  className="size-5 shrink-0 text-brand-cyan"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
                <p className="max-w-[560px] font-medium text-pretty text-white">
                  {t("howItWorks.syncNote")}
                </p>
              </div>

              {/* Stream 2: Financial Flow */}
              <div>
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="font-mono text-sm font-bold tracking-[0.06em] text-brand-cyan uppercase">
                    {t("howItWorks.financialTitle")}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {financialSteps.map((step, i) => (
                    <div key={step} className="flex items-center gap-2 sm:gap-3">
                      <span className="rounded-xl border border-brand-cyan/35 bg-brand-cyan/10 px-4 py-2.5 text-sm font-bold text-white">
                        {step}
                      </span>
                      {i < financialSteps.length - 1 && (
                        <ArrowRight
                          className="size-4 shrink-0 text-brand-cyan"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. THE DIFFERENTIATOR: Inventory as a Measurable Economic Unit & Live Dashboards */}
        <section
          id="economic-unit"
          className="border-b border-white/10 bg-[radial-gradient(ellipse_70%_55%_at_25%_50%,rgba(59,130,246,0.14)_0%,rgba(7,13,27,1)_75%)] py-20 sm:py-28"
        >
          <div
            className={cn(
              container,
              "grid grid-cols-1 items-start gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14"
            )}
          >
            <div className="lg:col-span-6">
              <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-white">
                {t("differentiator.h2")}
              </h2>
              <p className="mt-5 max-w-[520px] text-base leading-[1.7] text-pretty text-slate-200">
                {t("differentiator.subtitle")}
              </p>

              <dl className="mt-8 divide-y divide-white/10 border-y border-white/15">
                {differentiatorMetrics.map((metric) => (
                  <div
                    key={metric.code}
                    className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-4"
                  >
                    <dt className="font-heading text-base font-bold text-brand-cyan sm:col-span-5">
                      {metric.title}
                    </dt>
                    <dd className="max-w-[440px] text-base leading-[1.65] text-pretty text-slate-200 sm:col-span-7">
                      {metric.desc}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8">
                <LandingButton asChild variant="lime" size="lg">
                  <a href="#diagnostic-call" onClick={scrollToDiagnostic}>
                    {t("ctaPrimary")}
                  </a>
                </LandingButton>
              </div>
            </div>

            {/* Right Column: Dual Visual Showcase (viendo dasboard de addnexo.jpeg + scs-dasboard1-pc.png) */}
            <div className="space-y-6 lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0b1325] p-2.5 shadow-2xl">
                <div
                  className="pointer-events-none absolute top-0 left-0 size-7 rounded-tl-3xl border-t-2 border-l-2 border-brand-cyan/70"
                  aria-hidden="true"
                />
                <Image
                  src="/viendo dasboard de addnexo.jpeg"
                  alt="Distributor reviewing live lot margins and executive dashboards in ADDNEXO"
                  width={900}
                  height={560}
                  className="h-auto w-full rounded-2xl object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#0b1325] p-2.5 shadow-2xl">
                <Image
                  src="/scs-dasboard1-pc.png"
                  alt="ADDNEXO lot-level economic unit and inventory view"
                  width={900}
                  height={560}
                  className="h-auto w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 8. WHY NO ONE HAS SOLVED IT & MIAMI 4 A.M. ORIGIN */}
        <section
          id="why-unsolved"
          className="border-b border-white/10 bg-[#040711] py-20 sm:py-28"
        >
          <div className={cn(container, "px-5 sm:px-8")}>
            <div className="max-w-[680px]">
              <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-white">
                {t("whyUnsolved.h2")}
              </h2>
              <p className="mt-4 max-w-[540px] text-base leading-[1.7] text-pretty text-slate-200">
                {t("whyUnsolved.subtitle")}
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border border-white/15 bg-[#091122]">
              <div className="divide-y divide-white/10">
                {competitors.map((comp, idx) => {
                  const isAddnexo = idx === 2
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:items-center",
                        isAddnexo && "bg-brand-cyan/10"
                      )}
                    >
                      <div className="lg:col-span-4">
                        <h3
                          className={cn(
                            "font-heading text-xl font-bold tracking-[-0.02em]",
                            isAddnexo ? "text-brand-cyan" : "text-white"
                          )}
                        >
                          {comp.name}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-pretty text-slate-200">
                          {comp.verdict}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 tabular-nums sm:flex sm:gap-8 lg:col-span-3 lg:flex-col lg:gap-1.5">
                        <div>
                          <span className="block font-mono text-xs text-slate-300 uppercase">
                            {t("whyUnsolved.colCost")}
                          </span>
                          <span
                            className={cn(
                              "font-mono text-sm font-bold sm:text-base",
                              isAddnexo ? "text-brand-cyan" : "text-white"
                            )}
                          >
                            {comp.cost}
                          </span>
                        </div>
                        <div>
                          <span className="block font-mono text-xs text-slate-300 uppercase">
                            {t("whyUnsolved.colTimeline")}
                          </span>
                          <span className="font-mono text-sm font-medium text-slate-200">
                            {comp.timeline}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-5">
                        <p className="max-w-[480px] text-base leading-[1.65] text-pretty text-slate-200">
                          {comp.reality}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Miami Wholesale Distributor Origin Card */}
            <div className="mt-16 rounded-3xl border border-white/12 bg-white/[0.03] p-8 backdrop-blur-md sm:p-12">
              <blockquote className="font-heading max-w-[920px] text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.15] font-bold tracking-[-0.03em] text-balance text-brand-cyan">
                {t("credibility.quote")}
              </blockquote>

              <div className="mt-10 grid grid-cols-1 gap-8 border-t border-white/15 pt-8 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <h3 className="font-heading max-w-[22ch] text-2xl leading-[1.2] font-bold tracking-[-0.025em] text-balance text-white">
                    {t("credibility.h2")}
                  </h3>
                </div>

                <div className="max-w-[560px] space-y-4 text-base leading-[1.7] text-pretty text-slate-200 lg:col-span-7">
                  <p>{t("credibility.p1")}</p>
                  <p>{t("credibility.p2")}</p>
                  <p className="text-slate-300">{t("credibility.p3")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. PRICING: $90 per user / month */}
        <section
          id="pricing"
          className="border-b border-white/10 bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(56,189,248,0.12)_0%,rgba(9,16,34,1)_70%)] py-20 sm:py-28"
        >
          <div className={cn(container, "px-5 sm:px-8")}>
            <div className="max-w-[680px]">
              <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-white">
                {t("pricing.h2")}
              </h2>
              <p className="mt-4 max-w-[540px] text-lg leading-[1.65] font-medium text-pretty text-slate-200">
                {t("pricing.subtitle")}
              </p>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/15 bg-[#060b19] shadow-2xl">
              <div
                className="pointer-events-none absolute top-0 left-0 size-8 rounded-tl-3xl border-t-2 border-l-2 border-brand-cyan/70"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute right-0 bottom-0 size-8 rounded-br-3xl border-r-2 border-b-2 border-brand-cyan/70"
                aria-hidden="true"
              />

              <div className="hidden grid-cols-12 border-b border-white/10 bg-[#0d162c] px-8 py-4 font-mono text-xs font-bold tracking-[0.06em] text-slate-300 uppercase md:grid">
                <div className="col-span-3">{t("pricing.colUsers")}</div>
                <div className="col-span-3">{t("pricing.colMonthly")}</div>
                <div className="col-span-6">{t("pricing.colCoverage")}</div>
              </div>

              <div className="divide-y divide-white/10">
                {pricingRows.map((row) => (
                  <div
                    key={row.users}
                    className={cn(
                      "grid grid-cols-1 items-center gap-3 px-6 py-6 tabular-nums sm:px-8 md:grid-cols-12 md:gap-4",
                      row.highlight && "bg-brand-cyan/10"
                    )}
                  >
                    <div className="font-heading text-xl font-bold text-white md:col-span-3">
                      {row.users}
                    </div>
                    <div className="font-mono text-2xl font-bold text-brand-cyan md:col-span-3">
                      {row.price}
                    </div>
                    <div className="max-w-[480px] text-base leading-[1.6] text-pretty text-slate-200 md:col-span-6">
                      {row.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <p className="max-w-[540px] text-sm leading-[1.65] text-pretty text-slate-300">
                {t("pricing.footnote")}
              </p>
              <LandingButton asChild variant="lime" size="lg">
                <a href="#diagnostic-call" onClick={scrollToDiagnostic}>
                  {t("ctaPrimary")}
                </a>
              </LandingButton>
            </div>
          </div>
        </section>

        {/* 10. FAQ: "+" Accordion */}
        <section
          id="faq"
          className="border-b border-white/10 bg-[#050915] py-20 sm:py-28"
        >
          <div className={cn(container, "max-w-[920px] px-5 sm:px-8")}>
            <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-white">
              {t("faq.h2")}
            </h2>

            <div className="mt-10 divide-y divide-white/10 border-y border-white/15">
              {faqItems.map((item, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div key={item.q} className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 text-left"
                    >
                      <span className="font-heading text-lg font-bold text-white">
                        {item.q}
                      </span>
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 font-mono text-lg leading-none text-brand-cyan transition-transform duration-200",
                          isOpen &&
                            "rotate-45 border-brand-cyan bg-brand-cyan/15"
                        )}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-4 max-w-[640px] pr-4 text-base leading-[1.7] text-pretty text-slate-200">
                        {item.a}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 11. FINAL CTA: Short Diagnostic Call Form + Immediate Cal.com Option */}
        <section
          id="diagnostic-call"
          className="bg-[radial-gradient(ellipse_75%_55%_at_50%_100%,rgba(56,189,248,0.16)_0%,rgba(6,11,24,1)_70%)] py-20 sm:py-28"
        >
          <div
            className={cn(
              container,
              "grid grid-cols-1 items-start gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14"
            )}
          >
            <div className="lg:col-span-5">
              <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.08] font-bold tracking-[-0.035em] text-balance text-white">
                {t("finalCta.h2")}
              </h2>
              <p className="mt-5 max-w-[460px] text-lg leading-[1.68] text-pretty text-slate-200">
                {t("finalCta.subtitle")}
              </p>

              <ul className="mt-8 max-w-[460px] space-y-4 border-t border-white/10 pt-7">
                {ctaBullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 text-base text-pretty text-slate-200"
                  >
                    <CheckCircle2
                      className="mt-1 size-5 shrink-0 text-brand-cyan"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-3xl border border-white/15 bg-[#060b19] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.6)] sm:p-10">
                <div
                  className="pointer-events-none absolute top-0 left-0 size-8 rounded-tl-3xl border-t-2 border-l-2 border-brand-cyan/70"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute right-0 bottom-0 size-8 rounded-br-3xl border-r-2 border-b-2 border-brand-cyan/70"
                  aria-hidden="true"
                />

                {/* Tabs to choose between Quick Form or Instant Calendar */}
                <div className="mb-6 flex rounded-xl border border-white/12 bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() => setCtaMode("form")}
                    className={cn(
                      "flex-1 rounded-lg py-2.5 text-xs font-semibold transition-all sm:text-sm",
                      ctaMode === "form"
                        ? "bg-brand-cyan text-brand-dark shadow-md"
                        : "text-slate-300 hover:text-white"
                    )}
                  >
                    {t("finalCta.tabs.form")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCtaMode("calendar")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all sm:text-sm",
                      ctaMode === "calendar"
                        ? "bg-brand-cyan text-brand-dark shadow-md"
                        : "text-slate-300 hover:text-white"
                    )}
                  >
                    <Calendar className="size-3.5" aria-hidden="true" />
                    {t("finalCta.tabs.cal")}
                  </button>
                </div>

                {ctaMode === "calendar" ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-[#0c1528] p-4 text-center">
                      <p className="text-sm font-medium text-slate-200">
                        {t("finalCta.immediateBookingNotice")}
                      </p>
                      <a
                        href="https://cal.com/adstrategic-mml9qb/30min"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-cyan px-4 py-2 text-xs font-bold text-brand-dark transition-opacity hover:opacity-90"
                      >
                        {t("finalCta.immediateBookingButton")}
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#090f1d]">
                      <iframe
                        src="https://cal.com/adstrategic-mml9qb/30min"
                        title="Cal.com Booking"
                        className="h-[600px] w-full border-0"
                        loading="lazy"
                        allow="camera; microphone; fullscreen"
                      />
                    </div>
                  </div>
                ) : isSuccess ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-brand-cyan/40 bg-brand-cyan/15 text-brand-cyan">
                      <CheckCircle2 className="size-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white">
                      {t("finalCta.form.successTitle")}
                    </h3>
                    <p className="mx-auto mt-3 max-w-[420px] text-base leading-relaxed text-pretty text-slate-200">
                      {t("finalCta.form.successBody")}
                    </p>

                    {/* Instant booking option after form */}
                    <div className="mt-8 rounded-xl border border-brand-cyan/30 bg-brand-cyan/10 p-5 text-center">
                      <p className="text-sm font-semibold text-white">
                        {t("finalCta.successCalPrompt")}
                      </p>
                      <a
                        href="https://cal.com/adstrategic-mml9qb/30min"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-cyan px-5 py-2.5 text-xs font-bold text-brand-dark transition-opacity hover:opacity-90 sm:text-sm"
                      >
                        {t("finalCta.successCalButton")}
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Instant Booking Banner */}
                    <div className="mb-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-brand-cyan/25 bg-brand-cyan/10 px-4 py-3 text-left sm:flex-row">
                      <span className="text-xs font-semibold text-white sm:text-sm">
                        {t("finalCta.immediateBookingNotice")}
                      </span>
                      <a
                        href="https://cal.com/adstrategic-mml9qb/30min"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-cyan px-3.5 py-1.5 text-xs font-bold text-brand-dark transition-opacity hover:opacity-90"
                      >
                        {t("finalCta.immediateBookingButton")}
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Controller
                          name="name"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field
                              data-invalid={fieldState.invalid}
                              className="flex-col gap-0"
                            >
                              <FieldLabel
                                htmlFor={field.name}
                                className="mb-2 block text-sm font-semibold text-slate-100"
                              >
                                {t("finalCta.form.nameLabel")}
                              </FieldLabel>
                              <Input
                                {...field}
                                id={field.name}
                                type="text"
                                autoComplete="name"
                                placeholder={t("finalCta.form.namePh")}
                                aria-invalid={fieldState.invalid}
                                className="h-auto w-full rounded-xl border-white/15 bg-[#0c1528] px-4 py-3.5 text-base text-white placeholder:text-slate-400 focus-visible:border-brand-cyan focus-visible:ring-2 focus-visible:ring-brand-cyan/30"
                              />
                              {fieldState.invalid && (
                                <FieldError
                                  className="mt-1.5 text-rose-300"
                                  errors={[fieldState.error]}
                                />
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name="company"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field
                              data-invalid={fieldState.invalid}
                              className="flex-col gap-0"
                            >
                              <FieldLabel
                                htmlFor={field.name}
                                className="mb-2 block text-sm font-semibold text-slate-100"
                              >
                                {t("finalCta.form.companyLabel")}
                              </FieldLabel>
                              <Input
                                {...field}
                                id={field.name}
                                type="text"
                                autoComplete="organization"
                                placeholder={t("finalCta.form.companyPh")}
                                aria-invalid={fieldState.invalid}
                                className="h-auto w-full rounded-xl border-white/15 bg-[#0c1528] px-4 py-3.5 text-base text-white placeholder:text-slate-400 focus-visible:border-brand-cyan focus-visible:ring-2 focus-visible:ring-brand-cyan/30"
                              />
                              {fieldState.invalid && (
                                <FieldError
                                  className="mt-1.5 text-rose-300"
                                  errors={[fieldState.error]}
                                />
                              )}
                            </Field>
                          )}
                        />
                      </div>

                      <Controller
                        name="contact"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field
                            data-invalid={fieldState.invalid}
                            className="mt-5 flex-col gap-0"
                          >
                            <FieldLabel
                              htmlFor={field.name}
                              className="mb-2 block text-sm font-semibold text-slate-100"
                            >
                              {t("finalCta.form.contactLabel")}
                            </FieldLabel>
                            <Input
                              {...field}
                              id={field.name}
                              type="text"
                              autoComplete="email tel"
                              placeholder={t("finalCta.form.contactPh")}
                              aria-invalid={fieldState.invalid}
                              className="h-auto w-full rounded-xl border-white/15 bg-[#0c1528] px-4 py-3.5 text-base text-white placeholder:text-slate-400 focus-visible:border-brand-cyan focus-visible:ring-2 focus-visible:ring-brand-cyan/30"
                            />
                            {fieldState.invalid && (
                              <FieldError
                                className="mt-1.5 text-rose-300"
                                errors={[fieldState.error]}
                              />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="painPoint"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field
                            data-invalid={fieldState.invalid}
                            className="mt-5 flex-col gap-0"
                          >
                            <FieldLabel
                              htmlFor={field.name}
                              className="mb-2 block text-sm font-semibold text-slate-100"
                            >
                              {t("finalCta.form.painLabel")}
                            </FieldLabel>
                            <Textarea
                              {...field}
                              id={field.name}
                              rows={3}
                              placeholder={t("finalCta.form.painPh")}
                              aria-invalid={fieldState.invalid}
                              className="min-h-0 w-full rounded-xl border-white/15 bg-[#0c1528] px-4 py-3.5 text-base text-white placeholder:text-slate-400 focus-visible:border-brand-cyan focus-visible:ring-2 focus-visible:ring-brand-cyan/30"
                            />
                          </Field>
                        )}
                      />

                      <LandingButton
                        type="submit"
                        variant="lime"
                        size="full"
                        className="mt-6 font-bold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? t("finalCta.form.submitting")
                          : t("finalCta.form.submit")}
                      </LandingButton>

                      <p className="mt-4 text-center text-sm text-slate-300">
                        {t("finalCta.form.expectation")}
                      </p>

                      {submitError ? (
                        <p className="mt-4 rounded-lg border border-rose-400/40 bg-rose-950/40 p-3.5 text-center text-sm font-medium text-rose-200">
                          {submitError}
                        </p>
                      ) : null}
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Conversion Footer */}
      <footer className="border-t border-white/10 bg-[#03060e] py-8 text-sm text-slate-300">
        <div
          className={cn(
            container,
            "flex flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8"
          )}
        >
          <div className="flex items-center gap-3">
            <Image
              src="/addstrategic-blanco.png"
              alt="ADDNEXO by ADD Strategic"
              width={130}
              height={26}
              style={{ width: "auto" }}
              className="h-6 w-auto"
            />
            <span>© {new Date().getFullYear()} ADDSTRATEGIC LLC</span>
          </div>
          <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-medium text-slate-200 transition-colors hover:text-brand-cyan"
            >
              <Home className="size-3.5 text-brand-cyan" aria-hidden="true" />
              {t("nav.home")}
            </Link>
            <a
              href="mailto:adstrategicbusiness@gmail.com"
              className="text-slate-300 transition-colors hover:text-brand-cyan"
            >
              adstrategicbusiness@gmail.com
            </a>
            <a
              href="#diagnostic-call"
              onClick={scrollToDiagnostic}
              className="font-semibold text-brand-cyan hover:underline"
            >
              {t("ctaPrimary")}
            </a>
          </div>
        </div>
      </footer>

      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        title="ADDNEXO Platform Walkthrough"
      />
    </div>
  )
}
