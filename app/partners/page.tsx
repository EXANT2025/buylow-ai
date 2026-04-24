import type { Metadata } from "next"
import { TopNav } from "@/components/top-nav"
import { PartnersDirectory } from "@/components/partners-directory"

export const metadata: Metadata = {
  title: "Partners | BUYLOW",
  description: "Our trusted partners across financial institutions, exchanges, and technology infrastructure.",
}

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopNav />
      <PartnersDirectory />
    </main>
  )
}
