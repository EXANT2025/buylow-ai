"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { type SupportedLang, ACTIVE_LANGUAGES, COMING_SOON_LANGUAGES } from "@/lib/i18n"

interface LanguageContextValue {
  lang: SupportedLang
  setLang: (lang: SupportedLang) => void
  isComingSoon: (lang: SupportedLang) => boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "buylow.lang"

export function LanguageProvider({ 
  children, 
  defaultLang = "en" 
}: { 
  children: ReactNode
  defaultLang?: SupportedLang 
}) {
  const [lang, setLangState] = useState<SupportedLang>(defaultLang)

  // Load saved language on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && ACTIVE_LANGUAGES.includes(saved as SupportedLang)) {
        setLangState(saved as SupportedLang)
      }
      // If no saved language, keep the defaultLang (already set in useState)
    } catch {
      // localStorage not available
    }
  }, [])

  const setLang = useCallback((newLang: SupportedLang) => {
    // All 6 languages are now active
    setLangState(newLang)
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
    } catch {
      // localStorage not available
    }
  }, [])

  const isComingSoon = useCallback((l: SupportedLang) => {
    return COMING_SOON_LANGUAGES.includes(l)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, isComingSoon }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
