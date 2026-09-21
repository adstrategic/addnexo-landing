import { z } from "zod"

import { INDUSTRY_OPTIONS } from "@/lib/site"

export type ContactSchemaMessages = {
  name: string
  company: string
  email: string
  phone: string
  industry: string
  challenge: string
}

export function createContactSchema(messages: ContactSchemaMessages) {
  return z.object({
    name: z.string().trim().min(2, messages.name),
    company: z.string().trim().min(1, messages.company),
    email: z.email(messages.email),
    phone: z.string().trim().min(5, messages.phone),
    industry: z.enum(INDUSTRY_OPTIONS, { message: messages.industry }),
    challenge: z.string().trim().min(5, messages.challenge),
  })
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>
