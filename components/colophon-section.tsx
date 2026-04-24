"use client"

import { useRef, useEffect } from "react"
import { AnimatedBorderButton } from "@/components/animated-border-button"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ColophonSection() {
  const { lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      const els = contentRef.current!.querySelectorAll("[data-animate]")
      // Reset elements to visible state first, then animate
      gsap.set(els, { y: 0, opacity: 1 })
      gsap.from(els, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [lang]) // Re-run animation when language changes

  return (
    <section
      ref={sectionRef}
      id="colophon"
      className="relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden pb-28 md:pb-0"
    >
      {/* Subtle top gradient glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div ref={contentRef} className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
        <h2
          data-animate
          className="font-[var(--font-bebas)] text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground leading-none"
        >
          {translations.colophon.heading[lang] ?? translations.colophon.heading.en}
        </h2>

        <p
          data-animate
          className="mt-4 md:mt-8 font-mono text-sm md:text-base text-foreground/50 leading-relaxed max-w-lg whitespace-pre-line"
        >
          {translations.colophon.description[lang] ?? translations.colophon.description.en}
        </p>

        {/* CTA button - NOT data-animate to prevent GSAP from hiding it */}
        <div className="relative z-30 mt-4 md:mt-8">
          <AnimatedBorderButton>
            <button
              type="button"
              onClick={() => { window.location.href = "/server?step=1" }}
              className="inline-flex items-center gap-3 md:gap-4 px-8 md:px-14 py-3.5 md:py-6 rounded-full font-mono text-sm md:text-lg uppercase tracking-widest text-background transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                boxShadow: "0 0 30px rgba(249, 115, 22, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
                opacity: 1,
                visibility: "visible",
              }}
            >
              Start Ai
            </button>
          </AnimatedBorderButton>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="font-mono text-[10px] text-foreground/25 uppercase tracking-widest">
          &copy; 2025 BuyLow AI. All rights reserved.
        </p>
      </div>
    </section>
  )
}
