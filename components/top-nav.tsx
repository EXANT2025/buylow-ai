"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown, Download } from "lucide-react"
import { AnimatedBorderButton } from "@/components/animated-border-button"
import { useLanguage } from "@/lib/language-context"
import { translations, type SupportedLang } from "@/lib/i18n"
import { EbookDownloadModal } from "@/components/ebook-download-modal"

const LANGUAGES: { code: SupportedLang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "ko", label: "KR", flag: "🇰🇷" },
  { code: "ar", label: "AR", flag: "🇸🇦" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "zh", label: "ZH", flag: "🇨🇳" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "id", label: "ID", flag: "🇮🇩" },
  { code: "th", label: "TH", flag: "🇹🇭" },
  { code: "vi", label: "VI", flag: "🇻🇳" },
  { code: "tr", label: "TR", flag: "🇹🇷" },
]

export function TopNav() {
  const { lang, setLang } = useLanguage()
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false)
  const [ebookModalOpen, setEbookModalOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null)

  // Get translated nav items with fallback to English
  const navItems = [
    { id: "signals", label: translations.nav.partners[lang] ?? translations.nav.partners.en },
    { id: "work", label: translations.nav.markets[lang] ?? translations.nav.markets.en },
    { id: "strategy", label: translations.nav.strategy[lang] ?? translations.nav.strategy.en },
    { id: "demo", label: translations.nav.demo[lang] ?? translations.nav.demo.en },
  ]

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false)
      }
      if (mobileLangDropdownRef.current && !mobileLangDropdownRef.current.contains(e.target as Node)) {
        setMobileLangDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation - Premium Pill Header */}
      <header
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block transition-all duration-300 rounded-full border border-foreground/10 w-[min(85%,1200px)]",
          scrolled
            ? "bg-background/85 backdrop-blur-xl shadow-2xl"
            : "bg-background/60 backdrop-blur-lg"
        )}
      >
        <div className="flex items-center justify-between px-8 py-3">
          {/* Logo Area */}
          <button 
            onClick={() => scrollToSection("hero")}
            className="flex items-center"
          >
            <img
              src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/buylow_ai_logo.png"
              alt="Buylow AI Logo"
              className="h-12 w-auto object-contain"
            />
          </button>

          {/* Nav Links - Bold & Confident */}
          <nav className="flex items-center gap-2">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={cn(
                  "relative px-5 py-2 font-sans text-[14px] font-semibold uppercase tracking-[0.14em] transition-all duration-200",
                  activeSection === id
                    ? "text-accent"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {label}
                {activeSection === id && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-accent rounded-full" />
                )}
              </button>
            ))}
            
            {/* CTA Button */}
            <AnimatedBorderButton className="ml-6">
              <button
                type="button"
                onClick={() => { window.location.href = "/server?step=1" }}
                className="px-6 py-2 rounded-full bg-accent text-background font-mono text-[13px] font-medium tracking-[0.1em] hover:bg-accent/90 transition-all duration-200 cursor-pointer"
              >
                Start Ai
              </button>
            </AnimatedBorderButton>

            {/* Download E-Book Button - Desktop */}
            <AnimatedBorderButton className="ml-3">
              <button
                type="button"
                onClick={() => setEbookModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground font-mono text-[12px] font-medium tracking-[0.08em] hover:bg-foreground/10 hover:border-foreground/20 transition-all duration-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                E-Book
              </button>
            </AnimatedBorderButton>

            {/* Language Dropdown - Desktop */}
            <div ref={langDropdownRef} className="relative ml-4">
              <AnimatedBorderButton>
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-white/90 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-sm">{LANGUAGES.find(l => l.code === lang)?.flag}</span>
                  <span className="font-mono text-[12px] text-background tracking-wide font-medium">{LANGUAGES.find(l => l.code === lang)?.label}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-background/60 transition-transform duration-200", langDropdownOpen && "rotate-180")} />
                </button>
              </AnimatedBorderButton>
              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 rounded-xl border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => { setLang(l.code); setLangDropdownOpen(false) }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-2.5 font-mono text-[12px] tracking-wide transition-all duration-150 cursor-pointer",
                        lang === l.code
                          ? "bg-accent/15 text-accent"
                          : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                      )}
                    >
                      <span className="text-sm">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Header */}
      <header
        className={cn(
          "fixed top-4 left-4 right-4 z-50 md:hidden transition-all duration-300 rounded-2xl border border-foreground/10",
          scrolled
            ? "bg-background/85 backdrop-blur-xl shadow-2xl"
            : "bg-background/60 backdrop-blur-lg"
        )}
      >
        <div className="flex items-center justify-between px-4 py-1.5">
          {/* Logo Area - Mobile */}
          <button 
            onClick={() => scrollToSection("hero")}
            className="flex items-center"
          >
            <img
              src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/buylow_ai_logo.png"
              alt="Buylow AI Logo"
              className="h-9 w-auto object-contain"
            />
          </button>

          <div className="flex items-center gap-2">
            {/* Language Dropdown - Mobile */}
            <div ref={mobileLangDropdownRef} className="relative">
              <AnimatedBorderButton>
                <button
                  type="button"
                  onClick={() => setMobileLangDropdownOpen(!mobileLangDropdownOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white hover:bg-white/90 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-sm">{LANGUAGES.find(l => l.code === lang)?.flag}</span>
                  <span className="font-mono text-[11px] text-background tracking-wide font-medium">{LANGUAGES.find(l => l.code === lang)?.label}</span>
                  <ChevronDown className={cn("w-3 h-3 text-background/60 transition-transform duration-200", mobileLangDropdownOpen && "rotate-180")} />
                </button>
              </AnimatedBorderButton>
              {mobileLangDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 rounded-xl border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => { setLang(l.code); setMobileLangDropdownOpen(false) }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 font-mono text-[11px] tracking-wide transition-all duration-150 cursor-pointer",
                        lang === l.code
                          ? "bg-accent/15 text-accent"
                          : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                      )}
                    >
                      <span className="text-sm">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2.5 rounded-xl border border-foreground/10 transition-all duration-200",
                mobileMenuOpen
                  ? "bg-accent text-background"
                  : "bg-foreground/5 text-foreground"
              )}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/98 backdrop-blur-xl md:hidden transition-all duration-300",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={cn(
                "font-mono text-2xl uppercase tracking-[0.2em] transition-all duration-200",
                activeSection === id
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
          
          {/* Mobile CTA */}
          <button
            type="button"
            onClick={() => { setMobileMenuOpen(false); window.location.href = "/server?step=1" }}
            className="mt-4 px-8 py-4 rounded-xl bg-accent text-background font-mono text-lg tracking-[0.15em] hover:bg-accent/90 transition-all duration-200 cursor-pointer"
          >
            Start Ai
          </button>
        </div>
      </div>

      {/* E-Book Download Modal */}
      <EbookDownloadModal 
        isOpen={ebookModalOpen} 
        onClose={() => setEbookModalOpen(false)} 
      />
    </>
  )
}
