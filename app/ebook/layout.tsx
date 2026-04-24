import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buylow AI E-Book | Quant Trading Strategy Guide",
  description: "Learn the complete quant trading strategy with Buylow AI's comprehensive e-book guide.",

  openGraph: {
    title: "Buylow AI E-Book",
    description: "Complete quant trading strategy guide with AI-powered insights.",
    url: "https://www.buylowai.com/ebook",
    siteName: "Buylow AI",
    images: [
      {
        url: "https://www.buylowai.com/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Buylow AI E-Book",
    description: "Complete quant trading strategy guide.",
    images: ["https://www.buylowai.com/og.png"],
  },
}

export default function EbookIdLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
