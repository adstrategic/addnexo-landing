import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

import NewUser from "@/components/Emails/NewUser"
import WelcomeEmail from "@/components/Emails/Welcome"
import { CONTACT_NOTIFY_EMAIL, EMAIL_FROM } from "@/lib/email-brand"
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
  email: z.email(),
  phone: z.string().trim().min(5),
  industry: z.enum(INDUSTRY_OPTIONS),
  challenge: z.string().trim().min(5),
})

export async function POST(request: Request) {
  const resend = getResendClient()

  if (!resend) {
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 503 }
    )
  }

  const parsed = contactPayloadSchema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { name, company, email, phone, industry, challenge } = parsed.data

  const { data, error } = await resend.batch.send([
    {
      from: `ADDNEXO <${EMAIL_FROM}>`,
      to: [email],
      subject: "Thanks for requesting an ADDNEXO demo",
      react: WelcomeEmail({ userFirstName: name }),
    },
    {
      from: `ADDNEXO Website <${EMAIL_FROM}>`,
      to: [CONTACT_NOTIFY_EMAIL],
      subject: "New ADDNEXO demo request",
      react: NewUser({
        userFirstName: name,
        userCompany: company,
        userEmail: email,
        userPhone: phone,
        userIndustry: industry,
        userChallenge: challenge,
      }),
    },
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
