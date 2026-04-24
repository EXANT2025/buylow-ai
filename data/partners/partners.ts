export interface PartnerItem {
  name: string
  logoSrc: string
}

export interface PartnerGroup {
  title: string
  items: PartnerItem[]
}

export const PARTNER_GROUPS: PartnerGroup[] = [
  {
    title: "Sub Partners",
    items: [
      {
        name: "DeSpread",
        logoSrc:
          "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/despread_logo.png",
      },
    ],
  },
  {
    title: "Partner Exchanges",
    items: [
      {
        name: "OKX",
        logoSrc:
          "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_logo.png",
      },
      {
        name: "Gate.io",
        logoSrc:
          "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/gate_logo.png",
      },
      {
        name: "Hyperliquid",
        logoSrc:
          "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/hyperliquid_logo.png",
      },
      {
        name: "EdgeX",
        logoSrc:
          "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/edgex_logo2.png",
      },
    ],
  },
]
