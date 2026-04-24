"use client";

import dynamic from "next/dynamic";

// Dynamically import the GL component with SSR disabled to prevent hydration issues
const GL = dynamic(() => import("@/components/gl").then((mod) => mod.GL), {
  ssr: false,
});

export function BackgroundWave() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <GL hovering={false} />
    </div>
  );
}
