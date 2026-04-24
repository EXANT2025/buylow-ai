"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, ChevronRight, MessageCircle, Lock, BookOpen } from "lucide-react"
import {
  saveServerExchange,
  saveServerAsset,
  loadServerExchange,
  loadServerAsset,
  calcProgressPercent,
  getServerVariantFromStorage,
  TOTAL_SERVER_STEPS,
} from "@/lib/serverFlow"
import { SERVER_CONTENT } from "@/data/server/content.registry"
import type { ExchangeKey, AssetKey } from "@/lib/serverFlow"
import type { Language, ContentSection, ServerVariant, ServerStepNum } from "@/data/server/content.types"
import { DEFAULT_LINKS } from "@/data/server/link-slots"
import { getServerOverrideLink } from "@/data/server/link-map"
import { BackgroundWave } from "@/components/BackgroundWave"
import { LanguageDropdown } from "@/components/language-dropdown"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"

// Password Gate Component
function PasswordGate({ 
  onSuccess, 
  lang,
  pageId,
  langParam,
}: { 
  onSuccess: () => void
  lang: string
  pageId?: string
  langParam?: string
}) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [showLangModal, setShowLangModal] = useState(false)
  
  const CORRECT_PASSWORD = "buylowai"
  
  // 10 supported languages for E-Book
  const EBOOK_LANGUAGES = [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "ar", label: "العربية" },
    { code: "ru", label: "Русский" },
    { code: "es", label: "Español" },
    { code: "tr", label: "Türkçe" },
    { code: "id", label: "Bahasa Indonesia" },
    { code: "th", label: "ไทย" },
    { code: "vi", label: "Tiếng Việt" },
  ]
  
  const UI_TEXT = {
    title: { 
      en: "Guide Access Password", 
      ko: "가이드 접근 비밀번호", 
      ar: "كلمة مرور الوصول للدليل", 
      ru: "Пароль доступа к руководству", 
      zh: "指南访问密码", 
      es: "Contraseña de acceso a la guía" 
    },
    description: { 
      en: "Buylow AI can only be started by users who understand the logic and guide", 
      ko: "Buylow AI는 로직과 가이드를 이해한 사용자만 시작할 수 있습니다", 
      ar: "يمكن فقط للمستخدمين الذين يفهمون المنطق والدليل بدء Buylow AI", 
      ru: "Buylow AI могут запустить только пользователи, понимающие логику и руководство", 
      zh: "只有理解逻辑和指南的用户才能启动 Buylow AI", 
      es: "Solo los usuarios que entienden la lógica y la guía pueden iniciar Buylow AI" 
    },
    placeholder: { 
      en: "Enter password", 
      ko: "비밀번호를 입력하세요", 
      ar: "أدخل كلمة المرور", 
      ru: "Введите пароль", 
      zh: "请输入密码", 
      es: "Ingrese la contraseña" 
    },
    accessButton: { 
      en: "Access", 
      ko: "접근하기", 
      ar: "دخول", 
      ru: "Войти", 
      zh: "访问", 
      es: "Acceder" 
    },
    errorMessage: { 
      en: "Password is incorrect", 
      ko: "비밀번호가 올바르지 않습니다", 
      ar: "كلمة المرور غير صحيحة", 
      ru: "Неверный пароль", 
      zh: "密码不正确", 
      es: "La contraseña es incorrecta" 
    },
    noticeTitle: { 
      en: "The guide password is in the E-Book", 
      ko: "가이드 비밀번호는 전자책 안에 있습니다", 
      ar: "كلمة مرور الدليل موجودة في الكتاب الإلكتروني", 
      ru: "Пароль к руководству находится в электронной книге", 
      zh: "指南密码在电子书中", 
      es: "La contraseña de la guía está en el E-Book" 
    },
    noticeDesc: { 
      en: "Please read the E-Book first to find the password, then come back.\n\nBuylow AI is only available to those who fully understand the related logic and guide.", 
      ko: "먼저 전자책을 읽고 비밀번호를 확인한 뒤 다시 돌아와 주세요.\n\nBuylow AI는 관련 로직과 가이드를 충분히 이해한 사람에게만 허용됩니다.", 
      ar: "يرجى قراءة الكتاب الإلكتروني أولاً للعثور على كلمة المرور، ثم العودة.\n\nBuylow AI متاح فقط لمن يفهم تماماً المنطق والدليل.", 
      ru: "Пожалуйста, сначала прочитайте электронную книгу, чтобы найти пароль, затем вернитесь.\n\nBuylow AI доступен только тем, кто полностью понимает логику и руководство.", 
      zh: "请先阅读电子书找到密码，然后再回来。\n\nBuylow AI 仅供完全理解相关逻辑和指南的人使用。", 
      es: "Por favor, lea primero el E-Book para encontrar la contraseña, luego regrese.\n\nBuylow AI solo está disponible para quienes entienden completamente la lógica y la guía." 
    },
    ebookButton: { 
      en: "Go to E-Book", 
      ko: "전자책 읽으러 가기", 
      ar: "اذهب إلى الكتاب الإلكتروني", 
      ru: "Перейти к электронной книге", 
      zh: "前往电子书", 
      es: "Ir al E-Book" 
    },
    selectLanguage: {
      en: "Select Language",
      ko: "언어를 선택하세요",
      ar: "اختر اللغة",
      ru: "Выберите язык",
      zh: "选择语言",
      es: "Seleccione el idioma"
    },
  }
  
  const getText = (obj: Record<string, string>) => obj[lang] ?? obj.en
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim().toLowerCase() === CORRECT_PASSWORD) {
      // Store authentication in sessionStorage
      sessionStorage.setItem("server_authenticated", "true")
      setError(false)
      onSuccess()
    } else {
      setError(true)
    }
  }
  
  const handleEbookButtonClick = () => {
    // Show language selection modal instead of navigating directly
    setShowLangModal(true)
  }
  
  const handleLanguageSelect = (selectedLang: string) => {
    // Build /ebook URL with selected language
    let ebookUrl = pageId ? `/ebook/${pageId}` : "/ebook"
    ebookUrl += `?lang=${selectedLang}`
    router.push(ebookUrl)
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Lock Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center">
            <Lock className="w-10 h-10 text-foreground/60" />
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-tight">
            {getText(UI_TEXT.title)}
          </h1>
          <p className="font-mono text-sm text-foreground/50">
            {getText(UI_TEXT.description)}
          </p>
        </div>
        
        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder={getText(UI_TEXT.placeholder)}
              className="w-full px-5 py-4 rounded-xl bg-foreground/5 border border-foreground/15 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-all"
            />
          </div>
          
          {error && (
            <p className="text-red-400 font-mono text-sm text-center">
              {getText(UI_TEXT.errorMessage)}
            </p>
          )}
          
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-mono text-sm font-medium transition-all"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
              color: "var(--background)",
            }}
          >
            {getText(UI_TEXT.accessButton)}
          </button>
        </form>
        
        {/* Notice Card */}
        <div className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-6 space-y-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div className="space-y-2">
              <p className="font-mono text-sm text-cyan-400 font-medium">
                {getText(UI_TEXT.noticeTitle)}
              </p>
              <p className="font-mono text-xs text-foreground/50 whitespace-pre-line leading-relaxed">
                {getText(UI_TEXT.noticeDesc)}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleEbookButtonClick}
            className="w-full py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-sm font-medium hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer"
          >
            {getText(UI_TEXT.ebookButton)}
          </button>
        </div>
      </div>
      
      {/* Language Selection Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLangModal(false)}
          />
          
          {/* Modal */}
          <div className="relative w-[90%] max-w-sm bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-foreground/10">
              <h3 className="font-[var(--font-bebas)] text-xl tracking-tight text-center">
                {getText(UI_TEXT.selectLanguage)}
              </h3>
            </div>
            
            {/* Language Grid */}
            <div className="p-4 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
              {EBOOK_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLanguageSelect(item.code)}
                  className="px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 font-mono text-sm text-foreground/80 hover:bg-cyan-500/15 hover:border-cyan-500/30 hover:text-cyan-400 transition-all cursor-pointer text-center"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ServerPageContent() {
  const router = useRouter()
  const sp = useSearchParams()
  const { lang: globalLang, setLang: setGlobalLang } = useLanguage()

  const stepParam = Number(sp.get("step")) || 1
  const pageId = sp.get("pageId") || undefined
  const langParam = sp.get("lang") || undefined

  // Password gate authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Check sessionStorage on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("server_authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const [step, setStep] = useState(stepParam)
  const [exchange, setExchange] = useState<ExchangeKey | null>(null)
  const [asset, setAsset] = useState<AssetKey | null>(null)

  // Use global language context - all 6 languages now supported
  const lang: Language = globalLang as Language

  const handleLangChange = useCallback((l: string) => {
    setGlobalLang(l as Language)
  }, [setGlobalLang])

  // Check if current language is RTL
  const isRTL = lang === "ar"

  const [lastClick, setLastClick] = useState("")
  const [showCodeSwitchModal, setShowCodeSwitchModal] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleAction = useCallback((action: string) => {
    if (action === "openOkxCodeSwitchModal") {
      setShowCodeSwitchModal(true)
    } else if (action === "comingSoon") {
      setShowComingSoon(true)
    }
  }, [])

  // Load from localStorage on mount - validate stored values
  useEffect(() => {
    const ex = loadServerExchange()
    const as = loadServerAsset()
    // Only allow "okx" on mount (edgex is disabled)
    if (ex === "okx") {
      setExchange(ex)
      if (as) setAsset(as)
    } else {
      // Clear invalid/disabled stored exchange
      if (typeof window !== "undefined") {
        localStorage.removeItem("server.exchange")
        localStorage.removeItem("server.asset")
      }
    }
  }, [])

  // Sync step from URL
  useEffect(() => {
    const s = Number(sp.get("step")) || 1
    setStep(s)
  }, [sp])

  // Mobile: scroll to top on step change
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [step])

  const updateUrl = useCallback(
    (newStep: number) => {
      const qs = new URLSearchParams()
      qs.set("step", String(newStep))
      if (pageId) qs.set("pageId", pageId)
      router.push(`/server?${qs.toString()}`)
    },
    [router, pageId],
  )

  const handleExchangeSelect = useCallback((ex: ExchangeKey) => {
    setLastClick(`exchange:${ex}`)
    setExchange(ex)
    saveServerExchange(ex)
    if (ex !== exchange) {
      setAsset(null)
    }
  }, [exchange])

  const handleAssetSelect = useCallback((a: AssetKey) => {
    setLastClick(`asset:${a}`)
    setAsset(a)
    saveServerAsset(a)
  }, [])

  const canProceedStep1 = !!(exchange && asset)

  const handleNext = () => {
    if (step === 1 && canProceedStep1) {
      updateUrl(2)
    } else if (step < TOTAL_SERVER_STEPS) {
      updateUrl(step + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      updateUrl(step - 1)
    } else {
      router.push("/")
    }
  }

  const progress = calcProgressPercent(step, TOTAL_SERVER_STEPS)

  // Get content for current step
  const variant = getServerVariantFromStorage() as ServerVariant | null
  const contentData =
    step >= 2 && variant
      ? SERVER_CONTENT[variant]?.[step as ServerStepNum]
      : null

  // Resolve link with pageId override
  const resolveLink = (slot?: string, fallbackHref?: string) => {
    if (slot && pageId) {
      const override = getServerOverrideLink(slot as any, pageId)
      if (override) return override
    }
    if (slot) {
      return DEFAULT_LINKS[slot as keyof typeof DEFAULT_LINKS] || fallbackHref || "#"
    }
    return fallbackHref || "#"
  }

  // Show password gate if not authenticated
  if (!isAuthenticated) {
    return (
      <PasswordGate 
        onSuccess={() => setIsAuthenticated(true)} 
        lang={lang}
        pageId={pageId}
        langParam={langParam}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Subtle flowing wave background at ~30% opacity */}
      <div className="opacity-30 pointer-events-none fixed inset-0 z-0">
        <BackgroundWave />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors font-mono text-sm"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-foreground/50">
              {step} / {TOTAL_SERVER_STEPS}
            </span>
            <LanguageDropdown lang={lang} onChangeLang={handleLangChange} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-foreground/5">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {step === 1 ? (
          <Step1ExchangeSelect
            exchange={exchange}
            asset={asset}
            onExchangeSelect={handleExchangeSelect}
            onAssetSelect={handleAssetSelect}
            lang={lang}
            lastClick={lastClick}
          />
        ) : contentData ? (
          <>
            <StepContent content={contentData} lang={lang} resolveLink={resolveLink} step={step} asset={asset} onAction={handleAction} />

            {/* OKX Code Switch Modal */}
            {showCodeSwitchModal && (
              <OkxCodeSwitchModal lang={lang} onClose={() => setShowCodeSwitchModal(false)} pageId={pageId} />
            )}

            {/* Coming Soon Modal */}
            {showComingSoon && (
              <ComingSoonModal onClose={() => setShowComingSoon(false)} />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground/50 font-mono text-sm">
              {lang === "ko"
                ? "먼저 거래소를 선택해주세요."
                : "Please select an exchange first."}
            </p>
            <button
              onClick={() => updateUrl(1)}
              className="mt-4 px-6 py-2 rounded-lg bg-accent text-background font-mono text-sm"
            >
              {lang === "ko" ? "거래소 선택으로" : "Go to Exchange Selection"}
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-foreground/15 text-foreground/70 hover:text-foreground hover:border-foreground/30 font-mono text-sm transition-all"
          >
            <ArrowLeft size={16} />
            {lang === "ko" ? "이전" : "Previous"}
          </button>

          {step < TOTAL_SERVER_STEPS ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && !canProceedStep1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  step === 1 && !canProceedStep1
                    ? "rgba(255,255,255,0.1)"
                    : "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                color:
                  step === 1 && !canProceedStep1
                    ? "rgba(255,255,255,0.4)"
                    : "var(--background)",
              }}
            >
              {lang === "ko" ? "다음" : "Next"}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => router.push("/bot-guide?step=1")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
                color: "var(--background)",
              }}
            >
              <MessageCircle size={16} />
              {lang === "ko" ? "봇 가이드 시작" : lang === "ar" ? "ابدأ دليل البوت" : lang === "ru" ? "Начать гайд по боту" : lang === "zh" ? "开始Bot指南" : lang === "es" ? "Iniciar Guía del Bot" : "Start Bot Guide"}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

// Step 1: Exchange & Asset selection
function Step1ExchangeSelect({
  exchange,
  asset,
  onExchangeSelect,
  onAssetSelect,
  lang,
  lastClick,
}: {
  exchange: ExchangeKey | null
  asset: AssetKey | null
  onExchangeSelect: (ex: ExchangeKey) => void
  onAssetSelect: (a: AssetKey) => void
  lang: Language
  lastClick: string
}) {
  // UI text for Step 1
  const UI_TEXT = {
    selectExchange: { en: "Select Exchange", ko: "거래소 선택", ar: "اختر البورصة", ru: "Выберите биржу", zh: "选择交易所", es: "Seleccionar Exchange" },
    chooseExchangeAsset: { en: "Choose your exchange and asset type", ko: "사용할 거래소와 자산을 선택하세요", ar: "اختر البورصة ونوع الأصل", ru: "Выберите биржу и тип актива", zh: "选择您的交易所和资产类型", es: "Elige tu exchange y tipo de activo" },
    recommended: { en: "Rec", ko: "권장", ar: "موصى", ru: "Рек.", zh: "推荐", es: "Rec" },
    comingSoon: { en: "Coming Soon", ko: "출시 예정", ar: "قريباً", ru: "Скоро", zh: "即将推出", es: "Próximamente" },
  }

  const exchanges = [
    {
      key: "okx" as ExchangeKey,
      name: "OKX",
      icon: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/tutorial_pic/OKX%20ICON.png",
      desc: { en: "[Recommended] Mobile + Server", ko: "[권장] 모바일x서버 구동 가능", ar: "[موصى به] موبايل + سيرفر", ru: "[Рекомендуется] Мобильный + Сервер", zh: "[推荐] ���动端 + 服务器", es: "[Recomendado] Móvil + Servidor" },
      recommended: true,
      disabled: false,
    },
    {
      key: "hyperliquid" as ExchangeKey,
      name: "HyperLiquid",
      icon: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/hyperliquid_icon.png",
      desc: { en: "Onchain perpetual exchange", ko: "온체인 무기한 거래소", ar: "منصة عقود دائمة على السلسلة", ru: "Ончейн бессрочная биржа", zh: "链上永续交易所", es: "Exchange perpetuo onchain" },
      disabled: true,
    },
  ]

  // Helper to get text with fallback to English
  const getText = (obj: { en: string; ko?: string; ar?: string; ru?: string; zh?: string; es?: string; id?: string; th?: string; vi?: string; tr?: string } | undefined): string => {
    if (!obj) return ""
    return (obj as Record<string, string | undefined>)[lang] ?? obj.en ?? ""
  }

  const ASSET_WATERMARKS: Record<string, string> = {
    btc: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/btc_symbol.png",
    gold: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/gold_symbol.png",
    silver: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/silver_symbol.png",
    tsla: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/tsla_symbol.png",
    spy: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/spysymbol.png",
    qqq: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/spysymbol.png",
  }

  const assets = [
    { key: "gold" as AssetKey, name: "XAU", desc: { en: "Gold Trading", ko: "골드 트레이딩", ar: "تداول الذهب", ru: "Торговля золотом", zh: "黄金交易", es: "Trading de Oro" }, recommended: true },
    { key: "spy" as AssetKey, name: "SPY", desc: { en: "S&P 500 Trading", ko: "S&P 500 트레이딩", ar: "تداول S&P 500", ru: "Торговля S&P 500", zh: "标普500交易", es: "Trading de S&P 500" } },
    { key: "btc" as AssetKey, name: "BTC", desc: { en: "Bitcoin Trading", ko: "비트코인 트레이딩", ar: "تداول البيتكوين", ru: "Торговля Bitcoin", zh: "比特币交易", es: "Trading de Bitcoin" } },
    { key: "qqq" as AssetKey, name: "QQQ", desc: { en: "Nasdaq Trading", ko: "나스닥 트레이딩", ar: "تداول ناسداك", ru: "Торговля Nasdaq", zh: "纳斯达克交易", es: "Trading de Nasdaq" } },
    { key: "silver" as AssetKey, name: "XAG", desc: { en: "Silver Trading", ko: "실버 트레이딩", ar: "تداول الفضة", ru: "Торговля серебром", zh: "白银交易", es: "Trading de Plata" } },
    { key: "tsla" as AssetKey, name: "TSLA", desc: { en: "Tesla Trading", ko: "테슬라 트레이딩", ar: "تداول Tesla", ru: "Торговля Tesla", zh: "特斯拉交易", es: "Trading de Tesla" } },
  ]

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="font-[var(--font-bebas)] text-4xl md:text-6xl tracking-tight">
          {getText(UI_TEXT.selectExchange)}
        </h1>
        <p className="mt-3 font-mono text-sm text-foreground/50">
          {getText(UI_TEXT.chooseExchangeAsset)}
        </p>
      </div>

      {/* Exchange cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {exchanges.map((ex) => {
          const selected = exchange === ex.key
          const isDisabled = ex.disabled
          return (
            <div
              key={ex.key}
              role="button"
              tabIndex={isDisabled ? -1 : 0}
              onPointerUp={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!isDisabled) onExchangeSelect(ex.key)
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!isDisabled) onExchangeSelect(ex.key)
              }}
              onKeyDown={(e) => { if (!isDisabled && (e.key === "Enter" || e.key === " ")) onExchangeSelect(ex.key) }}
              className={`relative rounded-xl border p-6 text-left transition-all duration-200 ${
                isDisabled
                  ? "border-foreground/10 bg-foreground/[0.03] opacity-50 cursor-not-allowed"
                  : selected
                    ? "border-accent bg-accent/5 ring-2 ring-accent/30"
                    : "border-foreground/15 bg-foreground/5 hover:border-foreground/30 cursor-pointer"
              }`}
            >
              {ex.recommended && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent text-background text-[10px] font-mono font-semibold uppercase">
                  {getText(UI_TEXT.recommended)}
                </span>
              )}
              {isDisabled && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full border border-foreground/20 text-foreground/50 text-[10px] font-mono font-semibold uppercase">
                  {getText(UI_TEXT.comingSoon)}
                </span>
              )}
              <div className="flex items-center gap-4">
                <img
                  src={ex.icon || "/placeholder.svg"}
                  alt={ex.name}
                  className={`w-14 h-14 rounded-lg object-contain ${isDisabled ? "grayscale" : ""}`}
                />
                <div>
                  <div className={`font-semibold ${isDisabled ? "text-foreground/50" : "text-foreground"}`}>{ex.name}</div>
                  <div className="text-xs text-foreground/50 mt-1">{getText(ex.desc)}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Asset selection (show for OKX) */}
      {exchange === "okx" && (
        <div className="space-y-4">
          <h3 className="text-center font-mono text-sm text-foreground/60 uppercase tracking-widest">
            {translations.server.selectAsset[lang] ?? translations.server.selectAsset.en}
          </h3>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {assets.map((a) => {
              const isSelected = asset === a.key
              return (
                <div
                  key={a.key}
                  role="button"
                  tabIndex={0}
                  onPointerUp={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onAssetSelect(a.key)
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onAssetSelect(a.key)
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onAssetSelect(a.key) }}
                  className={`relative overflow-hidden rounded-xl border p-5 text-center transition-all duration-200 cursor-pointer select-none ${
                    isSelected
                      ? "border-accent bg-accent/5 ring-2 ring-accent/30"
                      : "border-foreground/15 bg-foreground/5 hover:border-foreground/30"
                  }`}
                >
                  {/* REC badge for recommended assets */}
                  {a.recommended && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent text-background text-[10px] font-mono font-semibold uppercase z-20">
                      {getText(UI_TEXT.recommended)}
                    </span>
                  )}
                  {/* Watermark */}
                  {ASSET_WATERMARKS[a.key] && (
                    <img
                      src={ASSET_WATERMARKS[a.key]}
                      alt=""
                      className="absolute inset-0 m-auto w-[70%] h-[70%] object-contain opacity-[0.12] pointer-events-none"
                    />
                  )}
                  <div className="relative z-10 font-[var(--font-bebas)] text-2xl tracking-tight">{a.name}</div>
                  <div className="relative z-10 text-xs text-foreground/50 mt-1">{getText(a.desc)}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Debug panel hidden — kept in code for future debugging if needed */}
      <div className="hidden">
        <div>selectedExchange: {exchange || "none"} | selectedAsset: {asset || "none"}</div>
        <div>canProceed: {String(!!(exchange && asset))}</div>
        <div>lastClick: {lastClick || "none"}</div>
      </div>
    </div>
  )
}

// Unified Docker image tag (no asset-specific branching)
const UNIFIED_DOCKER_TAG = "exitant/buylow-okx-3.0:latest"

function applyAssetOverrides(section: ContentSection, step: number, asset: string | null): ContentSection {
  if (step !== 4 || !asset) return section

  let patched = section

  // Image src override for "Register Buylow AI Server (2)" section
  // Uses unified image for all assets
  if (section.heading?.en === "Register Buylow AI Server (2)" && section.image?.src) {
    patched = {
      ...patched,
      image: {
        ...patched.image!,
        src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/3.0_buylowdockerurl.png",
      },
    }
  }

  // Docker image text override - unified for all assets
  // Target: section heading "Register Buylow AI Server (2)" only
  if (
    section.heading?.en === "Register Buylow AI Server (2)" &&
    section.paragraphs?.[0]
  ) {
    const p0 = section.paragraphs[0]
    // Replace any existing docker tag pattern with the unified tag
    const dockerTagPattern = /exitant\/buylow-okx[^\s]*/g
    const patchedP0 = {
      ...p0,
      ko: (p0.ko ?? "").replace(dockerTagPattern, UNIFIED_DOCKER_TAG),
      en: (p0.en ?? "").replace(dockerTagPattern, UNIFIED_DOCKER_TAG),
      ar: (p0.ar ?? "").replace(dockerTagPattern, UNIFIED_DOCKER_TAG),
      ru: (p0.ru ?? "").replace(dockerTagPattern, UNIFIED_DOCKER_TAG),
      zh: (p0.zh ?? "").replace(dockerTagPattern, UNIFIED_DOCKER_TAG),
      es: (p0.es ?? "").replace(dockerTagPattern, UNIFIED_DOCKER_TAG),
    }
    const newParagraphs = [patchedP0, ...section.paragraphs.slice(1)]
    patched = { ...patched, paragraphs: newParagraphs }
  }

  return patched
}

// Helper to get multilingual text with fallback to English
function getTextFromObj(obj: { en: string; ko?: string; ar?: string; ru?: string; zh?: string; es?: string; id?: string; th?: string; vi?: string; tr?: string } | undefined, lang: Language): string {
  if (!obj) return ""
  return (obj as Record<string, string | undefined>)[lang] ?? obj.en ?? ""
}

// Step content renderer
function StepContent({
  content,
  lang,
  resolveLink,
  step,
  asset,
  onAction,
}: {
  content: { title: { en: string; ko?: string; ar?: string; ru?: string; zh?: string; es?: string }; sections: ContentSection[] }
  lang: Language
  resolveLink: (slot?: string, fallbackHref?: string) => string
  step: number
  asset: AssetKey | null
  onAction: (action: string) => void
}) {
  return (
    <div className="space-y-8">
      <h1 className="font-[var(--font-bebas)] text-3xl md:text-5xl tracking-tight text-center">
        {getTextFromObj(content.title, lang)}
      </h1>

      {content.sections.map((section, idx) => {
        const resolved = applyAssetOverrides(section, step, asset)
        return <SectionRenderer key={idx} section={resolved} lang={lang} resolveLink={resolveLink} onAction={onAction} />
      })}
    </div>
  )
}

// Single section renderer
// OKX Referral Code Switch Modal — multilingual content (10 languages)
const CODE_SWITCH_TEXT = {
  title:          { en: "★ Important Notice ★", ko: "★ 중요 안내 ★", ar: "★ إشعار مهم ★", ru: "★ Важное уведомление ★", zh: "★ 重要通知 ★", es: "★ Aviso Importante ★", id: "★ Pemberitahuan Penting ★", th: "★ ประกาศสำคัญ ★", vi: "★ Thông Báo Quan Trọng ★", tr: "★ Önemli Bildirim ★" },
  condTitle:      { en: "Conditions to switch referral to Buylow AI", ko: "Buylow AI로 레퍼럴 옮길 수 있는 조건", ar: "شروط تحويل الإحالة إلى Buylow AI", ru: "Условия перехода реферала на Buylow AI", zh: "将推荐切换到 Buylow AI 的条件", es: "Condiciones para cambiar referido a Buylow AI", id: "Syarat untuk mengalihkan referral ke Buylow AI", th: "เงื่อนไขในการเปลี่ยน referral เป็น Buylow AI", vi: "Điều kiện chuyển đ��i referral sang Buylow AI", tr: "Referalı Buylow AI'ye geçirme koşulları" },
  cond1:          { en: "1) At least 90 days since OKX account creation", ko: "1) 기존 OKX 계정 생성 후 90일 이상 경과", ar: "1) مرور 90 يوماً على الأقل منذ إنشاء حساب OKX", ru: "1) Не менее 90 дней с момента создания аккаунта OKX", zh: "1) OKX 账户创建至少 90 天", es: "1) Al menos 90 días desde la creación de la cuenta OKX", id: "1) Minimal 90 hari sejak pembuatan akun OKX", th: "1) อย่างน้อย 90 วันนับตั้งแต่สร้างบัญชี OKX", vi: "1) Ít nhất 90 ngày kể từ khi tạo tài khoản OKX", tr: "1) OKX hesabı oluşturulmasından itibaren en az 90 gün" },
  cond2:          { en: "2) Trading volume under 75,000 USD in the last 90 days", ko: "2) 최근 90일 거래량이 75,000 USD 이하", ar: "2) حجم التداول أقل من 75,000 دولار في آخر 90 يوماً", ru: "2) Объём торгов менее 75 000 USD за последние 90 дней", zh: "2) 最近 90 天交易量低于 75,000 美元", es: "2) Volumen de trading menor a 75,000 USD en los últimos 90 días", id: "2) Volume trading di bawah 75.000 USD dalam 90 hari terakhir", th: "2) ปริมาณการซื้อขายต่ำกว่า 75,000 USD ใน 90 วันที่ผ่านมา", vi: "2) Khối lượng giao dịch dưới 75.000 USD trong 90 ngày qua", tr: "2) Son 90 günde 75.000 USD'nin altında işlem hacmi" },
  howTitle:       { en: "How to swap your referral to Buylow AI", ko: "Buylow AI 레퍼럴 스왑 방법", ar: "كيفية تحويل إحالتك إلى Buylow AI", ru: "Как перенести реферала на Buylow AI", zh: "如何将推荐切换到 Buylow AI", es: "Cómo cambiar tu referido a Buylow AI", id: "Cara mengalihkan referral Anda ke Buylow AI", th: "วิธีเปลี่ยน referral ของคุณไปยัง Buylow AI", vi: "Cách chuyển đổi referral của bạn sang Buylow AI", tr: "Referalınızı Buylow AI'ye nasıl aktarırsınız" },
  step1:          { en: "1) Log in to your existing OKX account in the OKX app", ko: "1) OKX 앱에서 기존에 가입한 계정으로 로그인", ar: "1) سجّل الدخول إلى حساب OKX الحالي في تطبيق OKX", ru: "1) Войдите в существующий аккаунт OKX в приложении OKX", zh: "1) 在 OKX 应用中登录您现有的 OKX 账户", es: "1) Inicia sesión en tu cuenta OKX existente en la app de OKX", id: "1) Masuk ke akun OKX Anda yang sudah ada di aplikasi OKX", th: "1) เข้าสู่ระบบบัญชี OKX ที่มีอยู่ของคุณในแอป OKX", vi: "1) Đăng nhập vào tài khoản OKX hiện có của bạn trong ứng dụng OKX", tr: "1) OKX uygulamasında mevcut OKX hesabınıza giriş yapın" },
  step2:          { en: "2) Copy the Buylow AI swap invite code below", ko: "2) 아래 Buylow AI 전용 스왑 초대코드를 복사", ar: "2) انسخ رمز دعوة Buylow AI أدناه", ru: "2) Скопируйте код приглашения Buylow AI ниже", zh: "2) 复制下方的 Buylow AI 交换邀请码", es: "2) Copia el código de invitación de Buylow AI a continuación", id: "2) Salin kode undangan swap Buylow AI di bawah ini", th: "2) คัดลอกรหัสเชิญ swap Buylow AI ด้านล่าง", vi: "2) Sao chép mã mời swap Buylow AI bên dưới", tr: "2) Aşağıdaki Buylow AI swap davet kodunu kopyalayın" },
  step3:          { en: "3) Click the button below (must be logged in on the OKX app)", ko: "3) 아래 버튼 클릭 (OKX 앱에서 로그인 상태로 클릭 필수)", ar: "3) انقر على الزر أدناه (يجب أن تكون مسجلاً في تطبيق OKX)", ru: "3) Нажмите кнопку ниже (необходимо войти в приложение OKX)", zh: "3) 点击下方按钮（必须在 OKX 应用中登录状态下点击）", es: "3) Haz clic en el botón de abajo (debes estar conectado en la app de OKX)", id: "3) Klik tombol di bawah (harus sudah login di aplikasi OKX)", th: "3) คลิกปุ่มด้านล่าง (ต้องเข้าสู่ระบบในแอป OKX)", vi: "3) Nhấp vào nút bên dưới (phải đăng nhập trên ứng dụng OKX)", tr: "3) Aşağıdaki düğmeye tıklayın (OKX uygulamasında giriş yapmış olmalısınız)" },
  step3Btn:       { en: "OKX Referral Swap Application", ko: "OKX Buylow 레퍼럴 스왑 신청서", ar: "طلب تحويل إحالة OKX", ru: "Заявка на смену реферала OKX", zh: "OKX 推荐交换申请", es: "Solicitud de cambio de referido OKX", id: "Aplikasi Swap Referral OKX", th: "ใบสมัคร Swap Referral OKX", vi: "Đơn Chuyển Đổi Referral OKX", tr: "OKX Referral Swap Başvurusu" },
  step4:          { en: "4) How to fill out the OKX application", ko: "4) OKX 신청서 작성 방법", ar: "4) كيفية ملء طلب OKX", ru: "4) Как заполнить заявку OKX", zh: "4) 如何填写 OKX 申请表", es: "4) Cómo completar la solicitud de OKX", id: "4) Cara mengisi aplikasi OKX", th: "4) วิธีกรอกใบสมัคร OKX", vi: "4) Cách điền đơn OKX", tr: "4) OKX başvurusu nasıl doldurulur" },
  formField1Lbl:  { en: "(1) Referral code: ", ko: "(1) 레퍼럴 코드 입력: ", ar: "(1) رمز الإحالة: ", ru: "(1) Реферальный код: ", zh: "(1) 推荐码：", es: "(1) Código de referido: ", id: "(1) Kode referral: ", th: "(1) รหัส referral: ", vi: "(1) Mã referral: ", tr: "(1) Referral kodu: " },
  formField2Lbl:  { en: "(2) Reason for code change: ", ko: "(2) 코드 변경 사유: ", ar: "(2) سبب تغيير الرمز: ", ru: "(2) Причина смены кода: ", zh: "(2) 更改代码原因：", es: "(2) Razón del cambio de código: ", id: "(2) Alasan perubahan kode: ", th: "(2) เหตุผลในการเปลี่ยนรหัส: ", vi: "(2) Lý do thay đổi mã: ", tr: "(2) Kod değişikliği nedeni: " },
  formField2Val:  { en: "Change the reference code to use Buylow AI", ko: "Change the reference code to use Buylow AI", ar: "Change the reference code to use Buylow AI", ru: "Change the reference code to use Buylow AI", zh: "Change the reference code to use Buylow AI", es: "Change the reference code to use Buylow AI", id: "Change the reference code to use Buylow AI", th: "Change the reference code to use Buylow AI", vi: "Change the reference code to use Buylow AI", tr: "Change the reference code to use Buylow AI" },
  fallbackTitle:  { en: "(3) If the code change is not possible:", ko: "(3) 만약 코드 변경이 불가한 경우:", ar: "(3) إذا لم يكن تغيير الرمز ممكناً:", ru: "(3) Если смена кода невозможна:", zh: "(3) 如果无法更改代码：", es: "(3) Si el cambio de código no es posible:", id: "(3) Jika perubahan kode tidak memungkinkan:", th: "(3) หากไม่สามารถเปลี่ยนรหัสได้:", vi: "(3) Nếu không thể thay đổi mã:", tr: "(3) Kod değişikliği mümkün değilse:" },
  fallback1:      { en: "- Delete your existing OKX account", ko: "- 기존 OKX 계정 삭제", ar: "- احذف حساب OKX الحالي", ru: "- Удалите существующий аккаунт OKX", zh: "- 删除您现有的 OKX 账户", es: "- Elimina tu cuenta OKX existente", id: "- Hapus akun OKX Anda yang sudah ada", th: "- ลบบัญชี OKX ที่มีอยู่ของคุณ", vi: "- Xóa tài khoản OKX hiện có của bạn", tr: "- Mevcut OKX hesabınızı silin" },
  fallback2:      { en: "- Re-register after 30 days", ko: "- 30일 후 재가입 필요", ar: "- أعد التسجيل بعد 30 يوماً", ru: "- Повторная регистрация через 30 дней", zh: "- 30 天后重新注册", es: "- Vuelve a registrarte después de 30 días", id: "- Daftar ulang setelah 30 hari", th: "- ลงทะเบียนใหม่หลังจาก 30 วัน", vi: "- Đăng ký lại sau 30 ng��y", tr: "- 30 gün sonra tekrar kayıt olun" },
} as const

function OkxCodeSwitchModal({ lang, onClose, pageId }: { lang: Language; onClose: () => void; pageId?: string }) {
  const t = (key: keyof typeof CODE_SWITCH_TEXT) => getTextFromObj(CODE_SWITCH_TEXT[key], lang)
  
  // Safe helper to get referral code/image with fallback
  const getSwapCode = () => getServerOverrideLink("okx.referral.swap.code", pageId) || DEFAULT_LINKS["okx.referral.swap.code"]
  const getSwapImage = () => getServerOverrideLink("okx.referral.swap.image", pageId) || DEFAULT_LINKS["okx.referral.swap.image"]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-foreground/15 bg-background shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-foreground/10 bg-background/95 backdrop-blur-sm">
          <h2 className="font-[var(--font-bebas)] text-2xl tracking-tight text-accent">
            {t("title")}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
          >
            {"×"}
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6 text-sm text-foreground/80 leading-relaxed">
          {/* Section 1 — conditions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-base">{t("condTitle")}</h3>
            <div className="space-y-1.5 pl-1">
              <p>{t("cond1")}</p>
              <p>{t("cond2")}</p>
            </div>
          </div>

          <div className="border-t border-foreground/10" />

          {/* Section 2 — how-to */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">{t("howTitle")}</h3>

            {/* Step 1 */}
            <div className="space-y-1">
              <p className="font-medium text-foreground/90">{t("step1")}</p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <p className="font-medium text-foreground/90">{t("step2")}</p>
              <div className="flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
<span className="font-mono text-lg font-bold text-accent tracking-wider">{getSwapCode()}</span>
  <button
onClick={() => { navigator.clipboard.writeText(getSwapCode()) }}
                  className="ml-auto px-3 py-1 rounded-md border border-foreground/15 font-mono text-xs text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <p className="font-medium text-foreground/90">{t("step3")}</p>
              <a
                href="https://www.okx.com/ul/J6l2R5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-background font-mono text-xs font-semibold uppercase tracking-wide hover:bg-accent/90 transition-colors"
              >
                {t("step3Btn")}
                <ChevronRight size={14} />
              </a>
            </div>

            {/* Step 4 */}
            <div className="space-y-3">
              <p className="font-medium text-foreground/90">{t("step4")}</p>

              <div className="rounded-lg border border-foreground/10 overflow-hidden">
  <img
  src={getSwapImage()}
alt="OKX referral code change guide"
                  className="w-full h-auto"
                />
              </div>

              <div className="space-y-2 pl-1">
                <p>
  <span className="text-foreground/60">{t("formField1Lbl")}</span>
<span className="font-mono font-semibold text-accent">{getSwapCode()}</span>
                </p>
                <p>
                  <span className="text-foreground/60">{t("formField2Lbl")}</span>
                  <span className="font-mono text-foreground/90">{t("formField2Val")}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-foreground/10" />

          {/* Fallback notice */}
          <div className="space-y-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="font-medium text-red-400">{t("fallbackTitle")}</p>
            <div className="space-y-1 text-foreground/60 pl-1">
              <p>{t("fallback1")}</p>
              <p>{t("fallback2")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Coming Soon Modal
function ComingSoonModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[85vw] max-w-sm rounded-2xl border border-foreground/15 bg-background p-8 text-center shadow-2xl">
        <h2 className="font-[var(--font-bebas)] text-3xl tracking-tight text-accent">
          Coming Soon
        </h2>
        <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
          This feature is under preparation.<br />
          {"We'll update it soon."}
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-8 py-2.5 rounded-lg border border-foreground/20 font-mono text-xs uppercase tracking-wider text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors cursor-pointer"
        >
          OK
        </button>
      </div>
    </div>
  )
}

function SectionRenderer({
  section,
  lang,
  resolveLink,
  onAction,
}: {
  section: ContentSection
  lang: Language
  resolveLink: (slot?: string, fallbackHref?: string) => string
  onAction: (action: string) => void
}) {
  if (section.layout === "imageCard" && section.cards) {
    return (
      <div className="space-y-4">
        {section.heading && (
          <h3 className="font-semibold text-lg text-foreground/90">{getTextFromObj(section.heading, lang)}</h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {section.cards.map((card, i) =>
            card.href ? (
              <a
                key={i}
                href={card.href}
                {...(card.href.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className="block rounded-xl border border-foreground/10 overflow-hidden hover:border-foreground/25 transition-colors"
              >
                <img src={card.image.src} alt={card.image.alt} className="w-full h-auto" />
              </a>
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => onAction("comingSoon")}
                className="rounded-xl border border-foreground/10 overflow-hidden hover:border-foreground/25 transition-colors cursor-pointer text-left"
              >
                <img src={card.image.src} alt={card.image.alt} className="w-full h-auto" />
              </button>
            ),
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] overflow-hidden">
      {/* Image */}
      {section.image && (
        <div className="w-full">
          <img
            src={section.image.src || "/placeholder.svg"}
            alt={section.image.alt}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Text content */}
      <div className="p-5 md:p-6 space-y-4">
        {section.heading && (
          <h3 className="font-semibold text-lg text-foreground/90">
            {getTextFromObj(section.heading, lang)}
          </h3>
        )}

        {section.paragraphs?.map((p, i) => {
          let html = getTextFromObj(p, lang)
          // Convert **text** markdown bold to warn-red spans (skip if already has warn-red)
          if (!html.includes("warn-red") && html.includes("**")) {
            html = html.replace(/\*\*(.+?)\*\*/g, '<span class="warn-red"><strong>$1</strong></span>')
          }
          return (
            <div
              key={i}
              className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line [&_.warn-red]:text-red-400 [&_.warn-red]:font-semibold"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        })}

        {/* Link button */}
        {section.link && (
          <a
            href={resolveLink(section.link.slot, section.link.href)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-background font-mono text-xs font-semibold uppercase tracking-wide hover:bg-accent/90 transition-colors"
          >
            {getTextFromObj(section.link.label, lang)}
            <ChevronRight size={14} />
          </a>
        )}

        {/* Action buttons */}
        {section.buttons?.map((btn, i) => (
          <button
            key={i}
            onClick={() => {
              if (btn.action) {
                onAction(btn.action)
              } else if (btn.href === "#back-to-step-1") {
                window.history.back()
              } else if (btn.href) {
                window.open(btn.href, "_blank")
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-foreground/20 text-foreground/70 font-mono text-xs hover:text-foreground hover:border-foreground/40 transition-colors cursor-pointer"
          >
            {getTextFromObj(btn.label, lang)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ServerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="font-mono text-foreground/50 text-sm">Loading...</div>
        </div>
      }
    >
      <ServerPageContent />
    </Suspense>
  )
}
