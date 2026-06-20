"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const STAT_VALUES = [
  { value: 10, suffix: "+" },
  { value: 100, suffix: "%" },
  { value: 99, suffix: "%" },
  { value: 24, suffix: "/7" },
]

export default function Stats() {
  const t = useTranslations()
  const sectionRef = useRef<HTMLElement>(null)
  const numRefs = useRef<(HTMLSpanElement | null)[]>([])

  const items = t.raw("stats.items") as Array<{ label: string }>

  useEffect(() => {
    const ctx = gsap.context(() => {
      numRefs.current.forEach((el, i) => {
        if (!el) return
        const target = STAT_VALUES[i].value
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            const obj = { val: 0 }
            gsap.to(obj, {
              val: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate() {
                el.textContent = String(Math.round(obj.val))
              },
            })
          },
        })
      })

      gsap.from("[data-stats-item]", {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="border-b border-black/3 bg-gradient-to-b from-muted to-background px-8 py-16"
    >
      <p className="mb-12 text-center text-base tracking-[0.04em] text-muted-foreground uppercase">
        {t("stats.headline")}
      </p>
      <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-8 text-center md:grid-cols-4">
        {items.map((s, i) => (
          <div
            key={i}
            data-stats-item
            className="border-muted px-4 py-6 odd:max-md:border-r max-md:border-b max-md:odd:border-r md:border-r md:last:border-r-0 max-[480px]:border-r-0"
          >
            <div className="mb-2 text-[clamp(2.4rem,5vw,3.5rem)] leading-none font-black tracking-[-0.04em] text-brand-dark">
              <span ref={(el) => { numRefs.current[i] = el }}>{STAT_VALUES[i].value}</span>
              {STAT_VALUES[i].suffix}
            </div>
            <div className="text-[0.9rem] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
