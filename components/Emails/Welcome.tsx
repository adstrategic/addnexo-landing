import { Text } from "@react-email/components"

import { EmailLayout } from "@/components/Emails/email-layout"

interface WelcomeEmailProps {
  userFirstName: string
}

export function WelcomeEmail({ userFirstName }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Thanks for requesting an ADDNEXO demo">
      <Text className="m-0 mb-4 text-base leading-relaxed text-gray-800">
        Hi {userFirstName},
      </Text>
      <Text className="m-0 mb-4 text-base leading-relaxed text-gray-800">
        Thank you for your interest in ADDNEXO ERP. Our team received your demo
        request and will contact you shortly to show you how we can help you
        centralize inventory, sales, and billing.
      </Text>
      <Text className="m-0 text-base leading-relaxed text-gray-800">
        Best,
        <br />
        The ADDNEXO team
      </Text>
    </EmailLayout>
  )
}

WelcomeEmail.PreviewProps = {
  userFirstName: "Nico",
} satisfies WelcomeEmailProps

export default WelcomeEmail
