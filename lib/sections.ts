export const sections = {
  home: "home",
  flow: "flow",
  modules: "modules",
  industries: "industries",
  story: "story",
  faq: "faq",
  contact: "contact",
  proof: "proof",
} as const

export function sectionHref(section: keyof typeof sections) {
  return `/#${sections[section]}` as const
}
