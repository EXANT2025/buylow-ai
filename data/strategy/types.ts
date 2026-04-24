export type LocalizedText = {
  en: string
  ko?: string
  ja?: string
  zh?: string
  es?: string
  ar?: string
  ru?: string
  id?: string
  th?: string
  vi?: string
  tr?: string
}

export interface StrategyCardItem {
  title: LocalizedText
  description: LocalizedText
  color?: string            // tailwind color token e.g. "emerald" | "amber" | "rose"
  image?: {
    src: LocalizedText
    alt: LocalizedText
  }
  /** Images inserted inline within description text. marker = text to insert image before. */
  inlineImages?: {
    marker: LocalizedText     // text in the description to insert image BEFORE (localized)
    src: LocalizedText
    alt: LocalizedText
  }[]
}

export interface StrategyTableRow {
  cells: string[]
}

export interface StrategySection {
  heading?: LocalizedText
  paragraphs?: LocalizedText[]
  layout?: "full" | "cards" | "table" | "slider" | "modes" | "advanced" | "step4custom"
  cards?: StrategyCardItem[]
  tableHeaders?: string[]
  tableRows?: StrategyTableRow[]
  sliderConfig?: {
    label: LocalizedText
    min: number
    max: number
    step: number
    defaultValue: number
    unit: string
    tiers: {
      value: number
      firstEntry: string
    }[]
    /** Drawdown guard / liquidation zone table by target profit range */
    zones?: {
      range: string             // e.g. "1~3%"
      rangeEn: string           // e.g. "1-3%"
      drawdown: string          // e.g. "0.5%"
      riskSummary: LocalizedText
    }[]
    /** Personality-based 1st drawdown guard TP */
    personalityTP?: {
      label: LocalizedText
      volatility: string        // e.g. "30%"
      tp: string                // e.g. "0.618"
    }[]
  }
}

export interface StrategyStep {
  title: LocalizedText
  subtitle?: LocalizedText
  sections: StrategySection[]
}
