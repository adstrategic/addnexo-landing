import { readFile } from "node:fs/promises"
import path from "node:path"

const DEFAULT_SITE_URL = "https://www.addnexo.com"

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
}

/** Content-ID used for the inline logo attachment in Resend emails. */
export const EMAIL_LOGO_CID = "addnexo-logo"

export function getEmailLogoUrl() {
  return `cid:${EMAIL_LOGO_CID}`
}

export async function getEmailLogoAttachment() {
  const content = await readFile(
    path.join(process.cwd(), "public", "addnexo-email-logo.png")
  )

  return {
    content,
    filename: "addnexo-email-logo.png",
    contentId: EMAIL_LOGO_CID,
  }
}

export const EMAIL_FROM =
  process.env.RESEND_FROM_EMAIL ?? "addstrategic@news.addstrategic.com"

export const CONTACT_NOTIFY_EMAIL =
  process.env.CONTACT_NOTIFY_EMAIL ?? "admin@addstrategic.com"
