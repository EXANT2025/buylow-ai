"use client"

import { useEffect, useState } from "react"
import { AnimatedBorderButton } from "./animated-border-button"

// Export utilities for reuse in other components
export function getMonthEnd(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
}

export function calcTimeLeft(end: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

export function pad(n: number): string {
  return n.toString().padStart(2, "0")
}

// Custom hook for countdown timer
export function useCountdown() {
  const [mounted, setMounted] = useState(false)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = getMonthEnd()
    setEndDate(target)
    setTimeLeft(calcTimeLeft(target))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!endDate) return

    const tick = () => {
      const now = new Date()
      let target = endDate

      if (now.getTime() > target.getTime()) {
        target = getMonthEnd()
        setEndDate(target)
      }

      setTimeLeft(calcTimeLeft(target))
    }

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [endDate])

  return { mounted, timeLeft }
}

// Inline countdown display for embedding in other components
export function InlineCountdown() {
  const { mounted, timeLeft } = useCountdown()

  if (!mounted) return null

  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <span
        className="font-mono text-[11px] md:text-xs text-white/60 tracking-[0.15em] uppercase"
      >
        FREE STRAT END LINE
      </span>
      <div className="flex items-center gap-2 md:gap-3">
        <InlineTimeBlock value={timeLeft.days} label="DAYS" />
        <InlineSeparator />
        <InlineTimeBlock value={timeLeft.hours} label="HRS" />
        <InlineSeparator />
        <InlineTimeBlock value={timeLeft.minutes} label="MIN" />
        <InlineSeparator />
        <InlineTimeBlock value={timeLeft.seconds} label="SEC" />
      </div>
    </div>
  )
}

function InlineTimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span 
        className="font-mono text-xl md:text-2xl font-bold text-accent tabular-nums"
        suppressHydrationWarning
      >
        {pad(value)}
      </span>
      <span className="font-mono text-[8px] md:text-[10px] text-white/40 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

function InlineSeparator() {
  return <span className="text-white/20 text-lg md:text-xl font-light">:</span>
}

export function CountdownBanner() {
  // Use null initial state to avoid hydration mismatch (Date.now() differs server vs client)
  const [mounted, setMounted] = useState(false)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Initialize on client only
    const target = getMonthEnd()
    setEndDate(target)
    setTimeLeft(calcTimeLeft(target))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!endDate) return

    const tick = () => {
      const now = new Date()
      let target = endDate

      // If we've passed the end date, recalculate for next month
      if (now.getTime() > target.getTime()) {
        target = getMonthEnd()
        setEndDate(target)
      }

      setTimeLeft(calcTimeLeft(target))
    }

    const interval = setInterval(tick, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Desktop countdown bar - fixed at bottom of viewport */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden md:block rounded-full border border-foreground/10 w-[min(60%,750px)] bg-background/85 backdrop-blur-xl shadow-2xl"
      >
        <div className="grid grid-cols-3 items-center px-4 py-1.5">
          {/* Left text */}
          <span
            className="font-mono text-[15px] text-white tracking-[0.1em] uppercase font-bold justify-self-start"
            style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
          >
            FREE STRAT END LINE
          </span>

          {/* Countdown blocks - centered */}
          <div className="flex items-center gap-3 justify-self-center">
            <TimeBlock value={timeLeft.days} label="DAYS" />
            <Separator />
            <TimeBlock value={timeLeft.hours} label="HRS" />
            <Separator />
            <TimeBlock value={timeLeft.minutes} label="MIN" />
            <Separator />
            <TimeBlock value={timeLeft.seconds} label="SEC" />
          </div>

          {/* Right CTA - Start AI button */}
          <div className="justify-self-end">
            <AnimatedBorderButton className="!p-[1px]">
              <button
                type="button"
                onClick={() => { window.location.href = "/server?step=1" }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest text-background transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                  boxShadow: "0 0 15px rgba(249, 115, 22, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3)",
                }}
              >
                Start Ai
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="opacity-80">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </AnimatedBorderButton>
          </div>
        </div>
      </div>

      {/* Mobile countdown bar - fixed at bottom with safe area inset */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden rounded-2xl border border-foreground/10 w-[92%] max-w-[340px] bg-background/85 backdrop-blur-xl shadow-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex flex-col gap-2 px-3 py-2.5">
          {/* Row 1: Label + Timer */}
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[10px] text-white tracking-[0.08em] uppercase font-bold"
              style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.25)" }}
            >
              FREE START END
            </span>
            <div className="flex items-center gap-1.5">
              <TimeBlockMobile value={timeLeft.days} label="D" />
              <SeparatorMobile />
              <TimeBlockMobile value={timeLeft.hours} label="H" />
              <SeparatorMobile />
              <TimeBlockMobile value={timeLeft.minutes} label="M" />
              <SeparatorMobile />
              <TimeBlockMobile value={timeLeft.seconds} label="S" />
            </div>
          </div>

          {/* Row 2: Start Ai button - full width */}
          <AnimatedBorderButton className="w-full !p-[1px]">
            <button
              type="button"
              onClick={() => { window.location.href = "/server?step=1" }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider text-background transition-all duration-300 hover:scale-[1.01] cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                boxShadow: "0 0 12px rgba(249, 115, 22, 0.3), 0 2px 6px rgba(0, 0, 0, 0.3)",
              }}
            >
              Start Ai
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="opacity-80">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </AnimatedBorderButton>
        </div>
      </div>
    </>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-sm sm:text-lg font-semibold text-accent tabular-nums" suppressHydrationWarning>
        {pad(value)}
      </span>
      <span className="font-mono text-[8px] sm:text-[10px] text-foreground/50 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return <span className="text-foreground/30 text-sm">:</span>
}

function TimeBlockMobile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-0.5">
      <span className="font-mono text-[11px] font-semibold text-accent tabular-nums" suppressHydrationWarning>
        {pad(value)}
      </span>
      <span className="font-mono text-[8px] text-foreground/50 uppercase">
        {label}
      </span>
    </div>
  )
}

function SeparatorMobile() {
  return <span className="text-foreground/30 text-[10px]">:</span>
}
