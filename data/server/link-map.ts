import type { ServerLinkSlot } from "./link-slots"
import { DEFAULT_LINKS } from "./link-slots"

type LinkMap = Partial<Record<ServerLinkSlot, string>>

export const SERVER_LINK_MAP: Record<string, LinkMap> = {
  "1": {
    "signup.okx": "https://www.okx.com/join/48189237",
    "okx.referral.swap.code": "48189237",
    "okx.referral.swap.image": "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/change_code_Buylow.png",
  },
}

// Fill defaults for pageId 1-300
for (let i = 1; i <= 300; i++) {
  const key = String(i)
  if (!SERVER_LINK_MAP[key]) SERVER_LINK_MAP[key] = {}

  if (!SERVER_LINK_MAP[key]["signup.okx"]) {
    SERVER_LINK_MAP[key]["signup.okx"] = DEFAULT_LINKS["signup.okx"]
  }
  if (!SERVER_LINK_MAP[key]["landing.telegram.group"]) {
    SERVER_LINK_MAP[key]["landing.telegram.group"] = DEFAULT_LINKS["landing.telegram.group"]
  }
  if (!SERVER_LINK_MAP[key]["okx.referral.swap.code"]) {
    SERVER_LINK_MAP[key]["okx.referral.swap.code"] = DEFAULT_LINKS["okx.referral.swap.code"]
  }
  if (!SERVER_LINK_MAP[key]["okx.referral.swap.image"]) {
    SERVER_LINK_MAP[key]["okx.referral.swap.image"] = DEFAULT_LINKS["okx.referral.swap.image"]
  }
}

export const getServerOverrideLink = (slot: ServerLinkSlot, pageId?: string): string | undefined =>
  pageId ? SERVER_LINK_MAP[pageId]?.[slot] : undefined

// Alias for marketer ID usage in ebook and other pages
export const getMarketerOverrideLink = getServerOverrideLink
