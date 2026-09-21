"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

type FlowRailProps = {
  items: string[]
  className?: string
  variant?: "light" | "dark"
}

export function FlowRail({ items, className, variant = "light" }: FlowRailProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isDark = variant === "dark"

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced || !ref.current) return

    const ctx = gsap.context(() => {
      gsap.from("[data-flow-item]", {
        opacity: 0.35,
        y: 16,
        stagger: 0.06,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 md:gap-3",
        className
      )}
    >
      {items.map((item, i) => (
        <div key={`${item}-${i}`} className="flex items-center gap-2 md:gap-3">
          <span
            data-flow-item
            className={cn(
              "rounded-full px-3.5 py-2 text-[0.78rem] font-semibold tracking-[-0.01em] md:text-[0.85rem]",
              isDark
                ? "border border-white/15 bg-white/8 text-white"
                : "border border-brand-dark/10 bg-muted text-brand-dark"
            )}
          >
            {item}
          </span>
          {i < items.length - 1 ? (
            <span
              className={cn(
                "hidden text-sm sm:inline",
                isDark ? "text-brand-cyan" : "text-primary"
              )}
              aria-hidden
            >
              →
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
