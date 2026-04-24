"use client"

import { useEffect, useRef, useState } from "react"

/**
 * True Fibonacci Spiral overlay using quarter-circle arcs.
 *
 * Each arc corresponds to a Fibonacci square: 1, 1, 2, 3, 5, 8, 13, 21, 34
 * The arcs connect to form a continuous Golden Spiral path.
 *
 * Features:
 *  A) Flowing glow — a short bright segment travels along the spiral via stroke-dashoffset animation
 *  B) Glow pulse — subtle brightness oscillation on the base spiral
 *  C) IntersectionObserver — pause when out of view, resume on re-enter
 *  D) prefers-reduced-motion — static display, no animation
 */

/* ── Build the spiral path ──
   Starting from the center, each quarter-arc has radius = fib(n) * UNIT.
   We alternate the sweep direction as we spiral outward.
   The arcs are placed so each quarter turn connects seamlessly.
*/
const UNIT = 5 // px per fib-unit — controls overall size

// Fibonacci sequence for the spiral
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34]

function buildSpiralPath(): string {
  // We trace the spiral from center outward.
  // Each step: quarter-circle arc with radius = fib[i] * UNIT
  // Direction cycles: right, up, left, down (0,1,2,3)

  let x = 0
  let y = 0
  const parts: string[] = [`M ${x} ${y}`]

  for (let i = 0; i < FIB.length; i++) {
    const r = FIB[i] * UNIT
    const dir = i % 4

    let dx = 0
    let dy = 0

    // Quarter-arc sweep: each direction moves the endpoint
    // and we use SVG arc (A rx ry rotation large-arc sweep-flag x y)
    switch (dir) {
      case 0: // going right, arcing down
        dx = r; dy = r
        break
      case 1: // going up, arcing right
        dx = -r; dy = r
        break
      case 2: // going left, arcing up
        dx = -r; dy = -r
        break
      case 3: // going down, arcing left
        dx = r; dy = -r
        break
    }

    x += dx
    y += dy
    parts.push(`A ${r} ${r} 0 0 1 ${x} ${y}`)
  }

  return parts.join(" ")
}

// Build the secondary (outer) spiral with larger fibs
const FIB_OUTER = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

function buildOuterSpiralPath(): string {
  let x = 0
  let y = 0
  const parts: string[] = [`M ${x} ${y}`]

  for (let i = 0; i < FIB_OUTER.length; i++) {
    const r = FIB_OUTER[i] * (UNIT * 0.6)
    const dir = i % 4
    let dx = 0
    let dy = 0
    switch (dir) {
      case 0: dx = r; dy = r; break
      case 1: dx = -r; dy = r; break
      case 2: dx = -r; dy = -r; break
      case 3: dx = r; dy = -r; break
    }
    x += dx
    y += dy
    parts.push(`A ${r} ${r} 0 0 1 ${x} ${y}`)
  }
  return parts.join(" ")
}

// Build Fibonacci squares outline for context
function buildSquarePaths(): { x: number; y: number; size: number }[] {
  const squares: { x: number; y: number; size: number }[] = []
  let cx = 0
  let cy = 0

  for (let i = 0; i < FIB.length; i++) {
    const size = FIB[i] * UNIT
    const dir = i % 4
    let sx = cx
    let sy = cy

    switch (dir) {
      case 0: sx = cx; sy = cy; cx += size; break
      case 1: sx = cx - size; sy = cy; cy += size; break
      case 2: sx = cx - size; sy = cy - size; cx -= size; break
      case 3: sx = cx; sy = cy - size; cy -= size; break
    }

    squares.push({ x: sx, y: sy, size })
  }
  return squares
}

const SPIRAL_PATH = buildSpiralPath()
const OUTER_SPIRAL_PATH = buildOuterSpiralPath()
const SQUARES = buildSquarePaths()

// Approximate total path length for dash animation
const TOTAL_LEN = FIB.reduce((sum, f) => sum + f * UNIT * Math.PI * 0.5, 0)
const OUTER_LEN = FIB_OUTER.reduce((sum, f) => sum + f * UNIT * 0.6 * Math.PI * 0.5, 0)

// Glow segment length (portion that "shines" at any time)
const GLOW_SEG = TOTAL_LEN * 0.15
const OUTER_GLOW_SEG = OUTER_LEN * 0.12

export function FibonacciOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true)
    }
  }, [])

  // IntersectionObserver: pause/resume
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const animState = paused || reducedMotion ? "paused" : "running"

  // Compute a viewBox that fits all the squares + some padding
  const allPts = SQUARES.flatMap((s) => [
    { x: s.x, y: s.y },
    { x: s.x + s.size, y: s.y + s.size },
  ])
  const minX = Math.min(...allPts.map((p) => p.x)) - 20
  const minY = Math.min(...allPts.map((p) => p.y)) - 20
  const maxX = Math.max(...allPts.map((p) => p.x)) + 20
  const maxY = Math.max(...allPts.map((p) => p.y)) + 20
  const vbW = maxX - minX
  const vbH = maxY - minY
  const viewBox = `${minX} ${minY} ${vbW} ${vbH}`

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Main Spiral SVG — positioned bottom-right on desktop, centered-bottom on mobile */}
      <svg
        viewBox={viewBox}
        fill="none"
        className="absolute bottom-0 right-0 w-[340px] h-[340px] md:w-[480px] md:h-[480px] lg:w-[560px] lg:h-[560px] opacity-100"
        style={{ transform: "translate(15%, 10%)" }}
      >
        <defs>
          {/* Gold gradient for the base spiral */}
          <linearGradient id="fibBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD36A" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#FFAA33" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFD36A" stopOpacity="0.12" />
          </linearGradient>

          {/* Bright gold for the flowing glow */}
          <linearGradient id="fibGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD36A" stopOpacity="0" />
            <stop offset="40%" stopColor="#FFD36A" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFAA33" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFD36A" stopOpacity="0" />
          </linearGradient>

          {/* Filter for the glow bloom effect */}
          <filter id="fibGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="fibGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fibonacci Squares — very faint outlines for context */}
        {SQUARES.map((sq, i) => (
          <rect
            key={`sq-${i}`}
            x={sq.x}
            y={sq.y}
            width={sq.size}
            height={sq.size}
            fill="none"
            stroke="#FFD36A"
            strokeWidth="0.3"
            opacity={0.06}
          />
        ))}

        {/* Layer 1: Base spiral — always visible, faint, with slow pulse */}
        <path
          d={SPIRAL_PATH}
          stroke="url(#fibBaseGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#fibGlow)"
          style={{
            animation: reducedMotion ? "none" : "fibBasePulse 8s ease-in-out infinite",
            animationPlayState: animState,
          }}
        />

        {/* Layer 2: Flowing glow on main spiral */}
        {!reducedMotion && (
          <path
            d={SPIRAL_PATH}
            stroke="#FFD36A"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            filter="url(#fibGlowStrong)"
            style={{
              strokeDasharray: `${GLOW_SEG} ${TOTAL_LEN - GLOW_SEG}`,
              animation: `fibFlowGlow ${8}s linear infinite`,
              animationPlayState: animState,
              opacity: 0.7,
            }}
          />
        )}

        {/* Layer 3: Second flowing glow (offset timing) */}
        {!reducedMotion && (
          <path
            d={SPIRAL_PATH}
            stroke="#FFAA33"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            filter="url(#fibGlow)"
            style={{
              strokeDasharray: `${GLOW_SEG * 0.6} ${TOTAL_LEN - GLOW_SEG * 0.6}`,
              animation: `fibFlowGlow2 ${12}s linear infinite`,
              animationPlayState: animState,
              opacity: 0.45,
            }}
          />
        )}

        {/* Outer secondary spiral — subtler, slower */}
        <path
          d={OUTER_SPIRAL_PATH}
          stroke="#FFD36A"
          strokeWidth="0.6"
          strokeLinecap="round"
          fill="none"
          opacity={0.04}
          style={{
            animation: reducedMotion ? "none" : "fibBasePulse 12s ease-in-out infinite",
            animationPlayState: animState,
          }}
        />

        {!reducedMotion && (
          <path
            d={OUTER_SPIRAL_PATH}
            stroke="#FFD36A"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#fibGlow)"
            style={{
              strokeDasharray: `${OUTER_GLOW_SEG} ${OUTER_LEN - OUTER_GLOW_SEG}`,
              animation: `fibOuterFlow ${15}s linear infinite`,
              animationPlayState: animState,
              opacity: 0.25,
            }}
          />
        )}

        {/* Center dot — golden origin point */}
        <circle
          cx="0"
          cy="0"
          r="2"
          fill="#FFD36A"
          opacity={0.5}
          style={{
            animation: reducedMotion ? "none" : "fibCenterPulse 4s ease-in-out infinite",
            animationPlayState: animState,
          }}
        />
      </svg>

      {/* CSS Animations — all pure CSS, no rAF */}
      <style>{`
        @keyframes fibBasePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes fibFlowGlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -${TOTAL_LEN}; }
        }
        @keyframes fibFlowGlow2 {
          0% { stroke-dashoffset: -${TOTAL_LEN * 0.4}; }
          100% { stroke-dashoffset: -${TOTAL_LEN * 1.4}; }
        }
        @keyframes fibOuterFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -${OUTER_LEN}; }
        }
        @keyframes fibCenterPulse {
          0%, 100% { opacity: 0.5; r: 2; }
          50% { opacity: 0.9; r: 3; }
        }
      `}</style>
    </div>
  )
}
