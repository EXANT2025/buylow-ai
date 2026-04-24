"use client"

import { cn } from "@/lib/utils"

interface AnimatedBorderButtonProps {
  children: React.ReactNode
  className?: string
  borderRadius?: string
}

/**
 * Wraps any button/anchor element with an animated silver border streak.
 * The streak flows left→right with dashed segments, using a conic-gradient
 * rotating via CSS @keyframes. Hover intensifies the glow.
 */
export function AnimatedBorderButton({
  children,
  className,
  borderRadius = "9999px",
}: AnimatedBorderButtonProps) {
  return (
    <div
      className={cn("animated-border-wrap group/border", className)}
      style={{ "--ab-radius": borderRadius } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
