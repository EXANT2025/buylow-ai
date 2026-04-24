"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Download, Book, Globe, ArrowLeft, FileText, MonitorSmartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { translations, type SupportedLang, t as tHelper } from "@/lib/i18n"

const EBOOK_LANGUAGES = [
  { code: "ko", label: "Korean", flag: "KR", available: true },
  { code: "en", label: "English", flag: "US", available: false },
  { code: "es", label: "Español", flag: "ES", available: false },
  { code: "ru", label: "Русский", flag: "RU", available: false },
  { code: "zh", label: "中文", flag: "CN", available: false },
  { code: "ar", label: "العربية", flag: "SA", available: false },
  { code: "id", label: "Bahasa Indonesia", flag: "ID", available: false },
  { code: "th", label: "ไทย", flag: "TH", available: false },
  { code: "vi", label: "Tiếng Việt", flag: "VN", available: false },
  { code: "tr", label: "Türkçe", flag: "TR", available: false },
]

const KOREAN_PDF_URL = "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/BUYLOW%20QUANT%20PDF-1.pdf"

type EbookFormat = "pdf" | "web" | null

interface EbookDownloadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EbookDownloadModal({ isOpen, onClose }: EbookDownloadModalProps) {
  const router = useRouter()
  const { lang } = useLanguage()
  const [selectedFormat, setSelectedFormat] = useState<EbookFormat>(null)
  const [comingSoonLang, setComingSoonLang] = useState<string | null>(null)

  if (!isOpen) return null

  const handleFormatSelect = (format: EbookFormat) => {
    setSelectedFormat(format)
  }

  const handleBack = () => {
    setSelectedFormat(null)
  }

  const handleClose = () => {
    setSelectedFormat(null)
    onClose()
  }

  const handleLanguageSelect = (langItem: typeof EBOOK_LANGUAGES[0]) => {
    if (langItem.available) {
      if (selectedFormat === "pdf") {
        // PDF - open download link
        window.open(KOREAN_PDF_URL, "_blank", "noopener,noreferrer")
      } else if (selectedFormat === "web") {
        // Web - navigate to /ebook page with language
        router.push(`/ebook?lang=${langItem.code}`)
      }
      handleClose()
    } else {
      // Show coming soon message
      setComingSoonLang(langItem.code)
      setTimeout(() => setComingSoonLang(null), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-[90%] max-w-[400px] bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
          <div className="flex items-center gap-2.5">
            {selectedFormat && (
              <button
                type="button"
                onClick={handleBack}
                className="p-1.5 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer mr-1"
              >
                <ArrowLeft className="w-4 h-4 text-foreground/60" />
              </button>
            )}
            <div className="p-2 rounded-lg bg-accent/10">
              <Book className="w-4 h-4 text-accent" />
            </div>
            <span className="font-mono text-sm font-semibold text-foreground tracking-wide">
              E-Book
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-foreground/60" />
          </button>
        </div>
        
        {/* Content */}
        {!selectedFormat ? (
          // Step 1: Format Selection
          <div className="p-5">
            <p className="text-sm text-foreground/70 mb-5 font-mono text-center">
              {tHelper(translations.strategyUI.ebookFormatTitle, lang as SupportedLang)}
            </p>
            
            <div className="space-y-3">
              {/* PDF Download Option */}
              <button
                type="button"
                onClick={() => handleFormatSelect("pdf")}
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:bg-accent/5 hover:border-accent/30 transition-all duration-200 cursor-pointer group text-left"
              >
                <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/15 transition-colors">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-mono text-sm font-semibold text-foreground mb-1">
                    {tHelper(translations.strategyUI.ebookFormatPdf, lang as SupportedLang)}
                  </span>
                  <span className="block font-mono text-[11px] text-foreground/50 leading-relaxed">
                    {tHelper(translations.strategyUI.ebookFormatPdfDesc, lang as SupportedLang)}
                  </span>
                </div>
                <Download className="w-4 h-4 text-foreground/30 group-hover:text-accent transition-colors mt-1" />
              </button>
              
              {/* Web Reader Option */}
              <button
                type="button"
                onClick={() => handleFormatSelect("web")}
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:bg-cyan-500/5 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer group text-left"
              >
                <div className="p-3 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/15 transition-colors">
                  <MonitorSmartphone className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-mono text-sm font-semibold text-foreground mb-1">
                    {tHelper(translations.strategyUI.ebookFormatWeb, lang as SupportedLang)}
                  </span>
                  <span className="block font-mono text-[11px] text-foreground/50 leading-relaxed">
                    {tHelper(translations.strategyUI.ebookFormatWebDesc, lang as SupportedLang)}
                  </span>
                </div>
                <Globe className="w-4 h-4 text-foreground/30 group-hover:text-cyan-400 transition-colors mt-1" />
              </button>
            </div>
          </div>
        ) : (
          // Step 2: Language Selection
          <div className="p-4">
            <p className="text-xs text-foreground/50 mb-3 font-mono">
              {tHelper(translations.strategyUI.ebookSelectLanguage, lang as SupportedLang)}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {EBOOK_LANGUAGES.map((langItem) => (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => handleLanguageSelect(langItem)}
                  className={cn(
                    "relative flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer",
                    langItem.available
                      ? selectedFormat === "pdf"
                        ? "border-accent/30 bg-accent/5 hover:bg-accent/10 hover:border-accent/50"
                        : "border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                      : "border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/5"
                  )}
                >
                  <span className="font-mono text-[11px] font-bold text-foreground/70">
                    {langItem.flag}
                  </span>
                  <span className={cn(
                    "font-mono text-[12px]",
                    langItem.available 
                      ? selectedFormat === "pdf" 
                        ? "text-accent font-medium" 
                        : "text-cyan-400 font-medium"
                      : "text-foreground/60"
                  )}>
                    {langItem.label}
                  </span>
                  {langItem.available && (
                    selectedFormat === "pdf" 
                      ? <Download className="w-3 h-3 text-accent ml-auto" />
                      : <Globe className="w-3 h-3 text-cyan-400 ml-auto" />
                  )}
                  
                  {/* Coming Soon Toast */}
                  {comingSoonLang === langItem.code && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/95 rounded-xl animate-in fade-in duration-150">
                      <span className="font-mono text-[11px] text-foreground/70">
                        {tHelper(translations.common.comingSoon, lang as SupportedLang)}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Footer Note */}
            <p className="text-[10px] text-foreground/40 font-mono text-center mt-4">
              {tHelper(translations.strategyUI.ebookMoreLangs, lang as SupportedLang)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Floating button for mobile (placed above FAQ button)
export function EbookFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-[11.5rem] md:hidden right-4 z-50 flex flex-col items-center gap-1 p-3 rounded-2xl border border-accent/30 bg-background/90 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:border-accent/50 cursor-pointer"
      style={{
        boxShadow: "0 0 20px rgba(249, 115, 22, 0.2), 0 4px 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Book className="w-5 h-5 text-accent" />
      <span className="font-mono text-[9px] text-foreground/70 tracking-wide">E-Book</span>
    </button>
  )
}
