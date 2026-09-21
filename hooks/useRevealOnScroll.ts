"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/** Reveal children on scroll; content stays visible by default (no opacity:0 gate). */
export function useRevealOnScroll(deps: unknown[] = []) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced || !ref.current) return

    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        opacity: 0.4,
        y: 24,
        stagger: 0.08,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          once: true,
        },
      })
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
