export const sections = {
  home: "home",
  features: "features",
  modules: "modules",
  howItWorks: "how-it-works",
  benefits: "benefits",
  contact: "contact",
} as const

export function sectionHref(section: keyof typeof sections) {
  return `/#${sections[section]}` as const
}
