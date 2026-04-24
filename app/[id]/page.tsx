"use client"

import { useEffect, use } from "react"
import { useSearchParams } from "next/navigation"
import { HeroSection } from "@/components/hero-section"
import { SignalsSection } from "@/components/signals-section"
import { WorkSection } from "@/components/work-section"
import { StrategySection } from "@/components/strategy-section"
import { FeaturesSection } from "@/components/principles-section"
import { ColophonSection } from "@/components/colophon-section"
import { TopNav } from "@/components/top-nav"
import { BackgroundWave } from "@/components/BackgroundWave"
import { CountdownBanner } from "@/components/countdown-banner"
import { supabase } from "@/lib/supabase"
import { MarketerIdProvider } from "@/lib/marketer-context"

export default function LandingPageWithId({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const src = searchParams.get("src")

  const isFromProof = src === "proof"

  // Track landing page view if coming from proof page
  useEffect(() => {
    if (isFromProof) {
      const trackLandingView = async () => {
        try {
          await supabase.rpc("increment_buylow_landing_view", { mid: id })
        } catch (error) {
          console.error("Failed to track landing view:", error)
        }
      }
      trackLandingView()
    }
  }, [id, isFromProof])

  return (
    <MarketerIdProvider marketerId={id} isFromProof={isFromProof}>
      <main className="relative min-h-screen">
        <TopNav />
        <BackgroundWave />

        <div className="relative z-10">
          <CountdownBanner />
          <HeroSection />
          <SignalsSection />
          <WorkSection />
          <StrategySection />
          <FeaturesSection />
          <ColophonSection />
        </div>
      </main>
    </MarketerIdProvider>
  )
}
