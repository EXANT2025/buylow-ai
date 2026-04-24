"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import type { SupportedLang } from "@/lib/i18n"

export type { SupportedLang }

const LANGUAGES: { code: SupportedLang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
]

interface LanguageDropdownProps {
  lang: SupportedLang
  onChangeLang: (lang: SupportedLang) => void
}

export function LanguageDropdown({ lang, onChangeLang }: LanguageDropdownProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const current = LANGUAGES.find(l => l.code === lang)

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-foreground/15 font-mono text-xs text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
      >
        <span>{current?.flag}</span>
        <span>{current?.label}</span>
        <ChevronRight size={12} className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-lg border border-foreground/15 bg-background/95 backdrop-blur-xl shadow-lg overflow-hidden">
            {LANGUAGES.map((l) => {
              const isCurrent = l.code === lang
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    onChangeLang(l.code)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-left font-mono text-xs transition-colors cursor-pointer ${
                    isCurrent
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-foreground/5 text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
