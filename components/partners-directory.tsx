"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PARTNER_GROUPS } from "@/data/partners/partners"

export function PartnersDirectory() {
  return (
    <section className="relative px-6 md:px-16 lg:px-28 pt-32 md:pt-40 pb-24 md:pb-32">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/40 hover:text-accent transition-colors duration-200 mb-16"
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            Partners Directory
          </span>
          <h1 className="font-[var(--font-bebas)] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-foreground">
            Our Partners
          </h1>
        </div>
        <p className="max-w-md font-mono text-sm text-foreground/40 leading-relaxed lg:text-right">
          A growing network of exchanges, infrastructure providers, financial institutions, and
          government-backed programs powering the Buylow ecosystem.
        </p>
      </div>

      {/* Partner groups */}
      <div className="space-y-16 md:space-y-20">
        {PARTNER_GROUPS.map((group) => (
          <div key={group.title}>
            {/* Group heading */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50 shrink-0">
                {group.title}
              </h2>
              <div className="flex-1 h-px bg-foreground/10" />
            </div>

            {/* Partner cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex items-center justify-center aspect-[16/9] rounded-lg border border-foreground/10 bg-foreground/[0.03] hover:border-foreground/20 hover:bg-foreground/[0.06] transition-all duration-300 overflow-hidden"
                >
                  {item.logoSrc ? (
                    <img
                      src={item.logoSrc || "/placeholder.svg"}
                      alt={item.name}
                      className="w-[60%] max-w-[140px] h-auto object-contain opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-mono text-xs text-foreground/30 group-hover:text-foreground/50 transition-colors duration-300 text-center px-4">
                      {item.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-24 pt-12 border-t border-foreground/10">
        <p className="font-mono text-xs text-foreground/30 leading-relaxed max-w-lg">
          Partnership inquiries and collaboration opportunities are welcome.
          <br />
          Reach out through our official channels for more information.
        </p>
      </div>
    </section>
  )
}
