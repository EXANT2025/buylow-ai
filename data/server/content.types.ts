export type ServerExchange = "okx"
export type ServerVariant = "okx-mobile" | "okx-mobile-btc" | "okx-mobile-gold"
export type ServerStepNum = 2 | 3 | 4 | 5
export type Language = "en" | "ko" | "ar" | "ru" | "zh" | "es" | "id" | "th" | "vi" | "tr"

export interface BilingualText {
  en: string
  ko?: string
  ar?: string
  ru?: string
  zh?: string
  es?: string
  id?: string
  th?: string
  vi?: string
  tr?: string
}

export interface ContentSection {
  heading?: BilingualText
  image?: { src: string; alt: string }
  paragraphs?: BilingualText[]
  link?: {
    label: BilingualText
    href: string
    slot?: string
  }
  buttons?: {
    label: BilingualText
    href?: string
    action?: string
    color?: string
  }[]
  layout: "fullTop" | "textOnly" | "imageCard"
  cards?: {
    image: { src: string; alt: string }
    href: string
  }[]
}

export interface StepContent {
  title: BilingualText
  sections: ContentSection[]
}

export type ServerStepData = Partial<Record<ServerStepNum, StepContent>>
export type ServerRegistry = Record<string, ServerStepData> & {
  "okx-mobile": ServerStepData
}
