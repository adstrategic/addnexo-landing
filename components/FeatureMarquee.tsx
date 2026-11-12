"use client"

import {
  BarChart3,
  Boxes,
  Calculator,
  Camera,
  MessageSquareText,
  Mic,
  Receipt,
  Send,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

const FEATURE_ICONS: LucideIcon[] = [
  Mic,
  MessageSquareText,
  Calculator,
  Camera,
  Send,
  Receipt,
  Boxes,
  BarChart3,
]

type FeatureItem = {
  title: string
  desc: string
}

export default function FeatureMarquee({
  variant = "dark",
}: {
  variant?: "dark" | "light"
}) {
  const t = useTranslations("featureMarquee")
  const items = t.raw("items") as FeatureItem[]
  const doubledItems = [...items, ...items]
  const isLight = variant === "light"

  return (
    <section
      aria-label="ADDNEXO Core Features"
      className={cn(
        "group relative overflow-hidden",
        isLight
          ? "border-y border-black/4 bg-muted/40 py-12"
          : "border-y border-white/10 bg-[#040814] py-8"
      )}
    >
      {!isLight && (
        <>
          <div
            className="pointer-events-none absolute top-0 left-1/2 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-cyan/45 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/35 to-transparent"
            aria-hidden="true"
          />
        </>
      )}

      {/* Edge gradient fade masks */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-28",
          isLight
            ? "bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/85 to-transparent"
            : "bg-gradient-to-r from-[#040814] via-[#040814]/85 to-transparent"
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-28",
          isLight
            ? "bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/85 to-transparent"
            : "bg-gradient-to-l from-[#040814] via-[#040814]/85 to-transparent"
        )}
        aria-hidden="true"
      />

      {/* Fluid Infinite Track (Pauses on Hover) */}
      <div className="animate-marquee-fluid flex items-stretch gap-5 px-3">
        {doubledItems.map((item, idx) => {
          const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length] ?? Mic
          const isSecondCopy = idx >= items.length

          return (
            <article
              key={`${item.title}-${idx}`}
              aria-hidden={isSecondCopy ? "true" : undefined}
              className={cn(
                "relative flex w-[275px] shrink-0 flex-col justify-between rounded-2xl p-5 sm:w-[350px] sm:p-6",
                isLight
                  ? "border border-brand-dark/8 bg-background transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
                  : "border border-white/10 bg-white/[0.035] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-cyan/50 hover:bg-white/[0.07] hover:shadow-[0_16px_36px_-10px_rgba(56,189,248,0.22)]"
              )}
            >
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-xl",
                      isLight
                        ? "size-11 bg-primary/10 text-primary"
                        : "size-10 border border-brand-cyan/30 bg-brand-cyan/15 text-brand-cyan shadow-[0_6px_18px_rgba(56,189,248,0.18)]"
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3
                    className={cn(
                      "leading-snug tracking-[-0.02em]",
                      isLight
                        ? "text-[1.08rem] font-extrabold text-brand-dark"
                        : "font-heading text-base font-bold text-white"
                    )}
                  >
                    {item.title}
                  </h3>
                </div>
                <p
                  className={cn(
                    "text-[0.92rem] leading-[1.6]",
                    isLight ? "text-muted-foreground" : "text-slate-300"
                  )}
                >
                  {item.desc}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
