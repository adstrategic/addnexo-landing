"use client"

import { useEffect, useState } from "react"
import { Calendar, ExternalLink, Mic, Play, Video, X } from "lucide-react"
import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  videoUrl?: string
  initialTab?: "loom" | "overview" | "voice"
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
  initialTab = "loom",
}: VideoModalProps) {
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState<"loom" | "overview" | "voice">(
    initialTab
  )

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

  const isEs = locale === "es"

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6 md:p-8"
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
      <div
        className={cn(
          "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#080e1d] shadow-[0_30px_70px_rgba(0,0,0,0.75)] animate-in fade-in zoom-in-95 duration-200",
          activeTab === "voice" ? "max-w-lg" : "max-w-4xl"
        )}
      >
        {/* Modal Header with Video Switcher Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#0d162b] px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("loom")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors sm:px-3",
                activeTab === "loom"
                  ? "bg-brand-cyan text-brand-dark shadow-sm"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Play className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{isEs ? "Walkthrough" : "Walkthrough"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("voice")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors sm:px-3",
                activeTab === "voice"
                  ? "bg-brand-cyan text-brand-dark shadow-sm"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Mic className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{isEs ? "Orden por Voz" : "Voice Demo"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors sm:px-3",
                activeTab === "overview"
                  ? "bg-brand-cyan text-brand-dark shadow-sm"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Video className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{isEs ? "Explicación" : "Full Video"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Video Responsive Frame */}
        {activeTab === "voice" ? (
          <div className="flex flex-1 items-center justify-center overflow-hidden bg-black p-3 sm:p-4">
            <div className="relative aspect-[9/16] max-h-[68vh] w-auto overflow-hidden rounded-2xl border border-white/15 bg-black">
              <video
                key="voice-demo-modal"
                src="/muestra%20como%20crear%20una%20orden%20de%20compra%20por%20voz.mp4"
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="relative aspect-video w-full bg-black">
            {activeTab === "loom" && (
              <iframe
                src={videoUrl}
                title={title}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}

            {activeTab === "overview" && (
              <video
                key="overview-demo-modal"
                src="/explicacion-addnexo-en-espanol.mp4"
                controls
                autoPlay
                playsInline
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0a101f] px-4 py-3 text-xs text-slate-300 sm:px-5 sm:py-3.5">
          <span className="truncate">
            {isEs
              ? "ADDNEXO — Sistema Operativo y Financiero"
              : "ADDNEXO — Operating & Financial System"}
          </span>
          <a
            href="https://cal.com/adstrategic-mml9qb/30min"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-cyan px-3 py-1.5 font-bold text-brand-dark transition-opacity hover:opacity-90"
          >
            <Calendar className="size-3.5" aria-hidden="true" />
            {isEs ? "Agendar en Cal.com" : "Book on Cal.com"}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}
