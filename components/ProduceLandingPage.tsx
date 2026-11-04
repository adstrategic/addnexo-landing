"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { Calendar, ExternalLink, Play } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useLocale, useTranslations } from "next-intl"

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

export type HeroVariantKey = "cost" | "excel" | "erp"

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

type CapabilityCard = {
  tag: string
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


  const toggleLanguage = () => {
    const nextLocale = locale === "es" ? "en" : "es"
    const query = variant !== "erp" ? `?v=${variant}` : ""
    router.replace(`${pathname}${query}`, { locale: nextLocale })
  }

  const receiptLines = t.raw("problem.receipt.lines") as ReceiptLine[]
  const competitors = t.raw("whyUnsolved.competitors") as CompetitorRow[]
  const commercialSteps = t.raw("howItWorks.commercialSteps") as string[]
  const financialSteps = t.raw("howItWorks.financialSteps") as string[]
  const differentiatorMetrics = t.raw(
    "differentiator.metrics"
  ) as DifferentiatorMetric[]
  const capabilityCards = t.raw("capabilities.cards") as CapabilityCard[]
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
    <div className="min-h-screen bg-[#060b19] text-[#f8fafc] selection:bg-brand-cyan/30 selection:text-white">
      {/* Minimal High-Conversion Sticky Header */}
      <header className="fixed top-0 right-0 left-0 z-50 h-[72px] border-b border-white/10 bg-[#060b19]/92 backdrop-blur-md">
        <div
          className={cn(
            container,
            "flex h-full items-center justify-between gap-4 px-5 sm:px-8"
          )}
        >
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
              className="h-8 w-auto object-contain sm:h-11"
              priority
            />
          </Link>

          <nav
            aria-label="Page sections"
            className="hidden items-center gap-7 lg:flex"
          >
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-md border border-white/15 px-3 py-1.5 font-mono text-xs font-bold text-slate-200 transition-colors hover:border-brand-cyan/50 hover:text-white"
              aria-label="Switch language"
            >
              {locale === "es" ? "EN" : "ES"}
            </button>
            <LandingButton
              asChild
              variant="navCta"
              className="px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <a href="#diagnostic-call" onClick={scrollToDiagnostic}>
                {t("nav.cta")}
              </a>
            </LandingButton>
          </div>
        </div>
      </header>

      <main>
        {/* 1. HERO (3 Interchangeable Variants via ?v=cost | ?v=excel | ?v=erp) */}
        <section
          id="hero"
          className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(56,189,248,0.11)_0%,rgba(6,11,25,1)_70%)] pt-[calc(72px+3.5rem)] pb-20 sm:pt-[calc(72px+5rem)] sm:pb-28"
        >
          <div
            className={cn(
              container,
              "grid grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12"
            )}
          >
            <div className="lg:col-span-7">
              <h1 className="max-w-[18ch] text-[clamp(2.35rem,5vw,4.25rem)] leading-[1.06] font-black tracking-[-0.038em] text-balance text-white">
                {t(`hero.variants.${variant}.h1`)}
              </h1>

              <p className="mt-6 max-w-[540px] text-lg leading-[1.68] text-pretty text-slate-200">
                {t(`hero.variants.${variant}.subheadline`)}
              </p>

              <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <LandingButton
                  asChild
                  variant="lime"
                  size="lg"
                  className="justify-center font-bold shadow-[0_12px_32px_rgba(56,189,248,0.22)]"
                >
                  <a href="#diagnostic-call" onClick={scrollToDiagnostic}>
                    {t("ctaPrimary")}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </LandingButton>

                <LandingButton
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setVideoOpen(true)}
                  className="justify-center border border-white/20 bg-white/5 font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  <Play className="mr-1.5 size-4 fill-brand-cyan text-brand-cyan" aria-hidden="true" />
                  {t("watchVideo")}
                </LandingButton>
              </div>

              <p className="mt-5 max-w-[500px] text-sm leading-relaxed font-medium text-pretty text-slate-300">
                {t("socialProof")}
              </p>
            </div>

            {/* Right Column: Live Economic Unit Lot Ledger + Real Platform Frame */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0b1325] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
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
                    <div className="col-span-5">{t("hero.ledgerPreview.colItem")}</div>
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
              </div>
            </div>
          </div>
        </section>

        {/* 2. CONCRETE PROBLEM: The $42,000 Avocado Container Receipt */}
        <section
          id="landed-cost-problem"
          className="border-b border-white/10 bg-[#091022] py-20 sm:py-28"
        >
          <div
            className={cn(
              container,
              "grid grid-cols-1 items-start gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14"
            )}
          >
            <div className="lg:col-span-5 lg:sticky lg:top-[104px]">
              <h2 className="text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-white">
                {t("problem.h2")}
              </h2>

              <p className="mt-5 max-w-[500px] text-base leading-[1.7] text-pretty text-slate-200">
                {t("problem.lead")}
              </p>

              <p className="mt-4 max-w-[500px] text-base leading-[1.7] text-pretty text-slate-300">
                {t("problem.body")}
              </p>

              <p className="mt-7 max-w-[500px] rounded-xl border border-brand-cyan/35 bg-brand-cyan/10 p-5 text-base leading-[1.6] font-bold text-pretty text-white">
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
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#060b19] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                <div className="border-b border-white/10 bg-[#0d162c] px-6 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-mono text-sm font-bold tracking-[0.06em] text-white uppercase">
                      {t("problem.receipt.title")}
                    </h3>
                    <span className="font-mono text-xs text-brand-cyan">
                      {t("problem.receipt.meta")}
                    </span>
                  </div>

                  {/* Interactive Mode Switch: Authored Moment */}
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

        {/* 3. WHY NO ONE HAS SOLVED IT (NetSuite/Famous/Silo/Prophet vs QuickBooks+Excel vs ADDNEXO) */}
        <section className="border-b border-white/10 bg-[#060b19] py-20 sm:py-28">
          <div className={cn(container, "px-5 sm:px-8")}>
            <div className="max-w-[680px]">
              <h2 className="text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-white">
                {t("whyUnsolved.h2")}
              </h2>
              <p className="mt-4 max-w-[520px] text-base leading-[1.7] text-pretty text-slate-200">
                {t("whyUnsolved.subtitle")}
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-white/15 bg-[#0a1224]">
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
                            "text-xl font-extrabold tracking-[-0.02em]",
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

            <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
              <p className="max-w-[520px] text-lg font-bold text-pretty text-white">
                {t("whyUnsolved.callout")}
              </p>
              <LandingButton asChild variant="lime">
                <a href="#diagnostic-call" onClick={scrollToDiagnostic}>
                  {t("ctaPrimary")}
                </a>
              </LandingButton>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS: Two Parallel Connected Flows Running as One System */}
        <section
          id="parallel-flows"
          className="border-b border-white/10 bg-[#091022] py-20 sm:py-28"
        >
          <div className={cn(container, "px-5 sm:px-8")}>
            <div className="max-w-[680px]">
              <h2 className="text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-white">
                {t("howItWorks.h2")}
              </h2>
              <p className="mt-4 max-w-[520px] text-base leading-[1.7] text-pretty text-slate-200">
                {t("howItWorks.subtitle")}
              </p>
            </div>

            <div className="mt-12 rounded-2xl border border-white/15 bg-[#060b19] p-6 sm:p-10">
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
                      <span className="rounded-lg border border-white/15 bg-[#0f1a30] px-3.5 py-2.5 text-sm font-bold text-white">
                        {step}
                      </span>
                      {i < commercialSteps.length - 1 && (
                        <span
                          className="font-mono text-lg font-bold text-brand-cyan"
                          aria-hidden="true"
                        >
                          →
                        </span>
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
                <p className="max-w-[460px] font-medium text-pretty text-white">
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
                      <span className="rounded-lg border border-brand-cyan/35 bg-brand-cyan/10 px-3.5 py-2.5 text-sm font-bold text-white">
                        {step}
                      </span>
                      {i < financialSteps.length - 1 && (
                        <span
                          className="font-mono text-lg font-bold text-brand-cyan"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. THE DIFFERENTIATOR: Inventory as a Measurable Economic Unit */}
        <section className="border-b border-white/10 bg-[#060b19] py-20 sm:py-28">
          <div
            className={cn(
              container,
              "grid grid-cols-1 items-start gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14"
            )}
          >
            <div className="lg:col-span-6">
              <h2 className="text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-white">
                {t("differentiator.h2")}
              </h2>
              <p className="mt-5 max-w-[480px] text-base leading-[1.7] text-pretty text-slate-200">
                {t("differentiator.subtitle")}
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-[#0b1325]">
                <Image
                  src="/scs-dasboard1-pc.png"
                  alt="ADDNEXO lot-level economic unit and inventory view"
                  width={900}
                  height={560}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <dl className="divide-y divide-white/10 border-y border-white/15">
                {differentiatorMetrics.map((metric) => (
                  <div
                    key={metric.code}
                    className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-4"
                  >
                    <dt className="text-base font-bold text-white sm:col-span-5">
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
          </div>
        </section>

        {/* 6. CREDIBILITY: Miami Wholesale Distributor Origin & 4 a.m. Anchor Quote */}
        <section className="border-b border-white/10 bg-[#091022] py-20 sm:py-28">
          <div className={cn(container, "px-5 sm:px-8")}>
            <blockquote className="max-w-[920px] text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.15] font-black tracking-[-0.03em] text-balance text-brand-cyan">
              {t("credibility.quote")}
            </blockquote>

            <div className="mt-12 grid grid-cols-1 gap-10 border-t border-white/15 pt-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h2 className="max-w-[22ch] text-2xl leading-[1.2] font-extrabold tracking-[-0.025em] text-balance text-white sm:text-3xl">
                  {t("credibility.h2")}
                </h2>
              </div>

              <div className="max-w-[520px] space-y-5 text-base leading-[1.7] text-pretty text-slate-200 lg:col-span-7">
                <p>{t("credibility.p1")}</p>
                <p>{t("credibility.p2")}</p>
                <p className="text-slate-300">{t("credibility.p3")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. ADDITIONAL CAPABILITIES: 3 Focused Operational Tools */}
        <section className="border-b border-white/10 bg-[#060b19] py-20 sm:py-28">
          <div className={cn(container, "px-5 sm:px-8")}>
            <div className="max-w-[680px]">
              <h2 className="text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-white">
                {t("capabilities.h2")}
              </h2>
              <p className="mt-4 max-w-[520px] text-base leading-[1.7] text-pretty text-slate-200">
                {t("capabilities.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 divide-y divide-white/10 border-y border-white/15 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {capabilityCards.map((cap, idx) => (
                <div
                  key={cap.title}
                  className={cn(
                    "py-8 lg:py-10",
                    idx === 0 && "lg:pr-8",
                    idx === 1 && "lg:px-8",
                    idx === 2 && "lg:pl-8"
                  )}
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-xl leading-snug font-bold tracking-[-0.02em] text-white">
                      {cap.title}
                    </h3>
                    <span className="mt-0.5 shrink-0 text-brand-cyan" aria-hidden="true">
                      {idx === 0 && (
                        <svg
                          className="size-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                      {idx === 1 && (
                        <svg
                          className="size-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                          />
                        </svg>
                      )}
                      {idx === 2 && (
                        <svg
                          className="size-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                          />
                        </svg>
                      )}
                    </span>
                  </div>
                  <p className="max-w-[440px] text-base leading-[1.68] text-pretty text-slate-200">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. PRICING: $90 per user / month */}
        <section
          id="pricing"
          className="border-b border-white/10 bg-[#091022] py-20 sm:py-28"
        >
          <div className={cn(container, "px-5 sm:px-8")}>
            <div className="max-w-[680px]">
              <h2 className="text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-white">
                {t("pricing.h2")}
              </h2>
              <p className="mt-4 max-w-[520px] text-lg leading-[1.65] font-medium text-pretty text-slate-200">
                {t("pricing.subtitle")}
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-white/15 bg-[#060b19]">
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
                    <div className="text-xl font-extrabold text-white md:col-span-3">
                      {row.users}
                    </div>
                    <div className="font-mono text-2xl font-black text-brand-cyan md:col-span-3">
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
              <p className="max-w-[500px] text-sm leading-[1.65] text-pretty text-slate-300">
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

        {/* 9. FAQ: "+" Accordion */}
        <section
          id="faq"
          className="border-b border-white/10 bg-[#060b19] py-20 sm:py-28"
        >
          <div className={cn(container, "max-w-[920px] px-5 sm:px-8")}>
            <h2 className="text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-white">
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
                      <span className="text-lg font-bold text-white">
                        {item.q}
                      </span>
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 font-mono text-lg leading-none text-brand-cyan transition-transform duration-200",
                          isOpen && "rotate-45 border-brand-cyan bg-brand-cyan/15"
                        )}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-4 max-w-[520px] pr-4 text-base leading-[1.7] text-pretty text-slate-200">
                        {item.a}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA: Short Diagnostic Call Form */}
        <section
          id="diagnostic-call"
          className="bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(56,189,248,0.12)_0%,rgba(9,16,34,1)_70%)] py-20 sm:py-28"
        >
          <div
            className={cn(
              container,
              "grid grid-cols-1 items-start gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14"
            )}
          >
            <div className="lg:col-span-5">
              <h2 className="text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.1] font-black tracking-[-0.035em] text-balance text-white">
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
                    <svg
                      className="mt-1 size-5 shrink-0 text-brand-cyan"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 10l4 4 8-8"
                      />
                    </svg>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/15 bg-[#060b19] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-10">
                {/* Tabs to choose between Quick Form or Instant Calendar */}
                <div className="mb-6 flex rounded-xl border border-white/12 bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() => setCtaMode("form")}
                    className={cn(
                      "flex-1 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all",
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
                      "flex-1 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5",
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
                      <svg
                        className="size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">
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
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-cyan px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-dark transition-opacity hover:opacity-90"
                      >
                        {t("finalCta.successCalButton")}
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Instant Booking Banner */}
                    <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-brand-cyan/25 bg-brand-cyan/10 px-4 py-3 text-left">
                      <span className="text-xs sm:text-sm font-semibold text-white">
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
      <footer className="border-t border-white/10 bg-[#040812] py-8 text-sm text-slate-300">
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
