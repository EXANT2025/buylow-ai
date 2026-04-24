export type ExchangeKey = "okx" | "gate" | "edgex"
export type AssetKey = "btc" | "gold" | "silver" | "tsla" | "spy" | "qqq"

export const SERVER_EXCHANGE_KEY = "server.exchange"
export const SERVER_ASSET_KEY = "server.asset"
export const TOTAL_SERVER_STEPS = 5

export function getServerStepUrl(args: {
  step: number
  pageId?: string | null
  exchange?: string | null
  asset?: string | null
}) {
  const qs = new URLSearchParams()
  qs.set("step", String(args.step))
  if (args.pageId) qs.set("pageId", String(args.pageId))
  if (args.exchange) qs.set("ex", String(args.exchange))
  if (args.asset) qs.set("asset", String(args.asset))
  return `/server?${qs.toString()}`
}

export function saveServerExchange(ex: ExchangeKey) {
  if (typeof window !== "undefined") localStorage.setItem(SERVER_EXCHANGE_KEY, ex)
}

export function loadServerExchange(): ExchangeKey | null {
  if (typeof window === "undefined") return null
  const v = localStorage.getItem(SERVER_EXCHANGE_KEY)
  return v === "okx" ? v : null
}

export function saveServerAsset(asset: AssetKey) {
  if (typeof window !== "undefined") localStorage.setItem(SERVER_ASSET_KEY, asset)
}

export function loadServerAsset(): AssetKey | null {
  if (typeof window === "undefined") return null
  const v = localStorage.getItem(SERVER_ASSET_KEY)
  return v === "btc" || v === "gold" || v === "silver" || v === "tsla" || v === "spy" || v === "qqq" ? v as AssetKey : null
}

export function calcProgressPercent(step: number, total: number) {
  return Math.min(100, Math.max(0, Math.round((step / total) * 100)))
}

export function normalizeServerStep(step: number): number {
  return Math.max(1, Math.min(5, step))
}

export function getServerVariantFromStorage(): string | null {
  if (typeof window === "undefined") return null

  const ex = localStorage.getItem(SERVER_EXCHANGE_KEY)

  if (!ex) return null

  // All OKX assets use the same base content variant.
  // Asset-specific differences (Docker tags, images) are handled in the rendering layer.
  if (ex === "okx") {
    return "okx-mobile"
  }

  return null
}
