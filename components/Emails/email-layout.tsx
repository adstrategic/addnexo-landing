import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components"
import { pixelBasedPreset, Tailwind } from "@react-email/tailwind"

import { getEmailLogoUrl } from "@/lib/email-brand"

import type { ReactNode } from "react"

interface EmailLayoutProps {
  preview: string
  children: ReactNode
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Head />
        <Body className="bg-white font-sans">
          <Preview>{preview}</Preview>
          <Container className="mx-auto max-w-xl px-0 py-10">
            <Img
              src={getEmailLogoUrl()}
              width={180}
              height={180}
              alt="ADDNEXO ERP"
              className="mx-auto mb-8 rounded-2xl"
            />
            {children}
            <Hr className="my-8 border-gray-300" />
            <Text className="m-0 text-xs text-gray-500">
              ADDNEXO ERP by ADD Strategic
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
