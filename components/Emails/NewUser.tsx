import { Text } from "@react-email/components"

import { EmailLayout } from "@/components/Emails/email-layout"

interface NewUserProps {
  userFirstName: string
  userCompany: string
  userEmail: string
  userPhone: string
  userIndustry: string
  userChallenge: string
}

export function NewUser({
  userFirstName,
  userCompany,
  userEmail,
  userPhone,
  userIndustry,
  userChallenge,
}: NewUserProps) {
  return (
    <EmailLayout preview="New ADDNEXO demo request">
      <Text className="m-0 mb-4 text-base leading-relaxed text-gray-800">
        A new demo request was submitted on the ADDNEXO website.
      </Text>
      <Text className="m-0 mb-2 text-base leading-relaxed text-gray-800">
        <strong>Name:</strong> {userFirstName}
      </Text>
      <Text className="m-0 mb-2 text-base leading-relaxed text-gray-800">
        <strong>Company:</strong> {userCompany}
      </Text>
      <Text className="m-0 mb-2 text-base leading-relaxed text-gray-800">
        <strong>Email:</strong> {userEmail}
      </Text>
      <Text className="m-0 mb-2 text-base leading-relaxed text-gray-800">
        <strong>Phone:</strong> {userPhone}
      </Text>
      <Text className="m-0 mb-2 text-base leading-relaxed text-gray-800">
        <strong>Industry:</strong> {userIndustry}
      </Text>
      <Text className="m-0 mb-4 text-base leading-relaxed text-gray-800">
        <strong>Biggest operational challenge:</strong> {userChallenge}
      </Text>
      <Text className="m-0 text-base leading-relaxed text-gray-800">
        Please follow up with this lead as soon as possible.
      </Text>
    </EmailLayout>
  )
}

NewUser.PreviewProps = {
  userFirstName: "Nicolas",
  userCompany: "Acme Corp",
  userEmail: "mail@gmail.com",
  userPhone: "3165382781",
  userIndustry: "fresh-produce",
  userChallenge: "We cannot see true landed cost after imports.",
} satisfies NewUserProps

export default NewUser
