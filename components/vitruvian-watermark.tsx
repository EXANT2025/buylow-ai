"use client"

/**
 * VitruvianWatermark
 * Abstract line-art silhouette inspired by Da Vinci's Vitruvian Man.
 * Pure SVG, pointer-events: none, very low opacity, centered behind content.
 */
export function VitruvianWatermark() {
  return (
    <div
      className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[65vw] max-w-[700px] md:w-[55vw] lg:w-[50vw] h-auto opacity-[0.07]"
      >
        {/* Outer circle */}
        <circle cx="300" cy="310" r="240" stroke="white" strokeWidth="0.8" />
        
        {/* Inner square */}
        <rect x="130" y="130" width="340" height="370" stroke="white" strokeWidth="0.8" />

        {/* Center line (spine) */}
        <line x1="300" y1="130" x2="300" y2="500" stroke="white" strokeWidth="0.4" strokeDasharray="4 6" opacity="0.5" />
        {/* Horizontal center line */}
        <line x1="130" y1="310" x2="470" y2="310" stroke="white" strokeWidth="0.4" strokeDasharray="4 6" opacity="0.5" />

        {/* Head */}
        <circle cx="300" cy="160" r="30" stroke="white" strokeWidth="0.9" />
        {/* Neck */}
        <line x1="300" y1="190" x2="300" y2="210" stroke="white" strokeWidth="0.9" />
        
        {/* Torso */}
        <path
          d="M 270 210 L 270 350 M 330 210 L 330 350 M 270 210 L 330 210"
          stroke="white"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        {/* Shoulders wider */}
        <line x1="240" y1="220" x2="270" y2="210" stroke="white" strokeWidth="0.9" />
        <line x1="360" y1="220" x2="330" y2="210" stroke="white" strokeWidth="0.9" />

        {/* Ribcage subtle lines */}
        <path d="M 278 240 Q 300 250 322 240" stroke="white" strokeWidth="0.5" opacity="0.6" />
        <path d="M 275 260 Q 300 272 325 260" stroke="white" strokeWidth="0.5" opacity="0.6" />
        <path d="M 278 280 Q 300 290 322 280" stroke="white" strokeWidth="0.5" opacity="0.5" />

        {/* Pelvis / hip line */}
        <path d="M 270 350 L 260 360 L 340 360 L 330 350" stroke="white" strokeWidth="0.9" strokeLinecap="round" />

        {/* ── Arms (pose 1): horizontal, T-pose ── */}
        {/* Left arm */}
        <line x1="240" y1="220" x2="130" y2="240" stroke="white" strokeWidth="0.9" />
        {/* Left forearm */}
        <line x1="130" y1="240" x2="80" y2="250" stroke="white" strokeWidth="0.8" />
        {/* Left hand */}
        <line x1="80" y1="250" x2="60" y2="248" stroke="white" strokeWidth="0.6" />
        <line x1="80" y1="250" x2="62" y2="255" stroke="white" strokeWidth="0.5" />
        <line x1="80" y1="250" x2="65" y2="260" stroke="white" strokeWidth="0.5" />

        {/* Right arm */}
        <line x1="360" y1="220" x2="470" y2="240" stroke="white" strokeWidth="0.9" />
        {/* Right forearm */}
        <line x1="470" y1="240" x2="520" y2="250" stroke="white" strokeWidth="0.8" />
        {/* Right hand */}
        <line x1="520" y1="250" x2="540" y2="248" stroke="white" strokeWidth="0.6" />
        <line x1="520" y1="250" x2="538" y2="255" stroke="white" strokeWidth="0.5" />
        <line x1="520" y1="250" x2="535" y2="260" stroke="white" strokeWidth="0.5" />

        {/* ── Arms (pose 2): raised diagonally ── */}
        {/* Left arm raised */}
        <line x1="240" y1="220" x2="145" y2="130" stroke="white" strokeWidth="0.6" opacity="0.55" />
        <line x1="145" y1="130" x2="100" y2="95" stroke="white" strokeWidth="0.5" opacity="0.55" />
        {/* Right arm raised */}
        <line x1="360" y1="220" x2="455" y2="130" stroke="white" strokeWidth="0.6" opacity="0.55" />
        <line x1="455" y1="130" x2="500" y2="95" stroke="white" strokeWidth="0.5" opacity="0.55" />

        {/* ── Legs (pose 1): standing straight ── */}
        {/* Left leg */}
        <line x1="280" y1="360" x2="270" y2="440" stroke="white" strokeWidth="0.9" />
        <line x1="270" y1="440" x2="265" y2="500" stroke="white" strokeWidth="0.8" />
        {/* Left foot */}
        <line x1="265" y1="500" x2="245" y2="505" stroke="white" strokeWidth="0.6" />

        {/* Right leg */}
        <line x1="320" y1="360" x2="330" y2="440" stroke="white" strokeWidth="0.9" />
        <line x1="330" y1="440" x2="335" y2="500" stroke="white" strokeWidth="0.8" />
        {/* Right foot */}
        <line x1="335" y1="500" x2="355" y2="505" stroke="white" strokeWidth="0.6" />

        {/* ── Legs (pose 2): spread apart ── */}
        {/* Left leg spread */}
        <line x1="280" y1="360" x2="210" y2="450" stroke="white" strokeWidth="0.6" opacity="0.55" />
        <line x1="210" y1="450" x2="180" y2="520" stroke="white" strokeWidth="0.5" opacity="0.55" />
        {/* Right leg spread */}
        <line x1="320" y1="360" x2="390" y2="450" stroke="white" strokeWidth="0.6" opacity="0.55" />
        <line x1="390" y1="450" x2="420" y2="520" stroke="white" strokeWidth="0.5" opacity="0.55" />

        {/* ── Golden ratio proportional markers ── */}
        {/* Navel point (golden ratio of height) */}
        <circle cx="300" cy="310" r="3" stroke="white" strokeWidth="0.6" opacity="0.4" />
        <circle cx="300" cy="310" r="1" fill="white" opacity="0.3" />

        {/* Small proportion ticks on the sides */}
        <line x1="122" y1="310" x2="138" y2="310" stroke="white" strokeWidth="0.5" opacity="0.35" />
        <line x1="462" y1="310" x2="478" y2="310" stroke="white" strokeWidth="0.5" opacity="0.35" />

        {/* Top/bottom ticks */}
        <line x1="300" y1="64" x2="300" y2="76" stroke="white" strokeWidth="0.5" opacity="0.35" />
        <line x1="300" y1="544" x2="300" y2="556" stroke="white" strokeWidth="0.5" opacity="0.35" />

        {/* Secondary circle touching the square */}
        <circle cx="300" cy="315" r="185" stroke="white" strokeWidth="0.4" opacity="0.3" strokeDasharray="3 8" />
      </svg>
    </div>
  )
}
