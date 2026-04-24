"use client"

import { useEffect, useRef } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { AnimatedBorderButton } from "@/components/animated-border-button"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import { useMarketerContext } from "@/lib/marketer-context"
import { supabase } from "@/lib/supabase"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const { lang } = useLanguage()
  const { marketerId, isFromProof } = useMarketerContext()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Track Start AI click - only track if coming from proof page
  const handleStartAiClick = async () => {
    if (marketerId && isFromProof) {
      try {
        await supabase.rpc("increment_buylow_start_ai", { mid: marketerId })
      } catch (error) {
        console.error("Failed to track Start AI click:", error)
      }
    }
    window.location.href = "/server?step=1"
  }

  // Track Telegram click - only track if coming from proof page
  const handleTelegramClick = async () => {
    if (marketerId && isFromProof) {
      try {
        await supabase.rpc("increment_buylow_telegram", { mid: marketerId })
      } catch (error) {
        console.error("Failed to track Telegram click:", error)
      }
    }
    window.open("https://t.me/addlist/iDor86zShwo5MzU1", "_blank", "noopener,noreferrer")
  }

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12 pt-28 md:pt-32">
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical labels */}
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          SIGNAL
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full">
        <SplitFlapAudioProvider>
          <SplitFlapText text="BUYLOW-AI" speed={80} />
        </SplitFlapAudioProvider>

        <h2 className="font-[var(--font-bebas)] text-foreground/90 text-[clamp(1rem,3vw,2rem)] mt-4 tracking-wide">
          {translations.hero.subtitle[lang] ?? translations.hero.subtitle.en}
        </h2>

        <p className="mt-12 max-w-md font-mono text-sm text-foreground/70 leading-relaxed">
          {translations.hero.description[lang] ?? translations.hero.description.en}
        </p>

        <div className="mt-16 flex items-center gap-4 md:gap-8">
          {/* Primary CTA - START AI */}
          <AnimatedBorderButton>
            <button
              type="button"
              onClick={handleStartAiClick}
              className="group inline-flex items-center gap-3 md:gap-4 px-8 md:px-14 py-3.5 md:py-6 rounded-full font-mono text-sm md:text-lg uppercase tracking-widest text-background transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                boxShadow: "0 0 30px rgba(249, 115, 22, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
              }}
            >
              <ScrambleTextOnHover text="Start Ai" as="span" duration={0.6} />
              <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45 md:w-5 md:h-5" />
            </button>
          </AnimatedBorderButton>
          {/* Secondary CTA - JOIN TELEGRAM (Glass + Neon Glow) */}
          <AnimatedBorderButton>
            <button
              type="button"
              onClick={handleTelegramClick}
              className="inline-flex items-center gap-2.5 px-8 md:px-14 py-3.5 md:py-6 rounded-full font-mono text-sm md:text-lg tracking-widest text-gray-900 border border-white/30 cursor-pointer transition-all duration-[250ms] ease-out hover:-translate-y-0.5"
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(0,255,200,0.25), 0 0 40px rgba(0,255,200,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)"
                e.currentTarget.style.boxShadow = "0 0 15px rgba(255,255,255,0.4), 0 0 30px rgba(0,255,200,0.4), 0 0 60px rgba(0,255,200,0.25)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)"
                e.currentTarget.style.boxShadow = "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(0,255,200,0.25), 0 0 40px rgba(0,255,200,0.15)"
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-gray-900">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              {translations.hero.joinTelegram[lang] ?? translations.hero.joinTelegram.en}
            </button>
          </AnimatedBorderButton>
        </div>
      </div>

    </section>
  )
}
