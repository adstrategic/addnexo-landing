"use client"

import Image from "next/image"
import { useState } from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

export function AmericasMap({ className }: { className?: string }) {
  const t = useTranslations("markets")
  const regions = t.raw("regions") as Array<{
    id: string
    name: string
    cities: string
    positioning: string
  }>
  const [active, setActive] = useState(regions[0]?.id ?? "south-florida")
  const activeRegion = regions.find((r) => r.id === active) ?? regions[0]

  return (
    <div
      className={cn(
        "grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center",
        className
      )}
    >
      <div className="relative mx-auto w-full max-w-[420px]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
          <Image
            src="/america.jpg"
            alt={t("geoHeadline")}
            fill
            className="object-contain object-center"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
        </div>
        <p className="mt-3 text-center text-[0.8rem] text-muted-foreground">
          {t("geoNote")}
        </p>
      </div>

      <div className="rounded-2xl border border-brand-dark/8 bg-muted/60 p-6 md:p-8">
        <p className="mb-2 text-[0.75rem] font-bold tracking-[0.1em] text-primary uppercase">
          {t("geoNote")}
        </p>
        <h3 className="mb-3 text-[1.35rem] font-extrabold tracking-[-0.02em] text-brand-dark">
          {activeRegion.name}
        </h3>
        {activeRegion.cities ? (
          <p className="mb-4 text-[0.88rem] text-muted-foreground">
            {activeRegion.cities}
          </p>
        ) : null}
        <p className="text-[0.98rem] leading-[1.65] text-foreground">
          {activeRegion.positioning}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => setActive(region.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold transition-[background,color,transform] duration-200 active:scale-[0.97]",
                region.id === active
                  ? "bg-brand-dark text-white"
                  : "bg-background text-brand-dark hover:bg-brand-dark/5"
              )}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
