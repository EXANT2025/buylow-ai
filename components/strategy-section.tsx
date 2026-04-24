"use client"

import React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Download } from "lucide-react"
import { SectionOverlay } from "@/components/section-overlay"
import { VitruvianWatermark } from "@/components/vitruvian-watermark"
import { playTypingClick } from "@/components/split-flap-text"
import { EbookDownloadModal } from "@/components/ebook-download-modal"
import { useLanguage } from "@/lib/language-context"
import { translations, type SupportedLang } from "@/lib/i18n"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ── static data (keys for i18n lookup) ── */

const engineModuleKeys = [
  { nameKey: "rotationEngine", statusKey: "active" },
  { nameKey: "bollingerTiming", statusKey: "active" },
  { nameKey: "fibonacciGrid", statusKey: "active" },
  { nameKey: "riskGuard", statusKey: "active" },
] as const

const configLines = [
  { num: 1, key: "timeframe", value: "5m", comment: null },
  { num: 2, key: "entry", value: "first_bollinger_break", comment: null },
  { num: 3, key: "grid", value: "fib(1.236, 1.382, 1.5, 1.618)", comment: null },
  { num: 4, key: "tp", value: "retrace(0.764, 0.618, 0.5)", comment: null },
  { num: 5, key: "mode", value: "safe | balanced | aggressive", comment: null },
  { num: 6, key: null, value: null, comment: "# auto-rotation enabled" },
  { num: 7, key: "max_drawdown", value: "12%", comment: null },
  { num: 8, key: "direction", value: "auto", comment: null },
]

const checklistItemKeys = [
  { labelKey: "volatilityScan", checked: true },
  { labelKey: "autoEntryMode", checked: true },
  { labelKey: "positionResetLogic", checked: true },
  { labelKey: "maxLossLimit", checked: true },
  { labelKey: "longShortDirection", checked: true },
] as const

/* ── Helper to get localized module/checklist sources ── */
function getLocalizedModuleSources(lang: SupportedLang): string[] {
  return engineModuleKeys.map((m) => {
    const name = translations.strategy[m.nameKey]?.[lang] ?? translations.strategy[m.nameKey]?.en ?? m.nameKey
    const status = translations.strategy[m.statusKey]?.[lang] ?? translations.strategy[m.statusKey]?.en ?? "ACTIVE"
    return `${name}  ${status}`
  })
}

function getLocalizedCheckSources(lang: SupportedLang): string[] {
  return checklistItemKeys.map((c) => {
    return translations.strategy[c.labelKey]?.[lang] ?? translations.strategy[c.labelKey]?.en ?? c.labelKey
  })
}

/* ── Build flat source strings (English fallback for initial render) ── */
const MODULE_SOURCES = getLocalizedModuleSources("en")
const CONFIG_SOURCE = configLines
  .map((l) => (l.comment ? l.comment : `${l.key}: ${l.value}`))
  .join("\n")
const CHECK_SOURCES = getLocalizedCheckSources("en")

/* ── Helpers ── */
const rand = (a: number, b: number) => a + Math.random() * (b - a)

function abortSleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) { resolve(); return }
    const t = setTimeout(resolve, ms)
    signal.addEventListener("abort", () => { clearTimeout(t); resolve() }, { once: true })
  })
}

/* ── Cursor ── */
function Cursor({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <span
      className="inline-block w-[6px] h-[14px] bg-accent/80 ml-0.5 align-middle"
      style={{ animation: "cursorBlink 0.7s step-end infinite" }}
    />
  )
}

/* ── Sound throttle helper ── */
function createThrottledSound(intervalMs = 60) {
  let last = 0
  let charCount = 0
  return () => {
    charCount++
    if (charCount % 3 !== 0) return
    const now = performance.now()
    if (now - last < intervalMs) return
    last = now
    playTypingClick()
  }
}

/* ── COMPONENT ── */

export function StrategySection() {
  const { lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const [ebookModalOpen, setEbookModalOpen] = useState(false)

  const isRunningRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  
  // Store current lang in ref to access in callbacks without causing re-renders
  const langRef = useRef(lang)
  langRef.current = lang

  /* Panel 1 (left) */
  const [leftTexts, setLeftTexts] = useState<string[]>(() => MODULE_SOURCES.map(() => ""))
  const [leftCursor, setLeftCursor] = useState(-1)

  /* Panel 2 (center) */
  const [centerText, setCenterText] = useState("")
  const [centerCursorOn, setCenterCursorOn] = useState(false)

  /* Panel 3 (right) */
  const [rightTexts, setRightTexts] = useState<string[]>(() => CHECK_SOURCES.map(() => ""))
  const [rightCursor, setRightCursor] = useState(-1)

  const [allDone, setAllDone] = useState(false)
  const [glowPulse, setGlowPulse] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true)
      const moduleSources = getLocalizedModuleSources(langRef.current)
      const checkSources = getLocalizedCheckSources(langRef.current)
      setLeftTexts([...moduleSources])
      setCenterText(CONFIG_SOURCE)
      setRightTexts([...checkSources])
      setAllDone(true)
    }
  }, [])

  const resetAll = useCallback(() => {
    const moduleSources = getLocalizedModuleSources(langRef.current)
    const checkSources = getLocalizedCheckSources(langRef.current)
    setLeftTexts(moduleSources.map(() => ""))
    setLeftCursor(-1)
    setCenterText("")
    setCenterCursorOn(false)
    setRightTexts(checkSources.map(() => ""))
    setRightCursor(-1)
    setAllDone(false)
    setGlowPulse(false)
  }, [])

  /* ── Typing runners — one per panel, run in parallel ── */

  const typeLeft = useCallback(async (signal: AbortSignal, sound: () => void) => {
    const moduleSources = getLocalizedModuleSources(langRef.current)
    for (let li = 0; li < moduleSources.length; li++) {
      if (signal.aborted) return
      setLeftCursor(li)
      const src = moduleSources[li]
      for (let i = 1; i <= src.length; i++) {
        if (signal.aborted) return
        const idx = li
        const slice = src.slice(0, i)
        setLeftTexts((prev) => { const n = [...prev]; n[idx] = slice; return n })
        sound()
        await abortSleep(rand(18, 38), signal)
      }
      await abortSleep(60, signal)
    }
    setLeftCursor(-1)
  }, [])

  const typeCenter = useCallback(async (signal: AbortSignal, sound: () => void) => {
    const src = CONFIG_SOURCE
    for (let i = 1; i <= src.length; i++) {
      if (signal.aborted) return
      setCenterText(src.slice(0, i))
      setCenterCursorOn(true)
      sound()
      await abortSleep(rand(18, 38), signal)
    }
    setCenterCursorOn(false)
  }, [])

  const typeRight = useCallback(async (signal: AbortSignal, sound: () => void) => {
    const checkSources = getLocalizedCheckSources(langRef.current)
    for (let li = 0; li < checkSources.length; li++) {
      if (signal.aborted) return
      setRightCursor(li)
      const src = checkSources[li]
      for (let i = 1; i <= src.length; i++) {
        if (signal.aborted) return
        const idx = li
        const slice = src.slice(0, i)
        setRightTexts((prev) => { const n = [...prev]; n[idx] = slice; return n })
        sound()
        await abortSleep(rand(18, 38), signal)
      }
      await abortSleep(60, signal)
    }
    setRightCursor(-1)
  }, [])

  /* ── Start all 3 simultaneously ── */
  const startAll = useCallback(async (signal: AbortSignal) => {
    const sound = createThrottledSound(60)

    const results = await Promise.all([
      typeLeft(signal, sound),
      typeCenter(signal, sound),
      typeRight(signal, sound),
    ])

    // If not aborted, trigger completion glow
    if (!signal.aborted) {
      setAllDone(true)
      setGlowPulse(true)
      await abortSleep(800, signal)
      if (!signal.aborted) setGlowPulse(false)
    }
    return results
  }, [typeLeft, typeCenter, typeRight])

  /* ── Stop ── */
  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    isRunningRef.current = false
  }, [])

  /* ── Observer: enter → start, leave → stop + reset ── */
  useEffect(() => {
    if (reducedMotion) return
    const el = panelsRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isRunningRef.current) {
            isRunningRef.current = true
            resetAll()
            const ctrl = new AbortController()
            abortRef.current = ctrl
            startAll(ctrl.signal).finally(() => {
              isRunningRef.current = false
            })
          }
        } else {
          stop()
          resetAll()
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => { obs.disconnect(); stop() }
  }, [reducedMotion, startAll, stop, resetAll])

  /* Header GSAP */
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        x: -60, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const showFull = reducedMotion || allDone
  
  // Get localized sources for rendering (using current lang)
  const localizedModuleSources = getLocalizedModuleSources(lang)
  const localizedCheckSources = getLocalizedCheckSources(lang)

  return (
    <section ref={sectionRef} id="strategy" className="relative py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      <SectionOverlay />
      <VitruvianWatermark />
      <style>{`
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes glowPulseAnim {
          0%{box-shadow:0 0 0 rgba(255,140,50,0);border-color:rgba(255,255,255,0.06)}
          40%{box-shadow:0 0 40px rgba(255,140,50,.18),0 0 80px rgba(255,140,50,.06);border-color:rgba(255,140,50,.35)}
          100%{box-shadow:0 0 0 rgba(255,140,50,0);border-color:rgba(255,255,255,0.06)}
        }
      `}</style>

      {/* Header */}
      <div ref={headerRef} className="relative z-20 mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{translations.strategy.sectionLabel[lang] ?? translations.strategy.sectionLabel.en}</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">{translations.strategy.heading[lang] ?? translations.strategy.heading.en}</h2>
        <p className="mt-4 max-w-lg font-mono text-sm text-foreground/50 leading-relaxed">
          {translations.strategy.description[lang] ?? translations.strategy.description.en}
        </p>
      </div>

      {/* 3-Panel IDE Layout */}
      <div ref={panelsRef} className="relative z-20 flex flex-col lg:flex-row gap-4 lg:gap-3">

        {/* Left Panel — Engine Modules */}
        <div
          className="lg:w-[28%] rounded-xl border border-foreground/10 bg-foreground/[0.03] overflow-hidden transition-[border-color,box-shadow] duration-700"
          style={glowPulse ? { animation: "glowPulseAnim 0.8s ease-out forwards" } : undefined}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10 bg-foreground/[0.03]">
            <div className="w-2 h-2 rounded-full bg-accent/80" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">{translations.strategy.engineModules[lang] ?? translations.strategy.engineModules.en}</span>
          </div>
          <div className="p-3 space-y-2">
            {engineModuleKeys.map((mod, i) => {
              const fullStr = localizedModuleSources[i]
              const typed = showFull ? fullStr : leftTexts[i]
              const showCur = !showFull && leftCursor === i
              const localizedName = translations.strategy[mod.nameKey]?.[lang] ?? translations.strategy[mod.nameKey]?.en ?? mod.nameKey
              const nameLen = localizedName.length
              const typedName = typed.slice(0, nameLen)
              const typedAfter = typed.slice(nameLen + 2)
              return (
                <div key={mod.nameKey} className="flex items-center justify-between px-4 py-3 rounded-lg border border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/15 hover:bg-foreground/[0.04] transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                    <span className="font-mono text-xs text-foreground/80">
                      {typedName}
                      <Cursor visible={showCur && typed.length <= nameLen} />
                    </span>
                  </div>
                  {typedAfter && (
                    <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      {typedAfter}
                      <Cursor visible={showCur && typed.length > nameLen} />
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Center Panel — Strategy Config */}
        <div
          className="lg:w-[44%] rounded-xl border border-foreground/10 bg-foreground/[0.03] overflow-hidden transition-[border-color,box-shadow] duration-700"
          style={glowPulse ? { animation: "glowPulseAnim 0.8s ease-out forwards" } : undefined}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-foreground/[0.03]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-400/80" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">strategy.config</span>
            </div>
            <span className="font-mono text-[9px] text-foreground/30">YAML</span>
          </div>
          <div className="p-4 font-mono text-xs leading-[2.2]">
            {(() => {
              const typedText = showFull ? CONFIG_SOURCE : centerText
              const typedLines = typedText.split("\n")
              return configLines.map((line, lineIdx) => {
                const typedLine = typedLines[lineIdx] ?? ""
                const isLastLine = !showFull && centerCursorOn && lineIdx === typedLines.length - 1 && typedLine.length > 0
                return (
                  <div key={line.num} className="flex items-baseline gap-4">
                    <span className="w-5 text-right text-foreground/20 select-none shrink-0">{line.num}</span>
                    {line.comment ? (
                      <span className="text-foreground/25 italic">
                        {showFull ? line.comment : typedLine}
                        <Cursor visible={isLastLine} />
                      </span>
                    ) : (
                      <div>
                        {(() => {
                          if (showFull) {
                            return (<><span className="text-sky-400/90">{line.key}</span><span className="text-foreground/30">{": "}</span><span className="text-amber-300/80">{line.value}</span></>)
                          }
                          const ci = typedLine.indexOf(": ")
                          if (ci === -1) return <span className="text-sky-400/90">{typedLine}<Cursor visible={isLastLine} /></span>
                          const k = typedLine.slice(0, ci)
                          const rest = typedLine.slice(ci)
                          if (rest.length <= 2) return (<><span className="text-sky-400/90">{k}</span><span className="text-foreground/30">{rest}<Cursor visible={isLastLine} /></span></>)
                          return (<><span className="text-sky-400/90">{k}</span><span className="text-foreground/30">{": "}</span><span className="text-amber-300/80">{rest.slice(2)}<Cursor visible={isLastLine} /></span></>)
                        })()}
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* Right Panel — Pre-flight Check */}
        <div
          className="lg:w-[28%] rounded-xl border border-foreground/10 bg-foreground/[0.03] overflow-hidden transition-[border-color,box-shadow] duration-700"
          style={glowPulse ? { animation: "glowPulseAnim 0.8s ease-out forwards" } : undefined}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10 bg-foreground/[0.03]">
            <div className="w-2 h-2 rounded-full bg-violet-400/80" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">{translations.strategy.preflightCheck[lang] ?? translations.strategy.preflightCheck.en}</span>
          </div>
          <div className="p-3 space-y-2">
            {checklistItemKeys.map((item, i) => {
              const localizedLabel = localizedCheckSources[i]
              const typed = showFull ? localizedLabel : rightTexts[i]
              const showCur = !showFull && rightCursor === i
              const complete = typed.length === localizedLabel.length
              return (
                <div key={item.labelKey} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-foreground/[0.06] bg-foreground/[0.02]">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all duration-300 ${complete || showFull ? "border-emerald-500/50 bg-emerald-500/15" : "border-foreground/10 bg-foreground/[0.02]"}`}>
                    {(complete || showFull) && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="rgb(16,185,129)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="font-mono text-xs text-foreground/70">
                    {typed}
                    <Cursor visible={showCur} />
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Learn More + Download E-Book Buttons */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
        <Link
          href="/strategy?step=1"
          className="flex items-center justify-center w-[220px] h-14 rounded-lg border border-foreground/20 bg-foreground/[0.05] font-mono text-sm font-medium tracking-[0.1em] text-foreground/70 hover:text-accent hover:border-accent/40 hover:bg-accent/[0.06] hover:shadow-[0_0_24px_rgba(255,140,50,0.08)] transition-all duration-300"
        >
          {translations.strategy.learnMore[lang] ?? translations.strategy.learnMore.en}
        </Link>
        <button
          type="button"
          onClick={() => setEbookModalOpen(true)}
          className="flex items-center justify-center gap-2 w-[220px] h-14 rounded-lg font-mono text-sm font-medium tracking-[0.1em] cursor-pointer transition-all duration-300"
          style={{
            background: "rgba(0, 170, 255, 0.2)",
            border: "1px solid rgba(0, 170, 255, 0.4)",
            color: "#4FC3F7",
            boxShadow: "0 0 10px rgba(0, 170, 255, 0.3), 0 0 20px rgba(0, 170, 255, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 170, 255, 0.35)"
            e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 170, 255, 0.4), 0 0 30px rgba(0, 170, 255, 0.3)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 170, 255, 0.2)"
            e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 170, 255, 0.3), 0 0 20px rgba(0, 170, 255, 0.2)"
          }}
        >
          <Download className="w-4 h-4" />
          {translations.strategyUI?.ebookDownloadBtn?.[lang] ?? "Download E-Book"}
        </button>
      </div>

      {/* E-Book Download Modal */}
      <EbookDownloadModal 
        isOpen={ebookModalOpen} 
        onClose={() => setEbookModalOpen(false)} 
      />
    </section>
  )
}
