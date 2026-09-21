"use client"

/**
 * Legacy demo-request form (Resend → /contact/thanks).
 * Kept for later — ContactPage currently uses the Cal.com embed instead.
 * To restore: import ContactForm and render it in place of the calendar embed.
 */
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslations } from "next-intl"

import { LandingButton } from "@/components/landing-button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "@/i18n/navigation"
import {
  createContactSchema,
  type ContactFormValues,
} from "@/lib/contact-schema"
import { INDUSTRY_OPTIONS } from "@/lib/site"
import { cn } from "@/lib/utils"

const fieldInputClassName =
  "h-auto w-full rounded-xl border-black/10 bg-muted px-4 py-3.5 font-[inherit] text-[0.95rem] text-foreground shadow-none transition-[border-color,box-shadow,background] focus-visible:border-primary focus-visible:bg-background focus-visible:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus-visible:ring-0"

const fieldLabelClassName =
  "mb-2 block text-[0.88rem] font-semibold text-foreground"

export default function ContactForm() {
  const t = useTranslations("contact")
  const router = useRouter()
  const [submitError, setSubmitError] = useState("")

  const contactSchema = useMemo(
    () =>
      createContactSchema({
        name: t("errors.name"),
        company: t("errors.company"),
        email: t("errors.email"),
        phone: t("errors.phone"),
        industry: t("errors.industry"),
        challenge: t("errors.challenge"),
      }),
    [t]
  )

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      industry: undefined,
      challenge: "",
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError("")

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Request failed")
      }

      router.push("/contact/thanks")
    } catch {
      setSubmitError(t("errors.submit"))
    }
  }

  return (
    <div className="rounded-[20px] border border-black/6 bg-background p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] md:p-12">
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <h2 className="mb-8 text-2xl font-extrabold tracking-[-0.02em] text-brand-dark">
          {t("formTitle")}
        </h2>

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="mb-6 flex-col gap-0"
            >
              <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                {t("nameLabel")}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder={t("namePh")}
                aria-invalid={fieldState.invalid}
                className={fieldInputClassName}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="company"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="mb-6 flex-col gap-0"
            >
              <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                {t("companyLabel")}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder={t("companyPh")}
                aria-invalid={fieldState.invalid}
                className={fieldInputClassName}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="mb-6 flex-col gap-0"
            >
              <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                {t("emailLabel")}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder={t("emailPh")}
                aria-invalid={fieldState.invalid}
                className={fieldInputClassName}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="mb-6 flex-col gap-0"
            >
              <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                {t("phoneLabel")}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="tel"
                placeholder={t("phonePh")}
                aria-invalid={fieldState.invalid}
                className={fieldInputClassName}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="industry"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="mb-6 flex-col gap-0"
            >
              <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                {t("industryLabel")}
              </FieldLabel>
              <select
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                className={cn(fieldInputClassName, "appearance-none")}
              >
                <option value="" disabled>
                  {t("industryPh")}
                </option>
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {t(`industries.${opt}`)}
                  </option>
                ))}
              </select>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="challenge"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="mb-6 flex-col gap-0"
            >
              <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                {t("challengeLabel")}
              </FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                rows={4}
                placeholder={t("challengePh")}
                aria-invalid={fieldState.invalid}
                className={cn(fieldInputClassName, "min-h-0")}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <LandingButton
          type="submit"
          variant="lime"
          size="full"
          className="mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("sending") : t("submit")}
        </LandingButton>

        {submitError ? (
          <p className="mt-5 rounded-md bg-destructive/10 p-4 text-center text-[0.9rem] font-semibold text-destructive">
            {submitError}
          </p>
        ) : null}
      </form>
    </div>
  )
}
