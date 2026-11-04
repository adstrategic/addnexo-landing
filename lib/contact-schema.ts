import { z } from "zod"

export type ContactSchemaMessages = {
  name: string
  company: string
  email: string
  phone: string
}

export function createContactSchema(messages: ContactSchemaMessages) {
  return z.object({
    name: z.string().trim().min(2, messages.name),
    company: z.string().trim().min(1, messages.company),
    email: z.email(messages.email),
    phone: z.string().trim().min(5, messages.phone),
    message: z.string().trim().optional(),
  })
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>

export type DiagnosticSchemaMessages = {
  name: string
  company: string
  contact: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmailOrPhone(value: string): boolean {
  const trimmed = value.trim()
  if (EMAIL_REGEX.test(trimmed)) {
    return true
  }
  const digitsOnly = trimmed.replace(/\D/g, "")
  return digitsOnly.length >= 7 && digitsOnly.length <= 15 && /^[+\d\s().-]+$/.test(trimmed)
}

export function createDiagnosticSchema(messages: DiagnosticSchemaMessages) {
  return z.object({
    name: z.string().trim().min(2, messages.name),
    company: z.string().trim().min(1, messages.company),
    contact: z
      .string()
      .trim()
      .refine(isValidEmailOrPhone, { message: messages.contact }),
    painPoint: z.string().trim().optional(),
  })
}

export type DiagnosticFormValues = z.infer<ReturnType<typeof createDiagnosticSchema>>
