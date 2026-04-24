"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { SectionOverlay } from "@/components/section-overlay"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const DESPREAD = { src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/despread_logo.png", alt: "DeSpread", width: 180, height: 56 }
const EDGEX = { src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/edgex_logo2.png", alt: "EdgeX", width: 180, height: 56 }
const GATE = { src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/gate_logo.png", alt: "Gate", width: 180, height: 56 }
const HYPERLIQUID = { src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/hyperliquid_logo.png", alt: "Hyperliquid", width: 180, height: 56 }
const OKX = { src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_logo.png", alt: "OKX", width: 180, height: 56 }

const logosColumnA = [
  GATE,
  DESPREAD,
  OKX,
  EDGEX,
  HYPERLIQUID,
]

const logosColumnB = [
  GATE,
  DESPREAD,
  OKX,
  EDGEX,
  HYPERLIQUID,
]

function ScrollColumn({
  logos,
  duration,
}: {
  logos: { src: string; alt: string; width?: number; height?: number }[]
  duration: number
}) {
  const columnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = columnRef.current
    if (!el) return

    // Duplicate content height = height of one set of logos
    const firstSet = el.children[0] as HTMLElement
    if (!firstSet) return

    const totalHeight = firstSet.offsetHeight

    const tween = gsap.to(el, {
      y: -totalHeight,
      duration,
      ease: "none",
      repeat: -1,
      modifiers: {
        y: gsap.utils.unitize((y) => {
          return parseFloat(y) % totalHeight
        }),
      },
    })

    return () => {
      tween.kill()
    }
  }, [duration])

  const logoSet = (
    <div className="flex flex-col items-center gap-12 lg:gap-16 py-8">
      {logos.map((logo, i) => (
        <div key={i} className="flex items-center justify-center w-full px-6 lg:px-0">
          <img
            src={logo.src || "/placeholder.svg"}
            alt={logo.alt}
            width={logo.width ?? 180}
            height={logo.height ?? 56}
            className="w-[70vw] max-w-[280px] lg:w-auto lg:max-w-[180px] h-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )

  return (
    <div
      className="overflow-hidden h-[450px] lg:h-[600px] relative"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      {/* Scrolling content: two copies for seamless loop */}
      <div ref={columnRef} className="flex flex-col">
        {logoSet}
        {logoSet}
      </div>
    </div>
  )
}

export function SignalsSection() {
  const { lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const logosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !logosRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      gsap.fromTo(
        logosRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: logosRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="signals"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-16 lg:px-28 overflow-hidden"
    >
      <SectionOverlay />

      <div className="relative z-20 flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
        {/* Left side: Heading */}
        <div ref={headingRef} className="lg:w-1/2 lg:sticky lg:top-32 flex flex-col gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {translations.partners.sectionLabel[lang] ?? translations.partners.sectionLabel.en}
          </span>
          <h2 className="font-[var(--font-bebas)] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-foreground">
            {translations.partners.heading1[lang] ?? translations.partners.heading1.en}
            <br />
            {translations.partners.heading2[lang] ?? translations.partners.heading2.en}
            <br />
            <span className="text-accent">{translations.partners.heading3[lang] ?? translations.partners.heading3.en}</span>
          </h2>
          <p className="max-w-sm font-mono text-sm text-foreground/50 leading-relaxed">
            {translations.partners.description[lang] ?? translations.partners.description.en}
          </p>
        </div>

        {/* Right side: Scrolling logo columns - 1 col mobile, 2 col desktop */}
        <div ref={logosRef} className="lg:w-[55%] flex flex-col items-center w-full gap-10">
          {/* Mobile: single merged column */}
          <div className="block lg:hidden w-full">
            <ScrollColumn logos={[...logosColumnA, ...logosColumnB]} duration={24} />
          </div>
          {/* Desktop: two columns side by side */}
          <div className="hidden lg:flex gap-20">
            <ScrollColumn logos={logosColumnA} duration={20} />
            <ScrollColumn logos={logosColumnB} duration={26} />
          </div>

          {/* View More button — centered below logos */}
          <Link
            href="/partners"
            className="flex items-center justify-center w-[240px] h-14 rounded-lg border border-white/25 bg-white/10 font-mono text-sm font-medium tracking-[0.1em] text-white hover:bg-white/15 hover:border-white/45 hover:shadow-[0_0_24px_rgba(255,255,255,0.06)] transition-all duration-200"
          >
            {translations.partners.viewMore[lang] ?? translations.partners.viewMore.en}
          </Link>
        </div>
      </div>
    </section>
  )
}
