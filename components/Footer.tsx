"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { container } from "@/lib/landing-styles"
import { sectionHref } from "@/lib/sections"

function getFooterLinks(t: ReturnType<typeof useTranslations>) {
  return {
    [t("footer.col1")]: [
      { label: t("footer.links.flow"), href: sectionHref("flow") },
      { label: t("footer.links.modules"), href: sectionHref("modules") },
      { label: t("footer.links.innovation"), href: sectionHref("innovation") },
      { label: t("footer.links.industries"), href: sectionHref("industries") },
      { label: t("footer.links.story"), href: sectionHref("story") },
      { label: t("footer.links.faq"), href: sectionHref("faq") },
    ],
    [t("footer.col2")]: [
      { label: t("footer.links.about"), href: "https://addstrategic.com" },
      { label: t("footer.links.contact"), href: "/contact" as const },
      { label: t("footer.links.demo"), href: "/contact" as const },
    ],
    [t("footer.col3")]: [
      { label: t("footer.links.privacy"), href: "#" },
      { label: t("footer.links.terms"), href: "#" },
    ],
  }
}

export default function Footer() {
  const t = useTranslations()
  const footerLinks = getFooterLinks(t)

  return (
    <footer className="bg-brand-dark pt-20 text-white/70">
      <div
        className={`${container} grid grid-cols-1 gap-12 border-b border-white/10 pb-16 lg:grid-cols-[2fr_3fr] lg:gap-16`}
      >
        <div>
          <a href="https://addstrategic.com" className="mb-5 inline-block">
            <Image
              src="/addstrategic-blanco.png"
              alt="ADDNEXO by ADDSTRATEGIC"
              width={160}
              height={32}
              className="h-8 w-auto"
            />
          </a>
          <p className="mb-4 max-w-[320px] text-[0.9rem] leading-[1.65]">
            {t("footer.tagline")}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="https://addstrategic.com"
              target="_blank"
              rel="noreferrer"
              className="text-[0.88rem] text-brand-cyan transition-opacity hover:opacity-80"
            >
              addstrategic.com
            </a>
            <a
              href="mailto:adstrategicbusiness@gmail.com"
              className="text-[0.88rem] text-brand-cyan transition-opacity hover:opacity-80"
            >
              adstrategicbusiness@gmail.com
            </a>
            <a
              href="https://wa.me/17542549069"
              target="_blank"
              rel="noreferrer"
              className="text-[0.88rem] text-brand-cyan transition-opacity hover:opacity-80"
            >
              +1 754 254 9069
            </a>
            <a
              href="https://instagram.com/addstrategic"
              target="_blank"
              rel="noreferrer"
              className="text-[0.88rem] text-brand-cyan transition-opacity hover:opacity-80"
            >
              Instagram: @addstrategic
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 max-[480px]:grid-cols-1">
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="mb-5 text-[0.8rem] font-bold tracking-[0.1em] text-white uppercase">
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-[0.88rem] text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-[0.88rem] text-white/60 transition-colors hover:text-white"
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black/20 py-6">
        <div
          className={`${container} flex flex-wrap items-center justify-between gap-4 max-md:flex-col max-md:text-center`}
        >
          <p className="text-[0.82rem] text-white/40">
            © {new Date().getFullYear()}{" "}
            <a href="https://addstrategic.com" target="_blank" rel="noreferrer">
              ADDSTRATEGIC LLC
            </a>{" "}
            - {t("footer.copyright1")}
          </p>
        </div>
      </div>
    </footer>
  )
}
