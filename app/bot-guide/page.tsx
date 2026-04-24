"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, MessageCircle, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { BackgroundWave } from "@/components/BackgroundWave"
import { LanguageDropdown } from "@/components/language-dropdown"
import { useLanguage } from "@/lib/language-context"
import { BOT_GUIDE_CONTENT } from "@/data/bot-guide/content.registry"
import { TOTAL_BOT_GUIDE_STEPS } from "@/data/bot-guide/types"
import type { Language, LocalizedText, BotGuideStep, BotGuideSection } from "@/data/bot-guide/types"

// Helper to get localized text with fallback
function getText(obj: LocalizedText | undefined, lang: Language): string {
  if (!obj) return ""
  return (obj as Record<string, string | undefined>)[lang] ?? obj.en ?? ""
}

// Render markdown-like bold text
function renderText(text: string): React.ReactNode {
  if (!text) return null
  // Split by **text** and render bold
  const parts = text.split(/\*\*([^*]+)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-accent">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

// Section component
function GuideSection({
  section,
  lang,
}: {
  section: BotGuideSection
  lang: Language
}) {
  return (
    <div className="space-y-4 p-5 rounded-xl bg-foreground/[0.03] border border-foreground/10">
      {/* Heading */}
      {section.heading && (
        <h3 className="font-semibold text-lg text-foreground">
          {renderText(getText(section.heading, lang))}
        </h3>
      )}

      {/* Description */}
      {section.description && (
        <div className="text-foreground/70 whitespace-pre-line leading-relaxed">
          {renderText(getText(section.description, lang))}
        </div>
      )}

      {/* Bullets */}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="space-y-2 list-disc list-inside text-foreground/70">
          {section.bullets.map((bullet, i) => (
            <li key={i}>{renderText(getText(bullet, lang))}</li>
          ))}
        </ul>
      )}

      {/* Example */}
      {section.example && (
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-accent mt-1 flex-shrink-0" />
            <div className="text-sm text-foreground/80 whitespace-pre-line font-mono">
              {getText(section.example, lang)}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {section.table && (
        <div className="overflow-x-auto">
          <table className="w-full border border-foreground/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-foreground/5">
                {section.table.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-left text-sm font-semibold text-foreground border-b border-foreground/10"
                  >
                    {getText(header, lang)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-transparent" : "bg-foreground/[0.02]"}>
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-4 py-2 text-sm text-foreground/70 border-b border-foreground/5"
                    >
                      {getText(cell, lang)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Warning */}
      {section.warning && (
        <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-foreground/80 whitespace-pre-line">
              {renderText(getText(section.warning, lang))}
            </div>
          </div>
        </div>
      )}

      {/* Images */}
      {section.images && section.images.length > 0 && (
        <div className="space-y-3">
          {section.images.map((img, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden border border-foreground/10">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto object-contain bg-black/20"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Step content component
function StepContent({
  step,
  lang,
}: {
  step: BotGuideStep
  lang: Language
}) {
  return (
    <div className="space-y-8">
      {/* Step header with Telegram-like styling */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <MessageCircle size={16} className="text-accent" />
          <span className="font-mono text-sm text-accent">
            Step {step.stepNum} / {TOTAL_BOT_GUIDE_STEPS}
          </span>
        </div>
        <h1 className="font-[var(--font-bebas)] text-3xl md:text-5xl tracking-tight">
          {getText(step.title, lang)}
        </h1>
        {step.subtitle && (
          <p className="text-foreground/60 font-mono text-sm max-w-lg mx-auto">
            {getText(step.subtitle, lang)}
          </p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {step.sections.map((section, i) => (
          <GuideSection key={i} section={section} lang={lang} />
        ))}
      </div>
    </div>
  )
}

function BotGuidePageContent() {
  const router = useRouter()
  const sp = useSearchParams()
  const { lang: globalLang, setLang: setGlobalLang } = useLanguage()

  const stepParam = Number(sp.get("step")) || 1
  const [step, setStep] = useState(stepParam)

  const lang: Language = globalLang as Language

  const handleLangChange = useCallback(
    (l: string) => {
      setGlobalLang(l as Language)
    },
    [setGlobalLang]
  )

  const isRTL = lang === "ar"

  // Sync step from URL
  useEffect(() => {
    const s = Number(sp.get("step")) || 1
    if (s >= 1 && s <= TOTAL_BOT_GUIDE_STEPS) {
      setStep(s)
    }
  }, [sp])

  // Mobile: scroll to top on step change
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [step])

  const updateUrl = useCallback(
    (newStep: number) => {
      router.push(`/bot-guide?step=${newStep}`)
    },
    [router]
  )

  const handleNext = () => {
    if (step < TOTAL_BOT_GUIDE_STEPS) {
      updateUrl(step + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      updateUrl(step - 1)
    } else {
      // Go back to last server step
      router.push("/server?step=5")
    }
  }

  const progress = (step / TOTAL_BOT_GUIDE_STEPS) * 100
  const currentStep = BOT_GUIDE_CONTENT.find((s) => s.stepNum === step)

  // UI text translations
  const UI_TEXT = {
    back: {
      en: "Back",
      ko: "이전",
      ar: "رجوع",
      ru: "Назад",
      zh: "返回",
      es: "Atrás",
      id: "Kembali",
      th: "กลับ",
      vi: "Quay lại",
      tr: "Geri",
    },
    previous: {
      en: "Previous",
      ko: "이전",
      ar: "السابق",
      ru: "Предыдущий",
      zh: "上一步",
      es: "Anterior",
      id: "Sebelumnya",
      th: "ก่อนหน้า",
      vi: "Trước",
      tr: "Önceki",
    },
    next: {
      en: "Next",
      ko: "다음",
      ar: "التالي",
      ru: "Далее",
      zh: "下一步",
      es: "Siguiente",
      id: "Selanjutnya",
      th: "ถัดไป",
      vi: "Tiếp",
      tr: "Sonraki",
    },
    complete: {
      en: "Complete",
      ko: "완료",
      ar: "إكمال",
      ru: "Завершить",
      zh: "完成",
      es: "Completar",
      id: "Selesai",
      th: "เสร็จสิ้น",
      vi: "Hoàn thành",
      tr: "Tamamla",
    },
    botGuide: {
      en: "Bot Setup Guide",
      ko: "봇 설정 가이드",
      ar: "دليل إعداد البوت",
      ru: "Руководство по настройке бота",
      zh: "机器人设置指南",
      es: "Guía de Configuración del Bot",
      id: "Panduan Setup Bot",
      th: "คู่มือการตั้งค่าบอท",
      vi: "Hướng Dẫn Thiết Lập Bot",
      tr: "Bot Kurulum Rehberi",
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background wave */}
      <div className="opacity-30 pointer-events-none fixed inset-0 z-0">
        <BackgroundWave />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors font-mono text-sm"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">{getText(UI_TEXT.back, lang)}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <MessageCircle size={14} className="text-accent" />
              <span className="font-mono text-xs text-accent">{getText(UI_TEXT.botGuide, lang)}</span>
            </div>
            <span className="font-mono text-xs text-foreground/50">
              {step} / {TOTAL_BOT_GUIDE_STEPS}
            </span>
            <LanguageDropdown lang={lang} onChangeLang={handleLangChange} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-foreground/5">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {currentStep ? (
          <StepContent step={currentStep} lang={lang} />
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground/50 font-mono text-sm">Step not found</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-foreground/15 text-foreground/70 hover:text-foreground hover:border-foreground/30 font-mono text-sm transition-all"
          >
            <ArrowLeft size={16} />
            {getText(UI_TEXT.previous, lang)}
          </button>

          {step < TOTAL_BOT_GUIDE_STEPS ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                color: "var(--background)",
              }}
            >
              {getText(UI_TEXT.next, lang)}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
                color: "var(--background)",
              }}
            >
              <CheckCircle size={16} />
              {getText(UI_TEXT.complete, lang)}
            </button>
          )}
        </div>

        {/* Step indicator dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_BOT_GUIDE_STEPS }).map((_, i) => (
            <button
              key={i}
              onClick={() => updateUrl(i + 1)}
              className={`w-2 h-2 rounded-full transition-all ${
                i + 1 === step
                  ? "bg-accent w-6"
                  : i + 1 < step
                    ? "bg-accent/50"
                    : "bg-foreground/20"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default function BotGuidePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-foreground/50 font-mono text-sm">Loading...</div>
        </div>
      }
    >
      <BotGuidePageContent />
    </Suspense>
  )
}
