export type ServerLinkSlot =
  | "signup.okx"
  | "signup.gate"
  | "program.download"
  | "chatid.bot"
  | "okx.referral.swap.code"
  | "okx.referral.swap.image"
  | "landing.telegram.group"

export const DEFAULT_LINKS: Record<ServerLinkSlot, string> = {
  "signup.okx": "https://www.okx.com/join/48189237",
  "signup.gate": "https://www.gate.io",
  "program.download": "",
  "chatid.bot": "https://t.me/userinfobot",
  "okx.referral.swap.code": "48189237",
  "okx.referral.swap.image": "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/change_code_Buylow.png",
  "landing.telegram.group": "https://t.me/addlist/mSKOshN-4sViMmI9",
}
