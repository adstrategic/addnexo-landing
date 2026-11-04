"use client"

import { useState } from "react"
import { Calendar, MessageSquare } from "lucide-react"
import { useTranslations } from "next-intl"

import ContactForm from "@/components/ContactForm"
import { LandingButton } from "@/components/landing-button"
import { Link } from "@/i18n/navigation"
import { container, sectionTitle } from "@/lib/landing-styles"
import { CAL_EMBED_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

export default function ContactPage() {
  const t = useTranslations("contact")
  const [activeTab, setActiveTab] = useState<"calendar" | "form">("calendar")

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.05)_0%,var(--background)_70%)] pt-[calc(var(--nav-h)+4rem)] pb-28">
      <div
        className={cn(
          container,
          "grid max-w-[1100px] grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16"
        )}
      >
        <div>
          <Link
            href="/"
            className="mb-8 inline-block text-[0.9rem] font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            {t("back")}
          </Link>
          <h1 className={sectionTitle}>
            {t("title1")}
            <br />
            {t("title2")}
          </h1>
          <p className="mt-6 mb-4 max-w-[90%] text-[1.1rem] leading-[1.7] text-muted-foreground">
            {t("desc")}
          </p>
          <p className="mb-12 text-[0.9rem] font-medium text-brand-dark">
            {t("offer")}
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <strong className="text-[0.85rem] tracking-[0.05em] text-muted-foreground uppercase">
                Email
              </strong>
              <a
                href="mailto:adstrategicbusiness@gmail.com"
                className="text-[1.1rem] font-semibold text-brand-dark transition-colors hover:text-primary"
              >
                adstrategicbusiness@gmail.com
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <strong className="text-[0.85rem] tracking-[0.05em] text-muted-foreground uppercase">
                WhatsApp
              </strong>
              <a
                href="https://wa.me/17542549069"
                target="_blank"
                rel="noreferrer"
                className="text-[1.1rem] font-semibold text-brand-dark transition-colors hover:text-primary"
              >
                +1 (754) 254-9069
              </a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-black/6 bg-background shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
          {/* Tab Selection: Calendar vs Form */}
          <div className="flex border-b border-brand-dark/6 bg-muted/40 p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all",
                activeTab === "calendar"
                  ? "bg-background text-brand-dark shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Calendar className="size-4" />
              {t("tabs.calendar")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all",
                activeTab === "form"
                  ? "bg-background text-brand-dark shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageSquare className="size-4" />
              {t("tabs.form")}
            </button>
          </div>

          {activeTab === "calendar" ? (
            <div>
              <p className="border-b border-brand-dark/6 bg-muted/30 px-5 py-3 text-[0.85rem] font-semibold text-brand-dark">
                {t("calendarLabel")}
              </p>
              <iframe
                src={CAL_EMBED_URL}
                title={t("calendarLabel")}
                className="h-[700px] w-full border-0"
                loading="lazy"
                allow="camera; microphone; fullscreen"
              />
              <div className="border-t border-brand-dark/6 px-5 py-4 text-center">
                <LandingButton asChild variant="outlineDark">
                  <a href={CAL_EMBED_URL} target="_blank" rel="noreferrer">
                    {t("calendarOpen")}
                  </a>
                </LandingButton>
              </div>
            </div>
          ) : (
            <div className="p-2 sm:p-4">
              <ContactForm />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
