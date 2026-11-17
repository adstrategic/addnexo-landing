import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

import NewUser from "@/components/Emails/NewUser"
import WelcomeEmail from "@/components/Emails/Welcome"
import {
  CONTACT_NOTIFY_EMAIL,
  EMAIL_FROM,
  getEmailLogoAttachment,
} from "@/lib/email-brand"
import { INDUSTRY_OPTIONS } from "@/lib/site"

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return null
  }

  return new Resend(apiKey)
}

const contactPayloadSchema = z.object({
  name: z.string().trim().min(2),
  company: z.string().trim().min(1),
  email: z.email().optional(),
  phone: z.string().trim().min(5).optional(),
  industry: z.enum(INDUSTRY_OPTIONS).optional(),
  challenge: z.string().trim().min(5).optional(),
  contact: z.string().trim().min(3).optional(),
  message: z.string().trim().optional(),
  variant: z.string().trim().optional(),
  source: z.string().trim().optional(),
})

export async function POST(request: Request) {
  const parsed = contactPayloadSchema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const {
    name,
    company,
    email,
    phone,
    industry,
    challenge,
    contact,
    message,
    variant,
    source,
  } = parsed.data

  const resolvedEmail =
    email ??
    (contact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? contact : undefined)
  const resolvedPhone =
    phone ?? (contact && !resolvedEmail ? contact : "Not provided")

  if (!resolvedEmail && resolvedPhone === "Not provided") {
    return NextResponse.json(
      { error: "A valid email or phone number is required" },
      { status: 400 }
    )
  }

  const formattedMessage = [
    source
      ? `[Source: ${source}${variant ? ` | Variant: ${variant}` : ""}]`
      : null,
    challenge ?? message,
  ]
    .filter(Boolean)
    .join("\n\n")

  const resend = getResendClient()

  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true, simulated: true })
    }
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 503 }
    )
  }

  // Inline images require attachments; Resend batch.send does not support them.
  const logoAttachment = await getEmailLogoAttachment()

  const emailsToSend = [
    ...(resolvedEmail
      ? [
          {
            from: `ADDNEXO <${EMAIL_FROM}>`,
            to: [resolvedEmail],
            subject:
              source === "produce-diagnostic"
                ? "Your 15-minute ADDNEXO diagnostic call"
                : "Thanks for requesting an ADDNEXO demo",
            react: WelcomeEmail({ userFirstName: name }),
            attachments: [logoAttachment],
          },
        ]
      : []),
    {
      from: `ADDNEXO Website <${EMAIL_FROM}>`,
      to: [CONTACT_NOTIFY_EMAIL],
      subject:
        source === "produce-diagnostic"
          ? `New Produce Diagnostic Call Request (${company})`
          : "New ADDNEXO demo request",
      react: NewUser({
        userFirstName: name,
        userCompany: company,
        userEmail: resolvedEmail ?? "Phone-only lead",
        userPhone: resolvedPhone,
        userIndustry: industry ?? "fresh-produce",
        userChallenge: formattedMessage || "Diagnostic call request",
      }),
      attachments: [logoAttachment],
    },
  ]

  const results = await Promise.all(
    emailsToSend.map((payload) => resend.emails.send(payload))
  )

  const firstError = results.find((result) => result.error)?.error
  if (firstError) {
    return NextResponse.json({ error: firstError.message }, { status: 500 })
  }

  return NextResponse.json({
    data: results.map((result) => result.data).filter(Boolean),
  })
}
