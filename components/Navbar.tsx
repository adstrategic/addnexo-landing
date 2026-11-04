"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { sectionHref } from "@/lib/sections"
import { cn } from "@/lib/utils"

function getNavLinks(t: ReturnType<typeof useTranslations>) {
  return [
    { label: t("navbar.flow"), href: sectionHref("flow") },
    { label: t("navbar.modules"), href: sectionHref("modules") },
    { label: t("navbar.innovation"), href: sectionHref("innovation") },
    { label: t("navbar.industries"), href: sectionHref("industries") },
    { label: t("navbar.story"), href: sectionHref("story") },
    { label: t("navbar.faq"), href: sectionHref("faq") },
  ]
}

export default function Navbar() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const handleNavClick = () => setMenuOpen(false)

  const toggleLanguage = () => {
    router.replace(pathname, { locale: locale === "es" ? "en" : "es" })
  }

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-[1000] h-[var(--nav-h)] bg-brand-dark transition-[box-shadow,background] duration-300",
        scrolled && "bg-brand-dark/97 shadow-[0_2px_20px_rgba(0,0,0,0.25)] backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-4 px-4 sm:gap-8 sm:px-6 md:px-8">
        <Link href="/" className="shrink-0" aria-label="ADDNEXO">
          <Image
            src="/addnexo.png"
            alt="ADDNEXO — Operating and Financial System for Distribution"
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav
          className={cn(
            "ml-auto flex items-center gap-7 max-md:fixed max-md:inset-x-0 max-md:top-[var(--nav-h)] max-md:bottom-0 max-md:z-[999] max-md:flex-col max-md:justify-center max-md:gap-8 max-md:bg-brand-dark max-md:text-[1.3rem] max-md:transition-transform max-md:duration-350 max-md:ease-[cubic-bezier(0.16,1,0.3,1)]",
            menuOpen ? "max-md:translate-x-0" : "max-md:translate-x-full"
          )}
          aria-label="Main navigation"
        >
          {getNavLinks(t).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.9rem] text-white/80 transition-colors hover:text-white max-md:text-[1.3rem]"
              onClick={handleNavClick}
            >
              {link.label}
            </Link>
          ))}
          <LandingButton
            asChild
            variant="navCta"
            className="hidden max-md:inline-flex max-md:text-[1.1rem]"
          >
            <Link href="/contact" onClick={handleNavClick}>
              {t("navbar.requestDemo")}
            </Link>
          </LandingButton>
        </nav>

        <div className="ml-8 flex shrink-0 items-center gap-4">
          <button
            type="button"
            className="rounded-md border border-white/20 px-2 py-2 text-[0.9rem] font-bold text-white/80 transition-colors hover:text-white active:scale-[0.97]"
            onClick={toggleLanguage}
          >
            {locale === "es" ? "EN" : "ES"}
          </button>
          <LandingButton asChild variant="navCta" className="max-md:hidden">
            <Link href="/contact">{t("navbar.requestDemo")}</Link>
          </LandingButton>
          <button
            type="button"
            className={cn(
              "hidden h-7 w-7 flex-col justify-center gap-1.5 p-0 max-md:flex",
              menuOpen &&
                "[&>span:nth-child(1)]:translate-y-[7px] [&>span:nth-child(1)]:rotate-45 [&>span:nth-child(2)]:opacity-0 [&>span:nth-child(3)]:-translate-y-[7px] [&>span:nth-child(3)]:-rotate-45"
            )}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className="block h-0.5 w-full origin-center rounded-sm bg-white transition-[transform,opacity] duration-300" />
            <span className="block h-0.5 w-full origin-center rounded-sm bg-white transition-[transform,opacity] duration-300" />
            <span className="block h-0.5 w-full origin-center rounded-sm bg-white transition-[transform,opacity] duration-300" />
          </button>
        </div>
      </div>
    </header>
  )
}
