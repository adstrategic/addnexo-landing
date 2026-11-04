"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  videoUrl?: string
}

export const LOOM_EMBED_URL =
  "https://www.loom.com/embed/4e8d7b415a5643c2b79689daaab28f0e?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"

export const YOUTUBE_EMBED_URL =
  "https://www.youtube-nocookie.com/embed/u1m6adLgwvE?autoplay=1&rel=0"

export default function VideoModal({
  isOpen,
  onClose,
  title = "ADDNEXO Platform Walkthrough",
  videoUrl = LOOM_EMBED_URL,
}: VideoModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#090f1d] shadow-[0_25px_60px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0f172a] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-cyan animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Video Responsive Frame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={videoUrl}
            title={title}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0a101f] px-5 py-3 text-xs text-slate-300">
          <span>Walkthrough: ADDNEXO Operating & Financial System</span>
          <a
            href="https://cal.com/adstrategic-mml9qb/30min"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-brand-cyan hover:underline"
          >
            Book a 30-min call →
          </a>
        </div>
      </div>
    </div>
  )
}
