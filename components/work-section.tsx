"use client"

import { useState, useRef, useEffect } from "react"
import { SectionOverlay } from "@/components/section-overlay"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const experiments = [
  {
    title: "GOLD",
    symbol: "XAU/SYMBOL",
    watermark: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/gold_symbol.png",
    medium: "Commodities",
    description: "Structural framework for adaptive layouts in dynamic content systems.",
    span: "col-span-2 row-span-2",
  },
  {
    title: "BITCOIN",
    symbol: "BTC/SYMBOL",
    watermark: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/btc_symbol.png",
    medium: "Crypto",
    description: "Autonomous coordination layer for multi-agent environments.",
    span: "col-span-1 row-span-1",
  },
  {
    title: "NASDAQ\n100",
    symbol: "NDX/SYMBOL",
    watermark: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/spysymbol.png",
    medium: "Index",
    description: "",
    span: "col-span-1 row-span-2",
  },
  {
    title: "TESLA",
    symbol: "TSLA/SYMBOL",
    watermark: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/tsla_symbol.png",
    medium: "Nasdaq",
    description: "",
    span: "col-span-1 row-span-1",
  },
  {
    title: "S&P 500",
    symbol: "SPY/SYMBOL",
    watermark: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/spysymbol.png",
    medium: "Index",
    description: "",
    span: "col-span-2 row-span-1",
  },
  {
    title: "NVIDIA",
    symbol: "NVDA/SYMBOL",
    watermark: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/nvidia_symbol.png",
    medium: "Nasdaq",
    description: "",
    span: "col-span-2 md:col-span-1 row-span-1",
  },
  {
    title: "SILVER",
    symbol: "XAG/SYMBOL",
    watermark: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/silver_symbol.png",
    medium: "Commodities",
    description: "",
    span: "col-span-1 row-span-1",
  },
]

export function WorkSection() {
  const { lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Translate medium labels with fallback to English
  const getMediumLabel = (medium: string) => {
    switch (medium) {
      case "Commodities": return translations.markets.commodities[lang] ?? translations.markets.commodities.en
      case "Crypto": return translations.markets.crypto[lang] ?? translations.markets.crypto.en
      case "Index": return translations.markets.index[lang] ?? translations.markets.index.en
      case "Nasdaq": return translations.markets.nasdaq[lang] ?? translations.markets.nasdaq.en
      default: return medium
    }
  }

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in from left
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gridRef.current?.querySelectorAll("article")
      if (cards && cards.length > 0) {
        gsap.set(cards, { y: 60, opacity: 0 })
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 overflow-hidden">
      <SectionOverlay />
      {/* Section header */}
      <div ref={headerRef} className="relative z-20 mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{translations.markets.sectionLabel[lang] ?? translations.markets.sectionLabel.en}</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">{translations.markets.heading[lang] ?? translations.markets.heading.en}</h2>
      </div>

      {/* Asymmetric grid */}
      <div
        ref={gridRef}
        className="relative z-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[200px]"
      >
        {experiments.map((experiment, index) => (
          <WorkCard key={index} experiment={experiment} index={index} persistHover={index === 0} getMediumLabel={getMediumLabel} />
        ))}
      </div>
    </section>
  )
}

function WorkCard({
  experiment,
  index,
  persistHover = false,
  getMediumLabel,
}: {
  experiment: {
    title: string
    symbol: string
    watermark: string
    medium: string
    description: string
    span: string
  }
  index: number
  persistHover?: boolean
  getMediumLabel: (medium: string) => string
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const [isScrollActive, setIsScrollActive] = useState(false)

  useEffect(() => {
    if (!persistHover || !cardRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 80%",
        onEnter: () => setIsScrollActive(true),
      })
    }, cardRef)

    return () => ctx.revert()
  }, [persistHover])

  const isActive = isHovered || isScrollActive

  return (
    <article
      ref={cardRef}
      className={cn(
        "group relative border border-foreground/55 p-5 flex flex-col justify-between transition-all duration-500 cursor-pointer overflow-hidden",
        experiment.span,
        isActive && "border-accent/60",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background layer */}
      <div
        className={cn(
          "absolute inset-0 bg-accent/5 transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Centered logo watermark */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <img
          src={experiment.watermark || "/placeholder.svg"}
          alt=""
          className="w-[70%] h-[70%] object-contain opacity-[0.15]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {getMediumLabel(experiment.medium)}
        </span>
        <h3
          className={cn(
            "mt-3 font-[var(--font-bebas)] text-[2rem] md:text-[3.5rem] tracking-tight transition-colors duration-300 leading-none -ml-[0.03em] md:ml-0 whitespace-pre-line",
            isActive ? "text-accent" : "text-foreground",
          )}
        >
          {experiment.title}
        </h3>
        <span className="mt-1 block font-mono text-xs md:text-sm tracking-widest text-foreground/75">
          {experiment.symbol}
        </span>
      </div>

      {/* Index marker */}
      <span
        className={cn(
          "absolute bottom-4 right-4 font-mono text-[10px] transition-colors duration-300",
          isActive ? "text-accent" : "text-muted-foreground/40",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Corner line */}
      <div
        className={cn(
          "absolute top-0 right-0 w-12 h-12 transition-all duration-500",
          isActive ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
      </div>
    </article>
  )
}
