"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { t, translations } from "@/lib/i18n"
import { LanguageDropdown } from "@/components/language-dropdown"
import { InlineCountdown } from "@/components/countdown-banner"
import { supabase } from "@/lib/supabase"
import { SERVER_LINK_MAP } from "@/data/server/link-map"
import { DEFAULT_LINKS } from "@/data/server/link-slots"

// Text formatting utility - applies line breaks for readability
function formatParagraphText(text: string): React.ReactNode {
  const lines = text.split('\n')
  return lines.map((line, lineIdx) => (
    <span key={lineIdx}>
      {line}
      {lineIdx < lines.length - 1 && <br />}
    </span>
  ))
}

// Formatted paragraph component for body text
function FormattedParagraph({
  children,
  className = ""
}: {
  children: string
  className?: string
}) {
  return (
    <p className={`text-white/70 text-lg leading-relaxed mb-6 ${className}`}>
      {formatParagraphText(children)}
    </p>
  )
}

// Single image component
function ProofImage({
  src,
  alt,
  caption
}: {
  src: string
  alt: string
  caption?: string
}) {
  return (
    <figure className="my-8 md:my-12">
      <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto block"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-white/40 text-center font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Two column image layout
function TwoColumnImages({
  leftSrc,
  leftAlt,
  leftCaption,
  rightSrc,
  rightAlt,
  rightCaption,
}: {
  leftSrc: string
  leftAlt: string
  leftCaption?: string
  rightSrc: string
  rightAlt: string
  rightCaption?: string
}) {
  return (
    <div className="my-8 md:my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 items-stretch">
        <figure className="flex flex-col">
          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leftSrc}
              alt={leftAlt}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          {leftCaption && (
            <figcaption className="mt-3 text-sm text-white/40 text-center font-mono">
              {leftCaption}
            </figcaption>
          )}
        </figure>
        <figure className="flex flex-col">
          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rightSrc}
              alt={rightAlt}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          {rightCaption && (
            <figcaption className="mt-3 text-sm text-white/40 text-center font-mono">
              {rightCaption}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  )
}

// Stats highlight component
function StatHighlight({
  value,
  label,
  accent = false
}: {
  value: string
  label: string
  accent?: boolean
}) {
  return (
    <div className={`p-4 md:p-6 border ${accent ? 'border-accent/30 bg-accent/5' : 'border-white/10 bg-white/[0.02]'}`}>
      <div className={`text-2xl md:text-3xl font-bold font-mono ${accent ? 'text-accent' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-sm text-white/50 mt-1">{label}</div>
    </div>
  )
}

// Section divider
function SectionDivider() {
  return (
    <div className="my-12 md:my-16 flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

// Quote block
function QuoteBlock({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-8 md:my-12 pl-6 border-l-2 border-accent/50 text-white/70 text-lg md:text-xl italic">
      {children}
    </blockquote>
  )
}

export default function ProofPageWithId({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { lang, setLang } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Track proof page view on mount
  useEffect(() => {
    setMounted(true)
    
    // Set default language to Korean for proof pages if no saved preference
    try {
      const savedLang = localStorage.getItem("buylow.lang")
      if (!savedLang) {
        setLang("ko")
      }
    } catch {
      // localStorage not available, set to Korean anyway
      setLang("ko")
    }
    
    // Call RPC to increment proof view count
    const trackProofView = async () => {
      try {
        await supabase.rpc("increment_buylow_proof_view", { mid: id })
      } catch (error) {
        console.error("Failed to track proof view:", error)
      }
    }
    
    trackProofView()
  }, [id, setLang])

  // Handle CTA click - track and redirect to /{id}?src=proof
  const handleCtaClick = async () => {
    try {
      await supabase.rpc("increment_buylow_cta", { mid: id })
    } catch (error) {
      console.error("Failed to track CTA click:", error)
    }
    router.push(`/${id}?src=proof`)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link
            href={`/${id}`}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-mono">HOME</span>
          </Link>
          <LanguageDropdown lang={lang} onChangeLang={setLang} />
        </div>
      </header>

      {/* Article Content */}
      <article className="pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Hero Section */}
          <header className="mb-12 md:mb-16">
            <div className="flex items-center gap-2 text-accent text-sm font-mono mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>{t(translations.proof.tagline, lang)}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
              {t(translations.proof.heroTitle, lang)}
            </h1>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              {t(translations.proof.heroSubtitle, lang)}
            </p>
          </header>

          {/* Monthly Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
            <StatHighlight value="130" label={t(translations.proof.takeProfits, lang)} />
            <StatHighlight value="34" label={t(translations.proof.stopLosses, lang)} />
            <StatHighlight value="+20,223" label="USDT" accent />
            <StatHighlight value="79%" label={t(translations.proof.winRate, lang)} />
          </div>

          {/* Image 1: Hero Image */}
          <ProofImage
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/1.png"
            alt="AI Trading Results"
            caption={t(translations.proof.heroCaption, lang)}
          />

          <SectionDivider />

          {/* Section 1: AI Revolution */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t(translations.proof.section1Title, lang)}
            </h2>

            <div className="prose prose-invert max-w-none">
              <FormattedParagraph>
                {t(translations.proof.section1Text1, lang)}
              </FormattedParagraph>

              <ProofImage
                src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/2.png"
                alt="AI Setup"
                caption={t(translations.proof.aiSetupCaption, lang)}
              />

              <FormattedParagraph>
                {t(translations.proof.section1Text2, lang)}
              </FormattedParagraph>

              <QuoteBlock>
                {t(translations.proof.section1Quote, lang)}
              </QuoteBlock>
            </div>
          </section>

          <SectionDivider />

          {/* Section 2: Proof */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t(translations.proof.section2Title, lang)}
            </h2>

            <FormattedParagraph className="mb-8">
              {t(translations.proof.section2Text1, lang)}
            </FormattedParagraph>

            <TwoColumnImages
              leftSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/3.png"
              leftAlt="Daily PNL 1"
              leftCaption={t(translations.proof.tradeCaption1, lang)}
              rightSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/4.png"
              rightAlt="Daily PNL 2"
              rightCaption={t(translations.proof.tradeCaption2, lang)}
            />

            <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 my-8">
              <p className="text-white/70 text-lg leading-relaxed">
                {formatParagraphText(t(translations.proof.section2Text2, lang))}
              </p>
            </div>
          </section>

          <SectionDivider />

          {/* Section 3: RWA Expansion */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t(translations.proof.section3Title, lang)}
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/[0.03] border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/spysymbol.png"
                      alt="SPY"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold">S&P 500 (SPY)</div>
                    <div className="text-sm text-white/50">{t(translations.proof.coreFinancial, lang)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/gold_symbol.png"
                      alt="XAU"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold">Gold (XAU)</div>
                    <div className="text-sm text-white/50">{t(translations.proof.safeHaven, lang)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/btc_symbol.png"
                      alt="BTC"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold">Bitcoin (BTC)</div>
                    <div className="text-sm text-white/50">{t(translations.proof.digitalAsset, lang)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/spysymbol.png"
                      alt="QQQ"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold">NASDAQ 100 (QQQ)</div>
                    <div className="text-sm text-white/50">{t(translations.proof.nasdaqIndex, lang)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-playing chart videos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <figure>
                <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden">
                  <video
                    src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/QQQ_Chart.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto block"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-white/40 text-center font-mono">
                  {t(translations.proof.qqqChartCaption, lang)}
                </figcaption>
              </figure>
              <figure>
                <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden">
                  <video
                    src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/XAU_Chart.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto block"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-white/40 text-center font-mono">
                  {t(translations.proof.xauChartCaption, lang)}
                </figcaption>
              </figure>
            </div>

            <FormattedParagraph>
              {t(translations.proof.section3Text, lang)}
            </FormattedParagraph>
          </section>

          <SectionDivider />

          {/* Section 4: Trading Strategy */}
          <section>
            <div className="bg-accent/5 border border-accent/20 p-6 md:p-8 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t(translations.proof.section4Title, lang)}
              </h2>
              <p className="text-white/70">
                {formatParagraphText(t(translations.proof.section4Intro, lang))}
              </p>
            </div>

            <TwoColumnImages
              leftSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/9.png"
              leftAlt="Trading History 1"
              leftCaption={t(translations.proof.tradeCaption1, lang)}
              rightSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/10.png"
              rightAlt="Trading History 2"
              rightCaption={t(translations.proof.tradeCaption2, lang)}
            />

            <FormattedParagraph>
              {t(translations.proof.section4Text1, lang)}
            </FormattedParagraph>

            <ProofImage
              src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/12.png"
              alt="One-way Market"
              caption={t(translations.proof.onewayCaption, lang)}
            />

            <FormattedParagraph>
              {t(translations.proof.section4Text2, lang)}
            </FormattedParagraph>
          </section>

          <SectionDivider />

          {/* Section 5: 2026 Results */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t(translations.proof.section5Title, lang)}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
              <StatHighlight value="124" label={t(translations.proof.totalBuys, lang)} />
              <StatHighlight value="91%" label={t(translations.proof.winRate, lang)} accent />
              <StatHighlight value="+24,235" label="USDT" />
            </div>

            <ProofImage
              src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/16.png"
              alt="2026 Results"
              caption={t(translations.proof.results2026Caption, lang)}
            />

            <FormattedParagraph>
              {t(translations.proof.section5Text, lang)}
            </FormattedParagraph>
          </section>

          <SectionDivider />

          {/* Section 6: No Emotions */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t(translations.proof.section6Title, lang)}
            </h2>

            <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 mb-8">
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                {formatParagraphText(t(translations.proof.section6Text1, lang))}
              </p>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                {formatParagraphText(t(translations.proof.section6Text2, lang))}
              </p>
              <p className="text-accent font-medium text-lg">
                {formatParagraphText(t(translations.proof.section6Highlight, lang))}
              </p>
            </div>
          </section>

          <SectionDivider />

          {/* Section 7: How to Use */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t(translations.proof.section7Title, lang)}
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4 p-4 bg-white/[0.03] border border-white/10">
                <div className="w-8 h-8 bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="text-white/70">
                    {formatParagraphText(t(translations.proof.step1, lang))}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white/[0.03] border border-white/10">
                <div className="w-8 h-8 bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="text-white/70">
                    {formatParagraphText(t(translations.proof.step2, lang))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/30 p-6 mb-8">
              <p className="text-rose-400 font-medium mb-2">
                {t(translations.proof.warningTitle, lang)}
              </p>
              <p className="text-white/60">
                {formatParagraphText(t(translations.proof.warningText, lang))}
              </p>
            </div>
          </section>

          <SectionDivider />

          {/* Section 8: Free Distribution */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t(translations.proof.section8Title, lang)}
            </h2>

            <FormattedParagraph>
              {t(translations.proof.section8Text1, lang)}
            </FormattedParagraph>

            <QuoteBlock>
              {t(translations.proof.section8Quote, lang)}
            </QuoteBlock>

            <ProofImage
              src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/22-1.jpg"
              alt="Dubai Business"
              caption={t(translations.proof.dubaiCaption, lang)}
            />

            <FormattedParagraph>
              {t(translations.proof.section8Text2, lang)}
            </FormattedParagraph>

            <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 mb-8">
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                {formatParagraphText(t(translations.proof.section8Text3, lang))}
              </p>
              <p className="text-accent font-medium text-lg">
                {formatParagraphText(t(translations.proof.section8Text4, lang))}
              </p>
            </div>

            <QuoteBlock>
              {t(translations.proof.section8Text5, lang)}
            </QuoteBlock>
          </section>

          <SectionDivider />

          {/* Telegram CTA Section - Full Block like Final CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-b from-[#0088cc]/10 to-transparent border border-[#0088cc]/20 p-8 md:p-12">
              {/* Live Status Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-mono">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  {t(translations.proof.telegramBadgeLive, lang)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0088cc]/20 border border-[#0088cc]/30 rounded-full text-[#0088cc] text-xs font-mono">
                  {t(translations.proof.telegramBadgeProfit, lang)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs font-mono">
                  {t(translations.proof.telegramBadgeReview, lang)}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t(translations.proof.telegramSectionTitle, lang)}
              </h2>

              <div className="text-white/60 mb-8 max-w-lg mx-auto space-y-2">
                <p className="font-medium text-white/80">{t(translations.proof.telegramSectionDesc1, lang)}</p>
                <p>{t(translations.proof.telegramSectionDesc2, lang)}</p>
                <p>{t(translations.proof.telegramSectionDesc3, lang)}</p>
              </div>

              {/* Social Proof Stats - Fixed values */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto mb-8">
                <div className="bg-white/[0.03] border border-white/10 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0088cc] font-mono">3,900+</div>
                  <div className="text-xs text-white/50 mt-1">{t(translations.proof.telegramStatMembers, lang)}</div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 font-mono">26,000+</div>
                  <div className="text-xs text-white/50 mt-1">{t(translations.proof.telegramStatShares, lang)}</div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-mono">500+</div>
                  <div className="text-xs text-white/50 mt-1">{t(translations.proof.telegramStatReviews, lang)}</div>
                </div>
              </div>

              <a
                href={SERVER_LINK_MAP[id]?.["landing.telegram.group"] || DEFAULT_LINKS["landing.telegram.group"]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold text-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #0088cc 0%, #0077b5 50%, #006699 100%)",
                  boxShadow: "0 0 30px rgba(0, 136, 204, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
                }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                {t(translations.proof.telegramCtaButton, lang)}
              </a>
            </div>
          </section>

          <SectionDivider />

          {/* Section 9: Transparency */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t(translations.proof.section9Title, lang)}
            </h2>

            <FormattedParagraph>
              {t(translations.proof.section9Text1, lang)}
            </FormattedParagraph>

            <div className="bg-accent/5 border border-accent/20 p-6 md:p-8 mb-8">
              <p className="text-white/90 text-lg leading-relaxed mb-4">
                {formatParagraphText(t(translations.proof.section9Text2, lang))}
              </p>
              <p className="text-white/70">
                {formatParagraphText(t(translations.proof.section9Text3, lang))}
              </p>
            </div>

            <FormattedParagraph className="mb-8">
              {t(translations.proof.section9Text4, lang)}
            </FormattedParagraph>

            <ProofImage
              src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/14.png"
              alt="Nasdaq 100 (QQQ) Trading Results"
              caption={t(translations.proof.nasdaq100Results, lang)}
            />

            <ProofImage
              src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_proof/13.png"
              alt="S&P 500 (SPY) Trading Results"
              caption={t(translations.proof.sp500Results, lang)}
            />

            <FormattedParagraph>
              {t(translations.proof.section9Text5, lang)}
            </FormattedParagraph>
          </section>

          <SectionDivider />

          {/* Final CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-b from-accent/10 to-transparent border border-accent/20 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t(translations.proof.ctaTitle, lang)}
              </h2>

              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                {t(translations.proof.ctaText, lang)}
              </p>

              <InlineCountdown />

              <button
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2 px-8 py-4 text-black font-bold text-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                  boxShadow: "0 0 30px rgba(249, 115, 22, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
                }}
              >
                {t(translations.proof.ctaButton, lang)}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="mt-6 text-sm text-white/50 text-center max-w-md mx-auto leading-relaxed">
                {t(translations.proof.ctaGuidance, lang)}
              </p>
            </div>
          </section>

        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center text-sm text-white/40">
          <p>BuyLow AI Quant Trading</p>
        </div>
      </footer>
    </main>
  )
}
