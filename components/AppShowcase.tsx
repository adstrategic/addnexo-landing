"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { Link } from "@/i18n/navigation"
import {
  container,
  sectionHeader,
  sectionTitle,
} from "@/lib/landing-styles"

const SHOTS = [
  "/scs-dashboard-pc.png",
  "/inventory-lots.png",
  "/scs-dashboard2-pc.png",
]

export default function AppShowcase() {
  const t = useTranslations("proof")
  const sectionRef = useRevealOnScroll()
  const points = t.raw("points") as string[]
  const shots = t.raw("shots") as Array<{ title: string; desc: string }>

  return (
    <section
      id="proof"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="border-y border-black/4 bg-muted/30 py-24"
    >
      <div className={container}>
        <div className={sectionHeader}>
          <h2 data-reveal className={sectionTitle}>
            {t("headline")}
          </h2>
        </div>

        <ul
          data-reveal
          className="mx-auto mb-14 flex max-w-[900px] flex-wrap justify-center gap-2"
        >
          {points.map((point) => (
            <li
              key={point}
              className="rounded-full border border-brand-dark/10 bg-background px-4 py-2 text-[0.85rem] font-medium text-brand-dark"
            >
              {point}
            </li>
          ))}
        </ul>

        <div className="grid gap-6 md:grid-cols-3">
          {shots.map((shot, i) => (
            <figure
              key={shot.title}
              data-reveal
              className="overflow-hidden rounded-2xl border border-brand-dark/8 bg-background shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <div className="relative aspect-[16/10] bg-brand-bg-dark">
                <Image
                  src={SHOTS[i]}
                  alt={shot.title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
              <figcaption className="p-5">
                <h3 className="mb-1 text-[1.05rem] font-extrabold tracking-[-0.02em] text-brand-dark">
                  {shot.title}
                </h3>
                <p className="text-[0.9rem] text-muted-foreground">{shot.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div data-reveal className="mt-12 flex justify-center">
          <LandingButton asChild variant="dark" className="max-md:w-full">
            <Link href="#proof">{t("cta")}</Link>
          </LandingButton>
        </div>
      </div>
    </section>
  )
}
