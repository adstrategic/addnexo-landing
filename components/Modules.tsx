"use client"

import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  HandCoins,
  Package,
  Receipt,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { Link } from "@/i18n/navigation"
import {
  container,
  sectionHeader,
  sectionTitle,
} from "@/lib/landing-styles"
import { sectionHref } from "@/lib/sections"
import { cn } from "@/lib/utils"

const ICONS: LucideIcon[] = [
  ShoppingCart,
  Package,
  ClipboardList,
  Truck,
  FileText,
  Receipt,
  HandCoins,
  Boxes,
  BarChart3,
]

export default function Modules() {
  const t = useTranslations("modules")
  const sectionRef = useRevealOnScroll()
  const items = t.raw("items") as Array<{ title: string; desc: string }>

  return (
    <section
      id="modules"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="border-y border-black/4 bg-muted/40 py-24"
    >
      <div className={container}>
        <div className={sectionHeader}>
          <h2 data-reveal className={sectionTitle}>
            {t("headline")}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? Boxes
            return (
              <article
                key={item.title}
                data-reveal
                className={cn(
                  "rounded-2xl border border-brand-dark/8 bg-background p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
                )}
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mb-2 text-[1.1rem] font-extrabold tracking-[-0.02em] text-brand-dark">
                  {item.title}
                </h3>
                <p className="text-[0.95rem] leading-[1.65] text-muted-foreground">
                  {item.desc}
                </p>
              </article>
            )
          })}
        </div>

        <div data-reveal className="mt-12 flex justify-center">
          <LandingButton asChild variant="dark" className="max-md:w-full">
            <Link href={sectionHref("proof")}>{t("cta")}</Link>
          </LandingButton>
        </div>
      </div>
    </section>
  )
}
