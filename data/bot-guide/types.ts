export type Language = "en" | "ko" | "ar" | "ru" | "zh" | "es" | "id" | "th" | "vi" | "tr"

export interface LocalizedText {
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

export interface BotGuideImage {
  src: string
  alt: string
}

export interface BotGuideSection {
  heading?: LocalizedText
  description?: LocalizedText
  images?: BotGuideImage[]
  bullets?: LocalizedText[]
  warning?: LocalizedText
  example?: LocalizedText
  table?: {
    headers: LocalizedText[]
    rows: LocalizedText[][]
  }
}

export interface BotGuideStep {
  stepNum: number
  title: LocalizedText
  subtitle?: LocalizedText
  sections: BotGuideSection[]
}

export const TOTAL_BOT_GUIDE_STEPS = 5
