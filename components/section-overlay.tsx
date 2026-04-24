"use client"

export function SectionOverlay() {
  return (
    <>
      {/* Dark base overlay to deepen the section */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "rgba(0, 0, 0, 0.55)",
        }}
      />
      {/* Micro checkerboard texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: [
            "linear-gradient(105deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(255,255,255,0.02) 70%, rgba(255,255,255,0.03) 100%)",
            "repeating-conic-gradient(rgba(255,255,255,0.025) 0% 25%, transparent 0% 50%)",
          ].join(", "),
          backgroundSize: "100% 100%, 8px 8px",
        }}
      />
      {/* Top edge fade line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-0"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)" }}
      />
      {/* Bottom edge fade line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none z-0"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.04) 70%, transparent)" }}
      />
    </>
  )
}
