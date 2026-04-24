"use client"

import { useState, useEffect, Suspense, createContext, useContext, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight, Menu, X, BookOpen, ChevronDown, ArrowRight, Lock, Send } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { type SupportedLang } from "@/lib/i18n"
import { InlineCountdown } from "@/components/countdown-banner"
import { getMarketerOverrideLink } from "@/data/server/link-map"
import { DEFAULT_LINKS } from "@/data/server/link-slots"

type Lang = SupportedLang

// ===== EBOOK CTA TRANSLATIONS (same as /proof page) =====
const EBOOK_CTA_TRANSLATIONS: Record<string, {
  ctaTitle: string
  ctaText: string
  ctaButton: string
  ctaGuidance: string
}> = {
  ko: {
    ctaTitle: "마지막으로 선착순 100명만 더 뽑도록 하겠다",
    ctaText: "너무 많은 사람들이 퀀트 프로그램을 받아가는 바람에 반복적인 '호가창' 및 '주문패턴'으로 인해 MM(마켓메이커)들이 스탑로스 사냥을 할 수도 있다.",
    ctaButton: "가이드 시작하기",
    ctaGuidance: "가이드 시작하기 버튼을 누른 뒤, 비밀번호를 입력하면 AI 자동매매 가이드를 바로 시작할 수 있습니다.",
  },
  en: {
    ctaTitle: "Last Call: Only 100 More Spots Available",
    ctaText: "Too many people are getting the quant program, which could lead to stop-loss hunting by market makers due to repetitive order patterns.",
    ctaButton: "Start Guide",
    ctaGuidance: "After clicking 'Start Guide', enter the password to access the AI automated trading guide immediately.",
  },
  zh: {
    ctaTitle: "最后通知：仅剩100个名额",
    ctaText: "太多人获取了量化程序，由于重复的订单模式，可能导致做市商进行止损狩猎。",
    ctaButton: "开始指南",
    ctaGuidance: "点击'开始指南'后，输入密码即可立即访问AI自动交易指南。",
  },
  ar: {
    ctaTitle: "النداء الأخير: 100 مكان فقط متاح",
    ctaText: "الكثير من الناس يحصلون على برنامج التداول الكمي، مما قد يؤدي إلى صيد وقف الخسارة من قبل صناع السوق بسبب أنماط الطلبات المتكررة.",
    ctaButton: "بدء الدليل",
    ctaGuidance: "بعد النقر على 'بدء الدليل'، أدخل كلمة المرور للوصول إلى دليل التداول الآلي بالذكاء الاصطناعي فوراً.",
  },
  ru: {
    ctaTitle: "Последний звонок: осталось только 100 мест",
    ctaText: "Слишком много людей получают квант-программу, что может привести к охоте на стоп-лоссы маркет-мейкерами из-за повторяющихся паттернов заказов.",
    ctaButton: "Начать руководство",
    ctaGuidance: "После нажатия 'Начать руководство' введите пароль, чтобы сразу получить доступ к руководству по автоматической торговле AI.",
  },
  es: {
    ctaTitle: "Última llamada: Solo quedan 100 lugares disponibles",
    ctaText: "Demasiadas personas están obteniendo el programa cuantitativo, lo que podría llevar a la caza de stop-loss por parte de los creadores de mercado debido a patrones de órdenes repetitivos.",
    ctaButton: "Iniciar guía",
    ctaGuidance: "Después de hacer clic en 'Iniciar guía', ingresa la contraseña para acceder a la guía de trading automatizado de IA inmediatamente.",
  },
  id: {
    ctaTitle: "Panggilan Terakhir: Hanya 100 Tempat Tersisa",
    ctaText: "Terlalu banyak orang mendapatkan program kuantitatif, yang dapat menyebabkan perburuan stop-loss oleh market maker karena pola order yang berulang.",
    ctaButton: "Mulai Panduan",
    ctaGuidance: "Setelah mengklik 'Mulai Panduan', masukkan kata sandi untuk mengakses panduan trading otomatis AI segera.",
  },
  th: {
    ctaTitle: "โอกาสสุดท้าย: เหลือเพียง 100 ที่เท่านั้น",
    ctaText: "มีคนจำนวนมากเกินไปที่ได้รับโปรแกรม Quant ซึ่งอาจนำไปสู่การล่า Stop-loss โดย Market Maker เนื่องจากรูปแบบคำสั่งที่ซ้ำกัน",
    ctaButton: "เริ่มคู่มือ",
    ctaGuidance: "หลังจากคลิก 'เริ่มคู่มือ' ให้กรอกรหัสผ่านเพื่อเข้าถึงคู่มือการเทรดอัตโนมัติ AI ทันที",
  },
  vi: {
    ctaTitle: "Cuộc gọi cuối cùng: Chỉ còn 100 suất",
    ctaText: "Quá nhiều người nhận được chương trình quant, điều này có thể dẫn đến việc săn stop-loss bởi các nhà tạo lập thị trường do các mẫu lệnh lặp đi lặp lại.",
    ctaButton: "Bắt đầu hướng dẫn",
    ctaGuidance: "Sau khi nhấp vào 'Bắt đầu hướng dẫn', nhập mật khẩu để truy cập hướng dẫn giao dịch tự động AI ngay lập tức.",
  },
  tr: {
    ctaTitle: "Son Çağrı: Sadece 100 Yer Kaldı",
    ctaText: "Çok fazla kişi kuant programını alıyor, bu da tekrarlayan emir kalıpları nedeniyle piyasa yapıcılar tarafından stop-loss avına yol açabilir.",
    ctaButton: "Rehbere Başla",
    ctaGuidance: "'Rehbere Başla' düğmesine tıkladıktan sonra, AI otomatik ticaret rehberine hemen erişmek için şifreyi girin.",
  },
}

// ===== TEST CTA TRANSLATIONS =====
const TEST_CTA_TRANSLATIONS: Record<string, {
  sectionTitle: string
  title: string
  description1: string
  description2: string
  buttonText: string
}> = {
  ko: {
    sectionTitle: "추가 미션",
    title: "BUYLOW AI 시험 치러가기",
    description1: "전자책 내용을 충분히 이해했는지 확인하는 단계입니다",
    description2: "시험을 통과해야 다음 단계로 진행할 수 있습니다",
    buttonText: "시험 보러 가기",
  },
  en: {
    sectionTitle: "Additional Mission",
    title: "Take the BUYLOW AI Test",
    description1: "This step confirms you fully understand the ebook content",
    description2: "You must pass the test to proceed to the next step",
    buttonText: "Take Test",
  },
  zh: {
    sectionTitle: "额外任务",
    title: "参加 BUYLOW AI 测试",
    description1: "此步骤确认您完全理解电子书内容",
    description2: "您必须通过测试才能进入下一步",
    buttonText: "参加测试",
  },
  ar: {
    sectionTitle: "مهمة إضافية",
    title: "خذ اختبار BUYLOW AI",
    description1: "هذه الخطوة تؤكد أنك تفهم محتوى الكتاب الإلكتروني بشكل كامل",
    description2: "يجب عليك اجتياز الاختبار للمتابعة إلى الخطوة التالية",
    buttonText: "بدء ال��ختبار",
  },
  ru: {
    sectionTitle: "Дополнительная миссия",
    title: "Пройдите тест BUYLOW AI",
    description1: "Этот шаг подт���рждает, что вы полностью понимаете содержание электронной книги",
    description2: "Вы должны пройти тест, чтобы перейти к следующему шагу",
    buttonText: "Пройти т����ст",
  },
  es: {
    sectionTitle: "Misión adicional",
    title: "Realiza el examen de BUYLOW AI",
    description1: "Este paso confirma que comprendes completamente el contenido del ebook",
    description2: "Debes aprobar el examen para pasar al siguiente paso",
    buttonText: "Hacer examen",
  },
  id: {
    sectionTitle: "Misi Tambahan",
    title: "Ikuti Ujian BUYLOW AI",
    description1: "Langkah ini mengkonfirmasi bahwa Anda sepenuhnya memahami konten ebook",
    description2: "Anda harus lulus ujian untuk melanjutkan ke langkah berikutnya",
    buttonText: "Ikuti Ujian",
  },
  th: {
    sectionTitle: "ภารกิจเพิ่มเติม",
    title: "ทำข้อสอบ BUYLOW AI",
    description1: "ขั้นตอนนี้ยืนยันว่าคุณเข้าใจเนื้อหา ebook อย่างครบถ้วน",
    description2: "คุณต้องผ่านการทดสอบเพื่อไปยังขั้นตอนถัดไป",
    buttonText: "เริ่มทำข้อสอบ",
  },
  vi: {
    sectionTitle: "Nhiệm vụ bổ sung",
    title: "Làm bài kiểm tra BUYLOW AI",
    description1: "Bước này xác nhận bạn đã hiểu đầy đủ nội dung ebook",
    description2: "Bạn phải vượt qua bài kiểm tra để tiến tới bước tiếp theo",
    buttonText: "Làm bài kiểm tra",
  },
  tr: {
    sectionTitle: "Ek Görev",
    title: "BUYLOW AI Sınavına Girin",
    description1: "Bu adım, e-kitap içeriğini tam olarak anladığınızı doğrular",
    description2: "Bir sonraki adıma geçmek için sınavı geçmeniz gerekir",
    buttonText: "Sınava Başla",
  },
}

// ===== MARKETER ID CONTEXT =====
const MarketerIdContext = createContext<string | undefined>(undefined)

export function useMarketerId() {
  return useContext(MarketerIdContext)
}

// ===== GUIDE PASSWORD =====
// This is the password users need to access /server guide after reading the ebook
const GUIDE_PASSWORD = "buylowai"

// Password hint translations
const PASSWORD_HINT_TRANSLATIONS: Record<string, {
  label: string
  hint: string
  cta: string
  ctaButton: string
  clickToReveal: string
  revealed: string
}> = {
  ko: {
    label: "가이드 비밀번호",
    hint: "전자책을 읽은 독자만 가이드에 접근할 수 있습니다",
    cta: "지금 시작하기",
    ctaButton: "가이드 시작하기",
    clickToReveal: "터치해서 비밀번호 확인",
    revealed: "비밀번호가 표시되었습니다",
  },
  en: {
    label: "Guide Password",
    hint: "Only readers who have read the ebook can access the guide",
    cta: "Start Now",
    ctaButton: "Start Guide",
    clickToReveal: "Tap to reveal password",
    revealed: "Password revealed",
  },
  zh: {
    label: "指南密码",
    hint: "只有阅读过电子书的读者才能访问指南",
    cta: "立即开始",
    ctaButton: "开始指南",
    clickToReveal: "点击显示密码",
    revealed: "密码已显示",
  },
  ar: {
    label: "كلمة مرور الدليل",
    hint: "فقط القراء الذين قرأوا الكتاب الإلكتروني يمكنهم الوصول إلى الدليل",
    cta: "ابدأ الآن",
    ctaButton: "بدء الدليل",
    clickToReveal: "انقر لإظهار كلمة المرور",
    revealed: "تم إظهار كلمة المرور",
  },
  ru: {
    label: "Пароль руководства",
    hint: "Только читатели, прочитавшие электронную книгу, могут получить доступ к руководству",
    cta: "Начать сейчас",
    ctaButton: "Начать руководство",
    clickToReveal: "Нажмите, чтобы показать пароль",
    revealed: "Пароль показан",
  },
  es: {
    label: "Contraseña de la guía",
    hint: "Solo los lectores que hayan leído el ebook pueden acceder a la guía",
    cta: "Comenzar ahora",
    ctaButton: "Iniciar guía",
    clickToReveal: "Toca para revelar la contraseña",
    revealed: "Contraseña revelada",
  },
  th: {
    label: "รหัสผ่านคู่มือ",
    hint: "เฉพาะผู้อ่านที่อ่าน ebook แล้วเท่านั้นที่สามารถเข้าถึงคู่มือได้",
    cta: "เริ่มเลย",
    ctaButton: "เริ่มคู่มือ",
    clickToReveal: "แตะเพื่อดูรหัสผ่าน",
    revealed: "แสดงรหัสผ่านแล้ว",
  },
  vi: {
    label: "Mật khẩu hướng dẫn",
    hint: "Chỉ những độc giả đã đọc ebook mới có thể truy cập hướng dẫn",
    cta: "Bắt đầu ngay",
    ctaButton: "Bắt đầu hướng dẫn",
    clickToReveal: "Nhấn để hiện mật khẩu",
    revealed: "Mật khẩu đã hiện",
  },
  tr: {
    label: "Rehber Şifresi",
    hint: "Sadece e-kitabı okuyan okuyucular rehbere erişebilir",
    cta: "Şimdi Başla",
    ctaButton: "Rehbere Başla",
    clickToReveal: "Şifreyi görmek için dokunun",
    revealed: "Şifre gösterildi",
  },
  id: {
    label: "Kata Sandi Panduan",
    hint: "Hanya pembaca yang telah membaca ebook yang dapat mengakses panduan",
    cta: "Mulai Sekarang",
    ctaButton: "Mulai Panduan",
    clickToReveal: "Ketuk untuk menampilkan kata sandi",
    revealed: "Kata sandi ditampilkan",
  },
}

// Mosaic/Blur Password Reveal Component - Click to reveal password
function PasswordMosaicReveal({ lang }: { lang: string }) {
  const [isRevealed, setIsRevealed] = useState(false)
  const t = PASSWORD_HINT_TRANSLATIONS[lang] || PASSWORD_HINT_TRANSLATIONS.en

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-cyan-500/10 to-accent/5 border border-cyan-500/30 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <Lock size={20} className="text-cyan-400" />
        </div>
        <div className="text-lg font-bold text-cyan-400">{t.label}</div>
      </div>

      {/* Mosaic/Blur Password Box - Click to reveal */}
      <button
        onClick={() => setIsRevealed(true)}
        disabled={isRevealed}
        className="w-full group"
      >
        <div
          className={`relative bg-background/50 border border-foreground/10 rounded-xl p-5 text-center mb-3 transition-all duration-500 ${!isRevealed ? "cursor-pointer hover:border-accent/30 hover:bg-background/70" : ""
            }`}
        >
          {/* Password text with blur/mosaic effect */}
          <div className="relative">
            <span
              className={`font-mono text-2xl md:text-3xl font-bold text-accent tracking-widest transition-all duration-500 select-all ${isRevealed ? "" : "blur-md select-none"
                }`}
            >
              {GUIDE_PASSWORD}
            </span>

            {/* Overlay when not revealed */}
            {!isRevealed && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-transparent via-background/30 to-transparent">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                  <Lock size={16} className="text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-400">{t.clickToReveal}</span>
                </div>
              </div>
            )}
          </div>

          {/* Revealed indicator */}
          {isRevealed && (
            <div className="mt-2 text-xs text-accent/70">{t.revealed}</div>
          )}
        </div>
      </button>

      <p className="text-sm text-foreground/60 text-center">{t.hint}</p>
    </div>
  )
}

// Legacy Password hint box component - displays password in a highlighted box (for inline hints)
function PasswordHintBox({ lang }: { lang: string }) {
  const t = PASSWORD_HINT_TRANSLATIONS[lang] || PASSWORD_HINT_TRANSLATIONS.en
  return (
    <div className="my-8 p-6 bg-gradient-to-br from-cyan-500/10 to-accent/5 border border-cyan-500/30 rounded-2xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <Lock size={20} className="text-cyan-400" />
        </div>
        <div className="text-lg font-bold text-cyan-400">{t.label}</div>
      </div>
      <div className="bg-background/50 border border-foreground/10 rounded-xl p-4 text-center mb-3">
        <span className="font-mono text-2xl font-bold text-accent tracking-widest">{GUIDE_PASSWORD}</span>
      </div>
      <p className="text-sm text-foreground/60 text-center">{t.hint}</p>
    </div>
  )
}

// Full conversion CTA section for ebook (same structure as /proof page)
// Links to /server/[id] with marketer ID preserved
function EbookCTAButton({ lang }: { lang: string }) {
  const marketerId = useMarketerId()
  const ctaT = EBOOK_CTA_TRANSLATIONS[lang] || EBOOK_CTA_TRANSLATIONS.en
  const serverUrl = marketerId ? `/server/${marketerId}` : "/server"

  return (
    <div className="my-16">
      {/* [A] Copy Area (outside box) */}
      <section className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
          {ctaT.ctaTitle}
        </h2>
        <p className="text-foreground/60 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
          {ctaT.ctaText}
        </p>
      </section>

      {/* [B] Countdown Box - Simplified */}
      <section className="text-center">
        <div
          className="bg-gradient-to-b from-accent/10 to-transparent border border-accent/30 rounded-2xl p-6 md:p-10"
          style={{
            boxShadow: "0 0 60px rgba(31, 224, 165, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Weekly Countdown Timer */}
          <InlineCountdown />

          <a
            href={serverUrl}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-background font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-accent/90"
            style={{
              boxShadow: "0 0 30px rgba(31, 224, 165, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
            }}
          >
            {ctaT.ctaButton}
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Guidance text below button */}
          <p className="mt-6 text-sm text-foreground/50 text-center max-w-md mx-auto leading-relaxed">
            {ctaT.ctaGuidance}
          </p>
        </div>
      </section>
    </div>
  )
}

// Test CTA component - Links to /test with marketer ID preserved
function TestCTA({ lang }: { lang: string }) {
  const marketerId = useMarketerId()
  const t = TEST_CTA_TRANSLATIONS[lang] || TEST_CTA_TRANSLATIONS.en
  const testUrl = marketerId ? `/test/${marketerId}` : "/test"

  return (
    <div className="my-12">
      <SectionTitle>{t.sectionTitle}</SectionTitle>

      <div
        className="mt-8 p-6 md:p-8 bg-gradient-to-b from-cyan-500/10 to-accent/5 border border-cyan-500/30 rounded-2xl text-center"
        style={{
          boxShadow: "0 0 40px rgba(6, 182, 212, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4">
          {t.title}
        </h3>

        {/* Description */}
        <div className="space-y-2 mb-6">
          <p className="text-foreground/70 text-sm md:text-base">{t.description1}</p>
          <p className="text-foreground/50 text-sm">{t.description2}</p>
        </div>

        {/* CTA Button */}
        <a
          href={testUrl}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 text-background font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-cyan-400"
          style={{
            boxShadow: "0 0 30px rgba(6, 182, 212, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
          }}
        >
          {t.buttonText}
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  )
}

// Strategy Button component - Links to /strategy with marketer ID and lang preserved
const STRATEGY_BUTTON_TRANSLATIONS: Record<string, string> = {
  ko: "전략 기능 살펴보기 →",
  en: "Explore Strategy Features →",
  zh: "探索策略功能 →",
  ar: "استكشف ميزات الاستراتيجية →",
  ru: "Изучить функции стратегии →",
  es: "Explorar funciones de estrategia →",
  id: "Jelajahi Fitur Strategi →",
  th: "สำรวจฟีเจอร์กลยุทธ์ →",
  vi: "Khám phá tính năng chiến lược →",
  tr: "Strateji Özelliklerini Keşfet →",
}

function StrategyButton({ lang }: { lang: string }) {
  const marketerId = useMarketerId()
  const buttonText = STRATEGY_BUTTON_TRANSLATIONS[lang] || STRATEGY_BUTTON_TRANSLATIONS.en

  // Build URL with marketer ID and language
  let strategyUrl = "/strategy"
  if (marketerId) {
    strategyUrl = `/strategy/${marketerId}`
  }
  if (lang) {
    strategyUrl += `?lang=${lang}`
  }

  return (
    <div className="my-6 text-center">
      <a
        href={strategyUrl}
        className="inline-block px-6 py-3 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400 font-bold hover:bg-cyan-500/30 transition-colors"
      >
        {buttonText}
      </a>
    </div>
  )
}

// Telegram Community Section - Official community entry card with marketer-specific links
const TELEGRAM_COMMUNITY_TRANSLATIONS: Record<string, {
  badgeLive: string
  badgeProfit: string
  badgeReviews: string
  title: string
  statMembers: string
  statShares: string
  statReviews: string
  description: string
  subtext: string
  ctaButton: string
  reviewTitle: string
  review1: string
  review2: string
  review3: string
}> = {
  ko: {
    badgeLive: "실거동",
    badgeProfit: "실수익 공유중",
    badgeReviews: "실사용자 후기",
    title: "이미 수천 명이 확인 중인 공식 커뮤니티",
    statMembers: "참여자",
    statShares: "수익 공유",
    statReviews: "후기",
    description: "실제 후기와 수익 공유를 직접 확인하세요. 많은 사용자가 이미 참여 중입니다.",
    subtext: "커뮤니티에 입장한 뒤 후기까지 남겨주시면 큰 힘이 됩니다.",
    ctaButton: "텔레그램 방 입장하기",
    reviewTitle: "커뮤니티 입장 후 후기도 남겨주세요",
    review1: "커뮤니티에서 사용 후기 남기기",
    review2: "블로그 후기 작성하기",
    review3: "프로그램 사용 경험 공유하기",
  },
  en: {
    badgeLive: "Live Trading",
    badgeProfit: "Profit Sharing",
    badgeReviews: "Real Reviews",
    title: "Join the Official Community Thousands Already Use",
    statMembers: "Members",
    statShares: "Profit Shares",
    statReviews: "Reviews",
    description: "See real reviews and profit shares firsthand. Many users are already participating.",
    subtext: "Your review after joining the community means a lot to us.",
    ctaButton: "Join Telegram Channel",
    reviewTitle: "Leave a review after joining the community",
    review1: "Share your experience in the community",
    review2: "Write a blog review",
    review3: "Share your program usage experience",
  },
  zh: {
    badgeLive: "实时交易",
    badgeProfit: "收益分享中",
    badgeReviews: "真实用户评价",
    title: "数千人正在使用的官方社区",
    statMembers: "参与者",
    statShares: "收益分享",
    statReviews: "评价",
    description: "亲眼见证真实评价和收益分享。许多用户已经在参与。",
    subtext: "加入社区后留下评价对我们意义重大。",
    ctaButton: "加入Telegram频道",
    reviewTitle: "加入社区后请留下评价",
    review1: "在社区分享使用体验",
    review2: "撰写博客评价",
    review3: "分享程序使用经验",
  },
  ar: {
    badgeLive: "تداول مباشر",
    badgeProfit: "مشاركة الأرباح",
    badgeReviews: "تقييمات حقيقية",
    title: "انضم إلى المجتمع الرسمي الذي يستخدمه الآلاف",
    statMembers: "الأعضاء",
    statShares: "مشاركات الربح",
    statReviews: "التقييمات",
    description: "شاهد التقييمات الحقيقية ومشاركات الأرباح بنفسك. العديد من المستخدمين يشاركون بالفعل.",
    subtext: "تقييمك بعد الانضمام للمجتمع يعني الكثير لنا.",
    ctaButton: "انضم لقناة تيليجرام",
    reviewTitle: "اترك تقييمًا بعد الانضمام للمجتمع",
    review1: "شارك تجربتك في المجتمع",
    review2: "اكتب تقييمًا في مدونتك",
    review3: "شارك تجربة استخدام البرنامج",
  },
  ru: {
    badgeLive: "Живая торговля",
    badgeProfit: "Делимся прибылью",
    badgeReviews: "Реальные отзывы",
    title: "Официальное сообщество, которое уже используют тысячи",
    statMembers: "Участники",
    statShares: "Прибыль",
    statReviews: "Отзывы",
    description: "Увидьте реальные отзывы и результаты своими глазами. Многие уже участвуют.",
    subtext: "Ваш отзыв после вступления в сообщество много значит для нас.",
    ctaButton: "Войти в Telegram",
    reviewTitle: "Оставьте отзыв после вступления",
    review1: "Поделитесь опытом в сообществе",
    review2: "Напишите отзыв в блоге",
    review3: "Поделитесь опытом использования",
  },
  es: {
    badgeLive: "Trading en vivo",
    badgeProfit: "Compartiendo ganancias",
    badgeReviews: "Reseñas reales",
    title: "Únete a la comunidad oficial que miles ya usan",
    statMembers: "Miembros",
    statShares: "Ganancias",
    statReviews: "Reseñas",
    description: "Ve reseñas reales y ganancias compartidas de primera mano. Muchos usuarios ya participan.",
    subtext: "Tu reseña después de unirte significa mucho para nosotros.",
    ctaButton: "Unirse a Telegram",
    reviewTitle: "Deja una reseña después de unirte",
    review1: "Comparte tu experiencia en la comunidad",
    review2: "Escribe una reseña en tu blog",
    review3: "Comparte tu experiencia con el programa",
  },
  id: {
    badgeLive: "Trading Langsung",
    badgeProfit: "Berbagi Profit",
    badgeReviews: "Ulasan Nyata",
    title: "Bergabung dengan Komunitas Resmi yang Digunakan Ribuan Orang",
    statMembers: "Anggota",
    statShares: "Profit",
    statReviews: "Ulasan",
    description: "Lihat ulasan dan profit nyata secara langsung. Banyak pengguna sudah berpartisipasi.",
    subtext: "Ulasan Anda setelah bergabung sangat berarti bagi kami.",
    ctaButton: "Gabung Telegram",
    reviewTitle: "Tinggalkan ulasan setelah bergabung",
    review1: "Bagikan pengalaman di komunitas",
    review2: "Tulis ulasan di blog",
    review3: "Bagikan pengalaman penggunaan program",
  },
  th: {
    badgeLive: "เทรดสด",
    badgeProfit: "แชร์กำไร",
    badgeReviews: "รีวิวจริง",
    title: "เข้าร่วมชุมชนทางการที่คนหลายพันใช้",
    statMembers: "สมาชิก",
    statShares: "กำไร",
    statReviews: "รีวิว",
    description: "ดูรีวิวจริงและการแชร์กำไรด้วยตัวเอง หลายคนเข้าร่วมแล้ว",
    subtext: "รีวิวของคุณหลังเข้าร่วมมีความหมายมากสำหรับเรา",
    ctaButton: "เข้า Telegram",
    reviewTitle: "ฝากรีวิวหลังเข้าร่วม",
    review1: "แชร์ประสบการณ์ในชุมชน",
    review2: "เขียนรีวิวในบล็อก",
    review3: "แชร์ประสบการณ์ใช้โปรแกรม",
  },
  vi: {
    badgeLive: "Giao dịch trực tiếp",
    badgeProfit: "Chia sẻ lợi nhuận",
    badgeReviews: "Đánh giá thực",
    title: "Tham gia cộng đồng chính thức hàng ngàn người sử dụng",
    statMembers: "Thành viên",
    statShares: "Lợi nhuận",
    statReviews: "Đánh giá",
    description: "Xem đánh giá thực và lợi nhuận được chia sẻ. Nhiều người dùng đã tham gia.",
    subtext: "Đánh giá của bạn sau khi tham gia rất có ý nghĩa với chúng tôi.",
    ctaButton: "Vào Telegram",
    reviewTitle: "Để lại đánh giá sau khi tham gia",
    review1: "Chia sẻ trải nghiệm trong cộng đồng",
    review2: "Viết đánh giá trên blog",
    review3: "Chia sẻ trải nghiệm sử dụng chương trình",
  },
  tr: {
    badgeLive: "Canlı İşlem",
    badgeProfit: "Kar Paylaşımı",
    badgeReviews: "Gerçek Yorumlar",
    title: "Binlerce Kişinin Kullandığı Resmi Topluluğa Katıl",
    statMembers: "Üyeler",
    statShares: "Kar",
    statReviews: "Yorumlar",
    description: "Gerçek yorumları ve kar paylaşımlarını kendiniz görün. Birçok kullanıcı zaten katılıyor.",
    subtext: "Katıldıktan sonra bırakacağınız yorum bizim için çok değerli.",
    ctaButton: "Telegram'a Katıl",
    reviewTitle: "Katıldıktan sonra yorum bırakın",
    review1: "Toplulukta deneyiminizi paylaşın",
    review2: "Blog yorumu yazın",
    review3: "Program kullanım deneyiminizi paylaşın",
  },
}

function TelegramCommunitySection({ lang }: { lang: string }) {
  const marketerId = useMarketerId()
  const t = TELEGRAM_COMMUNITY_TRANSLATIONS[lang] || TELEGRAM_COMMUNITY_TRANSLATIONS.en

  // Get marketer-specific telegram link or fallback to default
  const telegramLink = marketerId
    ? (getMarketerOverrideLink("landing.telegram.group", marketerId) ?? DEFAULT_LINKS["landing.telegram.group"])
    : DEFAULT_LINKS["landing.telegram.group"]

  return (
    <div className="my-12">
      {/* Main Telegram Community Card */}
      <section className="text-center">
        <div className="bg-gradient-to-b from-[#0088cc]/15 to-transparent border border-[#0088cc]/30 rounded-2xl p-8 md:p-12">
          {/* Status Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-xs font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {t.badgeLive}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0088cc]/20 border border-[#0088cc]/40 rounded-full text-[#0088cc] text-xs font-medium">
              {t.badgeProfit}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-cyan-400 text-xs font-medium">
              {t.badgeReviews}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t.title}
          </h2>

          {/* Stats Grid - Social Proof Numbers */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8 w-full max-w-full">
            <div className="flex flex-col items-center shrink-0">
              <div className="flex gap-0.5 md:gap-1 flex-nowrap">
                {['3', '9', '0', '0'].map((digit, i) => (
                  <div key={i} className="w-7 h-9 md:w-10 md:h-12 bg-black/60 border border-white/20 rounded flex items-center justify-center shrink-0">
                    <span className="font-mono text-base md:text-xl font-bold text-white">{digit}</span>
                  </div>
                ))}
                <div className="w-7 h-9 md:w-10 md:h-12 bg-black/60 border border-white/20 rounded flex items-center justify-center shrink-0">
                  <span className="font-mono text-base md:text-xl font-bold text-white">+</span>
                </div>
              </div>
              <span className="text-xs md:text-sm text-white/50 mt-2">{t.statMembers}</span>
            </div>
            <div className="flex flex-col items-center shrink-0">
              <div className="flex gap-0.5 md:gap-1 flex-nowrap">
                {['2', '6', '0', '0', '0'].map((digit, i) => (
                  <div key={i} className="w-7 h-9 md:w-10 md:h-12 bg-black/60 border border-white/20 rounded flex items-center justify-center shrink-0">
                    <span className="font-mono text-base md:text-xl font-bold text-white">{digit}</span>
                  </div>
                ))}
                <div className="w-7 h-9 md:w-10 md:h-12 bg-black/60 border border-white/20 rounded flex items-center justify-center shrink-0">
                  <span className="font-mono text-base md:text-xl font-bold text-white">+</span>
                </div>
              </div>
              <span className="text-xs md:text-sm text-white/50 mt-2">{t.statShares}</span>
            </div>
            <div className="flex flex-col items-center shrink-0">
              <div className="flex gap-0.5 md:gap-1 flex-nowrap">
                {['5', '0', '0'].map((digit, i) => (
                  <div key={i} className="w-7 h-9 md:w-10 md:h-12 bg-black/60 border border-white/20 rounded flex items-center justify-center shrink-0">
                    <span className="font-mono text-base md:text-xl font-bold text-white">{digit}</span>
                  </div>
                ))}
                <div className="w-7 h-9 md:w-10 md:h-12 bg-black/60 border border-white/20 rounded flex items-center justify-center shrink-0">
                  <span className="font-mono text-base md:text-xl font-bold text-white">+</span>
                </div>
              </div>
              <span className="text-xs md:text-sm text-white/50 mt-2">{t.statReviews}</span>
            </div>
          </div>

          {/* Description Text */}
          <div className="max-w-lg mx-auto mb-8">
            <p className="text-white/90 text-lg leading-relaxed mb-4">
              {t.description}
            </p>
            <p className="text-white/60">
              {t.subtext}
            </p>
          </div>

          {/* CTA Button */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-lg transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: "0 0 30px rgba(0, 136, 204, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
            }}
          >
            <Send className="w-5 h-5" />
            {t.ctaButton}
          </a>
        </div>
      </section>

      {/* Review Request Section - Below Community Card */}
      <div className="mt-8 bg-foreground/5 border border-foreground/10 rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-foreground">{t.reviewTitle}</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-foreground/5 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 text-xs font-bold">1</span>
            </div>
            <div className="text-foreground/80 text-sm">{t.review1}</div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-foreground/5 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 text-xs font-bold">2</span>
            </div>
            <div className="text-foreground/80 text-sm">{t.review2}</div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-foreground/5 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 text-xs font-bold">3</span>
            </div>
            <div className="text-foreground/80 text-sm">{t.review3}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== CHAPTER IMAGES (language-specific) =====

// Intro/Preface: Asset comparison analysis images by language
const introAssetComparisonImages: Record<string, string> = {
  zh: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3cn.png",
  en: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3en.png",
  es: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3es.png",
  id: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3id.png",
  ko: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3kr.png",
  ru: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3ru.png",
  ar: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3sa.png",
  th: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3th.png",
  tr: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3tr.png",
  vi: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-3vn.png",
};

// Helper function to get intro asset comparison image with fallback
const getIntroAssetComparisonImage = (lang: string): string => {
  return introAssetComparisonImages[lang] || introAssetComparisonImages.en || introAssetComparisonImages.ko;
};

// Chapter 1: Asset comparison chart images by language
const chapter1ComparisonImages: Record<string, string> = {
  zh: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-cn.png",
  en: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-en.png",
  es: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-es.png",
  id: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-id.png",
  ko: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-kr.png",
  ru: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-ru.png",
  ar: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-sa.png",
  th: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-th.png",
  tr: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-tr.png",
  vi: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-vn.png",
}

// Helper to get image with fallback: lang -> en -> ko
function getChapter1Image(lang: string): string {
  return chapter1ComparisonImages[lang] || chapter1ComparisonImages.en || chapter1ComparisonImages.ko
}

// Gold History: Bretton Woods System images by language
const goldBrettonWoodsImages: Record<string, string> = {
  zh: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1cn.png",
  en: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1en.png",
  es: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1es.png",
  id: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1id.png",
  ko: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1kr.jpg",
  ru: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1ru.png",
  ar: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1sa.png",
  th: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1th.png",
  tr: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1tr.png",
  vi: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-1vn.png",
}

// Helper to get Bretton Woods image with fallback: lang -> en -> ko
function getGoldBrettonWoodsImage(lang: string): string {
  return goldBrettonWoodsImages[lang] || goldBrettonWoodsImages.en || goldBrettonWoodsImages.ko
}

// Gold History: Nixon Shock image (same for all languages)
const NIXON_SHOCK_IMAGE = "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-2.jpg"

// Winner's Curse: NASDAQ Historical Crashes image (same for all languages)
const NASDAQ_CRASH_IMAGE = "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-3.jpg"

// Winner's Curse: Structural Truth image (same for all languages)
const STRUCTURAL_TRUTH_IMAGE = "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4.jpg"

// QE and Gold: Quantitative Easing impact on gold prices (language-specific)
const qeGoldImages: Record<string, string> = {
  zh: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4cn.png",
  en: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4en.png",
  es: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4es.png",
  id: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4id.png",
  ko: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4kr.png",
  ru: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4ru.png",
  ar: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4sa.png",
  th: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4th.png",
  tr: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4tr.png",
  vi: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-4vn.png",
}

// Helper to get QE Gold image with fallback: lang -> en -> ko
function getQeGoldImage(lang: string): string {
  return qeGoldImages[lang] || qeGoldImages.en || qeGoldImages.ko
}

// Compound Interest: Power of Compound Interest images (language-specific)
const compoundImages: Record<string, string> = {
  en: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1en.png",
  zh: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1cn.png",
  es: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1es.png",
  id: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1id.png",
  ko: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1kr.png",
  ru: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1ru.png",
  ar: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1sa.png",
  tr: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1tr.png",
  vi: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1vn.png",
  th: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/3-1th.png",
}

// Helper to get compound interest image with fallback: lang -> en -> ko
function getCompoundImage(lang: string): string {
  return compoundImages[lang] || compoundImages.en || compoundImages.ko
}

// ===== OPERATION LEVEL SETTINGS DATA =====
// Level tiers data for the Operation Level Settings section
const LEVEL_TIERS = [
  { value: 1, firstEntry: "0.3%", annualReturn: "≈12.68%", bar: "▓░░░░░░", description: { ko: "매우 낮은 변동 대응 / 안정적인 흐름 중심", en: "Very low volatility response / stable flow focus", ar: "استجابة منخفضة جداً للتقلبات / تركيز على التدفق المستقر", ru: "Очень низкая реакция на волатильность / фокус на стабильном потоке", zh: "极低波动应对 / 稳定流程为主", es: "Respuesta muy baja a volatilidad / enfoque en flujo estable", id: "Respons volatilitas sangat rendah / fokus aliran stabil", th: "การตอบสนองต่อความผันผวนต่ำมาก / เน้นการไหลที่มั่นคง", vi: "Phản ứng biến động rất thấp / tập trung dòng chảy ổn định", tr: "Çok düşük volatilite yanıtı / kararlı akış odaklı" } },
  { value: 2, firstEntry: "0.5%", annualReturn: "≈26.82%", bar: "▓▓░░░░░", description: { ko: "낮은 변동 대응 / 안정 중심 운용", en: "Low volatility response / stability-focused operation", ar: "استجابة منخفضة للتقلبات / تشغيل يركز على الاستقرار", ru: "Низкая реакция на волатильность / операция с фокусом на стабильность", zh: "低波动应对 / 稳定为主运营", es: "Respuesta baja a volatilidad / operación enfocada en estabilidad", id: "Respons volatilitas rendah / operasi berfokus stabilitas", th: "การตอบสนองต่อความผันผวนต่ำ / การดำเนินงานเน้นความมั่นคง", vi: "Phản ứng biến động thấp / vận hành tập trung ổn định", tr: "Düşük volatilite yanıtı / istikrar odaklı operasyon" } },
  { value: 3, firstEntry: "0.7%", annualReturn: "≈42.58%", bar: "▓▓▓░░░░", description: { ko: "안정형 기본 세팅 / 완만한 흐름 대응", en: "Stable default setting / moderate flow response", ar: "إعداد افتراضي مستقر / استجابة تدفق معتدلة", ru: "Стабильная базовая настройка / умеренная реакция на поток", zh: "稳定型默认设置 / 温和流程应对", es: "Configuración predeterminada estable / respuesta de flujo moderada", id: "Pengaturan default stabil / respons aliran moderat", th: "การตั้งค่าเริ่มต้นที่มั่นคง / การตอบสนองการไหลปานกลาง", vi: "Cài đặt mặc định ổn định / phản ứng dòng chảy vừa phải", tr: "Kararlı varsayılan ayar / ılımlı akış yanıtı" } },
  { value: 4, firstEntry: "0.9%", annualReturn: "≈60.10%", bar: "▓▓▓▓░░░", description: { ko: "균형형 세팅 / 일반적인 시장 대응", en: "Balanced setting / general market response", ar: "إعداد متوازن / ������ستجابة السوق العامة", ru: "Сбалансированная настройка / обща�� реакция на рынок", zh: "���衡型设置 / 一般市场应对", es: "Configuración equilibrada / respuesta general del mercado", id: "Pengaturan seimbang / respons pasar umum", th: "การตั้งค่าสมดุล / การตอบสนองตลาดทั่วไป", vi: "Cài đặt cân bằng / phản ứng thị trường chung", tr: "Dengeli ayar / genel piyasa yanıtı" } },
  { value: 5, firstEntry: "1.1%", annualReturn: "≈79.59%", bar: "▓▓▓▓▓░░", description: { ko: "적극형 운용 / 변동 구간 대응 강화", en: "Aggressive operation / enhanced volatility zone response", ar: "تشغيل عدواني / استجابة محسنة لمنطقة التقلب", ru: "Агрессивная операция / усиленная реакция на зону волатиль�����ости", zh: "积极型运营 / 强化波动区间应对", es: "Operación agresiva / respuesta mejorada a zona de volatilidad", id: "Operasi agresif / respons zona volatilitas ditingkatkan", th: "การดำเนินงานเชิงรุก / การตอบสนองโซนความผันผวนที่เพิ่มขึ้น", vi: "Vận hành tích cực / ph���n ứng vùng biến động nâng cao", tr: "Agresif operasyon / geliştirilmiş volatilite bölgesi yanıtı" } },
  { value: 6, firstEntry: "1.3%", annualReturn: "≈101.22%", bar: "▓▓▓▓▓▓░", description: { ko: "고변동 대응 / 큰 등락 구간 포함", en: "High volatility response / includes large swing zones", ar: "استجابة عالية للتقلبات / تشمل مناطق تأرجح كبيرة", ru: "Высокая реакция на волатильность / включает зоны больших колебаний", zh: "高波动应对 / 包含大幅涨跌区间", es: "Respuesta alta a volatilidad / incluye zonas de grandes oscilaciones", id: "Respons volatilitas tinggi / termasuk zona ayunan besar", th: "การตอบสนองต่อความผันผวนสูง / รวมโซนการแกว่งขนาดใหญ่", vi: "Ph��n ���ng biến động cao / bao gồm vùng dao động lớn", tr: "Yüksek volatilite yanıtı / büyük salınım bölgelerini içerir" } },
  { value: 7, firstEntry: "1.5%", annualReturn: "≈125.22%", bar: "▓▓▓▓▓▓▓", description: { ko: "최대 변동 대응 / 높은 등락 가능 구간 포함", en: "Maximum volatility response / includes high swing potential zones", ar: "اس��جابة قصوى للتقلبات / تشمل مناطق إمكانية تأرجح عالية", ru: "Максимальная реакция на волатильность / включает зоны высокого потенциала колебаний", zh: "最大波动应对 / 包含高涨跌潜力区间", es: "Respuesta máxima a volatilidad / incluye zonas de alto potencial de oscilación", id: "Respons volatilitas maksimum / termasuk zona potensi ayunan tinggi", th: "การตอบสนองต่อความผันผวนสูงสุด / รวมโซนศักยภาพการแกว่งสูง", vi: "Phản ứng biến động tối đa / bao gồm vùng tiềm năng dao động cao", tr: "Maksimum volatilite yanıtı / yüksek salınım potansiyeli bölgelerini içerir" } },
];

// Translations for Operation Level Settings section
const LEVEL_SETTINGS_TRANSLATIONS: Record<string, {
  heading: string;
  sliderLabel: string;
  selectedLevel: string;
  firstEntrySize: string;
  annualReturn: string;
  levelHeader: string;
  firstEntryHeader: string;
  annualReturnHeader: string;
  pattern: string;
}> = {
  ko: {
    heading: "운용 강도 Level별 세팅값",
    sliderLabel: "운용 강도 Level",
    selectedLevel: "선택한 Level",
    firstEntrySize: "1차 진입 규모",
    annualReturn: "연수익 기준",
    levelHeader: "구동 Level",
    firstEntryHeader: "1차 진입 규모",
    annualReturnHeader: "연수익 기준",
    pattern: "패턴: Level당 +0.2%씩 증가",
  },
  en: {
    heading: "Settings by Operation Level",
    sliderLabel: "Operation Level",
    selectedLevel: "Selected Level",
    firstEntrySize: "1st Entry Size",
    annualReturn: "Annual Return",
    levelHeader: "Operation Level",
    firstEntryHeader: "1st Entry Size",
    annualReturnHeader: "Annual Return",
    pattern: "Pattern: +0.2% per Level",
  },
  zh: {
    heading: "按运营强度级别设置",
    sliderLabel: "运营强度级别",
    selectedLevel: "已选级别",
    firstEntrySize: "首次入场规模",
    annualReturn: "年收益基准",
    levelHeader: "运营级别",
    firstEntryHeader: "首次入场规模",
    annualReturnHeader: "年收益基准",
    pattern: "模式：每级别+0.2%",
  },
  ar: {
    heading: "ال��عدادات حسب مستوى التشغيل",
    sliderLabel: "مستوى التشغيل",
    selectedLevel: "المستوى المحدد",
    firstEntrySize: "حجم الدخول الأول",
    annualReturn: "العائد السنوي",
    levelHeader: "مستوى التشغيل",
    firstEntryHeader: "حجم الدخول الأول",
    annualReturnHeader: "العائد السنوي",
    pattern: "النمط: +0.2% لكل مستوى",
  },
  ru: {
    heading: "Настройки по уровню интенсивности",
    sliderLabel: "Уровень интенсивности",
    selectedLevel: "Выбранный уровень",
    firstEntrySize: "Размер 1-го входа",
    annualReturn: "Годовой доход",
    levelHeader: "Уровень интенсивности",
    firstEntryHeader: "Размер 1-го входа",
    annualReturnHeader: "Годовой доход",
    pattern: "Паттерн: +0.2% за уровень",
  },
  es: {
    heading: "Configuraciones por nivel de operación",
    sliderLabel: "Nivel de operación",
    selectedLevel: "Nivel seleccionado",
    firstEntrySize: "Tamaño 1ra entrada",
    annualReturn: "Rendimiento anual",
    levelHeader: "Nivel de operación",
    firstEntryHeader: "Tamaño 1ra entrada",
    annualReturnHeader: "Rendimiento anual",
    pattern: "Patrón: +0.2% por nivel",
  },
  id: {
    heading: "Pengaturan berdasarkan Level Operasi",
    sliderLabel: "Level Operasi",
    selectedLevel: "Level Terpilih",
    firstEntrySize: "Ukuran Entri Pertama",
    annualReturn: "Return Tahunan",
    levelHeader: "Level Operasi",
    firstEntryHeader: "Ukuran Entri Pertama",
    annualReturnHeader: "Return Tahunan",
    pattern: "Pola: +0.2% per Level",
  },
  th: {
    heading: "การตั้งค่าตามระดับการดำเนินงาน",
    sliderLabel: "ระดับการดำเนินงาน",
    selectedLevel: "ระดับที่เลือก",
    firstEntrySize: "ขนาดการเข้าครั้งแรก",
    annualReturn: "ผลตอบแทนต่อปี",
    levelHeader: "ระดับการดำเนินงาน",
    firstEntryHeader: "ขนาดการเข้าครั้งแรก",
    annualReturnHeader: "ผลตอบแทนต่อปี",
    pattern: "ร���ป�����บ: +0.2% ต่อระดับ",
  },
  vi: {
    heading: "Cài đặt theo Cấp độ Vận hành",
    sliderLabel: "C���p độ Vận hành",
    selectedLevel: "Cấp độ đã chọn",
    firstEntrySize: "Kích thước Vào lệnh Đầu tiên",
    annualReturn: "Lợi nhuận Hàng năm",
    levelHeader: "Cấp độ Vận hành",
    firstEntryHeader: "Kích thước Vào lệnh Đầu tiên",
    annualReturnHeader: "Lợi nhuận Hàng năm",
    pattern: "Mẫu: +0.2% mỗi Cấp độ",
  },
  tr: {
    heading: "Operasyon Seviyesine Göre Ayarlar",
    sliderLabel: "Operasyon Seviyesi",
    selectedLevel: "Seçili Seviye",
    firstEntrySize: "1. Giriş Boyutu",
    annualReturn: "Yıllık Getiri",
    levelHeader: "Operasyon Seviyesi",
    firstEntryHeader: "1. Giriş Boyutu",
    annualReturnHeader: "Yıllık Getiri",
    pattern: "Desen: Seviye başına +%0.2",
  },
};

// Operation Level Settings Component for ebook
function OperationLevelSettings({ lang }: { lang: string }) {
  const [selectedLevel, setSelectedLevel] = useState(4);
  const t = LEVEL_SETTINGS_TRANSLATIONS[lang] || LEVEL_SETTINGS_TRANSLATIONS.en;
  const currentTier = LEVEL_TIERS[selectedLevel - 1];
  const description = currentTier.description[lang as keyof typeof currentTier.description] || currentTier.description.en;

  return (
    <div className="my-8">
      {/* Level Slider */}
      <div className="mb-8">
        <div className="text-sm text-foreground/60 mb-3">{t.sliderLabel}</div>
        <div className="flex items-center gap-4">
          <span className="text-foreground/50 text-sm w-6">1</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              className="w-full h-2 bg-foreground/10 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.5)]
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
            />
            {/* Level markers */}
            <div className="absolute top-4 left-0 right-0 flex justify-between px-1">
              {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`text-xs transition-all ${level === selectedLevel ? 'text-cyan-400 font-bold' : 'text-foreground/40 hover:text-foreground/60'
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <span className="text-foreground/50 text-sm w-6">7</span>
        </div>
      </div>

      {/* Selected Level Summary Box */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-xs text-foreground/50 mb-1">{t.selectedLevel}</div>
            <div className="text-2xl font-bold text-cyan-400">Level {selectedLevel}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/50 mb-1">{t.firstEntrySize}</div>
            <div className="text-2xl font-bold text-foreground">{currentTier.firstEntry}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/50 mb-1">{t.annualReturn}</div>
            <div className="text-2xl font-bold text-emerald-400">{currentTier.annualReturn}</div>
          </div>
        </div>
        <div className="text-center text-sm text-foreground/60 border-t border-foreground/10 pt-4">
          {description}
        </div>
        <div className="text-center text-xs text-cyan-400/70 font-mono mt-3">
          {currentTier.bar}
        </div>
      </div>

      {/* Level Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/20">
              <th className="text-left py-3 px-2 text-foreground/60 font-medium">{t.levelHeader}</th>
              <th className="text-center py-3 px-2 text-foreground/60 font-medium">{t.firstEntryHeader}</th>
              <th className="text-center py-3 px-2 text-foreground/60 font-medium">{t.annualReturnHeader}</th>
            </tr>
          </thead>
          <tbody>
            {LEVEL_TIERS.map((tier) => (
              <tr
                key={tier.value}
                className={`border-b border-foreground/10 transition-colors cursor-pointer hover:bg-foreground/5 ${tier.value === selectedLevel ? 'bg-cyan-500/10' : ''
                  }`}
                onClick={() => setSelectedLevel(tier.value)}
              >
                <td className={`py-3 px-2 ${tier.value === selectedLevel ? 'text-cyan-400 font-bold' : 'text-foreground/70'}`}>
                  Level {tier.value}
                </td>
                <td className="py-3 px-2 text-center text-foreground">{tier.firstEntry}</td>
                <td className={`py-3 px-2 text-center ${tier.value === selectedLevel ? 'text-emerald-400 font-bold' : 'text-emerald-400/70'}`}>
                  {tier.annualReturn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pattern note */}
      <div className="text-center text-xs text-foreground/40 mt-4">
        {t.pattern}
      </div>
    </div>
  );
}

// ===== STYLED COMPONENTS (proof-style) =====

// Chapter image with consistent styling (responsive, centered, styled)
function ChapterImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="my-7 flex justify-center">
      <div className="w-full max-w-[980px]">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-[14px] block"
          style={{
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35), 0 0 40px rgba(31, 224, 165, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        />
        {caption && (
          <p className="text-center text-foreground/40 text-sm mt-3">{caption}</p>
        )}
      </div>
    </div>
  )
}

// Quote block with accent border
function QuoteBlock({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-8 md:my-10 pl-6 border-l-2 border-cyan-500/50 text-foreground/80 text-lg md:text-xl italic leading-relaxed">
      {children}
    </blockquote>
  )
}

// Section divider
function SectionDivider() {
  return (
    <div className="my-10 md:my-14 flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </div>
  )
}

// Formatted paragraph
function Paragraph({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-foreground/70 text-base md:text-lg leading-relaxed mb-6 ${className}`}>
      {children}
    </p>
  )
}

// Strong/emphasized text
function Strong({ children }: { children: ReactNode }) {
  return <strong className="text-foreground font-semibold">{children}</strong>
}

// Accent text (cyan highlight)
function Accent({ children }: { children: ReactNode }) {
  return <span className="text-cyan-400 font-medium">{children}</span>
}

// Section subtitle
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-10">
      {children}
    </h3>
  )
}

// Highlighted box
function HighlightBox({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-6 md:p-8">
      {children}
    </div>
  )
}

// Comparison box (vs layout)
function ComparisonBox({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
  lang
}: {
  leftTitle: string
  leftItems: string[]
  rightTitle: string
  rightItems: string[]
  lang: Lang
}) {
  return (
    <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
      <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-5">
        <div className="text-sm text-foreground/50 mb-3 font-mono uppercase tracking-wider">{leftTitle}</div>
        <ul className="space-y-2">
          {leftItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-foreground/60 text-sm">
              <span className="text-foreground/30 mt-0.5">-</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-5">
        <div className="text-sm text-cyan-400/80 mb-3 font-mono uppercase tracking-wider">{rightTitle}</div>
        <ul className="space-y-2">
          {rightItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm">
              <span className="text-cyan-500 mt-0.5">+</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Bullet list
function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="my-6 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-foreground/70 text-base md:text-lg">
          <span className="text-cyan-500 mt-1.5 text-sm">●</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// Warning box (red/amber style for danger alerts)
function WarningBox({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-lg p-6 md:p-8">
      <div className="flex items-start gap-3">
        <span className="text-red-400 text-xl mt-0.5">⚠️</span>
        <div className="text-red-300/90 text-base md:text-lg leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

// Stat card for number highlights
function StatCard({
  value,
  label,
  type = "neutral"
}: {
  value: string
  label: string
  type?: "positive" | "negative" | "neutral"
}) {
  const colorClasses = {
    positive: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    negative: "bg-red-500/10 border-red-500/30 text-red-400",
    neutral: "bg-foreground/5 border-foreground/20 text-foreground/80",
  }

  return (
    <div className={`rounded-xl border p-5 text-center ${colorClasses[type]}`}>
      <div className="text-2xl md:text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-foreground/50">{label}</div>
    </div>
  )
}

// Stat cards grid
function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 grid grid-cols-2 md:grid-cols-3 gap-4">
      {children}
    </div>
  )
}

// Algorithm step card with image (for quant profit structure)
function AlgorithmStepCard({
  step,
  title,
  description,
  imageSrc,
  imageAlt,
}: {
  step: number
  title: string
  description: string
  imageSrc: string
  imageAlt: string
}) {
  return (
    <div
      className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4 md:p-5 flex flex-col"
      style={{
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(31, 224, 165, 0.03)",
      }}
    >
      {/* Step number badge */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center">
          <span className="text-cyan-400 font-mono text-sm font-bold">{step}</span>
        </div>
        <h4 className="text-base md:text-lg font-bold text-foreground">{title}</h4>
      </div>

      {/* Description */}
      <p className="text-sm md:text-base text-foreground/60 leading-relaxed mb-4">
        {description}
      </p>

      {/* Image */}
      <div className="mt-auto">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto rounded-lg"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        />
      </div>
    </div>
  )
}

// Algorithm steps grid (2 columns on desktop, 1 on mobile)
function AlgorithmStepsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-5">
      {children}
    </div>
  )
}

// Numbered list (for step-by-step structure)
function NumberedList({ items }: { items: ReactNode[] }) {
  return (
    <div className="my-6 space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-mono text-sm font-bold">{i + 1}</span>
          </div>
          <div className="flex-1 text-foreground/70 text-base md:text-lg leading-relaxed pt-1">
            {item}
          </div>
        </div>
      ))}
    </div>
  )
}

// Asset card for individual asset explanations
function AssetCard({
  title,
  risk,
  description,
  riskColor = "neutral"
}: {
  title: string
  risk: string
  description: ReactNode
  riskColor?: "high" | "medium" | "low" | "neutral"
}) {
  const riskColors = {
    high: "text-red-400 bg-red-500/10 border-red-500/30",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    neutral: "text-foreground/60 bg-foreground/5 border-foreground/20",
  }

  return (
    <div className="my-4 bg-foreground/[0.02] border border-foreground/10 rounded-xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold text-foreground">{title}</h4>
        <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${riskColors[riskColor]}`}>
          {risk}
        </span>
      </div>
      <div className="text-foreground/60 text-sm md:text-base leading-relaxed">
        {description}
      </div>
    </div>
  )
}

// Timeline component for historical events
function Timeline({ items }: { items: { year: string; event: ReactNode }[] }) {
  return (
    <div className="my-8 relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent" />
      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-4 pl-0">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 z-10">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="text-cyan-400 font-mono text-sm font-bold mb-1">{item.year}</div>
              <div className="text-foreground/70 text-base leading-relaxed">{item.event}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Formula/Logic box for cause-effect chains
function FormulaBox({ items }: { items: string[] }) {
  return (
    <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-5 md:p-6 overflow-x-auto">
      <div className="flex items-center justify-center flex-wrap gap-3 text-base md:text-lg">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="text-foreground/80 font-medium whitespace-nowrap">{item}</span>
            {i < items.length - 1 && (
              <span className="text-cyan-400 font-bold">→</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

// Big number highlight card
function BigNumber({ value, label, sublabel }: { value: string; label: string; sublabel?: string }) {
  return (
    <div className="my-6 text-center">
      <div className="inline-block bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-2xl px-8 py-6">
        <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{value}</div>
        <div className="text-sm md:text-base text-foreground/70">{label}</div>
        {sublabel && <div className="text-xs text-foreground/50 mt-1">{sublabel}</div>}
      </div>
    </div>
  )
}

// Price comparison card (before/after)
function PriceCompare({ before, after, beforeLabel, afterLabel }: {
  before: string; after: string; beforeLabel: string; afterLabel: string
}) {
  return (
    <div className="my-8 grid grid-cols-2 gap-4">
      <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5 text-center">
        <div className="text-xs text-foreground/50 mb-2 font-mono uppercase">{beforeLabel}</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground/60">{before}</div>
      </div>
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center relative">
        <div className="text-xs text-amber-400/80 mb-2 font-mono uppercase">{afterLabel}</div>
        <div className="text-2xl md:text-3xl font-bold text-amber-400">{after}</div>
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full flex items-center justify-center border border-cyan-500/30">
          <span className="text-cyan-400 text-sm">→</span>
        </div>
      </div>
    </div>
  )
}

// Callout box (for important single statements)
function CalloutBox({ children, type = "info" }: { children: ReactNode; type?: "info" | "warning" | "success" }) {
  const styles = {
    info: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  }

  return (
    <div className={`my-6 border rounded-xl p-5 text-center text-lg md:text-xl font-medium ${styles[type]}`}>
      {children}
    </div>
  )
}

// Chapter types - content can be string or JSX component
type ContentType = string | ((lang: Lang) => ReactNode)

interface SubChapter {
  id: string
  title: Record<Lang, string>
  content: Record<Lang, ContentType>
}

interface SingleChapter {
  type: "single"
  id: string
  title: Record<Lang, string>
  content: Record<Lang, ContentType>
}

interface ParentChapter {
  type: "parent"
  id: string
  title: Record<Lang, string>
  intro: boolean // If true, show intro page before sub-chapters
  introContent: Record<Lang, ContentType>
  children: SubChapter[]
}

type Chapter = SingleChapter | ParentChapter

// Preface content component (styled like /proof page)
const PrefaceContent = {
  ko: () => (
    <>
      {/* 1. 타이틀 영역 - 2단 구조 강조 */}
      <div className="text-center mb-10">
        <div className="text-foreground/50 text-lg mb-2 tracking-widest">서문</div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">어떤 퀀트 모델인가?</h1>
      </div>

      {/* Ebook Cover Image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW AI Ebook Cover"
        className="block mx-auto max-w-[260px] md:max-w-[360px] w-full h-auto rounded-xl my-6 md:my-10"
      />

      {/* 2. 핵심 문장 강조 블록 - Quote 스타일 */}
      <QuoteBlock>
        BUYLOW AI는 메인 퀀트 모델인 R-R Strategy는<br />
        <Accent>&quot;평균회귀&quot;</Accent> 기반으로 <Accent>&quot;순환매&quot;</Accent> 알고리즘을 입혀 퀀트 프로그램을 만들었다.
      </QuoteBlock>

      {/* 3. 개념 설명 구간 - 평균회귀 설명 */}
      <Paragraph>
        그 이유는 간단했다.<br />
        현재 퀀트시장에서 돈을 버는 모델들은<br />
        대부분 <Strong>&quot;평균회귀&quot;</Strong> 기반이였고,<br />
        가장 직관적으로 확률적 우위를 높여줬다.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>평균회귀란?</SectionTitle>

      {/* 평균회귀 설명 이미지 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="평균회귀 설명"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-6 md:my-8"
      />

      <Paragraph>
        <Strong>평균회귀</Strong>란 가격이 평균으로 회귀한다.라는 특징을 바탕으로<br />
        현재 대부분의 퀀트들이 만들어지고 있다.
      </Paragraph>

      {/* 기관 사례 - 강조 카드 */}
      <HighlightBox>
        <Paragraph className="mb-3">
          연간 수 십조를 버는 <Strong>르네상스 테크놀로지</Strong>도 퀀트 프로그램을<br />
          <Accent>&quot;평균회귀 기반&quot;</Accent>으로 만들어진 것으로 알려져있으며,
        </Paragraph>
        <Paragraph className="mb-0">
          온체인(WEB3)시장에서 큰 돈을 버는 트레이딩펌도<br />
          아비트라지나 매매등을 <Accent>&quot;평균회귀&quot;</Accent>를 기반으로 설계가 된다.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>BUYLOW AI의 설계 철학</SectionTitle>

      <Paragraph>
        BUYLOW AI는 <Strong>Larry Connors</Strong>의 평균회귀 전략을 영감을 받아<br />
        볼린저밴드, 피보나치 등을 활용하여<br />
        재해석해서 평균회귀 퀀트 프로그램을 만들었으며,
      </Paragraph>

      {/* OAR Default 이미지 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/oardefault.jpg"
        alt="Open Range Analysis"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-6 md:my-7"
      />

      <Paragraph>
        <Strong>&quot;단기 가격 패턴 연구&quot;</Strong>로 유명한 <Accent>Toby Crabel 박사</Accent>의 말대로<br />
        시장의 과도한 움직임 이후 평균으로 되돌아오는 경향을 기초로<br />
        모든 퀀트 프로그램을 설계했다.
      </Paragraph>

      <SectionDivider />

      {/* 4. 구조 설명 구간 - 시각적 강조 (2줄 블록) */}
      <SectionTitle>기관들의 평균회귀 트레이딩 구조</SectionTitle>

      <Paragraph>
        실제 평균회귀 기반으로 트레이딩하는 기관들은<br />
        아래 2개의 기반으로 시스템을 짰다:
      </Paragraph>

      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-emerald-400 font-bold text-lg mb-2">A 자산 급락</div>
          <div className="text-2xl font-bold text-foreground">→ 매수</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-cyan-400 font-bold text-lg mb-2">차트가 평균 회귀</div>
          <div className="text-2xl font-bold text-foreground">→ 매도</div>
        </div>
      </div>

      <Paragraph>
        우리는 여러가지 지표를 통해<br />
        자산이 급락하면 프로그램에서 매수하고,
      </Paragraph>

      <Paragraph>
        <Strong>피보나치 비율</Strong>을 통해 자산이 일정 수준 이상<br />
        평균 회귀(반등)를 줄 때 자산을 매도하는 메커니즘으로<br />
        퀀트 프로그램을 설계했다.
      </Paragraph>

      <SectionDivider />

      {/* 5. R-R 전략 설명 - 강조 */}
      <SectionTitle>R-R Strategy 명명 이유</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          퀀트 모델 이름이 <Strong>R-R Strategy</Strong>인 이유는<br />
          <Accent>Reversion</Accent>(평균회귀) + <Accent>Rotation</Accent>(순환)의 앞 글자를 따와<br />
          직관적으로 <Strong>R-R Strategy</Strong>라고 지었다.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 6. 핵심 2가지 - 카드형 강조 박스 */}
      <SectionTitle>이 책에서 설명할 2가지</SectionTitle>

      <div className="my-6 space-y-4">
        <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-lg shrink-0">1</div>
            <div className="text-foreground/90 leading-relaxed">
              <Strong>R-R 퀀트 모델을 어떤 자산으로 구동해야 하는가?</Strong>
            </div>
          </div>
        </div>
        <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-lg shrink-0">2</div>
            <div className="text-foreground/90 leading-relaxed">
              <Strong>R-R 퀀트 모델 알고리즘이 어떤 식으로 설계되었으며<br />어떻게 사용해야 하는가?</Strong>
            </div>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. 차별점 강조 */}
      <SectionTitle>타 퀀트와의 차별점</SectionTitle>

      <Paragraph>
        우리는 타 퀀트와 명확하게 다른 점이 있다.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-3">
          사용자가 처음부터 끝까지 직접<br />
          <Strong>R-R 퀀트 프로그램을 개별적으로 세팅</Strong>할 수 있다는 것이다.
        </Paragraph>
        <Paragraph className="mb-0">
          사용자가 차트 상황에 맞게<br />
          <Accent>R-R 퀀트 모델을 능동적으로 사용</Accent>할 수 있기 때문이다.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 8. 리스크 경고 - 빨간 ���� 박스 */}
      <WarningBox>
        <Paragraph className="mb-3">
          <Strong>*다시 강조하지만 R-R 퀀트 모델은</Strong><br />
          전략을 자동화해주는 도구일 뿐, <Accent>수익을 절대 보장하지 않는다.</Accent>
        </Paragraph>
        <Paragraph className="mb-0">
          전략에 대한 이해 없이 사용하는 경우<br />
          <Strong>오히려 손실이 발생할 수 있다.</Strong>
        </Paragraph>
      </WarningBox>

      <SectionDivider />

      {/* 9. 마지막 문장 - CTA 전 느낌 마무리 */}
      <div className="my-8 text-center">
        <Paragraph className="text-lg">
          그래서 우리의<br />
          <Strong>R-R 퀀트 알고리즘을 끝까지 읽고</Strong><br />
          <Accent>완전히 이해한 사용자에게만</Accent><br />
          프로그램을 제공하는 방식을 선택했다.
        </Paragraph>
      </div>
    </>
  ),
  en: () => (
    <>
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW E-Book"
        className="w-full max-w-[1000px] mx-auto my-5 mb-7 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(31, 224, 165, 0.08)' }}
      />

      <QuoteBlock>
        This book is written for users who believe in the essence of BUYLOW QUANT
        and prefer to operate most of their assets through BUYLOW Quant rather than personal investment.
      </QuoteBlock>

      <SectionTitle>Why This Book Was Written</SectionTitle>

      <Paragraph>
        I thought the existing BUYLOW materials were sufficient.
      </Paragraph>

      <Paragraph>
        However, if there are people who want to <Strong>invest most of their assets in BUYLOW Quant</Strong>,
        I believed they needed materials that could give them <Accent>stronger conviction</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Target Readers</SectionTitle>

      <BulletList items={[
        <><Strong>Individual Investors</Strong> — Those who want to manage assets with BUYLOW Quant</>,
        <><Strong>Asset Management CEOs</Strong> — Institutions worldwide looking to manage assets with BUYLOW Quant</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0">
          Individual investors can use this as a basis to <Strong>build their strategy</Strong>,
          while asset managers can use it as <Accent>Pitch Deck / Investor Presentation</Accent> material.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Purpose of This Book</SectionTitle>

      <Paragraph>
        Today, I will <Strong>logically explain</Strong> exactly how <Accent>BUYLOW QUANT</Accent> works
        and why it inevitably achieves stable target returns.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>What is Quant?</SectionTitle>

      <Paragraph>
        <Strong>Quant</Strong> refers to creating investment strategies by analyzing
        financial market data using mathematics, statistics, and computer algorithms.
      </Paragraph>

      <Paragraph>
        It means <Accent>executing those strategies through automated trading</Accent>.
      </Paragraph>

      <ComparisonBox
        leftTitle="Traditional Investment"
        leftItems={[
          "Relies on news",
          "Relies on intuition",
          "Emotional decisions",
          "Manual trading",
        ]}
        rightTitle="Quant Investment"
        rightItems={[
          "Price data analysis",
          "Volume/volatility formulas",
          "Rule-based trading",
          "Automated execution",
        ]}
        lang="en"
      />

      <SectionDivider />

      <SectionTitle>Introduction to BUYLOW</SectionTitle>

      <Paragraph>
        Now, let me explain the quant program called <Accent>BUYLOW</Accent> in the on-chain market.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Market Changes: The Emergence of RWA</SectionTitle>

      {/* RWA Market Structure Image */}
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[900px]">
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1.png"
            alt="RWA Market Structure Changes"
            className="w-full h-auto rounded-xl"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(31, 224, 165, 0.1)",
            }}
          />
          <p className="text-center text-foreground/50 text-sm mt-3">RWA Market Structure Example</p>
        </div>
      </div>

      <Paragraph>
        Starting from 2026, due to <Strong>RWA (Real World Asset Tokenization)</Strong>,
        <Accent>traditional financial assets</Accent> like gold, Nasdaq, and S&P 500 can be traded
        on overseas platforms with low fees.
      </Paragraph>

      <Paragraph>
        DEXs like <Strong>LITER</Strong> allow trading these assets with almost zero fees.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>BUYLOW&apos;s Response: RWA-Based Expansion</SectionTitle>

      <Paragraph>
        The BUYLOW Quant team has developed quant trading for traditional financial assets
        like gold and Nasdaq in response to <Accent>RWA changes</Accent>,
        achieving <Strong>tremendous response</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Algorithm Performance Structure</SectionTitle>

      <QuoteBlock>
        Profit in rises and sideways, defend in falls
      </QuoteBlock>

      <Paragraph>
        BUYLOW trading algorithm generates profits when assets are in <Strong>sideways or upward</Strong> trends.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="BUYLOW Performance Structure"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <ComparisonBox
        leftTitle="Market Average Returns"
        leftItems={[
          "+10% bull market",
          "-20% bear market",
        ]}
        rightTitle="BUYLOW Performance"
        rightItems={[
          "+20~30% or more returns",
          "Rotation trading limits losses to -10% or less",
        ]}
        lang="en"
      />

      <Paragraph>
        In other words, it&apos;s designed to <Accent>generate higher returns than the market</Accent> when markets are good,
        and <Strong>minimize losses</Strong> when markets are bad.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Key Realization</SectionTitle>

      <Paragraph>
        The most important thing I learned while researching quant trading was this:
      </Paragraph>

      <QuoteBlock>
        What asset are you basing your investment on?
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Real Experience: BTC vs Gold</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-2en.png"
        alt="BTC vs Gold Performance Comparison"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <Paragraph>
        Over the past 2 years, I developed based on <Strong>Bitcoin</Strong>,
        but when the entire market dropped <Accent>more than -60% in one direction</Accent>,
        even quant programs struggled to respond.
      </Paragraph>

      <Paragraph>
        However, stable assets like <Strong>gold</Strong> have
        <Accent>limited downside</Accent>, producing much more stable returns.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0">
          Conclusion: <Strong>Asset selection</Strong> is the key to quant returns.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>What This Book Covers</SectionTitle>

      <Paragraph>
        This book will explain <Strong>2 core concepts</Strong>:
      </Paragraph>

      <BulletList items={[
        <><Strong>Which assets should be selected for consistent profits</Strong></>,
        <><Strong>How the BUYLOW QUANT algorithm works</Strong></>,
      ]} />

      <Paragraph>
        While the system calculates automatically,
        <Accent>investors with larger assets</Accent> benefit more from understanding the principles.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Target Readers Revisited</SectionTitle>

      <BulletList items={[
        <><Strong>Individual Investors</Strong> — Use this to build your strategy</>,
        <><Strong>Asset Managers</Strong> — Use as Pitch Deck / Investor Presentation material</>,
      ]} />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Now, let&apos;s dive into <Strong>Chapter 1</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  zh: () => (
    <>
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW E-Book"
        className="w-full max-w-[1000px] mx-auto my-5 mb-7 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(31, 224, 165, 0.08)' }}
      />

      <QuoteBlock>
        本书是为那些相信BUYLOW QUANT本质，
        并选择通过BUYLOW Quant运作大部分资产而非个人投资的用户而写。
      </QuoteBlock>

      <SectionTitle>为什么写这本书</SectionTitle>

      <Paragraph>
        我曾认为现有的BUYLOW资���已经足够了。
      </Paragraph>

      <Paragraph>
        但���果有人<Strong>��望将大部分资产投入BUYLOW Quant</Strong>���
        我认为他们需要能给予<Accent>更强信心</Accent>的资料。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>目标读者</SectionTitle>

      <BulletList items={[
        <><Strong>个人投资者</Strong> — 希望通过BUYLOW Quant管理资产的人</>,
        <><Strong>资产管理公司CEO</Strong> — 全球范围内希望使用BUYLOW Quant管理资产的机构</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0">
          个人投资者可���根据本文<Strong>制定策略</Strong>，
          资产管理公司可以作为<Accent>路演/投资者演示</Accent>资料使用。
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>本书的目的</SectionTitle>

      <Paragraph>
        今天，我将<Strong>逻辑性地解释</Strong><Accent>BUYLOW QUANT</Accent>的运作原理，
        以及为什么它能稳定地达到目标收益率。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>什么是量化(Quant)?</SectionTitle>

      <Paragraph>
        <Strong>量化(Quant)</Strong>是利用数学、统计学和计算机算法
        分析金融市场数据来制定投资策略。
      </Paragraph>

      <Paragraph>
        并通过<Accent>自动交易执行</Accent>这些策略。
      </Paragraph>

      <ComparisonBox
        leftTitle="传统投资"
        leftItems={[
          "依赖新闻",
          "依赖直觉",
          "情绪化决策",
          "手动交易",
        ]}
        rightTitle="量化投资"
        rightItems={[
          "价格数据分析",
          "量/波动率公式",
          "基于规则的交易",
          "自动执行",
        ]}
        lang="zh"
      />

      <SectionDivider />

      <SectionTitle>BUYLOW介绍</SectionTitle>

      <Paragraph>
        现在我要介绍链上市场中的<Accent>BUYLOW</Accent>量化程序。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>市场变化：RWA的出现</SectionTitle>

      {/* RWA 市场结构图 */}
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[900px]">
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1.png"
            alt="RWA市场结构变化"
            className="w-full h-auto rounded-xl"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(31, 224, 165, 0.1)",
            }}
          />
          <p className="text-center text-foreground/50 text-sm mt-3">RWA市场结构变化示例</p>
        </div>
      </div>

      <Paragraph>
        从2026年开始，由于<Strong>RWA(资产代币化)</Strong>，
        黄金、纳斯达克、标普500等<Accent>传统金融资产</Accent>可以在海外��台以低廉的手续费交易。
      </Paragraph>

      <Paragraph>
        像<Strong>LITER</Strong>������DEX交易所几乎可以零手续��交易这些资产。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>BUYLOW的响应: RWA基础扩展</SectionTitle>

      <Paragraph>
        BUYLOW Quant团队针对<Accent>RWA变化</Accent>，
        开发了黄金、纳斯达克等传统金融资产的量化交易，
        获得了<Strong>巨大反响</Strong>。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>算法性能结构</SectionTitle>

      <QuoteBlock>
        上涨和横盘时获利，下跌时坚守
      </QuoteBlock>

      <Paragraph>
        BUYLOW交易算法在资产<Strong>横盘及上涨</Strong>时产生收益。
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="BUYLOW Performance Structure"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <ComparisonBox
        leftTitle="市场平均收益"
        leftItems={[
          "+10% 牛市",
          "-20% 熊市",
        ]}
        rightTitle="BUYLOW表现"
        rightItems={[
          "+20~30% 或更多收益",
          "轮动交易将亏损限制在-10%或更低",
        ]}
        lang="zh"
      />

      <Paragraph>
        即市场好时产生<Accent>高于市场的收益</Accent>，
        市场差时<Strong>最小化损失</Strong>。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>核心认识</SectionTitle>

      <Paragraph>
        研究量化交易时，我学到的最重要��一点是：
      </Paragraph>

      <QuoteBlock>
        基于什么资产进行投资？
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>实际经验: BTC vs 黄金</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-2cn.png"
        alt="BTC vs Gold Performance Comparison"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <Paragraph>
        过去2年，我基于<Strong>比特币</Strong>进行开发，
        但当整个市场<Accent>单向下跌超过-60%</Accent>时，
        连量化程序也难以应对。
      </Paragraph>

      <Paragraph>
        然而，像<Strong>黄金</Strong>这样的稳定资产
        <Accent>下跌有限</Accent>，����生的收益更加稳定。
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0">
          结论：<Strong>资产选择</Strong>是量化收益的关键。
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>本书内容</SectionTitle>

      <Paragraph>
        本书将解释<Strong>2个核心概念</Strong>：
      </Paragraph>

      <BulletList items={[
        <><Strong>选择什么资产才能持续盈利</Strong></>,
        <><Strong>BUYLOW QUANT算法如何运作</Strong></>,
      ]} />

      <Paragraph>
        虽然系统自动计算，
        但<Accent>资产规模���大的投资者</Accent>更能从理解原理中受益。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>目标读者(再次)</SectionTitle>

      <BulletList items={[
        <><Strong>个人投资者</Strong> — 用这个来构建你的策略</>,
        <><Strong>资产管理者</Strong> — 用作投资者演示资料</>,
      ]} />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          好，现在让我们进入<Strong>第一章</Strong>。
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ar: () => (
    <>
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW E-Book"
        className="w-full max-w-[1000px] mx-auto my-5 mb-7 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(31, 224, 165, 0.08)' }}
      />

      <QuoteBlock>
        هذا الكتاب مكتو�� للمستخدمين الذين يؤمنون بجوهر BUYLOW QUANT
        ويفضلون تشغيل معظم أصولهم من خلال BUYLOW Quant بدلاً من الاستثمار الشخصي.
      </QuoteBlock>

      <SectionTitle>لماذا كتبت هذا الكت��ب</SectionTitle>

      <Paragraph>
        اعتقدت أ�� مواد BUYLOW الموجودة كانت كافية.
      </Paragraph>

      <Paragraph>
        لكن إذا كان هناك أشخاص يريدون <Strong>استثمار معظم أصولهم في BUYLOW Quant</Strong>،
        فقد آمنت بأنهم يحتاجون مواد تمنحهم <Accent>قناعة أقوى</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>القراء المستهدفون</SectionTitle>

      <BulletList items={[
        <><Strong>المستثمرون الأفراد</Strong> — الذين يريدون إدارة الأصول مع BUYLOW Quant</>,
        <><Strong>مديرو شركات إدارة الأصول</Strong> — المؤسسات حول العالم التي تتطلع لإدارة الأصول مع BUYLOW Quant</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0">
          يمكن للمستثمرين الأفراد استخدام هذا <Strong>لبناء استراتيجيتهم</Strong>،
          بينما يمكن لمديري الأصول استخدامه كمواد <Accent>عرض تقديمي للمستثمرين</Accent>.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>الغرض من هذا الكتاب</SectionTitle>

      <Paragraph>
        اليوم، سأشرح <Strong>منطقياً</Strong> كيف يعمل <Accent>BUYLOW QUANT</Accent> بالضبط
        ولماذا يحقق معدل العائد المستهدف بثبات.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>ما هو الكوانت (Quant)؟</SectionTitle>

      <Paragraph>
        <Strong>الكوانت (Quant)</Strong> يستخدم الرياضيات والإحصاء وخوارزميات الكمبيوتر
        لتحليل بيانات الأسواق المالية وإنشاء استراتيجيات استثمار.
      </Paragraph>

      <Paragraph>
        ويعني <Accent>تنفيذ تلك الاستراتيجيات من خلال التداول الآلي</Accent>.
      </Paragraph>

      <ComparisonBox
        leftTitle="الاستثمار التقليدي"
        leftItems={[
          "يعتمد على الأخبار",
          "يعتمد على الحدس",
          "قرارات عاطفية",
          "تداول يدوي",
        ]}
        rightTitle="الاستثمار الكمي"
        rightItems={[
          "تحليل بيانات الأسعار",
          "صيغ الحجم/التقلب",
          "تداول قائم على القواعد",
          "تنفيذ آلي",
        ]}
        lang="ar"
      />

      <SectionDivider />

      <SectionTitle>مقدمة عن BUYLOW</SectionTitle>

      <Paragraph>
        الآن، دعني أشرح برنامج الكوانت المسمى <Accent>BUYLOW</Accent> في سوق البلوكشين.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>تغيرات السوق: ظهور RWA</SectionTitle>

      {/* صورة هيكل سوق RWA */}
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[900px]">
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1.png"
            alt="تغيرات هيكل سوق RWA"
            className="w-full h-auto rounded-xl"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(31, 224, 165, 0.1)",
            }}
          />
          <p className="text-center text-foreground/50 text-sm mt-3">مثال على تغيرات هيكل سوق RWA</p>
        </div>
      </div>

      <Paragraph>
        بدءاً من عام 2026، بفضل <Strong>RWA (توكنة الأصول الحقيقية)</Strong>،
        يمكن تداول <Accent>الأصول المالية التقليدية</Accent> مثل الذهب وناسداك وS&P 500
        على المنصات الخارجية برسوم منخفضة.
      </Paragraph>

      <Paragraph>
        منصات DEX مثل <Strong>LITER</Strong> تسمح بتداول هذه الأصول بدون رسوم تقريباً.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>استجابة BUYLOW: التوسع القائم على RWA</SectionTitle>

      <Paragraph>
        طور فريق BUYLOW Quant تداولاً كمياً للأصول المالية التقليدية
        مثل الذهب وناسداك استجابةً <Accent>لتغيرات RWA</Accent>،
        محققاً <Strong>استجابة هائلة</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>هيكل أداء الخوارزمية</SectionTitle>

      <QuoteBlock>
        الربح في الصعود والتذبذب، الصمود في الهبوط
      </QuoteBlock>

      <Paragraph>
        خوارزمية تداول BUYLOW تحقق أرباحاً عندما يكون السو�� في <Strong>تذبذب أو صعود</Strong>.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="BUYLOW Performance Structure"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <ComparisonBox
        leftTitle="متوسط عوائد السوق"
        leftItems={[
          "+10% سوق صاعد",
          "-20% سوق هابط",
        ]}
        rightTitle="أداء BUYLOW"
        rightItems={[
          "+20~30% أو أكثر عوائد",
          "التداول الدوراني يحد الخسائر إلى -10% أو أقل",
        ]}
        lang="ar"
      />

      <Paragraph>
        ب��عنى آخر�� مصمم <Accent>لتحقيق عوائد أعلى من السوق</Accent> عندما تكون الأسواق جيدة،
        و<Strong>تقليل الخسائر</Strong> عندما تكون الأسواق سيئة.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>الإدراك الرئيسي</SectionTitle>

      <Paragraph>
        أهم شيء تعلمته أثناء البحث في التداول الكمي كان هذا:
      </Paragraph>

      <QuoteBlock>
        على أي أصل تبني استثمارك؟
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>تجربة حقيقية: BTC مقابل الذهب</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-2sa.png"
        alt="BTC vs Gold Performance Comparison"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <Paragraph>
        خلال العامين الماضيين، طورت بناءً على <Strong>البيتكوين</Strong>،
        لكن عندما انخفض السوق بأكمله <Accent>أكثر من -60% في اتجاه واحد</Accent>،
        حتى برامج الكوانت واجهت صعوبة في الاستجابة.
      </Paragraph>

      <Paragraph>
        ومع ذلك، الأصول المستقرة مثل <Strong>الذهب</Strong> لها
        <Accent>هبوط محدود</Accent>، مما ينتج عوائد أكثر استقراراً بكثير.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0">
          الاستنتاج: <Strong>اختيار الأصل</Strong> هو مفتاح عوائد الكوانت.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>ما يغطيه هذا الكتاب</SectionTitle>

      <Paragraph>
        سيشرح هذا الكتاب <Strong>مفهومين أساسي��ن</Strong>:
      </Paragraph>

      <BulletList items={[
        <><Strong>ما الأصول التي يجب اختيارها لتحقيق أرباح مستمرة</Strong></>,
        <><Strong>كيف تعمل خوارزمية BUYLOW QUANT</Strong></>,
      ]} />

      <Paragraph>
        بينما يحسب النظام تلقائياً،
        <Accent>المستثمرون ذوو الأصول الأكبر</Accent> يستفيدون أكثر من فهم المبادئ.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>إعادة التأكيد على القراء المستهدفين</SectionTitle>

      <BulletList items={[
        <><Strong>المستثمرون الأفراد</Strong> — استخدم هذا لبناء استراتيجيتك</>,
        <><Strong>مدير�� الأصول</Strong> — استخدم كمواد عرض تقديمي للمستثمرين</>,
      ]} />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          حسناً، لننتقل الآن إلى <Strong>الفصل الأول</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ru: () => (
    <>
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW E-Book"
        className="w-full max-w-[1000px] mx-auto my-5 mb-7 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(31, 224, 165, 0.08)' }}
      />

      <QuoteBlock>
        Эта книга написана для пользователей, которые верят в суть BUYLOW QUANT
        и предпочитают управлять большей частью своих активов через BUYLOW Quant, а не личные инвестиции.
      </QuoteBlock>

      <SectionTitle>Почему была написана эта книга</SectionTitle>

      <Paragraph>
        Я думаю, что существующих материалов BUYLOW достаточно.
      </Paragraph>

      <Paragraph>
        Однако, если есть люди, ��оторые х��тят <Strong>инвестировать большую часть своих активов в BUYLOW Quant</Strong>,
        я считал, что им нужны материалы, которые дадут им <Accent>более сильную уверенность</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Целевая аудитория</SectionTitle>

      <BulletList items={[
        <><Strong>Индивидуальные инвесторы</Strong> — те, кто хо��ет управлять активами с BUYLOW Quant</>,
        <><Strong>Руководители управляющих компаний</Strong> — учреждения по всему миру, желающие управлять активами с BUYLOW Quant</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0">
          Индивидуальн��е инвес��ор���� могут и��пользовать это д��я <Strong>построения стратегии</Strong>,
          а управляющие активами — как материалы для <Accent>презентаций инвесторам</Accent>.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Цель этой книги</SectionTitle>

      <Paragraph>
        Сегодня я <Strong>логически объясню</Strong>, как именно работает <Accent>BUYLOW QUANT</Accent>
        и почему он стабильно достигает целевой доходности.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Что такое Quant?</SectionTitle>

      <Paragraph>
        <Strong>Quant</Strong> испол��зует ма��ематику, статистику и компьютерные алгоритмы
        для а��ализа данных финансовых рынков и создания инвестиционных стратеги��.
      </Paragraph>

      <Paragraph>
        Это означает <Accent>выполнение этих стратегий через автоматическую торговлю</Accent>.
      </Paragraph>

      <ComparisonBox
        leftTitle="Традиционные инвестиции"
        leftItems={[
          "Опора на новости",
          "Опора на интуицию",
          "Эмоциональные решения",
          "Ручная торговля",
        ]}
        rightTitle="Quant инвестиции"
        rightItems={[
          "Анализ ценовых данных",
          "Формулы объёма/волатильности",
          "Т��рговля по правилам",
          "Автоматическое исполнение",
        ]}
        lang="ru"
      />

      <SectionDivider />

      <SectionTitle>Введение в BUYLOW</SectionTitle>

      <Paragraph>
        Теперь позвольте объяснить квант-программу <Accent>BUYLOW</Accent> на рынке on-chain.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Изменения на рынке: появление RWA</SectionTitle>

      {/* Изображение структуры рынка RWA */}
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[900px]">
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1.png"
            alt="Изменения структуры рынка RWA"
            className="w-full h-auto rounded-xl"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(31, 224, 165, 0.1)",
            }}
          />
          <p className="text-center text-foreground/50 text-sm mt-3">Пример изменения структуры рынка RWA</p>
        </div>
      </div>

      <Paragraph>
        Начиная с 2026 года, благодаря <Strong>RWA (токенизации реальных активов)</Strong>,
        <Accent>традиционные финансовые активы</Accent> такие как золото, Nasdaq и S&P 500
        можно торговать на зару��ежных п��атформах с низкими комиссиями.
      </Paragraph>

      <Paragraph>
        DEX биржи как <Strong>LITER</Strong> позволяют торговать этими активами практически без комиссий.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Ответ BUYLOW: расширение на основе RWA</SectionTitle>

      <Paragraph>
        Команда BUYLOW Quant разработала квант-торговлю для традиционных финансовых активов
        таких как золото и Nasdaq в ответ на <Accent>изменения RWA</Accent>,
        достигнув <Strong>огромного отклика</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Структура производительности алгоритма</SectionTitle>

      <QuoteBlock>
        Прибыль при росте и консолидации, устойчивость при падении
      </QuoteBlock>

      <Paragraph>
        Торговый алгоритм BUYLOW получает прибыль, когда рынок находится в <Strong>консолидации или росте</Strong>.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="BUYLOW Performance Structure"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <ComparisonBox
        leftTitle="Средняя доходность рынка"
        leftItems={[
          "+10% бычий рынок",
          "-20% медвежий рынок",
        ]}
        rightTitle="Про��зводительность BUYLOW"
        rightItems={[
          "+20~30% или более доходности",
          "Ротационная торговля ограничивает убытки до -10% или менее",
        ]}
        lang="ru"
      />

      <Paragraph>
        Другими словами, он разработан для <Accent>получения более высокой доходности, чем рынок</Accent>, когда рынки хорошие,
        и <Strong>минимизации убытков</Strong>, когда рынки плохие.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Ключевое осознание</SectionTitle>

      <Paragraph>
        Самое важное, что я понял, исследуя квант-торговлю:
      </Paragraph>

      <QuoteBlock>
        На каком активе вы основываете свои инвестиции?
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Реальный опыт: BTC против золота</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-2ru.png"
        alt="BTC vs Gold Performance Comparison"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <Paragraph>
        За последние 2 года я разрабатывал на основе <Strong>Bitcoin</Strong>,
        но когда весь рынок упал <Accent>��олее чем на -60% в одном ��аправлени��</Accent>,
        даже квант-программы с трудом реагировали.
      </Paragraph>

      <Paragraph>
        Однако стабильные активы как <Strong>золото</Strong> имеют
        <Accent>ограниченное падение</Accent>, производя гораздо ��олее стабильную ��оходность.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0">
          Вывод: <Strong>Выбор актива</Strong> — ключ к доходности квант-торговли.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Содержание этой книги</SectionTitle>

      <Paragraph>
        Эта книга объяснит <Strong>2 основные концепции</Strong>:
      </Paragraph>

      <BulletList items={[
        <><Strong>Какие активы выбрать для стабильной прибыли</Strong></>,
        <><Strong>Как работает алгоритм BUYLOW QUANT</Strong></>,
      ]} />

      <Paragraph>
        Хотя система рассчитывает автоматически,
        <Accent>инвесторы с большими активами</Accent> больше выигрывают от понимания принципов.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Целевая аудитория (повторно)</SectionTitle>

      <BulletList items={[
        <><Strong>Индивидуальные инвесторы</Strong> — используйте это для построения стратегии</>,
        <><Strong>Управляющие активами</Strong> — используйте как материалы для презентаций инвесторам</>,
      ]} />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Итак, давайте перейдём к <Strong>первой главе</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  es: () => (
    <>
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW E-Book"
        className="w-full max-w-[1000px] mx-auto my-5 mb-7 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(31, 224, 165, 0.08)' }}
      />

      <QuoteBlock>
        Este libro está escrito para usuarios que creen en la esencia de BUYLOW QUANT
        y prefieren operar la mayoría de sus activos a través de BUYLOW Quant en lugar de inversión personal.
      </QuoteBlock>

      <SectionTitle>Por qué se escribió este libro</SectionTitle>

      <Paragraph>
        Pensé que los materiales existentes de BUYLOW eran suficientes.
      </Paragraph>

      <Paragraph>
        Sin embargo, si hay personas que quieren <Strong>invertir la mayoría de sus activos en BUYLOW Quant</Strong>,
        creí que necesitaban materiales que les dieran <Accent>una convicción más fuerte</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Lectores objetivo</SectionTitle>

      <BulletList items={[
        <><Strong>Inversores individuales</Strong> — quienes quieren gestionar activos con BUYLOW Quant</>,
        <><Strong>CEOs de gestión de activos</Strong> — instituciones en todo el mundo que buscan gestionar activos con BUYLOW Quant</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0">
          Los inversores individuales pueden usar esto para <Strong>construir su estrategia</Strong>,
          mientras que los gestores de activos pueden usarlo como material de <Accent>presentación para inversores</Accent>.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Propósito de este libro</SectionTitle>

      <Paragraph>
        Hoy <Strong>explicaré lógicamente</Strong> cómo funciona exactamente <Accent>BUYLOW QUANT</Accent>
        y por qué alcanza establemente la tasa de retorno objetivo.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>��Qué es Quant?</SectionTitle>

      <Paragraph>
        <Strong>Quant</Strong> utiliza matemáticas, estadísticas y algoritmos informáticos
        para analizar datos de mercados financieros y crear estrategias de inversión.
      </Paragraph>

      <Paragraph>
        Significa <Accent>ejecutar esas estrategias a través de trading automatizado</Accent>.
      </Paragraph>

      <ComparisonBox
        leftTitle="Inversión Tradicional"
        leftItems={[
          "Depende de noticias",
          "Depende de intuición",
          "Decisiones emocionales",
          "Trading manual",
        ]}
        rightTitle="Inversión Quant"
        rightItems={[
          "Análisis de datos de precios",
          "Fórmulas de volumen/volatilidad",
          "Trading basado en reglas",
          "Ejecución automatizada",
        ]}
        lang="es"
      />

      <SectionDivider />

      <SectionTitle>Introducción a BUYLOW</SectionTitle>

      <Paragraph>
        Ahora, permítanme explicar el programa quant llamado <Accent>BUYLOW</Accent> en el mercado on-chain.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Cambios del mercado: La aparición de RWA</SectionTitle>

      {/* Imagen de estructura de mercado RWA */}
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[900px]">
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1.png"
            alt="Cambios en la estructura del mercado RWA"
            className="w-full h-auto rounded-xl"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(31, 224, 165, 0.1)",
            }}
          />
          <p className="text-center text-foreground/50 text-sm mt-3">Ejemplo de estructura de mercado RWA</p>
        </div>
      </div>

      <Paragraph>
        A partir de 2026, gracias a <Strong>RWA (Tokenización de Activos Reales)</Strong>,
        <Accent>activos financieros tradicionales</Accent> como oro, Nasdaq y S&P 500
        pueden negociarse en plataformas extranjeras con bajas comisiones.
      </Paragraph>

      <Paragraph>
        DEXs como <Strong>LITER</Strong> permiten negociar estos activos con casi cero comisiones.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Respuesta de BUYLOW: Expansión basada en RWA</SectionTitle>

      <Paragraph>
        El equipo BUYLOW Quant ha desarrollado trading quant para activos financieros tradicionales
        como oro y Nasdaq en respuesta a los <Accent>cambios de RWA</Accent>,
        logrando una <Strong>respuesta tremenda</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Estructura de rendimiento del algoritmo</SectionTitle>

      <QuoteBlock>
        Ganancias en subidas y laterales, resistencia en bajadas
      </QuoteBlock>

      <Paragraph>
        El algoritmo de trading BUYLOW genera ganancias cuando el mercado está en <Strong>lateral o alcista</Strong>.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="BUYLOW Performance Structure"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <ComparisonBox
        leftTitle="Retornos promedio del mercado"
        leftItems={[
          "+10% mercado alcista",
          "-20% mercado bajista",
        ]}
        rightTitle="Rendimiento BUYLOW"
        rightItems={[
          "+20~30% o más de retornos",
          "Trading rotativo limita pérdidas a -10% o menos",
        ]}
        lang="es"
      />

      <Paragraph>
        En otras palabras, está diseñado para <Accent>generar retornos más altos que el mercado</Accent> cuando los mercados van bien,
        y <Strong>minimizar pérdidas</Strong> cuando los mercados van mal.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Realización clave</SectionTitle>

      <Paragraph>
        Lo más importante que aprendí investigando el trading quant fue esto:
      </Paragraph>

      <QuoteBlock>
        ¿En qué activo basas tu inversión?
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Experiencia real: BTC vs Oro</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-2es.png"
        alt="BTC vs Gold Performance Comparison"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <Paragraph>
        Durante los últimos 2 años, desarrollé basándome en <Strong>Bitcoin</Strong>,
        pero cuando todo el mercado cayó <Accent>más del -60% en una dirección</Accent>,
        incluso los programas quant tuvieron dificultades para responder.
      </Paragraph>

      <Paragraph>
        Sin embargo, activos estables como el <Strong>oro</Strong> tienen
        <Accent>caída limitada</Accent>, produciendo retornos mucho más estables.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0">
          Conclusión: <Strong>La selección de activos</Strong> es la clave para los retornos quant.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Contenido de este libro</SectionTitle>

      <Paragraph>
        Este libro explicará <Strong>2 conceptos fundamentales</Strong>:
      </Paragraph>

      <BulletList items={[
        <><Strong>Qué activos elegir para ganancias continuas</Strong></>,
        <><Strong>Cómo funciona el algoritmo BUYLOW QUANT</Strong></>,
      ]} />

      <Paragraph>
        Aunque el sistema calcula automáticamente,
        <Accent>los inversores con activos más grandes</Accent> se benefician más de entender los principios.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Lectores objetivo (revisado)</SectionTitle>

      <BulletList items={[
        <><Strong>Inversores individuales</Strong> — Usa esto para construir tu estrategia</>,
        <><Strong>Gestores de activos</Strong> — Usa como material de presentación para inversores</>,
      ]} />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Bien, ahora pasemos al <Strong>Capítulo 1</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  id: () => (
    <>
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW E-Book"
        className="w-full max-w-[1000px] mx-auto my-5 mb-7 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(31, 224, 165, 0.08)' }}
      />

      <QuoteBlock>
        Buku ini ditulis untuk pengguna yang percaya pada esensi BUYLOW QUANT
        dan lebih memilih mengoperasikan sebagian besar aset mereka melalui BUYLOW Quant daripada investasi pribadi.
      </QuoteBlock>

      <SectionTitle>Mengapa Buku Ini Ditulis</SectionTitle>

      <Paragraph>
        Saya pikir materi BUYLOW yang ada sudah cukup.
      </Paragraph>

      <Paragraph>
        Namun, jika ada orang yang ingin <Strong>menginvestasikan sebagian besar aset mereka di BUYLOW Quant</Strong>,
        saya percaya mereka membutuhkan materi yang dapat memberikan <Accent>keyakinan lebih kuat</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Pembaca Target</SectionTitle>

      <BulletList items={[
        <><Strong>Investor Individu</Strong> — yang ingin mengelola aset dengan BUYLOW Quant</>,
        <><Strong>CEO Manajemen Aset</Strong> — institusi di seluruh dunia yang ingin mengelola aset dengan BUYLOW Quant</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0">
          Investor individu dapat menggunakan ini untuk <Strong>membangun strategi</Strong>,
          sementara manajer aset dapat menggunakannya sebagai materi <Accent>presentasi investor</Accent>.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Tujuan Buku Ini</SectionTitle>

      <Paragraph>
        Hari ini, saya akan <Strong>menjelaskan secara logis</Strong> bagaimana tepatnya <Accent>BUYLOW QUANT</Accent> bekerja
        dan mengapa ia secara stabil mencapai tingkat pengembalian target.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Apa itu Quant?</SectionTitle>

      <Paragraph>
        <Strong>Quant</Strong> menggunakan matematika, statistik, dan algoritma komputer
        untuk menganalisis data pasar keuangan dan membuat strategi investasi.
      </Paragraph>

      <Paragraph>
        Artinya <Accent>mengeksekusi strategi tersebut melalui trading otomatis</Accent>.
      </Paragraph>

      <ComparisonBox
        leftTitle="Investasi Tradisional"
        leftItems={[
          "Bergantung pada berita",
          "Bergantung pada intuisi",
          "Keputusan emosional",
          "Trading manual",
        ]}
        rightTitle="Investasi Quant"
        rightItems={[
          "Analisis data harga",
          "Formula volume/volatilitas",
          "Trading berbasis aturan",
          "Eksekusi otomatis",
        ]}
        lang="id"
      />

      <SectionDivider />

      <SectionTitle>Pengenalan BUYLOW</SectionTitle>

      <Paragraph>
        Sekarang, izinkan saya menjelaskan program quant bernama <Accent>BUYLOW</Accent> di pasar on-chain.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Perubahan Pasar: Kemunculan RWA</SectionTitle>

      {/* Gambar struktur pasar RWA */}
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[900px]">
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1.png"
            alt="Perubahan struktur pasar RWA"
            className="w-full h-auto rounded-xl"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(31, 224, 165, 0.1)",
            }}
          />
          <p className="text-center text-foreground/50 text-sm mt-3">Contoh struktur pasar RWA</p>
        </div>
      </div>

      <Paragraph>
        Mulai tahun 2026, berkat <Strong>RWA (Tokenisasi Aset Dunia Nyata)</Strong>,
        <Accent>aset keuangan tradisional</Accent> seperti emas, Nasdaq, dan S&P 500
        dapat diperdagangkan di platform luar negeri dengan biaya rendah.
      </Paragraph>

      <Paragraph>
        DEX seperti <Strong>LITER</Strong> memungkinkan perdagangan aset ini dengan hampir tanpa biaya.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Respons BUYLOW: Ekspansi Berbasis RWA</SectionTitle>

      <Paragraph>
        Tim BUYLOW Quant telah mengembangkan trading quant untuk aset keuangan tradisional
        seperti emas dan Nasdaq sebagai respons terhadap <Accent>perubahan RWA</Accent>,
        mencapai <Strong>respons yang luar biasa</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Struktur Kinerja Algoritma</SectionTitle>

      <QuoteBlock>
        Profit saat naik dan sideways, bertahan saat turun
      </QuoteBlock>

      <Paragraph>
        Algoritma trading BUYLOW menghasilkan profit ketika pasar dalam kondisi <Strong>sideways atau naik</Strong>.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="BUYLOW Performance Structure"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <ComparisonBox
        leftTitle="Return Rata-rata Pasar"
        leftItems={[
          "+10% pasar bullish",
          "-20% pasar bearish",
        ]}
        rightTitle="Kinerja BUYLOW"
        rightItems={[
          "+20~30% atau lebih return",
          "Trading rotasi membatasi kerugian hingga -10% atau kurang",
        ]}
        lang="id"
      />

      <Paragraph>
        Dengan kata lain, dirancang untuk <Accent>menghasilkan return lebih tinggi dari pasar</Accent> saat pasar bagus,
        dan <Strong>meminimalkan kerugian</Strong> saat pasar buruk.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Kesadaran Kunci</SectionTitle>

      <Paragraph>
        Hal terpenting yang saya pelajari saat meneliti trading quant adalah ini:
      </Paragraph>

      <QuoteBlock>
        Aset apa yang menjadi dasar investasi Anda?
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Pengalaman Nyata: BTC vs Emas</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-2id.png"
        alt="BTC vs Gold Performance Comparison"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <Paragraph>
        Selama 2 tahun terakhir, saya mengembangkan berdasarkan <Strong>Bitcoin</Strong>,
        tapi ketika seluruh pasar turun <Accent>lebih dari -60% dalam satu arah</Accent>,
        bahkan program quant kesulitan merespons.
      </Paragraph>

      <Paragraph>
        Namun, aset stabil seperti <Strong>emas</Strong> memiliki
        <Accent>penurunan terbatas</Accent>, menghasilkan return yang jauh lebih stabil.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0">
          Kesimpulan: <Strong>Pemilihan aset</Strong> adalah kunci return quant.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Isi Buku Ini</SectionTitle>

      <Paragraph>
        Buku ini akan menjelaskan <Strong>2 konsep inti</Strong>:
      </Paragraph>

      <BulletList items={[
        <><Strong>Aset apa yang harus dipilih untuk profit berkelanjutan</Strong></>,
        <><Strong>Bagaimana algoritma BUYLOW QUANT bekerja</Strong></>,
      ]} />

      <Paragraph>
        Meskipun sistem menghitung secara otomatis,
        <Accent>investor dengan aset lebih besar</Accent> mendapat manfaat lebih dari memahami prinsipnya.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Pembaca Target (Diulang)</SectionTitle>

      <BulletList items={[
        <><Strong>Investor Individu</Strong> — Gunakan ini untuk membangun strategi Anda</>,
        <><Strong>Manajer Aset</Strong> — Gunakan sebagai materi presentasi investor</>,
      ]} />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Baik, sekarang mari kita masuk ke <Strong>Bab 1</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  th: () => (
    <>
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW E-Book"
        className="w-full max-w-[1000px] mx-auto my-5 mb-7 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(31, 224, 165, 0.08)' }}
      />

      <QuoteBlock>
        หนังสือเล่มนี้เขียนขึ้นสำหรับผู้ใช้ที่เชื่อมั่นในแก่นแท้ของ BUYLOW QUANT
        และเลือกที่จะดำเ���ินการสินทรัพย์ส่วนใหญ่ผ่าน BUYLOW Quant แทนการลงทุนส่วนบุคคล
      </QuoteBlock>

      <SectionTitle>ทำไมถึงเขียนหนังสือเล่มนี้</SectionTitle>

      <Paragraph>
        ผมคิดว่าเอกสาร BUYLOW ที่มีอยู่นั้นเพียงพอแล้ว
      </Paragraph>

      <Paragraph>
        อย่างไรก็ตาม หากมีคนที่ต้องการ<Strong>ลงทุนสินทรัพย์ส่วนใหญ่ใน BUYLOW Quant</Strong>
        ผมเชื่อว่าพวกเขาต้องการเอกสารที่สามารถให้<Accent>ความมั่นใจที่แข็งแกร่งขึ้น</Accent>
      </Paragraph>

      <SectionDivider />

      <SectionTitle>กลุ่มผู้อ่านเป้าหมาย</SectionTitle>

      <BulletList items={[
        <><Strong>นักลงทุนรายบุคคล</Strong> — ผู้ที่ต้องการจัดการสินทรัพย์ด้วย BUYLOW Quant</>,
        <><Strong>CEO บริษัทจัดการสินทรัพย์</Strong> — สถาบันท��่วโลกที่ต้อ���การจัดการสินทรัพย์ด้วย BUYLOW Quant</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0">
          นั��ลงทุนรายบุคคลสามารถใช้สิ่งนี้เพื่อ<Strong>สร้างกลยุทธ์</Strong>ของพวกเขา
          ในขณะที่ผู้จัดการสินทรัพย์สามารถใช้เป็นเอกสาร<Accent>นำเสนอนักลงทุน</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>วัตถุประสงค์ของหนังสือเล่มนี้</SectionTitle>

      <Paragraph>
        ���ันนี้ ผมจะ<Strong>อธิบายอย่างมีเหตุผล</Strong>ว่า <Accent>BUYLOW QUANT</Accent> ทำงานอย่างไร
        และทำไมมันถึงบรรลุอัตราผลตอบแทนเป้าหมายอย่�����งมั่นคง
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Quant คืออะไร?</SectionTitle>

      <Paragraph>
        <Strong>Quant</Strong> ใช้คณิตศาสตร์ สถิติ และอัลกอริทึมคอมพิวเตอร์
        เพื่อวิเคราะห์ข้อมูลตลาดการเงินและสร้างกลยุทธ์การลงทุน
      </Paragraph>

      <Paragraph>
        หมายความว่า<Accent>ดำเนินกลยุทธ์เหล่านั้นผ่านการเทรดอัตโนมัติ</Accent>
      </Paragraph>

      <ComparisonBox
        leftTitle="การลงทุนแบบดั้งเดิม"
        leftItems={[
          "พึ่งพาข่าว",
          "พึ่งพาสัญชาตญาณ",
          "ตัดสินใจตามอารมณ์",
          "เทรดด้วยตนเอง",
        ]}
        rightTitle="การลงทุน Quant"
        rightItems={[
          "วิเคราะห์ข้อมูลราคา",
          "สูตรปริมาณ/ความผันผวน",
          "เทรดตามกฎ",
          "ดำเนินการอัตโนมัติ",
        ]}
        lang="th"
      />

      <SectionDivider />

      <SectionTitle>แนะนำ BUYLOW</SectionTitle>

      <Paragraph>
        ตอนนี้ ให้���มอธิบายโปรแกรม quant ที่ชื่อว่า <Accent>BUYLOW</Accent> ในตลาด on-chain
      </Paragraph>

      <SectionDivider />

      <SectionTitle>การเปลี่ยนแปลงของตลาด: การเกิดขึ้นของ RWA</SectionTitle>

      {/* ภ���พ������รงสร��างตลาด RWA */}
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[900px]">
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1.png"
            alt="การเปลี่ยนแปลงโครงสร้างตลาด RWA"
            className="w-full h-auto rounded-xl"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(31, 224, 165, 0.1)",
            }}
          />
          <p className="text-center text-foreground/50 text-sm mt-3">ตัวอย่างโครงสร้างตลาด RWA</p>
        </div>
      </div>

      <Paragraph>
        เริ่มจากปี 2026 ด้วย <Strong>RWA (การโทเคนไนซ์สินทรัพย์จริง)</Strong>
        <Accent>สินทรัพย์ทางการเงินแ��บดั้งเดิม</Accent> เช่น ทองคำ, Nasdaq และ S&P 500
        สามาร���ซื้อขายได้บนแพ���ตฟอร์มต่างประเทศด้วยค่าธรรมเนียมต่ำ
      </Paragraph>

      <Paragraph>
        DEX เช่น <Strong>LITER</Strong> อนุญาตให้ซื้อขายสินทรัพย์เหล่านี้โดยแทบไม่มีค่าธรรมเนียม
      </Paragraph>

      <SectionDivider />

      <SectionTitle>การตอบสนองของ BUYLOW: การขยายตัวบนพื้นฐาน RWA</SectionTitle>

      <Paragraph>
        ทีม BUYLOW Quant ได้พัฒนาการเทรด quant สำหรับสินทรัพย์ทางการเงินแบบดั้งเดิม
        เช่น ทองคำและ Nasdaq เพื่อตอบสนอง��่อ<Accent>การเปลี่ยนแปลง RWA</Accent>
        และได้รับ<Strong>การตอบรับอย่างมหาศาล</Strong>
      </Paragraph>

      <SectionDivider />

      <SectionTitle>โครงสร้างประสิทธิภาพของอั��กอริทึม</SectionTitle>

      <QuoteBlock>
        ก���ไรใ���ช่วงขา���ึ้นและ sideways, ยืนหยัดในช่วงขาลง
      </QuoteBlock>

      <Paragraph>
        อัลกอริทึมการเทรดของ BUYLOW สร้างกำไ���เมื่อตลาดอยู่ใน<Strong>ช่วง sideways หรือขาขึ้น</Strong>
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="BUYLOW Performance Structure"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <ComparisonBox
        leftTitle="ผลตอบแทนเฉลี่ยของตลาด"
        leftItems={[
          "+10% ตลาดกระทิง",
          "-20% ตลาดหมี",
        ]}
        rightTitle="ประสิทธิภาพ BUYLOW"
        rightItems={[
          "+20~30% หรือมากกว่า���ลตอบแทน",
          "การเทรดแบบหมุนเวียนจำกัดขาดทุนที่ -10% หรือน้อยกว่า",
        ]}
        lang="th"
      />

      <Paragraph>
        กล่าวอีกนัยหนึ่ง ออกแบบมาเพื่อ<Accent>สร้างผลตอบแทนที่สูงกว่าตลาด</Accent>เมื่อตลาดดี
        และ<Strong>ลดการขาดทุน</Strong>เมื่อตลาดไม่ดี
      </Paragraph>

      <SectionDivider />

      <SectionTitle>การตระหนักรู้ที่สำคัญ</SectionTitle>

      <Paragraph>
        สิ่งที่สำคัญที่สุดที่ผมเรียนรู้ขณะวิจัยการเทรด quant คือ:
      </Paragraph>

      <QuoteBlock>
        คุณกำลังลงทุนบนสินทรัพย์อะไร?
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>ประสบการณ์จริง: BTC vs ทองคำ</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-2th.png"
        alt="BTC vs Gold Performance Comparison"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <Paragraph>
        ในช่วง 2 ปีที่ผ่านมา ผมพัฒนาบนพื้นฐาน <Strong>Bitcoin</Strong>
        แต่เมื่อตลาดทั้งหมดตก<Accent>มากกว่า -60% ในทิศทางเดียว</Accent>
        แม้แต่โปรแกรม quant ก็ยากที่จะตอบสนอง
      </Paragraph>

      <Paragraph>
        อย่างไรก็ตาม สินทรัพย์ที���มั่นคงเช่��� <Strong>ทองคำ</Strong> มี
        <Accent>ขีดจำกัดการลดลง</Accent> ทำให้ผลตอบแทนมีความมั่นคงมากขึ้น
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0">
          สรุป: <Strong>การเลือกสินทรัพย์</Strong>คือกุญแจสู่ผลตอบแทน quant
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>เนื้อหาของหนังสือเล่มนี้</SectionTitle>

      <Paragraph>
        หนังสือเล่มนี้จะอธิบาย<Strong>2 แนวคิด��ลัก</Strong>:
      </Paragraph>

      <BulletList items={[
        <><Strong>ควรเลือกสินทรัพย์อะไรเพื่อผลกำไรอย่างต่อเนื่อง</Strong></>,
        <><Strong>อัลกอริทึม BUYLOW QUANT ทำงานอย่างไร</Strong></>,
      ]} />

      <Paragraph>
        แม้ว่าระบบจะคำนวณโดยอัตโนมัติ
        <Accent>นักลงทุนที่มีสินทรัพย์มากขึ้น</Accent>จะได้ปร��โ��ชน์มา���ขึ้นจา�����ารเข้��ใจหลักก���ร
      </Paragraph>

      <SectionDivider />

      <SectionTitle>กลุ่มผู้อ่านเป้าหมาย (ทบทวน)</SectionTitle>

      <BulletList items={[
        <><Strong>นักลงทุนรายบุคคล</Strong> — ใช้สิ่งนี้เพื่อสร้างกลยุทธ์ขอ���คุณ</>,
        <><Strong>ผู้จัดการสินทรัพย์</Strong> — ใช้เป็นเอกสารนำเสนอนักลงทุน</>,
      ]} />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          เอาล่ะ ตอนนี้มาเข้าสู่<Strong>บทที่ 1</Strong> กัน
        </Paragraph>
      </HighlightBox>
    </>
  ),
  vi: () => (
    <>
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW E-Book"
        className="w-full max-w-[1000px] mx-auto my-5 mb-7 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(31, 224, 165, 0.08)' }}
      />

      <QuoteBlock>
        Cuốn sách này được viết cho những người dùng tin tưởng vào bản chất của BUYLOW QUANT
        và ưu tiên vận hành phần lớn tài sản thông qua BUYLOW Quant thay vì đầu tư cá nhân.
      </QuoteBlock>

      <SectionTitle>Tại sao viết cuốn sách này</SectionTitle>

      <Paragraph>
        Tôi nghĩ rằng các tài liệu BUYLOW hiện có đã đủ.
      </Paragraph>

      <Paragraph>
        Tuy nhiên, nếu có những người muốn <Strong>đầu tư phần lớn tài sản vào BUYLOW Quant</Strong>,
        tôi tin rằng họ cần tài liệu có thể mang lại <Accent>niềm tin mạnh mẽ hơn</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Đối tượng độc giả</SectionTitle>

      <BulletList items={[
        <><Strong>Nhà đầu tư cá nhân</Strong> — những người muốn quản lý tài sản với BUYLOW Quant</>,
        <><Strong>CEO quản lý tài sản</Strong> — các tổ chức trên toàn thế giới muốn quản lý tài sản với BUYLOW Quant</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0">
          Nhà đầu tư cá nhân có thể sử dụng điều này để <Strong>xây dựng chiến lược</Strong>,
          trong khi các nhà quản lý tài sản có thể sử dụng làm tài liệu <Accent>thuyết trình cho nhà đầu tư</Accent>.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Mục đích của cuốn sách</SectionTitle>

      <Paragraph>
        Hôm nay, tôi sẽ <Strong>giải thích một cách logic</Strong> chính xác <Accent>BUYLOW QUANT</Accent> hoạt động như thế nào
        và tại sao nó đạt được tỷ suất lợi nhuận mục tiêu một cách ổn định.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Quant là gì?</SectionTitle>

      <Paragraph>
        <Strong>Quant</Strong> sử dụng toán học, thống kê và thuật toán máy tính
        để phân tích dữ liệu thị trường tài chính và tạo chiến lược đầu tư.
      </Paragraph>

      <Paragraph>
        Có nghĩa là <Accent>thực thi các chiến lược đó thông qua giao dịch tự động</Accent>.
      </Paragraph>

      <ComparisonBox
        leftTitle="Đầu tư truyền thống"
        leftItems={[
          "Dựa vào tin tức",
          "Dựa vào trực giác",
          "Quyết định cảm tính",
          "Giao dịch thủ công",
        ]}
        rightTitle="Đầu tư Quant"
        rightItems={[
          "Phân tích dữ liệu giá",
          "Công thức khối lượng/biến động",
          "Giao dịch dựa trên quy tắc",
          "Thực thi tự động",
        ]}
        lang="vi"
      />

      <SectionDivider />

      <SectionTitle>Giới thiệu BUYLOW</SectionTitle>

      <Paragraph>
        Bây giờ, hãy để tôi giải thích chương trình quant có tên <Accent>BUYLOW</Accent> trên thị trường on-chain.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Thay đổi thị trường: Sự xuất hiện của RWA</SectionTitle>

      {/* Hình ảnh cấu trúc thị trường RWA */}
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[900px]">
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1.png"
            alt="Thay đổi cấu trúc thị trường RWA"
            className="w-full h-auto rounded-xl"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(31, 224, 165, 0.1)",
            }}
          />
          <p className="text-center text-foreground/50 text-sm mt-3">Ví dụ cấu trúc thị trường RWA</p>
        </div>
      </div>

      <Paragraph>
        Bắt đầu từ năm 2026, nhờ <Strong>RWA (Token hóa tài sản thực)</Strong>,
        <Accent>các tài sản tài chính truyền thống</Accent> như vàng, Nasdaq và S&P 500
        có thể được giao dịch trên các nền tảng nước ngoài với phí thấp.
      </Paragraph>

      <Paragraph>
        Các DEX như <Strong>LITER</Strong> cho phép giao dịch các tài sản này gần như không mất phí.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Phản ứng của BUYLOW: Mở rộng dựa trên RWA</SectionTitle>

      <Paragraph>
        ���ội ngũ BUYLOW Quant ��ã phát triển giao dịch quant cho các tài sản tài chính truyền thống
        như vàng và Nasdaq để đáp ứng <Accent>những thay đổi RWA</Accent>,
        đạt được <Strong>phản hồi rất tích cực</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Cấu trúc hiệu suất thuật toán</SectionTitle>

      <QuoteBlock>
        Lợi nhuận khi tăng và đi ngang, trụ vững khi giảm
      </QuoteBlock>

      <Paragraph>
        Thuật toán giao dịch BUYLOW tạo lợi nhuận khi thị trường trong tr���ng thái <Strong>đi ngang hoặc tăng</Strong>.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="BUYLOW Performance Structure"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <ComparisonBox
        leftTitle="Lợi nhuận trung bình thị trường"
        leftItems={[
          "+10% thị trường tăng",
          "-20% thị trường giảm",
        ]}
        rightTitle="Hiệu suất BUYLOW"
        rightItems={[
          "+20~30% hoặc hơn lợi nhuận",
          "Giao dịch luân chuyển giới hạn lỗ ở -10% hoặc ít hơn",
        ]}
        lang="vi"
      />

      <Paragraph>
        Nói cách khác, được thiết kế để <Accent>tạo lợi nhuận cao hơn thị trường</Accent> khi thị trường tốt,
        và <Strong>giảm thiểu thua lỗ</Strong> khi thị trường xấu.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Nhận thức quan trọng</SectionTitle>

      <Paragraph>
        Điều quan trọng nhất tôi học được khi nghiên cứu giao dịch quant là:
      </Paragraph>

      <QuoteBlock>
        Bạn đang đầu tư dựa trên tài sản n��o?
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Kinh nghiệm thực tế: BTC vs Vàng</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-2vn.png"
        alt="BTC vs Gold Performance Comparison"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <Paragraph>
        Trong 2 năm qua, tôi phát triển dựa trên <Strong>Bitcoin</Strong>,
        nhưng khi toàn bộ thị trường giảm <Accent>hơn -60% theo một hướng</Accent>,
        ngay cả các chương trình quant cũng gặp khó khăn trong việc phản ứng.
      </Paragraph>

      <Paragraph>
        Tuy nhi��n, các tài sản ổn định như <Strong>vàng</Strong> c��
        <Accent>giới hạn giảm</Accent>, tạo ra lợi nhuận ổn định hơn nhiều.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0">
          Kết luận: <Strong>Lựa chọn tài sản</Strong> là chìa khóa cho lợi nhuận quant.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Nội dung cuốn sách</SectionTitle>

      <Paragraph>
        Cuốn sách này sẽ giải thích <Strong>2 khái niệm cốt lõi</Strong>:
      </Paragraph>

      <BulletList items={[
        <><Strong>Nên chọn tài sản nào để có lợi nhuận liên tục</Strong></>,
        <><Strong>Thuật toán BUYLOW QUANT hoạt động như thế nào</Strong></>,
      ]} />

      <Paragraph>
        Mặc dù hệ thống tính toán tự động,
        <Accent>nhà đầu tư có tài sản lớn hơn</Accent> sẽ được hưởng l��i nhiều hơn từ việc hi��u các nguyên tắc.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Đối tượng độc giả (Nhắc lại)</SectionTitle>

      <BulletList items={[
        <><Strong>Nhà đầu tư cá nhân</Strong> — Sử dụng điều này để xây dựng chiến lược của bạn</>,
        <><Strong>Nhà quản lý tài sản</Strong> — Sử dụng làm tài liệu thuyết trình cho nhà đầu tư</>,
      ]} />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Được rồi, bây giờ hãy bước vào <Strong>Chương 1</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  tr: () => (
    <>
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/ebook.png"
        alt="BUYLOW E-Book"
        className="w-full max-w-[1000px] mx-auto my-5 mb-7 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(31, 224, 165, 0.08)' }}
      />

      <QuoteBlock>
        Bu kitap, BUYLOW QUANT&apos;ın özüne inanan
        ve varlıklarının çoğunu kişisel yatırım yerine BUYLOW Quant üzerinden yönetmeyi tercih eden kullanıcılar için yazılmıştır.
      </QuoteBlock>

      <SectionTitle>Bu Kitap Neden Yazıldı</SectionTitle>

      <Paragraph>
        Mevcut BUYLOW materyallerinin yeterli olduğunu düşünmüştüm.
      </Paragraph>

      <Paragraph>
        Ancak, <Strong>varlıklarının çoğunu BUYLOW Quant&apos;a yatırmak isteyen</Strong> insanlar varsa,
        onlara <Accent>daha güçlü bir inanç</Accent> verebilecek materyallere ihtiyaçları olduğuna inandım.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Hedef Okuyucular</SectionTitle>

      <BulletList items={[
        <><Strong>Bireysel Yatırımcılar</Strong> — BUYLOW Quant ile varlık yönetmek isteyenler</>,
        <><Strong>Varlık Yönetimi CEO&apos;ları</Strong> — BUYLOW Quant ile varlık yönetmek isteyen dünya çapındaki kurumlar</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0">
          Bireysel yatırımcılar bunu <Strong>stratejilerini oluşturmak</Strong> için kullanabilir,
          varlık yöneticileri ise <Accent>yatırımcı sunumu</Accent> materyali olarak kullanabilir.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Bu Kitabın Amacı</SectionTitle>

      <Paragraph>
        Bugün, <Accent>BUYLOW QUANT</Accent>&apos;ın tam olarak nasıl çalıştığını
        ve neden hedef getiri oranına istikrarlı bir şekilde ulaştığını <Strong>mantıksal olarak açıklayacağım</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Quant Nedir?</SectionTitle>

      <Paragraph>
        <Strong>Quant</Strong>, finansal piyasa verilerini analiz etmek
        ve yatırım stratejileri oluşturmak için matematik, istatistik ve bilgisayar algoritmalarını kullanır.
      </Paragraph>

      <Paragraph>
        Bu, <Accent>otomatik ticaret yoluyla bu stratejilerin yürütülmesi</Accent> anlamına gelir.
      </Paragraph>

      <ComparisonBox
        leftTitle="Geleneksel Yatırım"
        leftItems={[
          "Haberlere dayanır",
          "Sezgiye dayanır",
          "Duygusal kararlar",
          "Manuel ticaret",
        ]}
        rightTitle="Quant Yatırım"
        rightItems={[
          "Fiyat veri analizi",
          "Hacim/volatilite formülleri",
          "Kurala dayalı ticaret",
          "Otomatik yürütme",
        ]}
        lang="tr"
      />

      <SectionDivider />

      <SectionTitle>BUYLOW&apos;a Giriş</SectionTitle>

      <Paragraph>
        Şimdi, on-chain pazarında <Accent>BUYLOW</Accent> adlı quant programını açıklayayım.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Piyasa De��işiklikleri: RWA&apos;nın Ortaya Çıkışı</SectionTitle>

      {/* RWA pazar yapısı görseli */}
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[900px]">
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1.png"
            alt="RWA pazar yapısı değişiklikleri"
            className="w-full h-auto rounded-xl"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(31, 224, 165, 0.1)",
            }}
          />
          <p className="text-center text-foreground/50 text-sm mt-3">RWA pazar yapısı örne��i</p>
        </div>
      </div>

      <Paragraph>
        2026&apos;dan itibaren, <Strong>RWA (Gerçek Dünya Varlık Tokenizasyonu)</Strong> sayesinde,
        altın, Nasdaq ve S&P 500 gibi <Accent>geleneksel finansal varlıklar</Accent>
        yabancı platformlarda düşük ücretlerle işlem görebilir.
      </Paragraph>

      <Paragraph>
        <Strong>LITER</Strong> gibi DEX&apos;ler bu varlıkların neredeyse sıfır ücretle işlem görmesine izin verir.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>BUYLOW&apos;ın Yanıtı: RWA Tabanlı Genişleme</SectionTitle>

      <Paragraph>
        BUYLOW Quant ekibi, <Accent>RWA değişikliklerine</Accent> yanıt olarak
        altın ve Nasdaq gibi geleneksel finansal varlıklar için quant ticareti geliştirdi
        ve <Strong>muazzam bir yanıt</Strong> aldı.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Algoritma Performans Yapısı</SectionTitle>

      <QuoteBlock>
        Yükseliş ve yatay seyirde kâr, düşüşte direnç
      </QuoteBlock>

      <Paragraph>
        BUYLOW ticaret algoritması, piyasa <Strong>yatay veya yükseliş</Strong> trendindeyken kâr elde eder.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-1.jpg"
        alt="BUYLOW Performance Structure"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <ComparisonBox
        leftTitle="Ortalama Piyasa Getirileri"
        leftItems={[
          "+%10 boğa piyasası",
          "-%20 ayı piyasası",
        ]}
        rightTitle="BUYLOW Performansı"
        rightItems={[
          "+%20~30 veya daha fazla getiri",
          "Rotasyon ticareti kayıpları -%10 veya daha az ile sınırlar",
        ]}
        lang="tr"
      />

      <Paragraph>
        Başka bir deyişle, piyasalar iyi olduğunda <Accent>piyasadan daha yüksek getiri elde etmek</Accent>
        ve piyasalar kötü olduğunda <Strong>kayıpları en aza indirmek</Strong> için tasarlanmıştır.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Önemli Farkındalık</SectionTitle>

      <Paragraph>
        Quant ticaretini araştırırken öğrendiğim en önemli şey şuydu:
      </Paragraph>

      <QuoteBlock>
        Yatırımınızı hangi varlığa dayandırıyorsunuz?
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Gerçek Deneyim: BTC vs Altın</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/1-2tr.png"
        alt="BTC vs Gold Performance Comparison"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <Paragraph>
        Son 2 yılda <Strong>Bitcoin</Strong> temelinde geliştirdim,
        ancak tüm piyasa <Accent>tek yönde -%60&apos;tan fazla</Accent> düştüğünde,
        quant programları bile yanıt vermekte zorlandı.
      </Paragraph>

      <Paragraph>
        Ancak, <Strong>altın</Strong> gibi istikrarlı varlıkların
        <Accent>sınırlı düşüşü</Accent> var ve çok daha istikrarlı getiriler üretiyor.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0">
          Sonuç: <Strong>Varlık seçimi</Strong> quant getirileri için anahtardır.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Bu Kitabın İçeriği</SectionTitle>

      <Paragraph>
        Bu kitap <Strong>2 temel kavramı</Strong> açıklayacak:
      </Paragraph>

      <BulletList items={[
        <><Strong>Sürekli kâr için hangi varlıkların seçilmesi gerektiği</Strong></>,
        <><Strong>BUYLOW QUANT algoritmasının nasıl çalıştığı</Strong></>,
      ]} />

      <Paragraph>
        Sistem otomatik olarak hesaplasa da,
        <Accent>daha büyük varlıklara sahip yatırımcılar</Accent> ilkeleri anlamaktan daha fazla fayda görür.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Hedef Okuyucular (Tekrar)</SectionTitle>

      <BulletList items={[
        <><Strong>Bireysel Yatırımcılar</Strong> — Stratejinizi oluşturmak için bunu kullanın</>,
        <><Strong>Varlık Yöneticileri</Strong> — Yatırımcı sunumu materyali olarak kullanın</>,
      ]} />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Pekâlâ, şimdi <Strong>1. Bölüm</Strong>&apos;e geçelim.
        </Paragraph>
      </HighlightBox>
    </>
  ),
}

// Gold Chapter Content: 금 자산의 특징
const GoldContent = {
  ko: () => (
    <>
      {/* 1. 도입 - 왜 금인가 */}
      <QuoteBlock>
        내가 가장 선호하는 자산은 금(Gold)이다.<br />
        그 이유는 어떤 자산보다 하방이 막혀있고<br />
        우상향할 수밖에 없는 경제학적 구조를 가졌기 때문이다.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>하방이 막혀있는 자산은 BUYLOW Quant에 최적화된 자산이다</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        단순하게 역사적으로 금이 1971년부터 2026년까지 하방이 막혀있는 움직임을 보여줬다고
        단순하게 믿는 게 아니다.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>미래에도 왜 금이 하방이 막혀있고 우상향할 수밖에 없는지</Strong><br />
        경제적으로, 구조적으로 이해할 수 있어야 한다.
      </Paragraph>

      <SectionDivider />

      {/* 2. 금의 핵심 특성 카드 */}
      <SectionTitle>금의 핵심 특성</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">안전자산</div>
          <div className="text-foreground/50 text-sm">위기 시 가치 상승</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">인플레이션 헷지</div>
          <div className="text-foreground/50 text-sm">화폐가치 하락 방어</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">무상관성</div>
          <div className="text-foreground/50 text-sm">주식과 낮은 상관관계</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. ���사적 배경 - 브���튼우즈 체제 */}
      <SectionTitle>금의 역사: 브레튼우즈 체제</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("ko")} alt="금의 역사: 브레튼우즈 체제 차트" />

      <Paragraph>
        미래에 금의 가격 흐름을 잘 분석하기 위해서는<br />
        과거 금의 역사를 살펴봐야 한다.
      </Paragraph>

      <CalloutBox type="info">
        1944년~1971년: 브레튼우즈 체제
      </CalloutBox>

      <Paragraph>
        2차 세계대전 이후 <Strong>브레튼우즈 체제</Strong>라는 구조로 금 가격이 강해졌다.
      </Paragraph>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">금 1온스 = 35달러</div>
          <div className="text-foreground/60">금과 달러의 가치는 동일했다</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. 닉슨 쇼크 */}
      <SectionTitle>1971년 8월 15일: 닉슨 쇼크</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="1971년 닉슨 쇼크 - 금본위제 붕괴" />

      <WarningBox>
        닉슨 대통령: {`"달러를 더 이상 금으로 교환하지 않겠다"`}
      </WarningBox>

      <Paragraph>
        그 결과 <Strong>(달러 = 금)</Strong> 공식이 깨졌다.<br />
        이러한 금본위제가 사라지자 미국은 돈을 어마무시하게 풀기 시작했다.
      </Paragraph>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-lg text-foreground/70 mb-2">금본위제 종료 후 인플레이션 폭발</div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971년</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980년</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% 상승</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. 금도 항상 오르지 않는다 */}
      <SectionTitle>금도 항상 오르는 것은 아니다</SectionTitle>

      <Paragraph>
        하지만 금 가격은 매번 우상향하는 것만은 아니었다.
      </Paragraph>

      <WarningBox>
        1970년대 미국 CPI(물가 상승률)이 폭등하면서<br />
        미국 중앙은��이 인플레이션을 잡기 위해 금리를 어마무시하�� 올렸다.
      </WarningBox>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">1980년대 미국 금리: 20%</div>
          <div className="text-foreground/60">
            은행에 맡기면 이자 20%를 주니<br />
            현금의 가치가 상승했고<br />
            그 결과 금, 주식, 부동산 가격이 폭락했다.
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. 금리와 금 가격의 관계 */}
      <SectionTitle>금리와 금 가격의 관계</SectionTitle>

      <Paragraph>
        최근 금(GOLD) 차트를 보면 알 수 있다:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">금리 인하 시</div>
          <div className="text-foreground/70">
            코로나때 금리 인하 → <Strong>금 가격 폭등</Strong>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">금리 인상 시</div>
          <div className="text-foreground/70">
            코로나 이후 금리 인상 → <Strong>금 가격 폭락</Strong>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. 양적완화와 금 가격 */}
      <SectionTitle>양적완화(QE)와 금 가격</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("ko")}
        alt="양적완화와 금 가격 상관관계"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <BulletList items={[
        <>2008년 금융위기 이후 세계 중앙은행들이 <Strong>양적완화(QE)</Strong> → 금 가격 상승</>,
        <>코로나 이후 <Strong>초대형 양적완화(QE)</Strong> → 금 가격 상승</>,
        <>화폐 공급량이 늘어날수록 → <Strong>금의 가격은 상승</Strong></>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>전 세계적으로 화폐 공급량이 늘어날수록 금 가격은 상승한다</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        당신이 직접 전세계 중앙은행들이 1년에 얼마나 돈을 푸는지 알아보면<br />
        금 가격 상승에 대한 &apos;믿음&apos;은 더욱 강해질 것이다.
      </Paragraph>

      <SectionDivider />

      {/* 8. 공급 vs 통화량 구조 */}
      <SectionTitle>공급 vs 통화량: 구조적 우상향</SectionTitle>

      <Paragraph>
        아마 독자들 중 금 광산을 생각하면서<br />
        금도 매년 물량이 풀린다고 반박할 수도 있다.
      </Paragraph>

      <ComparisonBox
        leftTitle="금 연간 생산량"
        leftItems={[
          "연 1~2% 증가",
          "물리적 한계 존재",
          "채굴 비용 증가",
        ]}
        rightTitle="글로벌 통화 공급"
        rightItems={[
          "수십 배 이상 증가",
          "한계 없음",
          "부채 해결을 위해 계속 증가",
        ]}
        lang="ko"
      />

      <WarningBox>
        현재 전 세계 부채는 GDP 대비 350% 이상<br />
        이 부채를 해결하는 유일한 방법은<br />
        돈을 찍어내서 화폐 가치를 낮추는 것밖에 없다.
      </WarningBox>

      <Paragraph>
        미래에도 전 세계 중앙은행은 돈을 더 미친 듯이 풀 것이고,<br />
        그 결과 <Strong>인플레이션 ▲ → 금 가격 ▲</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 9. 실제 수요 구조 */}
      <SectionTitle>금의 하방을 받쳐주는 실제 수요</SectionTitle>

      <BulletList items={[
        <><Strong>중앙은행의 금 매수</Strong> — 전 세계 중앙은행들의 연간 금 매수량이 수천 톤 이상</>,
        <><Strong>국민 수요</Strong> — 중국, 인도, 터키 같은 국가의 금 매수량이 어마무시함</>,
        <><Strong>기업/개인 매수세</Strong> — 기업, 개인, 중앙은행들의 어마무시한 매수세가 금의 가격 하방을 막아줌</>,
      ]} />

      <SectionDivider />

      {/* 10. 위기 상황에서 금의 역할 */}
      <SectionTitle>위기 상황에서의 금</SectionTitle>

      <Paragraph>
        전쟁 같은 불확실한 상황에서도<br />
        현금, 주식, 부동산의 가치에 대한 불신으로 인해<br />
        <Strong>금의 가격은 오히려 상승한다.</Strong>
      </Paragraph>

      <div className="my-8 space-y-3">
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">전쟁</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">돈 대량 공급</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">인플레 상승</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">금 가격 상승</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">금융위기</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">돈 대량 공급</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">인플레 상승</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">금 가격 상승</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">부채 증가</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">돈 대량 공급</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">화폐 가치 하락</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">금 가격 상승</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 11. 금의 유일한 리스크 */}
      <SectionTitle>금의 유일한 리스크: 금리 급등</SectionTitle>

      <Paragraph>
        그렇다면 &apos;금(GOLD)&apos;은 무적이고, 수십 년간 우상향만 했을까?<br />
        <Strong>아니다.</Strong>
      </Paragraph>

      <WarningBox>
        앞서 설명했지만 1980년대 미국 금리가 20% 상승할 때,<br />
        금 가격은 크게 하락했다.
      </WarningBox>

      <Paragraph>
        즉, 우리가 앞으로 살펴봐야 할 것은 <Strong>미국의 인플레이션</Strong>이다.<br />
        미국이 과도하게 인플레이션이 높아져서<br />
        금리를 강하게 올릴 경우 금의 가격 하락으로 이어질 수 있기 때문이다.
      </Paragraph>

      <CalloutBox type="info">
        하지만 현재 금융 시스템에서는 금리를 10% 이상까지 올릴 수 없다고 판단하기 때문에<br />
        금의 가격은 꾸준히 우상향할 것이라고 본다.
      </CalloutBox>

      <SectionDivider />

      {/* 12. BUYLOW와 금의 궁합 */}
      <SectionTitle>BUYLOW 퀀트와 금의 궁합</SectionTitle>

      <Paragraph>
        대부분 GOLD(금)으로 BUYLOW 프로그램을 구동할 것이기에<br />
        금에 대한 특징을 좀 길게 설명해봤다.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>금은 횡보장에서 퀀트 수익을 극대화할 수 있는 자산이다</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>하방이 막힌 자산</Strong> — 구조적으로 하락 리스크가 제한됨</>,
        <><Strong>완만한 우상향</Strong> — 급등/급락 없이 안정적인 상승</>,
        <><Strong>기술적 반등</Strong> — 하락 시에도 기술적 반등을 줌</>,
        <><Strong>순매매에 적합</Strong> — 1차 가두리, BUYLOW 알고리즘과 최적 궁합</>,
      ]} />

      <SectionDivider />

      {/* 13. 사용자 행동 가이드 */}
      <SectionTitle>사용자 행동 가이드</SectionTitle>

      <Paragraph>
        독자들은 이러한 금의 우상향 구조에 대한 특징을 알았으니,<br />
        앞으로 다음 2가지를 꾸준히 체크하면 된다:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">미국 인플레이션</div>
          <div className="text-foreground/50 text-sm">CPI 동향 체크</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">금리 인상 여부</div>
          <div className="text-foreground/50 text-sm">Fed 금리 정책 체크</div>
        </div>
      </div>

      <SectionDivider />

      {/* 14. 마무리 - 직설적 톤 */}
      <QuoteBlock>
        자 이제 금(Gold) 가격이 하방이 막혀있고<br />
        우상향할 수밖에 없는 구조라고 이해가 됐지?
      </QuoteBlock>

      <WarningBox>
        만약 위에서 내가 한 이야기가 이해가 가지 않는다면,<br />
        <Strong>ChatGPT를 돌려서라도 공부해라.</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">돈은 아무나 떠먹여 주지 않는다.</div>
          <div className="text-foreground/80">퀀트 프로그램의 설정 값을 선택하는 건 <Strong>사용자</Strong>고</div>
          <div className="text-foreground/80">프로그램은 단지 <Strong>자동화 도구</Strong>일 뿐이다.</div>
          <div className="text-amber-400 font-bold mt-4">이러한 경제 공부는 필수라고 생각한다.</div>
        </div>
      </div>

      <SectionDivider />

      {/* 15. 다음 챕터 연결 */}
      <Paragraph className="text-center text-foreground/60">
        자, 금에 대한 자산의 특징을 공부했으니<br />
        이제 나스닥 / S&P500에 대해서 알아보자.
      </Paragraph>
    </>
  ),
  en: () => (
    <>
      {/* 1. Introduction - Why Gold */}
      <QuoteBlock>
        My most preferred asset is Gold.<br />
        The reason is that it has an economic structure where<br />
        the downside is limited and it can only trend upward.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Assets with limited downside are optimized for BUYLOW Quant</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        This is not simply believing that gold has shown downside-protected movement
        from 1971 to 2026 based on history alone.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>You need to understand why gold will continue to have limited downside
          and trend upward</Strong> — economically and structurally.
      </Paragraph>

      <SectionDivider />

      {/* 2. Core Characteristics Cards */}
      <SectionTitle>Core Characteristics of Gold</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Safe Haven</div>
          <div className="text-foreground/50 text-sm">Value rises in crisis</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Inflation Hedge</div>
          <div className="text-foreground/50 text-sm">Protects against currency devaluation</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Low Correlation</div>
          <div className="text-foreground/50 text-sm">Low correlation with stocks</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. Historical Background - Bretton Woods */}
      <SectionTitle>Gold History: The Bretton Woods System</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("en")} alt="Gold History: The Bretton Woods System Chart" />

      <Paragraph>
        To analyze future gold price movements well,<br />
        we must examine the history of gold.
      </Paragraph>

      <CalloutBox type="info">
        1944-1971: The Bretton Woods System
      </CalloutBox>

      <Paragraph>
        After World War II, gold prices were determined by a structure called
        the <Strong>Bretton Woods System</Strong>.
      </Paragraph>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">1 oz Gold = $35</div>
          <div className="text-foreground/60">The value of gold and the dollar were equivalent</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. Nixon Shock */}
      <SectionTitle>August 15, 1971: The Nixon Shock</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="1971 Nixon Shock - End of Gold Standard" />

      <WarningBox>
        President Nixon: {`"We will no longer exchange dollars for gold"`}
      </WarningBox>

      <Paragraph>
        As a result, the <Strong>(Dollar = Gold)</Strong> formula broke.<br />
        Once the gold standard disappeared, the US began printing money at an enormous rate.
      </Paragraph>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-lg text-foreground/70 mb-2">Post Gold Standard: Inflation Explosion</div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% Increase</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. Gold Doesn't Always Rise */}
      <SectionTitle>Gold Doesn&apos;t Always Rise</SectionTitle>

      <Paragraph>
        However, gold prices did not always trend upward.
      </Paragraph>

      <WarningBox>
        In the 1970s, US CPI (inflation rate) skyrocketed,<br />
        and the Federal Reserve raised interest rates dramatically to control inflation.
      </WarningBox>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">1980s US Interest Rate: 20%</div>
          <div className="text-foreground/60">
            With banks offering 20% interest,<br />
            cash value increased,<br />
            and as a result, gold, stocks, and real estate prices collapsed.
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. Interest Rates and Gold */}
      <SectionTitle>The Relationship Between Interest Rates and Gold</SectionTitle>

      <Paragraph>
        Looking at recent GOLD charts, you can see:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">Rate Cuts</div>
          <div className="text-foreground/70">
            COVID rate cuts → <Strong>Gold price surge</Strong>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">Rate Hikes</div>
          <div className="text-foreground/70">
            Post-COVID rate hikes → <Strong>Gold price drop</Strong>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. QE and Gold */}
      <SectionTitle>Quantitative Easing (QE) and Gold</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("en")}
        alt="Quantitative Easing and Gold Price Correlation"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <BulletList items={[
        <>Post-2008 financial crisis, central banks implemented <Strong>QE</Strong> → Gold price rise</>,
        <>Post-COVID <Strong>massive QE</Strong> → Gold price rise</>,
        <>As money supply increases → <Strong>Gold price rises</Strong></>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>As global money supply increases, gold prices rise</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        If you research how much money central banks print each year,<br />
        your &apos;belief&apos; in gold price appreciation will only grow stronger.
      </Paragraph>

      <SectionDivider />

      {/* 8. Supply vs Money Supply */}
      <SectionTitle>Supply vs Money Supply: Structural Uptrend</SectionTitle>

      <Paragraph>
        Some readers might argue that gold supply also increases<br />
        every year due to mining.
      </Paragraph>

      <ComparisonBox
        leftTitle="Annual Gold Production"
        leftItems={[
          "1-2% annual increase",
          "Physical limits exist",
          "Mining costs rising",
        ]}
        rightTitle="Global Money Supply"
        rightItems={[
          "Increases by tens of times more",
          "No limits",
          "Continues to expand to resolve debt",
        ]}
        lang="en"
      />

      <WarningBox>
        Current global debt exceeds 350% of GDP.<br />
        The only way to resolve this debt is<br />
        to print money and devalue currency.
      </WarningBox>

      <Paragraph>
        Central banks will continue to print money aggressively in the future,<br />
        resulting in <Strong>Inflation ▲ → Gold Price ▲</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 9. Real Demand Structure */}
      <SectionTitle>Real Demand Supporting Gold&apos;s Floor</SectionTitle>

      <BulletList items={[
        <><Strong>Central bank gold purchases</Strong> — Global central banks buy thousands of tons annually</>,
        <><Strong>National demand</Strong> — Countries like China, India, Turkey have enormous gold demand</>,
        <><Strong>Corporate/Individual buying</Strong> — Massive buying pressure from corporations, individuals, and central banks supports gold&apos;s price floor</>,
      ]} />

      <SectionDivider />

      {/* 10. Gold in Crisis */}
      <SectionTitle>Gold in Crisis Situations</SectionTitle>

      <Paragraph>
        Even in uncertain situations like war,<br />
        due to distrust in cash, stocks, and real estate values,<br />
        <Strong>gold prices actually rise.</Strong>
      </Paragraph>

      <div className="my-8 space-y-3">
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">War</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Massive money printing</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Inflation rises</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Gold price rises</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Financial Crisis</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Massive money printing</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Inflation rises</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Gold price rises</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Debt Increase</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Massive money printing</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Currency devaluation</span>
            <span className="text-foreground/40">��</span>
            <span className="text-amber-400 font-bold">Gold price rises</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 11. Gold's Only Risk */}
      <SectionTitle>Gold&apos;s Only Risk: Interest Rate Spikes</SectionTitle>

      <Paragraph>
        So is gold invincible? Has it only trended upward for decades?<br />
        <Strong>No.</Strong>
      </Paragraph>

      <WarningBox>
        As mentioned earlier, when US interest rates rose to 20% in the 1980s,<br />
        gold prices dropped significantly.
      </WarningBox>

      <Paragraph>
        What we need to watch is <Strong>US inflation</Strong>.<br />
        If inflation gets too high and interest rates are raised aggressively,<br />
        gold prices can decline.
      </Paragraph>

      <CalloutBox type="info">
        However, in the current financial system, interest rates cannot be raised to 10%+,<br />
        so gold prices are expected to continue trending upward.
      </CalloutBox>

      <SectionDivider />

      {/* 12. BUYLOW and Gold Synergy */}
      <SectionTitle>BUYLOW Quant and Gold Synergy</SectionTitle>

      <Paragraph>
        Most users will run the BUYLOW program with GOLD,<br />
        which is why I explained gold&apos;s characteristics in detail.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Gold maximizes quant profits in sideways markets</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>Limited downside asset</Strong> — Structurally limited downside risk</>,
        <><Strong>Gradual uptrend</Strong> — Stable rise without sharp spikes or crashes</>,
        <><Strong>Technical rebounds</Strong> — Provides technical rebounds even during declines</>,
        <><Strong>Suited for rotation</Strong> — Optimal synergy with Primary Containment, BUYLOW algorithm</>,
      ]} />

      <SectionDivider />

      {/* 13. User Action Guide */}
      <SectionTitle>User Action Guide</SectionTitle>

      <Paragraph>
        Now that you understand gold&apos;s uptrend structure,<br />
        continuously check these 2 things going forward:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">US Inflation</div>
          <div className="text-foreground/50 text-sm">Monitor CPI trends</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">Interest Rate Hikes</div>
          <div className="text-foreground/50 text-sm">Monitor Fed rate policy</div>
        </div>
      </div>

      <SectionDivider />

      {/* 14. Closing - Direct Tone */}
      <QuoteBlock>
        Do you now understand that gold has limited downside<br />
        and can only trend upward structurally?
      </QuoteBlock>

      <WarningBox>
        If you don&apos;t understand what I explained above,<br />
        <Strong>use ChatGPT and study.</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">Money is not spoon-fed to anyone.</div>
          <div className="text-foreground/80">The <Strong>user</Strong> chooses the quant program settings,</div>
          <div className="text-foreground/80">the program is just an <Strong>automation tool</Strong>.</div>
          <div className="text-amber-400 font-bold mt-4">Economic study is essential.</div>
        </div>
      </div>

      <SectionDivider />

      {/* 15. Next Chapter Connection */}
      <Paragraph className="text-center text-foreground/60">
        Now that you&apos;ve studied gold&apos;s asset characteristics,<br />
        let&apos;s learn about Nasdaq / S&P 500.
      </Paragraph>
    </>
  ),
  zh: () => (
    <>
      {/* 1. 引言 - 为什么是黄金 */}
      <QuoteBlock>
        我最喜欢的资产是黄金(Gold)。<br />
        原因是它具有下行空间受限且<br />
        只能上涨的经济结构。
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>下行受限的资产是BUYLOW Quant的最佳选择</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        这不是简单地相信黄金从1971年到2026年<br />
        历史上一直表现出下行受限的走势。
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>你需要从经济和结构角度理解为什么黄金的下行空间有限且只会上涨</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 2. 核心特性 */}
      <SectionTitle>黄金的核心特性</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">安全资产</div>
          <div className="text-foreground/50 text-sm">危机时价值上升</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">通胀对冲</div>
          <div className="text-foreground/50 text-sm">防御货币贬值</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">无相关性</div>
          <div className="text-foreground/50 text-sm">与股票低相关</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. 历史背景 - 布雷顿森林体系 */}
      <SectionTitle>黄金历史：布雷顿森林体系</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("zh")} alt="黄金历史：布雷���森林体系图表" />

      <Paragraph>
        要想更好地分析未来黄金价格走势，<br />
        必须先了解黄金的历史。
      </Paragraph>

      <CalloutBox type="info">
        1944-1971年：布雷顿森林体系
      </CalloutBox>

      <Paragraph>
        二战后，黄金价格由<Strong>布雷顿森林体系</Strong>决定。
      </Paragraph>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">1盎司黄金 = 35美元</div>
          <div className="text-foreground/60">黄金和美元价值相等</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. 尼克松冲击 */}
      <SectionTitle>1971年8月15日：尼克松冲击</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="1971年尼克松冲击 - 金本位制终结" />

      <WarningBox>
        尼克松总统：{`"我们将不再用美元兑换黄金"`}
      </WarningBox>

      <Paragraph>
        结果<Strong>（美元=黄金）</Strong>的公式被打破了。<br />
        金本位制消失后，美国开始疯狂印钞。
      </Paragraph>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-lg text-foreground/70 mb-2">金本位���结束后��通胀爆发</div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971年</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980年</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% 上涨</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. 黄��也会下跌 */}
      <SectionTitle>���金并非总是上涨</SectionTitle>

      <Paragraph>
        但是黄金价格并非一直上涨。
      </Paragraph>

      <WarningBox>
        1970年代美��CPI（物价上涨率）暴涨，<br />
        美联储为控制通胀大幅加息。
      </WarningBox>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">1980年代美国利率：20%</div>
          <div className="text-foreground/60">
            银行提供20%利息，现金价值上升，<br />
            黄金、股票、房地产价格暴跌。
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. 利率与黄金 */}
      <SectionTitle>利率与黄金价格的关系</SectionTitle>

      <Paragraph>
        看看最近的黄金（GOLD）图表就知道了：
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">降息时</div>
          <div className="text-foreground/70">COVID降息 → <Strong>金价暴涨</Strong></div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">加息时</div>
          <div className="text-foreground/70">COVID后加息 → <Strong>金价下跌</Strong></div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. QE与黄金 */}
      <SectionTitle>量化宽松(QE)与黄金</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("zh")}
        alt="量化宽松与黄金价格相关性"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <BulletList items={[
        <>2008年金融危机后央行实施<Strong>QE</Strong> → 金价上涨</>,
        <>COVID后<Strong>大规模QE</Strong> → 金价上涨</>,
        <>货币供应增加 → <Strong>金价上涨</Strong></>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>全球货币供应量增加，黄金价格上涨</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        如果你亲自研究全球央行��年印多少钱，<br />
        你对金价上涨的&apos;���念&apos;只会更加坚定。
      </Paragraph>

      <SectionDivider />

      {/* 8. 供应vs货币 */}
      <SectionTitle>供应vs货币供应：结构性上涨</SectionTitle>

      <Paragraph>
        也许有些读者会想到金矿，<br />
        认为黄金每年也在增加供应量。
      </Paragraph>

      <ComparisonBox
        leftTitle="年度黄金产量"
        leftItems={[
          "年增长1-2%",
          "存在物理限制",
          "开采成本上升",
        ]}
        rightTitle="全球货币供应"
        rightItems={[
          "增长数十倍",
          "无限制",
          "持续扩张以解决债务",
        ]}
        lang="zh"
      />

      <WarningBox>
        当前全球债务超过GDP的350%。<br />
        解决债务的唯一方法是印钞并使货币贬值。
      </WarningBox>

      <Paragraph>
        未来全球央行将继续疯狂印钞，<br />
        结果就是 <Strong>通胀 ▲ → 金价 ▲</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 9. 实际需求 */}
      <SectionTitle>支撑黄金底部的实际需求</SectionTitle>

      <BulletList items={[
        <><Strong>央行购金</Strong> — 全球央行每年购买数千吨</>,
        <><Strong>国民需求</Strong> — 中国、印度、土耳其的黄金需求巨大</>,
        <><Strong>企业/个人购买</Strong> — 大量买盘支撑金价底部</>,
      ]} />

      <SectionDivider />

      {/* 10. 危机中的黄金 */}
      <SectionTitle>危机中的黄金</SectionTitle>

      <Paragraph>
        即使在战争等不确定情况下，<br />
        由于对现金、股票、房地产价值的不信任，<br />
        <Strong>金价反而会上涨。</Strong>
      </Paragraph>

      <div className="my-8 space-y-3">
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">战争</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">大量印钞</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">通胀上升</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">金价上涨</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">金融危机</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">大量印钞</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">通胀上升</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">金价上涨</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">债务增加</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">大量印钞</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">货币贬值</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">金价上涨</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 11. 唯一风险 */}
      <SectionTitle>黄金唯一风险：利率飙升</SectionTitle>

      <Paragraph>
        那么&apos;黄金(GOLD)&apos;是无敌的吗？几十年来一直只涨不跌吗？<br />
        <Strong>不是的。</Strong>
      </Paragraph>

      <WarningBox>
        如前所述，1980年代美国利率升至20%时，<br />
        金价大幅下跌。
      </WarningBox>

      <Paragraph>
        也就是说，我们要关注的是<Strong>美国的通胀</Strong>。<br />
        如果美国通胀过高导致大幅加息，<br />
        可能会导致金价下跌。
      </Paragraph>

      <CalloutBox type="info">
        但在当前金融���系下，利率无法升至10%以上，<br />
        因此金价预计将�����上涨。
      </CalloutBox>

      <SectionDivider />

      {/* 12. BUYLOW与黄金 */}
      <SectionTitle>BUYLOW Quant与黄金的协同</SectionTitle>

      <Paragraph>
        因为大多数人会用黄金(GOLD)运行BUYLOW程序��<br />
        所以我详细解释了黄金的特点。
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>黄金在横盘市场中最大化量化收益</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>下行受限资产</Strong> — 结构性限制下跌风险</>,
        <><Strong>温和上涨</Strong> — 稳定上升无剧烈波动</>,
        <><Strong>技术反弹</Strong> — 下跌时提供技术反弹</>,
        <><Strong>适合轮动</Strong> — 与一级围栏、BUYLOW算法最佳协同</>,
      ]} />

      <SectionDivider />

      {/* 13. 用户行动指南 */}
      <SectionTitle>用户行动指南</SectionTitle>

      <Paragraph>
        读者们已经了解了黄金的上涨结构特点，<br />
        今后只需持续关注以下两点：
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">美国通胀</div>
          <div className="text-foreground/50 text-sm">监控CPI趋势</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">加息情况</div>
          <div className="text-foreground/50 text-sm">监控美联储政策</div>
        </div>
      </div>

      <SectionDivider />

      {/* 14. 结语 - 直接语气 */}
      <QuoteBlock>
        现在你理解了吧？<br />
        黄金(Gold)价格下行受限，结构上只能上涨？
      </QuoteBlock>

      <WarningBox>
        如果不理解上述内容，<br />
        <Strong>请使用ChatGPT学习。</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">金钱不会白白送给任何人。</div>
          <div className="text-foreground/80">选择量化程序设置值的是<Strong>用户</Strong>，</div>
          <div className="text-foreground/80">程序只是<Strong>自动化工具</Strong>。</div>
          <div className="text-amber-400 font-bold mt-4">我认为这种经济学习是必须的。</div>
        </div>
      </div>

      <SectionDivider />

      {/* 15. 下一章连接 */}
      <Paragraph className="text-center text-foreground/60">
        好了，我们已经学习了黄金的资产特点，<br />
        现在来了解一下纳斯达克 / S&P500吧。
      </Paragraph>
    </>
  ),
  ar: () => (
    <>
      {/* 1. مقدمة - لماذا الذهب */}
      <QuoteBlock>
        أصلي المفضل هو الذهب.<br />
        السبب هو أن له هيكل اقتصادي<br />
        حيث الهبوط محدود والصعود حتمي.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>الأصول ذات الهبوط المحدود مُحسّنة لـ BUYLOW Quant</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        هذا ليس مجرد إيمان بسيط بأن الذهب أظهر<br />
        حركة محمية من الهبوط من 1971 إلى 2026 تاريخياً.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>يجب أن تفهم اقتصادياً وهيكلياً لماذا سيستمر الذهب<br />
          في امتلاك هبوط محدود واتجاه صعودي.</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 2. الخصائص الأساسية */}
      <SectionTitle>الخصائص الأساسية للذهب</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">أصل آمن</div>
          <div className="text-foreground/50 text-sm">ترتفع قيمته في الأزمات</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">تحوط التضخم</div>
          <div className="text-foreground/50 text-sm">حماية من انخفاض العملة</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">عدم الارتباط</div>
          <div className="text-foreground/50 text-sm">ارتباط منخفض بالأسهم</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. التاريخ - نظام بريتون وودز */}
      <SectionTitle>تاريخ الذهب: نظام بريتون وودز</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("ar")} alt="تاريخ الذهب: مخطط نظام بر��تون وودز" />

      <Paragraph>
        لتحليل حركات أسعار الذهب المستقبلية جيداً،<br />
        يجب فحص تاريخ الذهب.
      </Paragraph>

      <CalloutBox type="info">
        1944-1971: نظام بريتون وودز
      </CalloutBox>

      <Paragraph>
        بعد الحرب العالمية الثانية، تحددت أسعار الذهب<br />
        بهيكل يسمى <Strong>نظام بريتون وودز</Strong>.
      </Paragraph>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">أونصة ذهب = 35 دولار</div>
          <div className="text-foreground/60">قيمة الذهب والدولار كانت متساوية</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. صدمة نيكسون */}
      <SectionTitle>15 أغسطس 1971: صدمة نيكسون</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="صدمة نيكسون 1971 - نهاية معيار الذهب" />

      <WarningBox>
        الرئيس نيكسون: {`"لن نستبدل الدولارات بالذهب بعد الآن"`}
      </WarningBox>

      <Paragraph>
        نتيجة لذلك، انكسرت معادلة <Strong>(الدولار = الذهب)</Strong>.<br />
        بمجرد اختفاء معيار الذهب، بدأت أمريكا بطباعة الأموال بشكل هائل.
      </Paragraph>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-lg text-foreground/70 mb-2">بعد نهاية معيار الذهب: انفجار التضخم</div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% ارتفاع</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. الذهب لا يرتفع دائماً */}
      <SectionTitle>الذهب لا يرتفع دائماً</SectionTitle>

      <Paragraph>
        لكن أسعار الذهب لم تكن دائماً في اتجاه صعودي.
      </Paragraph>

      <WarningBox>
        في السب��ينيا��، ارتفع مؤش�� أسعار المستهل�� الأمريكي (ال��ضخم) بشكل كبير،<br />
        و��فع الا����تياطي الفيد��الي أسعار الفائد�� ��شكل ��بير للسيطرة عل�� التضخم.
      </WarningBox>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">سعر الفائدة الأمريكي 1980: 20%</div>
          <div className="text-foreground/60">
            مع تقديم البنوك فائدة 20%،<br />
            ارتفعت قيمة النقد،<br />
            وانهارت أسعار الذهب والأسهم والعقارات.
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. العلاقة مع سعر الفائدة */}
      <SectionTitle>العلاقة بين سعر الفائدة والذهب</SectionTitle>

      <Paragraph>
        بالنظر إلى رسوم ��لذهب الأخيرة، يمكنك رؤية:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">خفض الفائدة</div>
          <div className="text-foreground/70">خفض فائدة كوفيد → <Strong>ارتفاع سعر الذهب</Strong></div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">رفع الفائدة</div>
          <div className="text-foreground/70">رفع فائدة ما بعد كوفيد → <Strong>انخفاض سعر الذهب</Strong></div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. التيسير الكمي */}
      <SectionTitle>التيسير الكمي (QE) والذهب</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("ar")}
        alt="العلاقة بين التيسير الكمي وسعر الذهب"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <BulletList items={[
        <>بعد أزمة 2008، نفذت البنوك المركزية <Strong>QE</Strong> → ارتفاع سعر الذهب</>,
        <>بعد كوفيد <Strong>QE ضخم</Strong> → ارتفاع سعر الذهب</>,
        <>مع زيادة ال��عروض النقدي → <Strong>ارتفاع سع�� الذهب</Strong></>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>مع زيادة المعروض النقدي العالمي، ترتفع أسعار الذهب</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        إذا بحثت عن مقدار الأموال التي تطبعها البنوك المركزية سنوياً،<br />
        سيزداد &apos;إيمانك&apos; بارتفاع أسعار الذهب.
      </Paragraph>

      <SectionDivider />

      {/* 8. العرض مقابل المعروض النقدي */}
      <SectionTitle>العرض مقابل المعروض النقدي: صعود هيكلي</SectionTitle>

      <Paragraph>
        قد يجادل بعض القراء بأن عرض الذهب<br />
        يزداد أيضاً كل عام بسبب التعدين.
      </Paragraph>

      <ComparisonBox
        leftTitle="إنتاج الذهب السنوي"
        leftItems={[
          "زيادة 1-2% سنوياً",
          "حدود فيزيائية موجودة",
          "تكاليف التعدين ترتفع",
        ]}
        rightTitle="المعروض النقدي العالمي"
        rightItems={[
          "يزيد بعشرات المرات",
          "لا حدود",
          "يستمر في التوسع لحل الديون",
        ]}
        lang="ar"
      />

      <WarningBox>
        الدين العالمي الحالي يتجاوز 350% من الناتج المحلي.<br />
        الطريقة الوحيدة لحل هذا الدين هي<br />
        طباعة المال وتخفيض قيمة العملة.
      </WarningBox>

      <Paragraph>
        ستستمر البنوك المركزية في طباعة الأموال بقوة في المستقبل،<br />
        مما يؤدي إلى <Strong>التضخم ▲ → سعر الذهب ▲</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 9. الطلب الحقيقي */}
      <SectionTitle>الطلب الحقيقي الداعم لأرضية الذهب</SectionTitle>

      <BulletList items={[
        <><Strong>مشتريات البنوك المركزية</Strong> — البنوك المركزية العالمية تشتري آلاف الأطنان سنوياً</>,
        <><Strong>الطلب الوطني</Strong> — دول مثل الصين والهند وتركيا لديها طلب هائل على الذ��ب</>,
        <><Strong>مشتريات الشركات/الأفراد</Strong> — ضغط شراء هائل يدعم أرضية سعر الذهب</>,
      ]} />

      <SectionDivider />

      {/* 10. الذهب في الأزمات */}
      <SectionTitle>الذهب في حالات الأزمات</SectionTitle>

      <Paragraph>
        حتى في الحالات غير المؤكدة مثل الحرب،<br />
        بسبب عدم الثقة في قيم النقد والأسهم والعقارات،<br />
        <Strong>ترتفع أسعار الذهب فعلياً.</Strong>
      </Paragraph>

      <div className="my-8 space-y-3">
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">الحرب</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">طباعة أموال ضخمة</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">ارتفاع التضخم</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">ارتفاع سعر الذهب</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">الأزمة المالية</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">طباعة أموال ضخمة</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">ارتفاع التضخم</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">ارتفاع سعر الذهب</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">زيادة الديون</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">طباعة أموال ضخمة</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">انخفاض قيمة العملة</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">ارتفاع سعر الذهب</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 11. الخطر الوحيد */}
      <SectionTitle>الخطر الوحيد للذهب: ارتفاع أسعار الفائدة</SectionTitle>

      <Paragraph>
        هل الذهب لا يُقهر إذن؟ هل اتجه ف��ط صعوداً لعقود؟<br />
        <Strong>لا.</Strong>
      </Paragraph>

      <WarningBox>
        كما ذكرنا سابقاً، ع��دما ارتفعت ��سعار الفائدة الأمريكية إلى 20% في الثمانينيات،<br />
        انخفضت أسعار الذهب بشكل ��بير.
      </WarningBox>

      <Paragraph>
        ما نحتاج لمراقبته هو <Strong>التضخم الأمريكي</Strong>.<br />
        إذا ارتفع التضخم بشكل مفرط ورُفعت أسعار الفائدة بقوة،<br />
        يمكن أن تنخفض أسعار الذهب.
      </Paragraph>

      <CalloutBox type="info">
        لكن في النظام المالي الحالي، لا يمكن رفع أسعار الفائدة فوق 10%،<br />
        لذا يُتوقع أن تستمر أسعار الذهب في الاتجاه الصعودي.
      </CalloutBox>

      <SectionDivider />

      {/* 12. BUYLOW والذهب */}
      <SectionTitle>تناغم BUYLOW Quant مع الذهب</SectionTitle>

      <Paragraph>
        سيشغل معظم المستخدمين برنامج BUYLOW بالذهب،<br />
        ولهذا شرحت خصائص الذهب بالتفصيل.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>الذهب يُعظّم أرباح الكوانت في الأسواق الجانبية</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>أصل محدود الهبوط</Strong> — مخاطر هبوط محدودة هيكلياً</>,
        <><Strong>صعود تدريجي</Strong> — ارتفاع مستقر بدون ارتفاعات أو انهيارات حادة</>,
        <><Strong>ارتدادات تقنية</Strong> — يوفر ارتدادات تقنية حتى أثناء الانخفاضات</>,
        <><Strong>مناسب للتدوير</Strong> — تناغم مثالي مع الاحتواء الأولي، خوارزمية BUYLOW</>,
      ]} />

      <SectionDivider />

      {/* 13. دليل إجراءات المستخدم */}
      <SectionTitle>دليل إجراءات المستخدم</SectionTitle>

      <Paragraph>
        الآن بعد أن فهمت هيكل الاتجاه الصعودي للذهب،<br />
        راقب هذين الأمرين باستمرار:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">التضخم الأمريكي</div>
          <div className="text-foreground/50 text-sm">راقب اتجاهات CPI</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">رفع أسعار الفائدة</div>
          <div className="text-foreground/50 text-sm">راقب سياسة الاحتياطي الفيدرالي</div>
        </div>
      </div>

      <SectionDivider />

      {/* 14. الخاتمة - نبرة مباشرة */}
      <QuoteBlock>
        هل تفهم الآن أن الذهب له هبوط محدود<br />
        ويمكنه فقط الاتجاه صعوداً هيكلياً؟
      </QuoteBlock>

      <WarningBox>
        إذا لم تفهم ما شرحته أعلاه،<br />
        <Strong>استخدم ChatGPT وادرس.</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">المال لا يُقدم لأحد على طبق.</div>
          <div className="text-foreground/80"><Strong>المستخدم</Strong> يختار إعدادات برنامج الكوانت،</div>
          <div className="text-foreground/80">البرنامج مجرد <Strong>أداة أتمتة</Strong>.</div>
          <div className="text-amber-400 font-bold mt-4">أعتقد أن دراسة الاقتصاد ضرورية.</div>
        </div>
      </div>

      <SectionDivider />

      {/* 15. الربط بالفصل التالي */}
      <Paragraph className="text-center text-foreground/60">
        حسناً، لقد درسنا خصائص أصل الذهب،<br />
        الآن دعنا نتعرف على ناسداك / S&P 500.
      </Paragraph>
    </>
  ),
  ru: () => (
    <>
      {/* 1. Введение - Почему золото */}
      <QuoteBlock>
        Мой любимый актив — золото.<br />
        Причина в том, что оно имеет экономическу�� структуру<br />
        с ограниченным падением и неизбежным ростом.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Активы с ограниченным падением оптимиз��рованы для BUYLOW Quant</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Это не просто вера в то, что золото исторически показывало<br />
        защищённое от падения движение с 1971 по 2026 год.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>Вам нужно экономически и структурно понять, почему золото<br />
          будет продолжать иметь ограниченное падение и расти.</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 2. Основные характеристики */}
      <SectionTitle>Ключевые характеристики золота</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Безопасный актив</div>
          <div className="text-foreground/50 text-sm">Рост в кризис</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Хедж инфляции</div>
          <div className="text-foreground/50 text-sm">Защита от девальвации</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Некорр����лированность</div>
          <div className="text-foreground/50 text-sm">Низкая корреляция с акциями</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. История - Бреттон-Вудская система */}
      <SectionTitle>История золота: Бреттон-Вудская система</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("ru")} alt="История золота: График Бреттон-Вудской системы" />

      <Paragraph>
        Чтобы хорошо анализировать будущие движения цен на ����лото,<br />
        н��жно изучить историю ��олота.
      </Paragraph>

      <CalloutBox type="info">
        1944-1971: Бреттон-Вудская сист��ма
      </CalloutBox>

      <Paragraph>
        После Второй мировой войны це��ы на золото определялись<br />
        структурой под названием <Strong>Бреттон-Вудская система</Strong>.
      </Paragraph>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">1 унция золота = $35</div>
          <div className="text-foreground/60">Стоимость золота и доллара были равны</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. Шок Никсона */}
      <SectionTitle>15 августа 1971: Шок Никсона</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="Шок Никсона 1971 - Кон��ц золотого стандарта" />

      <WarningBox>
        Президе��т Никсон: {`"Мы больше не будем обменивать доллары на золото"`}
      </WarningBox>

      <Paragraph>
        В результате формула <Strong>(Дол��ар = Золото)</Strong> была нарушена.<br />
        Когда золотой стандарт исчез, США начали печатать деньги в огромных количествах.
      </Paragraph>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-lg text-foreground/70 mb-2">После отмены золотого стандарта: Взрыв инфляции</div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% рост</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. Золото не всег��а растёт */}
      <SectionTitle>Золото не всегда растёт</SectionTitle>

      <Paragraph>
        Однако цены на золото не всегда росли.
      </Paragraph>

      <WarningBox>
        В 1970-х годах CPI США (уровень инфляции) резко вырос,<br />
        и ФРС резко повысила процентные ставки для контроля инфляции.
      </WarningBox>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">Ставка США 1980: 20%</div>
          <div className="text-foreground/60">
            При банковской ставке 20%<br />
            стоимость наличных выросла,<br />
            и цены на золото, акции и недвижимость упали.
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. Связь со ставками */}
      <SectionTitle>Связь процентных ставок и золота</SectionTitle>

      <Paragraph>
        Глядя на недавние графики золота, можно увидеть:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">Снижение ставок</div>
          <div className="text-foreground/70">Снижение ставок во время COVID → <Strong>Рост цен на золото</Strong></div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">Повышение ставок</div>
          <div className="text-foreground/70">Повышение ставок после COVID → <Strong>Падение цен на золото</Strong></div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. QE и золото */}
      <SectionTitle>Количественное смягчение (QE) и золото</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("ru")}
        alt="Корреляция количественного смягчения и цен на золото"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <BulletList items={[
        <>После финансового кризиса 2008 года центробанки провели <Strong>QE</Strong> → Рост цен на золото</>,
        <>После COVID <Strong>масштабное QE</Strong> → Рост цен на золото</>,
        <>По мере роста денежной массы → <Strong>Цены на золото растут</Strong></>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>По мере роста мировой денежной массы цены на золото растут</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Если вы исследуете, сколько денег центробанки печатают каждый год,<br />
        ваша &apos;вера&apos; в рост цен на золото только укрепится.
      </Paragraph>

      <SectionDivider />

      {/* 8. Предложение vs денежная масса */}
      <SectionTitle>Предложение vs денежная масса: Структурный рост</SectionTitle>

      <Paragraph>
        Некоторые читатели могут возразить, что предложение золота<br />
        также увеличивается каждый год из-за добычи.
      </Paragraph>

      <ComparisonBox
        leftTitle="Годовая добыча золота"
        leftItems={[
          "Рост 1-2% в год",
          "Существуют физические пределы",
          "Затраты на добычу растут",
        ]}
        rightTitle="Мировая денежная масса"
        rightItems={[
          "Увеличивается в десятки раз",
          "Без ограничений",
          "Продолжает расширяться для погаш��ния долгов",
        ]}
        lang="ru"
      />

      <WarningBox>
        Текущий мировой долг превышает 350% ВВП.<br />
        Единственный способ решить эту проблему —<br />
        печатать деньги и обесценивать валюту.
      </WarningBox>

      <Paragraph>
        Центробанки будут продолжать агрессивно печатать деньги в будущем,<br />
        что приведёт к <Strong>Инфляция ▲ → Цена золота ▲</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 9. Реальный спрос */}
      <SectionTitle>Реальный спрос, поддерживающий пол золота</SectionTitle>

      <BulletList items={[
        <><Strong>Заку��ки центробанков</Strong> — Мировые центробанки покупаю�� тысячи тонн ежегодно</>,
        <><Strong>Национальный спрос</Strong> — Страны как Китай, Индия, Турция имеют огромный ��прос на золото</>,
        <><Strong>Корпоративные/частные покупки</Strong> — Огромное покупательное давление поддерживает ценовой пол золота</>,
      ]} />

      <SectionDivider />

      {/* 10. Золото в кризис */}
      <SectionTitle>Золото в кризисных ситуациях</SectionTitle>

      <Paragraph>
        Даже в неопределённых ситуациях, как война,<br />
        из-за недоверия к наличным, акциям и недвижимости,<br />
        <Strong>цены на золото фактически растут.</Strong>
      </Paragraph>

      <div className="my-8 space-y-3">
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Война</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Массовая печать денег</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Рост инфляции</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Рост цен на золото</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Финансовый кризис</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Массовая печать денег</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Рост инфляции</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Рост цен на золото</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Рост долга</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Массовая печать денег</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Девальвация валюты</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Рост цен на золото</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 11. Единственный риск */}
      <SectionTitle>Единственный риск золота: Резкий рост ставок</SectionTitle>

      <Paragraph>
        Так золото неуязвимо? Оно только росло десятилетиями?<br />
        <Strong>Нет.</Strong>
      </Paragraph>

      <WarningBox>
        Как упоминалось ранее, когда ставки США выросли до 20% в 1980-х,<br />
        цены на золото значительно упали.
      </WarningBox>

      <Paragraph>
        То, за чем нам нужно следить — это <Strong>инфляция в США</Strong>.<br />
        Если инфляция станет слишком высокой и ставки будут агрессивно повышены,<br />
        цены на золото могут упасть.
      </Paragraph>

      <CalloutBox type="info">
        Однако в текущей финансовой системе ставки не могут вырасти выше 10%,<br />
        поэтому ожидается, что цены на золото продолжат р��сти.
      </CalloutBox>

      <SectionDivider />

      {/* 12. BUYLOW и золото */}
      <SectionTitle>Синергия BUYLOW Quant и золота</SectionTitle>

      <Paragraph>
        Большинство пользователей будут запускать программу BUYLOW с золотом,<br />
        поэтому я подробно объяснил характеристики золота.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Золото максимизирует квант-доходность при боковике</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>Актив с ��граниченным падением</Strong> — Структурно ограниченный риск падения</>,
        <><Strong>Плавный рост</Strong> — Стабильный рост без резких скачков</>,
        <><Strong>Технические отскоки</Strong> — Обеспечивает технические отскоки даже при падениях</>,
        <><Strong>Подходит для ротации</Strong> — Оптимальная синергия с первичным удержанием, алгоритмом BUYLOW</>,
      ]} />

      <SectionDivider />

      {/* 13. Руководство к действию */}
      <SectionTitle>Руководство к действию</SectionTitle>

      <Paragraph>
        Теперь, когда вы понимаете структуру восходящего тренда золота,<br />
        постоянно отслеживайте эти 2 вещи:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">Инфляция США</div>
          <div className="text-foreground/50 text-sm">Отслеживайте тренды CPI</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">Повышение ставок</div>
          <div className="text-foreground/50 text-sm">Отслежив����те политику ФРС</div>
        </div>
      </div>

      <SectionDivider />

      {/* 14. Зак��ючение - Прямой тон */}
      <QuoteBlock>
        Теперь вы понимаете, что золото имеет ограниченное падение<br />
        и может только расти структурно?
      </QuoteBlock>

      <WarningBox>
        Если вы не понимаете то, что я объяснил выше,<br />
        <Strong>используйте ChatGPT и учитесь.</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">Деньги не падают �� неба.</div>
          <div className="text-foreground/80"><Strong>Пользователь</Strong> выбирае�� настройки квант-програ��мы,</div>
          <div className="text-foreground/80">программа — лишь <Strong>инструмент автоматизации</Strong>.</div>
          <div className="text-amber-400 font-bold mt-4">Я считаю, что изучение экономики необходимо.</div>
        </div>
      </div>

      <SectionDivider />

      {/* 15. Связь со следующей главой */}
      <Paragraph className="text-center text-foreground/60">
        Хорошо, мы изучили характеристики актива золота,<br />
        теперь давайте узнаем о NASDAQ / S&P 500.
      </Paragraph>
    </>
  ),
  es: () => (
    <>
      {/* 1. Introducción - Por qué el oro */}
      <QuoteBlock>
        Mi activo preferido es el oro.<br />
        La razón es que tiene una estructura econ��mica<br />
        donde la caída es limitada y solo puede subir.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Los activos con caída limitada están optimizados para BUYLOW Quant</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Esto no es simplemente creer que el oro ha mostrado<br />
        un movimiento protegido de caídas desde 1971 hasta 2026 históricamente.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>Necesitas entender económica y estructuralmente por qué el oro<br />
          continuará teniendo una caída limitada y tendencia alcista.</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 2. Características principales */}
      <SectionTitle>Características clave del oro</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Activo seguro</div>
          <div className="text-foreground/50 text-sm">Sube en crisis</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Cobertura inflación</div>
          <div className="text-foreground/50 text-sm">Protege contra devaluación</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">No correlacionado</div>
          <div className="text-foreground/50 text-sm">Baja correlación con acciones</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. Historia - Sistema Bretton Woods */}
      <SectionTitle>Historia del oro: Sistema Bretton Woods</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("es")} alt="Historia del oro: Gráfico del Sistema Bretton Woods" />

      <Paragraph>
        Para analizar bien los movimientos futuros del precio del oro,<br />
        debemos examinar la historia del oro.
      </Paragraph>

      <CalloutBox type="info">
        1944-1971: Sistema Bretton Woods
      </CalloutBox>

      <Paragraph>
        Después de la Segunda Guerra Mundial, los precios del oro se determinaron<br />
        por una estructura llamada <Strong>Sistema Bretton Woods</Strong>.
      </Paragraph>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">1 onza de oro = $35</div>
          <div className="text-foreground/60">El valor del oro y el dólar eran equivalentes</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. Nixon Shock */}
      <SectionTitle>15 de agosto de 1971: Nixon Shock</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="Nixon Shock 1971 - Fin del patrón oro" />

      <WarningBox>
        Presidente Nixon: {`"Ya no intercambiaremos dólares por oro"`}
      </WarningBox>

      <Paragraph>
        Como resultado, la fórmula <Strong>(Dólar = Oro)</Strong> se rompió.<br />
        Una vez que desapareció el patrón oro, EE.UU. comenzó a imprimir dinero a un ritmo enorme.
      </Paragraph>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-lg text-foreground/70 mb-2">Después del patrón oro: Explosión de inflación</div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% aumento</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. El oro no siempre sube */}
      <SectionTitle>El oro no siempre sube</SectionTitle>

      <Paragraph>
        Sin embargo, los precios del oro no siempre tuvieron tendencia alcista.
      </Paragraph>

      <WarningBox>
        En los años 70, el IPC de EE.UU. (tasa de inflación) se disparó,<br />
        y la Reserva Federal aumentó las tasas de interés drásticamente para controlar la inflación.
      </WarningBox>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">Tasa de EE.UU. 1980: 20%</div>
          <div className="text-foreground/60">
            Con los bancos ofreciendo 20% de interés,<br />
            el valor del efectivo aumentó,<br />
            y como resultado, el oro, las acciones y los inmuebles colapsaron.
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. Relación con tasas */}
      <SectionTitle>Relación entre tasas de interés y oro</SectionTitle>

      <Paragraph>
        Mirando los gráficos recientes del ORO, puedes ver:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">Recorte de tasas</div>
          <div className="text-foreground/70">Recortes COVID → <Strong>Precio del oro sube</Strong></div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">Aumento de tasas</div>
          <div className="text-foreground/70">Aumentos post-COVID → <Strong>Precio del oro baja</Strong></div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. QE y oro */}
      <SectionTitle>Flexibilización cuantitativa (QE) y oro</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("es")}
        alt="Correlacion entre flexibilizacion cuantitativa y precio del oro"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <BulletList items={[
        <>Después de la crisis de 2008, los bancos centrales implementaron <Strong>QE</Strong> → Subida del precio del oro</>,
        <>Después de COVID <Strong>QE masivo</Strong> → Subida del precio del oro</>,
        <>A medida que aumenta la oferta monetaria → <Strong>El precio del oro sube</Strong></>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>A medida que aumenta la oferta monetaria global, los precios del oro suben</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Si investigas cuánto dinero imprimen los bancos centrales cada año,<br />
        tu &apos;fe&apos; en la apreciación del precio del oro solo se fortalecerá.
      </Paragraph>

      <SectionDivider />

      {/* 8. Oferta vs Masa monetaria */}
      <SectionTitle>Oferta vs Masa monetaria: Tendencia estructural alcista</SectionTitle>

      <Paragraph>
        Algunos lectores podrían argumentar que la oferta de oro<br />
        también aumenta cada año debido a la minería.
      </Paragraph>

      <ComparisonBox
        leftTitle="Producción anual de oro"
        leftItems={[
          "Aumento anual del 1-2%",
          "Existen límites físicos",
          "Costos de miner��a en aumento",
        ]}
        rightTitle="Oferta monetaria global"
        rightItems={[
          "Aumenta decenas de veces más",
          "Sin límites",
          "Continúa expandiéndose para resolver deudas",
        ]}
        lang="es"
      />

      <WarningBox>
        La deuda global actual supera el 350% del PIB.<br />
        La única forma de resolver esta deuda es<br />
        imprimir dinero y devaluar la moneda.
      </WarningBox>

      <Paragraph>
        Los bancos centrales continuarán imprimiendo dinero agresivamente en el futuro,<br />
        resultando en <Strong>Inflación ▲ → Precio del Oro ▲</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 9. Demanda real */}
      <SectionTitle>Demanda real que respalda el piso del oro</SectionTitle>

      <BulletList items={[
        <><Strong>Compras de bancos centrales</Strong> — Los bancos centrales globales compran miles de toneladas anualmente</>,
        <><Strong>Demanda nacional</Strong> — Países como China, India, Turquía tienen enorme demanda de oro</>,
        <><Strong>Compras corporativas/individuales</Strong> ��� Enorme presión compradora que soporta el piso del precio del oro</>,
      ]} />

      <SectionDivider />

      {/* 10. El oro en crisis */}
      <SectionTitle>El oro en situaciones de crisis</SectionTitle>

      <Paragraph>
        Incluso en situaciones inciertas como la guerra,<br />
        debido a la desconfianza en el efectivo, las acciones y los valores inmobiliarios,<br />
        <Strong>los precios del oro realmente suben.</Strong>
      </Paragraph>

      <div className="my-8 space-y-3">
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Guerra</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Impresión masiva de dinero</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Sube la inflación</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Sube el precio del oro</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Crisis financiera</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Impresión masiva de dinero</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Sube la inflación</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Sube el precio del oro</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Aumento de deuda</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Impresión masiva de dinero</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Devaluación de moneda</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Sube el precio del oro</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 11. Único riesgo */}
      <SectionTitle>Único riesgo del oro: Subidas de tasas</SectionTitle>

      <Paragraph>
        ¿Entonces el oro es invencible? ¿Solo ha subido durante décadas?<br />
        <Strong>No.</Strong>
      </Paragraph>

      <WarningBox>
        Como se mencionó antes, cuando las tasas de EE.UU. subieron al 20% en los años 80,<br />
        los precios del oro cayeron significativamente.
      </WarningBox>

      <Paragraph>
        Lo que necesitamos vigilar es <Strong>la inflación de EE.UU.</Strong><br />
        Si la inflación sube demasiado y las tasas se aumentan agresivamente,<br />
        los precios del oro pueden bajar.
      </Paragraph>

      <CalloutBox type="info">
        Sin embargo, en el sistema financiero actual, las tasas no pueden subir más del 10%,<br />
        por lo que se espera que los precios del oro continúen su tendencia alcista.
      </CalloutBox>

      <SectionDivider />

      {/* 12. BUYLOW y oro */}
      <SectionTitle>Sinergia entre BUYLOW Quant y oro</SectionTitle>

      <Paragraph>
        La mayoría de los usuarios ejecutarán el programa BUYLOW con ORO,<br />
        por eso expliqué las características del oro en detalle.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>El oro maximiza ganancias quant en mercados laterales</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>Activo de caída limitada</Strong> — Riesgo de caída estructuralmente limitado</>,
        <><Strong>Subida gradual</Strong> — Subida estable sin picos o caídas bruscas</>,
        <><Strong>Rebotes técnicos</Strong> — Proporciona rebotes técnicos incluso durante caídas</>,
        <><Strong>Adecuado para rotación</Strong> — Sinergia óptima con Contención Primaria, algoritmo BUYLOW</>,
      ]} />

      <SectionDivider />

      {/* 13. Guía de acción del usuario */}
      <SectionTitle>Guía de acción del usuario</SectionTitle>

      <Paragraph>
        Ahora que entiendes la estructura de tendencia alcista del oro,<br />
        monitorea continuamente estas 2 cosas:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">Inflación de EE.UU.</div>
          <div className="text-foreground/50 text-sm">Monitorear tendencias del IPC</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">Subidas de tasas</div>
          <div className="text-foreground/50 text-sm">Monitorear política de la Fed</div>
        </div>
      </div>

      <SectionDivider />

      {/* 14. Conclusión - Tono directo */}
      <QuoteBlock>
        ¿Ahora entiendes que el oro tiene caída limitada<br />
        y solo puede tener tendencia alcista estructuralmente?
      </QuoteBlock>

      <WarningBox>
        Si no entiendes lo que expliqué arriba,<br />
        <Strong>usa ChatGPT y estudia.</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">El dinero no se regala a nadie.</div>
          <div className="text-foreground/80">El <Strong>usuario</Strong> elige la configuración del programa quant,</div>
          <div className="text-foreground/80">el programa es solo una <Strong>herramienta de automatización</Strong>.</div>
          <div className="text-amber-400 font-bold mt-4">Creo que estudiar economía es esencial.</div>
        </div>
      </div>

      <SectionDivider />

      {/* 15. Enlace al siguiente capítulo */}
      <Paragraph className="text-center text-foreground/60">
        Bien, hemos estudiado las características del activo oro,<br />
        ahora conozcamos NASDAQ / S&P 500.
      </Paragraph>
    </>
  ),
  id: () => (
    <>
      {/* 1. Pendahuluan - Mengapa Emas */}
      <QuoteBlock>
        Aset favorit saya adalah emas.<br />
        Alasannya adalah memiliki struktur ekonomi<br />
        di mana penurunan terbatas dan hanya bisa naik.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Aset dengan penurunan terbatas dioptimalkan untuk BUYLOW Quant</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Ini bukan sekadar percaya bahwa emas telah menunjukkan<br />
        pergerakan terlindungi dari penurunan dari 1971 hingga 2026 secara historis.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>Anda perlu memahami secara ekonomi dan struktural mengapa emas<br />
          akan terus memiliki penurunan terbatas dan tren naik.</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 2. Karakteristik utama */}
      <SectionTitle>Karakteristik Utama Emas</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Aset Aman</div>
          <div className="text-foreground/50 text-sm">Naik saat krisis</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Lindung Inflasi</div>
          <div className="text-foreground/50 text-sm">Perlindungan devaluasi</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Tidak Berkorelasi</div>
          <div className="text-foreground/50 text-sm">Korelasi rendah dengan saham</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. Sejarah - Sistem Bretton Woods */}
      <SectionTitle>Sejarah Emas: Sistem Bretton Woods</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("id")} alt="Sejarah Emas: Grafik Sistem Bretton Woods" />

      <Paragraph>
        Untuk menganalisis pergerakan harga emas di masa depan dengan baik,<br />
        kita harus memeriksa sejarah emas.
      </Paragraph>

      <CalloutBox type="info">
        1944-1971: Sistem Bretton Woods
      </CalloutBox>

      <Paragraph>
        Setelah Perang Dunia II, harga emas ditentukan oleh<br />
        struktur yang disebut <Strong>Sistem Bretton Woods</Strong>.
      </Paragraph>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">1 ons Emas = $35</div>
          <div className="text-foreground/60">Nilai emas dan dolar setara</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. Nixon Shock */}
      <SectionTitle>15 Agustus 1971: Nixon Shock</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="Nixon Shock 1971 - Akhir Standar Emas" />

      <WarningBox>
        Presiden Nixon: {`"Kami tidak akan lagi menukar dolar dengan emas"`}
      </WarningBox>

      <Paragraph>
        Akibatnya, rumus <Strong>(Dolar = Emas)</Strong> rusak.<br />
        Setelah standar emas menghilang, AS mulai mencetak uang dalam jumlah besar.
      </Paragraph>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-lg text-foreground/70 mb-2">Setelah Standar Emas: Ledakan Inflasi</div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% kenaikan</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. Emas tidak selalu naik */}
      <SectionTitle>Emas Tidak Selalu Naik</SectionTitle>

      <Paragraph>
        Namun, harga emas tidak selalu dalam tren naik.
      </Paragraph>

      <WarningBox>
        Pada tahun 1970-an, CPI AS (tingkat inflasi) melonjak,<br />
        dan Federal Reserve menaikkan suku bunga secara dramatis untuk mengendalikan inflasi.
      </WarningBox>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">Suku Bunga AS 1980: 20%</div>
          <div className="text-foreground/60">
            Dengan bank menawarkan bunga 20%,<br />
            nilai uang tunai meningkat,<br />
            dan akibatnya emas, saham, dan properti anjlok.
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. Hubungan dengan suku bunga */}
      <SectionTitle>Hubungan Suku Bunga dan Emas</SectionTitle>

      <Paragraph>
        Melihat grafik EMAS terbaru, Anda dapat melihat:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">Pemotongan Suku Bunga</div>
          <div className="text-foreground/70">Pemotongan COVID → <Strong>Harga emas naik</Strong></div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">Kenaikan Suku Bunga</div>
          <div className="text-foreground/70">Kenaikan pasca-COVID → <Strong>Harga emas turun</Strong></div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. QE dan emas */}
      <SectionTitle>Quantitative Easing (QE) dan Emas</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("id")}
        alt="Korelasi Quantitative Easing dan Harga Emas"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <BulletList items={[
        <>Setelah krisis keuangan 2008, bank sentral menerapkan <Strong>QE</Strong> → Kenaikan harga emas</>,
        <>Setelah COVID <Strong>QE besar-besaran</Strong> → Kenaikan harga emas</>,
        <>Saat pasokan uang meningkat → <Strong>Harga emas naik</Strong></>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>Saat pasokan uang global meningkat, harga emas naik</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Jika Anda meneliti berapa banyak uang yang dicetak bank sentral setiap tahun,<br />
        &apos;keyakinan&apos; Anda pada apresiasi harga emas hanya akan semakin kuat.
      </Paragraph>

      <SectionDivider />

      {/* 8. Pasokan vs Jumlah Uang Beredar */}
      <SectionTitle>Pasokan vs Jumlah Uang Beredar: Tren Naik Struktural</SectionTitle>

      <Paragraph>
        Beberapa pembaca mungkin berpendapat bahwa pasokan emas<br />
        juga meningkat setiap tahun karena penambangan.
      </Paragraph>

      <ComparisonBox
        leftTitle="Produksi Emas Tahunan"
        leftItems={[
          "Peningkatan 1-2% per tahun",
          "Ada batasan fisik",
          "Biaya penambangan meningkat",
        ]}
        rightTitle="Pasokan Uang Global"
        rightItems={[
          "Meningkat puluhan kali lipat",
          "Tanpa batasan",
          "Terus berkembang untuk menyelesaikan utang",
        ]}
        lang="id"
      />

      <WarningBox>
        Utang global saat ini melebihi 350% PDB.<br />
        Satu-satunya cara untuk menyelesaikan utang ini adalah<br />
        mencetak uang dan mendevaluasi mata uang.
      </WarningBox>

      <Paragraph>
        Bank sentral akan terus mencetak uang secara agresif di masa depan,<br />
        menghasilkan <Strong>Inflasi ▲ → Harga Emas ▲</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 9. Permintaan riil */}
      <SectionTitle>Permintaan Riil yang Mendukung Lantai Emas</SectionTitle>

      <BulletList items={[
        <><Strong>Pembelian bank sentral</Strong> — Bank sentral global membeli ribuan ton setiap tahun</>,
        <><Strong>Permintaan nasional</Strong> — Negara seperti China, India, Turki memiliki permintaan emas yang sangat besar</>,
        <><Strong>Pembelian korporat/individu</Strong> — Tekanan beli yang sangat besar mendukung lantai harga emas</>,
      ]} />

      <SectionDivider />

      {/* 10. Emas dalam Krisis */}
      <SectionTitle>Emas dalam Situasi Krisis</SectionTitle>

      <Paragraph>
        Bahkan dalam situasi tidak pasti seperti perang,<br />
        karena ketidakpercayaan pada nilai uang tunai, saham, dan properti,<br />
        <Strong>harga emas justru naik.</Strong>
      </Paragraph>

      <div className="my-8 space-y-3">
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Perang</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Pencetakan uang masif</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Inflasi naik</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Harga emas naik</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Krisis Keuangan</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Pencetakan uang masif</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Inflasi naik</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Harga emas naik</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-bold">Peningkatan Utang</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Pencetakan uang masif</span>
            <span className="text-foreground/40">→</span>
            <span className="text-foreground/60">Devaluasi mata uang</span>
            <span className="text-foreground/40">→</span>
            <span className="text-amber-400 font-bold">Harga emas naik</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 11. Satu-satunya risiko */}
      <SectionTitle>Satu-satunya Risiko Emas: Lonjakan Suku Bunga</SectionTitle>

      <Paragraph>
        Jadi apakah emas tak terkalahkan? Apakah hanya naik selama puluhan tahun?<br />
        <Strong>Tidak.</Strong>
      </Paragraph>

      <WarningBox>
        Seperti disebutkan sebelumnya, ketika suku bunga AS naik ke 20% di tahun 1980-an,<br />
        harga emas turun secara signifikan.
      </WarningBox>

      <Paragraph>
        Yang perlu kita perhatikan adalah <Strong>inflasi AS</Strong>.<br />
        Jika inflasi terlalu tinggi dan suku bunga dinaikkan secara agresif,<br />
        harga emas bisa turun.
      </Paragraph>

      <CalloutBox type="info">
        Namun, dalam sistem keuangan saat ini, suku bunga tidak bisa naik di atas 10%,<br />
        sehingga harga emas diperkirakan akan terus tren naik.
      </CalloutBox>

      <SectionDivider />

      {/* 12. BUYLOW dan emas */}
      <SectionTitle>Sinergi BUYLOW Quant dan Emas</SectionTitle>

      <Paragraph>
        Sebagian besar pengguna akan menjalankan program BUYLOW dengan EMAS,<br />
        itulah mengapa saya menjelaskan karakteristik emas secara detail.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Emas memaksimalkan profit quant di pasar sideways</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>Aset penurunan terbatas</Strong> — Risiko penurunan terbatas secara struktural</>,
        <><Strong>Kenaikan bertahap</Strong> — Kenaikan stabil tanpa lonjakan atau kejatuhan tajam</>,
        <><Strong>Rebound teknikal</Strong> — Memberikan rebound teknikal bahkan selama penurunan</>,
        <><Strong>Cocok untuk rotasi</Strong> — Sinergi optimal dengan Containment Primer, algoritma BUYLOW</>,
      ]} />

      <SectionDivider />

      {/* 13. Panduan Tindakan Pengguna */}
      <SectionTitle>Panduan Tindakan Pengguna</SectionTitle>

      <Paragraph>
        Sekarang setelah Anda memahami struktur tren naik emas,<br />
        pantau terus 2 hal ini:
      </Paragraph>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">Inflasi AS</div>
          <div className="text-foreground/50 text-sm">Pantau tren CPI</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">Kenaikan Suku Bunga</div>
          <div className="text-foreground/50 text-sm">Pantau kebijakan Fed</div>
        </div>
      </div>

      <SectionDivider />

      {/* 14. Kesimpulan - Nada Langsung */}
      <QuoteBlock>
        Apakah sekarang Anda memahami bahwa emas memiliki penurunan terbatas<br />
        dan hanya bisa tren naik secara struktural?
      </QuoteBlock>

      <WarningBox>
        Jika Anda tidak memahami apa yang saya jelaskan di atas,<br />
        <Strong>gunakan ChatGPT dan pelajari.</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">Uang tidak diberikan cuma-cuma kepada siapa pun.</div>
          <div className="text-foreground/80"><Strong>Pengguna</Strong> yang memilih pengaturan program quant,</div>
          <div className="text-foreground/80">program hanyalah <Strong>alat otomatisasi</Strong>.</div>
          <div className="text-amber-400 font-bold mt-4">Saya pikir mempelajari ekonomi itu wajib.</div>
        </div>
      </div>

      <SectionDivider />

      {/* 15. Koneksi ke Bab Berikutnya */}
      <Paragraph className="text-center text-foreground/60">
        Baik, kita telah mempelajari karakteristik aset emas,<br />
        sekarang mari kita pelajari tentang NASDAQ / S&P 500.
      </Paragraph>
    </>
  ),
  th: () => (
    <>
      {/* 1. บทนำ - ทำไมต้องทองคำ */}
      <QuoteBlock>
        สินทรั��ย์ที่ฉั��ชอบที่สุดคือทองคำ<br />
        เหตุผลคือมันมีโครงสร้างทางเศรษฐกิจ<br />
        ที่ขาลงจำกัดและสามารถขึ้นได้เท่านั้น
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>สินทรัพย์ที่มีขาลงจำกัดเหมาะสำหรับ BUYLOW Quant</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        นี่ไม่ใช่แค่เชื่อง่ายๆ ว่าทองคำแสดงการเคลื่อนไหว<br />
        ท���่ป้องกันขาลงตั้ง��ต่ปี 1971 ถึง 2026 ตามป���ะวัติศาสตร์
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>คุณต้องเข้าใจทางเศรษฐศาสตร์และโครงสร้างว่าทำไมทองคำ<br />
          จะยังคงมีขาลงจำกัดและแนวโน้มขาขึ้น</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 2. คุณสมบัติหลัก */}
      <SectionTitle>คุณสมบัติหลักของทองคำ</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">สินทรัพย์ปลอดภัย</div>
          <div className="text-foreground/50 text-sm">มูลค่าเพิ่มในวิกฤต</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">ป้องกันเงิ��เฟ้อ</div>
          <div className="text-foreground/50 text-sm">ป้องกันค่าเงินลดลง</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">ไม่สัมพันธ์กัน</div>
          <div className="text-foreground/50 text-sm">สหสัมพันธ์ต่ำกับหุ้น</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. ประวัติศาสตร์ */}
      <SectionTitle>ประวัติทองคำ: ระบบเบรตตันวูดส์</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("th")} alt="ประวัติทองคำ: กราฟระบบเบรตตันวูดส์" />

      <CalloutBox type="info">
        1944-1971: ระบบเบรตตันวูดส์
      </CalloutBox>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">ทองคำ 1 ออนซ์ = $35</div>
          <div className="text-foreground/60">มูลค่าทองคำและดอลลาร์เท่ากัน</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. Nixon Shock */}
      <SectionTitle>15 สิงหาคม 1971: Nixon Shock</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="Nixon Shock 1971 - จุดสิ้นสุดมาตรฐานทองคำ" />

      <WarningBox>
        ประธานาธิบดีนิกสัน: {`"เราจะไม่แลกเปลี่ยนดอลลาร์เป็นทองคำอีกต่อไป"`}
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% เพิ่มขึ้น</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. ทองคำไม่ขึ้นเสมอ */}
      <SectionTitle>ทองคำไม่ได้ขึ้นเสมอไป</SectionTitle>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">อัตราดอกเบี้ยสหรัฐฯ 1980: 20%</div>
          <div className="text-foreground/60">
            มูลค่าเงินสดเพิ่มขึ้น ทองคำ หุ้น และอสังหาริมทรัพย์ตกลง
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. ความสัมพันธ์กับดอกเบี้ย */}
      <SectionTitle>ความสัมพันธ์ระหว่างอัตราดอกเบี้ยและทองคำ</SectionTitle>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">ลดอัตราดอกเบี้ย</div>
          <div className="text-foreground/70">COVID → <Strong>ทองคำขึ้น</Strong></div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">ขึ้นอัตราดอกเบี้ย</div>
          <div className="text-foreground/70">หลัง COVID → <Strong>ทองคำลง</Strong></div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. QE และทองคำ */}
      <SectionTitle>การผ่อนคลายเชิงปริมาณ (QE) และทองคำ</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("th")}
        alt="ความสัมพันธ์ระหว่าง QE และราคาทองคำ"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>ปริมาณเงินโลกเพิ่มขึ้น = ราคาทองคำเพิ่มขึ้น</Accent>
        </Paragraph>
      </HighlightBox>

      <WarningBox>
        หนี้โลกเกิน 350% ของ GDP<br />
        ทางออกเดียวคือพ��มพ์เงินและลดค่าเงิน
      </WarningBox>

      <SectionDivider />

      {/* 8. อุปสงค์จริง */}
      <SectionTitle>อุปสงค์จริงที่สนับสนุนทองคำ</SectionTitle>

      <BulletList items={[
        <><Strong>การซื้อของธนาคารกลาง</Strong> — หลายพันตันต่อปี</>,
        <><Strong>อุปสงค์ระดับชาติ</Strong> — จีน อินเดีย ตุรกี</>,
        <><Strong>การซื้อขององค์กร/บุคคล</Strong> — แรงซื้อมหาศาล</>,
      ]} />

      <SectionDivider />

      {/* 9. ความเสี่ยงเดียว */}
      <SectionTitle>ความเสี่ยงเดียว: อัตราดอกเบี้ยพุ่งสูง</SectionTitle>

      <CalloutBox type="info">
        ในระบบการเงินปัจ���ุบัน อัตราดอกเบี้ย���ม่สามารถขึ้นเกิน 10% ได้<br />
        ด��งนั้นคาดว่���ทองคำจะยังคงขึ้นต่อไป
      </CalloutBox>

      <SectionDivider />

      {/* 10. BUYLOW และทองคำ */}
      <SectionTitle>ค���ามเข้ากันได้ของ BUYLOW Quant และทองคำ</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>ทองคำเพิ่มผลตอบแทน quant สูงสุดในตลาด sideways</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>ขาลงจำกัด</Strong> — ความเสี่ยงขาลงถูกจำกัดตามโครงสร้าง</>,
        <><Strong>ขึ้นอย่างค่อยเป็นค่อยไป</Strong> — การเติบโตที่มั่นคง</>,
        <><Strong>การรีบาวด์ทางเทคนิค</Strong> — รีบาวด์แม้ในช่วงขาลง</>,
      ]} />

      <SectionDivider />

      {/* 11. คู่มือผู้ใช้ */}
      <SectionTitle>คู่มือการดำเนินการของผู้ใช้</SectionTitle>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">เงินเฟ้อสหรัฐฯ</div>
          <div className="text-foreground/50 text-sm">ติดตามแนวโน้ม CPI</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">การขึ้นดอกเบี้ย</div>
          <div className="text-foreground/50 text-sm">ติดตามนโยบาย Fed</div>
        </div>
      </div>

      <SectionDivider />

      {/* 12. สรุป */}
      <WarningBox>
        หากไม่เข้าใจสิ่งที่อธิบายข้างต้น <Strong>ใช้ ChatGPT และศึกษา</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">เงินไม่ได้ถูกป้อนให้ใครง่ายๆ</div>
          <div className="text-foreground/80"><Strong>ผู้ใช้</Strong>เป็นคนเลือกการตั้งค่าโปรแกรม</div>
          <div className="text-foreground/80">โปรแกรมเป��นเพียง<Strong>เครื่องมืออัตโนมัติ</Strong></div>
          <div className="text-amber-400 font-bold mt-4">การศึกษาเศรษฐศาสตร์เป็นสิ่งจำเป็น</div>
        </div>
      </div>
    </>
  ),
  vi: () => (
    <>
      {/* 1. Giới thiệu - Tại sao là vàng */}
      <QuoteBlock>
        Tài sản yêu thích của tôi là vàng.<br />
        Lý do là nó có cấu trúc kinh tế<br />
        mà giảm giá bị giới hạn và chỉ có thể tăng.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Tài sản có giảm giá giới hạn được tối ưu hóa cho BUYLOW Quant</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Đây không đơn giản là tin rằng vàng đã cho thấy<br />
        biến động được bảo vệ khỏi giảm giá từ 1971 đến 2026 theo lịch sử.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>Bạn cần hiểu về mặt kinh tế và cấu trúc tại sao vàng<br />
          sẽ tiếp tục có giảm giá giới hạn và xu hướng tăng.</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 2. Đặc điểm chính */}
      <SectionTitle>Đặc điểm chính của vàng</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Tài sản an toàn</div>
          <div className="text-foreground/50 text-sm">Tăng giá trong khủng hoảng</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Phòng ngừa lạm phát</div>
          <div className="text-foreground/50 text-sm">Bảo vệ khỏi mất giá tiền tệ</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Không tương quan</div>
          <div className="text-foreground/50 text-sm">Tương quan thấp với cổ phiếu</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. Lịch sử */}
      <SectionTitle>Lịch sử vàng: Hệ thống Bretton Woods</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("vi")} alt="Lịch sử vàng: Biểu đồ Hệ thống Bretton Woods" />

      <CalloutBox type="info">
        1944-1971: Hệ thống Bretton Woods
      </CalloutBox>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">1 ounce vàng = $35</div>
          <div className="text-foreground/60">Giá trị vàng và đô la bằng nhau</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. Nixon Shock */}
      <SectionTitle>15 tháng 8 năm 1971: Nixon Shock</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="Nixon Shock 1971 - Kết thúc Bản vị Vàng" />

      <WarningBox>
        Tổng thống Nixon: {`"Chúng t��i sẽ không đổi đô la lấy vàng nữa"`}
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% tăng</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. Vàng không luôn tăng */}
      <SectionTitle>Vàng không phải lúc nào cũng tăng</SectionTitle>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">L��i suất Mỹ 1980: 20%</div>
          <div className="text-foreground/60">
            Giá trị tiền mặt tăng, vàng, cổ phiếu và bất động sản giảm.
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. Mối quan hệ với lãi suất */}
      <SectionTitle>Mối quan hệ giữa lãi suất và vàng</SectionTitle>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">Cắt giảm lãi suất</div>
          <div className="text-foreground/70">COVID → <Strong>Vàng tăng</Strong></div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">Tăng lãi suất</div>
          <div className="text-foreground/70">Sau COVID → <Strong>Vàng giảm</Strong></div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. QE và vàng */}
      <SectionTitle>Nới lỏng định lượng (QE) và vàng</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("vi")}
        alt="Moi quan he giua QE va gia vang"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>Tăng cung tiền toàn cầu = Tăng giá vàng</Accent>
        </Paragraph>
      </HighlightBox>

      <WarningBox>
        Nợ toàn cầu vượt 350% GDP.<br />
        Giải pháp duy nhất là in tiền và phá giá tiền tệ.
      </WarningBox>

      <SectionDivider />

      {/* 8. Nhu cầu thực */}
      <SectionTitle>Nhu cầu thực hỗ trợ vàng</SectionTitle>

      <BulletList items={[
        <><Strong>Mua của ngân hàng trung ương</Strong> — hàng nghìn tấn mỗi năm</>,
        <><Strong>Nhu cầu quốc gia</Strong> — Trung Quốc, Ấn Độ, Thổ Nhĩ Kỳ</>,
        <><Strong>Mua của doanh nghiệp/cá nhân</Strong> — áp lực mua lớn</>,
      ]} />

      <SectionDivider />

      {/* 9. Rủi ro duy nhất */}
      <SectionTitle>Rủi ro duy nhất: Tăng lãi suất đột ngột</SectionTitle>

      <CalloutBox type="info">
        Trong hệ thống tài chính hiện tại, lãi suất không thể tăng trên 10%,<br />
        nên vàng dự kiến sẽ tiếp tục tăng.
      </CalloutBox>

      <SectionDivider />

      {/* 10. BUYLOW và vàng */}
      <SectionTitle>Sự phối hợp của BUYLOW Quant và vàng</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Vàng tối ��a hóa lợi nhuận quant trong thị trường sideway</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>Giảm giá giới hạn</Strong> — rủi ro giảm bị giới hạn về cấu trúc</>,
        <><Strong>Tăng dần dần</Strong> — tăng trưởng ổn định</>,
        <><Strong>Phục hồi kỹ thuật</Strong> — phục hồi ngay cả khi giảm</>,
      ]} />

      <SectionDivider />

      {/* 11. Hướng dẫn người dùng */}
      <SectionTitle>Hướng dẫn hành động cho người dùng</SectionTitle>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">Lạm phát Mỹ</div>
          <div className="text-foreground/50 text-sm">Theo dõi xu hướng CPI</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">Tăng lãi suất</div>
          <div className="text-foreground/50 text-sm">Theo dõi chính sách Fed</div>
        </div>
      </div>

      <SectionDivider />

      {/* 12. Kết luận */}
      <WarningBox>
        Nếu không hiểu những gì giải thích ở trên, <Strong>hãy dùng ChatGPT và học.</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">Tiền không được đưa cho ai miễn phí.</div>
          <div className="text-foreground/80"><Strong>Người dùng</Strong> chọn cài đặt chương trình,</div>
          <div className="text-foreground/80">chương trình chỉ là <Strong>công cụ tự động</Strong>.</div>
          <div className="text-amber-400 font-bold mt-4">Học kinh tế là điều cần thiết.</div>
        </div>
      </div>
    </>
  ),
  tr: () => (
    <>
      {/* 1. Giriş - Neden Altın */}
      <QuoteBlock>
        En sevdiğim varlık altındır.<br />
        Nedeni, düşüşün sınırlı olduğu ve<br />
        sadece yükselebileceği bir ekonomik yapıya sahip olmasıdır.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Düşüşü sınırlı varlıklar BUYLOW Quant için optimize edilmiştir</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Bu, altının tarihsel olarak 1971&apos;den 2026&apos;ya kadar<br />
        düşüşe karşı korunan bir hareket gösterdiğine basitçe inanmak değildir.
      </Paragraph>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/10.png"
        alt="Gold price structure chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-amber-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Paragraph>
        <Strong>Altının neden sınırlı düşüşe sahip olmaya devam edeceğini<br />
          ve yukarı yönlü trend göstereceğini ekonomik ve yapısal olarak anlamanız gerekiyor.</Strong>
      </Paragraph>

      <SectionDivider />

      {/* 2. Temel özellikler */}
      <SectionTitle>Altının Temel Özellikleri</SectionTitle>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Güvenli Varlık</div>
          <div className="text-foreground/50 text-sm">Krizde değer kazanır</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Enflasyon Koruması</div>
          <div className="text-foreground/50 text-sm">Para birimi değer kaybına karşı koruma</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">İlişkisizlik</div>
          <div className="text-foreground/50 text-sm">Hisse senetleriyle düşük korelasyon</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. Tarih */}
      <SectionTitle>Altın Tarihi: Bretton Woods Sistemi</SectionTitle>

      <ChapterImage src={getGoldBrettonWoodsImage("tr")} alt="Altın Tarihi: Bretton Woods Sistemi Grafiği" />

      <CalloutBox type="info">
        1944-1971: Bretton Woods Sistemi
      </CalloutBox>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">1 ons Altın = $35</div>
          <div className="text-foreground/60">Altın ve dolar değeri eşitti</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 4. Nixon Shock */}
      <SectionTitle>15 Ağustos 1971: Nixon Şoku</SectionTitle>

      <ChapterImage src={NIXON_SHOCK_IMAGE} alt="Nixon Şoku 1971 - Altın Standardının Sonu" />

      <WarningBox>
        Başkan Nixon: {`"Artık dolarları altınla değiştirmeyeceğiz"`}
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1971</div>
              <div className="text-3xl font-bold text-amber-400">$35</div>
            </div>
            <div className="text-3xl text-foreground/30">→</div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground/50">1980</div>
              <div className="text-3xl font-bold text-amber-400">$850</div>
            </div>
          </div>
          <div className="text-emerald-400 mt-3 font-bold">+2,328% artış</div>
        </div>
      </div>

      <SectionDivider />

      {/* 5. Altın her zaman yükselmez */}
      <SectionTitle>Altın Her Zaman Yükselmez</SectionTitle>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">ABD Faiz Oranı 1980: %20</div>
          <div className="text-foreground/60">
            Nakit değeri arttı, altın, hisse senetleri ve gayrimenkul düştü.
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. Faiz oranı ilişkisi */}
      <SectionTitle>Faiz Oranları ve Altın İlişkisi</SectionTitle>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold mb-2">Faiz İndirimi</div>
          <div className="text-foreground/70">COVID → <Strong>Altın yükselir</Strong></div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold mb-2">Faiz Artışı</div>
          <div className="text-foreground/70">COVID sonrası → <Strong>Altın düşer</Strong></div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. QE ve altın */}
      <SectionTitle>Niceliksel Gevşeme (QE) ve Altın</SectionTitle>

      {/* QE Gold Price Chart - Language specific */}
      <img
        src={getQeGoldImage("tr")}
        alt="QE ve Altin Fiyati Korelasyonu"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
      />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Accent>Küresel para arzı artışı = Altın fiyatı artışı</Accent>
        </Paragraph>
      </HighlightBox>

      <WarningBox>
        Küresel borç GSYİH&apos;nin %350&apos;sini aşıyor.<br />
        Tek çözüm para basmak ve para birimini devalüe etmek.
      </WarningBox>

      <SectionDivider />

      {/* 8. Gerçek talep */}
      <SectionTitle>Altını Destekleyen Gerçek Talep</SectionTitle>

      <BulletList items={[
        <><Strong>Merkez bankası alımları</Strong> — yılda binlerce ton</>,
        <><Strong>Ulusal talep</Strong> — Çin, Hindistan, Türkiye</>,
        <><Strong>Kurumsal/bireysel alımlar</Strong> — büyük alım baskısı</>,
      ]} />

      <SectionDivider />

      {/* 9. Tek risk */}
      <SectionTitle>Tek Risk: Faiz Oranı Artışı</SectionTitle>

      <CalloutBox type="info">
        Mevcut finansal sistemde faiz oranları %10&apos;un üzerine çıkamaz,<br />
        bu nedenle altının yükselmeye devam etmesi bekleniyor.
      </CalloutBox>

      <SectionDivider />

      {/* 10. BUYLOW ve altın */}
      <SectionTitle>BUYLOW Quant ve Altın Sinerjisi</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Altın, yatay piyasalarda quant getirilerini maksimize eder</Accent>
        </Paragraph>
      </HighlightBox>

      <BulletList items={[
        <><Strong>Sınırlı düşüş</Strong> — yapısal olarak sınırlı düşüş riski</>,
        <><Strong>Kademeli yükseliş</Strong> — istikrarlı büyüme</>,
        <><Strong>Teknik toparlanmalar</Strong> — düşüşlerde bile toparlanma</>,
      ]} />

      <SectionDivider />

      {/* 11. Kullanıcı kılavuzu */}
      <SectionTitle>Kullan��cı Eylem Kılavuzu</SectionTitle>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">1</div>
          <div className="font-bold mb-1">ABD Enflasyonu</div>
          <div className="text-foreground/50 text-sm">CPI trendlerini izleyin</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2 text-cyan-400">2</div>
          <div className="font-bold mb-1">Faiz Artışı</div>
          <div className="text-foreground/50 text-sm">Fed politikasını izleyin</div>
        </div>
      </div>

      <SectionDivider />

      {/* 12. Sonuç */}
      <WarningBox>
        Yukarıda açıklananları anlamıyorsanız, <Strong>ChatGPT kullanın ve çalışın.</Strong>
      </WarningBox>

      <div className="my-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="space-y-3 text-center">
          <div className="text-foreground/80">Para kimseye kaşıkla verilmez.</div>
          <div className="text-foreground/80">Program ayarlarını seçen <Strong>kullanıcıdır</Strong>,</div>
          <div className="text-foreground/80">program sadece bir <Strong>otomasyon aracıdır</Strong>.</div>
          <div className="text-amber-400 font-bold mt-4">Ekonomi çalışmak şart.</div>
        </div>
      </div>
    </>
  ),
}

// NASDAQ/S&P500 Chapter Content: 나스닥 / S&P 500 자산의 특징
const NasdaqContent = {
  ko: () => (
    <>
      {/* 1. 시작 - 워렌버핏 인용 */}
      <QuoteBlock>
        워렌버핏은 자신의 자산 절반을 S&P500에 넣으라고 말했다.
      </QuoteBlock>

      <CalloutBox type="info">
        그만큼 S&P500은 &apos;시장 그 자체&apos;다
      </CalloutBox>

      <SectionDivider />

      {/* 2. S&P500 vs NASDAQ 비교 */}
      <SectionTitle>S&P500 vs NASDAQ</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">S&P500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>미국 500개 대형 기업</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>안정성 중심</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>변동성 낮음</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">NASDAQ (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>기술 중심 100개 기업</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>성장성 중심</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>변동성 높음</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW에서는 NASDAQ을 중심으로 설명한다</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 3. 핵심 질문 */}
      <CalloutBox type="warning">
        왜 나스닥은 구조적으로 상승할 수밖에 없는가?
      </CalloutBox>

      <SectionDivider />

      {/* 4. 기술혁신 타임라인 */}
      <SectionTitle>기술혁신의 역사</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>증기기관 — 산업혁명의 시작</> },
        { year: "1880s", event: <>전기 — 현재 문명의 기반</> },
        { year: "1900s", event: <>자동차 — 이동의 혁명</> },
        { year: "1970s", event: <>컴퓨터 — 정보화 시대</> },
        { year: "1990s", event: <>인터넷 — 기계의 연결</> },
        { year: "2000s", event: <>스마트폰 — 모바일 혁명</> },
        { year: "2020s", event: <><Strong>AI</Strong> — 지능의 혁명</> },
      ]} />

      <CalloutBox type="success">
        모든 혁신의 중심은 미국 기업
      </CalloutBox>

      <SectionDivider />

      {/* 5. 기업 사례 */}
      <SectionTitle>혁신 기업 사례</SectionTitle>

      <ComparisonBox
        leftTitle="과거 혁신 기업"
        leftItems={[
          "마이크로소프트 (Windows)",
          "애플 (iPhone)",
          "아마존 (E-commerce)",
          "구글 (Search)",
        ]}
        rightTitle="현재 혁신 기업"
        rightItems={[
          "엔비디아 (AI Chips)",
          "테슬라 (EV + AI)",
          "구글 (AI + Cloud)",
          "OpenAI (ChatGPT)",
        ]}
        lang="ko"
      />

      <QuoteBlock>
        과거도 미국, 현재도 미국, 미래도 미국
      </QuoteBlock>

      <SectionDivider />

      {/* 6. 글로벌 자본 유입 */}
      <SectionTitle>글로벌 자본 유입 구조</SectionTitle>

      <CalloutBox type="info">
        전 세계 돈은 결국 미국으로 들어온다
      </CalloutBox>

      <BigNumber
        value="20조"
        label="한국 개인투자자의 테슬라 투자액"
        sublabel="단일 종목 기준"
      />

      <BulletList items={[
        <><Strong>연기금</Strong> — 국민연금, 공무원연금 등</>,
        <><Strong>국부펀드</Strong> — 노르웨이, 사우디 등</>,
        <><Strong>기관투자자</Strong> — 헤지펀드, 자산운용사</>,
        <><Strong>개인 투자자</Strong> — 전 세계 개인들</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>이 자금이 나스닥 하방을 지지한다</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 7. ETF 구조 */}
      <SectionTitle>ETF 확대</SectionTitle>

      <Paragraph>
        ETF 확대로 <Strong>개인도 쉽게 투자</Strong>할 수 있게 되었다.
        QQQ, SPY, VOO 같은 ETF는 매일 수조 원이 거래된다.
      </Paragraph>

      <FormulaBox items={["ETF 확대", "진입 장벽 ↓", "자금 유입 ↑", "지속 상승"]} />

      <SectionDivider />

      {/* 8. 기업 현금 흐름 */}
      <SectionTitle>기업 현금 흐름</SectionTitle>

      <BigNumber
        value="100조+"
        label="애플 / 구글 / 엔비디아 연간 수익"
        sublabel="원화 환산 기준"
      />

      <Paragraph>
        이 돈은 어디로 가는가?
      </Paragraph>

      <BulletList items={[
        <><Strong>R&D</Strong> — 다음 혁신을 위한 투자</>,
        <><Strong>인수합병</Strong> — 경쟁사 흡수</>,
        <><Strong>자사주 매입</Strong> — 주가 상승 압력</>,
        <><Strong>배당</Strong> — 주주 환원</>,
      ]} />

      <CalloutBox type="success">
        자사주 매입 = 주가 상승 압력
      </CalloutBox>

      <SectionDivider />

      {/* 9. 인플레이션 구조 */}
      <SectionTitle>인플레이션과 주가</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl font-bold text-foreground mb-4">핵심 공식</div>
          <FormulaBox items={["화폐 공급 ↑", "화폐 가치 ↓", "기업 매출 ↑", "주가 ↑"]} />
        </div>
      </HighlightBox>

      <Paragraph>
        <Strong>예시:</Strong> 짜장면이 3천원에서 1만원이 되었다.<br />
        중국집 매출은 3배 증가한 것이다. 기업도 마찬가지다.
      </Paragraph>

      <WarningBox>
        <Strong>현금을 들고 있으면 손해다</Strong><br /><br />
        인플레이션은 현금 가치를 떨어뜨린다.<br />
        자산을 보유해야 <Accent>가치를 지킬 수 있다</Accent>.
      </WarningBox>

      <SectionDivider />

      {/* 10. 상승 구조 요약 */}
      <SectionTitle>나스닥 상승 구조 요약</SectionTitle>

      <NumberedList items={[
        <><Strong>기술혁신 = 미국</Strong> — 모든 혁신이 미국에서 시작</>,
        <><Strong>글로벌 자금 유입</Strong> — 전 세계 돈이 미국으로</>,
        <><Strong>인플레이션 구조</Strong> — 화폐 가치 하락 = 주가 상승</>,
      ]} />

      <SectionDivider />

      {/* 11. 리스크 설명 */}
      <SectionTitle>단기 리스크</SectionTitle>

      <WarningBox>
        <Strong>단기적으로 하락할 수 있는 조건</Strong><br /><br />
        • 금리 인상<br />
        • 금융 위기<br />
        • 전쟁<br />
        • 팬데믹
      </WarningBox>

      <Paragraph>
        <Strong>단기 위험은 존재한다.</Strong><br />
        하지만 장기적으로 이 모든 위기는 <Accent>회복</Accent>되었다.
      </Paragraph>

      <SectionDivider />

      {/* 12. 최종 결론 */}
      <QuoteBlock>
        나스닥은 결국 우상향한다
      </QuoteBlock>

      <SectionDivider />

      {/* 13. 글로벌 시장 확장 */}
      <SectionTitle>글로벌 시장도 마찬가지</SectionTitle>

      <Paragraph>
        코스피, 니케이, DAX(독일)...<br />
        <Strong>전 세계 모든 지수가 장기적으로 상승</Strong>한다.
      </Paragraph>

      <FormulaBox items={["전 세계 돈 풀림", "화폐 가치 ↓", "지수 상승"]} />

      <SectionDivider />

      {/* 14. AI 시대 강조 */}
      <SectionTitle>AI 시대</SectionTitle>

      <CalloutBox type="success">
        AI 혁명은 나스닥에 집중되어 있다
      </CalloutBox>

      <Paragraph>
        엔비디아, 마이크로소프트, 구글, 메타, 아마존...<br />
        <Strong>AI의 핵심 기업</Strong>은 모두 나스닥에 있다.
      </Paragraph>

      <SectionDivider />

      {/* 15. 금 vs 나스닥 */}
      <SectionTitle>금 vs 나스닥</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">🥇</div>
          <div className="text-lg font-bold text-amber-400 mb-2">금</div>
          <div className="text-foreground/70 text-sm">안정성 중심</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">📈</div>
          <div className="text-lg font-bold text-cyan-400 mb-2">나스닥</div>
          <div className="text-foreground/70 text-sm">성장성 중심</div>
        </div>
      </div>

      <SectionDivider />

      {/* 16. BUYLOW 연결 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>둘 다 하방이 막힌 자산</Strong><br /><br />
          금 = 구조적 안전자산<br />
          나스닥 = 글로벌 자금 + 인플레이션 지지
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 17. 마무리 연결 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          금과 나스닥을 이해했다면,<br />
          이제 <Strong>비트코인</Strong>을 살펴보자.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  en: () => (
    <>
      <QuoteBlock>
        Warren Buffett said to put half your assets in the S&P500.
      </QuoteBlock>

      <CalloutBox type="info">
        That&apos;s how much S&P500 IS &apos;the market itself&apos;
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>S&P500 vs NASDAQ</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">S&P500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>500 US Large Cap Companies</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Stability Focused</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Lower Volatility</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">NASDAQ (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>100 Tech Companies</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Growth Focused</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Higher Volatility</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW focuses on NASDAQ</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <CalloutBox type="warning">
        Why is NASDAQ structurally bound to rise?
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>History of Innovation</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>Steam Engine — Industrial Revolution</> },
        { year: "1880s", event: <>Electricity — Modern Civilization</> },
        { year: "1900s", event: <>Automobile — Transportation Revolution</> },
        { year: "1970s", event: <>Computer — Information Age</> },
        { year: "1990s", event: <>Internet — Connected World</> },
        { year: "2000s", event: <>Smartphone — Mobile Revolution</> },
        { year: "2020s", event: <><Strong>AI</Strong> — Intelligence Revolution</> },
      ]} />

      <CalloutBox type="success">
        All innovations centered on US companies
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Past was US, Present is US, Future will be US
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Global Capital Flow</SectionTitle>

      <CalloutBox type="info">
        All global money eventually flows to the US
      </CalloutBox>

      <BigNumber value="$15B+" label="Korean retail investment in Tesla alone" />

      <BulletList items={[
        <><Strong>Pension Funds</Strong> — National retirement systems</>,
        <><Strong>Sovereign Wealth Funds</Strong> — Norway, Saudi, etc.</>,
        <><Strong>Institutional Investors</Strong> — Hedge funds, asset managers</>,
        <><Strong>Retail Investors</Strong> — Global individuals</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>This capital supports NASDAQ&apos;s downside</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Inflation and Stock Prices</SectionTitle>

      <HighlightBox>
        <FormulaBox items={["Money Supply ↑", "Currency Value ↓", "Revenue ↑", "Stock Price ↑"]} />
      </HighlightBox>

      <WarningBox>
        <Strong>Holding cash means losing value</Strong><br /><br />
        Inflation erodes cash. You need assets to <Accent>preserve value</Accent>.
      </WarningBox>

      <SectionDivider />

      <SectionTitle>NASDAQ Rise Structure</SectionTitle>

      <NumberedList items={[
        <><Strong>Tech Innovation = US</Strong> — All innovation starts here</>,
        <><Strong>Global Capital Inflow</Strong> — World money flows to US</>,
        <><Strong>Inflation Structure</Strong> — Currency devaluation = stock rise</>,
      ]} />

      <SectionDivider />

      <QuoteBlock>
        NASDAQ will ultimately trend upward
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>AI Era</SectionTitle>

      <CalloutBox type="success">
        AI revolution is concentrated in NASDAQ
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Gold vs NASDAQ</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-amber-400 mb-2">Gold</div>
          <div className="text-foreground/70 text-sm">Stability Focused</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-cyan-400 mb-2">NASDAQ</div>
          <div className="text-foreground/70 text-sm">Growth Focused</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Both have limited downside</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Now let&apos;s look at <Strong>Bitcoin</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  // Simplified versions for other languages
  zh: () => (
    <>
      <QuoteBlock>
        沃伦·巴菲特说要把一半资产放����普500里
      </QuoteBlock>

      <CalloutBox type="info">
        这就是标普500就是"市场本身"的��度
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>标普500 vs 纳斯达克</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">标普500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>美国500家大型企业</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>稳定性为主</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>波动性低</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">纳斯达克 (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>100家科技企��</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>成长性为主</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>波动��高</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW以纳斯达克为中心进行说明</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <CalloutBox type="warning">
        为什么纳斯达克在结构上必然上涨？
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>技术革新历史</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>蒸汽机 — 工业革命的开始</> },
        { year: "1880s", event: <>电力 — 现代文明的基础</> },
        { year: "1900s", event: <>汽车 — 交通革命</> },
        { year: "1970s", event: <>计算机 — 信息化时代</> },
        { year: "1990s", event: <>互联网 — 机器的连接</> },
        { year: "2000s", event: <>智能手机 — 移动革命</> },
        { year: "2020s", event: <><Strong>AI</Strong> — 智能革命</> },
      ]} />

      <CalloutBox type="success">
        所有革新的中心都是美国企业
      </CalloutBox>

      <QuoteBlock>
        过�����是美国，现在是美国，未来也是美国
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>全球资本流入结构</SectionTitle>

      <CalloutBox type="info">
        全世界的钱最终都会流入美国
      </CalloutBox>

      <BulletList items={[
        <><Strong>养老基金</Strong> — 国民年金、公务员年金等</>,
        <><Strong>主权基金</Strong> — 挪威、沙特等</>,
        <><Strong>机构投资者</Strong> — 对冲基金、资产管理公司</>,
        <><Strong>个人投资者</Strong> — 全球散户</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>这些资金支撑着纳斯达克的下方</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>通货膨胀与股价</SectionTitle>

      <HighlightBox>
        <FormulaBox items={["货币供应 ↑", "货币价值 ↓", "企业营收 ↑", "股价 ↑"]} />
      </HighlightBox>

      <WarningBox>
        <Strong>持有现金就是亏损</Strong><br /><br />
        通胀会侵蚀现金���值。必须持有资产才能<Accent>保值</Accent>。
      </WarningBox>

      <SectionDivider />

      <SectionTitle>纳斯达克上涨结构总结</SectionTitle>

      <NumberedList items={[
        <><Strong>技术革新 = 美国</Strong> — 所有革新都从美国开始</>,
        <><Strong>全球资金流入</Strong> — 全世界的钱流向美国</>,
        <><Strong>通胀结构</Strong> — 货币贬值 = 股价上涨</>,
      ]} />

      <QuoteBlock>
        纳斯达克终将上涨
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>AI时代</SectionTitle>

      <CalloutBox type="success">
        AI革命集中在纳斯达克
      </CalloutBox>

      <Paragraph>
        英伟达、微软、谷歌、Meta、亚马逊...<br />
        <Strong>AI的核心企业</Strong>都在纳斯达克。
      </Paragraph>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>两者都是下方被支撑的资产</Strong><br /><br />
          黄金 = 结构性安全资产<br />
          纳斯达克 = 全球资金 + 通胀支撑
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          理解了黄金和纳斯达克，<br />
          现在让我们看看<Strong>比特币</Strong>。
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ar: () => (
    <>
      <QuoteBlock>
        قال وارن بافيت أن تضع نصف أصولك في S&P500
      </QuoteBlock>

      <CalloutBox type="info">
        هذا يوضح أن S&P500 هو &quot;السوق نفسه&quot;
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>S&P500 vs ناسداك</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">S&P500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>500 شركة أمريكية كبيرة</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>التركيز على الاستقرار</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>تقلب منخفض</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">ناسداك (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>100 شركة تقنية</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>التركيز على النمو</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>تقلب عالي</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW يركز على ناسداك</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <CalloutBox type="warning">
        لماذا ناسداك مقدر له الصعود هيكلياً؟
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>تاريخ الابتكار التقني</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>المحرك البخاري — بداية الثورة الصناعية</> },
        { year: "1880s", event: <>الكهرباء — أساس الحضارة الحديثة</> },
        { year: "1900s", event: <>السيارة — ثورة النقل</> },
        { year: "1970s", event: <>الكمبيوتر — عصر المعلومات</> },
        { year: "1990s", event: <>الإنترنت — ربط الآلات</> },
        { year: "2000s", event: <>الهاتف الذكي — ثورة الموبايل</> },
        { year: "2020s", event: <><Strong>AI</Strong> — ثورة الذكاء</> },
      ]} />

      <CalloutBox type="success">
        مركز كل الابتكارات هو الشركات الأمريكية
      </CalloutBox>

      <QuoteBlock>
        الماضي أمريكا، الحاضر أم��يكا، المستقبل أمريكا
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>هيكل تدفق رأس المال العالمي</SectionTitle>

      <BulletList items={[
        <><Strong>صناديق التقاعد</Strong> — أنظمة التقاعد الوطنية</>,
        <><Strong>صناديق الثروة السيادية</Strong> — النرويج، السعودية، إلخ</>,
        <><Strong>المستثمرون المؤسسيون</Strong> — صناديق التحوط، مديرو الأصول</>,
        <><Strong>المستثمرون الأفراد</Strong> — الأفراد حول العالم</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>هذا المال يدعم قاع ناسداك</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox>
        <FormulaBox items={["عرض النقود ↑", "قيمة العملة ↓", "الإيرادات ↑", "سعر السهم ↑"]} />
      </HighlightBox>

      <WarningBox>
        <Strong>الاحتفاظ بالنقد يعني خسارة القيمة</Strong><br /><br />
        التضخم يآكل النقد. تح��اج أصولاً لـ<Accent>الحفاظ على القيمة</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        ناسداك سيصعد في النهاية
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          الآن دعونا نلقي نظرة على <Strong>البيتكوين</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ru: () => (
    <>
      <QuoteBlock>
        Уоррен Баффет сказал положить половину активов в S&P500
      </QuoteBlock>

      <CalloutBox type="info">
        Вот насколько S&P500 является &quot;самим рынком&quot;
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>S&P500 vs NASDAQ</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">S&P500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>500 крупных компаний США</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Акцент на стабильность</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Низкая волатильность</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">NASDAQ (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>100 технологических компаний</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Акцент на рост</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Высокая волатильность</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW фокусируется на NASDAQ</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <CalloutBox type="warning">
        Почему NASDAQ структурно обречён на рост?
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>История инноваций</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>Паровой двигатель — начало промышленной революции</> },
        { year: "1880s", event: <>Электричество — основа современной цивилизации</> },
        { year: "1900s", event: <>Автомобиль — транспортная революция</> },
        { year: "1970s", event: <>Компьютер — информационная эпоха</> },
        { year: "1990s", event: <>Интернет — связь машин</> },
        { year: "2000s", event: <>Смартфон — мобильная революция</> },
        { year: "2020s", event: <><Strong>AI</Strong> — революция инте��лекта</> },
      ]} />

      <CalloutBox type="success">
        Центр всех инноваций — америк��нские компании
      </CalloutBox>

      <QuoteBlock>
        Прошлое — США, настоящее — ��ША, будущее — США
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Структура притока глобального капитала</SectionTitle>

      <BulletList items={[
        <><Strong>Пенсионные фонды</Strong> — национальные пенсионные системы</>,
        <><Strong>Суверенные фонды</Strong> — Норвегия, Саудовская Аравия и др.</>,
        <><Strong>Институциональные инвесторы</Strong> — хедж-фонды, управляющие активами</>,
        <><Strong>Розничные инвесторы</Strong> — частные лица по всему миру</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>Этот капитал поддерживает дно NASDAQ</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox>
        <FormulaBox items={["Денежная масса ↑", "Стоимость валюты ↓", "Выручка ↑", "Цена акций ↑"]} />
      </HighlightBox>

      <WarningBox>
        <Strong>Держать наличные = терять стоим��сть</Strong><br /><br />
        Инфляция съедает наличные. ��ужны активы для <Accent>со��ранения стоимости</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        NASDAQ в конечном итоге будет расти
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Теперь давайте посмотрим на <Strong>Bitcoin</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  es: () => (
    <>
      <QuoteBlock>
        Warren Buffett dijo que pongas la mitad de tus activos en el S&P500
      </QuoteBlock>

      <CalloutBox type="info">
        Así de importante es el S&P500 como &quot;el mercado mismo&quot;
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>S&P500 vs NASDAQ</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">S&P500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>500 grandes empresas de EE.UU.</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Enfoque en estabilidad</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Baja volatilidad</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">NASDAQ (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>100 empresas tecnológicas</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Enfoque en crecimiento</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Alta volatilidad</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW se enfoca en NASDAQ</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <CalloutBox type="warning">
        ¿Por qué NASDAQ está estructuralmente destinado a subir?
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Historia de la innovación</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>Motor de vapor �� Revolución Industrial</> },
        { year: "1880s", event: <>Electricidad — Base de la civilización moderna</> },
        { year: "1900s", event: <>Automóvil — Revolución del transporte</> },
        { year: "1970s", event: <>Computadora — Era de la información</> },
        { year: "1990s", event: <>Internet — Conexión de máquinas</> },
        { year: "2000s", event: <>Smartphone — Revolución móvil</> },
        { year: "2020s", event: <><Strong>IA</Strong> — Revolución de la inteligencia</> },
      ]} />

      <CalloutBox type="success">
        Todas las innovaciones centradas en empresas de EE.UU.
      </CalloutBox>

      <QuoteBlock>
        El pasado fue EE.UU., el presente es EE.UU., el futuro será EE.UU.
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Flujo de capital global</SectionTitle>

      <BulletList items={[
        <><Strong>Fondos de pensiones</Strong> — Sistemas nacionales de jubilación</>,
        <><Strong>Fondos soberanos</Strong> — Noruega, Arabia Saudita, etc.</>,
        <><Strong>Inversores institucionales</Strong> — Hedge funds, gestores de activos</>,
        <><Strong>Inversores minoristas</Strong> — Individuos globales</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>Este capital sostiene el piso de NASDAQ</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox>
        <FormulaBox items={["Oferta monetaria ↑", "Valor de moneda ↓", "Ingresos ↑", "Precio acciones ↑"]} />
      </HighlightBox>

      <WarningBox>
        <Strong>Tener efectivo significa perder valor</Strong><br /><br />
        La inflación erosiona el efectivo. Necesitas activos para <Accent>preservar valor</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        NASDAQ finalmente subirá
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Ahora veamos <Strong>Bitcoin</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  id: () => (
    <>
      <QuoteBlock>
        Warren Buffett mengatakan untuk menaruh setengah aset di S&P500
      </QuoteBlock>

      <CalloutBox type="info">
        Begitulah pentingnya S&P500 sebagai &quot;pasar itu sendiri&quot;
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>S&P500 vs NASDAQ</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">S&P500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>500 perusahaan besar AS</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Fokus stabilitas</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Volatilitas rendah</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">NASDAQ (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>100 perusahaan teknologi</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">���</span>Fokus pertumbuhan</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Volatilitas tinggi</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW berfokus pada NASDAQ</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <CalloutBox type="warning">
        Mengapa NASDAQ secara struktural pasti naik?
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Sejarah Inovasi</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>Mesin Uap — Revolusi Industri</> },
        { year: "1880s", event: <>Listrik — Dasar Peradaban Modern</> },
        { year: "1900s", event: <>Mobil — Revolusi Transportasi</> },
        { year: "1970s", event: <>Komputer — Era Informasi</> },
        { year: "1990s", event: <>Internet — Koneksi Mesin</> },
        { year: "2000s", event: <>Smartphone — Revolusi Mobile</> },
        { year: "2020s", event: <><Strong>AI</Strong> — Revolusi Kecerdasan</> },
      ]} />

      <CalloutBox type="success">
        Semua inovasi berpusat pada perusahaan AS
      </CalloutBox>

      <QuoteBlock>
        Masa lalu AS, sekarang AS, masa depan AS
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Struktur Aliran Modal Global</SectionTitle>

      <BulletList items={[
        <><Strong>Dana Pensiun</Strong> — Sistem pensiun nasional</>,
        <><Strong>Dana Kekayaan Negara</Strong> — Norwegia, Saudi, dll.</>,
        <><Strong>Investor Institusi</Strong> — Hedge fund, manajer aset</>,
        <><Strong>Investor Ritel</Strong> — Individu global</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>Modal ini menyokong dasar NASDAQ</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox>
        <FormulaBox items={["Suplai Uang ↑", "Nilai Mata Uang ↓", "Pendapatan ↑", "Harga Saham ↑"]} />
      </HighlightBox>

      <WarningBox>
        <Strong>Memegang uang tunai berarti kehilangan nilai</Strong><br /><br />
        Inflasi menggerus uang tunai. Butuh aset untuk <Accent>menjaga nilai</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        NASDAQ pada akhirnya akan naik
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Sekarang mari kita lihat <Strong>Bitcoin</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  th: () => (
    <>
      <QuoteBlock>
        วอร์เรน บัฟเฟตต์กล่าวว่าให้ใส่ครึ่งหนึ่งของสินทรัพย์ใน S&P500
      </QuoteBlock>

      <CalloutBox type="info">
        นั่นคือความสำคัญของ S&P500 ในฐานะ &quot;ตลาดเอง&quot;
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>S&P500 vs NASDAQ</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">S&P500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>500 บริษัทใหญ่ของสหรัฐ</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>เน้นความมั่นคง</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>ความผันผวนต่ำ</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">NASDAQ (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>100 บริษัทเทคโนโลยี</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>เน้นการเติบโต</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>ความผันผวนสูง</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW มุ่งเน้นที่ NASDAQ</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <CalloutBox type="warning">
        ทำไม NASDAQ ต้องขึ้นในเชิงโครงสร้าง?
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>ประวัติศาสตร์นวัตกรรม</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>เครื��องจักรไอน้ำ — การปฏิวัติอุตสาหกรรม</> },
        { year: "1880s", event: <>ไ���ฟ้า — รากฐานอารยธรรมสมัยใหม่</> },
        { year: "1900s", event: <>รถยนต์ — การปฏ��วัติการขนส่ง</> },
        { year: "1970s", event: <>คอมพิวเตอร์ — ยุคสารสนเทศ</> },
        { year: "1990s", event: <>อินเทอร์เน็ต — เชื่อมต่อเครื่องจักร</> },
        { year: "2000s", event: <>สมาร์ทโฟน — การปฏิวัติมือถือ</> },
        { year: "2020s", event: <><Strong>AI</Strong> — การปฏิวัติปัญญา</> },
      ]} />

      <CalloutBox type="success">
        ศูนย์กลางนวัตกรรมทั้งหมดคือบริษัทสหรัฐ
      </CalloutBox>

      <QuoteBlock>
        อดีตคือสหรัฐ ปัจจุบันคือสหรัฐ อนาคตก็สหรัฐ
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>โค��งส���้างการไหลเข��าของทุนโลก</SectionTitle>

      <BulletList items={[
        <><Strong>กองทุนบำนาญ</Strong> — ระบบเกษียณแห่งชาติ</>,
        <><Strong>กองทุนความมั่งคั่งแห่งชาติ</Strong> — นอร์เวย์ ซาอุดิอาระเบีย ฯลฯ</>,
        <><Strong>นักลงทุนสถาบัน</Strong> — Hedge Fund ผู้จัดการสินทรัพย์</>,
        <><Strong>นักลงทุนรายย่อย</Strong> — บุคคลทั่วโลก</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>ทุนนี้รองรับพื้นของ NASDAQ</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox>
        <FormulaBox items={["ปริมาณเงิน ↑", "ค่าเงิน ↓", "รายได้ ↑", "ราคาหุ้น ↑"]} />
      </HighlightBox>

      <WarningBox>
        <Strong>ถือเงินสดหมายถึงสูญเสียมูลค่า</Strong><br /><br />
        เงินเฟ้อกัดกร่อนเงินสด ต้องมีสินทรัพย์เพื่อ<Accent>รักษามูลค่า</Accent>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        NASDAQ จะขึ้นในที่สุด
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          ตอนนี้มาดู <Strong>Bitcoin</Strong> กัน
        </Paragraph>
      </HighlightBox>
    </>
  ),
  vi: () => (
    <>
      <QuoteBlock>
        Warren Buffett nói hãy đặt nửa tài sản vào S&P500
      </QuoteBlock>

      <CalloutBox type="info">
        Đó là mức độ quan trọng của S&P500 như &quot;chính thị trường&quot;
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>S&P500 vs NASDAQ</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">S&P500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>500 công ty lớn Mỹ</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Tập trung ổn định</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Biến động thấp</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">NASDAQ (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>100 công ty công nghệ</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Tập trung tăng trưởng</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Biến động cao</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW tập trung vào NASDAQ</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <CalloutBox type="warning">
        Tại sao NASDAQ chắc chắn tăng về mặt cấu trúc?
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Lịch sử đổi mới</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>Động cơ hơi nước — Cách mạng công nghiệp</> },
        { year: "1880s", event: <>Điện — Nền tảng văn minh hiện đại</> },
        { year: "1900s", event: <>Ô tô — Cách mạng giao thông</> },
        { year: "1970s", event: <>Máy tính — Thời đại thông tin</> },
        { year: "1990s", event: <>Internet — Kết nối máy móc</> },
        { year: "2000s", event: <>Smartphone — Cách mạng di động</> },
        { year: "2020s", event: <><Strong>AI</Strong> — Cách mạng trí tuệ</> },
      ]} />

      <CalloutBox type="success">
        Trung tâm mọi đổi mới là các công ty Mỹ
      </CalloutBox>

      <QuoteBlock>
        Quá khứ là Mỹ, hiện tại là Mỹ, tương lai cũng là Mỹ
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Cấu trúc dòng vốn toàn cầu</SectionTitle>

      <BulletList items={[
        <><Strong>Quỹ hưu trí</Strong> — Hệ thống hưu trí quốc gia</>,
        <><Strong>Quỹ tài sản quốc gia</Strong> — Na Uy, Saudi Arabia, v.v.</>,
        <><Strong>Nhà đầu tư tổ chức</Strong> — Hedge fund, quản lý tài sản</>,
        <><Strong>Nhà đầu tư cá nhân</Strong> — Cá nhân toàn cầu</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>Dòng vốn này hỗ trợ đáy của NASDAQ</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox>
        <FormulaBox items={["Cung tiền ↑", "Giá trị ti���n tệ ↓", "Doanh thu ↑", "Giá cổ phiếu ↑"]} />
      </HighlightBox>

      <WarningBox>
        <Strong>Giữ tiền mặt nghĩa là mất giá trị</Strong><br /><br />
        Lạm phát ăn mòn tiền mặt. Cần t��i sản để <Accent>bảo toàn giá trị</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        NASDAQ cuối cùng sẽ tăng
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Bây giờ hãy xem <Strong>Bitcoin</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  tr: () => (
    <>
      <QuoteBlock>
        Warren Buffett varlıklarının yarısını S&P500&apos;e koymanızı söyledi
      </QuoteBlock>

      <CalloutBox type="info">
        S&P500 işte bu kadar &quot;piyasanın kendisi&quot;
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>S&P500 vs NASDAQ</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
          <div className="text-lg font-bold text-foreground mb-3">S&P500</div>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>500 büyük ABD şirketi</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>��stikrar odaklı</li>
            <li className="flex items-start gap-2"><span className="text-foreground/40">•</span>Düşük oynaklık</li>
          </ul>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-cyan-400 mb-3">NASDAQ (QQQ)</div>
          <ul className="space-y-2 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>100 teknoloji şirketi</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Büyüme odaklı</li>
            <li className="flex items-start gap-2"><span className="text-cyan-500">•</span>Yüksek oynaklık</li>
          </ul>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>BUYLOW NASDAQ&apos;a odaklanır</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <CalloutBox type="warning">
        NASDAQ neden yapısal olarak yükselmeye mahkum?
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>İnovasyon Tarihi</SectionTitle>

      <Timeline items={[
        { year: "1780s", event: <>Buhar Motoru — Sanayi Devrimi</> },
        { year: "1880s", event: <>Elektrik — Modern Medeniyetin Temeli</> },
        { year: "1900s", event: <>Otomobil — Ulaşım Devrimi</> },
        { year: "1970s", event: <>Bilgisayar — Bilgi Çağı</> },
        { year: "1990s", event: <>İnternet — Makinelerin Bağlantısı</> },
        { year: "2000s", event: <>Akıllı Telefon — Mobil Devrim</> },
        { year: "2020s", event: <><Strong>AI</Strong> — Zeka Devrimi</> },
      ]} />

      <CalloutBox type="success">
        Tüm inovasyonların merkezi ABD şirketleri
      </CalloutBox>

      <QuoteBlock>
        Geçmiş ABD&apos;ydi, şimdi ABD, gelecek de ABD
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Global Sermaye Akışı Yapısı</SectionTitle>

      <BulletList items={[
        <><Strong>Emeklilik Fonları</Strong> — Ulusal emeklilik sistemleri</>,
        <><Strong>Varlık Fonları</Strong> — Norveç, Suudi Arabistan vb.</>,
        <><Strong>Kurumsal Yatırımcılar</Strong> — Hedge fonlar, varlık yöneticileri</>,
        <><Strong>Bireysel Yatırımcılar</Strong> — Küresel bireyler</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>Bu sermaye NASDAQ&apos;ın tabanını destekler</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox>
        <FormulaBox items={["Para Arzı ↑", "Para Birimi Değeri ↓", "Gelir ↑", "Hisse Fiyatı ↑"]} />
      </HighlightBox>

      <WarningBox>
        <Strong>Nakit tutmak değer kaybetmek demektir</Strong><br /><br />
        Enflasyon nakiti eritir. Değeri <Accent>korumak</Accent> için varlık gerekir.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        NASDAQ sonunda yükselecek
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Şimdi <Strong>Bitcoin</Strong>&apos;e bakalım.
        </Paragraph>
      </HighlightBox>
    </>
  ),
}

// Bitcoin Chapter Content: 비트코인(BTC) 자산의 특징
const BitcoinContent = {
  ko: () => (
    <>
      {/* 1. 시작 - 개인 경험 + 신뢰 */}
      <QuoteBlock>
        필자의 퀀트 인생은 비트코인에서 시작됐다.
      </QuoteBlock>

      <Paragraph>
        비트코인은 내가 처음 퀀트 알고리즘을 개발하고 테스트한 자산이다.
        <Strong>수백 %의 수익</Strong>도 경험했고, <Accent>-70% 이상의 하락</Accent>도 경험했다.
      </Paragraph>

      <SectionDivider />

      {/* 2. 핵심 구조 - 반감기 사이클 */}
      <SectionTitle>비트코인의 핵심 구조: 4년 사이클</SectionTitle>

      <CalloutBox type="warning">
        비트코인은 4년 주기의 상승 / 하락 사이클을 가진다
      </CalloutBox>

      <Timeline items={[
        { year: "상승기", event: <>반감기 전후 — <Strong>수백 % 상승</Strong></> },
        { year: "하락기", event: <>사이클 고점 후 — <Accent>-70% 이상 하락</Accent></> },
        { year: "횡보기", event: <>다음 반감기 대기 — 바닥 다지기</> },
      ]} />

      <SectionDivider />

      {/* 3. 수익 / 손실 구조 */}
      <SectionTitle>수익과 손실의 극단</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+수백%</div>
          <div className="text-foreground/60 text-sm">상승장 수익</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">하락장 손실</div>
        </div>
      </div>

      <Paragraph>
        <Strong>같은 자산</Strong>에서 이렇게 극단적인 수익과 손실이 발생한다.
        이것이 비트코인의 본질이다.
      </Paragraph>

      <SectionDivider />

      {/* 4. 리스크 (매우 중요) */}
      <SectionTitle>핵심 리스크: 급락</SectionTitle>

      <WarningBox>
        <Strong>하루에 -20% ~ -30% 급락 가능</Strong><br /><br />
        비트코인은 단 하루 만에 자산의 20~30%가 증발할 수 있다.<br />
        이것은 금이나 나스닥에서는 <Accent>거의 발생하지 않는 이벤트</Accent>다.
      </WarningBox>

      <SectionTitle>실제 사례</SectionTitle>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>루나(Luna) 사태</Strong> — 하룻밤 사이 99% 폭락</>,
        <><Strong>FTX 파산</Strong> — 시장 전체 급락 + 신뢰 붕괴</>,
        <><Strong>코로나 쇼크</Strong> — 하루 -50% 가까운 급락</>,
      ]} />

      <CalloutBox type="warning">
        비트코인은 BUYLOW와 가장 안 맞는 자산
      </CalloutBox>

      <Paragraph>
        BUYLOW 알고리즘은 <Strong>기술적 반등</Strong>을 이용해 손실을 방어한다.
        하지만 비트코인의 <Accent>원웨이 급락</Accent>에서는 반등 없이 손실이 누적된다.
      </Paragraph>

      <SectionDivider />

      {/* 5. 트레이딩 방식 차이 */}
      <SectionTitle>트레이딩 방식 차이</SectionTitle>

      <ComparisonBox
        leftTitle="금 / 나스닥"
        leftItems={[
          "구조적 수익 가능",
          "하방 제한",
          "반등 활용",
          "장기 운용 적합",
        ]}
        rightTitle="비트코인"
        rightItems={[
          "추세를 먹는 시장",
          "하락 무제한",
          "급락 리스크",
          "타이밍 중요",
        ]}
        lang="ko"
      />

      <SectionDivider />

      {/* 6. 비트코인의 장점 */}
      <SectionTitle>그럼에도 비트코인의 장점</SectionTitle>

      <HighlightBox>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">24시간 시장</div>
              <div className="text-foreground/60 text-sm">평일 + 주말, 365일 거래 가능</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">2</span>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">무제한 자동매매</div>
              <div className="text-foreground/60 text-sm">나스닥보다 시간 효율 극대화</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">3</span>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">주말 횡보 구간</div>
              <div className="text-foreground/60 text-sm">고빈도 매매로 수익 창출 가능</div>
            </div>
          </div>
        </div>
      </HighlightBox>

      <CalloutBox type="success">
        주말 횡보 구간 = 고빈도 수익 구간
      </CalloutBox>

      <SectionDivider />

      {/* 7. 핵심 판단 기준 */}
      <SectionTitle>핵심 판단 기준</SectionTitle>

      <QuoteBlock>
        비트코인은 타이밍 자산이다
      </QuoteBlock>

      <Paragraph>
        금과 나스닥은 <Strong>아무 때나 시작해도</Strong> 장기적으로 수익을 낼 수 있다.
        하지만 비트코인은 <Accent>진입 시점</Accent>이 모든 것을 결정한다.
      </Paragraph>

      <SectionDivider />

      {/* 8. 진입 전략 */}
      <SectionTitle>진입 전략</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">고점 진입</div>
          <div className="text-foreground/50 text-sm">지옥의 시작</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">하락 이후 진입</div>
          <div className="text-foreground/50 text-sm">기회의 구간</div>
        </div>
      </div>

      <CalloutBox type="info">
        최적 진입: 고점 대비 -60% 하락 구간
      </CalloutBox>

      <SectionDivider />

      {/* 9. 수익 효��� */}
      <SectionTitle>수익 효율</SectionTitle>

      <BigNumber
        value="3~4배"
        label="금/나스닥 대비 수익률"
        sublabel="적절한 타이밍 진입 시"
      />

      <Paragraph>
        타이밍을 맞추면 비트코인은 금이나 나스닥 대비
        <Strong>3~4배 이상의 수익</Strong>을 낼 수 있다.
        하지만 타이밍을 못 맞추면 <Accent>3~4배의 손실</Accent>도 가능하다.
      </Paragraph>

      <SectionDivider />

      {/* 10. 핵심 리스크 재강조 */}
      <WarningBox>
        <Strong>고점에서 진입하면 지옥이 시작된다</Strong><br /><br />
        사이클 고점에서 진입한 투자자들은<br />
        <Accent>2~3년간 -70% 이상의 손실</Accent>을 견뎌야 했다.
      </WarningBox>

      <SectionDivider />

      {/* 11. 최종 ����� 요약 */}
      <SectionTitle>최종 전략 요약</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-emerald-500/10 rounded-lg">
            <div className="text-sm text-foreground/50 mb-1">상승장</div>
            <div className="font-bold text-emerald-400">무한 수익</div>
          </div>
          <div className="p-4 bg-amber-500/10 rounded-lg">
            <div className="text-sm text-foreground/50 mb-1">하락장</div>
            <div className="font-bold text-amber-400">타이밍 중요</div>
          </div>
          <div className="p-4 bg-red-500/10 rounded-lg">
            <div className="text-sm text-foreground/50 mb-1">고점 진입</div>
            <div className="font-bold text-red-400">최고 효율</div>
          </div>
          <div className="p-4 bg-cyan-500/10 rounded-lg">
            <div className="text-sm text-foreground/50 mb-1">저점 진입</div>
            <div className="font-bold text-cyan-400">최고 효율</div>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 12. ���종 결론 */}
      <QuoteBlock>
        비트코인은 항상 돌리는 자산이 아니라,<br />
        타이밍 계산이다.
      </QuoteBlock>

      <SectionDivider />

      {/* 13. 챕터 연결 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          자산의 특징을 이해했다면,<br />
          이제 <Strong>BUYLOW 퀀트 알고리즘</Strong>을 이해할 차례다.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  en: () => (
    <>
      <QuoteBlock>
        My quant journey started with Bitcoin.
      </QuoteBlock>

      <Paragraph>
        Bitcoin is the first asset I developed and tested quant algorithms on.
        I experienced <Strong>hundreds of % gains</Strong> and <Accent>-70%+ drops</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Bitcoin&apos;s Core Structure: 4-Year Cycle</SectionTitle>

      <CalloutBox type="warning">
        Bitcoin has a 4-year cycle of rise and fall
      </CalloutBox>

      <Timeline items={[
        { year: "Bull", event: <>Around halving — <Strong>Hundreds of % gains</Strong></> },
        { year: "Bear", event: <>After cycle peak — <Accent>-70%+ decline</Accent></> },
        { year: "Sideways", event: <>Waiting for next halving — Building bottom</> },
      ]} />

      <SectionDivider />

      <SectionTitle>Extremes of Profit and Loss</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+100s%</div>
          <div className="text-foreground/60 text-sm">Bull Market Gains</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">Bear Market Loss</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Core Risk: Flash Crashes</SectionTitle>

      <WarningBox>
        <Strong>-20% to -30% drops possible in a single day</Strong><br /><br />
        Bitcoin can lose 20-30% of its value in one day.<br />
        This <Accent>rarely happens</Accent> with gold or NASDAQ.
      </WarningBox>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>Luna Collapse</Strong> — 99% crash overnight</>,
        <><Strong>FTX Bankruptcy</Strong> — Market-wide crash + trust collapse</>,
        <><Strong>COVID Shock</Strong> �� Nearly -50% in one day</>,
      ]} />

      <CalloutBox type="warning">
        Bitcoin is the LEAST compatible asset with BUYLOW
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Trading Style Differences</SectionTitle>

      <ComparisonBox
        leftTitle="Gold / NASDAQ"
        leftItems={[
          "Structural profit possible",
          "Limited downside",
          "Rebound utilization",
          "Long-term suitable",
        ]}
        rightTitle="Bitcoin"
        rightItems={[
          "Trend-following market",
          "Unlimited downside",
          "Crash risk",
          "Timing critical",
        ]}
        lang="en"
      />

      <SectionDivider />

      <SectionTitle>Bitcoin&apos;s Advantages</SectionTitle>

      <HighlightBox>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">24/7 Market</div>
              <div className="text-foreground/60 text-sm">Weekdays + Weekends, 365 days</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">2</span>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">Unlimited Auto-Trading</div>
              <div className="text-foreground/60 text-sm">More time-efficient than NASDAQ</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">3</span>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">Weekend Sideways</div>
              <div className="text-foreground/60 text-sm">High-frequency profit opportunities</div>
            </div>
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin is a timing asset
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Entry Strategy</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">Top Entry</div>
          <div className="text-foreground/50 text-sm">Path to Hell</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">Post-Crash Entry</div>
          <div className="text-foreground/50 text-sm">Opportunity Zone</div>
        </div>
      </div>

      <CalloutBox type="info">
        Optimal Entry: -60% from peak
      </CalloutBox>

      <SectionDivider />

      <BigNumber value="3-4x" label="Returns vs Gold/NASDAQ" sublabel="With proper timing" />

      <SectionDivider />

      <WarningBox>
        <Strong>Entering at the top starts your journey to hell</Strong><br /><br />
        Investors who entered at cycle peaks had to endure<br />
        <Accent>2-3 years of -70%+ losses</Accent>.
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Final Strategy Summary</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-emerald-500/10 rounded-lg">
            <div className="text-sm text-foreground/50 mb-1">Bull Market</div>
            <div className="font-bold text-emerald-400">Unlimited Profit</div>
          </div>
          <div className="p-4 bg-amber-500/10 rounded-lg">
            <div className="text-sm text-foreground/50 mb-1">Bear Market</div>
            <div className="font-bold text-amber-400">Timing Critical</div>
          </div>
          <div className="p-4 bg-red-500/10 rounded-lg">
            <div className="text-sm text-foreground/50 mb-1">Top Entry</div>
            <div className="font-bold text-red-400">Worst</div>
          </div>
          <div className="p-4 bg-cyan-500/10 rounded-lg">
            <div className="text-sm text-foreground/50 mb-1">Bottom Entry</div>
            <div className="font-bold text-cyan-400">Best Efficiency</div>
          </div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin is not an always-on asset.<br />
        It&apos;s a timing asset.
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Now that you understand the assets,<br />
          let&apos;s learn about the <Strong>BUYLOW Quant Algorithm</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  // Simplified versions for other languages
  zh: () => (
    <>
      <QuoteBlock>
        我的量化生涯从比特币开始
      </QuoteBlock>

      <Paragraph>
        比特币是我第一个开发和测试量化算法的资产。
        我经历过<Strong>数百%的收益</Strong>，也经历过<Accent>-70%以上的暴跌</Accent>。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>比特币核心结构：4年周期</SectionTitle>

      <CalloutBox type="warning">
        比特币有4年的涨跌周期
      </CalloutBox>

      <Timeline items={[
        { year: "上涨期", event: <>减半前后 — <Strong>数百%上涨</Strong></> },
        { year: "下跌期", event: <>周期顶点后 — <Accent>-70%以上下跌</Accent></> },
        { year: "横盘期", event: <>等待下一次减半 — 筑底</> },
      ]} />

      <SectionDivider />

      <SectionTitle>收益与损失的极端</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+数百%</div>
          <div className="text-foreground/60 text-sm">牛市收益</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">熊市损失</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>核心风险：急跌</SectionTitle>

      <WarningBox>
        <Strong>一天内可能暴跌-20%至-30%</Strong><br /><br />
        比特币可以在一天内蒸发20-30%的价值。<br />
        这在黄金或纳斯达克<Accent>几乎不会发生</Accent>。
      </WarningBox>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>Luna崩盘</Strong> — 一夜暴跌99%</>,
        <><Strong>FTX破产</Strong> — 市场全面暴跌 + 信任崩塌</>,
        <><Strong>新冠冲击</Strong> — 一天内近-50%</>,
      ]} />

      <CalloutBox type="warning">
        比特币是与BUYLOW最不兼���的资产
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>比特币的优势</SectionTitle>

      <HighlightBox>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">24小时市场</div>
              <div className="text-foreground/60 text-sm">工作日+周末，365天交易</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">2</span>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">无限自动交易</div>
              <div className="text-foreground/60 text-sm">比纳斯达克时间效率更高</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">3</span>
            </div>
            <div>
              <div className="font-bold text-foreground mb-1">周末横盘区间</div>
              <div className="text-foreground/60 text-sm">高频交易盈利机会</div>
            </div>
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        比特币是时机资产
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>入场策略</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">高点入场</div>
          <div className="text-foreground/50 text-sm">地狱的开始</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">下跌后入场</div>
          <div className="text-foreground/50 text-sm">机会区间</div>
        </div>
      </div>

      <CalloutBox type="info">
        最佳入场：距高点-60%的区间
      </CalloutBox>

      <SectionDivider />

      <BigNumber value="3-4倍" label="相比黄金/纳斯达克的收益" sublabel="正确时机入场时" />

      <SectionDivider />

      <QuoteBlock>
        比特币不是永远运行的资产，<br />
        而是时机资产。
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          理解了资产的特性，<br />
          ���在该了解<Strong>BUYLOW量化算法</Strong>了。
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ar: () => (
    <>
      <QuoteBlock>
        بدأت رحلتي في الكوانت مع البيتكوين
      </QuoteBlock>

      <Paragraph>
        البيتكوين هو أول أصل طورت واختبرت عليه خوارزميات الكوانت.
        خبرت <Strong>مئات الأضعاف من الأرباح</Strong> و<Accent>انخفاضات -70%+</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>اله��كل الأساسي للبيتكوين: دورة 4 سنوات</SectionTitle>

      <CalloutBox type="warning">
        البيتكوين له دورة صع��د وهبوط كل 4 سنوات
      </CalloutBox>

      <Timeline items={[
        { year: "صعود", event: <>حول التقليص — <Strong>مئات الأضعاف ارتفاع</Strong></> },
        { year: "هبوط", event: <>بعد قمة الدورة — <Accent>انخفاض -70%+</Accent></> },
        { year: "تذبذب", event: <>انتظار التقليص التالي — بناء القاع</> },
      ]} />

      <SectionDivider />

      <SectionTitle>تطرف الربح والخسارة</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+مئات%</div>
          <div className="text-foreground/60 text-sm">أرباح السوق الصاعد</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">خسائ�� السوق الهابط</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>المخاطر الأساسية: الانهيارات السريعة</SectionTitle>

      <WarningBox>
        <Strong>انخفاض -20% إلى -30% ممكن في يوم واحد</Strong><br /><br />
        البيتكوين يمكن أن يخسر 20-30% من قيمته في يوم واحد.<br />
        هذا <Accent>نادراً ما يحدث</Accent> مع الذهب أو ناسداك.
      </WarningBox>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>انهيار Luna</Strong> — انهيار 99% بين عشية وضحاها</>,
        <><Strong>إفلاس FTX</Strong> — انهيار السوق بأكمله + انهيار الثقة</>,
        <><Strong>صدمة كورونا</Strong> — انخفاض قرابة -50% في يوم واحد</>,
      ]} />

      <CalloutBox type="warning">
        البيتكوين هو الأقل توافقاً مع BUYLOW
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        البيتكوين أصل توقيت
      </QuoteBlock>

      <SectionDivider />

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">دخول القمة</div>
          <div className="text-foreground/50 text-sm">طريق الجحيم</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">دخول بعد الانهيار</div>
          <div className="text-foreground/50 text-sm">منطقة الفرص</div>
        </div>
      </div>

      <CalloutBox type="info">
        الدخول الأمثل: -60% من القمة
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        البيتكوين ليس أصلاً دائم التشغيل.<br />
        إنه أصل توقيت.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          الآن بعد فهم الأصول،<br />
          دعونا نتعلم عن <Strong>خوارزمية BUYLOW Quant</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ru: () => (
    <>
      <QuoteBlock>
        Моя квант-карьера началась с Bitcoin
      </QuoteBlock>

      <Paragraph>
        Bitcoin — первый актив, на котором я разработал и протестировал квант-алгоритмы.
        Я испытал <Strong>сотни % прибыли</Strong> и <Accent>падения более -70%</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Ядро структуры Bitcoin: 4-летний цикл</SectionTitle>

      <CalloutBox type="warning">
        Bitcoin имеет 4-летний цикл роста и падения
      </CalloutBox>

      <Timeline items={[
        { year: "Рост", event: <>Вокруг халвинга — <Strong>Сотни % роста</Strong></> },
        { year: "Падение", event: <>После пика цикла — <Accent>Падение -70%+</Accent></> },
        { year: "Боковик", event: <>Ожидание следующего халвинга — Формирование дна</> },
      ]} />

      <SectionDivider />

      <SectionTitle>Экстремумы прибыли и убытков</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+сотни%</div>
          <div className="text-foreground/60 text-sm">Прибыль бычьего рынка</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">Убыток медвежьего рынка</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Ключевой риск: обвалы</SectionTitle>

      <WarningBox>
        <Strong>Падение -20% до -30% возможно за один день</Strong><br /><br />
        Bitcoin может потерять 20-30% стоимости за день.<br />
        С золотом или NASDAQ это <Accent>почти не происходит</Accent>.
      </WarningBox>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>Крах Luna</Strong> — обвал на 99% за ночь</>,
        <><Strong>Банкротство FTX</Strong> — обвал всего рынка + крах доверия</>,
        <><Strong>Ковидный шок</Strong> — падение почти -50% за день</>,
      ]} />

      <CalloutBox type="warning">
        Bitcoin — наименее совместимый актив с BUYLOW
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin — актив ��айминга
      </QuoteBlock>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">В��од на вершине</div>
          <div className="text-foreground/50 text-sm">Путь в ад</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">Вход после падения</div>
          <div className="text-foreground/50 text-sm">Зона возможностей</div>
        </div>
      </div>

      <CalloutBox type="info">
        Оптимальный вход: -60% от пика
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin — не актив для постоянной работы.<br />
        Это актив тайминга.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Теперь, поняв активы,<br />
          давайте изучим <Strong>алгоритм BUYLOW Quant</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  es: () => (
    <>
      <QuoteBlock>
        Mi carrera quant comenzó con Bitcoin
      </QuoteBlock>

      <Paragraph>
        Bitcoin es el primer activo donde desarrollé y probé algoritmos quant.
        Experimenté <Strong>cientos de % de ganancias</Strong> y <Accent>caídas de -70%+</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Estructura central de Bitcoin: ciclo de 4 años</SectionTitle>

      <CalloutBox type="warning">
        Bitcoin tiene un ciclo de 4 años de subida y bajada
      </CalloutBox>

      <Timeline items={[
        { year: "Alcista", event: <>Alrededor del halving — <Strong>Cientos de % de subida</Strong></> },
        { year: "Bajista", event: <>Después del pico — <Accent>Caída de -70%+</Accent></> },
        { year: "Lateral", event: <>Esperando próximo halving — Formando suelo</> },
      ]} />

      <SectionDivider />

      <SectionTitle>Extremos de ganancia y pérdida</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+cientos%</div>
          <div className="text-foreground/60 text-sm">Ganancias mercado alcista</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">Pérdidas mercado bajista</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Riesgo clave: colapsos repentinos</SectionTitle>

      <WarningBox>
        <Strong>Caídas de -20% a -30% posibles en un solo día</Strong><br /><br />
        Bitcoin puede perder 20-30% de su valor en un día.<br />
        Esto <Accent>rara vez ocurre</Accent> con oro o NASDAQ.
      </WarningBox>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>Colapso de Luna</Strong> — caída del 99% en una noche</>,
        <><Strong>Quiebra de FTX</Strong> — colapso del mercado + pérdida de confianza</>,
        <><Strong>Shock COVID</Strong> — caída de casi -50% en un día</>,
      ]} />

      <CalloutBox type="warning">
        Bitcoin es el activo MENOS compatible con BUYLOW
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin es un activo de timing
      </QuoteBlock>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">Entrada en máximo</div>
          <div className="text-foreground/50 text-sm">Camino al infierno</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">Entrada post-caída</div>
          <div className="text-foreground/50 text-sm">Zona de oportunidad</div>
        </div>
      </div>

      <CalloutBox type="info">
        Entrada óptima: -60% desde máximo
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin no es un activo siempre activo.<br />
        Es un activo de timing.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Ahora que entiendes los activos,<br />
          aprendamos sobre el <Strong>algoritmo BUYLOW Quant</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  id: () => (
    <>
      <QuoteBlock>
        Karier quant saya dimulai dengan Bitcoin
      </QuoteBlock>

      <Paragraph>
        Bitcoin adalah aset pertama di mana saya mengembangkan dan menguji algoritma quant.
        Saya mengalami <Strong>ratusan % keuntungan</Strong> dan <Accent>penurunan -70%+</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Struktur Inti Bitcoin: Siklus 4 Tahun</SectionTitle>

      <CalloutBox type="warning">
        Bitcoin memiliki siklus naik turun 4 tahun
      </CalloutBox>

      <Timeline items={[
        { year: "Bullish", event: <>Sekitar halving — <Strong>Ratusan % kenaikan</Strong></> },
        { year: "Bearish", event: <>Setelah puncak siklus — <Accent>Penurunan -70%+</Accent></> },
        { year: "Sideways", event: <>Menunggu halving berikutnya — Membangun dasar</> },
      ]} />

      <SectionDivider />

      <SectionTitle>Ekstrem Untung dan Rugi</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+ratusan%</div>
          <div className="text-foreground/60 text-sm">Profit bull market</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">Rugi bear market</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Risiko Utama: Flash Crash</SectionTitle>

      <WarningBox>
        <Strong>Penurunan -20% hingga -30% mungkin dalam sehari</Strong><br /><br />
        Bitcoin bisa kehilangan 20-30% nilainya dalam satu hari.<br />
        Ini <Accent>jarang terjadi</Accent> pada emas atau NASDAQ.
      </WarningBox>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>Keruntuhan Luna</Strong> — crash 99% dalam semalam</>,
        <><Strong>Kebangkrutan FTX</Strong> — crash seluruh pasar + runtuhnya kepercayaan</>,
        <><Strong>Shock COVID</Strong> — penurunan hampir -50% dalam sehari</>,
      ]} />

      <CalloutBox type="warning">
        Bitcoin adalah aset yang PALING TIDAK kompatibel dengan BUYLOW
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin adalah aset timing
      </QuoteBlock>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">Entry di puncak</div>
          <div className="text-foreground/50 text-sm">Jalan ke neraka</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">Entry setelah crash</div>
          <div className="text-foreground/50 text-sm">Zona peluang</div>
        </div>
      </div>

      <CalloutBox type="info">
        Entry Optimal: -60% dari puncak
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin bukan aset yang selalu berjalan.<br />
        Ini adalah aset timing.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Sekarang setelah memahami aset,<br />
          mari pelajari <Strong>Algoritma BUYLOW Quant</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  th: () => (
    <>
      <QuoteBlock>
        อาชีพ quant ขอ���ผมเริ่มต้นจา��� Bitcoin
      </QuoteBlock>

      <Paragraph>
        Bitcoin เป็นสินท�����พย์แรกที���ผมพัฒนาและทดส��บอัลกอริทึม quant
        ผมเคย���ด้กำไร<Strong>หลา��ร้อย%</Strong> และเคยขาดทุน<Accent>-70%+</Accent>
      </Paragraph>

      <SectionDivider />

      <SectionTitle>โครงสร้างหลักของ Bitcoin: วงจร 4 ปี</SectionTitle>

      <CalloutBox type="warning">
        Bitcoin มีวงจรขึ้นลง 4 ปี
      </CalloutBox>

      <Timeline items={[
        { year: "ขาขึ้น", event: <>ช่วง halving — <Strong>ขึ้นหลายร้อย%</Strong></> },
        { year: "ขาลง", event: <>หลังจุดสูงสุด — <Accent>ลง -70%+</Accent></> },
        { year: "Sideways", event: <>รอ halving ถัดไป — สร้างฐาน</> },
      ]} />

      <SectionDivider />

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+หลายร้อย%</div>
          <div className="text-foreground/60 text-sm">กำไรตลาดกระทิง</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">ขาดทุนตลาดหมี</div>
        </div>
      </div>

      <WarningBox>
        <Strong>ร่วง -20% ถึง -30% ได้ในวั���เดียว</Strong><br /><br />
        Bitcoin สามารถสูญเสีย 20-30% ของมูลค่าในวันเดียว<br />
        สิ่งนี้<Accent>แทบไม่เกิดขึ้น</Accent>กับ��องคำหรือ NASDAQ
      </WarningBox>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>Luna ล่มสลาย</Strong> — ร่วง 99% ในคืนเดียว</>,
        <><Strong>FTX ล้มละลาย</Strong> — ตลาดท��้งหมดร่วง + ความเชื่อมั่นพังทลาย</>,
        <><Strong>COVID Shock</Strong> — ร่วงเกือบ -50% ในวันเดียว</>,
      ]} />

      <CalloutBox type="warning">
        Bitcoin เป็นสินทรัพย์ที่เข้ากันกับ BUYLOW น้อยที่สุด
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin เป็นสินทรัพย์จับจังหวะ
      </QuoteBlock>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">เข้าที่จุดสูงสุด</div>
          <div className="text-foreground/50 text-sm">ทางสู่นรก</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">เข้าหลังร่วง</div>
          <div className="text-foreground/50 text-sm">โซนโอกาส</div>
        </div>
      </div>

      <CalloutBox type="info">
        จุดเข้าที่ดีที่สุด: -60% จากจุดสูงสุด
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin ไม่ใ���่สินทรัพย์ที่รันตลอดเวลา<br />
        มันคือสินทรัพย์จับจังหวะ
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          ตอนนี้คุณเข้าใจสินทรัพย์แล้ว<br />
          มาเรียนรู้เกี่ยวกับ<Strong>อัลกอริทึม BUYLOW Quant</Strong> กัน
        </Paragraph>
      </HighlightBox>
    </>
  ),
  vi: () => (
    <>
      <QuoteBlock>
        Sự nghiệp quant của tôi bắt đầu từ Bitcoin
      </QuoteBlock>

      <Paragraph>
        Bitcoin là tài sản đầu tiên tôi phát triển và thử nghiệm thuật toán quant.
        Tôi đã trải nghiệm <Strong>lợi nhuận hàng trăm %</Strong> và <Accent>giảm -70%+</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Cấu trúc cốt lõi Bitcoin: chu kỳ 4 năm</SectionTitle>

      <CalloutBox type="warning">
        Bitcoin có chu kỳ tăng giảm 4 năm
      </CalloutBox>

      <Timeline items={[
        { year: "Tăng", event: <>Quanh halving — <Strong>Tăng hàng trăm %</Strong></> },
        { year: "Giảm", event: <>Sau đỉnh chu kỳ — <Accent>Giảm -70%+</Accent></> },
        { year: "Sideway", event: <>Chờ halving tiếp theo — Xây đáy</> },
      ]} />

      <SectionDivider />

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+hàng trăm%</div>
          <div className="text-foreground/60 text-sm">Lợi nhu���n bull market</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">Lỗ bear market</div>
        </div>
      </div>

      <WarningBox>
        <Strong>Giảm -20% đến -30% có thể xảy ra trong một ngày</Strong><br /><br />
        Bitcoin có thể mất 20-30% giá trị trong một ngày.<br />
        Điều n��y <Accent>hiếm khi xảy ra</Accent> với vàng hoặc NASDAQ.
      </WarningBox>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>Sự sụp đổ Luna</Strong> — giảm 99% chỉ trong một đêm</>,
        <><Strong>Phá sản FTX</Strong> — toàn bộ thị trường sụp đổ + mất niềm tin</>,
        <><Strong>COVID Shock</Strong> — giảm gần -50% trong một ngày</>,
      ]} />

      <CalloutBox type="warning">
        Bitcoin là tài sản KHÔNG tương thích nhất với BUYLOW
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin là tài sản chọn thời điểm
      </QuoteBlock>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">Vào ở đ��nh</div>
          <div className="text-foreground/50 text-sm">Con đường xuống địa ngục</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">Vào sau khi crash</div>
          <div className="text-foreground/50 text-sm">Vùng cơ hội</div>
        </div>
      </div>

      <CalloutBox type="info">
        Điểm vào tối ưu: -60% từ đỉnh
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin không phải tài sản luôn chạy.<br />
        Đó là tài sản chọn thời điểm.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Bây giờ bạn hiểu các tài sản,<br />
          hãy tìm hiểu về <Strong>Thuật toán BUYLOW Quant</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  tr: () => (
    <>
      <QuoteBlock>
        Quant kariyerim Bitcoin ile başladı
      </QuoteBlock>

      <Paragraph>
        Bitcoin, quant algoritmalarını geliştirip test ettiğim ilk varlık.
        <Strong>Yüzlerce % kâr</Strong> ve <Accent>-70%+ düşüşler</Accent> yaşadım.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Bitcoin&apos;in Temel Yapısı: 4 Yıllık Döngü</SectionTitle>

      <CalloutBox type="warning">
        Bitcoin&apos;in 4 yıllık yükseliş ve düşüş döngüsü var
      </CalloutBox>

      <Timeline items={[
        { year: "Yükseliş", event: <>Halving civarında — <Strong>Yüzlerce % yükseliş</Strong></> },
        { year: "Düşüş", event: <>Döngü zirvesinden sonra — <Accent>-70%+ düşüş</Accent></> },
        { year: "Yatay", event: <>Sonraki halving beklentisi — Dip oluşturma</> },
      ]} />

      <SectionDivider />

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-2">+yüzlerce%</div>
          <div className="text-foreground/60 text-sm">Boğa piyasası kârı</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">-70%</div>
          <div className="text-foreground/60 text-sm">Ayı piyasası kaybı</div>
        </div>
      </div>

      <WarningBox>
        <Strong>Bir günde -20% ile -30% düşüş mümkün</Strong><br /><br />
        Bitcoin bir günde değerinin 20-30%&apos;unu kaybedebilir.<br />
        Bu altın veya NASDAQ&apos;ta <Accent>nadiren olur</Accent>.
      </WarningBox>

      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/15.png"
        alt="Bitcoin crash examples chart"
        className="w-full max-w-[900px] mx-auto my-7 rounded-xl block shadow-lg shadow-orange-500/10"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <BulletList items={[
        <><Strong>Luna Çöküşü</Strong> — bir gecede %99 düşüş</>,
        <><Strong>FTX İflası</Strong> — tüm piyasa çöküşü + güven kaybı</>,
        <><Strong>COVID Şoku</Strong> — bir günde neredeyse -%50 düşüş</>,
      ]} />

      <CalloutBox type="warning">
        Bitcoin, BUYLOW ile EN AZ uyumlu varlık
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin bir zamanlama varlığı
      </QuoteBlock>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">X</div>
          <div className="text-lg font-bold text-red-400 mb-1">Zirvede giriş</div>
          <div className="text-foreground/50 text-sm">Cehennem yolu</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">O</div>
          <div className="text-lg font-bold text-emerald-400 mb-1">Düşüşten sonra giriş</div>
          <div className="text-foreground/50 text-sm">Fırsat bölgesi</div>
        </div>
      </div>

      <CalloutBox type="info">
        Optimal Giriş: Zirveden -60%
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Bitcoin sürekli çalışan bir varlık değil.<br />
        Bir zamanlama varlığı.
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Artık varlıkları anladınız,<br />
          <Strong>BUYLOW Quant Algoritmasını</Strong> öğrenelim.
        </Paragraph>
      </HighlightBox>
    </>
  ),
}

// Chapter 2 Content: 승자의 저주 : 파산
const WinnersCurseContent = {
  ko: () => (
    <>
      {/* 1. 시작 - 현재 사용자 상황 공감 */}
      <Paragraph>
        지금까지 <Strong>금</Strong>과 <Strong>나스닥</Strong>의 구조를 이해했다.
        장기적으로 우상향하는 자산이라는 것도 알았다.
      </Paragraph>

      <Paragraph>
        하지만 이제부터 하는 이야기가 <Accent>가장 중요하다</Accent>.
      </Paragraph>

      <SectionDivider />

      {/* 2. 정직한 선언 */}
      <QuoteBlock>
        나는 단순히 판매자가 아니다.<br />
        현실적으로 말하겠다.
      </QuoteBlock>

      <SectionDivider />

      {/* 3. 나스닥 하락 사례 - 카드형 강조 */}
      <SectionTitle>나스닥 역대 폭락 사례</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="나스닥 역대 폭락 사례 차트" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 코로나</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 금리인상</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 관세</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      {/* 추가 ���조 - �� 큰 폭락 */}
      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 금융위기</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 닷컴버블</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      {/* 4. 감정 묘사 */}
      <SectionTitle>그 공포감은 장난이 아니다</SectionTitle>

      <Paragraph>
        숫자로 보면 단순해 보인다.<br />
        하지만 <Strong>실제로 겪으면</Strong> 완전히 다르다.
      </Paragraph>

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl font-bold text-foreground mb-3">
            -30%가 의미하는 것
          </div>
          <div className="text-foreground/70">
            1억 → <span className="text-red-400 font-bold">7천만원</span><br />
            10억 → <span className="text-red-400 font-bold">7억</span>
          </div>
        </div>
      </HighlightBox>

      <Paragraph>
        매일 자산이 <Accent>수천만 원씩 증발</Accent>하는 걸 지켜보는 공포.<br />
        이걸 경험해보지 않으면 절대 모른다.
      </Paragraph>

      <SectionDivider />

      {/* 5. 핵심 메시지 */}
      <QuoteBlock>
        우상향 자산도 폭락한다
      </QuoteBlock>

      <SectionDivider />

      {/* 6. 구조적 진실 */}
      <SectionTitle>구조적 진실</SectionTitle>

      <Paragraph>
        <Strong>나스닥은 우상향 맞다.</Strong><br />
        하지만 그 과정에서 <Accent>조정은 필수</Accent>다.
      </Paragraph>

      <Paragraph>
        우상향이라고 해서 항상 오르는 게 아니다.<br />
        <Strong>5~10년 단위로 보면 올라가지만</Strong>,<br />
        그 안에서 <Accent>-30%, -50%</Accent> 폭락은 반드시 온다.
      </Paragraph>

      <SectionDivider />

      {/* 7. 확률 구조 */}
      <SectionTitle>폭락 주기</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-xs text-foreground/50 mb-1">5년에 1번</div>
            <div className="text-2xl font-bold text-amber-400">-30%</div>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-xs text-foreground/50 mb-1">10~20년에 1번</div>
            <div className="text-2xl font-bold text-red-400">-50%</div>
          </div>
        </div>
      </div>

      <Paragraph>
        이건 <Strong>확률이 아니라 필연</Strong>이다.<br />
        시장이 존재하는 한, 폭락은 반드시 온다.
      </Paragraph>

      <SectionDivider />

      {/* 8. 승자의 저주 개념 */}
      <SectionTitle>승자의 저주</SectionTitle>

      <QuoteBlock>
        수익이 쌓이면, 사람은 무조건 방심한다
      </QuoteBlock>

      <Paragraph>
        처음에는 조심한다.<br />
        하지만 <Strong>수익이 쌓이면</Strong> 달라진다.
      </Paragraph>

      {/* 리스크 공식 흐름 */}
      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">수익 발생</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-center">
            <span className="text-cyan-400 font-medium">자신감 상승</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">리스크 확대 (레버리지 ↑)</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">파산</span>
          </div>
        </div>
      </div>

      <Paragraph>
        이것이 <Strong>승자의 저주</Strong>다.<br />
        돈을 벌수록 <Accent>더 위험해지는 구조</Accent>.
      </Paragraph>

      <SectionDivider />

      {/* 9. 경고 (강하게) */}
      <WarningBox>
        <Strong>언젠간 폭락은 온다</Strong><br /><br />
        그게 1년 후일 수도, 5년 후일 수도 있다.<br />
        하지만 <Accent>반드시 온다</Accent>.
      </WarningBox>

      <CalloutBox type="warning">
        이걸 모르면 100% 터진다
      </CalloutBox>

      <SectionDivider />

      {/* 10. 대응 전략 */}
      <SectionTitle>대응 전략</SectionTitle>

      <Paragraph>
        폭락은 막을 수 없다.<br />
        하지만 <Strong>준비할 수는 있다</Strong>.
      </Paragraph>

      <NumberedList items={[
        <><Strong>수익 출금 원칙</Strong> — 일정 수익 달성 시 원금 일부 회수</>,
        <><Strong>N진입 초기화</Strong> — 과도한 진입 시 포지션 리셋</>,
        <><Strong>과매수 시 비중 축소</Strong> — 시장 과열 신호에 대응</>,
      ]} />

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          규칙 없이 운용하면 <Accent>언젠가 반드시 파산</Accent>한다
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 11. 포트폴리오 전략 */}
      <SectionTitle>포트폴리오 전략</SectionTitle>

      <CalloutBox type="success">
        Cross 세팅: 금 + 나스닥
      </CalloutBox>

      <Paragraph>
        <Strong>금</Strong>은 위기에 강하고,<br />
        <Strong>나스닥</Strong>은 성장에 유리하다.
      </Paragraph>

      <Paragraph>
        둘을 함께 운용하면 <Accent>서로의 약점을 보완</Accent>한다.
      </Paragraph>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          분산 = 생존
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 12. 최종 핵심 */}
      <QuoteBlock>
        살아남는 것이 수익보다 중요하다
      </QuoteBlock>

      <Paragraph>
        아무리 좋은 알고리즘도<br />
        <Strong>파산하면 의미 없다</Strong>.
      </Paragraph>

      <Paragraph>
        100%를 벌고 파산하는 것보다<br />
        <Accent>30%를 벌고 10년 생존</Accent>하는 게 낫다.
      </Paragraph>

      <SectionDivider />

      {/* 13. 마지막 메시지 */}
      <SectionTitle>핵심 정리</SectionTitle>

      <BulletList items={[
        <><Strong>알고리즘 이해</Strong> — 시스템이 어떻게 작동하는지 알아야 한다</>,
        <><Strong>자산 이해</Strong> — 각 자산의 특성과 리스크를 알아야 한다</>,
        <><Strong>리스크 관리</Strong> — 규칙 없이는 반드시 파산한다</>,
      ]} />

      <SectionDivider />

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="ko" />

      <SectionDivider />

      {/* 14. 다음 챕터 연결 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          리스크를 이해했다면,<br />
          이제 <Strong>BUYLOW 알고리즘이 어떻게 작동하는지</Strong> 알아보자.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  en: () => (
    <>
      <Paragraph>
        You now understand the structure of <Strong>Gold</Strong> and <Strong>NASDAQ</Strong>.
        You know they trend upward long-term.
      </Paragraph>

      <Paragraph>
        But what comes next is <Accent>the most important part</Accent>.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        I&apos;m not just a seller.<br />
        I&apos;ll speak realistically.
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Historical NASDAQ Crashes</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="Historical NASDAQ Crashes Chart" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 COVID</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 Rate Hike</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 Tariffs</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 Financial Crisis</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 Dot-com</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>The Fear is Real</SectionTitle>

      <Paragraph>
        Numbers look simple on paper.<br />
        But <Strong>experiencing it</Strong> is completely different.
      </Paragraph>

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl font-bold text-foreground mb-3">
            What -30% Means
          </div>
          <div className="text-foreground/70">
            $100K → <span className="text-red-400 font-bold">$70K</span><br />
            $1M → <span className="text-red-400 font-bold">$700K</span>
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Even upward-trending assets crash
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Crash Cycles</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-xs text-foreground/50 mb-1">Every 5 Years</div>
            <div className="text-2xl font-bold text-amber-400">-30%</div>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-xs text-foreground/50 mb-1">Every 10-20 Years</div>
            <div className="text-2xl font-bold text-red-400">-50%</div>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>The Winner&apos;s Curse</SectionTitle>

      <QuoteBlock>
        When profits pile up, people inevitably get complacent
      </QuoteBlock>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">Profit Generated</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-center">
            <span className="text-cyan-400 font-medium">Confidence Rises</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">Risk Expansion (Leverage ↑)</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">Bankruptcy</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <WarningBox>
        <Strong>A crash WILL come</Strong><br /><br />
        It could be in 1 year, or 5 years.<br />
        But it <Accent>will definitely come</Accent>.
      </WarningBox>

      <CalloutBox type="warning">
        If you don&apos;t understand this, you WILL blow up
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Response Strategy</SectionTitle>

      <NumberedList items={[
        <><Strong>Profit Withdrawal Rules</Strong> — Recover principal at certain profit levels</>,
        <><Strong>N-Entry Reset</Strong> — Reset positions on excessive entry</>,
        <><Strong>Reduce Size on FOMO</Strong> — Respond to market overheating signals</>,
      ]} />

      <SectionDivider />

      <SectionTitle>Portfolio Strategy</SectionTitle>

      <CalloutBox type="success">
        Cross Setup: Gold + NASDAQ
      </CalloutBox>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          Diversification = Survival
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Surviving is more important than profits
      </QuoteBlock>

      <SectionDivider />

      <BulletList items={[
        <><Strong>Understand the Algorithm</Strong> — Know how the system works</>,
        <><Strong>Understand the Assets</Strong> — Know each asset&apos;s characteristics and risks</>,
        <><Strong>Risk Management</Strong> — Without rules, bankruptcy is inevitable</>,
      ]} />

      <SectionDivider />

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="en" />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Now that you understand risk,<br />
          let&apos;s learn <Strong>how the BUYLOW algorithm works</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  // Translated versions for other languages
  zh: () => (
    <>
      <Paragraph>
        你现在了解了<Strong>���金</Strong>和<Strong>纳斯达克</Strong>的结构。
        你���道它们长期向上。
      </Paragraph>

      <Paragraph>
        但接下来的内容���<Accent>最重要的部分</Accent>。
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        我们仅仅是销售者。<br />
        我会实话实说。
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>纳斯��克历史暴跌案例</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="纳斯达克历��暴跌案例图表" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 新冠</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 加息</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 关税</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 金融危机</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 互联网泡沫</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        即使是上涨趋势的资产也会暴���
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>结构性真相</SectionTitle>

      <ChapterImage src={STRUCTURAL_TRUTH_IMAGE} alt="结构性真相 - 上涨资产的调整区间" />

      <SectionDivider />

      <SectionTitle>赢家的诅咒</SectionTitle>

      <QuoteBlock>
        当利润累积时，人们不可避免地会变得自满
      </QuoteBlock>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">产生利润</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-center">
            <span className="text-cyan-400 font-medium">信心上升</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">风险扩大 (杠杆 ↑)</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">破产</span>
          </div>
        </div>
      </div>

      <WarningBox>
        <Strong>暴跌终将来临</Strong><br /><br />
        可能是1年后，也可能是5年后。<br />
        但它<Accent>一定会来</Accent>。
      </WarningBox>

      <SectionDivider />

      <SectionTitle>投资组合策略</SectionTitle>

      <CalloutBox type="success">
        交叉配置：黄金 + 纳斯达克
      </CalloutBox>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          分散 = 生存
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        生存比利���更重要
      </QuoteBlock>

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="zh" />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          现在你了解了风险，<br />
          让我们学习<Strong>BUYLOW算法如何工作</Strong>。
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ar: () => (
    <>
      <Paragraph>
        أنت الآن تفهم هيكل <Strong>الذهب</Strong> و<Strong>ناسداك</Strong>.
        تعلم أنهما يتجهان للأعلى على المدى الطويل.
      </Paragraph>

      <Paragraph>
        لكن ما يأتي بعد ذلك هو <Accent>الجزء الأهم</Accent>.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        أنا لست مجرد بائع.<br />
        سأتحدث بواقعية.
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>انهيارات ناسداك التاريخية</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="مخطط انهيارات ناسداك التاريخية" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 كوفيد</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 رفع الفائدة</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 الرسوم</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 الأزمة المالية</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 فقاعة الدوت كوم</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        حتى الأصول الصاعدة تنهار
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>الحقيقة الهيكلية</SectionTitle>

      <ChapterImage src={STRUCTURAL_TRUTH_IMAGE} alt="الحقيقة الهيكلية - فترات التصحيح في الأصول الصاعدة" />

      <SectionDivider />

      <SectionTitle>لعنة الفائز</SectionTitle>

      <QuoteBlock>
        عندما تتراكم الأرباح، يصبح الناس حتماً متراخين
      </QuoteBlock>

      <WarningBox>
        <Strong>الانهيار سيأت��</Strong><br /><br />
        قد يكون بعد سنة، أو 5 سنوات.<br />
        لكنه <Accent>سيأتي حتماً</Accent>.
      </WarningBox>

      <SectionDivider />

      <CalloutBox type="success">
        إعداد متقاطع: الذهب + ناسداك
      </CalloutBox>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          التنويع = البقاء
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        البقاء ��هم من الأرباح
      </QuoteBlock>

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="ar" />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          الآن بعد فهم المخاطر،<br />
          لنتعلم <Strong>كيف تعمل خوارزمية BUYLOW</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ru: () => (
    <>
      <Paragraph>
        Теперь вы понимаете структуру <Strong>золота</Strong> и <Strong>NASDAQ</Strong>.
        Вы знаете, что они растут долгосрочно.
      </Paragraph>

      <Paragraph>
        Но далее идёт <Accent>самая важная часть</Accent>.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Я не просто продавец.<br />
        Буду говорить реалистично.
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Исторические обвалы NASDAQ</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="График исторических обвалов NASDAQ" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 COVID</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 Ставки</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 Тарифы</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 Фин. кризис</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 Доткомы</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Даже растущие активы обваливаются
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Структурная правда</SectionTitle>

      <ChapterImage src={STRUCTURAL_TRUTH_IMAGE} alt="Структурная правда - периоды коррекции растущих активов" />

      <SectionDivider />

      <SectionTitle>Проклятие победителя</SectionTitle>

      <QuoteBlock>
        Когда прибыль накапливается, люди неизбежно расслабляются
      </QuoteBlock>

      <WarningBox>
        <Strong>Обвал ПРИДЁТ</Strong><br /><br />
        Через год или через 5 лет.<br />
        Но он <Accent>точно придёт</Accent>.
      </WarningBox>

      <SectionDivider />

      <CalloutBox type="success">
        Кросс-настройка: Золото + NASDAQ
      </CalloutBox>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          Диверсификация = Выживание
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Выживание важнее прибыли
      </QuoteBlock>

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="ru" />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Теперь, поняв риски,<br />
          изучим <Strong>как работает алгоритм BUYLOW</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  es: () => (
    <>
      <Paragraph>
        Ahora entiendes la estructura del <Strong>Oro</Strong> y <Strong>NASDAQ</Strong>.
        Sabes que tienen tendencia alcista a largo plazo.
      </Paragraph>

      <Paragraph>
        Pero lo que viene es <Accent>la parte más importante</Accent>.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        No soy solo un vendedor.<br />
        Hablaré de forma realista.
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Caídas históricas de NASDAQ</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="Gráfico de caídas históricas de NASDAQ" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 COVID</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 Tasas</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 Aranceles</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 Crisis financiera</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 Burbuja .com</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Incluso los activos alcistas colapsan
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Verdad Estructural</SectionTitle>

      <ChapterImage src={STRUCTURAL_TRUTH_IMAGE} alt="Verdad Estructural - Períodos de corrección en activos alcistas" />

      <SectionDivider />

      <SectionTitle>La maldición del ganador</SectionTitle>

      <QuoteBlock>
        Cuando las ganancias se acumulan, las personas inevitablemente se confían
      </QuoteBlock>

      <WarningBox>
        <Strong>El colapso VENDRÁ</Strong><br /><br />
        Puede ser en 1 año o en 5 años.<br />
        Pero <Accent>definitivamente vendrá</Accent>.
      </WarningBox>

      <SectionDivider />

      <CalloutBox type="success">
        Configuración cruzada: Oro + NASDAQ
      </CalloutBox>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          Diversificación = Supervivencia
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Sobrevivir es más importante que las ganancias
      </QuoteBlock>

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="es" />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Ahora que entiendes el riesgo,<br />
          aprendamos <Strong>c��mo funciona el algoritmo BUYLOW</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  id: () => (
    <>
      <Paragraph>
        Sekarang Anda memahami struktur <Strong>Emas</Strong> dan <Strong>NASDAQ</Strong>.
        Anda tahu keduanya naik jangka panjang.
      </Paragraph>

      <Paragraph>
        Tapi yang selanjutnya adalah <Accent>bagian terpenting</Accent>.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Saya bukan hanya penjual.<br />
        Saya akan berbicara secara realistis.
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Kejatuhan NASDAQ Historis</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="Grafik Kejatuhan NASDAQ Historis" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 COVID</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 Suku Bunga</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 Tarif</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 Krisis Keuangan</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 Dot-com</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Bahkan aset yang naik pun bisa jatuh
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Kebenaran Struktural</SectionTitle>

      <ChapterImage src={STRUCTURAL_TRUTH_IMAGE} alt="Kebenaran Struktural - Periode koreksi pada aset yang naik" />

      <SectionDivider />

      <SectionTitle>Kutukan Pemenang</SectionTitle>

      <QuoteBlock>
        Ketika profit menumpuk, orang pasti jadi lengah
      </QuoteBlock>

      <WarningBox>
        <Strong>Kejatuhan AKAN datang</Strong><br /><br />
        Mungkin 1 tahun lagi, atau 5 tahun lagi.<br />
        Tapi <Accent>pasti akan datang</Accent>.
      </WarningBox>

      <SectionDivider />

      <CalloutBox type="success">
        Setup Cross: Emas + NASDAQ
      </CalloutBox>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          Diversifikasi = Bertahan Hidup
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Bertahan lebih penting dari profit
      </QuoteBlock>

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="id" />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Sekarang setelah memahami risiko,<br />
          mari pelajari <Strong>cara kerja algoritma BUYLOW</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  th: () => (
    <>
      <Paragraph>
        ตอนนี้คุณเข้า���จโครงสร้างของ<Strong>ทองคำ</Strong>และ<Strong>NASDAQ</Strong>แล้ว
        คุณรู้ว่ามันขึ้นในระยะยาว
      </Paragraph>

      <Paragraph>
        แต่สิ่งที่จะมาถัดไปคือ<Accent>ส่วนที่สำคัญที่สุด</Accent>
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        ผมไม่ใช่แค่คนขาย<br />
        ผมจะพูด���ามความเป็นจริง
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>การร่วงของ NASDAQ ในประวัติศาสตร์</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="กราฟการร่วงของ NASDAQ ในประวัติศาสตร์" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 โควิด</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 ขึ้นดอกเบี้ย</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 ภาษีศุลกากร</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 วิกฤตการเงิน</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 Dot-com</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        แม้สินทรัพย์ขาขึ้นก็ร่วงได้
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>ความจริงเชิงโครงสร้าง</SectionTitle>

      <ChapterImage src={STRUCTURAL_TRUTH_IMAGE} alt="ความจริงเชิงโครงสร้าง - ช่วงปรับฐานของสินทรัพย์ขาขึ้น" />

      <SectionDivider />

      <SectionTitle>คำสาปผู้ชนะ</SectionTitle>

      <QuoteBlock>
        เมื่อกำไรสะ��ม ผู้คนย่อมหลงระเริงเสมอ
      </QuoteBlock>

      <WarningBox>
        <Strong>การร่วงจะมาถึง</Strong><br /><br />
        อาจเป็นอีก 1 ปีหรือ 5 ปี<br />
        แต่มัน<Accent>จะมาแน่นอน</Accent>
      </WarningBox>

      <SectionDivider />

      <CalloutBox type="success">
        Cross Setup: ทองคำ + NASDAQ
      </CalloutBox>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          กระจายความเสี่ยง = ���ยู่รอด
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        การอยู่รอดสำคัญกว่ากำไร
      </QuoteBlock>

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="th" />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          ตอนนี้คุณเข้าใจความเสี่ยงแล้ว<br />
          มาเรียนรู้<Strong>วิธีการทำงานของอัลกอริทึม BUYLOW</Strong> กัน
        </Paragraph>
      </HighlightBox>
    </>
  ),
  vi: () => (
    <>
      <Paragraph>
        Bây giờ bạn hiểu cấu trúc của <Strong>Vàng</Strong> và <Strong>NASDAQ</Strong>.
        Bạn biết chúng tăng dài hạn.
      </Paragraph>

      <Paragraph>
        Nhưng phần tiếp theo là <Accent>phần quan trọng nhất</Accent>.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Tôi không chỉ là người bán hàng.<br />
        Tôi sẽ nói thực tế.
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>C��c vụ sụp đổ NASDAQ lịch sử</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="Biểu đồ các vụ s���p đổ NASDAQ lịch sử" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 COVID</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 Tăng lãi suất</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 Thuế quan</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 Khủng hoảng tài chính</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 Dot-com</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Ngay cả tài sản tăng trưởng cũng sụp đổ
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Sự thật cấu trúc</SectionTitle>

      <ChapterImage src={STRUCTURAL_TRUTH_IMAGE} alt="Sự thật cấu trúc - Giai đoạn điều chỉnh của tài sản tăng trưởng" />

      <SectionDivider />

      <SectionTitle>Lời nguyền của người chiến thắng</SectionTitle>

      <QuoteBlock>
        Khi lợi nhuận tích lũy, người ta chắc chắn sẽ chủ quan
      </QuoteBlock>

      <WarningBox>
        <Strong>Sụp đổ SẼ đến</Strong><br /><br />
        Có thể là 1 năm hoặc 5 năm nữa.<br />
        Nhưng nó <Accent>chắc chắn sẽ đến</Accent>.
      </WarningBox>

      <SectionDivider />

      <CalloutBox type="success">
        Thiết lập chéo: Vàng + NASDAQ
      </CalloutBox>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          Đa dạng hóa = Sống sót
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Sống sót quan trọng hơn lợi nhuận
      </QuoteBlock>

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="vi" />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Bây giờ bạn hiểu rủi ro,<br />
          hãy tìm hiểu <Strong>cách thuật toán BUYLOW hoạt động</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  tr: () => (
    <>
      <Paragraph>
        Artık <Strong>Altın</Strong> ve <Strong>NASDAQ</Strong>&apos;ın yapısını anlıyorsunuz.
        Uzun vadede yükseldiğini biliyorsunuz.
      </Paragraph>

      <Paragraph>
        Ama bundan sonrası <Accent>en önemli kısım</Accent>.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Ben sadece bir satıcı değilim.<br />
        Gerçekçi konuşacağım.
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Tarihi NASDAQ Çöküşleri</SectionTitle>

      <ChapterImage src={NASDAQ_CRASH_IMAGE} alt="Tarihi NASDAQ Çöküşleri Grafiği" />

      <div className="my-8 grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2020 COVID</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-30.4%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2022 Faiz artışı</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-37%</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-foreground/50 mb-1">2025 Tarifeler</div>
          <div className="text-2xl md:text-3xl font-bold text-red-400">-27%</div>
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="bg-red-600/15 border border-red-500/40 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2008 Finansal Kriz</div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">-56%</div>
        </div>
        <div className="bg-red-700/20 border border-red-600/50 rounded-xl p-5 text-center">
          <div className="text-xs text-foreground/50 mb-1">2000 Dot-com</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">-80%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Yükselen varlıklar bile çöker
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Yapısal Gerçek</SectionTitle>

      <ChapterImage src={STRUCTURAL_TRUTH_IMAGE} alt="Yapısal Gerçek - Yükselen varlıklarda düzeltme dönemleri" />

      <SectionDivider />

      <SectionTitle>Kazananın Laneti</SectionTitle>

      <QuoteBlock>
        Kârlar biriktiğinde, insanlar kaçınılmaz olarak rehavete kapılır
      </QuoteBlock>

      <WarningBox>
        <Strong>Çöküş GELECEK</Strong><br /><br />
        1 yıl sonra veya 5 yıl sonra olabilir.<br />
        Ama <Accent>kesinlikle gelecek</Accent>.
      </WarningBox>

      <SectionDivider />

      <CalloutBox type="success">
        Çapraz Kurulum: Altın + NASDAQ
      </CalloutBox>

      <HighlightBox>
        <div className="text-center text-xl font-bold text-foreground">
          Çeşitlendirme = Hayatta Kalma
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Hayatta kalmak kârdan daha önemli
      </QuoteBlock>

      {/* Password reveal - mid-ebook location */}
      <PasswordMosaicReveal lang="tr" />

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Artık riski anlıyorsunuz,<br />
          <Strong>BUYLOW algoritmasının nasıl ��alıştığını</Strong> öğrenelim.
        </Paragraph>
      </HighlightBox>
    </>
  ),
}

// Chapter 3 Content: BUYLOW Quant 알고리즘 (Original Algorithm Explanation)
const BUYLOWAlgorithmContent = {
  ko: () => (
    <>
      {/* 1. 시작 - 오해 ��기 */}
      <QuoteBlock>
        나는 연 500% 수익을 목표로 이 시스템을 만들지 않았다
      </QuoteBlock>

      <CalloutBox type="info">
        지속 가능한 수익이 더 중요하다
      </CalloutBox>

      <SectionDivider />

      {/* 2. 복리의 힘 */}
      <SectionTitle>복리의 힘</SectionTitle>

      {/* Compound Interest Image - Language specific */}
      <img
        src={getCompoundImage("ko")}
        alt="복리의 힘"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs text-foreground/50 mb-2">연 30% 복리 | 15년</div>
          <div className="text-sm text-foreground/60 mb-1">1억 →</div>
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400">51억</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs text-foreground/50 mb-2">연 30% 복리 | 20년</div>
          <div className="text-sm text-foreground/60 mb-1">1억 →</div>
          <div className="text-3xl md:text-4xl font-bold text-cyan-400">190억</div>
        </div>
      </div>

      <QuoteBlock>
        복리가 모든 것을 결정한다
      </QuoteBlock>

      <SectionDivider />

      {/* 3. 현실 조언 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>작은 돈으로 시작해서 시스템을 만들어라</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 4. 잘못된 사용자 유형 */}
      <SectionTitle>잘못된 사용자 유형</SectionTitle>

      <WarningBox>
        <Strong>이런 사람은 반드시 망한다</Strong><br /><br />
        • 과도한 리스크 추구<br />
        • 다수 자산 무작위 운용<br />
        • 레버리지 과다 사용
      </WarningBox>

      <CalloutBox type="warning">
        단기 고수익 = 장기 파산
      </CalloutBox>

      <SectionDivider />

      {/* 5. 본론 진입 */}
      <Paragraph>
        이제 <Strong>BUYLOW 알고리즘</Strong>이 어떻게 작동하는지 이해해보자.
      </Paragraph>

      <SectionDivider />

      {/* 6. 핵심 5가지 원리 */}
      <SectionTitle id="core-logic">핵심 5가지 원리</SectionTitle>

      {/* 1~4번 이미지 카드: PC 2열, 모바일 1열 */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* 1번 카드 */}
        <div className="p-5 bg-black/30 border border-emerald-500/25 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-bold text-sm">1</span>
            </div>
            <div className="text-foreground font-medium">횡보장에서 수익</div>
          </div>
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
            alt="횡보장 수익 구조"
            className="w-full h-auto rounded-lg my-3"
          />
          <p className="text-foreground/70 text-sm">횡보 구간에서는 반복 매매를 통해 수익을 쌓는다.</p>
        </div>

        {/* 2번 카드 */}
        <div className="p-5 bg-black/30 border border-emerald-500/25 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-bold text-sm">2</span>
            </div>
            <div className="text-foreground font-medium">상승장에서 수익</div>
          </div>
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
            alt="상승장 수익 구조"
            className="w-full h-auto rounded-lg my-3"
          />
          <p className="text-foreground/70 text-sm">상승 구간에서는 추세를 따라가며 수익을 확대한다.</p>
        </div>

        {/* 3번 카드 */}
        <div className="p-5 bg-black/30 border border-cyan-500/25 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold text-sm">3</span>
            </div>
            <div className="text-foreground font-medium">하락 시 반등으로 방어</div>
          </div>
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
            alt="하락 방어 구조"
            className="w-full h-auto rounded-lg my-3"
          />
          <p className="text-foreground/70 text-sm">하락 시 기술적 반등을 활용해 손실을 방어한다.</p>
        </div>

        {/* 4번 카드 */}
        <div className="p-5 bg-black/30 border border-cyan-500/25 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold text-sm">4</span>
            </div>
            <div className="text-foreground font-medium">회복 시 수익 전환</div>
          </div>
          <img
            src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
            alt="회복 수익 전환"
            className="w-full h-auto rounded-lg my-3"
          />
          <p className="text-foreground/70 text-sm">회복 구간에서는 다시 수익 구간으로 전환한다.</p>
        </div>
      </div>

      {/* 5번 경고 카드 - 기존 유지 */}
      <div className="my-4">
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">원웨이 하락 = 유일한 손실 구간</div>
        </div>
      </div>

      <SectionDivider />

      {/* 7. 질문 유도 */}
      <CalloutBox type="info">
        왜 이런 구조가 가능한가?
      </CalloutBox>

      <SectionDivider />

      {/* 8. 횡보장설명 */}
      <SectionTitle>횡보장 수익 구조</SectionTitle>

      <Paragraph>
        횡보장에서는 <Strong>볼린저밴드</Strong> 기반으로 진입한다.
        가격이 밴드 하단에서 매수, 상단에서 매도하는 구조다.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>횡보 = 반복 수익 구조</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 9. 상승장 설명 */}
      <SectionTitle>상승장 수익 구조</SectionTitle>

      <CalloutBox type="success">
        상승 = 그대로 수익
      </CalloutBox>

      <Paragraph>
        상승장에서는 <Strong>추세 추종</Strong>으로 수익을 극대화한다.
        포지션을 유지하면서 상승을 따라간다.
      </Paragraph>

      <SectionDivider />

      {/* 10. 하락장 설명 - 마틴게일 */}
      <SectionTitle>하락장 방어 구조: 마틴게일</SectionTitle>

      {/* 마틴게일 이미지 2개 가로 배치 - 모바일에서도 2열 유지 */}
      <div className="grid grid-cols-2 gap-4 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="마틴게일 전략 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="마틴게일 전략 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <Paragraph>
        하락 시에는 <Strong>마틴게일</Strong> 전략을 사용한다.
        손실이 발생하면 진입 금액을 증가시켜 평균가를 낮춘다.
      </Paragraph>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-center text-sm text-foreground/50 mb-4">마틴게일 구조</div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">1</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">2</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">4</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">8</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">...</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>자본이 무한하면 승률 100%</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 11. 순환매 개념 */}
      <SectionTitle>순환매 개념</SectionTitle>

      {/* 순환매 개념 이미지 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/23%20(1).png"
        alt="순환매 개념"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-6 md:my-8"
      />

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">하락 시</div>
          <div className="text-xl font-bold text-red-400">매수</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">반등 시</div>
          <div className="text-xl font-bold text-emerald-400">매도</div>
        </div>
      </div>

      <CalloutBox type="info">
        수익이 아니라 리스크 관리 기술이다
      </CalloutBox>

      <SectionDivider />

      {/* 12. BUYLOW 알고리즘 핵심 */}
      <SectionTitle>BUYLOW 알고리즘 핵심</SectionTitle>

      {/* BUYLOW 알고리즘 핵심 이미지 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/39%20(1).png"
        alt="BUYLOW 알고리즘 핵심"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-6 md:my-8"
      />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>피보나치 기반 진입 / 청산</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-sm text-foreground/50 mb-3 text-center">매수 레벨</div>
          <div className="space-y-2 text-center">
            <div className="text-cyan-400 font-mono">1.236</div>
            <div className="text-cyan-400 font-mono">1.5</div>
            <div className="text-cyan-400 font-mono">1.618</div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
          <div className="text-sm text-foreground/50 mb-3 text-center">매도 레벨</div>
          <div className="space-y-2 text-center">
            <div className="text-amber-400 font-mono">0.764</div>
            <div className="text-amber-400 font-mono">0.618</div>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Password hint - mosaic reveal version */}
      <PasswordMosaicReveal lang="ko" />

      <SectionDivider />

      {/* 13. 위험 구조 */}
      <SectionTitle>유일한 위험 구조</SectionTitle>

      <WarningBox>
        <Strong>기술적 반등 없는 원웨이 하락</Strong><br /><br />
        이 구간에서는 어떤 알고리즘도 대응이 어렵다.
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-red-400">●</span>
            <span className="text-foreground/70">물량 묶임</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-red-400">●</span>
            <span className="text-foreground/70">손실 확대</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-red-400">●</span>
            <span className="text-foreground/70">회복 시간 필요</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 14. 실제 경험 사례 */}
      <SectionTitle>실제 경험: BTC 하락</SectionTitle>

      <Paragraph>
        비트코인 <Strong>-60% 원웨이 하락</Strong> 구간에서<br />
        리스크 관리만 하고 <Accent>수익은 없었다</Accent>.
      </Paragraph>

      <CalloutBox type="warning">
        이것이 비트코인의 한계
      </CalloutBox>

      <SectionDivider />

      {/* 15. 해결 구조 */}
      <SectionTitle>해결 구조</SectionTitle>

      {/* 해결 구조 이미지 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/31%20(1).png"
        alt="해결 구조"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-7 md:my-9"
      />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl font-bold text-foreground mb-2">
            N차 진입 초기화
          </div>
          <div className="text-foreground/60">
            과도한 진입 → 포지션 리셋으로 리스크 초기화
          </div>
        </div>
      </HighlightBox>

      <Paragraph>
        <Strong>핵심:</Strong> 손실을 인정하고 리스크를 리셋한 후,<br />
        회복 구간에서 다시 수익을 추구한다.
      </Paragraph>

      <SectionDivider />

      {/* 16. 금 vs BTC 비교 */}
      <SectionTitle>금 vs BTC 비교</SectionTitle>

      <ComparisonBox
        leftTitle="금 (GOLD)"
        leftItems={[
          "반등 있음",
          "하방 제한",
          "구조적 안전",
          "BUYLOW 최적화",
        ]}
        rightTitle="비트코인 (BTC)"
        rightItems={[
          "원웨이 가능",
          "하방 무제한",
          "사이클 의존",
          "타이밍 필수",
        ]}
        lang="ko"
      />

      <SectionDivider />

      {/* 17. ��심 ���론 */}
      <QuoteBlock>
        자산 선택이 알고리즘보다 중요하다
      </QuoteBlock>

      <SectionDivider />

      {/* 18. 최종 정리 */}
      <SectionTitle>최종 정리</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">횡보</div>
          <div className="font-bold text-emerald-400">수익</div>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">상승</div>
          <div className="font-bold text-emerald-400">수익</div>
        </div>
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">반등</div>
          <div className="font-bold text-cyan-400">방어</div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">원웨이</div>
          <div className="font-bold text-red-400">위험</div>
        </div>
      </div>

      <SectionDivider />

      {/* 19. 다음 챕터  */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          알고리즘을 이해했다면,<br />
          이제 <Strong>자산별 적합성</Strong>을 확인해보자.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  en: () => (
    <>
      <QuoteBlock>
        I didn&apos;t build this system to target 500% annual returns
      </QuoteBlock>

      <CalloutBox type="info">
        Sustainable returns are more important
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>The Power of Compound Interest</SectionTitle>

      <img
        src={getCompoundImage("en")}
        alt="The Power of Compound Interest"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs text-foreground/50 mb-2">30% Annual | 15 Years</div>
          <div className="text-sm text-foreground/60 mb-1">$100K →</div>
          <div className="text-3xl md:text-4xl font-bold text-emerald-400">$5.1M</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs text-foreground/50 mb-2">30% Annual | 20 Years</div>
          <div className="text-sm text-foreground/60 mb-1">$100K →</div>
          <div className="text-3xl md:text-4xl font-bold text-cyan-400">$19M</div>
        </div>
      </div>

      <QuoteBlock>
        Compound interest determines everything
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Start small and build your system</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Wrong User Types</SectionTitle>

      <WarningBox>
        <Strong>These types will definitely fail</Strong><br /><br />
        • Excessive risk seeking<br />
        • Random multi-asset operation<br />
        • Excessive leverage
      </WarningBox>

      <CalloutBox type="warning">
        Short-term high returns = Long-term bankruptcy
      </CalloutBox>

      <SectionDivider />

      <SectionTitle id="core-logic">5 Core Principles</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Profit in sideways markets</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Profit in bull markets</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Defense through rebounds in decline</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Profit conversion in recovery</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">One-way decline = Only loss zone</div>
        </div>
      </div>

      <SectionDivider />

      <CalloutBox type="info">
        Why is this structure possible?
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Sideways Market Profit Structure</SectionTitle>

      <Paragraph>
        In sideways markets, entry is based on <Strong>Bollinger Bands</Strong>.
        Buy at the lower band, sell at the upper band.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>Sideways = Repeated profit structure</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Bull Market Profit Structure</SectionTitle>

      <CalloutBox type="success">
        Uptrend = Just profit
      </CalloutBox>

      <SectionDivider />

      {/* Martingale/Rotation structure image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/43%20(1).png"
        alt="Martingale/Rotation Structure"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-[10px] my-6 md:my-7"
      />

      <SectionTitle>Bear Market Defense: Martingale</SectionTitle>

      {/* Martingale images - 2 side by side, stays 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-4 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="Martingale Strategy 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="Martingale Strategy 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-center text-sm text-foreground/50 mb-4">Martingale Structure</div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">1</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">2</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">4</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">8</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>With infinite capital, win rate is 100%</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Rotation Trading Concept</SectionTitle>

      {/* Rotation Trading Concept image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/23%20(1).png"
        alt="Rotation Trading Concept"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-6 md:my-8"
      />

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">On Decline</div>
          <div className="text-xl font-bold text-red-400">BUY</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">On Rebound</div>
          <div className="text-xl font-bold text-emerald-400">SELL</div>
        </div>
      </div>

      <CalloutBox type="info">
        It&apos;s a risk management technique, not profit generation
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>BUYLOW Algorithm Core</SectionTitle>

      {/* BUYLOW Algorithm Core image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/39%20(1).png"
        alt="BUYLOW Algorithm Core"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-6 md:my-8"
      />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>Fibonacci-based Entry / Exit</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-sm text-foreground/50 mb-3 text-center">Buy Levels</div>
          <div className="space-y-2 text-center">
            <div className="text-cyan-400 font-mono">1.236</div>
            <div className="text-cyan-400 font-mono">1.5</div>
            <div className="text-cyan-400 font-mono">1.618</div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
          <div className="text-sm text-foreground/50 mb-3 text-center">Sell Levels</div>
          <div className="space-y-2 text-center">
            <div className="text-amber-400 font-mono">0.764</div>
            <div className="text-amber-400 font-mono">0.618</div>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>The Only Risk Structure</SectionTitle>

      <WarningBox>
        <Strong>One-way decline without technical rebounds</Strong><br /><br />
        No algorithm can handle this zone.
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Gold vs BTC Comparison</SectionTitle>

      <ComparisonBox
        leftTitle="Gold"
        leftItems={[
          "Has rebounds",
          "Limited downside",
          "Structurally safe",
          "BUYLOW optimized",
        ]}
        rightTitle="Bitcoin"
        rightItems={[
          "One-way possible",
          "Unlimited downside",
          "Cycle dependent",
          "Timing required",
        ]}
        lang="en"
      />

      <SectionDivider />

      <QuoteBlock>
        Asset selection is more important than the algorithm
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Final Summary</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">Sideways</div>
          <div className="font-bold text-emerald-400">Profit</div>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">Uptrend</div>
          <div className="font-bold text-emerald-400">Profit</div>
        </div>
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">Rebound</div>
          <div className="font-bold text-cyan-400">Defense</div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">One-way</div>
          <div className="font-bold text-red-400">Risk</div>
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Now that you understand the algorithm,<br />
          let&apos;s check <Strong>asset suitability</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  zh: () => (
    <>
      <QuoteBlock>
        我开发这个系统不是为了追求500%的年收益
      </QuoteBlock>

      <CalloutBox type="info">
        可持续收益更重要
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>复利的力量</SectionTitle>

      <img
        src={getCompoundImage("zh")}
        alt="复利的力量"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        复利决定一切
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>从小资金开始，建立你的系统</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5个核心原则</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">横盘市场盈��</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">牛市盈利</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">下跌时通过反弹防御</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">恢复并转为盈利</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">单边下跌 = 唯一亏损区间</div>
        </div>
      </div>

      <SectionDivider />

      <WarningBox>
        <Strong>无技术反弹的��边下跌</Strong><br /><br />
        任何算法都难以应对这种情况。
      </WarningBox>

      <QuoteBlock>
        资产选择比算法更重要
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          现在你理解了算法，<br />
          让我们检查<Strong>资产适合性</Strong>。
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ar: () => (
    <>
      <QuoteBlock>
        لم أبنِ هذا النظام لاستهداف عوائد سنوية 500%
      </QuoteBlock>

      <CalloutBox type="info">
        العوائد المستدامة أهم
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>قوة الفائدة المركبة</SectionTitle>

      <img
        src={getCompoundImage("ar")}
        alt="قوة الفائدة المركبة"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        الفائدة المركبة تحدد كل شيء
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>ابدأ صغيراً وابنِ نظامك</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 مبادئ أساسية</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">الربح في الأسواق الجانبية</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">الربح في الأسواق الصاعدة</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">الدفاع عبر الارتدادات في الهبوط</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">تحويل الربح في التعافي</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">الهبوط أحادي الاتجاه = منطقة الخسارة ا��وحيدة</div>
        </div>
      </div>

      <SectionDivider />

      {/* صور مارتينجيل - 2 جنبًا إلى جنب، تبقى عمودين على الجوال */}
      <div className="grid grid-cols-2 gap-4 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="استراتيجية مارتينجيل 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="استراتيجية مارتينج��ل 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <WarningBox>
        <Strong>هبوط أحادي الاتجاه بدون ارتدادات تقنية</Strong><br /><br />
        لا يمكن لأي خوارزمية التعامل مع هذه المنطقة.
      </WarningBox>

      <QuoteBlock>
        اختيار الأصول أهم من الخوارزمية
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          الآن بعد فهم الخوارزمية،<br />
          لنتحقق من <Strong>ملاءمة الأصول</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ru: () => (
    <>
      <QuoteBlock>
        Я не создавал эту систему ради 500% годовой прибыли
      </QuoteBlock>

      <CalloutBox type="info">
        Устойчивая прибыль важнее
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Сила сложного процента</SectionTitle>

      <img
        src={getCompoundImage("ru")}
        alt="Сила сложного процента"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        Сложный процент определяет всё
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Начните с малого и постройте систему</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 ключевых принципов</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Прибыль на бо��овом рынке</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Прибыль на бычьем рынке</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Защита через отскоки при падении</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Переход к прибыли при восстановлении</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Однонаправленное падение = Единственная зона убытков</div>
        </div>
      </div>

      <SectionDivider />

      {/* Изображения Мартингейла - 2 в ряд, сохраняется на мобильных */}
      <div className="grid grid-cols-2 gap-4 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="Стратегия Мартингейла 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="Стратегия Мартингейла 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <WarningBox>
        <Strong>Однонаправленное падение без тех. отскоков</Strong><br /><br />
        Никакой алгоритм не справится с этой зоной.
      </WarningBox>

      <QuoteBlock>
        Выбор актива важнее алгоритма
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Поняв алгоритм,<br />
          проверим <Strong>совместимость активов</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  es: () => (
    <>
      <QuoteBlock>
        No construí este sistema para obtener 500% de retornos anuales
      </QuoteBlock>

      <CalloutBox type="info">
        Los retornos sostenibles son más importantes
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>El poder del interés compuesto</SectionTitle>

      <img
        src={getCompoundImage("es")}
        alt="El poder del interés compuesto"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        El interés compuesto lo determina todo
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Comienza pequeño y construye tu sistema</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 principios fundamentales</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Ganancias en mercados laterales</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Ganancias en mercados alcistas</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Defensa mediante rebotes en caídas</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Conversión a ganancias en recuperación</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Caída unidireccional = Única zona de pérdidas</div>
        </div>
      </div>

      <SectionDivider />

      {/* Imágenes de Martingala - 2 en fila, se mantienen 2 columnas en móvil */}
      <div className="grid grid-cols-2 gap-4 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="Estrategia Martingala 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="Estrategia Martingala 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <WarningBox>
        <Strong>Caída unidireccional sin rebotes técnicos</Strong><br /><br />
        Ningún algoritmo puede manejar esta zona.
      </WarningBox>

      <QuoteBlock>
        La selección de activos es más importante que el algoritmo
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Ahora que entiendes el algoritmo,<br />
          verifiquemos <Strong>la idoneidad de los activos</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  id: () => (
    <>
      <QuoteBlock>
        Saya tidak membangun sistem ini untuk menargetkan return 500% per tahun
      </QuoteBlock>

      <CalloutBox type="info">
        Return berkelanjutan lebih penting
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Kekuatan Bunga Majemuk</SectionTitle>

      <img
        src={getCompoundImage("id")}
        alt="Kekuatan Bunga Majemuk"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        Bunga majemuk menentukan segalanya
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Mulai kecil dan bangun sistem Anda</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 Prinsip Inti</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Profit di pasar sideways</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Profit di bull market</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Pertahanan melalui rebound saat penurunan</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Konversi profit saat pemulihan</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Penurunan satu arah = Zona kerugian satu-satunya</div>
        </div>
      </div>

      <SectionDivider />

      {/* Gambar Martingale - 2 berdampingan, tetap 2 kolom di mobile */}
      <div className="grid grid-cols-2 gap-4 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="Strategi Martingale 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="Strategi Martingale 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <WarningBox>
        <Strong>Penurunan satu arah tanpa rebound teknis</Strong><br /><br />
        Tidak ada algoritma yang bisa menangani zona ini.
      </WarningBox>

      <QuoteBlock>
        Pemilihan aset lebih penting dari algoritma
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Sekarang setelah memahami algoritma,<br />
          mari periksa <Strong>kesesuaian aset</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  th: () => (
    <>
      <QuoteBlock>
        ผมไม่ได้สร้างระบบนี้เพื่อผลตอบแทน 500% ต่อปี
      </QuoteBlock>

      <CalloutBox type="info">
        ผลตอบแทนที่ยั่งยืนสำคัญกว่า
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>พลังของดอกเบี้ยทบต้น</SectionTitle>

      <img
        src={getCompoundImage("th")}
        alt="พลังของดอกเบี้ยทบต้น"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        ดอกเบี้ยท���ต้นตัดสินทุกอย่าง
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>เริ่มจาก���ล็กๆ และสร้างระบบของคุณ</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 หลักการหลัก</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">กำไรในตลาด Sideways</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">กำไรในตลาดขาขึ้น</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">ป้องกันผ่านการดีดตัวเมื่อตก</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">เปลี่ยนเป็นกำไรเมื่อฟื้นตัว</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">ตกทางเดียว = โซนขาดทุนเดียว</div>
        </div>
      </div>

      <SectionDivider />

      {/* Martingale images - 2 side by side */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="กลยุทธ์มาร์ติงเกล 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="กลยุทธ์มาร์ติงเกล 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <WarningBox>
        <Strong>ตกทางเดียวโดยไม่มีการดีดตัวทางเทคนิค</Strong><br /><br />
        ไม่มีอัลกอริทึมใดรับมือโซนนี้ได้
      </WarningBox>

      <QuoteBlock>
        การเลือกสินทรัพย์สำคัญกว่าอัลกอริทึม
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          ตอนนี้เข้าใจอัลกอริทึมแล้ว<br />
          มาตรวจสอบ<Strong>ความเหมาะสม��องสินทรัพย์</Strong>กัน
        </Paragraph>
      </HighlightBox>
    </>
  ),
  vi: () => (
    <>
      <QuoteBlock>
        Tôi không xây dựng hệ thống này để nhắm đến lợi nhuận 500% mỗi năm
      </QuoteBlock>

      <CalloutBox type="info">
        Lợi nhuận bền vững quan trọng hơn
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Sức mạnh của lãi kép</SectionTitle>

      <img
        src={getCompoundImage("vi")}
        alt="Sức mạnh của lãi kép"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        Lãi kép quyết định mọi thứ
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Bắt đầu nhỏ và xây dựng hệ thống của bạn</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 Nguyên tắc cốt lõi</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Lợi nhuận trong thị trường đi ngang</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Lợi nhuận trong thị trường tăng</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Phòng thủ qua phục hồi khi giảm</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Chuyển đổi lợi nhuận khi hồi phục</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Giảm một chiều = Vùng thua lỗ duy nhất</div>
        </div>
      </div>

      <SectionDivider />

      {/* Martingale images - 2 side by side */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="Chiến lược Martingale 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="Chiến lược Martingale 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <WarningBox>
        <Strong>Giảm một chiều không có phục hồi kỹ thuật</Strong><br /><br />
        Không thuật toán nào xử lý được vùng này.
      </WarningBox>

      <QuoteBlock>
        Lựa chọn tài sản quan trọng hơn thuật toán
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Giờ bạn đã hiểu thuật toán,<br />
          hãy kiểm tra <Strong>sự phù hợp của tài sản</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  tr: () => (
    <>
      <QuoteBlock>
        Bu sistemi yıllık %500 getiri hedeflemek için yapmadım
      </QuoteBlock>

      <CalloutBox type="info">
        Sürdürülebilir getiriler daha önemli
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Bileşik Faizin Gücü</SectionTitle>

      <img
        src={getCompoundImage("tr")}
        alt="Bileşik Faizin Gücü"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        Bileşik faiz her şeyi belirler
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Küçük başla ve sistemini kur</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 Temel Prensip</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Yatay piyasalarda kar</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Boğa piyasalarında kar</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Düşüşte toparlanmalarla savunma</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Toparlanmada kar dönüşümü</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Tek yönlü düşüş = Tek kayıp bölgesi</div>
        </div>
      </div>

      <SectionDivider />

      {/* Martingale images - 2 side by side */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="Martingale Stratejisi 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="Martingale Stratejisi 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <WarningBox>
        <Strong>Teknik toparlanma olmadan tek yönlü düşüş</Strong><br /><br />
        Hiçbir algoritma bu bölgeyi idare edemez.
      </WarningBox>

      <QuoteBlock>
        Varlık seçimi algoritmadan daha önemli
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Artık algoritmayı anladığınıza göre,<br />
          <Strong>varlık uygunluğunu</Strong> kontrol edelim.
        </Paragraph>
      </HighlightBox>
    </>
  ),
}

// Chapter 4 Content: BUYLOW QUANT (R-R) 알고리즘
const RRAlgorithmContent = {
  ko: () => (
    <>
      {/* 1. 소챕터 1: 왜 이런 구조가 가능한가 */}
      <SectionTitle className="text-2xl md:text-3xl">왜 이런 구조가 가능한가?</SectionTitle>

      <SectionDivider />

      {/* 마틴게일/순환매 설명 이미지 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/43%20(1).png"
        alt="마틴게일/순환매 구조"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-[10px] my-6 md:my-7"
      />

      {/* 마틴게일 / 순환매 - 카드 2개 */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 카드 1: 마틴게일 */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold text-lg mb-3 text-center">하락장 방어구조: 마틴게일</div>
          <div className="text-foreground/90 leading-relaxed space-y-3">
            <p>하락 시에는 <Strong>마틴게일 전략</Strong>을 사용한다.</p>
            <p>손실이 발생 시 진입금액을 증가시켜 평균 단가를 맞춘다.</p>
          </div>
        </div>

        {/* 카드 2: 순환매 */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-cyan-400 font-bold text-lg mb-3 text-center">순환매 (Rotation)</div>
          <div className="text-foreground/90 leading-relaxed space-y-3">
            <p>평균회귀 원칙에 따라 차트는 기술적 반등을 만든다.</p>
            <p><Strong>R-R 순환매 알고리즘</Strong>에 따라 기술적 반등 시<br />매수 물량을 정리해서 리스크를 관리한다.</p>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 피보나치 기반 강조 박스 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg md:text-xl">
          <Strong>R-R Strategy 알고리즘</Strong>은<br />
          <Accent>황금비율이라고 불리는 피보나치</Accent> 기반으로 설계되었다.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 2. 소챕터 2: BUYLOW AI (R.R 3.0) 작동 원리 */}
      <SectionTitle className="text-2xl md:text-3xl">BUYLOW AI (R.R 3.0) 작동 원리</SectionTitle>

      <Paragraph>
        BUYLOW AI (R.R 3.0)을 이해하기 위해서는<br />
        프로그램 알고리즘에 대한 이해가 필요하다.
      </Paragraph>

      <Paragraph>
        기본적인 설명은 책에서 다루지만,<br />
        자세한 알고리즘이 궁금하다면<br />
        아래 홈페이지 &quot;전략 기능&quot;에서 확인할 수 있다.
      </Paragraph>

      {/* 전략 기능 버튼 */}
      <StrategyButton lang="ko" />

      <SectionDivider />

      <QuoteBlock>
        먼저 지금 이 책을 보고 있다면<br />
        정말 운이 좋은 것이다.
      </QuoteBlock>

      {/* 자산 분산화 텔레그램 이미지 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_tellegram2/en3.jpg"
        alt="BUYLOW AI Asset Diversification"
        className="block mx-auto my-7 md:my-9 max-w-[420px] w-full h-auto rounded-[14px] shadow-[0_8px_24px_rgba(0,255,200,0.15)]"
      />

      <Paragraph>
        BUYLOW AI (R.R 3.0) 버전부터 <Strong>자산 분산화 시스템</Strong>이 구현되었기 때문이다.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>BUYLOW AI 봇은 아래와 같은 순서로 작동한다.</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 최�� 구동액 박스 */}
      <SectionTitle>최소 구동액</SectionTitle>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BTC */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
          <div className="text-amber-400 font-bold text-lg mb-3 text-center">BTC</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-2">3000 USDT</div>
            <div className="text-sm text-foreground/60">*레버리지 포함 마진</div>
          </div>
          <div className="mt-4 text-sm text-foreground/70 space-y-1">
            <p className="text-emerald-400">EX) 300 USDT × 10배 → 가능</p>
            <p className="text-emerald-400">EX) 3000 USDT × 1배 → 가능</p>
            <p className="text-red-400">EX) 1000 USDT × 2배 → 불가능</p>
            <p className="text-foreground/50 text-xs">→ 1000 × 2 &lt; 3000</p>
          </div>
        </div>

        {/* 나머지 자산 */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold text-lg mb-3 text-center">나머지 자산</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-2">1000 USDT</div>
            <div className="text-sm text-foreground/60">최소 구동액</div>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 매수 → 매도 흐름 미리보기 */}
      <SectionTitle>R-R 퀀트 [매수 → 매도] 흐름 미리보기</SectionTitle>

      {/* 텔레그램 미리보기 이미지 2개 - PC: 2열, 모바일: 1열 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-[960px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_tellegram2/en9.jpg"
          alt="R-R Quant Buy Flow Preview"
          className="w-full h-auto block rounded-xl shadow-[0_8px_24px_rgba(0,255,200,0.12)]"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_tellegram2/en15.jpg"
          alt="R-R Quant Sell Flow Preview"
          className="w-full h-auto block rounded-xl shadow-[0_8px_24px_rgba(0,255,200,0.12)]"
        />
      </div>

      {/* 1차 매수 설명 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/rr-flow-1.png"
        alt="R-R 퀀트 매수 흐름"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <Paragraph>
        차트가 <Strong>볼린저 밴드를 이탈</Strong>하면<br />
        프로그램이 <Accent>1차 매수</Accent>를 시작한다.
      </Paragraph>

      <Paragraph>
        사용자는 봇에서 <Strong>진입 규모</Strong>를 설정할 수 있다.
      </Paragraph>

      <div className="my-6 flex flex-wrap justify-center gap-2">
        {["0.3%", "0.5%", "0.7%", "0.9%", "1.1%", "1.3%", "1.5%"].map((val) => (
          <div key={val} className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono text-sm">
            {val}
          </div>
        ))}
      </div>

      <SectionDivider />

      {/* 2차~5차 매수 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/rr-flow-2.png"
        alt="R-R 퀀트 매수 흐름 2"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <Paragraph>
        차트 하락 시<br />
        <Strong>2차, 3차, 4차, 5차</Strong> 매수가 진행된다.
      </Paragraph>

      <div className="my-6 bg-foreground/5 border border-foreground/20 rounded-xl p-5">
        <div className="text-center text-foreground/60 text-sm mb-4">변동률 30% 기준</div>
        <div className="space-y-2 text-center font-mono">
          <p>2차 = 1차 × 30%</p>
          <p>3차 = 1차 × 60%</p>
          <p>4차 = 1차 × 90%</p>
          <p>5차 = 1차 × 90%</p>
        </div>
        <div className="mt-4 pt-4 border-t border-foreground/10 text-center">
          <div className="text-foreground/60 text-sm mb-2">예:</div>
          <p className="text-foreground">진입 0.5% / 변동률 50%</p>
          <p className="text-cyan-400">→ 2차 진입 = 0.5% × 50%</p>
        </div>
      </div>

      <SectionDivider />

      {/* R-R 퀀트 진입 전략 A/B/C */}
      <SectionTitle>R-R 퀀트 진입 전략</SectionTitle>

      {/* 설명 텍스트 */}
      <Paragraph>
        R-R 퀀트 진입 전략은 <Strong>A, B, C 타입</Strong>으로 구성되어 있으며,<br />
        각 타입은 시장 변동성과 피보나치 구간 크기에 따라<br />
        <Accent>진입 강도와 빈도</Accent>가 다르게 설계되어 있다.
      </Paragraph>

      <Paragraph>
        이 전략은 기존 AI 자동 진입 구조를 기반으로 하되,<br />
        사용자가 시장 상황에 맞게 선택할 수 있도록 재구성된 것이다.
      </Paragraph>

      <SectionDivider />

      {/* A/B/C 타입 카드 - 상세 */}
      <div className="my-8 space-y-6">
        {/* A 타입 */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
          <div className="text-center mb-4">
            <div className="text-emerald-400 font-bold text-2xl mb-1">A 타입</div>
            <div className="text-foreground/50 text-sm">진입 빈도 낮음</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-emerald-400 font-mono font-bold text-lg">1.236</div>
              <div className="text-foreground/60 text-sm mt-1">2% 이상</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-emerald-400 font-mono font-bold text-lg">1.382</div>
              <div className="text-foreground/60 text-sm mt-1">1.5% ~ 2%</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-emerald-400 font-mono font-bold text-lg">1.5</div>
              <div className="text-foreground/60 text-sm mt-1">1% ~ 1.5%</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-emerald-400 font-mono font-bold text-lg">1.618</div>
              <div className="text-foreground/60 text-sm mt-1">1% 이하</div>
            </div>
          </div>
        </div>

        {/* B 타입 */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
          <div className="text-center mb-4">
            <div className="text-cyan-400 font-bold text-2xl mb-1">B 타입</div>
            <div className="text-foreground/50 text-sm">진입 빈도 중간</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-cyan-400 font-mono font-bold text-lg">1.236</div>
              <div className="text-foreground/60 text-sm mt-1">1.5% 이상</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-cyan-400 font-mono font-bold text-lg">1.382</div>
              <div className="text-foreground/60 text-sm mt-1">1.25% ~ 1.5%</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-cyan-400 font-mono font-bold text-lg">1.5</div>
              <div className="text-foreground/60 text-sm mt-1">1% ~ 1.25%</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-cyan-400 font-mono font-bold text-lg">1.618</div>
              <div className="text-foreground/60 text-sm mt-1">1% 이하</div>
            </div>
          </div>
        </div>

        {/* C 타입 */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="text-center mb-4">
            <div className="text-amber-400 font-bold text-2xl mb-1">C 타입</div>
            <div className="text-foreground/50 text-sm">진입 빈도 높음</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-amber-400 font-mono font-bold text-lg">1.236</div>
              <div className="text-foreground/60 text-sm mt-1">1.25% 이상</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-amber-400 font-mono font-bold text-lg">1.382</div>
              <div className="text-foreground/60 text-sm mt-1">1% ~ 1.25%</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-amber-400 font-mono font-bold text-lg">1.5</div>
              <div className="text-foreground/60 text-sm mt-1">0.75% ~ 1%</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-amber-400 font-mono font-bold text-lg">1.618</div>
              <div className="text-foreground/60 text-sm mt-1">0.75% 이하</div>
            </div>
          </div>
        </div>
      </div>

      {/* 해석 설명 */}
      <HighlightBox>
        <Paragraph className="mb-4 text-center">
          피보나치 구간 값이 <Strong>작을수록</Strong><br />
          차트 하락 대비 <Accent>더 많은 진입</Accent>이 발생하게 된다.
        </Paragraph>
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <span className="font-bold">A 타입</span>
            <span className="text-foreground/50">→</span>
            <span className="text-foreground/70 text-sm">진입 횟수 적음 → 리스크 낮음 → 수익 낮음</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-cyan-400">
            <span className="font-bold">B 타입</span>
            <span className="text-foreground/50">→</span>
            <span className="text-foreground/70 text-sm">중간</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <span className="font-bold">C 타입</span>
            <span className="text-foreground/50">→</span>
            <span className="text-foreground/70 text-sm">진입 횟수 많음 → 리스크 높음 → 수익 높음</span>
          </div>
        </div>
      </HighlightBox>

      {/* 경고 문구 - 중앙 정렬 */}
      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-lg p-6 md:p-8 flex flex-col items-center justify-center text-center">
        <span className="text-red-400 text-xl mb-3">⚠️</span>
        <div className="text-red-300/90 text-base md:text-lg leading-relaxed space-y-2 mx-auto">
          <div className="font-bold text-lg">우리는 특정 전략을 추천하지 않는다.</div>
          <div className="text-foreground/70">
            사용자가 시장 상황을 이해하고<br />
            각 전략의 특성을 고려하여<br />
            <Strong>직접 선택</Strong>해야 한다.
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* R-R 익절 알고리즘 */}
      <SectionTitle>R-R 익절 알고리즘</SectionTitle>

      <div className="my-6 bg-foreground/5 border border-foreground/20 rounded-xl p-5">
        <div className="text-center text-foreground/60 text-sm mb-4">익절 값:</div>
        <div className="flex justify-center gap-6 font-mono text-xl">
          <span className="text-emerald-400">0.764</span>
          <span className="text-cyan-400">0.618</span>
          <span className="text-amber-400">0.5</span>
        </div>
      </div>

      <Paragraph className="text-center">
        값이 낮아질수록 → <Strong>수익률 증가</Strong><br />
        하지만 → <Accent>리스크 증가</Accent>
      </Paragraph>

      {/* 하락 추세 경고 - 중앙 정렬 */}
      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-lg p-6 md:p-8 flex flex-col items-center justify-center text-center">
        <span className="text-red-400 text-xl mb-3">⚠️</span>
        <div className="text-red-300/90 text-base md:text-lg leading-relaxed mx-auto">
          <Strong>하락 추세에서</Strong><br /><br />
          익절값이 높으면<br />
          → 탈출 기회 감소<br />
          → 리스크 증가
        </div>
      </div>

      <SectionDivider />

      {/* 리스크 경고 - 빨간 박스 */}
      <div className="my-8 bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6">
        <div className="text-red-400 font-bold text-xl mb-4 text-center">⚠️ 다시 강조한다</div>
        <div className="text-foreground/90 leading-relaxed space-y-4">
          <p className="text-center font-bold text-lg">
            이 프로그램은 <Accent>수익을 보장하지 않는다</Accent>.
          </p>
          <p className="text-center">
            R-R 전략을 자동화한 도구일 뿐이다.
          </p>
          <p className="text-center">
            차트 상황에 따라<br />
            <Strong>전략을 유연하게 사용하는 것이 중요하다</Strong>.
          </p>
          <p className="text-center text-foreground/70">
            오히려 모든 규칙을 지킬 수 있다면<br />
            손매매가 더 나을 수도 있다.
          </p>
          <p className="text-center text-foreground/70">
            프로그램은 자동화라는 장점을 제공하지만<br />
            API 오류, 서버 오류 등<br />
            예상치 못한 문제가 발생할 수 있다.
          </p>
          <p className="text-center font-bold text-red-400">
            완벽한 시스템이라고 생각하지 말아야 한다.
          </p>
        </div>
      </div>

      <SectionDivider />

      {/* 다음 챕터 유도 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          R-R 알고리즘을 이해했다면,<br />
          더 깊이 이해해보자
        </Paragraph>
      </HighlightBox>
    </>
  ),
  // Translated versions for other languages
  en: () => (
    <>
      {/* English version */}
      <SectionTitle className="text-2xl md:text-3xl">Why is This Structure Possible?</SectionTitle>

      <SectionDivider />

      {/* Martingale/Rotation structure image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/43%20(1).png"
        alt="Martingale/Rotation Structure"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-[10px] my-6 md:my-7"
      />

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-red-400 font-bold text-lg mb-3 text-center">Bear Market Defense: Martingale</div>
          <div className="text-foreground/90 leading-relaxed space-y-3">
            <p>During declines, we use the <Strong>Martingale strategy</Strong>.</p>
            <p>When losses occur, we increase entry amounts to average down the cost basis.</p>
          </div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-cyan-400 font-bold text-lg mb-3 text-center">Rotation</div>
          <div className="text-foreground/90 leading-relaxed space-y-3">
            <p>According to mean reversion principles, charts create technical rebounds.</p>
            <p>The <Strong>R-R Rotation Algorithm</Strong> manages risk by clearing buy positions during technical rebounds.</p>
          </div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg md:text-xl">
          <Strong>R-R Strategy Algorithm</Strong> is designed based on<br />
          <Accent>Fibonacci, known as the golden ratio</Accent>.
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle className="text-2xl md:text-3xl">BUYLOW AI (R.R 3.0) Operating Principles</SectionTitle>

      <Paragraph>
        To understand BUYLOW AI (R.R 3.0),<br />
        you need to understand the program algorithm.
      </Paragraph>

      <StrategyButton lang="en" />

      <QuoteBlock>
        If you&apos;re reading this book right now,<br />
        you&apos;re really lucky.
      </QuoteBlock>

      {/* Asset diversification telegram image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_tellegram2/en3.jpg"
        alt="BUYLOW AI Asset Diversification"
        className="block mx-auto my-7 md:my-9 max-w-[420px] w-full h-auto rounded-[14px] shadow-[0_8px_24px_rgba(0,255,200,0.15)]"
      />

      <Paragraph>
        Asset diversification system has been implemented since BUYLOW AI (R.R 3.0).
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Minimum Operating Amount</SectionTitle>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
          <div className="text-amber-400 font-bold text-lg mb-3 text-center">BTC</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-2">3000 USDT</div>
            <div className="text-sm text-foreground/60">*Including leverage margin</div>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold text-lg mb-3 text-center">Other Assets</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-2">1000 USDT</div>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>R-R Quant Entry Strategy</SectionTitle>

      <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-emerald-400 font-bold text-xl mb-2">Strategy A</div>
          <div className="text-foreground/70 text-sm">Fibonacci 1.236</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-cyan-400 font-bold text-xl mb-2">Strategy B</div>
          <div className="text-foreground/70 text-sm">Fibonacci 1.5</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-amber-400 font-bold text-xl mb-2">Strategy C</div>
          <div className="text-foreground/70 text-sm">Fibonacci 1.618</div>
        </div>
      </div>

      <div className="my-8 bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6">
        <div className="text-red-400 font-bold text-xl mb-4 text-center">⚠️ Important Warning</div>
        <div className="text-foreground/90 leading-relaxed space-y-4 text-center">
          <p className="font-bold text-lg">This program does <Accent>NOT guarantee profits</Accent>.</p>
          <p>It&apos;s just a tool that automates the R-R strategy.</p>
          <p className="text-red-400 font-bold">Don&apos;t think of it as a perfect system.</p>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Now that you understand the R-R algorithm,<br />
          let&apos;s dive deeper.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  zh: () => (
    <>
      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Profit in sideways markets</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Profit in bull markets</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Defense through rebounds in decline</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Profit conversion in recovery</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">One-way decline = Only loss zone</div>
        </div>
      </div>

      <SectionDivider />

      <CalloutBox type="info">
        Why is this structure possible?
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Sideways Market Profit Structure</SectionTitle>

      <Paragraph>
        In sideways markets, entry is based on <Strong>Bollinger Bands</Strong>.
        Buy at the lower band, sell at the upper band.
      </Paragraph>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>Sideways = Repeated profit structure</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Bull Market Profit Structure</SectionTitle>

      <CalloutBox type="success">
        Uptrend = Just profit
      </CalloutBox>

      <SectionDivider />

      {/* Martingale/Rotation structure image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/43%20(1).png"
        alt="Martingale/Rotation Structure"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-[10px] my-6 md:my-7"
      />

      <SectionTitle>Bear Market Defense: Martingale</SectionTitle>

      {/* Martingale images - 2 side by side, stays 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-4 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="Martingale Strategy 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="Martingale Strategy 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-center text-sm text-foreground/50 mb-4">Martingale Structure</div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">1</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">2</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">4</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">8</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>With infinite capital, win rate is 100%</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Rotation Trading Concept</SectionTitle>

      {/* Rotation Trading Concept image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/23%20(1).png"
        alt="Rotation Trading Concept"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-6 md:my-8"
      />

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">On Decline</div>
          <div className="text-xl font-bold text-red-400">BUY</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">On Rebound</div>
          <div className="text-xl font-bold text-emerald-400">SELL</div>
        </div>
      </div>

      <CalloutBox type="info">
        It&apos;s a risk management technique, not profit generation
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>BUYLOW Algorithm Core</SectionTitle>

      {/* BUYLOW Algorithm Core image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/39%20(1).png"
        alt="BUYLOW Algorithm Core"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-6 md:my-8"
      />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>Fibonacci-based Entry / Exit</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-sm text-foreground/50 mb-3 text-center">Buy Levels</div>
          <div className="space-y-2 text-center">
            <div className="text-cyan-400 font-mono">1.236</div>
            <div className="text-cyan-400 font-mono">1.5</div>
            <div className="text-cyan-400 font-mono">1.618</div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
          <div className="text-sm text-foreground/50 mb-3 text-center">Sell Levels</div>
          <div className="space-y-2 text-center">
            <div className="text-amber-400 font-mono">0.764</div>
            <div className="text-amber-400 font-mono">0.618</div>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>The Only Risk Structure</SectionTitle>

      <WarningBox>
        <Strong>One-way decline without technical rebounds</Strong><br /><br />
        No algorithm can handle this zone.
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Gold vs BTC Comparison</SectionTitle>

      <ComparisonBox
        leftTitle="Gold"
        leftItems={[
          "Has rebounds",
          "Limited downside",
          "Structurally safe",
          "BUYLOW optimized",
        ]}
        rightTitle="Bitcoin"
        rightItems={[
          "One-way possible",
          "Unlimited downside",
          "Cycle dependent",
          "Timing required",
        ]}
        lang="en"
      />

      <SectionDivider />

      <QuoteBlock>
        Asset selection is more important than the algorithm
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Final Summary</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">Sideways</div>
          <div className="font-bold text-emerald-400">Profit</div>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">Uptrend</div>
          <div className="font-bold text-emerald-400">Profit</div>
        </div>
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">Rebound</div>
          <div className="font-bold text-cyan-400">Defense</div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <div className="text-sm text-foreground/50 mb-1">One-way</div>
          <div className="font-bold text-red-400">Risk</div>
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Now that you understand the algorithm,<br />
          let&apos;s check <Strong>asset suitability</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  // Translated versions for other languages
  zh: () => (
    <>
      <QuoteBlock>
        我开发这个系统不是为了追求500%的年收���
      </QuoteBlock>

      <CalloutBox type="info">
        可持续收益更重要
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>复利的力量</SectionTitle>

      {/* Compound Interest Image - Language specific */}
      <img
        src={getCompoundImage("zh")}
        alt="复利的力量"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs text-foreground/50 mb-2">年30%复利 | 15年</div>
          <div className="text-sm text-foreground/60 mb-1">$10万 →</div>
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-emerald-400">$510万</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs text-foreground/50 mb-2">年30%复利 | 20年</div>
          <div className="text-sm text-foreground/60 mb-1">$10万 →</div>
          <div className="text-3xl md:text-4xl font-bold text-cyan-400">$1900万</div>
        </div>
      </div>

      <QuoteBlock>
        复利决定一切
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>从小资金开始，建立你的系统</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5个核心原则</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">横盘市场盈利</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">牛市盈利</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">下跌时通过反弹防御</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">恢复并转为盈利</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">单边下跌 = 唯一亏损区间</div>
        </div>
      </div>

      <SectionDivider />

      {/* Martingale/Rotation structure image */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/43%20(1).png"
        alt="马丁格尔/轮换结构"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-[10px] my-6 md:my-7"
      />

      <SectionTitle>马丁格尔防御结构</SectionTitle>

      {/* 马丁格尔图片 - 2列并排，移动端保持2列 */}
      <div className="grid grid-cols-2 gap-4 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="马丁格尔策略 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="马丁格尔策略 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">1</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">2</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">4</div>
          <span className="text-cyan-400">→</span>
          <div className="px-4 py-2 bg-foreground/10 rounded-lg text-foreground font-mono">8</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center">
          <Strong>资本无限时，胜率100%</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>BUYLOW算法核心</SectionTitle>

      {/* BUYLOW算法核心图片 */}
      <img
        src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/39%20(1).png"
        alt="BUYLOW算法核心"
        className="block mx-auto max-w-[900px] w-full h-auto rounded-xl my-6 md:my-8"
      />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Accent>基于斐波那契的入场/出场</Accent>
        </Paragraph>
      </HighlightBox>

      <WarningBox>
        <Strong>无技术反弹的单边下跌</Strong><br /><br />
        任何算法都难以应对这种情况。
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        ��产选择比算法更重要
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          现在你理解了算法，<br />
          让我们检查<Strong>资产适合性</Strong>。
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ar: () => (
    <>
      <QuoteBlock>
        لم أبنِ هذا النظام لاستهداف عوائد سنوية 500%
      </QuoteBlock>

      <CalloutBox type="info">
        العوائد المستدامة أهم
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>قوة الفائدة المركبة</SectionTitle>

      {/* Compound Interest Image - Language specific */}
      <img
        src={getCompoundImage("ar")}
        alt="قوة الفائدة المركبة"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        الفائدة المركبة تحدد كل شيء
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>ابدأ صغيراً وابنِ نظامك</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 مبادئ أساسية</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">الربح في الأسواق الجانبية</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">الربح في الأسواق الصاعدة</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">الدفاع عبر الارتدادات في الهبوط</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">تحويل الربح في التعافي</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">الهبوط أحادي ال��تجاه = منطقة الخسارة الوحيدة</div>
        </div>
      </div>

      <SectionDivider />

      <WarningBox>
        <Strong>هبوط أحادي الاتجاه بدون ارتدادات تقنية</Strong><br /><br />
        لا يمكن لأي خوارزمية التعامل مع هذه المنطقة.
      </WarningBox>

      <QuoteBlock>
        اختيار الأصول أهم ��ن الخوارزمية
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          الآن بعد فهم الخوا��زمية،<br />
          لنتحقق من <Strong>ملاءمة الأصول</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ru: () => (
    <>
      <QuoteBlock>
        Я не создавал эту систему ради 500% годовой прибыли
      </QuoteBlock>

      <CalloutBox type="info">
        Устойчивая прибыль важнее
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Сила сложного процента</SectionTitle>

      {/* Compound Interest Image - Language specific */}
      <img
        src={getCompoundImage("ru")}
        alt="Сила сложного п��оце����а"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        Сложный процент определяет всё
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Начните с малого и постройте систему</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 ключевых принципов</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Прибыль на боковом рынке</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Прибыль на бычьем рынке</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Защита через отскоки при падении</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Переход к прибыли при восстановлении</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Однонаправленное па��ение = Единственная зона убытков</div>
        </div>
      </div>

      <SectionDivider />

      <WarningBox>
        <Strong>Однонаправленное падение без тех. отскоков</Strong><br /><br />
        Никакой алгоритм не справится с этой зоной.
      </WarningBox>

      <QuoteBlock>
        Выбор актива важнее алгоритма
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Поняв алгоритм,<br />
          проверим <Strong>сов��естимость активов</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  es: () => (
    <>
      <QuoteBlock>
        No construí este sistema para obtener 500% de retornos anuales
      </QuoteBlock>

      <CalloutBox type="info">
        Los retornos sostenibles son más importantes
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>El poder del interés compuesto</SectionTitle>

      {/* Compound Interest Image - Language specific */}
      <img
        src={getCompoundImage("es")}
        alt="El poder del interés compuesto"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        El interés compuesto lo determina todo
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Comienza pequeño y construye tu sistema</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 principios fundamentales</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Ganancias en mercados laterales</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Ganancias en mercados alcistas</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Defensa mediante rebotes en caídas</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Conversión a ganancias en recuperación</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Caída unidireccional = Única zona de pérdidas</div>
        </div>
      </div>

      <SectionDivider />

      {/* Imágenes de Martingala - 2 en fila, se mantienen 2 columnas en móvil */}
      <div className="grid grid-cols-2 gap-4 md:gap-4 max-w-[900px] mx-auto my-6 md:my-8">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/41%20(1).png"
          alt="Estrategia Martingala 1"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/42%20(1).png"
          alt="Estrategia Martingala 2"
          className="w-full h-auto rounded-lg md:rounded-xl"
        />
      </div>

      <WarningBox>
        <Strong>Caída unidireccional sin rebotes técnicos</Strong><br /><br />
        Ningún algoritmo puede manejar esta zona.
      </WarningBox>

      <QuoteBlock>
        La selección de activos es más importante que el algoritmo
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Ahora que entiendes el algoritmo,<br />
          verifiquemos <Strong>la idoneidad de los activos</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  id: () => (
    <>
      <QuoteBlock>
        Saya tidak membangun sistem ini untuk menargetkan return 500% per tahun
      </QuoteBlock>

      <CalloutBox type="info">
        Return berkelanjutan lebih penting
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Kekuatan Bunga Majemuk</SectionTitle>

      {/* Compound Interest Image - Language specific */}
      <img
        src={getCompoundImage("id")}
        alt="Kekuatan Bunga Majemuk"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        Bunga majemuk menentukan segalanya
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Mulai kecil dan bangun sistem Anda</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 Prinsip Inti</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Profit di pasar sideways</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Profit di bull market</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Pertahanan melalui rebound saat turun</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Konversi profit saat pemulihan</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Penurunan satu arah = Satu-satunya zona rugi</div>
        </div>
      </div>

      <SectionDivider />

      <WarningBox>
        <Strong>Penurunan satu arah tanpa rebound teknikal</Strong><br /><br />
        Tidak ada algoritma yang bisa menangani zona ini.
      </WarningBox>

      <QuoteBlock>
        Pemilihan aset lebih penting dari algoritma
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Sekarang Anda memahami algoritmanya,<br />
          mari periksa <Strong>kesesuaian aset</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  th: () => (
    <>
      <QuoteBlock>
        ผมไม่ได้สร้างระบบนี้เพื่อเป้าหมาย 500% ต่อปี
      </QuoteBlock>

      <CalloutBox type="info">
        ผลตอบแทนที่ยั่งยืนสำคัญกว่า
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>พลังของดอกเบี้ยทบต้น</SectionTitle>

      {/* Compound Interest Image - Language specific */}
      <img
        src={getCompoundImage("th")}
        alt="พลังของดอกเบี้ยทบต้น"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        ดอกเบี้ยทบต้นกำหนดทุกอย่าง
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>เริ่มเล็กๆ และสร้างระบบของคุณ</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 หลักการสำคัญ</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">กำไรในตลาด sideways</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">กำไรในตลาดขาขึ้น</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">ป้องกันผ่านการรีบาวด์ในขาลง</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">แปลงเป็นกำไรในช่วงฟื้นตัว</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">ขาลงทางเดียว = โซนขาดทุนเดียว</div>
        </div>
      </div>

      <SectionDivider />

      <WarningBox>
        <Strong>ขาลงทางเด���ยวโดยไม่มีรีบาวด์ทางเทคนิค</Strong><br /><br />
        ไม่มีอัลกอริทึมใดรับมือโซนนี้ได้
      </WarningBox>

      <QuoteBlock>
        การเลือกสินทรัพย์สำคัญกว่าอัลกอริทึม
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          ตอนนี้คุ���เข้าใจอัลกอริทึมแล้ว<br />
          มาตรวจสอบ<Strong>ความเหมาะสมของสินทรัพย์</Strong> กัน
        </Paragraph>
      </HighlightBox>
    </>
  ),
  vi: () => (
    <>
      <QuoteBlock>
        Tôi không xây dựng hệ thống này để nhắm tới lợi nhuận 500% hàng năm
      </QuoteBlock>

      <CalloutBox type="info">
        Lợi nhuận bền vững quan trọng hơn
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Sức mạnh của lãi kép</SectionTitle>

      {/* Compound Interest Image - Language specific */}
      <img
        src={getCompoundImage("vi")}
        alt="Sức mạnh của lãi kép"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        Lãi kép quyết định tất cả
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Bắt đầu nhỏ và xây dựng hệ thống của bạn</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 nguyên tắc cốt lõi</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Lợi nhuận trong thị trường sideway</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Lợi nhuận trong thị trường tăng</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Phòng thủ qua rebound khi giảm</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Chuyển đổi thành lợi nhuận khi phục hồi</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Giảm một chiều = Vùng thua lỗ duy nhất</div>
        </div>
      </div>

      <SectionDivider />

      <WarningBox>
        <Strong>Giảm một chiều không có rebound kỹ thuật</Strong><br /><br />
        Không thuật toán nào xử lý được vùng này.
      </WarningBox>

      <QuoteBlock>
        Chọn tài sản quan trọng hơn thuật toán
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Bây giờ bạn hiểu thuật toán,<br />
          hãy kiểm tra <Strong>tính phù hợp của tài sản</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  tr: () => (
    <>
      <QuoteBlock>
        Bu sistemi yıllık %500 getiri hedeflemek için yapmadım
      </QuoteBlock>

      <CalloutBox type="info">
        Sürdürülebilir getiriler daha önemli
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Bileşik Faizin Gücü</SectionTitle>

      {/* Compound Interest Image - Language specific */}
      <img
        src={getCompoundImage("tr")}
        alt="Bileşik Faizin Gücü"
        className="w-full max-w-[900px] mx-auto my-6 rounded-xl block"
      />

      <QuoteBlock>
        Bileşik faiz her şeyi belirler
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          <Strong>Küçük başla ve sistemini kur</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>5 Temel Prensip</SectionTitle>

      <div className="my-8 space-y-3">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">1</span>
          </div>
          <div className="text-foreground font-medium">Yatay piyasalarda kâr</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div className="text-foreground font-medium">Boğa piyasalarında kâr</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div className="text-foreground font-medium">Düşüşte geri sıçramalarla savunma</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-bold">4</span>
          </div>
          <div className="text-foreground font-medium">Toparlanmada kâra dönüşüm</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-red-400 font-bold">5</span>
          </div>
          <div className="text-foreground font-medium">Tek yönlü düşüş = Tek kayıp bölgesi</div>
        </div>
      </div>

      <SectionDivider />

      <WarningBox>
        <Strong>Teknik geri sıçrama olmadan tek yönlü düşüş</Strong><br /><br />
        Hiçbir algoritma bu bölgeyle başa çıkamaz.
      </WarningBox>

      <QuoteBlock>
        Varlık seçimi algoritmadan daha önemli
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Artık algoritmayı anladınız,<br />
          <Strong>varlık uygunluğunu</Strong> kontrol edelim.
        </Paragraph>
      </HighlightBox>
    </>
  ),
}

// BotOperationContent has been deleted and merged into RRAlgorithmContent

// Slippage & Fee Structure Content: 슬리피지 & 수수료 구조
const SlippageFeeContent = {
  ko: () => (
    <>
      {/* 1. 시작 - 핵심 메시지 */}
      <QuoteBlock>
        고빈도 트레이딩에서 수수료는 곧 수익이다
      </QuoteBlock>

      <SectionDivider />

      {/* 2. 문제 정의 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>수수료 + 슬리피지 = 숨은 손실</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        많은 트레이더들이 간과하는 부분이다.<br />
        수익을 냈다고 생각하지만, 실제로는 <Strong>수수료와 슬리피지</Strong>가<br />
        수익의 상당 부분을 갉아먹고 있다.
      </Paragraph>

      <SectionDivider />

      {/* 3. 지정가 vs 시장가 차이 */}
      <SectionTitle>지정가 vs 시장가</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">지정가 (Limit)</div>
          <div className="text-2xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-1 md:mb-2">0.02%</div>
          <div className="text-xs md:text-xs md:text-sm text-foreground/60">Maker 수수료</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">시장가 (Market)</div>
          <div className="text-2xl md:text-2xl md:text-4xl font-bold text-red-400 mb-1 md:mb-2">0.05%</div>
          <div className="text-xs md:text-xs md:text-sm text-foreground/60">Taker 수수료</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>2.5배 차이</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 4. 슬리피지 설명 */}
      <SectionTitle>슬리피지란?</SectionTitle>

      <Paragraph>
        <Strong>슬리피지(Slippage)</Strong>란 주문 체결 시<br />
        예상 가격과 실제 체결 가격의 차이를 말한다.
      </Paragraph>

      <CalloutBox type="info">
        대량 매수/매도 시 호가창의 물량을 소진하면서<br />
        가격이 밀리는 현상이 발생한다
      </CalloutBox>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">10억 시장가 매수</div>
          <div className="text-foreground/70">큰 슬리피지로 <Strong>-2% 손실</Strong> 가능</div>
        </div>
      </WarningBox>

      <SectionDivider />

      {/* 5. 총 비용 구조 */}
      <SectionTitle>총 비용 구조</SectionTitle>

      <div className="my-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 md:p-6">
        <div className="text-center">
          <div className="text-xs md:text-sm text-foreground/50 mb-3">시장가 사용 시 총 비용</div>
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap mb-4">
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-foreground/10 rounded-lg text-foreground text-sm md:text-base">수수료 0.05%</span>
            <span className="text-foreground/40">+</span>
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-foreground/10 rounded-lg text-foreground text-sm md:text-base">슬리피지</span>
            <span className="text-foreground/40">=</span>
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-red-500/20 rounded-lg text-red-400 font-bold text-sm md:text-base">최대 3배 손실</span>
          </div>
          <div className="text-xs md:text-sm text-foreground/60">지정가 대비 비용이 3배 이상 발생할 수 있다</div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. 개발 철학 */}
      <QuoteBlock>
        단기 수익보다 지속가능성을 선택했다
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          BUYLOW의 모든 프로그램은<br />
          <Strong>100% 지정가 기반</Strong>으로 설계되어 있다
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        시장가를 사용하면 빠른 체결이 가능하지만,<br />
        <Strong>장기적으로 수익률을 갉아먹는다.</Strong><br />
        지속가능한 수익 구조를 위해 지정가를 선택했다.
      </Paragraph>

      <SectionDivider />

      {/* 7. 고빈도 트레이딩 영향 */}
      <SectionTitle>고빈도 트레이딩과 수수료</SectionTitle>

      <div className="my-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 md:p-6">
        <div className="text-center">
          <div className="text-base md:text-lg font-bold text-amber-400 mb-2 md:mb-3">거래 횟수 ↑ = 수수료 영향 폭발</div>
          <div className="text-sm md:text-base text-foreground/70">
            하루 100회 거래 시, 0.03% 차이가<br />
            <Strong>연간 수익률 10% 이상 차이</Strong>를 만들 수 있다
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 8. VIP 수수료 ���감 전략 */}
      <SectionTitle>VIP 수수료 절감 전략</SectionTitle>

      <Paragraph>
        OKX 거래소에서는 자산 보유량 또는 거래량에 따라<br />
        <Strong>VIP 등급</Strong>이 부여되고 수수료가 할인된다.
      </Paragraph>

      {/* VIP Fee Structure Images - Always 2 columns even on mobile */}
      <div className="grid grid-cols-2 gap-3 my-6">
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-6.jpg"
          alt="VIP Fee Structure 1"
          className="w-full rounded-xl block"
        />
        <img
          src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/2-66.jpg"
          alt="VIP Fee Structure 2"
          className="w-full rounded-xl block"
        />
      </div>

      {/* 추천 VIP 등급 카드 (VIP1~VIP3) - 모바일: 세로 스택 */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">추천</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-foreground">0.016%</div>
            <div className="text-xs text-foreground/50">Maker 기준</div>
            <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block">
              약 20% 절감
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-foreground/10">
            <div className="text-xs text-foreground/60 space-y-1">
              <div>자산 ≥ <Strong>10만 USD</Strong></div>
              <div className="text-foreground/40">또는</div>
              <div>거래량 ≥ 500만 USD</div>
            </div>
          </div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-foreground">0.015%</div>
            <div className="text-xs text-foreground/50">Maker 기준</div>
            <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block">
              약 25% 절감
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-foreground/10">
            <div className="text-xs text-foreground/60 space-y-1">
              <div>자산 ≥ <Strong>20만 USD</Strong></div>
              <div className="text-foreground/40">또는</div>
              <div>거래량 ≥ 1천만 USD</div>
            </div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-amber-400">0.010%</div>
            <div className="text-xs text-foreground/50">Maker 기준</div>
            <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block">
              약 50% 절감
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-foreground/10">
            <div className="text-xs text-foreground/60 space-y-1">
              <div>자산 ≥ <Strong>200만 USD</Strong></div>
              <div className="text-foreground/40">또는</div>
              <div>거래량 ≥ 5천만 USD</div>
            </div>
          </div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>VIP 1만 달아도 수익률 체감이 크게 달라진다</Accent>
        </Paragraph>
      </HighlightBox>

      <CalloutBox type="success">
        고빈도 트레이딩에서는 <Strong>수수료 = 수익</Strong>이다<br />
        VIP 1은 진입 장벽이 낮으면서 효과는 가장 극대화된다
      </CalloutBox>

      <SectionDivider />

      {/* 전체 VIP 등급 수수료 표 */}
      <SectionTitle>전체 VIP 등급 수수료표 (Futures)</SectionTitle>

      <CalloutBox type="info">
        <Strong>Maker = 지정가</Strong> (유동성 공급) | <Strong>Taker = 시장가</Strong> (유동성 소비)<br />
        BUYLOW는 100% 지정가(Maker) 기반으로 설계됨
      </CalloutBox>

      {/* VIP 등급 카드 리스트 - 모바일 친화적 */}
      <div className="my-8 flex flex-col gap-2">
        {/* Regular */}
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/60">Regular</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400">M: 0.02%</span>
              <span className="text-foreground/50">T: 0.05%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/50">자산 {"<"} 10만 USD · 거래량 {"<"} 500만 USD</div>
        </div>
        {/* VIP 1 */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-cyan-400">VIP 1</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.016%</span>
              <span className="text-foreground/50">T: 0.045%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">자산 ≥ 10만 USD · 거래량 ≥ 500만 USD</div>
        </div>
        {/* VIP 2 */}
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-foreground/70">VIP 2</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.015%</span>
              <span className="text-foreground/50">T: 0.036%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">자산 ≥ 20만 USD · 거래량 ≥ 1천만 USD</div>
        </div>
        {/* VIP 3 */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-amber-400">VIP 3</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.01%</span>
              <span className="text-foreground/50">T: 0.028%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">자산 ≥ 200만 USD · 거래량 ≥ 5천만 USD</div>
        </div>
        {/* VIP 4 */}
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/70">VIP 4</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.008%</span>
              <span className="text-foreground/50">T: 0.027%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">자산 ≥ 500만 USD · 거래량 ≥ 2억 USD</div>
        </div>
        {/* VIP 5 */}
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/70">VIP 5</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.005%</span>
              <span className="text-foreground/50">T: 0.026%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">자산 ≥ 2천만 USD · 거래량 ≥ 6억 USD</div>
        </div>
        {/* VIP 6 */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-purple-400">VIP 6</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-bold">M: 0%</span>
              <span className="text-foreground/50">T: 0.025%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">자산 ≥ 5천만 USD · 거래량 ≥ 10억 USD</div>
        </div>
        {/* VIP 7 */}
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/70">VIP 7</span>
            <div className="flex gap-3 text-xs">
              <span className="text-cyan-400 font-bold">M: -0.002%</span>
              <span className="text-foreground/50">T: 0.02%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">자산 ≥ 1억 USD · 거래량 ≥ 15억 USD</div>
        </div>
        {/* VIP 8 */}
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/70">VIP 8</span>
            <div className="flex gap-3 text-xs">
              <span className="text-cyan-400 font-bold">M: -0.005%</span>
              <span className="text-foreground/50">T: 0.02%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">자산 ≥ 2.5억 USD · 거래량 ≥ 20억 USD</div>
        </div>
        {/* VIP 9 */}
        <div className="bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-amber-400">VIP 9</span>
            <div className="flex gap-3 text-xs">
              <span className="text-cyan-400 font-bold">M: -0.005%</span>
              <span className="text-foreground/50">T: 0.015%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">자산 ≥ 5억 USD · 거래량 ≥ 200억 USD</div>
        </div>
      </div>

      <div className="my-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
        <div className="text-center text-sm">
          <div className="text-cyan-400 font-bold mb-2">VIP 7 이상: Maker 수수료 마이너스</div>
          <div className="text-foreground/70">지정가 주문 시 오히려 <Strong>리베이트(보상)</Strong>를 얻는다</div>
        </div>
      </div>

      <WarningBox>
        <div className="text-center">
          <div className="font-bold mb-2">VIP 등급이 올라갈수록</div>
          <div className="text-foreground/70">Maker 수수료 <Strong>급격히 감소</Strong> → 고빈도일수록 영향 폭발</div>
        </div>
      </WarningBox>

      <SectionDivider />

      {/* 10. 추가 수익 파이프라인 */}
      <SectionTitle>추가 수익: OKX Flash Earn</SectionTitle>

      <Paragraph>
        OKX에서 제공하는 <Strong>Flash Earn</Strong> 기능을 활용하면<br />
        유휴 자금으로 추가 수익을 얻을 수 있다.
      </Paragraph>

      <div className="my-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6">
        <div className="text-center mb-4">
          <div className="text-base md:text-lg font-bold text-emerald-400 mb-2">Flash Earn 활용 시</div>
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">연 2~3%</div>
          <div className="text-sm md:text-base text-foreground/60">추가 수익 가능</div>
        </div>
        <div className="border-t border-emerald-500/20 pt-4 mt-4">
          <div className="grid grid-cols-3 gap-2 md:gap-3 text-center text-xs md:text-sm">
            <div className="bg-foreground/5 rounded-lg p-2 md:p-3">
              <div className="text-emerald-400 font-medium text-xs md:text-sm">USDT / BTC</div>
              <div className="text-foreground/50 text-[10px] md:text-xs">단기 예치 가능</div>
            </div>
            <div className="bg-foreground/5 rounded-lg p-2 md:p-3">
              <div className="text-emerald-400 font-medium text-xs md:text-sm">이벤트 참여</div>
              <div className="text-foreground/50 text-[10px] md:text-xs">에어드랍 지급</div>
            </div>
            <div className="bg-foreground/5 rounded-lg p-2 md:p-3">
              <div className="text-emerald-400 font-medium text-xs md:text-sm">복리 효과</div>
              <div className="text-foreground/50 text-[10px] md:text-xs">자동 재예치</div>
            </div>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 11. 최종 정리 */}
      <SectionTitle>핵심 정리</SectionTitle>

      <div className="my-8 grid grid-cols-3 gap-2 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 md:p-5 text-center">
          <div className="text-sm md:text-lg font-bold text-cyan-400 mb-1 md:mb-2">지정가 사용</div>
          <div className="text-lg md:text-2xl font-bold text-foreground">필수</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 md:p-5 text-center">
          <div className="text-sm md:text-lg font-bold text-cyan-400 mb-1 md:mb-2">VIP 적용</div>
          <div className="text-lg md:text-2xl font-bold text-foreground">필수</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 md:p-5 text-center">
          <div className="text-sm md:text-lg font-bold text-cyan-400 mb-1 md:mb-2">슬리피지 이해</div>
          <div className="text-lg md:text-2xl font-bold text-foreground">필수</div>
        </div>
      </div>

      <QuoteBlock>
        수수료 관리는 수익률 관리다
      </QuoteBlock>
    </>
  ),
  en: () => (
    <>
      <QuoteBlock>
        In high-frequency trading, fees are profit
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>Fees + Slippage = Hidden Losses</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Limit vs Market Orders</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">Limit Order</div>
          <div className="text-2xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-1 md:mb-2">0.02%</div>
          <div className="text-xs md:text-xs md:text-sm text-foreground/60">Maker Fee</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">Market Order</div>
          <div className="text-2xl md:text-2xl md:text-4xl font-bold text-red-400 mb-1 md:mb-2">0.05%</div>
          <div className="text-xs md:text-xs md:text-sm text-foreground/60">Taker Fee</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>2.5x Difference</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>What is Slippage?</SectionTitle>

      <Paragraph>
        <Strong>Slippage</Strong> is the difference between<br />
        the expected price and the actual execution price.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">$1M Market Buy</div>
          <div className="text-foreground/70">→ Can lose <Strong>-2%</Strong> to slippage</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        We chose sustainability over short-term gains
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          All BUYLOW programs are designed<br />
          <Strong>100% on limit orders</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>VIP Fee Reduction Strategy</SectionTitle>

      <Paragraph>
        OKX grants <Strong>VIP tiers</Strong> based on<br />
        asset holdings or trading volume, with fee discounts.
      </Paragraph>

      {/* Recommended VIP Tiers - Mobile: Vertical Stack */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">Best Value</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-foreground">0.016%</div>
            <div className="text-xs text-foreground/50">Maker fee</div>
            <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block">~20% savings</div>
          </div>
          <div className="mt-3 pt-3 border-t border-foreground/10">
            <div className="text-xs text-foreground/60 space-y-1">
              <div>Assets ≥ <Strong>$100K</Strong></div>
              <div className="text-foreground/40">or</div>
              <div>Volume ≥ $5M</div>
            </div>
          </div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-foreground">0.015%</div>
            <div className="text-xs text-foreground/50">Maker fee</div>
            <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block">~25% savings</div>
          </div>
          <div className="mt-3 pt-3 border-t border-foreground/10">
            <div className="text-xs text-foreground/60 space-y-1">
              <div>Assets ≥ <Strong>$200K</Strong></div>
              <div className="text-foreground/40">or</div>
              <div>Volume ≥ $10M</div>
            </div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-amber-400">0.010%</div>
            <div className="text-xs text-foreground/50">Maker fee</div>
            <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block">~50% savings</div>
          </div>
          <div className="mt-3 pt-3 border-t border-foreground/10">
            <div className="text-xs text-foreground/60 space-y-1">
              <div>Assets ≥ <Strong>$2M</Strong></div>
              <div className="text-foreground/40">or</div>
              <div>Volume ≥ $50M</div>
            </div>
          </div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Even VIP 1 makes a significant difference</Accent>
        </Paragraph>
      </HighlightBox>

      <CalloutBox type="success">
        In high-frequency trading, <Strong>fees = profit</Strong><br />
        VIP 1 has the lowest barrier with maximum impact
      </CalloutBox>

      <SectionDivider />

      {/* Full VIP Fee Table */}
      <SectionTitle>Complete VIP Fee Structure (Futures)</SectionTitle>

      <CalloutBox type="info">
        <Strong>Maker = Limit Order</Strong> (provides liquidity) | <Strong>Taker = Market Order</Strong> (consumes liquidity)<br />
        BUYLOW is 100% designed on Maker (limit orders)
      </CalloutBox>

      {/* VIP Tier Card List - Mobile Friendly */}
      <div className="my-8 flex flex-col gap-2">
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/60">Regular</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400">M: 0.02%</span>
              <span className="text-foreground/50">T: 0.05%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/50">Assets {"<"} $100K · Volume {"<"} $5M</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-cyan-400">VIP 1</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.016%</span>
              <span className="text-foreground/50">T: 0.045%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">Assets ≥ $100K · Volume ≥ $5M</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-foreground/70">VIP 2</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.015%</span>
              <span className="text-foreground/50">T: 0.036%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">Assets ≥ $200K · Volume ≥ $10M</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-amber-400">VIP 3</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.01%</span>
              <span className="text-foreground/50">T: 0.028%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">Assets ≥ $2M · Volume ≥ $50M</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/70">VIP 4</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.008%</span>
              <span className="text-foreground/50">T: 0.027%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">Assets ≥ $5M · Volume ≥ $200M</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/70">VIP 5</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-medium">M: 0.005%</span>
              <span className="text-foreground/50">T: 0.026%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">Assets ≥ $20M · Volume ≥ $600M</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-purple-400">VIP 6</span>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-400 font-bold">M: 0%</span>
              <span className="text-foreground/50">T: 0.025%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">Assets ≥ $50M · Volume ≥ $1B</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/70">VIP 7</span>
            <div className="flex gap-3 text-xs">
              <span className="text-cyan-400 font-bold">M: -0.002%</span>
              <span className="text-foreground/50">T: 0.02%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">Assets ≥ $100M · Volume ≥ $1.5B</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground/70">VIP 8</span>
            <div className="flex gap-3 text-xs">
              <span className="text-cyan-400 font-bold">M: -0.005%</span>
              <span className="text-foreground/50">T: 0.02%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">Assets ≥ $250M · Volume ≥ $2B</div>
        </div>
        <div className="bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-amber-400">VIP 9</span>
            <div className="flex gap-3 text-xs">
              <span className="text-cyan-400 font-bold">M: -0.005%</span>
              <span className="text-foreground/50">T: 0.015%</span>
            </div>
          </div>
          <div className="text-xs text-foreground/70">Assets ≥ $500M · Volume ≥ $20B</div>
        </div>
      </div>

      <div className="my-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
        <div className="text-center text-sm">
          <div className="text-cyan-400 font-bold mb-2">VIP 7+: Negative Maker Fee</div>
          <div className="text-foreground/70">Get <Strong>rebates (rewards)</Strong> for placing limit orders</div>
        </div>
      </div>

      <WarningBox>
        <div className="text-center">
          <div className="font-bold mb-2">Higher VIP = Lower Fees</div>
          <div className="text-foreground/70">Maker fees <Strong>drop dramatically</Strong> → massive impact for HFT</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Additional Income: OKX Flash Earn</SectionTitle>

      <div className="my-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6">
        <div className="text-center mb-4">
          <div className="text-base md:text-lg font-bold text-emerald-400 mb-2">With Flash Earn</div>
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">2~3% APY</div>
          <div className="text-sm md:text-base text-foreground/60">Additional income possible</div>
        </div>
        <div className="border-t border-emerald-500/20 pt-4 mt-4">
          <div className="grid grid-cols-3 gap-2 md:gap-3 text-center text-xs md:text-sm">
            <div className="bg-foreground/5 rounded-lg p-2 md:p-3">
              <div className="text-emerald-400 font-medium text-xs md:text-sm">USDT / BTC</div>
              <div className="text-foreground/50 text-[10px] md:text-xs">Short-term</div>
            </div>
            <div className="bg-foreground/5 rounded-lg p-2 md:p-3">
              <div className="text-emerald-400 font-medium text-xs md:text-sm">Events</div>
              <div className="text-foreground/50 text-[10px] md:text-xs">Airdrops</div>
            </div>
            <div className="bg-foreground/5 rounded-lg p-2 md:p-3">
              <div className="text-emerald-400 font-medium text-xs md:text-sm">Compound</div>
              <div className="text-foreground/50 text-[10px] md:text-xs">Auto-reinvest</div>
            </div>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Key Takeaways</SectionTitle>

      <div className="my-8 grid grid-cols-3 gap-2 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 md:p-5 text-center">
          <div className="text-xs md:text-lg font-bold text-cyan-400 mb-1 md:mb-2">Limit Orders</div>
          <div className="text-base md:text-2xl font-bold text-foreground">Essential</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 md:p-5 text-center">
          <div className="text-xs md:text-lg font-bold text-cyan-400 mb-1 md:mb-2">VIP Status</div>
          <div className="text-base md:text-2xl font-bold text-foreground">Essential</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 md:p-5 text-center">
          <div className="text-xs md:text-lg font-bold text-cyan-400 mb-1 md:mb-2">Slippage</div>
          <div className="text-base md:text-2xl font-bold text-foreground">Essential</div>
        </div>
      </div>

      <QuoteBlock>
        Managing fees is managing returns
      </QuoteBlock>
    </>
  ),
  // Translated versions for 8 languages
  zh: () => (
    <>
      <QuoteBlock>
        在高频交易中，手续费就是收益
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>手续费 + 滑点 = 隐藏损失</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        这是很多交易者忽视的部分。<br />
        你认为赚了钱，但实际上<Strong>手续费和滑点</Strong><br />
        正在侵蚀你很大一部分利润。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>限价单 vs 市价单</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">限价单 (Limit)</div>
          <div className="text-2xl md:text-2xl md:text-4xl font-bold text-emerald-400 mb-1 md:mb-2">0.02%</div>
          <div className="text-xs md:text-xs md:text-sm text-foreground/60">Maker 手续费</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">市价单 (Market)</div>
          <div className="text-2xl md:text-2xl md:text-4xl font-bold text-red-400 mb-1 md:mb-2">0.05%</div>
          <div className="text-xs md:text-xs md:text-sm text-foreground/60">Taker 手续费</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>2.5倍差异</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>什么是滑点？</SectionTitle>

      <Paragraph>
        <Strong>滑点(Slippage)</Strong>是指订单成交时<br />
        预期价格与实际成交价格之间的差异。
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">10亿市价买入</div>
          <div className="text-foreground/70">→ 滑点可能导致<Strong>-2%损失</Strong></div>
        </div>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        我们选择了可持续性而非短期利润
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          BUYLOW的所��程序都<br />
          基于<Strong>100%限价单</Strong>设计
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>VIP手续费节省策略</SectionTitle>

      <Paragraph>
        在OKX交易所，根据资产持有量或交易量<br />
        会授予<Strong>VIP等级</Strong>并享受手续费折扣。
      </Paragraph>

      {/* VIP Cards - Mobile Vertical Stack */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">推荐</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="text-xl font-bold text-foreground">0.016%</div>
          <div className="text-xs text-foreground/50">Maker基准</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">约20%节省</div>
          <div className="mt-3 pt-3 border-t border-foreground/10">
            <div className="text-xs text-foreground/60">资产 ≥ <Strong>10万 USD</Strong></div>
          </div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="text-xl font-bold text-foreground">0.015%</div>
          <div className="text-xs text-foreground/50">Maker基准</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">约25%节省</div>
          <div className="mt-3 pt-3 border-t border-foreground/10">
            <div className="text-xs text-foreground/60">资产 ≥ <Strong>20万 USD</Strong></div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="text-xl font-bold text-amber-400">0.010%</div>
          <div className="text-xs text-foreground/50">Maker基准</div>
          <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block mt-2">约50%节省</div>
          <div className="mt-3 pt-3 border-t border-foreground/10">
            <div className="text-xs text-foreground/60">资产 ≥ <Strong>200万 USD</Strong></div>
          </div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>即使只达到VIP 1，收益体验也会大不相同</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>额外收益：OKX Flash Earn</SectionTitle>

      <div className="my-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-emerald-400 mb-2">使用Flash Earn</div>
          <div className="text-3xl font-bold text-foreground mb-2">年化 2~3%</div>
          <div className="text-foreground/60">额外收益可能</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        管理手续费就是管理收益
      </QuoteBlock>
    </>
  ),
  ar: () => (
    <>
      <QuoteBlock>
        في التداول عالي التردد، الرسوم هي الأرباح
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>الرسوم + الانزلاق = خسارة خفية</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        هذا جزء يتجاهله الكثير من المتداولين.<br />
        تعتقد أنك حققت ر��حاً، لكن في الواقع <Strong>الرسوم والانزلاق</Strong><br />
        يأكلان جزءاً كبيراً من أرباحك.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>محدد السعر مقابل السوق</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">محدد (Limit)</div>
          <div className="text-2xl md:text-4xl font-bold text-emerald-400 mb-2">0.02%</div>
          <div className="text-sm text-foreground/60">رسوم Maker</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">سوق (Market)</div>
          <div className="text-2xl md:text-4xl font-bold text-red-400 mb-2">0.05%</div>
          <div className="text-sm text-foreground/60">رسوم Taker</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>فرق 2.5 ضعف</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>ما هو الانزلاق؟</SectionTitle>

      <Paragraph>
        <Strong>الانزلاق</Strong> هو الفرق بين<br />
        السعر المتوقع وسعر التنفيذ الفعلي.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">شراء سوقي بمليار</div>
          <div className="text-foreground/70">→ الانزلاق قد يسبب <Strong>خسارة -2%</Strong></div>
        </div>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        اخترنا الاستدامة بدلاً من الربح قصير المدى
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          جميع بر��مج BUYLOW مصممة<br />
          على أساس <Strong>100% أوامر محددة</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>استراتيجية توفير رسوم VIP</SectionTitle>

      {/* VIP Cards - Mobile Vertical Stack */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">موصى</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="text-xl font-bold text-foreground">0.016%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">توفير ~20%</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="text-xl font-bold text-foreground">0.015%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">توفير ~25%</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="text-xl font-bold text-amber-400">0.010%</div>
          <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block mt-2">توفير ~50%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        إدارة الرسوم هي إدارة ا��عوائد
      </QuoteBlock>
    </>
  ),
  ru: () => (
    <>
      <QuoteBlock>
        В высокочастотной торговле комиссии — это прибыль
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>Комиссии + проскальзывание = скрытые потери</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Это часть, которую многие трейд��ры упускают.<br />
        Вы думаете, что заработали, но на самом деле <Strong>комиссии и проскальзывание</Strong><br />
        съедают значительную часть вашей прибыли.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Лимитная vs рыночная</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">Лимитная (Limit)</div>
          <div className="text-2xl md:text-4xl font-bold text-emerald-400 mb-2">0.02%</div>
          <div className="text-sm text-foreground/60">Комиссия Maker</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">Рыночная (Market)</div>
          <div className="text-2xl md:text-4xl font-bold text-red-400 mb-2">0.05%</div>
          <div className="text-sm text-foreground/60">Комиссия Taker</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>Разница в 2.5 раза</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Что такое проскальзывание?</SectionTitle>

      <Paragraph>
        <Strong>Проскальзывание</Strong> — это разница между<br />
        ожидаемой ценой и фактической ценой исполнения.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">Рыночная покупка на миллиард</div>
          <div className="text-foreground/70">→ Проскальзывание может вызвать <Strong>убыток -2%</Strong></div>
        </div>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Мы выбрали устойчивость вместо краткосрочной прибыли
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Все программы BUYLOW р��зработаны<br />
          на основе <Strong>100% лимитных ордеров</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Стратегия экономии VIP-комиссий</SectionTitle>

      {/* VIP Cards - Mobile Vertical Stack */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">Рекомендуется</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="text-xl font-bold text-foreground">0.016%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">~20% экономия</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="text-xl font-bold text-foreground">0.015%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">~25% экономия</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="text-xl font-bold text-amber-400">0.010%</div>
          <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block mt-2">~50% экономия</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Управление комиссиями — это управление доходностью
      </QuoteBlock>
    </>
  ),
  es: () => (
    <>
      <QuoteBlock>
        En trading de alta frecuencia, las comisiones son ganancias
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>Comisiones + Slippage = Pérdida oculta</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Esta es una parte que muchos traders ignoran.<br />
        Piensas que ganaste, pero en realidad <Strong>las comisiones y el slippage</Strong><br />
        están consumiendo una parte significativa de tus ganancias.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Límite vs Mercado</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">Límite (Limit)</div>
          <div className="text-2xl md:text-4xl font-bold text-emerald-400 mb-2">0.02%</div>
          <div className="text-sm text-foreground/60">Comisión Maker</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">Mercado (Market)</div>
          <div className="text-2xl md:text-4xl font-bold text-red-400 mb-2">0.05%</div>
          <div className="text-sm text-foreground/60">Comisión Taker</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>Diferencia de 2.5x</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>¿Qué es el Slippage?</SectionTitle>

      <Paragraph>
        <Strong>Slippage</Strong> es la diferencia entre<br />
        el precio esperado y el precio de ejecución real.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">Compra de mercado de mil millones</div>
          <div className="text-foreground/70">��� El slippage puede causar <Strong>pérdida de -2%</Strong></div>
        </div>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Elegimos sostenibilidad sobre ganancias a corto plazo
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Todos los programas de BUYLOW están diseñados<br />
          con base en <Strong>100% órdenes límite</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Estrategia de ahorro VIP</SectionTitle>

      {/* VIP Cards - Mobile Vertical Stack */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">Recomendado</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="text-xl font-bold text-foreground">0.016%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">~20% ahorro</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="text-xl font-bold text-foreground">0.015%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">~25% ahorro</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="text-xl font-bold text-amber-400">0.010%</div>
          <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block mt-2">~50% ahorro</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Gestionar comisiones es gestionar retornos
      </QuoteBlock>
    </>
  ),
  id: () => (
    <>
      <QuoteBlock>
        Dalam trading frekuensi tinggi, biaya adalah profit
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>Biaya + Slippage = Kerugian tersembunyi</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Ini adalah bagian yang diabaikan banyak trader.<br />
        Anda pikir sudah profit, tapi sebenarnya <Strong>biaya dan slippage</Strong><br />
        menggerogoti sebagian besar keuntungan Anda.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Limit vs Market</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">Limit Order</div>
          <div className="text-2xl md:text-4xl font-bold text-emerald-400 mb-2">0.02%</div>
          <div className="text-sm text-foreground/60">Biaya Maker</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">Market Order</div>
          <div className="text-2xl md:text-4xl font-bold text-red-400 mb-2">0.05%</div>
          <div className="text-sm text-foreground/60">Biaya Taker</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>Perbedaan 2.5x</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Apa itu Slippage?</SectionTitle>

      <Paragraph>
        <Strong>Slippage</Strong> adalah perbedaan antara<br />
        harga yang diharapkan dan harga eksekusi aktual.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">Market buy 1 miliar</div>
          <div className="text-foreground/70">→ Slippage bisa menyebabkan <Strong>kerugian -2%</Strong></div>
        </div>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Kami memilih keberlanjutan daripada profit jangka pendek
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Semua program BUYLOW dirancang<br />
          berdasarkan <Strong>100% limit order</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Strategi penghematan biaya VIP</SectionTitle>

      {/* VIP Cards - Mobile Vertical Stack */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">Direkomendasikan</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="text-xl font-bold text-foreground">0.016%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">Hemat ~20%</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="text-xl font-bold text-foreground">0.015%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">Hemat ~25%</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="text-xl font-bold text-amber-400">0.010%</div>
          <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block mt-2">Hemat ~50%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Mengelola biaya adalah mengelola return
      </QuoteBlock>
    </>
  ),
  th: () => (
    <>
      <QuoteBlock>
        ในการเทรดความถี่สูง ค่าธรรมเนียมคือกำไร
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>ค่าธรรมเนียม + Slippage = ขาดทุนซ่อนเร้น</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        นี่คือส่วนที่เทรดเดอร์หลายคนมองข้าม<br />
        คุณคิดว่าได้กำไร แต่จริงๆ แล้ว <Strong>ค่าธรรมเนียมและ Slippage</Strong><br />
        กำลังกัดกินกำไรส่วนใหญ่ของคุณ
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Limit vs Market</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">Limit Order</div>
          <div className="text-2xl md:text-4xl font-bold text-emerald-400 mb-2">0.02%</div>
          <div className="text-sm text-foreground/60">ค่า Maker</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">Market Order</div>
          <div className="text-2xl md:text-4xl font-bold text-red-400 mb-2">0.05%</div>
          <div className="text-sm text-foreground/60">ค่า Taker</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>ต่างกัน 2.5 เท่า</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Slippage คืออะไร?</SectionTitle>

      <Paragraph>
        <Strong>Slippage</Strong> คือความแตกต่างระหว่าง<br />
        ราคาที่คาดหวังและราคาที่เกิดขึ้นจริง
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">ซื้อ Market 1 พันล้าน</div>
          <div className="text-foreground/70">→ Slippage อาจทำให้<Strong>ขาดทุน -2%</Strong></div>
        </div>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        เราเลือกความยั่งยืนแทนกำไรระยะสั้��
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          โปรแกรม BUYLOW ทั้งหมดถูกออกแบบ<br />
          บนพื้นฐาน <Strong>100% limit order</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>กลยุทธ์ประหยัดค่าธรรมเนียม VIP</SectionTitle>

      {/* VIP Cards - Mobile Vertical Stack */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">แนะนำ</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="text-xl font-bold text-foreground">0.016%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">ประหยัด ~20%</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="text-xl font-bold text-foreground">0.015%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">ประหยัด ~25%</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="text-xl font-bold text-amber-400">0.010%</div>
          <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block mt-2">ประหยัด ~50%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        จัดการค่าธรรมเนียมคือจัดการผลตอบแทน
      </QuoteBlock>
    </>
  ),
  vi: () => (
    <>
      <QuoteBlock>
        Trong giao dịch tần suất cao, phí chính là lợi nhuận
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>Phí + Slippage = Thua lỗ ẩn</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Đ��y là phần mà nhiều trader bỏ qua.<br />
        Bạn nghĩ đã có lời, nhưng thực tế <Strong>phí và slippage</Strong><br />
        đang ăn mòn phần lớn lợi nhuận của bạn.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Limit vs Market</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">Limit Order</div>
          <div className="text-2xl md:text-4xl font-bold text-emerald-400 mb-2">0.02%</div>
          <div className="text-sm text-foreground/60">Phí Maker</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">Market Order</div>
          <div className="text-2xl md:text-4xl font-bold text-red-400 mb-2">0.05%</div>
          <div className="text-sm text-foreground/60">Phí Taker</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>Chênh lệch 2.5 lần</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Slippage là gì?</SectionTitle>

      <Paragraph>
        <Strong>Slippage</Strong> là sự chênh lệch giữa<br />
        giá kỳ vọng và giá thực hiện thực tế.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">Mua market 1 tỷ</div>
          <div className="text-foreground/70">→ Slippage có thể gây <Strong>lỗ -2%</Strong></div>
        </div>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Chúng tôi chọn bền vững thay vì lợi nhuận ngắn hạn
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Tất cả chương trình BUYLOW được thiết kế<br />
          dựa trên <Strong>100% lệnh limit</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Chiến lược tiết kiệm phí VIP</SectionTitle>

      {/* VIP Cards - Mobile Vertical Stack */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">Khuyến nghị</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="text-xl font-bold text-foreground">0.016%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">Tiết kiệm ~20%</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="text-xl font-bold text-foreground">0.015%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">Tiết kiệm ~25%</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="text-xl font-bold text-amber-400">0.010%</div>
          <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block mt-2">Tiết kiệm ~50%</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Quản lý phí là quản lý lợi nhuận
      </QuoteBlock>
    </>
  ),
  tr: () => (
    <>
      <QuoteBlock>
        Yüksek frekanslı ticarette komisyonlar kârdır
      </QuoteBlock>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Strong>Komisyonlar + Kayma = Gizli kayıp</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Bu, birçok trader&apos;ın görmezden geldiği bir kısım.<br />
        Kâr ettiğinizi düşünüyorsunuz ama aslında <Strong>komisyonlar ve kayma</Strong><br />
        kârınızın önemli bir kısmını yiyor.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Limit vs Market</SectionTitle>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-emerald-400/70 mb-1 md:mb-2">Limit Emri</div>
          <div className="text-2xl md:text-4xl font-bold text-emerald-400 mb-2">0.02%</div>
          <div className="text-xs md:text-sm text-foreground/60">Maker Komisyonu</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <div className="text-xs md:text-sm text-red-400/70 mb-1 md:mb-2">Market Emri</div>
          <div className="text-2xl md:text-4xl font-bold text-red-400 mb-2">0.05%</div>
          <div className="text-xs md:text-sm text-foreground/60">Taker Komisyonu</div>
        </div>
      </div>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl">
          <Accent>2.5 kat fark</Accent>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Kayma (Slippage) nedir?</SectionTitle>

      <Paragraph>
        <Strong>Kayma</Strong>, beklenen fiyat ile<br />
        gerçek uygulama fiyatı arasındaki farktır.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-2">1 milyarlık market alımı</div>
          <div className="text-foreground/70">→ Kayma <Strong>-%2 kayba</Strong> neden olabilir</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Kısa vadeli kâr yerine sürdürülebilirliği seçtik
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Tüm BUYLOW programları<br />
          <Strong>%100 limit emir</Strong> tabanlı tasarlandı
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>VIP komisyon tasarruf stratejisi</SectionTitle>

      {/* VIP Cards - Mobile Vertical Stack */}
      <div className="my-8 flex flex-col gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 px-2 py-1 bg-cyan-500 text-xs font-bold text-white rounded-bl-lg">Önerilen</div>
          <div className="text-base font-bold text-cyan-400 mb-2">VIP 1</div>
          <div className="text-xl font-bold text-foreground">0.016%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">~%20 tasarruf</div>
        </div>
        <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-foreground/70 mb-2">VIP 2</div>
          <div className="text-xl font-bold text-foreground">0.015%</div>
          <div className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs inline-block mt-2">~%25 tasarruf</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center w-full">
          <div className="text-base font-bold text-amber-400 mb-2">VIP 3</div>
          <div className="text-xl font-bold text-amber-400">0.010%</div>
          <div className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 text-xs inline-block mt-2">~%50 tasarruf</div>
        </div>
      </div>

      <SectionDivider />

      <QuoteBlock>
        Komisyonları yönetmek getirileri yönetmektir
      </QuoteBlock>
    </>
  ),
}

// Q&A Content: BUYLOW BOT Q&A
const QnAContent = {
  ko: () => (
    <>
      {/* Q1. 1차 가두리 */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">1차 가두리는 무엇인가?</div>
        </div>

        <QuoteBlock>
          횡보장에서 수익을 극대화하는 구조
        </QuoteBlock>

        <BulletList items={[
          <><Strong>횡보 갭 내 매매</Strong> — 가격이 일정 범위 내에서 움직일 때 반복 매매</>,
          <><Strong>볼린저밴드 기반</Strong> — 상/하단 밴드를 기준으로 진입/청산</>,
          <><Strong>피보나치 0~1 기준</Strong> — 0.870 매수 → 0.5 익절</>,
        ]} />

        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">핵심 구조</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
            <div className="text-sm text-foreground/50 mt-2">반복 수익 구���</div>
          </div>
        </HighlightBox>
      </div>

      <SectionDivider />

      {/* Q2. 익절값 0.764 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">익절값 0.764는 무엇인가?</div>
        </div>

        <Paragraph>
          <Strong>1.236</Strong>에서 진입하고, <Accent>0.764</Accent>에서 익절하는 구조다.
        </Paragraph>

        <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
          <div className="text-center text-sm text-foreground/50 mb-4">익절 흐름</div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-full max-w-xs p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-center">
              <span className="text-cyan-400 font-medium">1.236 진입</span>
            </div>
            <div className="text-foreground/30">↓</div>
            <div className="w-full max-w-xs p-3 bg-foreground/5 border border-foreground/20 rounded-lg text-center">
              <span className="text-foreground font-medium">기준 재설정</span>
            </div>
            <div className="text-foreground/30">↓</div>
            <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
              <span className="text-emerald-400 font-medium">0.764 익절</span>
            </div>
          </div>
        </div>

        <CalloutBox type="info">
          커스터마이징 옵션: 0.618 / 0.5
        </CalloutBox>

        <Paragraph>
          고급 설정에서 익절값을 <Strong>0.618</Strong> 또는 <Strong>0.5</Strong>로 변경할 수 있다.
          수익률과 리스크의 균형을 조절할 수 있다.
        </Paragraph>
      </div>

      <SectionDivider />

      {/* Q3. 변동률 */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">변동률은 무엇인가?</div>
        </div>

        <QuoteBlock>
          진입할수록 물량이 증가하는 구조
        </QuoteBlock>

        <div className="my-8 grid md:grid-cols-2 gap-4" id="q3-static">
          <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
            <div className="text-sm text-foreground/50 mb-3 text-center">변동률 없음</div>
            <div className="flex items-center justify-center gap-2 font-mono">
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
            </div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
            <div className="text-sm text-cyan-400/70 mb-3 text-center">변동률 적용</div>
            <div className="flex items-center justify-center gap-2 font-mono">
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">10</span>
              <span className="text-foreground/30">→</span>
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">20</span>
              <span className="text-foreground/30">→</span>
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">30</span>
              <span className="text-foreground/30">→</span>
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">40</span>
            </div>
          </div>
        </div>

        <HighlightBox>
          <div className="space-y-3 text-center">
            <div className="font-bold text-foreground">핵심 효과</div>
            <div className="space-y-2 text-left">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-cyan-400 shrink-0"></span>
                <span className="text-foreground/80"><Strong>평균가 낮춤</Strong> — 하락 시 진입 단가 감소</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-cyan-400 shrink-0"></span>
                <span className="text-foreground/80"><Strong>반등 시 수익 극대화</Strong> — 물량이 많을수록 수익 증가</span>
              </div>
            </div>
          </div>
        </HighlightBox>

        <QuoteBlock>
          변동률은 생각보다 훨씬 강력하다
        </QuoteBlock>
      </div>

      <SectionDivider />

      {/* Q4. TP인데 PNL 손실이 나는 경우 */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">TP(익절)인데 PNL 손실이 나는 경우는?</div>
        </div>

        <Paragraph>
          최종 진입 시점부터 차트가 계속 하락하게 됐을 때<br />
          N차 진입이 지속되면서 <Strong>PNL(-%)가 될 수 있다</Strong>.
        </Paragraph>

        <CalloutBox type="info">
          프로그램은 순환매 로직으로 만들어져 있기 때문에<br />
          리스크 관리를 통해 포지션이 손실이라 할지라도 물량을 정리한다
        </CalloutBox>

        <SectionDivider />

        <SectionTitle>원리 설명</SectionTitle>

        <Paragraph>
          각 진입한 N차 진입 물량은 설정값에 따라 익절값도 정해져 있다.<br />
          따라서 1차부터 3차까지 진입했을 때<br />
          <Strong>포지션 PNL은 손실(-%)이 날 수도 있다</Strong>.
        </Paragraph>

        <div className="my-8 bg-foreground/5 border border-foreground/20 rounded-xl p-6">
          <div className="text-center space-y-4">
            <div className="text-foreground/70">3차 진입 물량이 설정값대로 익절 구간에 오면</div>
            <div className="text-lg font-bold text-foreground">포지션이 정리된다</div>
            <div className="text-foreground/70">PNL 상대로 물량을 정리하므로<br />확정손실(PNL) 상태에서 3차 진입 물량이 정리됨</div>
          </div>
        </div>

        <WarningBox>
          N차 진입 물량만 봤을 때 이득이지만<br />
          손실로 기록된다
        </WarningBox>

        <SectionDivider />

        <SectionTitle>결과론적으로 이득인 이유</SectionTitle>

        <HighlightBox>
          <Paragraph className="mb-0 text-center">
            N차 진입이 되면서 <Strong>평단가는 하락</Strong>했기 때문이다
          </Paragraph>
        </HighlightBox>

        <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
          <div className="text-center">
            <div className="text-sm text-foreground/50 mb-3">계산 공식</div>
            <div className="text-lg font-medium text-foreground">
              (N차 진입 후 평단가 하락) - (N차 물량 손실) = <span className="text-cyan-400">N차 물량 익절점</span>
            </div>
          </div>
        </div>

        <SectionDivider />

        <SectionTitle>실제 예시: BTC 90K → 60K 하락</SectionTitle>

        <Paragraph>
          위에서 N차 진입된 물량들이 쭉 물려있는 상태에서<br />
          포지션은 손실이 발생할 것이다.
        </Paragraph>

        <Paragraph>
          하지만 포지션이 손실 중인 상태에서<br />
          <Strong>N차 초기화 로직</Strong>으로 인해<br />
          프로그램은 지속적으로 사고 팔고를 할 것이다.
        </Paragraph>

        <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
          <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5 text-center">
            <div className="text-sm text-foreground/50 mb-2">하단 순환매 시</div>
            <div className="text-lg font-bold text-foreground">평단가 지속 하락</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
            <div className="text-sm text-foreground/50 mb-2">결과</div>
            <div className="text-lg font-bold text-red-400">확정손실 지속 발생</div>
          </div>
        </div>

        <HighlightBox>
          <Paragraph className="mb-0 text-center">
            밑에서 순환매를 하는 행위 자체로 본다면<br />
            <Strong>(평단가 하락) - (확정 손실) = N차 진입 순환매 결과</Strong><br />
            <span className="text-emerald-400">이기에 이득이다</span>
          </Paragraph>
        </HighlightBox>

        <CalloutBox type="success">
          직접 프로그램이 순환매를 하는 것을 본다면<br />
          지금 책에서 하는 이야기가 무슨 이야기인지 알게 될 것이다
        </CalloutBox>

        <QuoteBlock>
          요약: 차트가 크게 하락할 때<br />
          마이너스 손실이 나는 상태에서 물량을 정리하는 것은<br />
          사실상 N차 진입 물량 자체로만 봤을 때 [진입 → 익절]이다
        </QuoteBlock>
      </div>

      <SectionDivider />

      {/* Q5. 자산 배분을 해야하는 이유 */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">자산 배분을 해야하는 이유가 있을까요?</div>
        </div>

        <Paragraph>
          BUYLOW AI 프로그램은 <Strong>자산의 하방이 막혀있다는 전제</Strong>하에<br />
          순환매 프로그램을 만들었다.
        </Paragraph>

        <CalloutBox type="info">
          역사적으로 금, 나스닥 등의 자산들은<br />
          100년 이상 우상향한 자산이고 앞으로도 우상향할 것이다
        </CalloutBox>

        <SectionDivider />

        <SectionTitle>금융시장의 불확실성</SectionTitle>

        <WarningBox>
          하지만 금융시장은 아무도 예측할 수 없는 일이 일어날 수 있다
        </WarningBox>

        <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-amber-400 mb-2">금</div>
            <div className="text-foreground/60">1주일만에 -30% 하락 가능</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-orange-400 mb-2">비트코인</div>
            <div className="text-foreground/60">하루만에 -20% 하락 가능</div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-cyan-400 mb-2">나스닥</div>
            <div className="text-foreground/60">1달만에 -30% 하락 가능</div>
          </div>
        </div>

        <Paragraph className="text-center text-foreground/60">
          위 내용들은 <Strong>1년 안에 발생했던 일</Strong>이다
        </Paragraph>

        <SectionDivider />

        <SectionTitle>리스크 시나리오</SectionTitle>

        <Paragraph>
          물론 결과론적으로 하방이 막혀 다시 반등을 해서<br />
          프로그램은 수익을 봤을 것이다.
        </Paragraph>

        <WarningBox>
          <Strong>하지만 자산 1개로 리스크를 크게 잡고 세팅했다면?</Strong><br /><br />
          만약 나스닥이나 금이 -50% 이상 빠지게 되고,<br />
          기술적 반등이 나오지 않는다면?
        </WarningBox>

        <QuoteBlock>
          BUYLOW AI 철학인 &quot;지속가능성&quot;에 위배가 된다
        </QuoteBlock>

        <SectionDivider />

        <SectionTitle>BUYLOW AI 3.0 분산화 시스템</SectionTitle>

        <HighlightBox>
          <Paragraph className="mb-0 text-center text-lg">
            따라서 <Strong>BUYLOW AI 3.0부터 분산화 시스템</Strong>을 넣어줬다
          </Paragraph>
        </HighlightBox>

        <div className="my-8 bg-foreground/5 border border-foreground/20 rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-foreground/50">예시 시나리오</div>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            <span className="px-4 py-2 bg-orange-500/20 rounded-lg text-orange-400">비트</span>
            <span className="text-foreground/40">+</span>
            <span className="px-4 py-2 bg-amber-500/20 rounded-lg text-amber-400">금</span>
            <span className="text-foreground/40">+</span>
            <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400">나스닥(QQQ)</span>
          </div>
          <div className="text-center text-foreground/70">3개 자산을 1번에 구동</div>
        </div>

        <Paragraph>
          비트코인이 <Strong>-50% 하락</Strong>한다고 했을 때,<br />
          여기서 금이나 나스닥은 <Strong>횡보 & 우상향</Strong>을 한다면<br />
          비트코인 손실을 엄청나게 방어해줄 것이다.
        </Paragraph>

        <HighlightBox>
          <Paragraph className="mb-0 text-center">
            <Strong>자산의 분산화</Strong>를 통해<br />
            개별 악재로 인해 하락할 수 있는<br />
            <Accent>예측할 수 없는 리스크에 대비</Accent>해야 한다
          </Paragraph>
        </HighlightBox>
      </div>

      <SectionDivider />

      {/* Q6. N차 진입 초기화 수동 방법 */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">N차 진입 초기화를 수동으로 하는 방법?</div>
        </div>

        <Paragraph>
          BUYLOW 퀀트 프로그램을 구동하다 보면,<br />
          <Strong>N차 진입 물량이 많이 쌓였거나</Strong><br />
          다시 1차 진입부터 하고 싶을 때가 있다.
        </Paragraph>

        <BulletList items={[
          "N차 진입 물량이 많이 쌓였을 때",
          "어떤 오류로 프로그램에서 진입이 안 될 때",
          "피보나치 격차가 넓어서 다음 진입 가격이 멀어졌을 때",
          "순환매 기회비용을 날릴 수 있는 상황",
        ]} />

        <SectionDivider />

        <SectionTitle>수동 초기화 방법</SectionTitle>

        <div className="my-8 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <div>
              <div className="text-foreground font-medium">Main Menu 클릭</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">2</span>
            </div>
            <div>
              <div className="text-foreground font-medium">초기화할 종목 선택</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">3</span>
            </div>
            <div>
              <div className="text-cyan-400 font-medium">&quot;피보나치 수동 초기화&quot; 버튼 클릭</div>
            </div>
          </div>
        </div>

        <HighlightBox>
          <Paragraph className="mb-0 text-center">
            프로그램이 모든 걸 초기화시키고<br />
            <Strong>다시 1차 진입부터 시작</Strong>한다
          </Paragraph>
        </HighlightBox>

        <CalloutBox type="info">
          이전에 프로그램이 진입했던 TP(익절주문)은 남아있음
        </CalloutBox>
      </div>

      <SectionDivider />

      {/* Q7. 숏 구동 수익률 */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">실 구동 수익률은?</div>
        </div>

        <QuoteBlock>
          롱과 숏의 손익비 차이는 엄청나다
        </QuoteBlock>

        <ComparisonBox
          leftTitle="롱 구동"
          leftItems={[
            "물려도 하방 제한",
            "최대 -99.99%",
            "회복 가능성 높음",
          ]}
          rightTitle="숏 구동"
          rightItems={[
            "물리면 무한 상승 가능",
            "손실 무제한",
            "회복 어려움",
          ]}
          lang="ko"
        />

        <WarningBox>
          <Strong>숏 구동은 조심해야 한다</Strong>
        </WarningBox>

        <Paragraph>
          금이나 나스닥 같은 경우는<br />
          핵전쟁 같은 상황이 나오지 않는 이상<br />
          <Strong>-50% 이상 하락하기 어렵다.</Strong>
        </Paragraph>

        <HighlightBox>
          <Paragraph className="mb-0 text-center">
            자산이 과도하게 상승한 것 같다면<br />
            <Strong>연수익률을 내리는 등</Strong><br />
            롱 베이스 위주로 구동하는 게 좋다
          </Paragraph>
        </HighlightBox>
      </div>
    </>
  ),
  en: () => (
    <>
      {/* Q1. First Rotation */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">What is the First Rotation?</div>
        </div>

        <QuoteBlock>
          A structure that maximizes profits in sideways markets
        </QuoteBlock>

        <BulletList items={[
          <><Strong>Trading within sideways gap</Strong> ��� Repeat trades when price moves in a range</>,
          <><Strong>Bollinger Bands based</Strong> — Entry/exit based on upper/lower bands</>,
          <><Strong>Fibonacci 0~1 basis</Strong> — 0.870 buy → 0.5 take profit</>,
        ]} />

        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">Core Structure</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
            <div className="text-sm text-foreground/50 mt-2">Repeated profit structure</div>
          </div>
        </HighlightBox>
      </div>

      <SectionDivider />

      {/* Q2. TP 0.764 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">What is TP 0.764?</div>
        </div>

        <Paragraph>
          Enter at <Strong>1.236</Strong> and take profit at <Accent>0.764</Accent>.
        </Paragraph>

        <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
          <div className="text-center text-sm text-foreground/50 mb-4">TP Flow</div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-full max-w-xs p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-center">
              <span className="text-cyan-400 font-medium">1.236 Entry</span>
            </div>
            <div className="text-foreground/30">↓</div>
            <div className="w-full max-w-xs p-3 bg-foreground/5 border border-foreground/20 rounded-lg text-center">
              <span className="text-foreground font-medium">Baseline Reset</span>
            </div>
            <div className="text-foreground/30">↓</div>
            <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
              <span className="text-emerald-400 font-medium">0.764 TP</span>
            </div>
          </div>
        </div>

        <CalloutBox type="info">
          Customization Options: 0.618 / 0.5
        </CalloutBox>
      </div>

      <SectionDivider />

      {/* Q3. Volatility Rate */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">What is Volatility Rate?</div>
        </div>

        <QuoteBlock>
          A structure where position size increases with each entry
        </QuoteBlock>

        <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
          <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
            <div className="text-sm text-foreground/50 mb-3 text-center">No Volatility</div>
            <div className="flex items-center justify-center gap-2 font-mono">
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
            </div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
            <div className="text-sm text-cyan-400/70 mb-3 text-center">With Volatility</div>
            <div className="flex items-center justify-center gap-2 font-mono">
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">10</span>
              <span className="text-foreground/30">→</span>
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">20</span>
              <span className="text-foreground/30">→</span>
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">30</span>
            </div>
          </div>
        </div>

        <QuoteBlock>
          Volatility rate is much more powerful than you think
        </QuoteBlock>
      </div>

      <SectionDivider />

      {/* Q4. TP with PNL Loss */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">Why PNL Loss During Take Profit (TP)?</div>
        </div>

        <Paragraph>
          When the chart continues to fall from the last entry point,<br />
          as N-entry continues, <Strong>PNL can become negative (-%).</Strong>
        </Paragraph>

        <CalloutBox type="info">
          The program is built with rotation logic,<br />
          so it clears positions for risk management even at a loss
        </CalloutBox>

        <SectionDivider />

        <SectionTitle>How It Works</SectionTitle>

        <Paragraph>
          Each N-entry position has a predetermined take-profit value.<br />
          Therefore, when entered from 1st to 3rd entry,<br />
          <Strong>position PNL may show a loss (-%).</Strong>
        </Paragraph>

        <div className="my-8 bg-foreground/5 border border-foreground/20 rounded-xl p-6">
          <div className="text-center space-y-4">
            <div className="text-foreground/70">When the 3rd entry reaches TP zone</div>
            <div className="text-lg font-bold text-foreground">Position is cleared</div>
            <div className="text-foreground/70">Since it clears based on PNL,<br />3rd entry is closed at confirmed loss (PNL) state</div>
          </div>
        </div>

        <WarningBox>
          Looking at just the N-entry position, it&apos;s profitable,<br />
          but recorded as a loss
        </WarningBox>

        <SectionDivider />

        <SectionTitle>Why It&apos;s Actually Profitable</SectionTitle>

        <HighlightBox>
          <Paragraph className="mb-0 text-center">
            Because the <Strong>average entry price dropped</Strong> with N-entry
          </Paragraph>
        </HighlightBox>

        <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
          <div className="text-center">
            <div className="text-sm text-foreground/50 mb-3">Formula</div>
            <div className="text-lg font-medium text-foreground">
              (Avg Price Drop After N-Entry) - (N-Entry Loss) = <span className="text-cyan-400">N-Entry TP Value</span>
            </div>
          </div>
        </div>

        <QuoteBlock>
          Summary: When closing positions at loss during big drops,<br />
          for the N-entry itself, it&apos;s [Entry → Take Profit]
        </QuoteBlock>
      </div>

      <SectionDivider />

      {/* Q5. Why Diversify Assets */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">Why Should You Diversify Assets?</div>
        </div>

        <Paragraph>
          The BUYLOW AI program is built on the premise that<br />
          <Strong>asset downside is limited</Strong>.
        </Paragraph>

        <CalloutBox type="info">
          Historically, gold, Nasdaq, etc. have been<br />
          upward trending for 100+ years and will continue
        </CalloutBox>

        <SectionDivider />

        <SectionTitle>Market Uncertainty</SectionTitle>

        <WarningBox>
          However, the financial market can experience unpredictable events
        </WarningBox>

        <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-amber-400 mb-2">Gold</div>
            <div className="text-foreground/60">Can drop -30% in 1 week</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-orange-400 mb-2">Bitcoin</div>
            <div className="text-foreground/60">Can drop -20% in 1 day</div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-cyan-400 mb-2">Nasdaq</div>
            <div className="text-foreground/60">Can drop -30% in 1 month</div>
          </div>
        </div>

        <SectionDivider />

        <SectionTitle>BUYLOW AI 3.0 Diversification System</SectionTitle>

        <HighlightBox>
          <Paragraph className="mb-0 text-center text-lg">
            <Strong>BUYLOW AI 3.0 includes a diversification system</Strong>
          </Paragraph>
        </HighlightBox>

        <div className="my-8 bg-foreground/5 border border-foreground/20 rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-foreground/50">Example Scenario</div>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            <span className="px-4 py-2 bg-orange-500/20 rounded-lg text-orange-400">BTC</span>
            <span className="text-foreground/40">+</span>
            <span className="px-4 py-2 bg-amber-500/20 rounded-lg text-amber-400">Gold</span>
            <span className="text-foreground/40">+</span>
            <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400">Nasdaq (QQQ)</span>
          </div>
          <div className="text-center text-foreground/70">Run 3 assets at once</div>
        </div>

        <Paragraph>
          If Bitcoin drops <Strong>-50%</Strong>,<br />
          but gold and Nasdaq <Strong>stay sideways or up</Strong>,<br />
          they will greatly offset the Bitcoin loss.
        </Paragraph>

        <HighlightBox>
          <Paragraph className="mb-0 text-center">
            Through <Strong>asset diversification</Strong>,<br />
            prepare for <Accent>unpredictable risks</Accent><br />
            from individual asset issues
          </Paragraph>
        </HighlightBox>
      </div>

      <SectionDivider />

      {/* Q6. Manual N-Entry Reset */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">How to Manually Reset N-Entry?</div>
        </div>

        <Paragraph>
          While running the BUYLOW quant program,<br />
          there may be times when <Strong>N-entry positions pile up</Strong><br />
          or you want to start fresh from the first entry.
        </Paragraph>

        <BulletList items={[
          "When N-entry positions accumulate too much",
          "When the program has errors and entries are not being made",
          "When the Fibonacci gap widens and next entry price is far away",
          "Situations where rotation opportunity cost may be lost",
        ]} />

        <SectionDivider />

        <SectionTitle>Manual Reset Method</SectionTitle>

        <div className="my-8 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <div>
              <div className="text-foreground font-medium">Click Main Menu</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">2</span>
            </div>
            <div>
              <div className="text-foreground font-medium">Select the asset to reset</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">3</span>
            </div>
            <div>
              <div className="text-cyan-400 font-medium">Click &quot;Fibonacci Manual Reset&quot; button</div>
            </div>
          </div>
        </div>

        <HighlightBox>
          <Paragraph className="mb-0 text-center">
            The program will reset everything and<br />
            <Strong>start again from the first entry</Strong>
          </Paragraph>
        </HighlightBox>

        <CalloutBox type="info">
          Previous TP (take profit) orders will remain
        </CalloutBox>
      </div>

      <SectionDivider />

      {/* Q7. Short Position Returns */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">What About Short Position Returns?</div>
        </div>

        <QuoteBlock>
          The profit/loss ratio difference between long and short is enormous
        </QuoteBlock>

        <ComparisonBox
          leftTitle="Long Position"
          leftItems={[
            "Limited downside even if stuck",
            "Maximum -99.99%",
            "High recovery potential",
          ]}
          rightTitle="Short Position"
          rightItems={[
            "Unlimited upside risk if stuck",
            "Unlimited potential loss",
            "Difficult to recover",
          ]}
          lang="en"
        />

        <WarningBox>
          <Strong>Be careful with short positions</Strong>
        </WarningBox>

        <Paragraph>
          For assets like gold or Nasdaq,<br />
          unless something like nuclear war happens,<br />
          <Strong>it&apos;s unlikely to drop more than -50%.</Strong>
        </Paragraph>

        <HighlightBox>
          <Paragraph className="mb-0 text-center">
            If the asset seems to have risen excessively,<br />
            <Strong>lower the annual return target</Strong><br />
            and operate mainly on a long basis
          </Paragraph>
        </HighlightBox>
      </div>
    </>
  ),
  // Translated versions for 8 languages - Q1~Q7 complete
  zh: () => (
    <>
      {/* Q1 */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">什么是1次循环交易？</div>
        </div>
        <QuoteBlock>在横盘市场最大化收益的结构</QuoteBlock>
        <BulletList items={[
          <><Strong>横盘区间交易</Strong> — 价格在一定范围内波动时反复交易</>,
          <><Strong>基于布林带</Strong> — 根据上下轨进出</>,
          <><Strong>斐波那契0~1基准</Strong> — 0.870买入 → 0.5止盈</>,
        ]} />
        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">核心结构</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
            <div className="text-sm text-foreground/50 mt-2">重复收益结构</div>
          </div>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q2 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">止盈值0.764是什么？</div>
        </div>
        <Paragraph>在<Strong>1.236</Strong>入场，在<Accent>0.764</Accent>止盈。</Paragraph>
        <CalloutBox type="info">自定义选项：0.618 / 0.5</CalloutBox>
      </div>
      <SectionDivider />

      {/* Q3 */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">什么是变动率？</div>
        </div>
        <QuoteBlock>每次入场数量增加的结构</QuoteBlock>
        <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
          <div className="bg-foreground/5 border border-foreground/20 rounded-xl p-5">
            <div className="text-sm text-foreground/50 mb-3 text-center">无变动率</div>
            <div className="flex items-center justify-center gap-2 font-mono">
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
              <span className="px-3 py-1 bg-foreground/10 rounded">10</span>
            </div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
            <div className="text-sm text-cyan-400/70 mb-3 text-center">应用变动率</div>
            <div className="flex items-center justify-center gap-2 font-mono">
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">10</span>
              <span className="text-foreground/30">→</span>
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">20</span>
              <span className="text-foreground/30">→</span>
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-cyan-400">30</span>
            </div>
          </div>
        </div>
        <QuoteBlock>变动率比你想象的强大得多</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q4 */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">为什么止盈(TP)时PNL会亏损？</div>
        </div>
        <Paragraph>当图表从最后入场点持续下跌时，随着N次入场继续，<Strong>PNL可能变为负数(-%)。</Strong></Paragraph>
        <CalloutBox type="info">程序采用循环交易逻辑，为了风险管理，即使在亏损状态下也会清仓</CalloutBox>
        <SectionTitle>为什么实际上是盈利的</SectionTitle>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">因为N次入场后<Strong>平均入场价下降了</Strong></Paragraph>
        </HighlightBox>
        <QuoteBlock>总��：大跌时以亏损状态平仓，从N次入场本身来看是[入场 → 止盈]</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q5 */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">为什么需要分散投资？</div>
        </div>
        <Paragraph>BUYLOW AI程序基于<Strong>资产下行空间有限</Strong>的前提构建循环交易程序。</Paragraph>
        <CalloutBox type="info">历史上，黄金、纳斯达克等资产已经上涨100多年，未来也将继续上涨</CalloutBox>
        <WarningBox>但金融市场可能发生不可预测的事件</WarningBox>
        <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-amber-400 mb-2">黄金</div>
            <div className="text-foreground/60">1周内可能下跌-30%</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-orange-400 mb-2">比特币</div>
            <div className="text-foreground/60">1天内可能下跌-20%</div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-cyan-400 mb-2">纳斯达克</div>
            <div className="text-foreground/60">1个月内可能下跌-30%</div>
          </div>
        </div>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">因此<Strong>BUYLOW AI 3.0加入了分散化系统</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q6 */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">如何手动重置N次入场？</div>
        </div>
        <Paragraph>在运行BUYLOW量化程序时，可能会有<Strong>N次���场仓位堆积太多</Strong>或想从第一次入场重新开始��时候。</Paragraph>
        <BulletList items={[
          "N次入场仓位堆积太多时",
          "程序出错无法入场时",
          "斐波那契间距扩大下一入场价太远时",
          "可能损失循环交易机会成本的情况",
        ]} />
        <SectionTitle>手动重置方法</SectionTitle>
        <div className="my-8 space-y-4">
          {["点击主菜单", "选择要重置的品种", "点击\"斐波那契手动重置\"按钮"].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold">{i + 1}</span>
              </div>
              <div><div className="text-foreground font-medium">{text}</div></div>
            </div>
          ))}
        </div>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">程序会重置所有内容并<Strong>从第一次入场重新开始</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q7 */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">做空收益如何？</div>
        </div>
        <QuoteBlock>做多和做空的盈亏比差异巨大</QuoteBlock>
        <ComparisonBox
          leftTitle="做多"
          leftItems={["即使被套下方有限", "最大-99.99%", "恢复可能性高"]}
          rightTitle="做空"
          rightItems={["被套可能无限上涨", "亏损无限", "难以恢复"]}
          lang="zh"
        />
        <WarningBox><Strong>做空需要谨慎</Strong></WarningBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">如果资产看起来过度上涨，<Strong>降低年收益率</Strong>以做多为主运行比较好</Paragraph>
        </HighlightBox>
      </div>
    </>
  ),
  ar: () => (
    <>
      {/* Q1 */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">ما هو التدوير الأول؟</div>
        </div>
        <QuoteBlock>هيكل يعظم الأرباح في الأسواق الجانبية</QuoteBlock>
        <BulletList items={[
          <><Strong>التداول ضمن النطاق</Strong> — تداولات متكررة عندما يتحرك السعر في نطاق</>,
          <><Strong>بناءً على البولنجر</Strong> — دخول/خروج على النطاقات</>,
          <><Strong>فيبوناتشي 0~1</Strong> — 0.870 شراء → 0.5 جني أرباح</>,
        ]} />
        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">الهيكل الأساسي</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
          </div>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q2 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">ما هو TP 0.764؟</div>
        </div>
        <Paragraph>دخول عند <Strong>1.236</Strong> وجني أرباح عند <Accent>0.764</Accent>.</Paragraph>
        <CalloutBox type="info">خيارات التخصيص: 0.618 / 0.5</CalloutBox>
      </div>
      <SectionDivider />

      {/* Q3 */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">ما هو معدل التقلب؟</div>
        </div>
        <QuoteBlock>هيكل يزداد فيه حجم المركز مع كل دخول</QuoteBlock>
        <QuoteBlock>معدل التقلب أقوى بكثير مما تعتقد</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q4 */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">لماذا خسارة PNL عند جني الأرباح؟</div>
        </div>
        <Paragraph>عندما يستمر الرسم في الهبوط، مع استمرار الدخول N، <Strong>قد يصبح PNL سالبًا.</Strong></Paragraph>
        <CalloutBox type="info">البرنامج مبني على منطق التدوير، لذا يغلق المراكز لإدارة المخاطر حتى لو بخسارة</CalloutBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">لأن <Strong>متوسط سعر الدخول انخفض</Strong> مع الدخول N</Paragraph>
        </HighlightBox>
        <QuoteBlock>ملخص: إغلاق المراكز بخسارة أثناء الهبوط الكبير، للدخول N نفسه هو [دخول → جني أرباح]</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q5 */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">لماذا يجب التنويع؟</div>
        </div>
        <Paragraph>برنامج BUYLOW AI مبني على فرضية أن <Strong>الهبوط محدود</Strong>.</Paragraph>
        <WarningBox>لكن ��لسوق المالي قد يشهد أحداثًا غير متوقعة</WarningBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">لذا <Strong>BUYLOW AI 3.0 يتضمن نظام تنويع</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q6 */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">كيفية إعادة تعيين الدخول N يدوياً؟</div>
        </div>
        <div className="my-8 space-y-4">
          {["انقر على القائمة الر��يسية", "اختر الأصل للإعادة", "انقر زر \"إعادة فيبوناتشي اليدوية\""].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold">{i + 1}</span>
              </div>
              <div><div className="text-foreground font-medium">{text}</div></div>
            </div>
          ))}
        </div>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">ال��رنامج سيعيد كل شيء و<Strong>يبدأ من الدخول ��لأول</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q7 */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">ماذا عن عوائد المراكز القصيرة؟</div>
        </div>
        <QuoteBlock>فرق نسبة الربح/الخسارة بين الطويل والقصير ضخم</QuoteBlock>
        <ComparisonBox
          leftTitle="مركز طويل"
          leftItems={["هبوط محدود حتى لو عالق", "أقصى -99.99%", "إمكانية استرداد عالية"]}
          rightTitle="مركز قصير"
          rightItems={["صعود غير محدود إذا عالق", "خسارة محتملة غير محدودة", "صعب الاسترداد"]}
          lang="ar"
        />
        <WarningBox><Strong>كن حذرًا مع المراكز القصيرة</Strong></WarningBox>
      </div>
    </>
  ),
  ru: () => (
    <>
      {/* Q1 */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">Что такое первая ротация?</div>
        </div>
        <QuoteBlock>Структура, максимизирующая прибыль на боков��х рынках</QuoteBlock>
        <BulletList items={[
          <><Strong>Торговля в диапазоне</Strong> — повторные сделки при движении цены в диапазоне</>,
          <><Strong>На основе полос Бол��инджера</Strong> — вход/выход по полосам</>,
          <><Strong>Фибоначчи 0~1</Strong> — 0.870 покупка → 0.5 фиксация прибыли</>,
        ]} />
        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">Основная структура</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
          </div>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q2 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">Что такое TP 0.764?</div>
        </div>
        <Paragraph>Вход на <Strong>1.236</Strong> и фиксация прибыли на <Accent>0.764</Accent>.</Paragraph>
        <CalloutBox type="info">Опции настройки: 0.618 / 0.5</CalloutBox>
      </div>
      <SectionDivider />

      {/* Q3 */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">Что такое коэффициент волатильности?</div>
        </div>
        <QuoteBlock>Структура, где размер позиции увеличивается с каждым входом</QuoteBlock>
        <QuoteBlock>Коэффици��нт волатильн��сти мощнее, чем вы думаете</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q4 */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">Почему PNL убыточен при фиксации прибыли?</div>
        </div>
        <Paragraph>Когда график продолжает падать, с продолжением N-входа <Strong>PNL может стать отрицательным.</Strong></Paragraph>
        <CalloutBox type="info">Программа построена на логике ротации, закрывая позиции для ��правления рисками даже с убытком</CalloutBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Потому что <Strong>средняя цена входа снизилась</Strong> с N-входом</Paragraph>
        </HighlightBox>
        <QuoteBlock>Итого: Закрытие позиций с убытком при больших падениях, для самого N-входа это [Вход → Фиксация прибыли]</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q5 */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">Зачем диверсифицировать?</div>
        </div>
        <Paragraph>Программа BUYLOW AI построена на предпосылке, что <Strong>падение актива ограничено</Strong>.</Paragraph>
        <WarningBox>Однако на финансовом рынке могут происходить ��епредска��уемые события</WarningBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Поэтому <Strong>BUYLOW AI 3.0 включает систему диверсификации</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q6 */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">Как сбросить N-вход вручную?</div>
        </div>
        <div className="my-8 space-y-4">
          {["Нажмите Главное меню", "Выберите актив для сброса", "Нажмите кнопку \"Ручной сброс Фибоначчи\""].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold">{i + 1}</span>
              </div>
              <div><div className="text-foreground font-medium">{text}</div></div>
            </div>
          ))}
        </div>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Программа всё сбросит и <Strong>начнёт снова с первого входа</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q7 */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">Какова доходность коротких позиций?</div>
        </div>
        <QuoteBlock>Разница соотношения прибыли/убытка между лонгом и шортом огромна</QuoteBlock>
        <ComparisonBox
          leftTitle="Длинная позиция"
          leftItems={["О��раниченное падение даже при застревании", "Максимум -99.99%", "Высокий потенциал восстановления"]}
          rightTitle="Короткая позиция"
          rightItems={["Неограниченный рост при застревании", "Неограниченный потенциал убытка", "Трудно восстановиться"]}
          lang="ru"
        />
        <WarningBox><Strong>Будьте осторожны с короткими позициями</Strong></WarningBox>
      </div>
    </>
  ),
  es: () => (
    <>
      {/* Q1 */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">¿Qué es la primera rotación?</div>
        </div>
        <QuoteBlock>Una estructura que maximiza ganancias en mercados laterales</QuoteBlock>
        <BulletList items={[
          <><Strong>Operar dentro del rango</Strong> — Operaciones repetidas cuando el precio se mueve en un rango</>,
          <><Strong>Basado en Bollinger</Strong> — Entrada/salida en las bandas</>,
          <><Strong>Fibonacci 0~1</Strong> — 0.870 compra → 0.5 toma de ganancias</>,
        ]} />
        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">Estructura central</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
          </div>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q2 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">¿Qué es TP 0.764?</div>
        </div>
        <Paragraph>Entrada en <Strong>1.236</Strong> y toma de ganancias en <Accent>0.764</Accent>.</Paragraph>
        <CalloutBox type="info">Opciones de personalización: 0.618 / 0.5</CalloutBox>
      </div>
      <SectionDivider />

      {/* Q3 */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">¿Qué es la tasa de volatilidad?</div>
        </div>
        <QuoteBlock>Una estructura donde el tamaño de posición aumenta con cada entrada</QuoteBlock>
        <QuoteBlock>La tasa de volatilidad es mucho más poderosa de lo que crees</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q4 */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">¿Por qué pérdida PNL al tomar ganancias?</div>
        </div>
        <Paragraph>Cuando el gráfico sigue cayendo, con la entrada N continuando, <Strong>PNL puede volverse negativo.</Strong></Paragraph>
        <CalloutBox type="info">El programa está construido con lógica de rotación, cerrando posiciones para gestión de riesgos incluso con pérdida</CalloutBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Porque el <Strong>precio promedio de entrada bajó</Strong> con la entrada N</Paragraph>
        </HighlightBox>
        <QuoteBlock>Resumen: Cerrar posiciones con pérdida durante grandes caídas, para la entrada N misma es [Entrada ��� Toma de ganancias]</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q5 */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">¿Por qué diversificar?</div>
        </div>
        <Paragraph>El programa BUYLOW AI se basa en la premisa de que <Strong>la caída del activo es limitada</Strong>.</Paragraph>
        <WarningBox>Sin embargo, el mercado financiero puede experimentar eventos impredecibles</WarningBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Por eso <Strong>BUYLOW AI 3.0 incluye un sistema de diversificación</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q6 */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">¿Cómo reiniciar entrada N manualmente?</div>
        </div>
        <div className="my-8 space-y-4">
          {["Clic en Menú Principal", "Seleccionar activo a reiniciar", "Clic en botón \"Reinicio Manual Fibonacci\""].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold">{i + 1}</span>
              </div>
              <div><div className="text-foreground font-medium">{text}</div></div>
            </div>
          ))}
        </div>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">El programa reiniciará todo y <Strong>comenzará de nuevo desde la primera entrada</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q7 */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">¿Qué hay de los retornos de posiciones cortas?</div>
        </div>
        <QuoteBlock>La diferencia de ratio ganancia/pérdida entre largo y corto es enorme</QuoteBlock>
        <ComparisonBox
          leftTitle="Posición larga"
          leftItems={["Caída limitada aunque estés atrapado", "Máximo -99.99%", "Alto potencial de recuperación"]}
          rightTitle="Posición corta"
          rightItems={["Subida ilimitada si estás atrapado", "Pérdida potencial ilimitada", "Difícil recuperarse"]}
          lang="es"
        />
        <WarningBox><Strong>Ten cuidado con las posiciones cortas</Strong></WarningBox>
      </div>
    </>
  ),
  id: () => (
    <>
      {/* Q1 */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">Apa itu Rotasi Pertama?</div>
        </div>
        <QuoteBlock>Struktur yang memaksimalkan profit di pasar sideways</QuoteBlock>
        <BulletList items={[
          <><Strong>Trading dalam range</Strong> — Trade berulang saat harga bergerak dalam range</>,
          <><Strong>Berbasis Bollinger</Strong> — Entry/exit di band</>,
          <><Strong>Fibonacci 0~1</Strong> — 0.870 beli → 0.5 take profit</>,
        ]} />
        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">Struktur Inti</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
          </div>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q2 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">Apa itu TP 0.764?</div>
        </div>
        <Paragraph>Entry di <Strong>1.236</Strong> dan take profit di <Accent>0.764</Accent>.</Paragraph>
        <CalloutBox type="info">Opsi kustomisasi: 0.618 / 0.5</CalloutBox>
      </div>
      <SectionDivider />

      {/* Q3 */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">Apa itu Volatility Rate?</div>
        </div>
        <QuoteBlock>Struktur di mana ukuran posisi meningkat setiap entry</QuoteBlock>
        <QuoteBlock>Volatility rate jauh lebih powerful dari yang Anda kira</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q4 */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">Mengapa PNL rugi saat Take Profit?</div>
        </div>
        <Paragraph>Saat chart terus turun, dengan N-entry berlanjut, <Strong>PNL bisa menjadi negatif.</Strong></Paragraph>
        <CalloutBox type="info">Program dibangun dengan logika rotasi, menutup posisi untuk manajemen risiko bahkan saat rugi</CalloutBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Karena <Strong>harga rata-rata entry turun</Strong> dengan N-entry</Paragraph>
        </HighlightBox>
        <QuoteBlock>Ringkasan: Menutup posisi rugi saat penurunan besar, untuk N-entry sendiri adalah [Entry → Take Profit]</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q5 */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">Mengapa harus diversifikasi?</div>
        </div>
        <Paragraph>Program BUYLOW AI dibangun dengan premis bahwa <Strong>penurunan aset terbatas</Strong>.</Paragraph>
        <WarningBox>Namun, pasar keuangan bisa mengalami kejadian tak terduga</WarningBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Oleh karena itu <Strong>BUYLOW AI 3.0 menyertakan sistem diversifikasi</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q6 */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">Bagaimana reset N-Entry manual?</div>
        </div>
        <div className="my-8 space-y-4">
          {["Klik Main Menu", "Pilih aset untuk reset", "Klik tombol \"Fibonacci Manual Reset\""].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold">{i + 1}</span>
              </div>
              <div><div className="text-foreground font-medium">{text}</div></div>
            </div>
          ))}
        </div>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Program akan reset semuanya dan <Strong>mulai lagi dari entry pertama</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q7 */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">Bagaimana return posisi short?</div>
        </div>
        <QuoteBlock>Perbedaan rasio profit/loss antara long dan short sangat besar</QuoteBlock>
        <ComparisonBox
          leftTitle="Posisi Long"
          leftItems={["Penurunan terbatas meski terjebak", "Maksimum -99.99%", "Potensi recovery tinggi"]}
          rightTitle="Posisi Short"
          rightItems={["Kenaikan tak terbatas jika terjebak", "Potensi kerugian tak terbatas", "Sulit recovery"]}
          lang="id"
        />
        <WarningBox><Strong>Hati-hati dengan posisi short</Strong></WarningBox>
      </div>
    </>
  ),
  th: () => (
    <>
      {/* Q1 */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">First Rotation คืออะไร?</div>
        </div>
        <QuoteBlock>โครงสร้างที่เพิ่มกำไรสูงสุดในตลาด Sideways</QuoteBlock>
        <BulletList items={[
          <><Strong>เทรดในช่วง</Strong> — เทรดซ้ำเมื่อราคาเคลื่อนในช่วง</>,
          <><Strong>ใช้ Bollinger</Strong> — เข้า/ออกที่แถบ</>,
          <><Strong>Fibonacci 0~1</Strong> — 0.870 ซื้อ → 0.5 take profit</>,
        ]} />
        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">โครงสร้างหลัก</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
          </div>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q2 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">TP 0.764 คืออะไร?</div>
        </div>
        <Paragraph>เข้าที่ <Strong>1.236</Strong> และ take profit ที่ <Accent>0.764</Accent></Paragraph>
        <CalloutBox type="info">ตัวเลือกปรับแต่ง: 0.618 / 0.5</CalloutBox>
      </div>
      <SectionDivider />

      {/* Q3 */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">Volatility Rate คืออะไร?</div>
        </div>
        <QuoteBlock>โครงสร้างที่ขนาดโพซิชันเพิ่มขึ้นทุกครั้งที่เข้า</QuoteBlock>
        <QuoteBlock>Volatility rate ทรงพลังกว่าที่คุณคิดมาก</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q4 */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">ทำไม PNL ขาดทุนตอน Take Profit?</div>
        </div>
        <Paragraph>เมื่อกราฟลงต่อเนื่��ง เมื่อ N-entry ดำเนินต่อ <Strong>PNL อาจ��ลายเป็นลบ</Strong></Paragraph>
        <CalloutBox type="info">���ปรแกรมสร้างด้วย rotation logic ปิดโพซิชันเพื่อจัดการความเสี่ยงแม้จะขาดทุน</CalloutBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">เพราะ<Strong>ราคาเฉลี่ยเข้าลดลง</Strong>กับ N-entry</Paragraph>
        </HighlightBox>
        <QuoteBlock>สรุป: ปิดโพซิชันขาดทุนตอนร่วงใหญ่ สำหรับ N-entry เองคือ [Entry → Take Profit]</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q5 */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">ทำไม��้องกระจายความเสี่ยง?</div>
        </div>
        <Paragraph>โปรแกรม BUYLOW AI สร้างบนสมมติฐานว่า<Strong>การลงของสินทรัพย์จำกัด</Strong></Paragraph>
        <WarningBox>อย่างไรก็ตาม ตลา���การเงินอาจเกิดเหตุการณ์ที่คาดไม่ถึง</WarningBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">ดังนั้น <Strong>BUYLOW AI 3.0 รวมระบบกระจาย��วามเสี่ยง</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q6 */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">รีเซ็ต N-Entry แบบ Manual อย่างไร?</div>
        </div>
        <div className="my-8 space-y-4">
          {["คลิก Main Menu", "เลือกสินทร���พย์ที่จะรี��ซ็ต", "คลิกปุ่ม \"Fibonacci Manual Reset\""].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold">{i + 1}</span>
              </div>
              <div><div className="text-foreground font-medium">{text}</div></div>
            </div>
          ))}
        </div>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">โปรแกรมจะรีเซ็ตทุกอย่างและ<Strong>เริ่มใหม่จาก entry แ�����</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q7 */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">ผลตอบแทน Short Position เป็นอย่างไร?</div>
        </div>
        <QuoteBlock>ความแตกต่างของอัตรากำไร/ขาดทุนระหว่าง long และ short มหาศาล</QuoteBlock>
        <ComparisonBox
          leftTitle="Long Position"
          leftItems={["ขาลงจำกัดแม้��ิด", "สูงสุด -99.99%", "ศักยภาพฟื้นตัวสูง"]}
          rightTitle="Short Position"
          rightItems={["ขาขึ้นไม่จำกัดถ้าติด", "ศักยภาพขาดทุนไม่จำกัด", "ฟื้นตัวยาก"]}
          lang="th"
        />
        <WarningBox><Strong>ระวังกับ short position</Strong></WarningBox>
      </div>
    </>
  ),
  vi: () => (
    <>
      {/* Q1 */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">First Rotation là gì?</div>
        </div>
        <QuoteBlock>Cấu trúc tối đa hóa lợi nhuận trong thị trường sideway</QuoteBlock>
        <BulletList items={[
          <><Strong>Giao dịch trong range</Strong> — Giao dịch lặp lại khi giá di chuyển trong range</>,
          <><Strong>Dựa trên Bollinger</Strong> — Vào/ra tại các dải</>,
          <><Strong>Fibonacci 0~1</Strong> — 0.870 mua → 0.5 chốt lời</>,
        ]} />
        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">Cấu trúc cốt lõi</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
          </div>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q2 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">TP 0.764 là gì?</div>
        </div>
        <Paragraph>Vào tại <Strong>1.236</Strong> và chốt lời t���i <Accent>0.764</Accent>.</Paragraph>
        <CalloutBox type="info">Tùy chọn tùy chỉnh: 0.618 / 0.5</CalloutBox>
      </div>
      <SectionDivider />

      {/* Q3 */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">Volatility Rate là gì?</div>
        </div>
        <QuoteBlock>Cấu trúc mà kích thước vị thế tăng với mỗi lần vào</QuoteBlock>
        <QuoteBlock>Volatility rate mạnh mẽ hơn bạn nghĩ nhiều</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q4 */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">Tại sao PNL lỗ khi Take Profit?</div>
        </div>
        <Paragraph>Khi chart tiếp tục giảm, với N-entry tiếp tục, <Strong>PNL có thể trở nên âm.</Strong></Paragraph>
        <CalloutBox type="info">Chương trình được xây dựng với logic rotation, đóng vị thế để quản lý rủi ro ngay cả khi lỗ</CalloutBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Vì <Strong>giá vào trung bình giảm</Strong> với N-entry</Paragraph>
        </HighlightBox>
        <QuoteBlock>Tóm tắt: Đóng vị thế lỗ khi giảm lớn, cho bản thân N-entry là [Vào → Chốt lời]</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q5 */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">Tại sao nên đa dạng hóa?</div>
        </div>
        <Paragraph>Chương trình BUYLOW AI được xây dựng trên tiền đề rằng <Strong>giảm của tài sản có giới hạn</Strong>.</Paragraph>
        <WarningBox>Tuy nhiên, thị trường tài chính có thể gặp sự kiện không thể đoán trước</WarningBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Vì vậy <Strong>BUYLOW AI 3.0 bao gồm hệ thống đa dạng hóa</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q6 */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">Cách Reset N-Entry thủ công?</div>
        </div>
        <div className="my-8 space-y-4">
          {["Nhấn Main Menu", "Chọn tài sản để reset", "Nhấn nút \"Fibonacci Manual Reset\""].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold">{i + 1}</span>
              </div>
              <div><div className="text-foreground font-medium">{text}</div></div>
            </div>
          ))}
        </div>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Chương trình sẽ reset mọi thứ và <Strong>bắt đầu lại từ entry đầu tiên</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q7 */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">Lợi nhuận vị thế Short như thế nào?</div>
        </div>
        <QuoteBlock>Sự khác biệt tỷ lệ lãi/lỗ giữa long và short rất lớn</QuoteBlock>
        <ComparisonBox
          leftTitle="Vị thế Long"
          leftItems={["Giảm giới hạn dù bị kẹt", "Tối đa -99.99%", "Tiềm năng hồi phục cao"]}
          rightTitle="Vị thế Short"
          rightItems={["Tăng không giới hạn nếu bị kẹt", "Tiềm năng lỗ không giới hạn", "Khó hồi phục"]}
          lang="vi"
        />
        <WarningBox><Strong>Cẩn thận với vị thế short</Strong></WarningBox>
      </div>
    </>
  ),
  tr: () => (
    <>
      {/* Q1 */}
      <div className="mb-12" id="q1-logic">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q1</div>
          <div className="text-xl font-bold text-foreground">İlk Rotasyon nedir?</div>
        </div>
        <QuoteBlock>Yatay piyasalarda kârı maksimize eden bir yapı</QuoteBlock>
        <BulletList items={[
          <><Strong>Aralık içinde işlem</Strong> — Fiyat bir aralıkta hareket ederken tekrarlı işlemler</>,
          <><Strong>Bollinger bazlı</Strong> — Bantlarda giriş/çıkış</>,
          <><Strong>Fibonacci 0~1</Strong> — 0.870 al → 0.5 kâr al</>,
        ]} />
        <HighlightBox>
          <div className="text-center font-mono">
            <div className="text-lg text-foreground mb-2">Temel Yapı</div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">0.870</span>
              <span className="text-foreground/40">→</span>
              <span className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-bold">0.5</span>
            </div>
          </div>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q2 */}
      <div className="mb-12" id="q2-flow">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q2</div>
          <div className="text-xl font-bold text-foreground">TP 0.764 nedir?</div>
        </div>
        <Paragraph><Strong>1.236</Strong>&apos;da giriş ve <Accent>0.764</Accent>&apos;te kâr al.</Paragraph>
        <CalloutBox type="info">Özelleştirme seçenekleri: 0.618 / 0.5</CalloutBox>
      </div>
      <SectionDivider />

      {/* Q3 */}
      <div className="mb-12" id="q3-martingale">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q3</div>
          <div className="text-xl font-bold text-foreground">Volatilite Oranı nedir?</div>
        </div>
        <QuoteBlock>Her girişte pozisyon boyutunun arttığı bir yapı</QuoteBlock>
        <QuoteBlock>Volatilite oranı düşündüğünüzden çok daha gü��lü</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q4 */}
      <div className="mb-12" id="q4-tp-pnl">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q4</div>
          <div className="text-xl font-bold text-foreground">Neden Kâr Alırken PNL Kayıp?</div>
        </div>
        <Paragraph>Grafik düşmeye devam ettiğinde, N-giriş devam ederken <Strong>PNL negatif olabilir.</Strong></Paragraph>
        <CalloutBox type="info">Program rotasyon mantığıyla inşa edildi, kayıpta bile risk yönetimi için pozisyonları kapatır</CalloutBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Çünkü <Strong>ortalama giriş fiyatı düştü</Strong> N-giriş ile</Paragraph>
        </HighlightBox>
        <QuoteBlock>Özet: Büyük düşüşlerde kayıpta pozisyon kapatmak, N-giriş için [Giriş → Kâr Al]</QuoteBlock>
      </div>
      <SectionDivider />

      {/* Q5 */}
      <div className="mb-12" id="q5-diversification">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q5</div>
          <div className="text-xl font-bold text-foreground">Neden Çeşitlendirmeli?</div>
        </div>
        <Paragraph>BUYLOW AI programı <Strong>varlık düşüşünün sınırlı olduğu</Strong> öncülüyle inşa edildi.</Paragraph>
        <WarningBox>Ancak finansal piyasa öngörülemeyen olaylar yaşayabilir</WarningBox>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Bu yüzden <Strong>BUYLOW AI 3.0 çeşitlendirme sistemi içerir</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q6 */}
      <div className="mb-12" id="q6-manual-reset">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q6</div>
          <div className="text-xl font-bold text-foreground">N-Giriş Manuel Nasıl Sıfırlanır?</div>
        </div>
        <div className="my-8 space-y-4">
          {["Ana Menü&apos;ye tıkla", "Sıfırlanacak varlığı seç", "\"Fibonacci Manuel Sıfırlama\" butonuna tıkla"].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold">{i + 1}</span>
              </div>
              <div><div className="text-foreground font-medium">{text}</div></div>
            </div>
          ))}
        </div>
        <HighlightBox>
          <Paragraph className="mb-0 text-center">Program her şeyi sıfırlayacak ve <Strong>ilk girişten tekrar başlayacak</Strong></Paragraph>
        </HighlightBox>
      </div>
      <SectionDivider />

      {/* Q7 */}
      <div className="mb-12" id="q7-short">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
          <div className="text-xs text-cyan-400/70 mb-2">Q7</div>
          <div className="text-xl font-bold text-foreground">Short Pozisyon Getirileri Nasıl?</div>
        </div>
        <QuoteBlock>Long ve short arasındaki kâr/zarar oranı farkı çok büyük</QuoteBlock>
        <ComparisonBox
          leftTitle="Long Pozisyon"
          leftItems={["Takılsanız bile sınırlı düşüş", "Maksimum -99.99%", "Yüksek toparlanma potansiyeli"]}
          rightTitle="Short Pozisyon"
          rightItems={["Takılırsanız sınırsız yükseliş riski", "Sınırsız potansiyel kayıp", "Toparlanması zor"]}
          lang="tr"
        />
        <WarningBox><Strong>Short pozisyonlarla dikkatli olun</Strong></WarningBox>
      </div>
    </>
  ),
}

// Chapter 5 Content: 파산과 우상향의 갈림길 : 손매매
const ManualTradingContent = {
  ko: () => (
    <>
      {/* 1. 시작 - 핵심 문장 */}
      <QuoteBlock>
        부자가 되는 방법은<br />
        빠르게 부자가 되지 않는 것이다.
      </QuoteBlock>

      <SectionDivider />

      {/* 2. 인간의 본질 */}
      <SectionTitle>인간의 본질</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>인간 = 감정의 동물</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">탐욕</div>
          <div className="text-foreground/50 text-sm">더 많이 벌고 싶다</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">공포</div>
          <div className="text-foreground/50 text-sm">잃을까 두렵다</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">환희</div>
          <div className="text-foreground/50 text-sm">수익에 도취된다</div>
        </div>
      </div>

      <SectionDivider />

      {/* 3. 문제 정의 */}
      <SectionTitle>문제 정의</SectionTitle>

      <CalloutBox type="warning">
        퀀트가 있어도 인간이 문제다
      </CalloutBox>

      <QuoteBlock>
        결국 계좌는 인간이 망친다
      </QuoteBlock>

      <SectionDivider />

      {/* 4. 손매매 ��험성 */}
      <SectionTitle>손매매의 위험성</SectionTitle>

      <Paragraph>
        <Strong>갑작스러운 뇌동매매</Strong><br />
        <Strong>충동적 트레이딩</Strong>
      </Paragraph>

      <Paragraph>
        아무리 좋은 시스템도<br />
        한 번의 충동으로 무너진다.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">한 번이면 충분하다</div>
          <div className="text-foreground/60">단 1회의 손매매로 계좌가 무너진다</div>
        </div>
      </WarningBox>

      <SectionDivider />

      {/* 5. 상황 시뮬레이션 */}
      <SectionTitle>상황 시뮬레이션</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6" id="temptation">
        <div className="text-sm text-foreground/50 mb-4 text-center">당신의 상황</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">퀀트로 연 30% 수익 중</div>
          </div>
          <div className="text-center text-foreground/30">그런데...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">옆집 친구가 비트코인으로 +300%</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;한 번은 괜찮겠지&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;손절 잡고 들어가볼까?&quot;</div>
        </div>
      </div>

      <SectionDivider />

      {/* 6. 뇌의 작동 방식 */}
      <SectionTitle>뇌의 작동 방식</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">수익 발생 시</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">도파민 생성</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">더 큰 배팅 유도</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">리스크 과소평가</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">손실 발생 시</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">손실 회피 본능</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">복구 욕망</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">더 큰 손실로 이어짐</span>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox type="warning">
        결과: 계속 손매매 반복
      </CalloutBox>

      <SectionDivider />

      {/* 7. 퀀트 vs 손매매 비교 */}
      <SectionTitle>퀀트 vs 손매매</SectionTitle>

      <ComparisonBox
        leftTitle="퀀트"
        leftItems={[
          "느리지만 안정적",
          "지속 가능",
          "복리 구조",
          "감정 배제",
        ]}
        rightTitle="손매매"
        rightItems={[
          "빠른 도파민",
          "불안정",
          "결국 파산",
          "감정에 좌우",
        ]}
        lang="ko"
      />

      <SectionDivider />

      {/* 8. 핵심 경�� */}
      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">단 1번의 손매매로</Strong><br />
          <Strong className="text-2xl md:text-3xl">계좌가 무너진다</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      {/* 9. 세뇌 구간 (매우 중요) */}
      <div className="my-12 space-y-6">
        <QuoteBlock>
          손매매는 끝났다
        </QuoteBlock>

        <QuoteBlock>
          손매매 = 파산이다
        </QuoteBlock>
      </div>

      <SectionDivider />

      {/* 10. 도박 구조 설명 */}
      <SectionTitle>선물 = 도박 구조</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>선물 거래는 도박과 같은 구조다</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">단기 수익</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">도파민 분비</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">반복 → 중독</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">결과: 파산</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 11. 현실 직시 */}
      <SectionTitle>현실 직시</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>당신은 철수가 아니다</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">4000% 수익</div>
          <div className="text-lg font-bold text-cyan-400">= 예외</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">대부분</div>
          <div className="text-lg font-bold text-red-400">= 실패</div>
        </div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        SNS에 보이는 대박 사례는<br />
        생존자 편향일 뿐이다.
      </Paragraph>

      <SectionDivider />

      {/* 12. 올바른 방향 */}
      <SectionTitle>올바른 방향</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">목표</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">연 20~30% 복리</div>
          <div className="text-foreground/60 mt-2">15년 후 = 수십억</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 13. 최종 결론 */}
      <QuoteBlock>
        지속 가능한 시스템이<br />
        결국 이긴다
      </QuoteBlock>

      <SectionDivider />

      {/* 14. 마지막 경고 (강하게 마무리) */}
      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">단 1번의 뇌동매매도</Strong><br />
          <Strong className="text-xl md:text-2xl">허용하지 마라</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      {/* 마무리 연결 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          감정을 통제하고,<br />
          <Strong>시스템을 믿어라</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  en: () => (
    <>
      <QuoteBlock>
        The way to become rich is<br />
        not to become rich quickly
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Human Nature</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Humans = Emotional Creatures</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Greed</div>
          <div className="text-foreground/50 text-sm">Want more</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Fear</div>
          <div className="text-foreground/50 text-sm">Afraid to lose</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Euphoria</div>
          <div className="text-foreground/50 text-sm">Intoxicated by gains</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>The Problem</SectionTitle>

      <CalloutBox type="warning">
        Even with quant, humans are the problem
      </CalloutBox>

      <QuoteBlock>
        In the end, humans ruin accounts
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>The Danger of Manual Trading</SectionTitle>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">One time is enough</div>
          <div className="text-foreground/60">A single manual trade can destroy your account</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Situation Simulation</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6" id="temptation">
        <div className="text-sm text-foreground/50 mb-4 text-center">Your Situation</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">Making 30% annual returns with quant</div>
          </div>
          <div className="text-center text-foreground/30">But then...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">Your neighbor made +300% on Bitcoin</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Just once should be fine&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;I&apos;ll set a stop loss&quot;</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>How the Brain Works</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">On Profit</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Dopamine release</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Bigger bets encouraged</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">On Loss</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Loss aversion instinct</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Recovery desire</span>
            </div>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Quant vs Manual Trading</SectionTitle>

      <ComparisonBox
        leftTitle="Quant"
        leftItems={[
          "Slow but stable",
          "Sustainable",
          "Compound structure",
          "Emotion-free",
        ]}
        rightTitle="Manual Trading"
        rightItems={[
          "Quick dopamine",
          "Unstable",
          "Eventually bankrupt",
          "Emotion-driven",
        ]}
        lang="en"
      />

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">A single manual trade</Strong><br />
          <Strong className="text-2xl md:text-3xl">can destroy your account</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <div className="my-12 space-y-6">
        <QuoteBlock>
          Manual trading is over
        </QuoteBlock>

        <QuoteBlock>
          Manual trading = Bankruptcy
        </QuoteBlock>
      </div>

      <SectionDivider />

      <SectionTitle>Futures = Gambling Structure</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">Short-term profit</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">Dopamine release</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">Repetition → Addiction</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">Result: Bankruptcy</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Face Reality</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>You are not the exception</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">4000% returns</div>
          <div className="text-lg font-bold text-cyan-400">= Exception</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">Most people</div>
          <div className="text-lg font-bold text-red-400">= Fail</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>The Right Path</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">Target</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">20-30% Annual Compound</div>
          <div className="text-foreground/60 mt-2">15 years = Tens of millions</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        A sustainable system<br />
        wins in the end
      </QuoteBlock>

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">Do not allow</Strong><br />
          <Strong className="text-xl md:text-2xl">even a single impulse trade</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Control your emotions,<br />
          <Strong>Trust the system</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  // Chapter 5 - Full translations for all languages
  zh: () => (
    <>
      <QuoteBlock>
        致富之道是<br />
        不要急于致富
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>人类本质</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>人类 = 情感动物</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">贪婪</div>
          <div className="text-foreground/50 text-sm">想要更多</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">恐惧</div>
          <div className="text-foreground/50 text-sm">害��失去</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">狂喜</div>
          <div className="text-foreground/50 text-sm">被收益冲昏头脑</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>问题定义</SectionTitle>

      <CalloutBox type="warning">
        即使有量化系统，人类仍是问题所在
      </CalloutBox>

      <QuoteBlock>
        最终，账户是被人类毁掉的
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>手动交易的危险性</SectionTitle>

      <Paragraph>
        <Strong>突然的冲动交易</Strong><br />
        <Strong>情绪化交易</Strong>
      </Paragraph>

      <Paragraph>
        再好的系统也会<br />
        被一次冲动毁掉。
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">一次就够了</div>
          <div className="text-foreground/60">一次手动交易就能毁掉你的账��</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>情境模拟</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-sm text-foreground/50 mb-4 text-center">你的情况</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">量化交易年收益30%</div>
          </div>
          <div className="text-center text-foreground/30">但是...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">邻居���特币赚了+300%</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;就一次应该没事&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;设个止损试试?&quot;</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>大脑运作方式</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">盈利时</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">多巴胺分泌</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">诱导更大的赌注</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">低估风险</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">亏损时</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">损失厌恶本能</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">想要回本</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">导致更大亏损</span>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox type="warning">
        结果：不断重复手动交易
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>量化 vs 手动交易</SectionTitle>

      <ComparisonBox
        leftTitle="量化"
        leftItems={[
          "慢但稳定",
          "可持续",
          "复利结构",
          "排除情绪",
        ]}
        rightTitle="手动交易"
        rightItems={[
          "快速多巴胺",
          "不稳定",
          "最终破产",
          "受情绪影响",
        ]}
        lang="zh"
      />

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">一次手动交易</Strong><br />
          <Strong className="text-2xl md:text-3xl">就能毁掉账户</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <div className="my-12 space-y-6">
        <QuoteBlock>
          手动交易结束了
        </QuoteBlock>

        <QuoteBlock>
          手动交易 = 破产
        </QuoteBlock>
      </div>

      <SectionDivider />

      <SectionTitle>期货 = 赌博结构</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>期货交易与赌博结构相同</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">短期收益</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">多巴胺分泌</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">重复 → 成瘾</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">结果：破产</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>面对现实</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>你不是例外</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">4000%收益</div>
          <div className="text-lg font-bold text-cyan-400">= 例外</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">大多数人</div>
          <div className="text-lg font-bold text-red-400">= 失败</div>
        </div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        社交媒体上的暴富案例<br />
        只是幸存��偏差。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>正确的方向</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">目标</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">年复利20-30%</div>
          <div className="text-foreground/60 mt-2">15年后 = 数千万</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        可持续的系统<br />
        最终获胜
      </QuoteBlock>

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">不要允许</Strong><br />
          <Strong className="text-xl md:text-2xl">哪怕一次冲动���易</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          控制你的情绪，<br />
          <Strong>相信系统</Strong>。
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ar: () => (
    <>
      <QuoteBlock>
        طريقة الثراء هي<br />
        ألا تصبح ثريًا بسرعة
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>الطبيعة البشرية</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>البشر = مخلوقات عاطفية</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">الطمع</div>
          <div className="text-foreground/50 text-sm">أريد المزيد</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">الخوف</div>
          <div className="text-foreground/50 text-sm">خائف من الخسارة</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">النشوة</div>
          <div className="text-foreground/50 text-sm">مسكور بالأرباح</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>تعريف المشكلة</SectionTitle>

      <CalloutBox type="warning">
        حتى مع الكوانت، البشر هم المشكلة
      </CalloutBox>

      <QuoteBlock>
        في النهاية، البشر يدمرون الحسابات
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>خطورة التداول اليدوي</SectionTitle>

      <Paragraph>
        <Strong>تداول اندفاعي مفاجئ</Strong><br />
        <Strong>تداول عاطفي</Strong>
      </Paragraph>

      <Paragraph>
        حتى أفضل نظام<br />
        يمكن أن ينهار بدفعة واحدة.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">مرة واحدة تكفي</div>
          <div className="text-foreground/60">صفقة يدوية و��حدة يمك�� أن تدمر حسابك</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>محاكاة الموقف</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-sm text-foreground/50 mb-4 text-center">موقفك</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">تحقق 30% سنويًا مع الكوانت</div>
          </div>
          <div className="text-center text-foreground/30">لكن...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">جارك ربح +300% من البيتكوين</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;مرة واحدة ستكون على ما يرام&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;سأضع وقف خسارة&quot;</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>كيف يعمل الدماغ</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">عند الربح</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">إفراز الدوبامين</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">تحفيز رهانات أكبر</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">التقليل من المخاطر</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">عند الخسارة</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">غريزة تجنب الخسارة</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">رغبة في التعويض</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">يؤدي إلى خسائر أكبر</span>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox type="warning">
        النتيجة: تكرار التداول اليدوي باستمرار
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>الكوانت مقابل التداول اليدوي</SectionTitle>

      <ComparisonBox
        leftTitle="الكوانت"
        leftItems={[
          "بطيء لكن مستقر",
          "مستدام",
          "هيكل مركب",
          "بدون مشاعر",
        ]}
        rightTitle="التداول اليدوي"
        rightItems={[
          "دوبامين سريع",
          "غير مستقر",
          "إفلاس في النهاية",
          "مدفوع بالعواطف",
        ]}
        lang="ar"
      />

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">صفقة يدوية واحدة</Strong><br />
          <Strong className="text-2xl md:text-3xl">يمكن أن تدمر حسابك</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <div className="my-12 space-y-6">
        <QuoteBlock>
          انتهى التداول اليدوي
        </QuoteBlock>

        <QuoteBlock>
          التداول ال��دوي = ا��إفلاس
        </QuoteBlock>
      </div>

      <SectionDivider />

      <SectionTitle>العقود الآ��لة = هيكل مقامرة</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>تداول العقود الآجلة له نفس هيكل المقام��ة</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">ربح قصير المدى</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">إفراز الدوبامين</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">التكرار → الإدمان</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">النتيجة: الإفلاس</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>واجه الواقع</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>أنت لست الاستثناء</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">عوائد 4000%</div>
          <div className="text-lg font-bold text-cyan-400">= استثناء</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">معظم الناس</div>
          <div className="text-lg font-bold text-red-400">= فشل</div>
        </div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        قصص النجاح على وسائل التواصل<br />
        مجرد تحيز الناجين.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>الطريق الصحيح</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">ا��هدف</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">20-30% عائد مركب سنوي</div>
          <div className="text-foreground/60 mt-2">15 سنة = عشرات الملايين</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        النظام المستدام<br />
        يفوز في النهاية
      </QuoteBlock>

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">لا تسمح</Strong><br />
          <Strong className="text-xl md:text-2xl">حتى بصفقة اندفاعية واحدة</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          تحكم في عواطفك،<br />
          <Strong>ثق في النظام</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ru: () => (
    <>
      <QuoteBlock>
        Путь к богатству —<br />
        не становиться богатым быстро
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Человеческа�� природа</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Человек = эмоциональное существо</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Жадность</div>
          <div className="text-foreground/50 text-sm">Хочу больше</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Страх</div>
          <div className="text-foreground/50 text-sm">Боюсь потерять</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">��йфория</div>
          <div className="text-foreground/50 text-sm">Опьянён прибылью</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Определение проблемы</SectionTitle>

      <CalloutBox type="warning">
        Даже с квантом проблема — в людях
      </CalloutBox>

      <QuoteBlock>
        В конце концов, счёт разрушают люди
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Опасность ручной торговли</SectionTitle>

      <Paragraph>
        <Strong>Внезапная импульсивная сделка</Strong><br />
        <Strong>Эмоциональный трейдинг</Strong>
      </Paragraph>

      <Paragraph>
        Даже лучшая система<br />
        может рухнуть от одного импульса.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">Достаточно одного раза</div>
          <div className="text-foreground/60">Одна ручная сделка может уничтожить ваш сч��т</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Симуляция сит��ации</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-sm text-foreground/50 mb-4 text-center">Ваша ситуация</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">Зарабатываете 30% годовы�� с квантом</div>
          </div>
          <div className="text-center text-foreground/30">Но потом...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">Сосед заработал +300% на биткоине</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Один раз не повредит&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Поставлю стоп-лосс&quot;</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Как ��аботает мозг</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">При прибыли</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Выброс дофам��на</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Стимулируются большие ставки</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Недооценка риска</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">При убытке</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Инстинкт избегания потерь</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Желание отыграт�ся</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Ведёт к большим потерям</span>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox type="warning">
        Результат: бесконечное повторение ручной торговли
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Квант vs Ручная торговля</SectionTitle>

      <ComparisonBox
        leftTitle="Квант"
        leftItems={[
          "Медленно, но стабильно",
          "Устойчиво",
          "Структура сложного процента",
          "Без эмоций",
        ]}
        rightTitle="Ручная торговля"
        rightItems={[
          "Бы��трый дофамин",
          "Нестабильно",
          "В конце — банкротство",
          "Управляется эмоциями",
        ]}
        lang="ru"
      />

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">Одна ручная сдел��а</Strong><br />
          <Strong className="text-2xl md:text-3xl">может уничтожить ваш счёт</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <div className="my-12 space-y-6">
        <QuoteBlock>
          Ручная торговля закончена
        </QuoteBlock>

        <QuoteBlock>
          Ручная торговля = Банкротство
        </QuoteBlock>
      </div>

      <SectionDivider />

      <SectionTitle>Фьючерсы = Структура азартной игры</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Торговля фьючерсами имеет ту же структуру, что и азартные игры</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">Краткосрочная прибыль</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">Выброс дофамина</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">Повторение → Зависимост��</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">Результат: Банкротство</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Взгляните реальности в глаза</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Вы не исключение</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">Доходность 4000%</div>
          <div className="text-lg font-bold text-cyan-400">= Исключение</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">Большинство людей</div>
          <div className="text-lg font-bold text-red-400">= Про��ал</div>
        </div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        Истории успеха в соцсетях —<br />
        лиш�� ошибка выжившего.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Правильный путь</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">Цель</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">20-30% годовых со сложным процентом</div>
          <div className="text-foreground/60 mt-2">15 лет = Десятки миллионов</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Устойчивая система<br />
        побеждает в конце
      </QuoteBlock>

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">Не допускай��е</Strong><br />
          <Strong className="text-xl md:text-2xl">ни одной импульсивной сделки</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Контролируйте эмоции,<br />
          <Strong>Доверьтесь системе</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  es: () => (
    <>
      <QuoteBlock>
        La forma de hacerse rico es<br />
        no hacerse rico rápidamente
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Naturaleza Humana</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Humanos = Criaturas Emocionales</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Codicia</div>
          <div className="text-foreground/50 text-sm">Quiero más</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Miedo</div>
          <div className="text-foreground/50 text-sm">Miedo a perder</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Euforia</div>
          <div className="text-foreground/50 text-sm">Embriagado por ganancias</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Definición del Problema</SectionTitle>

      <CalloutBox type="warning">
        Incluso con quant, los humanos son el problema
      </CalloutBox>

      <QuoteBlock>
        Al final, los humanos arruinan las cuentas
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>El Peligro del Trading Manual</SectionTitle>

      <Paragraph>
        <Strong>Trading impulsivo repentino</Strong><br />
        <Strong>Trading emocional</Strong>
      </Paragraph>

      <Paragraph>
        Incluso el mejor sistema<br />
        puede colapsar con un impulso.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">Una vez es suficiente</div>
          <div className="text-foreground/60">Una sola operación manual puede destruir tu cuenta</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Simulación de Situación</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-sm text-foreground/50 mb-4 text-center">Tu Situación</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">Ganando 30% anual con quant</div>
          </div>
          <div className="text-center text-foreground/30">Pero entonces...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">Tu vecino ganó +300% en Bitcoin</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Solo una vez estará bien&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Pondré un stop loss&quot;</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Cómo Funciona el Cerebro</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">Con Ganancias</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Liberación de dopamina</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Se fomentan apuestas mayores</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Subestimación del riesgo</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">Con Pérdidas</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Instinto de aversión a la pérdida</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Deseo de recuperación</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Lleva a mayores pérdidas</span>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox type="warning">
        Resultado: Repetición constante de trading manual
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Quant vs Trading Manual</SectionTitle>

      <ComparisonBox
        leftTitle="Quant"
        leftItems={[
          "Lento pero estable",
          "Sostenible",
          "Estructura de interés compuesto",
          "Sin emociones",
        ]}
        rightTitle="Trading Manual"
        rightItems={[
          "Dopamina rápida",
          "Inestable",
          "Eventualmente bancarrota",
          "Impulsado por emociones",
        ]}
        lang="es"
      />

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">Una sola operación manual</Strong><br />
          <Strong className="text-2xl md:text-3xl">puede destruir tu cuenta</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <div className="my-12 space-y-6">
        <QuoteBlock>
          El trading manual terminó
        </QuoteBlock>

        <QuoteBlock>
          Trading manual = Bancarrota
        </QuoteBlock>
      </div>

      <SectionDivider />

      <SectionTitle>Futuros = Estructura de Apuesta</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>El trading de futuros tiene la misma estructura que las apuestas</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">Ganancia a corto plazo</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">Liberación de dopamina</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">Repetición → Adicción</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">Resultado: Bancarrota</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Enfrenta la Realidad</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Tú no eres la excepción</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">Retornos del 4000%</div>
          <div className="text-lg font-bold text-cyan-400">= Excepción</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">La mayoría</div>
          <div className="text-lg font-bold text-red-400">= Fracasan</div>
        </div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        Las historias de éxito en redes sociales<br />
        son solo sesgo del sobreviviente.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>El Camino Correcto</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">Meta</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">20-30% Compuesto Anual</div>
          <div className="text-foreground/60 mt-2">15 años = Decenas de millones</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Un sistema sostenible<br />
        gana al final
      </QuoteBlock>

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">No permitas</Strong><br />
          <Strong className="text-xl md:text-2xl">ni una sola operación impulsiva</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Controla tus emociones,<br />
          <Strong>Confía en el sistema</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  id: () => (
    <>
      <QuoteBlock>
        Cara menjadi kaya adalah<br />
        tidak menjadi kaya dengan cepat
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Sifat Manusia</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Manusia = Makhluk Emosional</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Keserakahan</div>
          <div className="text-foreground/50 text-sm">Ingin lebih</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Ketakutan</div>
          <div className="text-foreground/50 text-sm">Takut kehilangan</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Euforia</div>
          <div className="text-foreground/50 text-sm">Mabuk dengan keuntungan</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Definisi Masalah</SectionTitle>

      <CalloutBox type="warning">
        Bahkan dengan quant, manusia tetap masalahnya
      </CalloutBox>

      <QuoteBlock>
        Pada akhirnya, manusia yang merusak akun
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Bahaya Trading Manual</SectionTitle>

      <Paragraph>
        <Strong>Trading impulsif tiba-tiba</Strong><br />
        <Strong>Trading emosional</Strong>
      </Paragraph>

      <Paragraph>
        Bahkan sistem terbaik<br />
        bisa hancur karena satu impuls.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">Satu kali sudah cukup</div>
          <div className="text-foreground/60">Satu trade manual bisa menghancurkan akun Anda</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Simulasi Situasi</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-sm text-foreground/50 mb-4 text-center">Situasi Anda</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">Menghasilkan 30% tahunan dengan quant</div>
          </div>
          <div className="text-center text-foreground/30">Tapi kemudian...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">Tetangga Anda profit +300% dari Bitcoin</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Sekali saja tidak apa-apa&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Saya akan pasang stop loss&quot;</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Cara Kerja Otak</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">Saat Untung</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Pelepasan dopamin</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Mendorong taruhan lebih besar</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Meremehkan risiko</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">Saat Rugi</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Insting menghindari kerugian</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Keinginan untuk memulihkan</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Mengarah ke kerugian lebih besar</span>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox type="warning">
        Hasil: Pengulangan trading manual terus-menerus
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Quant vs Trading Manual</SectionTitle>

      <ComparisonBox
        leftTitle="Quant"
        leftItems={[
          "Lambat tapi stabil",
          "Berkelanjutan",
          "Struktur compound",
          "Tanpa emosi",
        ]}
        rightTitle="Trading Manual"
        rightItems={[
          "Dopamin cepat",
          "Tidak stabil",
          "Akhirnya bangkrut",
          "Didorong emosi",
        ]}
        lang="id"
      />

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">Satu trade manual</Strong><br />
          <Strong className="text-2xl md:text-3xl">bisa menghancurkan akun Anda</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <div className="my-12 space-y-6">
        <QuoteBlock>
          Trading manual sudah berakhir
        </QuoteBlock>

        <QuoteBlock>
          Trading manual = Kebangkrutan
        </QuoteBlock>
      </div>

      <SectionDivider />

      <SectionTitle>Futures = Struktur Judi</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Trading futures memiliki struktur yang sama dengan judi</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">Profit jangka pendek</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">Pelepasan dopamin</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">Pengulangan → Kecanduan</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">Hasil: Kebangkrutan</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Hadapi Kenyataan</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Anda bukan pengecualian</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">Return 4000%</div>
          <div className="text-lg font-bold text-cyan-400">= Pengecualian</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">Kebanyakan orang</div>
          <div className="text-lg font-bold text-red-400">= Gagal</div>
        </div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        Cerita sukses di media sosial<br />
        hanyalah bias penyintas.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Jalan yang Benar</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">Target</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">20-30% Compound Tahunan</div>
          <div className="text-foreground/60 mt-2">15 tahun = Puluhan juta</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Sistem yang berkelanjutan<br />
        menang pada akhirnya
      </QuoteBlock>

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">Jangan izinkan</Strong><br />
          <Strong className="text-xl md:text-2xl">bahkan satu trade impulsif</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Kendalikan emosi Anda,<br />
          <Strong>Percaya pada sistem</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  th: () => (
    <>
      <QuoteBlock>
        วิธีก���รรวย คือ<br />
        อย่ารวยอย่างรวดเร็ว
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>ธรรมชาต���ของมนุษย์</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>มนุษย์ = สิ่งมีชีวิตที่มีอารมณ์</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">ค���ามโลภ</div>
          <div className="text-foreground/50 text-sm">อย��กได้มากขึ้น</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">ความกลัว</div>
          <div className="text-foreground/50 text-sm">กลัวสูญเสีย</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">ความปีติยินดี</div>
          <div className="text-foreground/50 text-sm">เมากับกำไร</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>คำจำกัดความของปัญหา</SectionTitle>

      <CalloutBox type="warning">
        แม้มี Quant มนุษย์ก็ยังเป็นปัญหา
      </CalloutBox>

      <QuoteBlock>
        ในที่สุด มนุษย์ทำ��ายบัญชี
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>อันตรายของการเทรดแบบแมนนวล</SectionTitle>

      <Paragraph>
        <Strong>การเทรดแบบหุนหันพลันแล่น</Strong><br />
        <Strong>การเทรดตามอารมณ์</Strong>
      </Paragraph>

      <Paragraph>
        แม้ระบบที่ดีที่สุด<br />
        ก็พังได้ด้วยแรงกร��ตุ้นครั้งเดียว
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">ครั้งเดียวก็พอ</div>
          <div className="text-foreground/60">การเทรดแมนนวลครั้งเดียวสามารถทำลายบัญชีของคุณได้</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>จำลองสถานการณ์</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-sm text-foreground/50 mb-4 text-center">สถานการณ์ของคุณ</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">ไ���้กำไร 30% ต่อปีด้วย Quant</div>
          </div>
          <div className="text-center text-foreground/30">แต่แล้ว...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">เพื่อนบ้านได้ +300% จาก Bitcoin</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;��รั้งเดียวคงไม่เป��นไร&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;ฉันจะตั้ง stop loss&quot;</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>วิธีการทำงานของสมอง</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">เมื่อได้กำไร</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">หลั่งโดปามีน</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">กระตุ้นให้เดิมพันมากขึ้น</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">ประเมินความเสี่ยงต่ำเกินไป</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">เมื่อขาดทุน</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">ส��ญชาตญาณหลีกเลี���ยงการสูญเสีย</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">ความต้องการกู้คืน</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">นำไปสู่การ��าดทุนที่มากขึ้น</span>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox type="warning">
        ผลลัพธ์: การเทรดแมนนวลซ้ำแล้วซ้ำเล่า
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Quant vs การเทรดแมนนวล</SectionTitle>

      <ComparisonBox
        leftTitle="Quant"
        leftItems={[
          "ช้าแต่มั่นคง",
          "ยั่งยืน",
          "โครงสร้างทบต้น",
          "ไม่มีอารมณ์",
        ]}
        rightTitle="การเทรดแมนนวล"
        rightItems={[
          "โดปามีนเร็ว",
          "ไม่มั่นคง",
          "สุดท้ายล้����ะลาย",
          "ขับเคลื่อนด้วยอารมณ์",
        ]}
        lang="th"
      />

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">การเทรดแมนนวลครั้งเดียว</Strong><br />
          <Strong className="text-2xl md:text-3xl">สามารถทำลายบัญชีของคุณได้</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <div className="my-12 space-y-6">
        <QuoteBlock>
          การเทรดแมนนวลจบแล้ว
        </QuoteBlock>

        <QuoteBlock>
          การเทรดแมนนวล = การล้มละลาย
        </QuoteBlock>
      </div>

      <SectionDivider />

      <SectionTitle>Futures = โครงสร้างการพนัน</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>การเทรด Futures มีโ��รงสร้างเหมือนการพนัน</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">กำไรระยะสั้น</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">หลั่งโดปามีน</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">ทำซ้ำ → เสพ��ิด</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">ผลลัพธ์: ล้มละ��าย</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>เผชิญความจริง</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>คุณไม่ใช่ข้อยกเว้น</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">ผลตอบแทน 4000%</div>
          <div className="text-lg font-bold text-cyan-400">= ข้อยก��ว้น</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">คนส่วนใหญ่</div>
          <div className="text-lg font-bold text-red-400">= ล้มเหลว</div>
        </div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        เรื่องราวคว��มสำเร็จในโซเชียลมีเดีย<br />
        เป็นแค่อคติของผู้รอดชีวิต
      </Paragraph>

      <SectionDivider />

      <SectionTitle>เส้นท��งที่ถูกต้อง</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">เป้าหมาย</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">20-30% ทบต้น���่อปี</div>
          <div className="text-foreground/60 mt-2">15 ปี = หลายสิบล้าน</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        ระบบที่ยั่งยืน<br />
        ชนะในที่���ุด
      </QuoteBlock>

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">อย่ายอมให้</Strong><br />
          <Strong className="text-xl md:text-2xl">แม้แต่การเทรดหุนหันพลันแล่นครั้งเดียว</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          ควบคุมอารมณ์ของคุณ<br />
          <Strong>เชื่อมั่นในระบบ</Strong>
        </Paragraph>
      </HighlightBox>
    </>
  ),
  vi: () => (
    <>
      <QuoteBlock>
        Cách để trở nên giàu có là<br />
        không trở nên giàu có nhanh chóng
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Bản chất con người</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Con người = Sinh vật cảm xúc</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Tham lam</div>
          <div className="text-foreground/50 text-sm">Muốn nhiều hơn</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Sợ hãi</div>
          <div className="text-foreground/50 text-sm">Sợ mất mát</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Hưng phấn</div>
          <div className="text-foreground/50 text-sm">Say với lợi nhuận</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Định nghĩa vấn đề</SectionTitle>

      <CalloutBox type="warning">
        Ngay cả với quant, con người vẫn là vấn đề
      </CalloutBox>

      <QuoteBlock>
        Cuối cùng, con người phá hủy tài khoản
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Nguy hiểm của giao dịch thủ công</SectionTitle>

      <Paragraph>
        <Strong>Giao dịch bốc đồng đột ngột</Strong><br />
        <Strong>Giao dịch theo cảm xúc</Strong>
      </Paragraph>

      <Paragraph>
        Ngay cả hệ thống tốt nhất<br />
        cũng có thể sụp đổ vì một xung động.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">Một lần là đủ</div>
          <div className="text-foreground/60">Một giao dịch thủ công có thể phá hủy tài khoản của bạn</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Mô phỏng tình huống</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-sm text-foreground/50 mb-4 text-center">Tình huống của bạn</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">Đang kiếm 30% hàng năm với quant</div>
          </div>
          <div className="text-center text-foreground/30">Nhưng rồi...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">Hàng xóm kiếm +300% từ Bitcoin</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Một lần chắc không sao&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Tôi sẽ đặt stop loss&quot;</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Cách não bộ hoạt đ���ng</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">Khi có lời</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Giải phóng dopamine</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Khuyến khích đặt cược lớn hơn</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Đánh giá thấp rủi ro</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">Khi thua lỗ</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Bản năng tránh mất mát</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Mong muốn phục hồi</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Dẫn đến thua lỗ lớn hơn</span>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox type="warning">
        Kết quả: Lặp l��i giao dịch thủ công liên tục
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Quant vs Giao dịch thủ công</SectionTitle>

      <ComparisonBox
        leftTitle="Quant"
        leftItems={[
          "Chậm nhưng ổn định",
          "Bền vững",
          "Cấu trúc lãi kép",
          "Không cảm xúc",
        ]}
        rightTitle="Giao dịch thủ công"
        rightItems={[
          "Dopamine nhanh",
          "Không ổn định",
          "Cuối cùng phá sản",
          "Bị cảm xúc chi phối",
        ]}
        lang="vi"
      />

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">Một giao dịch thủ công</Strong><br />
          <Strong className="text-2xl md:text-3xl">có thể phá h��y tài khoản của bạn</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <div className="my-12 space-y-6">
        <QuoteBlock>
          Giao dịch thủ công đã kết thúc
        </QuoteBlock>

        <QuoteBlock>
          Giao dịch thủ công = Phá sản
        </QuoteBlock>
      </div>

      <SectionDivider />

      <SectionTitle>Futures = Cấu trúc cờ bạc</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Giao dịch futures có cấu trúc giống như cờ bạc</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">Lợi nhuận ngắn hạn</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">Giải phóng dopamine</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">Lặp lại → Nghiện</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">Kết quả: Phá s��n</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Đối mặt với thực tế</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Bạn không phải là ngoại lệ</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">Lợi nhuận 4000%</div>
          <div className="text-lg font-bold text-cyan-400">= Ngoại lệ</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">Hầu hết mọi người</div>
          <div className="text-lg font-bold text-red-400">= Thất bại</div>
        </div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        Những câu chuyện thành công trên mạng xã hội<br />
        chỉ là thiên kiến người sống sót.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Con đường đúng đắn</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">Mục tiêu</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">20-30% Lãi kép hàng năm</div>
          <div className="text-foreground/60 mt-2">15 năm = Hàng chục triệu</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Hệ thống bền vững<br />
        cuối cùng sẽ chiến thắng
      </QuoteBlock>

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">Đừng cho phép</Strong><br />
          <Strong className="text-xl md:text-2xl">dù chỉ m��t giao dịch bốc đồng</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Kiểm soát cảm xúc của bạn,<br />
          <Strong>Tin tưởng vào h��� thống</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  tr: () => (
    <>
      <QuoteBlock>
        Zengin olmanın yolu<br />
        hızlı zengin olmamaktır
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>İnsan Doğası</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>İnsanlar = Duygusal Varlıklar</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Açgözlülük</div>
          <div className="text-foreground/50 text-sm">Daha fazla istiyorum</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Korku</div>
          <div className="text-foreground/50 text-sm">Kaybetmekten korkuyorum</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-2xl mb-2">Coşku</div>
          <div className="text-foreground/50 text-sm">Kazançla sarhoş</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Problem Tanımı</SectionTitle>

      <CalloutBox type="warning">
        Quant olsa bile, insanlar problemdir
      </CalloutBox>

      <QuoteBlock>
        Sonunda, insanlar hesapları mahveder
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Manuel Ticaretin Tehlikesi</SectionTitle>

      <Paragraph>
        <Strong>Ani dürtüsel işlem</Strong><br />
        <Strong>Duygusal ticaret</Strong>
      </Paragraph>

      <Paragraph>
        En iyi sistem bile<br />
        bir dürtüyle çökebilir.
      </Paragraph>

      <WarningBox>
        <div className="text-center">
          <div className="text-3xl md:text-2xl md:text-4xl font-bold text-red-400 mb-2">Bir kez yeterli</div>
          <div className="text-foreground/60">Tek bir manuel işlem hesabınızı yok edebilir</div>
        </div>
      </WarningBox>

      <SectionDivider />

      <SectionTitle>Durum Simülasyonu</SectionTitle>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="text-sm text-foreground/50 mb-4 text-center">Durumunuz</div>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 font-medium">Quant ile yıllık %30 kazanıyorsunuz</div>
          </div>
          <div className="text-center text-foreground/30">Ama sonra...</div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 font-medium">Komşunuz Bitcoin'den +%300 kazandı</div>
          </div>
        </div>
      </div>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Bir kez sorun olmaz&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Stop loss koyacağım&quot;</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Beyin Nasıl Çalışır</SectionTitle>

      <div className="my-8 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-emerald-400 mb-4 text-center">Kâr Elde Edildiğinde</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Dopamin salınımı</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Daha büyük bahisler teşvik edilir</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-foreground/70">Risk hafife alınır</span>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-lg font-bold text-red-400 mb-4 text-center">Kayıp Yaşandığında</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Kayıptan kaçınma içgüdüsü</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Kurtarma arzusu</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-foreground/70">Daha büyük kayıplara yol açar</span>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox type="warning">
        Sonuç: Sürekli manuel ticaret tekrarı
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Quant vs Manuel Ticaret</SectionTitle>

      <ComparisonBox
        leftTitle="Quant"
        leftItems={[
          "Yavaş ama istikrarlı",
          "Sürdürülebilir",
          "Bileşik yapı",
          "Duygusuz",
        ]}
        rightTitle="Manuel Ticaret"
        rightItems={[
          "Hızlı dopamin",
          "Dengesiz",
          "Sonunda iflas",
          "Duygu odaklı",
        ]}
        lang="tr"
      />

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-2xl md:text-3xl">Tek bir manuel işlem</Strong><br />
          <Strong className="text-2xl md:text-3xl">hesabınızı yok edebilir</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <div className="my-12 space-y-6">
        <QuoteBlock>
          Manuel ticaret bitti
        </QuoteBlock>

        <QuoteBlock>
          Manuel ticaret = İflas
        </QuoteBlock>
      </div>

      <SectionDivider />

      <SectionTitle>Vadeli İşlemler = Kumar Yapısı</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Vadeli işlem ticareti kumar ile aynı yapıya sahiptir</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-xs p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <span className="text-emerald-400 font-medium">Kısa vadeli kâr</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <span className="text-amber-400 font-medium">Dopamin salınımı</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <span className="text-orange-400 font-medium">Tekrar → Bağımlılık</span>
          </div>
          <div className="text-foreground/30">↓</div>
          <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <span className="text-red-400 font-bold">Sonuç: İflas</span>
          </div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Gerçekle Yüzleş</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Siz istisna değilsiniz</Strong>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">%4000 getiri</div>
          <div className="text-lg font-bold text-cyan-400">= İstisna</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-sm text-foreground/50 mb-2">Çoğu insan</div>
          <div className="text-lg font-bold text-red-400">= Başarısız</div>
        </div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        Sosyal medyadaki başarı hikayeleri<br />
        sadece hayatta kalan yanlılığıdır.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Doğru Yol</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-sm text-foreground/50 mb-2">Hedef</div>
          <div className="text-3xl md:text-4xl font-bold text-foreground">Yıllık %20-30 Bileşik</div>
          <div className="text-foreground/60 mt-2">15 yıl = On milyonlar</div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        Sürdürülebilir bir sistem<br />
        sonunda kazanır
      </QuoteBlock>

      <SectionDivider />

      <WarningBox>
        <div className="text-center">
          <Strong className="text-xl md:text-2xl">İzin vermeyin</Strong><br />
          <Strong className="text-xl md:text-2xl">tek bir dürtüsel işleme bile</Strong>
        </div>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Duygularınızı kontrol edin,<br />
          <Strong>Sisteme güvenin</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
}

// Chapter 6 Content: ���치며 (Conclusion)
const ConclusionContent = {
  ko: () => (
    <>
      {/* 1. 시작 - 정리 + 공감 */}
      <QuoteBlock>
        지금까지 BUYLOW Quant에 대한 설명을 마쳤다
      </QuoteBlock>

      <Paragraph>
        처음엔 이해가 안 됐을 것이다.<br />
        복잡하고, 낯설고, 어려웠을 것이다.
      </Paragraph>

      <Paragraph>
        하지만 지금 이 글을 읽고 있다면,<br />
        <Strong>구조는 이해했을 것이다</Strong>.
      </Paragraph>

      <SectionDivider />

      {/* 2. 경험 강조 */}
      <SectionTitle>경험의 중요성</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>직접 돌려보면 느낌이 달라진다</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        이론으로 아는 것과<br />
        <Strong>직접 경험하는 것</Strong>은 완전히 다르다.
      </Paragraph>

      <CalloutBox type="info">
        이론 → 경험 전환이 핵심이다
      </CalloutBox>

      <SectionDivider />

      {/* 3. 투자 마인드 */}
      <SectionTitle>투자 마인드</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>자산에 대한 믿음이 필요하다</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        금, 나스닥, S&P 500 등<br />
        <Strong>장기적으로 우상향하는 자산</Strong>이다.
      </Paragraph>

      <Paragraph>
        과열 구간에서는 비중을 조절하고,<br />
        저점에서는 과감하게 매수하라.
      </Paragraph>

      <SectionDivider />

      {/* 4. 핵심 전제 */}
      <QuoteBlock>
        원웨이 -50% 하락만 안한다면<br />
        대부분 수익이다
      </QuoteBlock>

      <SectionDivider />

      {/* 5. 가장 위험한 순간 */}
      <SectionTitle>가장 위험한 순간</SectionTitle>

      <WarningBox>
        <Strong>수익이 나기 시작할 때가 가장 위험하다</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6" id="greed-loop">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;수익률 더 올릴걸&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;자산 더 늘릴걸&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;시드 더 넣을걸&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        이 생각이 시작되면 리스크 관리 실패의 시작이다
      </CalloutBox>

      <SectionDivider />

      {/* 6. 핵심 메시지 */}
      <QuoteBlock>
        지속 가능한 수익이 가장 중요하다
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          100번 이겨도<br />
          <span className="text-red-400">1번에 끝난다</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      {/* 7. 개인 ���토리 */}
      <SectionTitle>개인적인 이야기</SectionTitle>

      <Paragraph>
        나는 이미 <Strong>경제적 자유</Strong>를 달성했다.
      </Paragraph>

      <Paragraph>
        하지만 여전히 개발을 계속하고 있다.<br />
        왜냐하면...
      </Paragraph>

      <SectionDivider />

      {/* 8. 가치 철학 */}
      <SectionTitle>가치 철학</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>가장 중요한 건 가치다</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">돈</div>
          <div className="text-foreground/60">만족은 일시적</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">가치</div>
          <div className="text-foreground/60">지속 가능</div>
        </div>
      </div>

      <SectionDivider />

      {/* 9. 시간의 가치 */}
      <SectionTitle>시간의 가치</SectionTitle>

      <QuoteBlock>
        돈보다 중요한 건 시간이다
      </QuoteBlock>

      <Paragraph>
        누구에게나 <Strong>하루 24시간</Strong>이 주어진다.<br />
        부자든, 가난한 사람이든 동일하다.
      </Paragraph>

      <Paragraph>
        하지만 대부분의 사람들은<br />
        <Accent>남을 위해 시간을 사용</Accent>한다.
      </Paragraph>

      <SectionDivider />

      {/* 10. BUYLOW의 가치 */}
      <SectionTitle>BUYLOW의 가치</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            돈 + 시간
          </div>
          <div className="text-foreground/60">
            BUYLOW가 드리는 것
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">자동화 = 자유</div>
        <div className="text-foreground/60">
          당신이 쉬는 동안에도<br />
          시스템은 일한다
        </div>
      </div>

      <SectionDivider />

      {/* 11. 감정 연결 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>당신의 인생을 위해 살아라</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph className="text-center">
        남을 위해 시간을 쓰지 마라.<br />
        <Strong>당신의 시간</Strong>은 당신의 것이다.
      </Paragraph>

      <SectionDivider />

      {/* 12. 미래 메시지 */}
      <QuoteBlock>
        당신이 주인공이 될 것이다
      </QuoteBlock>

      <Paragraph>
        지금 이 글을 읽고 있는 당신이<br />
        <Strong>다음 성공 스토리의 주인공</Strong>이 될 것이다.
      </Paragraph>

      <SectionDivider />

      {/* 13. 감성 마무리 */}
      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">시간</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">추억</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">자유</div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        BUYLOW와 함께<br />
        당신의 <Strong>자유</Strong>를 찾길 바랍니다.
      </Paragraph>

      <SectionDivider />

      {/* 14. 공식 커뮤니티 입장 + 후기 CTA */}
      <TelegramCommunitySection lang="ko" />

      <SectionDivider />

      {/* 15. 시험 CTA */}
      <TestCTA lang="ko" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="ko" />

      <EbookCTAButton lang="ko" />

      <SectionDivider />

      {/* 최종 마무리 */}
      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          감사합니다.
        </div>
        <div className="text-foreground/60">
          BUYLOW 팀 드림
        </div>
      </div>
    </>
  ),
  en: () => (
    <>
      <QuoteBlock>
        This concludes the explanation of BUYLOW Quant
      </QuoteBlock>

      <Paragraph>
        At first, it might not have made sense.<br />
        Complex, unfamiliar, and difficult.
      </Paragraph>

      <Paragraph>
        But if you&apos;re reading this now,<br />
        <Strong>you understand the structure</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>The Importance of Experience</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Running it yourself feels different</Strong>
        </Paragraph>
      </HighlightBox>

      <CalloutBox type="info">
        Theory to experience transition is key
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Investment Mindset</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>You need faith in your assets</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Gold, NASDAQ, S&P 500 are<br />
        <Strong>long-term upward trending assets</Strong>.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        As long as there&apos;s no one-way -50% crash,<br />
        most outcomes are profitable
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>The Most Dangerous Moment</SectionTitle>

      <WarningBox>
        <Strong>When profits start is the most dangerous time</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6" id="greed-loop">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Should have increased returns&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Should have added more assets&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Should have invested more&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        These thoughts mark the beginning of risk management failure
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Sustainable profits are most important
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          Win 100 times,<br />
          <span className="text-red-400">lose it all in 1</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Value Philosophy</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>The most important thing is value</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">Money</div>
          <div className="text-foreground/60">Temporary satisfaction</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">Value</div>
          <div className="text-foreground/60">Sustainable</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>The Value of Time</SectionTitle>

      <QuoteBlock>
        Time is more important than money
      </QuoteBlock>

      <Paragraph>
        Everyone gets <Strong>24 hours a day</Strong>.<br />
        Rich or poor, it&apos;s the same.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>The Value of BUYLOW</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Money + Time
          </div>
          <div className="text-foreground/60">
            What BUYLOW offers
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">Automation = Freedom</div>
        <div className="text-foreground/60">
          While you rest,<br />
          the system works
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Live for your own life</Strong>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <QuoteBlock>
        You will be the protagonist
      </QuoteBlock>

      <SectionDivider />

      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">Time</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">Memories</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">Freedom</div>
      </div>

      <SectionDivider />

      {/* Official Community Entry + Review CTA */}
      <TelegramCommunitySection lang="en" />

      <SectionDivider />

      {/* Test CTA */}
      <TestCTA lang="en" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="en" />

      <EbookCTAButton lang="en" />

      <SectionDivider />

      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Thank you
        </div>
        <div className="text-foreground/60">
          The BUYLOW Team
        </div>
      </div>
    </>
  ),
  // Chapter 6 - Full translations for all languages
  zh: () => (
    <>
      <QuoteBlock>
        BUYLOW Quant的说明到此结束
      </QuoteBlock>

      <Paragraph>
        一开始可能不太理解。<br />
        复杂、陌生、困难。
      </Paragraph>

      <Paragraph>
        但��果你现在正在阅读这篇文章，<br />
        <Strong>你已经理解了结构</Strong>。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>经验的重要性</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>亲自运行感觉��全不同</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        理论上知道和<br />
        <Strong>亲身体验</Strong>完全��同。
      </Paragraph>

      <CalloutBox type="info">
        从理论到实践的转换是关键
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>投资心态</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>���需要对资产有信心</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        黄金、纳斯达克、标普500是<br />
        <Strong>长期上涨的资产</Strong>。
      </Paragraph>

      <Paragraph>
        在过热区间调整仓位，<br />
        在低���果断买入。
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        只要没有单向-50%的下跌<br />
        大多数情况都会盈利
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>最危险的时刻</SectionTitle>

      <WarningBox>
        <Strong>开始盈利时是最危险的时刻</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;应该提高收益率&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;应该增加资产&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;应该投入更多本金&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        这种想法开始时就是风险管理失败的开始
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        可持续的收益最重要
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          赢100次<br />
          <span className="text-red-400">1次就会结束</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>个人故事</SectionTitle>

      <Paragraph>
        我已经实现了<Strong>财务自由</Strong>。
      </Paragraph>

      <Paragraph>
        但我仍在继续开发。<br />
        因为...
      </Paragraph>

      <SectionDivider />

      <SectionTitle>价值哲学</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>最重要的是价��</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">金钱</div>
          <div className="text-foreground/60">满足是暂时的</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">价值</div>
          <div className="text-foreground/60">可持续</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>时间的价值</SectionTitle>

      <QuoteBlock>
        时间比金钱���重要
      </QuoteBlock>

      <Paragraph>
        每个人每天都有<Strong>24小时</Strong>。<br />
        无论富人还是穷人都一样。
      </Paragraph>

      <Paragraph>
        但大多数��<br />
        <Accent>为他人消耗时间</Accent>。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>BUYLOW的价值</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            金钱 + 时间
          </div>
          <div className="text-foreground/60">
            BUYLOW给予你的
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">自动化 = 自由</div>
        <div className="text-foreground/60">
          当你休息时<br />
          系统在工作
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>为你自己的人生而活</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph className="text-center">
        不要为他人消耗时���。<br />
        <Strong>你的时间</Strong>是你自己的。
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        你将成为主角
      </QuoteBlock>

      <Paragraph>
        现在正在阅读这篇文章的你<br />
        将成为<Strong>下一个成功故事的主角</Strong>。
      </Paragraph>

      <SectionDivider />

      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">时间</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">��忆</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">自由</div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        希望你能与BUYLOW一起<br />
        找到你的<Strong>自由</Strong>。
      </Paragraph>

      <SectionDivider />

      {/* Official Community Entry + Review CTA */}
      <TelegramCommunitySection lang="zh" />

      <SectionDivider />

      {/* Test CTA */}
      <TestCTA lang="zh" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="zh" />

      <EbookCTAButton lang="zh" />

      <SectionDivider />

      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          感谢
        </div>
        <div className="text-foreground/60">
          BUYLOW 团队敬上
        </div>
      </div>
    </>
  ),
  ar: () => (
    <>
      <QuoteBlock>
        هذا يختتم شرح BUYLOW Quant
      </QuoteBlock>

      <Paragraph>
        في البداية، ربما لم يكن الأمر منطقيًا.<br />
        معقد وغريب وصعب.
      </Paragraph>

      <Paragraph>
        لكن إذا كنت تقرأ هذا الآن،<br />
        <Strong>فأنت تفهم الهيكل</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>��همية التجربة</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>تشغيله بنفسك يشعر بشكل م��تلف</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        المعرفة النظرية و<br />
        <Strong>التجربة ال��باشرة</Strong> مختلفتان تمامًا.
      </Paragraph>

      <CalloutBox type="info">
        الانتقال من النظرية إلى التجربة هو المفتاح
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>عقلية الاستثمار</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>تحتاج إلى الإيمان بأصولك</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        الذهب وناسداك و S&P 500 هي<br />
        <Strong>أصول ذات اتجاه صعودي طويل المدى</Strong>.
      </Paragraph>

      <Paragraph>
        قم بتعديل نسبتك في مناطق الفقاعة،<br />
        واشترِ بجرأة عند القيعان.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        طالما لا يوجد انهيار أحادي الاتج��ه -50%<br />
        معظم النتائج مربحة
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>أخطر لحظة</SectionTitle>

      <WarningBox>
        <Strong>عندما تبدأ الأرباح هي أخطر وقت</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;كان يجب زيادة العوائد&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;كان يجب إضافة المزيد من الأصول&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;كان يجب استثمار المزيد&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        هذه الأفكار تمثل بداية فشل إدارة المخاطر
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        الأرباح المستدامة ه�� الأهم
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          اربح 100 مرة،<br />
          <span className="text-red-400">اخسر كل شيء في ��رة واحدة</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>قصة شخصية</SectionTitle>

      <Paragraph>
        ��قد حققت بالفعل <Strong>الحرية المالية</Strong>.
      </Paragraph>

      <Paragraph>
        لكنني ما زلت أواصل التطوير.<br />
        لأن...
      </Paragraph>

      <SectionDivider />

      <SectionTitle>فلسفة القيمة</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>الأهم هو القيمة</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">المال</div>
          <div className="text-foreground/60">رضا مؤقت</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">القيمة</div>
          <div className="text-foreground/60">مستدامة</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>قيمة الوقت</SectionTitle>

      <QuoteBlock>
        الوقت أهم من المال
      </QuoteBlock>

      <Paragraph>
        الجميع يحصل على <Strong>24 ساعة في اليوم</Strong>.<br />
        غنيًا أو فقيرًا، إنها نفس الشيء.
      </Paragraph>

      <Paragraph>
        لكن معظم الناس<br />
        <Accent>يقضون وقتهم من أجل الآخرين</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>قيمة BUYLOW</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            المال + الوقت
          </div>
          <div className="text-foreground/60">
            ما يقدمه BUYLOW
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">الأتمتة = الحرية</div>
        <div className="text-foreground/60">
          بينما ترتاح،<br />
          يعمل النظام
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>عش لحياتك الخاصة</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph className="text-center">
        لا تقضِ وقتك من أجل الآخرين.<br />
        <Strong>وقتك</Strong> ملكك.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        س��كون البطل
      </QuoteBlock>

      <Paragraph>
        أنت الذي تقرأ هذا الآن<br />
        ستكون <Strong>بطل قصة النجاح التالية</Strong>.
      </Paragraph>

      <SectionDivider />

      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">الوقت</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">الذكريات</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">الحرية</div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        نأمل أن تجد<br />
        <Strong>حريتك</Strong> مع BUYLOW.
      </Paragraph>

      <SectionDivider />

      {/* Official Community Entry + Review CTA */}
      <TelegramCommunitySection lang="ar" />

      <SectionDivider />

      {/* Test CTA */}
      <TestCTA lang="ar" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="ar" />

      <EbookCTAButton lang="ar" />

      <SectionDivider />

      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          شكرًا لك
        </div>
        <div className="text-foreground/60">
          فريق BUYLOW
        </div>
      </div>
    </>
  ),
  ru: () => (
    <>
      <QuoteBlock>
        На этом объяснение BUYLOW Quant завершено
      </QuoteBlock>

      <Paragraph>
        Сначала это могло быть непонятно.<br />
        Сложно, незнакомо и трудно.
      </Paragraph>

      <Paragraph>
        Но если вы читаете это сейчас,<br />
        <Strong>вы понимаете структуру</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Важность опыта</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Запустить самому — это совсем другое ощущение</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Знать теоретически и<br />
        <Strong>испытать на практике</Strong> — это совершенно разные вещи.
      </Paragraph>

      <CalloutBox type="info">
        Переход от ��еории к практике — ключевой момент
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Инвестиционное мышление</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Вам нужна вера в свои активы</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Золото, NASDAQ, S&P 500 —<br />
        <Strong>ак��ивы с долгосрочн��м восходящим трендом</Strong>.
      </Paragraph>

      <Paragraph>
        ��орректируйте ��озицию в периоды перегрева,<br />
        смело покупайте на минимумах.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Пок�� нет одностороннего падения на -50%,<br />
        большинство результатов прибыльны
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Самый опасный момент</SectionTitle>

      <WarningBox>
        <Strong>Когда начинается прибыль �� это с��мый опасный момент</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Н��до было увеличить доходность&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Надо было добавить больше активов&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Надо было влож��ть больше&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        Эти мысли — начало провала в управлении рисками
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Устойчивая прибыль важнее всего
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          Выиграйте 100 раз,<br />
          <span className="text-red-400">потеряй��е всё за 1 раз</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Личн��я история</SectionTitle>

      <Paragraph>
        Я уже достиг <Strong>финансовой свободы</Strong>.
      </Paragraph>

      <Paragraph>
        Но я продолжаю развивать проект.<br />
        Потому что...
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Философия ценности</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>Самое важное — это ценность</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">Деньги</div>
          <div className="text-foreground/60">Временное удовлетворение</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">Ценность</div>
          <div className="text-foreground/60">Устойчи��ая</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Ценность времени</SectionTitle>

      <QuoteBlock>
        Вре��я важнее денег
      </QuoteBlock>

      <Paragraph>
        У каждого есть <Strong>24 часа в сутки</Strong>.<br />
        Богатый или бедный — одинаково.
      </Paragraph>

      <Paragraph>
        Но большинство л��дей<br />
        <Accent>тратят время на других</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Ценность BUYLOW</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Деньги + Время
          </div>
          <div className="text-foreground/60">
            То, что даёт BUYLOW
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">Автоматизация = Свобода</div>
        <div className="text-foreground/60">
          Пока вы отдыхаете,<br />
          система работает
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Живите для своей собственной жизни</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph className="text-center">
        Не тратьте время на других.<br />
        <Strong>Ваше время</Strong> принадлежит вам.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Вы станете главным героем
      </QuoteBlock>

      <Paragraph>
        Вы, читающие это сейчас,<br />
        станете <Strong>героем следующей истории успеха</Strong>.
      </Paragraph>

      <SectionDivider />

      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">Время</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">Воспоминания</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">Свобода</div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        Надеемся, что вы найдёте<br />
        свою <Strong>свободу</Strong> с BUYLOW.
      </Paragraph>

      <SectionDivider />

      {/* Official Community Entry + Review CTA */}
      <TelegramCommunitySection lang="ru" />

      <SectionDivider />

      {/* Test CTA */}
      <TestCTA lang="ru" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="ru" />

      <EbookCTAButton lang="ru" />

      <SectionDivider />

      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Спасибо
        </div>
        <div className="text-foreground/60">
          Команда BUYLOW
        </div>
      </div>
    </>
  ),
  es: () => (
    <>
      <QuoteBlock>
        Esto concluye la explicación de BUYLOW Quant
      </QuoteBlock>

      <Paragraph>
        Al principio, puede que no tuviera sentido.<br />
        Complejo, desconocido y difícil.
      </Paragraph>

      <Paragraph>
        Pero si estás leyendo esto ahora,<br />
        <Strong>entiendes la estructura</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>La Importancia de la Experiencia</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Ejecutarlo tú mismo se siente diferente</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Saber en teoría y<br />
        <Strong>experimentar directamente</Strong> son completamente diferentes.
      </Paragraph>

      <CalloutBox type="info">
        La transición de teoría a experiencia es clave
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Mentalidad de Inversión</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Necesitas fe en tus activos</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        El oro, NASDAQ, S&P 500 son<br />
        <Strong>activos con tendencia alcista a largo plazo</Strong>.
      </Paragraph>

      <Paragraph>
        Ajusta tu posición en zonas de sobrecalentamiento,<br />
        compra con decisión en los mínimos.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Mientras no haya una caída unidireccional del -50%,<br />
        la mayoría de los resultados son rentables
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>El Momento Más Peligroso</SectionTitle>

      <WarningBox>
        <Strong>Cuando comienzan las ganancias es el momento más peligroso</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Debería haber aumentado los rendimientos&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Debería haber añadido más activos&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Debería haber invertido más&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        Estos pensamientos marcan el inicio del fracaso en la gestión de riesgos
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Las ganancias sostenibles son lo más importante
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          Gana 100 veces,<br />
          <span className="text-red-400">piérdelo todo en 1</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Historia Personal</SectionTitle>

      <Paragraph>
        Ya he alcanzado la <Strong>libertad financiera</Strong>.
      </Paragraph>

      <Paragraph>
        Pero sigo desarrollando.<br />
        Porque...
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Filosofía del Valor</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>Lo más importante es el valor</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">Dinero</div>
          <div className="text-foreground/60">Satisfacción temporal</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">Valor</div>
          <div className="text-foreground/60">Sostenible</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>El Valor del Tiempo</SectionTitle>

      <QuoteBlock>
        El tiempo es más importante que el dinero
      </QuoteBlock>

      <Paragraph>
        Todos tienen <Strong>24 horas al día</Strong>.<br />
        Rico o pobre, es lo mismo.
      </Paragraph>

      <Paragraph>
        Pero la mayoría de las personas<br />
        <Accent>gastan su tiempo para otros</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>El Valor de BUYLOW</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Dinero + Tiempo
          </div>
          <div className="text-foreground/60">
            Lo que BUYLOW ofrece
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">Automatización = Libertad</div>
        <div className="text-foreground/60">
          Mientras descansas,<br />
          el sistema trabaja
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Vive para tu propia vida</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph className="text-center">
        No gastes tu tiempo en otros.<br />
        <Strong>Tu tiempo</Strong> es tuyo.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Tú serás el protagonista
      </QuoteBlock>

      <Paragraph>
        Tú que estás leyendo esto ahora<br />
        serás <Strong>el protagonista de la próxima historia de éxito</Strong>.
      </Paragraph>

      <SectionDivider />

      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">Tiempo</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">Recuerdos</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">Libertad</div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        Esperamos que encuentres<br />
        tu <Strong>libertad</Strong> con BUYLOW.
      </Paragraph>

      <SectionDivider />

      {/* Official Community Entry + Review CTA */}
      <TelegramCommunitySection lang="es" />

      <SectionDivider />

      {/* Test CTA */}
      <TestCTA lang="es" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="es" />

      <EbookCTAButton lang="es" />

      <SectionDivider />

      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Gracias
        </div>
        <div className="text-foreground/60">
          El Equipo BUYLOW
        </div>
      </div>
    </>
  ),
  id: () => (
    <>
      <QuoteBlock>
        Ini mengakhiri penjelasan tentang BUYLOW Quant
      </QuoteBlock>

      <Paragraph>
        Pada awalnya, mungkin tidak masuk akal.<br />
        Kompleks, asing, dan sulit.
      </Paragraph>

      <Paragraph>
        Tapi jika Anda membaca ini sekarang,<br />
        <Strong>Anda memahami strukturnya</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Pentingnya Pengalaman</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Menjalankannya sendiri terasa berbeda</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Tahu secara teori dan<br />
        <Strong>mengalami langsung</Strong> sangat berbeda.
      </Paragraph>

      <CalloutBox type="info">
        Transisi dari teori ke pengalaman adalah kuncinya
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Pola Pikir Investasi</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Anda perlu keyakinan pada aset Anda</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Emas, NASDAQ, S&P 500 adalah<br />
        <Strong>aset dengan tren naik jangka panjang</Strong>.
      </Paragraph>

      <Paragraph>
        Sesuaikan porsi di zona overheated,<br />
        beli dengan berani di titik terendah.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Selama tidak ada penurunan satu arah -50%,<br />
        sebagian besar hasil menguntungkan
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Momen Paling Berbahaya</SectionTitle>

      <WarningBox>
        <Strong>Saat profit mulai adalah waktu paling berbahaya</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Seharusnya meningkatkan return&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Seharusnya menambah lebih banyak aset&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Seharusnya investasi lebih banyak&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        Pikiran-pikiran ini menandai awal kegagalan manajemen risiko
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Profit berkelanjutan adalah yang paling penting
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          Menang 100 kali,<br />
          <span className="text-red-400">kehilangan semuanya dalam 1 kali</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Cerita Pribadi</SectionTitle>

      <Paragraph>
        Saya sudah mencapai <Strong>kebebasan finansial</Strong>.
      </Paragraph>

      <Paragraph>
        Tapi saya masih terus mengembangkan.<br />
        Karena...
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Filosofi Nilai</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>Yang paling penting adalah nilai</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">Uang</div>
          <div className="text-foreground/60">Kepuasan sementara</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">Nilai</div>
          <div className="text-foreground/60">Berkelanjutan</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Nilai Waktu</SectionTitle>

      <QuoteBlock>
        Waktu lebih penting daripada uang
      </QuoteBlock>

      <Paragraph>
        Setiap orang mendapat <Strong>24 jam sehari</Strong>.<br />
        Kaya atau miskin, sama saja.
      </Paragraph>

      <Paragraph>
        Tapi kebanyakan orang<br />
        <Accent>menghabiskan waktu untuk orang lain</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Nilai BUYLOW</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Uang + Waktu
          </div>
          <div className="text-foreground/60">
            Yang BUYLOW tawarkan
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">Otomatisasi = Kebebasan</div>
        <div className="text-foreground/60">
          Saat Anda istirahat,<br />
          sistem bekerja
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Hiduplah untuk hidup Anda sendiri</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph className="text-center">
        Jangan habiskan waktu untuk orang lain.<br />
        <Strong>Waktu Anda</Strong> milik Anda.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Anda akan menjadi protagonis
      </QuoteBlock>

      <Paragraph>
        Anda yang membaca ini sekarang<br />
        akan menjadi <Strong>protagonis kisah sukses berikutnya</Strong>.
      </Paragraph>

      <SectionDivider />

      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">Waktu</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">Kenangan</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">Kebebasan</div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        Semoga Anda menemukan<br />
        <Strong>kebebasan</Strong> Anda bersama BUYLOW.
      </Paragraph>

      <SectionDivider />

      {/* Official Community Entry + Review CTA */}
      <TelegramCommunitySection lang="id" />

      <SectionDivider />

      {/* Test CTA */}
      <TestCTA lang="id" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="id" />

      <EbookCTAButton lang="id" />

      <SectionDivider />

      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Terima kasih
        </div>
        <div className="text-foreground/60">
          Tim BUYLOW
        </div>
      </div>
    </>
  ),
  th: () => (
    <>
      <QuoteBlock>
        นี่เป็นการสรุ�����ำอธิบาย BUYLOW Quant
      </QuoteBlock>

      <Paragraph>
        ตอนแรกอาจจะไม่เข้าใจ<br />
        ซับซ้อน แปลก และยาก
      </Paragraph>

      <Paragraph>
        แต่ถ้าคุณกำลังอ่านนี้อยู่<br />
        <Strong>คุณเข้าใจโครงสร้างแล้ว</Strong>
      </Paragraph>

      <SectionDivider />

      <SectionTitle>ความสำคัญของประสบการณ์</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>การรันด้วยต��วเองให้ความรู้สึกที่แตกต่าง</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        การรู้ในทางทฤษฎีกับ<br />
        <Strong>ประสบการณ์จริง</Strong>นั้นแตกต่างกันโดยสิ้นเชิง
      </Paragraph>

      <CalloutBox type="info">
        การเปลี่ยนจา��ทฤษฎีสู่ป��ะสบการณ์คือกุญแจสำ���ัญ
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>แนวคิดการลงทุน</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>คุณต้องมีความเชื่อมั่นในสินทรัพย์ของคุณ</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        ทองคำ, NASDAQ, S&P 500 คือ<br />
        <Strong>สินทรัพย์ที่��ีแนวโน้มขาขึ้นระยะยาว</Strong>
      </Paragraph>

      <Paragraph>
        ปรับสัดส่วนในช่วงร้อนแรง<br />
        ซื้อ���ย่างกล้าหาญที่จุดต่ำ
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        ตราบใดที่ไม่มีการตกทางเดียว -50%<br />
        ส่วนใหญ่จะมีกำไร
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>ช่วงเว���าที่อันตรายที่สุด</SectionTitle>

      <WarningBox>
        <Strong>เมื่อเริ่มมีกำไรคือช่วงเวลาที่อันตรายที่สุด</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;น่าจะเพิ่มผลตอบ��ทน&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;น่าจะเพิ่มสินทรัพย์มากขึ้น&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;น่าจะลงทุนมากขึ้น&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        ความคิดเหล่านี้เป็นจุดเริ่มต��นของความล้มเหลวในการบริหารความเสี่ยง
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        กำไรที่ยั่งยืนสำ���ัญที่สุด
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          ชนะ 100 ครั้ง<br />
          <span className="text-red-400">เสียทุกอย่างใน 1 ครั้ง</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>เรื่องราวส่วนตัว</SectionTitle>

      <Paragraph>
        ผมได้บรรลุ<Strong>อิสรภาพทางการเงิน</Strong>แล้ว
      </Paragraph>

      <Paragraph>
        แต่ผมยังคงพัฒนาต่อไป<br />
        เพราะว่า...
      </Paragraph>

      <SectionDivider />

      <SectionTitle>ปรัชญาแห่งคุณค่า</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>สิ่งที่สำคัญที���สุดคือคุณค่า</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">เงิน</div>
          <div className="text-foreground/60">ความพึง���อใจชั่วคราว</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">คุณค่า</div>
          <div className="text-foreground/60">ยั่งยืน</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>คุณค���าของเวลา</SectionTitle>

      <QuoteBlock>
        เวลาสำคัญกว่าเงิน
      </QuoteBlock>

      <Paragraph>
        ทุกคนม��<Strong>24 ชั่วโมงต่อวัน</Strong><br />
        รวยหรือจน ก็เหมือนกัน
      </Paragraph>

      <Paragraph>
        แต่คนส่วนใ��ญ่<br />
        <Accent>ใช้��วลาเพื่อคนอื่น</Accent>
      </Paragraph>

      <SectionDivider />

      <SectionTitle>คุณค่าของ BUYLOW</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            เงิน + เวลา
          </div>
          <div className="text-foreground/60">
            ส���่งที่ BUYLOW มอบให้
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">ระบบอัตโนมัติ = อิสร��าพ</div>
        <div className="text-foreground/60">
          ขณะที่คุณพักผ่อน<br />
          ระบบทำงาน
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>ใช้ชีวิตเพื่อตัวเอง</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph className="text-center">
        อย่าใช้เวลาเพื่อคนอื่น<br />
        <Strong>เวลาของคุณ</Strong>เป็นของคุณ
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        คุณจะเป็นตัวเอก
      </QuoteBlock>

      <Paragraph>
        คุณที่กำลั��อ่านนี้อยู่<br />
        จะเป็น<Strong>ตัวเอกของเรื่องราวความสำเร็จต่อไป</Strong>
      </Paragraph>

      <SectionDivider />

      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">เ��ลา</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">ความทรงจำ</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">อิสรภาพ</div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        หวัง��่าคุณจะพบ<br />
        <Strong>อิสรภาพ</Strong>ของคุณกับ BUYLOW
      </Paragraph>

      <SectionDivider />

      {/* Official Community Entry + Review CTA */}
      <TelegramCommunitySection lang="th" />

      <SectionDivider />

      {/* Test CTA */}
      <TestCTA lang="th" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="th" />

      <EbookCTAButton lang="th" />

      <SectionDivider />

      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          ขอบคุณ
        </div>
        <div className="text-foreground/60">
          ทีม BUYLOW
        </div>
      </div>
    </>
  ),
  vi: () => (
    <>
      <QuoteBlock>
        Đây là phần kết của giải thích về BUYLOW Quant
      </QuoteBlock>

      <Paragraph>
        Ban đầu, có thể không hiểu.<br />
        Phức tạp, xa lạ và khó khăn.
      </Paragraph>

      <Paragraph>
        Nhưng nếu bạn đang ��ọc điều này bây giờ,<br />
        <Strong>bạn đã hiểu cấu trúc</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Tầm quan trọng của Kinh nghiệm</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Tự mình chạy nó cảm giác hoàn toàn khác</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Biết lý thuyết và<br />
        <Strong>trải nghiệm trực tiếp</Strong> hoàn toàn khác nhau.
      </Paragraph>

      <CalloutBox type="info">
        Chuyển đổi từ lý thuyết sang thực hành là chìa khóa
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Tư duy Đầu tư</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Bạn cần niềm tin vào tài sản của mình</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Vàng, NASDAQ, S&P 500 là<br />
        <Strong>tài sản có xu hướng tăng dài hạn</Strong>.
      </Paragraph>

      <Paragraph>
        Điều chỉnh tỷ lệ trong vùng quá nhiệt,<br />
        mua mạnh ở điểm thấp.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Miễn là không có sụt giảm một chiều -50%,<br />
        hầu hết kết quả đều có lời
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Khoảnh khắc Nguy hiểm Nhất</SectionTitle>

      <WarningBox>
        <Strong>Khi bắt đầu có lợi nhuận là lúc nguy hiểm nhất</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Lẽ ra nên tăng lợi nhuận&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Lẽ ra nên thêm tài sản&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Lẽ ra nên đầu tư nhiều hơn&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        Những suy nghĩ này đánh dấu sự khởi đầu của thất bại quản lý rủi ro
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Lợi nhuận bền vững là quan trọng nhất
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          Thắng 100 lần,<br />
          <span className="text-red-400">mất tất cả trong 1 lần</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Câu chuyện Cá nhân</SectionTitle>

      <Paragraph>
        Tôi đã đạt được <Strong>tự do tài chính</Strong>.
      </Paragraph>

      <Paragraph>
        Nhưng tôi vẫn tiếp tục phát triển.<br />
        Bởi vì...
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Triết lý Giá trị</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>Điều quan trọng nhất là giá trị</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">Tiền</div>
          <div className="text-foreground/60">Sự hài lòng tạm thời</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">Giá trị</div>
          <div className="text-foreground/60">Bền vững</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Giá trị của Thời gian</SectionTitle>

      <QuoteBlock>
        Th��i gian quan trọng hơn tiền bạc
      </QuoteBlock>

      <Paragraph>
        Mọi người đều có <Strong>24 giờ mỗi ngày</Strong>.<br />
        Giàu hay nghèo, đều như nhau.
      </Paragraph>

      <Paragraph>
        Nhưng hầu hết mọi người<br />
        <Accent>dành thời gian cho người khác</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Giá trị của BUYLOW</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Tiền + Thời gian
          </div>
          <div className="text-foreground/60">
            Những gì BUYLOW mang lại
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">Tự động hóa = Tự do</div>
        <div className="text-foreground/60">
          Khi bạn nghỉ ngơi,<br />
          hệ thống vẫn hoạt động
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>S��ng cho cuộc sống của chính bạn</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph className="text-center">
        Đừng dành thời gian cho người khác.<br />
        <Strong>Thời gian của bạn</Strong> là của bạn.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Bạn s�� là nhân vật chính
      </QuoteBlock>

      <Paragraph>
        Bạn đang đọc điều này<br />
        sẽ là <Strong>nhân vật chính của câu chuyện thành công tiếp theo</Strong>.
      </Paragraph>

      <SectionDivider />

      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">Thời gian</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">Kỷ niệm</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">Tự do</div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        Hy vọng bạn tìm thấy<br />
        <Strong>tự do</Strong> của m��nh cùng BUYLOW.
      </Paragraph>

      <SectionDivider />

      {/* Official Community Entry + Review CTA */}
      <TelegramCommunitySection lang="vi" />

      <SectionDivider />

      {/* Test CTA */}
      <TestCTA lang="vi" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="vi" />

      <EbookCTAButton lang="vi" />

      <SectionDivider />

      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Cảm ơn
        </div>
        <div className="text-foreground/60">
          Đội ngũ BUYLOW
        </div>
      </div>
    </>
  ),
  tr: () => (
    <>
      <QuoteBlock>
        BUYLOW Quant açıklaması burada sona eriyor
      </QuoteBlock>

      <Paragraph>
        İlk başta mantıklı gelmemiş olabilir.<br />
        Karmaşık, yabancı ve zor.
      </Paragraph>

      <Paragraph>
        Ama şimdi bunu okuyorsanız,<br />
        <Strong>yapıyı anlıyorsunuz</Strong>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Deneyimin Önemi</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Kendiniz çalıştırmak tamamen farklı hissettiriyor</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Teorik olarak bilmek ve<br />
        <Strong>doğrudan deneyimlemek</Strong> tamamen farklı.
      </Paragraph>

      <CalloutBox type="info">
        Teoriden deneyime geçiş anahtardır
      </CalloutBox>

      <SectionDivider />

      <SectionTitle>Yatırım Zihniyeti</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl">
          <Accent>Varlıklarınıza inanmanız gerekiyor</Accent>
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        Altın, NASDAQ, S&P 500<br />
        <Strong>uzun vadeli yükseliş trendinde olan varlıklardır</Strong>.
      </Paragraph>

      <Paragraph>
        Aşırı ısınan bölgelerde oranı ayarlayın,<br />
        dip noktalarda cesurca satın alın.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Tek yönlü -50% düşüş olmadığı sürece,<br />
        çoğu sonuç kârlıdır
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>En Tehlikeli An</SectionTitle>

      <WarningBox>
        <Strong>Kâr başladığında en tehlikeli zamandır</Strong>
      </WarningBox>

      <div className="my-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-lg text-foreground/70 italic">&quot;Getiriyi artırmalıydım&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Daha fazla varlık eklemeliyidim&quot;</div>
          <div className="text-lg text-foreground/70 italic">&quot;Daha fazla yatırım yapmalıydım&quot;</div>
        </div>
      </div>

      <CalloutBox type="warning">
        Bu düşünceler risk yönetimi başarısızlığının başlangıcıdır
      </CalloutBox>

      <SectionDivider />

      <QuoteBlock>
        Sürdürülebilir kârlar en önemlisidir
      </QuoteBlock>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-2xl md:text-3xl font-bold">
          100 kez kazan,<br />
          <span className="text-red-400">1 kerede hepsini kaybet</span>
        </Paragraph>
      </HighlightBox>

      <SectionDivider />

      <SectionTitle>Kişisel Hikaye</SectionTitle>

      <Paragraph>
        <Strong>Finansal özgürlüğe</Strong> zaten ulaştım.
      </Paragraph>

      <Paragraph>
        Ama hala geliştirmeye devam ediyorum.<br />
        Çünkü...
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Değer Felsefesi</SectionTitle>

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Accent>En önemli şey değerdir</Accent>
        </Paragraph>
      </HighlightBox>

      <div className="my-8 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-red-400 mb-2">Para</div>
          <div className="text-foreground/60">Geçici tatmin</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-lg font-bold text-emerald-400 mb-2">Değer</div>
          <div className="text-foreground/60">Sürdürülebilir</div>
        </div>
      </div>

      <SectionDivider />

      <SectionTitle>Zamanın Değeri</SectionTitle>

      <QuoteBlock>
        Zaman paradan daha önemlidir
      </QuoteBlock>

      <Paragraph>
        Herkes <Strong>günde 24 saat</Strong> alır.<br />
        Zengin veya fakir, ayn��.
      </Paragraph>

      <Paragraph>
        Ama çoğu insan<br />
        <Accent>zaman��nı başkaları için harcıyor</Accent>.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>BUYLOW&apos;ın Değeri</SectionTitle>

      <HighlightBox>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Para + Zaman
          </div>
          <div className="text-foreground/60">
            BUYLOW&apos;ın sunduğu
          </div>
        </div>
      </HighlightBox>

      <div className="my-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-6 text-center">
        <div className="text-xl font-bold text-cyan-400 mb-2">Otomasyon = Özgürlük</div>
        <div className="text-foreground/60">
          Siz dinlenirken,<br />
          sistem çalışıyor
        </div>
      </div>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-xl md:text-2xl">
          <Strong>Kendi hayatınız için yaşayın</Strong>
        </Paragraph>
      </HighlightBox>

      <Paragraph className="text-center">
        Zamanınızı başkaları için harcamayın.<br />
        <Strong>Zamanınız</Strong> sizin.
      </Paragraph>

      <SectionDivider />

      <QuoteBlock>
        Siz ana karakter olacaksınız
      </QuoteBlock>

      <Paragraph>
        Şimdi bunu okuyan siz<br />
        <Strong>bir sonraki başarı hikayesinin kahramanı</Strong> olacaksınız.
      </Paragraph>

      <SectionDivider />

      <div className="my-12 text-center space-y-6">
        <div className="text-2xl md:text-3xl font-bold text-foreground">Zaman</div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">Anılar</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">Özgürlük</div>
      </div>

      <Paragraph className="text-center text-foreground/60">
        BUYLOW ile<br />
        <Strong>özgürlüğünüzü</Strong> bulmanızı umuyoruz.
      </Paragraph>

      <SectionDivider />

      {/* Official Community Entry + Review CTA */}
      <TelegramCommunitySection lang="tr" />

      <SectionDivider />

      {/* Test CTA */}
      <TestCTA lang="tr" />

      <SectionDivider />

      {/* Password Hint and CTA */}
      <PasswordMosaicReveal lang="tr" />

      <EbookCTAButton lang="tr" />

      <SectionDivider />

      <div className="my-12 text-center">
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Teşekkürler
        </div>
        <div className="text-foreground/60">
          BUYLOW Ekibi
        </div>
      </div>
    </>
  ),
}

// Chapter 1 Content: 어떤 자산을 선택해야하는가?
const Chapter1Content = {
  ko: () => (
    <>
      {/* 1. 도입 - 핵심 문장 강조 */}
      <QuoteBlock>
        같은 알고리즘이라도<br />
        <Accent>어떤 자산을 선택하느냐</Accent>에 따라<br />
        수익률은 천차만별이다.
      </QuoteBlock>

      {/* 2. 평균회귀 + 자산 특성 설명 */}
      <Paragraph>
        퀀트에 대해 조금이라도 공부해본 사람들은 알겠지만<br />
        같은 알고리즘이라도 어떤 자산을 선택하느냐에 따라<br />
        수익률은 천차만별이다.
      </Paragraph>

      <Paragraph>
        <Strong>R-R Strategy</Strong>는 <Accent>&quot;평균회귀&quot;</Accent> 기반으로 만들어졌기에<br />
        차트의 가격이 우하향하는 자산보다는 <Accent>&quot;우상향&quot;</Accent>하는 자산일 때<br />
        훨씬 높은 승률을 보여준다.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>자산별 안정성 비교</SectionTitle>

      <BulletList items={[
        <>개별 주식보다는 <Strong>100개 기업이 종합된 NAS100 ETF</Strong>가 훨씬 안정적인 수익률을 만들 수 있고,</>,
        <>알트코인보다는 <Strong>비트코인</Strong>이 훨씬 안정적이며,</>,
        <>은, 가스 같은 자산보다는 <Strong>금(GOLD)</Strong>이 훨씬 안정적인 수익률을 낼 수 있다.</>,
      ]} />

      <SectionDivider />

      {/* 3. 핵심 문장 강조 - 카드형 */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          결국 중요한 것은<br /><br />
          <Strong>&quot;어떤 알고리즘을 쓰느냐&quot;</Strong>가 아니라<br />
          <Accent>&quot;어떤 자산 위에서 그 알고리즘을 구동하느냐&quot;</Accent>다.
        </Paragraph>
      </HighlightBox>

      <Paragraph>
        즉, 역사적으로 <Strong>평균회귀의 움직임</Strong>을 보여준 자산을 선택하여<br />
        프로그램을 구동해야 한다.
      </Paragraph>

      <SectionDivider />

      {/* 4. 평균회귀 자산 조건 설명 - Quote 스타일 */}
      <QuoteBlock>
        &quot;차트가 아무리 떨어지더라도&quot;<br />
        결국 반등하여 평균 가격으로 회귀하는 움직임을 보이는 자산이어야 한다.
      </QuoteBlock>

      <SectionDivider />

      {/* 5. R-R 전략 리스크 & 대응 전략 섹션 */}
      {/* 집중 강조 박스 */}
      <div className="my-6 bg-red-500/10 border border-red-500/40 rounded-xl p-5 text-center">
        <div className="text-red-400 font-bold text-xl mb-2">집중</div>
        <div className="text-foreground text-lg">
          그렇다면 R-R 전략은 손실이 전혀 나지 않는 걸까?
        </div>
      </div>

      <Paragraph className="text-center text-xl font-bold">
        절대 아니다.
      </Paragraph>

      {/* 위험 구간 - 경고 박스 */}
      <WarningBox>
        <div className="text-center">
          <Strong>기술적 반등 없이 원웨이로 하락하는 구간</Strong>
        </div>
      </WarningBox>

      <Paragraph>
        R-R 모델은 평균회귀 기반으로 만들어졌기 때문에,
      </Paragraph>

      <Paragraph>
        차트가 기술적 반등(회귀) 없이 원웨이로 하락한다면<br />
        대응이 어렵다.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>해결 방법</SectionTitle>

      <Paragraph>
        이 문제를 해결하기 위해<br />
        R-R 전략은 다음 <Strong>&apos;2가지&apos;</Strong> 해결방안을 만들었다.
      </Paragraph>

      {/* 해결 방법 2가지 - 카드 2개 */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 카드 1: 자산 선택 */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="text-emerald-400 font-bold text-lg mb-3 text-center">[1] 자산 선택</div>
          <div className="text-foreground/90 leading-relaxed space-y-3">
            <p>원웨이 하락이 구조적으로 발생하기 어려운 자산을 선택한다.</p>
            <p>알트코인이나 개별 주식은 특정 악재로 인해<br />원웨이 하락이 발생할 수 있지만,</p>
            <p><Strong>금(GOLD), S&P500, 비트코인</Strong>처럼<br />시장 규모가 큰 자산은 상대적으로<br />원웨이 하락 가능성이 낮다.</p>
          </div>
        </div>

        {/* 카드 2: 분산화 */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="text-cyan-400 font-bold text-lg mb-3 text-center">[2] 분산화</div>
          <div className="text-foreground/90 leading-relaxed space-y-3">
            <p>아무리 금이나 S&P500 같은 우상향 자산이라도<br />전쟁, 금리, 거시경제 변수 등으로 인해<br />단기적인 원웨이 하락이 발생할 수 있다.</p>
            <p>이를 해결하기 위해<br />R-R 전략은 자산을 분산하여 리스크를 관리한다.</p>
            <p className="text-sm text-foreground/70">
              → 비트코인, S&P500 같은 위험자산이 하락할 때<br />
              → 금과 같은 안전자산은 횡보하거나 상승하며<br />
              → 전체 포트폴리오 리스크를 완화한다.
            </p>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 정리 4줄 - 강조 박스 */}
      <HighlightBox>
        <div className="text-center mb-4 text-foreground/70">정리하면,</div>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 font-bold shrink-0">[1]</span>
            <span>R-R Strategy는 <Strong>횡보 · 상승 · 반등 구간</Strong>에서 수익을 낸다</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 font-bold shrink-0">[2]</span>
            <span><Accent>원웨이 하락</Accent>이 유일한 위험 구간이다</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 font-bold shrink-0">[3]</span>
            <span><Strong>하방이 제한된 자산</Strong>을 선택해야 한다</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 font-bold shrink-0">[4]</span>
            <span><Strong>GOLD / NAS100 / BTC</Strong> 자산을 분산해야 한다</span>
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      {/* 6. 3대 자산 리스트 - 카드형 강조 */}
      <SectionTitle>역사적으로 그런 움직임을 보여준 자산</SectionTitle>

      <Paragraph>
        역사적으로 그런 움직임을 보여준 자산은<br />
        다음 <Strong>3가지</Strong>라고 생각한다.
      </Paragraph>

      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
          <div className="text-emerald-400 font-bold text-lg mb-2">[1]</div>
          <div className="text-xl font-bold text-foreground">NAS100, S&P 500</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
          <div className="text-amber-400 font-bold text-lg mb-2">[2]</div>
          <div className="text-xl font-bold text-foreground">GOLD</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
          <div className="text-cyan-400 font-bold text-lg mb-2">[3]</div>
          <div className="text-xl font-bold text-foreground">BTC</div>
        </div>
      </div>

      {/* 기존 이미지 유지 - 실제 시장에��의 차이 */}
      <ChapterImage
        src={getChapter1Image("ko")}
        alt="자산별 수익률 비교 차트"
      />

      <SectionDivider />

      {/* 6. 다음 챕터 연결 */}
      <SectionTitle>다음 챕터 안내</SectionTitle>

      <div className="my-6 space-y-4">
        <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-lg shrink-0">1</div>
            <div className="text-foreground/90 leading-relaxed">
              먼저 <Strong>첫 번째 챕터</Strong>에서는<br />
              이 자산들이 왜 우상향할 수밖에 없는지<br />
              <Accent>그 구조적인 이유</Accent>에 대해 설명할 것이다.
            </div>
          </div>
        </div>
        <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-lg shrink-0">2</div>
            <div className="text-foreground/90 leading-relaxed">
              그리고 <Strong>두 번째 챕터</Strong>에서는<br />
              R-R Strategy가 어떤 방식으로 설계되었는지,<br />
              그리고 시장 상황에 맞게 <Accent>어떻게 운용해야 하는지</Accent>를 설명할 예정이다.
            </div>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* 마지막 - CTA */}
      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          자, 이제 <Strong>다음 페이지</Strong>로 넘어가보자.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  en: () => (
    <>
      <QuoteBlock>
        Asset selection is more important than the quant algorithm itself
      </QuoteBlock>

      <SectionTitle>Same Algorithm, Different Results</SectionTitle>

      <Paragraph>
        Even with the same quant algorithm,
        <Strong>the asset you apply it to</Strong> completely changes the outcome.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Real Market Differences</SectionTitle>

      {/* Language-specific comparison chart */}
      <ChapterImage
        src={getChapter1Image("en")}
        alt="Asset Return Comparison Chart"
      />

      <StatGrid>
        <StatCard value="+100%" label="Gold" type="positive" />
        <StatCard value="+500%" label="Silver" type="positive" />
        <StatCard value="-50%" label="Bitcoin" type="negative" />
      </StatGrid>

      <SectionDivider />

      <SectionTitle>Quant Algorithm Profit Structure</SectionTitle>

      <Paragraph>
        The BUYLOW quant algorithm operates in these 4 market conditions:
      </Paragraph>

      <AlgorithmStepsGrid>
        <AlgorithmStepCard
          step={1}
          title="Sideways Market"
          description="Profit through repeated trades in ranging markets"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
          imageAlt="Sideways market trading strategy"
        />
        <AlgorithmStepCard
          step={2}
          title="Bull Market"
          description="Maximize profit with trend following strategies"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
          imageAlt="Bull market trend following strategy"
        />
        <AlgorithmStepCard
          step={3}
          title="Decline"
          description="Defend losses using technical rebounds"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
          imageAlt="Decline phase technical rebound strategy"
        />
        <AlgorithmStepCard
          step={4}
          title="Recovery"
          description="Convert back to profit during recovery phases"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
          imageAlt="Recovery phase profit conversion strategy"
        />
      </AlgorithmStepsGrid>

      <SectionDivider />

      <SectionTitle>The Only Risk Zone</SectionTitle>

      <WarningBox>
        <Strong>One-way decline without technical rebounds</Strong>
        <br /><br />
        No quant algorithm can handle this. Choose assets with <Accent>low one-way decline probability</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Which asset you choose determines everything
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Asset Comparison</SectionTitle>

      <img
        src={getIntroAssetComparisonImage("en")}
        alt="Asset Comparison Analysis Chart"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <AssetCard title="Crypto (BTC, ETH)" risk="High Risk" riskColor="high"
        description={<>Possible <Strong>-60%+ one-way decline</Strong>. High volatility means extreme risk.</>}
      />
      <AssetCard title="Individual Stocks" risk="Medium Risk" riskColor="medium"
        description={<>Company-specific risks. <Strong>Unpredictable variables</Strong> from earnings and management issues.</>}
      />
      <AssetCard title="ETFs (QQQ, SPY)" risk="Stable" riskColor="low"
        description={<>Index-based <Strong>diversification</Strong>. Long-term <Accent>upward trend</Accent>.</>}
      />
      <AssetCard title="Gold" risk="Best" riskColor="low"
        description={<><Strong>Limited downside</Strong> safe asset. Best fit for quant algorithm structure.</>}
      />

      <SectionDivider />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl mb-4">
            <Strong>Main Asset:</Strong> <Accent>GOLD</Accent>
          </div>
          <div className="text-base md:text-lg text-foreground/70">
            <Strong>Sub Asset:</Strong> NASDAQ (QQQ)
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <WarningBox>
        <Strong>If you expect 1000% annual returns, close this book</Strong>
        <br /><br />
        This book is for those pursuing <Accent>sustainable profit structures</Accent>.
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Now that you&apos;ve chosen your asset,<br />
          let&apos;s learn <Strong>how the BUYLOW quant algorithm works</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  // Translated versions for 8 languages
  zh: () => (
    <>
      <QuoteBlock>
        资产选择比量化算法本身更重要
      </QuoteBlock>

      <SectionTitle>相同算法，不同结果</SectionTitle>

      <Paragraph>
        即使使用相同的量化算法，
        <Strong>应用的资产</Strong>会完全改变结果。
      </Paragraph>

      <SectionDivider />

      <SectionTitle>实际市场差异</SectionTitle>

      {/* Language-specific comparison chart */}
      <ChapterImage
        src={getChapter1Image("zh")}
        alt="资产���益对���图"
      />

      <StatGrid>
        <StatCard value="+100%" label="黄金" type="positive" />
        <StatCard value="+500%" label="白银" type="positive" />
        <StatCard value="-50%" label="比特币" type="negative" />
      </StatGrid>

      <SectionDivider />

      <SectionTitle>量化算法盈利结构</SectionTitle>

      <Paragraph>
        BUYLOW量化算法在以下4种市场条件下运作:
      </Paragraph>

      <AlgorithmStepsGrid>
        <AlgorithmStepCard
          step={1}
          title="横盘市场"
          description="通过重复交易获利"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
          imageAlt="横盘市场交易策略"
        />
        <AlgorithmStepCard
          step={2}
          title="上涨市场"
          description="趋势跟踪最大化收益"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
          imageAlt="上涨市场趋���跟踪策略"
        />
        <AlgorithmStepCard
          step={3}
          title="下跌时"
          description="利用技术反弹防御损失"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
          imageAlt="下跌阶段技术反弹策略"
        />
        <AlgorithmStepCard
          step={4}
          title="恢复期"
          description="转为盈利"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
          imageAlt="恢复阶段盈利转换策略"
        />
      </AlgorithmStepsGrid>

      <SectionDivider />

      <SectionTitle>唯一风险区间</SectionTitle>

      <WarningBox>
        <Strong>没有技术反弹的单边下跌</Strong>
        <br /><br />
        任何量��算法都难以应对。选择<Accent>单边下跌概率低</Accent>的资产。
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        选择什么资产决定一切
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>资产对比</SectionTitle>

      <img
        src={getIntroAssetComparisonImage("zh")}
        alt="资产对比分析图"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <AssetCard title="加密货币 (BTC, ETH)" risk="高风险" riskColor="high"
        description={<>可能<Strong>-60%以上单边下跌</Strong>。��波动性意味着极端风险。</>}
      />
      <AssetCard title="个股" risk="中风险" riskColor="medium"
        description={<>公司特定风险。财报和管理层问题带来<Strong>不可预测变量</Strong>。</>}
      />
      <AssetCard title="ETF (QQQ, SPY)" risk="稳定" riskColor="low"
        description={<>指数基础的<Strong>分散效果</Strong>。长期<Accent>上升趋势</Accent>。</>}
      />
      <AssetCard title="黄金" risk="最佳" riskColor="low"
        description={<><Strong>下方有限</Strong>的安全资产。最适合量化算法结构。</>}
      />

      <SectionDivider />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl mb-4">
            <Strong>主要资产：</Strong> <Accent>黄金</Accent>
          </div>
          <div className="text-base md:text-lg text-foreground/70">
            <Strong>��资产：</Strong> 纳斯达克 (QQQ)
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <WarningBox>
        <Strong>如果你期望年化1000%收益，请关闭这本书</Strong>
        <br /><br />
        这本书是为追求<Accent>可持续盈利结构</Accent>的人准备的。
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          选择了资产后，<br />
          让我们学习<Strong>BUYLOW量化算法��何运作</Strong>。
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ar: () => (
    <>
      <QuoteBlock>
        اختيار الأصول أهم من الخوارزمية نفسها
      </QuoteBlock>

      <SectionTitle>نفس الخوارزمية، ن��ائج مختلفة</SectionTitle>

      <Paragraph>
        حتى مع نفس الخوارزمية،
        <Strong>الأصل الذي تطبقها عليه</Strong> يغير ا��نتيجة كلياً.
      </Paragraph>

      <SectionDivider />

      {/* Language-specific comparison chart */}
      <ChapterImage
        src={getChapter1Image("ar")}
        alt="مخطط مقارنة عو��ئد الأصول"
      />

      <StatGrid>
        <StatCard value="+100%" label="الذهب" type="positive" />
        <StatCard value="+500%" label="الفضة" type="positive" />
        <StatCard value="-50%" label="بيتكوين" type="negative" />
      </StatGrid>

      <SectionDivider />

      <SectionTitle>هيكل الربح</SectionTitle>

      <Paragraph>
        تعمل خوارزمية BUYLOW في 4 ظروف سوقية:
      </Paragraph>

      <AlgorithmStepsGrid>
        <AlgorithmStepCard
          step={1}
          title="سوق جانبي"
          description="ربح من التداولات المتكررة في الأسواق المتذبذبة"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
          imageAlt="استراتيجية السوق الجانبي"
        />
        <AlgorithmStepCard
          step={2}
          title="سوق ��اعد"
          description="تعظيم الربح ��تتبع الاتجاه"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
          imageAlt="استراتيجية السوق الصاعد"
        />
        <AlgorithmStepCard
          step={3}
          title="هبوط"
          description="دفاع عبر الارتدادات التقنية"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
          imageAlt="استراتيجية الارتداد التقني"
        />
        <AlgorithmStepCard
          step={4}
          title="تعافي"
          description="تحويل للربح في مرحلة التعافي"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
          imageAlt="استر��تيجية مرحلة التعافي"
        />
      </AlgorithmStepsGrid>

      <SectionDivider />

      <WarningBox>
        <Strong>هبوط أحادي بدون ارت��ادات تقنية</Strong>
        <br /><br />
        لا ت��تطيع أي خوارزمية التعامل معه. اختر أصولاً ذات <Accent>احتمالية هبوط أحادي منخفضة</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        الأصل الذي تختاره يحدد كل شيء
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>مقارنة الأصول</SectionTitle>

      <img
        src={getIntroAssetComparisonImage("ar")}
        alt="مخطط تحليل مقارنة الأصول"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <AssetCard title="العملات الرقمية" risk="عالي المخاطر" riskColor="high"
        description={<><Strong>هبوط أحادي -60%+</Strong> ممكن. تقلب عالي يعني مخاطر شديدة.</>}
      />
      <AssetCard title="الأسهم الفردية" risk="متوسط المخاطر" riskColor="medium"
        description={<>مخاطر خاصة بالشركة. <Strong>متغيرات غير متوقعة</Strong>.</>}
      />
      <AssetCard title="ETFs (QQQ, SPY)" risk="مستقر" riskColor="low"
        description={<><Strong>تن��يع</Strong> قائم على المؤشر. <Accent>اتجاه صاعد</Accent> طويل المدى.</>}
      />
      <AssetCard title="الذهب" risk="الأفضل" riskColor="low"
        description={<>أصل آمن <Strong>محدود الهبوط</Strong>. الأنسب لهيكل الخوارزمية.</>}
      />

      <SectionDivider />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl mb-4">
            <Strong>الأصل الرئيسي:</Strong> <Accent>الذهب</Accent>
          </div>
          <div className="text-base md:text-lg text-foreground/70">
            <Strong>الأصل الفرعي:</Strong> ناسداك (QQQ)
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <WarningBox>
        <Strong>إذا كنت تتوقع عوائد 1000% سنوياً، أغلق هذا الكتاب</Strong>
        <br /><br />
        هذا الكتاب لمن يسعون لـ<Accent>هياكل ربح مستدامة</Accent>.
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          ا��آن بعد اختيار أص��ك،<br />
          لنتعلم <Strong>كيف تعمل خوارزمية BUYLOW</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  ru: () => (
    <>
      <QuoteBlock>
        Выбор актива важнее самого алгоритма
      </QuoteBlock>

      <SectionTitle>Один алгоритм, разные р��зультаты</SectionTitle>

      <Paragraph>
        Даже с одинаковым квант-алгоритмом,
        <Strong>актив, к которому вы его применяете</Strong>, полностью меняет результат.
      </Paragraph>

      <SectionDivider />

      {/* Language-specific comparison chart */}
      <ChapterImage
        src={getChapter1Image("ru")}
        alt="График сравнения доходности акт��вов"
      />

      <StatGrid>
        <StatCard value="+100%" label="Золото" type="positive" />
        <StatCard value="+500%" label="Серебро" type="positive" />
        <StatCard value="-50%" label="Биткоин" type="negative" />
      </StatGrid>

      <SectionDivider />

      <SectionTitle>Структура прибыли</SectionTitle>

      <Paragraph>
        Алгоритм BUYLOW рабо��ает в 4 рыночных усл��виях:
      </Paragraph>

      <AlgorithmStepsGrid>
        <AlgorithmStepCard
          step={1}
          title="Боковой рынок"
          description="Прибыль через повторные сделки в диапазоне"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
          imageAlt="Стратегия бокового рынка"
        />
        <AlgorithmStepCard
          step={2}
          title="Бычий рынок"
          description="Максимизация прибыли за трендом"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
          imageAlt="Стратегия бычьего рынка"
        />
        <AlgorithmStepCard
          step={3}
          title="Падение"
          description="Защита через технические отскоки"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
          imageAlt="Ст��атегия технического отскока"
        />
        <AlgorithmStepCard
          step={4}
          title="Восстановление"
          description="Возврат к прибыли в фазе восстановления"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
          imageAlt="Стратегия фазы восстановлени��"
        />
      </AlgorithmStepsGrid>

      <SectionDivider />

      <WarningBox>
        <Strong>Однонаправленное падение без технических отскоков</Strong>
        <br /><br />
        Ни один алгоритм не справится. Выбирайте активы с <Accent>низкой вероятностью односторон��ег�� падения</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Какой актив вы выберете — определяет всё
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Сравнение активов</SectionTitle>

      <img
        src={getIntroAssetComparisonImage("ru")}
        alt="График сравнительного анализа активов"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <AssetCard title="Крипто (BTC, ETH)" risk="Высокий риск" riskColor="high"
        description={<>Возможно падение <Strong>-60%+</Strong>. Высокая волатильность = экстремальный риск.</>}
      />
      <AssetCard title="Отдельные акции" risk="Средний риск" riskColor="medium"
        description={<>Риски компании. <Strong>Непредсказуемые переменные</Strong>.</>}
      />
      <AssetCard title="ETF (QQQ, SPY)" risk="Стабильно" riskColor="low"
        description={<><Strong>Диверсификация</Strong> на основе индекса. Долгосрочный <Accent>восходящий тренд</Accent>.</>}
      />
      <AssetCard title="Золото" risk="Лучший" riskColor="low"
        description={<>Безопасный актив с <Strong>ограниченным па��ением</Strong>. Лучше всего подходит для алгоритма.</>}
      />

      <SectionDivider />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl mb-4">
            <Strong>Основной актив:</Strong> <Accent>ЗОЛОТО</Accent>
          </div>
          <div className="text-base md:text-lg text-foreground/70">
            <Strong>Вспомогательный:</Strong> NASDAQ (QQQ)
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <WarningBox>
        <Strong>Е��ли вы ожидаете 1000% годовых — закройте эту книгу</Strong>
        <br /><br />
        Эта книга для тех, кто стремится к <Accent>устойчивым структурам прибыли</Accent>.
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Теперь, выбрав актив,<br />
          узнаем <Strong>как работает алг��ритм BUYLOW</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  es: () => (
    <>
      <QuoteBlock>
        La selección de activos es más importante que el algoritmo
      </QuoteBlock>

      <SectionTitle>Mismo algoritmo, diferentes resultados</SectionTitle>

      <Paragraph>
        Incluso con el mismo algoritmo quant,
        <Strong>el activo al que lo aplicas</Strong> cambia completamente el resultado.
      </Paragraph>

      <SectionDivider />

      {/* Language-specific comparison chart */}
      <ChapterImage
        src={getChapter1Image("es")}
        alt="Gráfico de comparación de rendimientos"
      />

      <StatGrid>
        <StatCard value="+100%" label="Oro" type="positive" />
        <StatCard value="+500%" label="Plata" type="positive" />
        <StatCard value="-50%" label="Bitcoin" type="negative" />
      </StatGrid>

      <SectionDivider />

      <SectionTitle>Estructura de ganancias</SectionTitle>

      <Paragraph>
        El algoritmo BUYLOW opera en 4 condiciones de mercado:
      </Paragraph>

      <AlgorithmStepsGrid>
        <AlgorithmStepCard
          step={1}
          title="Mercado lateral"
          description="Ganancias por operaciones repetidas en rangos"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
          imageAlt="Estrategia de mercado lateral"
        />
        <AlgorithmStepCard
          step={2}
          title="Mercado alcista"
          description="Maximizar ganancias con seguimiento de tendencia"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
          imageAlt="Estrategia de mercado alcista"
        />
        <AlgorithmStepCard
          step={3}
          title="Caída"
          description="Defensa mediante rebotes técnicos"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
          imageAlt="Estrategia de rebote técnico"
        />
        <AlgorithmStepCard
          step={4}
          title="Recuperación"
          description="Vuelta a ganancias en fase de recuperación"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
          imageAlt="Estrategia de fase de recuperación"
        />
      </AlgorithmStepsGrid>

      <SectionDivider />

      <WarningBox>
        <Strong>Caída unidireccional sin rebotes técnicos</Strong>
        <br /><br />
        Ningún algoritmo puede manejarlo. Elige activos con <Accent>baja probabilidad de caída unidireccional</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Qué activo elijas determina todo
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Comparación de Activos</SectionTitle>

      <img
        src={getIntroAssetComparisonImage("es")}
        alt="Gráfico de análisis comparativo de activos"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <AssetCard title="Crypto (BTC, ETH)" risk="Alto riesgo" riskColor="high"
        description={<>Posible caída de <Strong>-60%+</Strong>. Alta volatilidad = riesgo extremo.</>}
      />
      <AssetCard title="Acciones individuales" risk="Riesgo medio" riskColor="medium"
        description={<>Riesgos de empresa. <Strong>Variables impredecibles</Strong>.</>}
      />
      <AssetCard title="ETFs (QQQ, SPY)" risk="Estable" riskColor="low"
        description={<><Strong>Diversificación</Strong> basada en índice. <Accent>Tendencia alcista</Accent> a largo plazo.</>}
      />
      <AssetCard title="Oro" risk="Mejor" riskColor="low"
        description={<>Activo seguro con <Strong>caída limitada</Strong>. Mejor ajuste para el algoritmo.</>}
      />

      <SectionDivider />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl mb-4">
            <Strong>Activo principal:</Strong> <Accent>ORO</Accent>
          </div>
          <div className="text-base md:text-lg text-foreground/70">
            <Strong>Activo secundario:</Strong> NASDAQ (QQQ)
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <WarningBox>
        <Strong>Si esperas retornos del 1000% anual, cierra este libro</Strong>
        <br /><br />
        Este libro es para quienes buscan <Accent>estructuras de ganancias sostenibles</Accent>.
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Ahora que elegiste tu activo,<br />
          aprendamos <Strong>cómo funciona el algoritmo BUYLOW</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  id: () => (
    <>
      <QuoteBlock>
        Pemilihan aset lebih penting dari algoritma itu sendiri
      </QuoteBlock>

      <SectionTitle>Algoritma sama, hasil berbeda</SectionTitle>

      <Paragraph>
        Bahkan dengan algoritma quant yang sama,
        <Strong>aset yang Anda terapkan</Strong> sepenuhnya mengubah hasilnya.
      </Paragraph>

      <SectionDivider />

      {/* Language-specific comparison chart */}
      <ChapterImage
        src={getChapter1Image("id")}
        alt="Grafik perbandingan pengembalian aset"
      />

      <StatGrid>
        <StatCard value="+100%" label="Emas" type="positive" />
        <StatCard value="+500%" label="Perak" type="positive" />
        <StatCard value="-50%" label="Bitcoin" type="negative" />
      </StatGrid>

      <SectionDivider />

      <SectionTitle>Struktur profit</SectionTitle>

      <Paragraph>
        Algoritma BUYLOW beroperasi dalam 4 kondisi pasar:
      </Paragraph>

      <AlgorithmStepsGrid>
        <AlgorithmStepCard
          step={1}
          title="Pasar sideways"
          description="Profit dari trading berulang dalam range"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
          imageAlt="Strategi pasar sideways"
        />
        <AlgorithmStepCard
          step={2}
          title="Bull market"
          description="Maksimalkan profit dengan trend following"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
          imageAlt="Strategi bull market"
        />
        <AlgorithmStepCard
          step={3}
          title="Penurunan"
          description="Pertahanan melalui rebound teknikal"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
          imageAlt="Strategi rebound teknikal"
        />
        <AlgorithmStepCard
          step={4}
          title="Pemulihan"
          description="Konversi ke profit di fase pemulihan"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
          imageAlt="Strategi fase pemulihan"
        />
      </AlgorithmStepsGrid>

      <SectionDivider />

      <WarningBox>
        <Strong>Penurunan satu arah tanpa rebound teknikal</Strong>
        <br /><br />
        Tidak ada algoritma yang bisa menangani. Pilih aset dengan <Accent>probabilitas penurunan satu arah rendah</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Aset yang Anda pilih menentukan segalanya
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Perbandingan Aset</SectionTitle>

      <img
        src={getIntroAssetComparisonImage("id")}
        alt="Grafik analisis perbandingan aset"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <AssetCard title="Crypto (BTC, ETH)" risk="Risiko tinggi" riskColor="high"
        description={<>Mungkin turun <Strong>-60%+</Strong>. Volatilitas tinggi = risiko ekstrem.</>}
      />
      <AssetCard title="Saham individual" risk="Risiko sedang" riskColor="medium"
        description={<>Risiko perusahaan. <Strong>Variabel tidak terduga</Strong>.</>}
      />
      <AssetCard title="ETF (QQQ, SPY)" risk="Stabil" riskColor="low"
        description={<><Strong>Diversifikasi</Strong> berbasis indeks. <Accent>Tren naik</Accent> jangka panjang.</>}
      />
      <AssetCard title="Emas" risk="Terbaik" riskColor="low"
        description={<>Aset aman dengan <Strong>penurunan terbatas</Strong>. Paling cocok untuk struktur algoritma.</>}
      />

      <SectionDivider />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl mb-4">
            <Strong>Aset utama:</Strong> <Accent>EMAS</Accent>
          </div>
          <div className="text-base md:text-lg text-foreground/70">
            <Strong>Aset sekunder:</Strong> NASDAQ (QQQ)
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <WarningBox>
        <Strong>Jika Anda mengharapkan return 1000% per tahun, tutup buku ini</Strong>
        <br /><br />
        Buku ini untuk mereka yang mengejar <Accent>struktur profit berkelanjutan</Accent>.
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Sekarang setelah memilih aset,<br />
          mari pelajari <Strong>cara kerja algoritma BUYLOW</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  th: () => (
    <>
      <QuoteBlock>
        การเลือกสินทรัพย์สำคัญกว่าอัลกอริทึมเอง
      </QuoteBlock>

      <SectionTitle>อัลกอริทึมเดียวกัน ผลลัพ���์ต่างกัน</SectionTitle>

      <Paragraph>
        แม้ใช้อัลกอริทึม quant เ��ียวกัน
        <Strong>สินทรัพย์ที่คุณใ��้</Strong>จะเปลี่ยนผลลัพธ์โดยสิ้นเชิง
      </Paragraph>

      <SectionDivider />

      {/* Language-specific comparison chart */}
      <ChapterImage
        src={getChapter1Image("th")}
        alt="กราฟเปรียบเทียบผลตอบแทนสินทรัพย์"
      />

      <StatGrid>
        <StatCard value="+100%" label="ทองคำ" type="positive" />
        <StatCard value="+500%" label="เงิน" type="positive" />
        <StatCard value="-50%" label="Bitcoin" type="negative" />
      </StatGrid>

      <SectionDivider />

      <SectionTitle>โครงสร้า��กำไร</SectionTitle>

      <Paragraph>
        อัลกอริทึม BUYLOW ทำงานใน 4 สภาวะตลาด:
      </Paragraph>

      <AlgorithmStepsGrid>
        <AlgorithmStepCard
          step={1}
          title="ตลาด Sideways"
          description="กำไรจากการเทรดซ้ำในช่วงราคา"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
          imageAlt="กลยุทธ์ตลาด Sideways"
        />
        <AlgorithmStepCard
          step={2}
          title="ตลาดขาขึ้น"
          description="เพิ่มกำไรด้วยการตามเทรนด์"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
          imageAlt="กลยุทธ์ตลาดข���ขึ้น"
        />
        <AlgorithmStepCard
          step={3}
          title="ขาลง"
          description="ป้อง��ันผ่านรีบาวด์ทางเทคนิค"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
          imageAlt="กลยุทธ์รีบาวด์ทางเทคน���ค"
        />
        <AlgorithmStepCard
          step={4}
          title="ฟื้น���ัว"
          description="กลับมามีกำไรใน���่วงฟื้นตัว"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
          imageAlt="กลยุทธ์ช่วงฟื้นตัว"
        />
      </AlgorithmStepsGrid>

      <SectionDivider />

      <WarningBox>
        <Strong>ขาลงทางเดียวโด��ไม่มีรีบาวด์ทางเท�����ิค</Strong>
        <br /><br />
        ไม่มีอัลกอริท���มใดรับม��อได้ เลือกสินทรัพย์ที่มี<Accent>ค��ามเป็นไปได้ขาลงทางเดีย���ต่ำ</Accent>
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        สินทรัพย์ที่คุณเลือกกำหนดทุกอ��่าง
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>การเปรียบเทียบสินทรัพย์</SectionTitle>

      <img
        src={getIntroAssetComparisonImage("th")}
        alt="กราฟวิเคราะห์เปรียบเทียบสินทรัพย์"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <AssetCard title="Crypto (BTC, ETH)" risk="ความเสี่ยงสูง" riskColor="high"
        description={<>อาจร่วง<Strong>-60%+</Strong> ความผันผวนสูง = ความเสี่ยงส���ดขีด</>}
      />
      <AssetCard title="หุ��นรายตัว" risk="ความเสี่ยงปานกลาง" riskColor="medium"
        description={<>ความเสี่ยงเฉพาะบริษัท <Strong>ตัวแปรที่คาดไม่ถึง</Strong></>}
      />
      <AssetCard title="ETF (QQQ, SPY)" risk="���ั่นคง" riskColor="low"
        description={<><Strong>กระจายความเสี่ยง</Strong>ตามดัชนี <Accent>แนวโน้มขาขึ้น</Accent>ระยะยาว</>}
      />
      <AssetCard title="ทองคำ" risk="ดีที่สุด" riskColor="low"
        description={<>สินทรัพย์ปลอดภัย<Strong>จำกัดการลง</Strong> เหมาะกับโครงสร้างอัลกอริทึมที่สุด</>}
      />

      <SectionDivider />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl mb-4">
            <Strong>สิน��รัพย์หลัก:</Strong> <Accent>ทองคำ</Accent>
          </div>
          <div className="text-base md:text-lg text-foreground/70">
            <Strong>สินทรัพย์รอง:</Strong> NASDAQ (QQQ)
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <WarningBox>
        <Strong>ถ้าคุณคาดหวังผลตอบแ��น 1000% ต่อปี ปิดหนังสือเล่มนี้</Strong>
        <br /><br />
        หนังสือเล่มนี้สำหรับผู้ที่แสวงหา<Accent>โครงสร้างกำไรที่ยั่งยืน</Accent>
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          ตอนนี้คุณเลือกสินทรัพย์แล้ว<br />
          มาเรียนรู้<Strong>วิธีการทำงานของอัลกอริทึม BUYLOW</Strong> กัน
        </Paragraph>
      </HighlightBox>
    </>
  ),
  vi: () => (
    <>
      <QuoteBlock>
        Lựa chọn tài sản quan trọng hơn thuật toán quant
      </QuoteBlock>

      <SectionTitle>Cùng thuật toán, kết quả khác nhau</SectionTitle>

      <Paragraph>
        Ngay cả với cùng thuật toán quant,
        <Strong>tài sản bạn áp dụng</Strong> hoàn toàn thay đổi kết quả.
      </Paragraph>

      <SectionDivider />

      {/* Language-specific comparison chart */}
      <ChapterImage
        src={getChapter1Image("vi")}
        alt="Bi��u đồ so sánh lợi nhuận tài sản"
      />

      <StatGrid>
        <StatCard value="+100%" label="Vàng" type="positive" />
        <StatCard value="+500%" label="Bạc" type="positive" />
        <StatCard value="-50%" label="Bitcoin" type="negative" />
      </StatGrid>

      <SectionDivider />

      <SectionTitle>Cấu trúc lợi nhuận</SectionTitle>

      <Paragraph>
        Thuật toán BUYLOW hoạt động trong 4 điều kiện thị trường:
      </Paragraph>

      <AlgorithmStepsGrid>
        <AlgorithmStepCard
          step={1}
          title="Thị trường sideway"
          description="Lợi nhuận từ giao dịch lặp lại trong phạm vi"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
          imageAlt="Chiến lược thị tr��ờng sideway"
        />
        <AlgorithmStepCard
          step={2}
          title="Bull market"
          description="Tối đa hóa lợi nhuận theo xu hướng"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
          imageAlt="Chiến lược bull market"
        />
        <AlgorithmStepCard
          step={3}
          title="Giảm"
          description="Phòng thủ qua phục hồi kỹ thuật"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
          imageAlt="Chiến lược phục hồi kỹ thuật"
        />
        <AlgorithmStepCard
          step={4}
          title="Phục hồi"
          description="Chuyển đổi thành lợi nhuận trong giai đoạn phục hồi"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
          imageAlt="Chiến lược giai đoạn phục hồi"
        />
      </AlgorithmStepsGrid>

      <SectionDivider />

      <WarningBox>
        <Strong>Giảm một chiều không có rebound kỹ thuật</Strong>
        <br /><br />
        Không thuật toán nào xử lý được. Chọn tài sản có <Accent>xác suất giảm một chiều thấp</Accent>.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Tài sản bạn chọn quyết định tất cả
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>So sánh Tài sản</SectionTitle>

      <img
        src={getIntroAssetComparisonImage("vi")}
        alt="Biểu đồ phân tích so sánh tài sản"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <AssetCard title="Crypto (BTC, ETH)" risk="Rủi ro cao" riskColor="high"
        description={<>Có thể giảm <Strong>-60%+</Strong>. Biến động cao = rủi ro cực đoan.</>}
      />
      <AssetCard title="Cổ phiếu đơn lẻ" risk="Rủi ro trung bình" riskColor="medium"
        description={<>Rủi ro công ty. <Strong>Biến số không thể đoán trước</Strong>.</>}
      />
      <AssetCard title="ETF (QQQ, SPY)" risk="Ổn định" riskColor="low"
        description={<><Strong>Đa dạng hóa</Strong> dựa trên chỉ số. <Accent>Xu hướng tăng</Accent> dài hạn.</>}
      />
      <AssetCard title="Vàng" risk="Tốt nhất" riskColor="low"
        description={<>Tài sản an toàn <Strong>giới hạn giảm</Strong>. Phù hợp nhất với cấu trúc thuật toán.</>}
      />

      <SectionDivider />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl mb-4">
            <Strong>Tài sản chính:</Strong> <Accent>VÀNG</Accent>
          </div>
          <div className="text-base md:text-lg text-foreground/70">
            <Strong>Tài sản phụ:</Strong> NASDAQ (QQQ)
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <WarningBox>
        <Strong>Nếu bạn k�� vọng lợi nhuận 1000% hàng năm, hãy đóng sách này</Strong>
        <br /><br />
        Cuốn sách này dành cho những ai theo đuổi <Accent>cấu trúc lợi nhuận bền vững</Accent>.
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Bây giờ bạn đã chọn tài sản,<br />
          hãy tìm hiểu <Strong>cách thuật toán BUYLOW hoạt động</Strong>.
        </Paragraph>
      </HighlightBox>
    </>
  ),
  tr: () => (
    <>
      <QuoteBlock>
        Varlık seçimi algoritmanın kendisinden daha önemli
      </QuoteBlock>

      <SectionTitle>Aynı algoritma, farklı sonuçlar</SectionTitle>

      <Paragraph>
        Aynı quant algoritmasıyla bile,
        <Strong>uyguladığınız varlık</Strong> sonucu tamamen değiştirir.
      </Paragraph>

      <SectionDivider />

      {/* Language-specific comparison chart */}
      <ChapterImage
        src={getChapter1Image("tr")}
        alt="Varlık getiri karşılaştırma grafiği"
      />

      <StatGrid>
        <StatCard value="+100%" label="Altın" type="positive" />
        <StatCard value="+500%" label="Gümüş" type="positive" />
        <StatCard value="-50%" label="Bitcoin" type="negative" />
      </StatGrid>

      <SectionDivider />

      <SectionTitle>Kâr yapısı</SectionTitle>

      <Paragraph>
        BUYLOW algoritması 4 piyasa koşulunda çalışır:
      </Paragraph>

      <AlgorithmStepsGrid>
        <AlgorithmStepCard
          step={1}
          title="Yatay piyasa"
          description="Aralıkta tekrarlı işlemlerden kâr"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/55.png"
          imageAlt="Yatay piyasa stratejisi"
        />
        <AlgorithmStepCard
          step={2}
          title="Boğa piyasası"
          description="Trend takibiyle kârı maksimize etme"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/6.png"
          imageAlt="Boğa piyasası stratejisi"
        />
        <AlgorithmStepCard
          step={3}
          title="Düşüş"
          description="Teknik geri sıçramalarla savunma"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/77.png"
          imageAlt="Teknik geri sıçrama stratejisi"
        />
        <AlgorithmStepCard
          step={4}
          title="Toparlanma"
          description="Toparlanma aşamasında kâra dönüş"
          imageSrc="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/exitant_ebook/88.png"
          imageAlt="Toparlanma aşaması stratejisi"
        />
      </AlgorithmStepsGrid>

      <SectionDivider />

      <WarningBox>
        <Strong>Teknik geri sı��rama olmadan tek yönlü düşüş</Strong>
        <br /><br />
        Hiçbir algoritma başa çıkamaz. <Accent>Tek yönlü düşüş olasılığı düşük</Accent> varlıklar seçin.
      </WarningBox>

      <SectionDivider />

      <QuoteBlock>
        Hangi varlığı seçtiğiniz her şeyi belirler
      </QuoteBlock>

      <SectionDivider />

      <SectionTitle>Varlık Karşılaştırması</SectionTitle>

      <img
        src={getIntroAssetComparisonImage("tr")}
        alt="Varlık karşılaştırma analiz grafiği"
        className="w-full max-w-[980px] mx-auto my-6 rounded-xl block"
        style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(31, 224, 165, 0.06)' }}
      />

      <AssetCard title="Kripto (BTC, ETH)" risk="Yüksek risk" riskColor="high"
        description={<><Strong>-60%+ tek yönlü düşüş</Strong> mümkün. Yüksek oynaklık = aşırı risk.</>}
      />
      <AssetCard title="Bireysel hisseler" risk="Orta risk" riskColor="medium"
        description={<>Şirkete özgü riskler. <Strong>Öngör��lemeyen değişkenler</Strong>.</>}
      />
      <AssetCard title="ETF&apos;ler (QQQ, SPY)" risk="Stabil" riskColor="low"
        description={<>Endeks bazlı <Strong>çeşitlendirme</Strong>. Uzun vadeli <Accent>yükseliş trendi</Accent>.</>}
      />
      <AssetCard title="Altın" risk="En iyi" riskColor="low"
        description={<><Strong>Düşüşü sınırlı</Strong> güvenli varlık. Algoritma yapısına en uygun.</>}
      />

      <SectionDivider />

      <HighlightBox>
        <div className="text-center">
          <div className="text-lg md:text-xl mb-4">
            <Strong>Ana varlık:</Strong> <Accent>ALTIN</Accent>
          </div>
          <div className="text-base md:text-lg text-foreground/70">
            <Strong>Yan varlık:</Strong> NASDAQ (QQQ)
          </div>
        </div>
      </HighlightBox>

      <SectionDivider />

      <WarningBox>
        <Strong>Yıllık %1000 getiri bekliyorsanız, bu kitabı kapatın</Strong>
        <br /><br />
        Bu kitap <Accent>sürdürülebilir kâr yapıları</Accent> arayanlar için.
      </WarningBox>

      <SectionDivider />

      <HighlightBox>
        <Paragraph className="mb-0 text-center text-lg">
          Artık varlığınızı seçtiniz,<br />
          <Strong>BUYLOW algoritmasının nasıl çalıştığını</Strong> öğrenelim.
        </Paragraph>
      </HighlightBox>
    </>
  ),
}

// Actual chapter structure
const CHAPTERS: Chapter[] = [
  // 서문
  {
    type: "single",
    id: "preface",
    title: {
      en: "Preface",
      ko: "서문",
      zh: "序言",
      ar: "مقدمة",
      ru: "Предисловие",
      es: "Prefacio",
      id: "Kata Pengantar",
      th: "คำนำ",
      vi: "Lời nói đầu",
      tr: "Önsöz",
    },
    content: {
      en: PrefaceContent.en,
      ko: PrefaceContent.ko,
      zh: PrefaceContent.zh,
      ar: PrefaceContent.ar,
      ru: PrefaceContent.ru,
      es: PrefaceContent.es,
      id: PrefaceContent.id,
      th: PrefaceContent.th,
      vi: PrefaceContent.vi,
      tr: PrefaceContent.tr,
    },
  },
  // 01 어떤 자산을 선택해야���는가?
  {
    type: "parent",
    id: "asset-selection",
    title: {
      en: "Which Asset Should You Choose?",
      ko: "어떤 자산을 선택해야하는가?",
      zh: "应该选择哪种资产？",
      ar: "أي أصل يجب أن تختار؟",
      ru: "Какой актив выбрать?",
      es: "¿Qué activo deberías elegir?",
      id: "Aset Mana yang Harus Anda Pilih?",
      th: "คุณควรเลือกสินทรัพย์ใด?",
      vi: "Bạn nên chọn tài sản nào?",
      tr: "Hangi Varlığı Seçmelisiniz?",
    },
    intro: true,
    introContent: {
      en: Chapter1Content.en,
      ko: Chapter1Content.ko,
      zh: Chapter1Content.zh,
      ar: Chapter1Content.ar,
      ru: Chapter1Content.ru,
      es: Chapter1Content.es,
      id: Chapter1Content.id,
      th: Chapter1Content.th,
      vi: Chapter1Content.vi,
      tr: Chapter1Content.tr,
    },
    children: [
      {
        id: "gold",
        title: {
          en: "Gold Asset Characteristics",
          ko: "금(Gold) 자산의 특징",
          zh: "黄金资产特征",
          ar: "خصائص أصول الذهب",
          ru: "Характеристики золот�� как актива",
          es: "Características del Activo Oro",
          id: "Karakteristik Aset Emas",
          th: "ลักษณะสิน��รัพย์ทองคำ",
          vi: "Đ���c điểm Tài sản Vàng",
          tr: "Altın Varlık Özellikleri",
        },
        content: {
          en: GoldContent.en,
          ko: GoldContent.ko,
          zh: GoldContent.zh,
          ar: GoldContent.ar,
          ru: GoldContent.ru,
          es: GoldContent.es,
          id: GoldContent.id,
          th: GoldContent.th,
          vi: GoldContent.vi,
          tr: GoldContent.tr,
        },
      },
      {
        id: "nasdaq-sp500",
        title: {
          en: "Nasdaq / S&P 500 Asset Characteristics",
          ko: "나스닥 / S&P 500 자산의 특징",
          zh: "纳斯达克/标普500资产特征",
          ar: "خصائص أصول ناسداك / S&P 500",
          ru: "Характеристики активов Nasdaq / S&P 500",
          es: "Características del Activo Nasdaq / S&P 500",
          id: "Karakteristik Aset Nasdaq / S&P 500",
          th: "ลักษณ��สินทรัพย์ Nasdaq / S&P 500",
          vi: "Đặc điểm Tài sản Nasdaq / S&P 500",
          tr: "Nasdaq / S&P 500 Varlık Özellikleri",
        },
        content: {
          en: NasdaqContent.en,
          ko: NasdaqContent.ko,
          zh: NasdaqContent.zh,
          ar: NasdaqContent.ar,
          ru: NasdaqContent.ru,
          es: NasdaqContent.es,
          id: NasdaqContent.id,
          th: NasdaqContent.th,
          vi: NasdaqContent.vi,
          tr: NasdaqContent.tr,
        },
      },
      {
        id: "bitcoin",
        title: {
          en: "Bitcoin (BTC) Asset Characteristics",
          ko: "비트코인(BTC) 자산의 특징",
          zh: "比特币(BTC)资产特征",
          ar: "خصائص أصول البيتكوين (BTC)",
          ru: "Характеристики биткоина (BTC) как актива",
          es: "Características del Activo Bitcoin (BTC)",
          id: "Karakteristik Aset Bitcoin (BTC)",
          th: "ลักษณะสินทรัพย์ Bitcoin (BTC)",
          vi: "Đặc điểm Tài sản Bitcoin (BTC)",
          tr: "Bitcoin (BTC) Varlık Özellikleri",
        },
        content: {
          en: BitcoinContent.en,
          ko: BitcoinContent.ko,
          zh: BitcoinContent.zh,
          ar: BitcoinContent.ar,
          ru: BitcoinContent.ru,
          es: BitcoinContent.es,
          id: BitcoinContent.id,
          th: BitcoinContent.th,
          vi: BitcoinContent.vi,
          tr: BitcoinContent.tr,
        },
      },
    ],
  },
  // 02 승자의 저주 : 파산
  {
    type: "single",
    id: "winners-curse",
    title: {
      en: "Winner's Curse: Bankruptcy",
      ko: "승자의 저주 : 파산",
      zh: "赢家的诅咒：破产",
      ar: "لعنة الفائز: الإفلاس",
      ru: "Прок��ятие победителя: Бан��ротств��",
      es: "La Maldición del Ganador: Bancarrota",
      id: "Kutukan Pemenang: Kebangkrutan",
      th: "คำสาปขอ��ผู้��นะ: การล้มละลาย",
      vi: "Lời nguyền của Người chiến thắng: Phá sản",
      tr: "Kazananın Laneti: İflas",
    },
    content: {
      en: WinnersCurseContent.en,
      ko: WinnersCurseContent.ko,
      zh: WinnersCurseContent.zh,
      ar: WinnersCurseContent.ar,
      ru: WinnersCurseContent.ru,
      es: WinnersCurseContent.es,
      id: WinnersCurseContent.id,
      th: WinnersCurseContent.th,
      vi: WinnersCurseContent.vi,
      tr: WinnersCurseContent.tr,
    },
  },
  // 03 BUYLOW Quant 알고리즘
  {
    type: "single",
    id: "exitant-algorithm",
    title: {
      en: "BUYLOW Quant Algorithm",
      ko: "BUYLOW Quant 알고리즘",
      zh: "BUYLOW Quant 算法",
      ar: "خوارزمية BUYLOW Quant",
      ru: "Алгоритм BUYLOW Quant",
      es: "Algoritmo BUYLOW Quant",
      id: "Algoritma BUYLOW Quant",
      th: "อัลกอริทึม BUYLOW Quant",
      vi: "Thuật toán BUYLOW Quant",
      tr: "BUYLOW Quant Algoritması",
    },
    content: {
      en: BUYLOWAlgorithmContent.en,
      ko: BUYLOWAlgorithmContent.ko,
      zh: BUYLOWAlgorithmContent.zh,
      ar: BUYLOWAlgorithmContent.ar,
      ru: BUYLOWAlgorithmContent.ru,
      es: BUYLOWAlgorithmContent.es,
      id: BUYLOWAlgorithmContent.id,
      th: BUYLOWAlgorithmContent.th,
      vi: BUYLOWAlgorithmContent.vi,
      tr: BUYLOWAlgorithmContent.tr,
    },
  },
  // 04 BUYLOW QUANT (R-R) 알고리즘
  {
    type: "parent",
    id: "rr-algorithm",
    title: {
      en: "BUYLOW QUANT (R-R) Algorithm",
      ko: "BUYLOW QUANT (R-R) 알고리즘",
      zh: "BUYLOW QUANT (R-R) ��法",
      ar: "خوارزمية BUYLOW QUANT (R-R)",
      ru: "Алгоритм BUYLOW QUANT (R-R)",
      es: "Algoritmo BUYLOW QUANT (R-R)",
      id: "Algoritma BUYLOW QUANT (R-R)",
      th: "��ัลกอริทึม BUYLOW QUANT (R-R)",
      vi: "Thuật toán BUYLOW QUANT (R-R)",
      tr: "BUYLOW QUANT (R-R) Algoritması",
    },
    intro: true,
    introContent: {
      en: RRAlgorithmContent.en,
      ko: RRAlgorithmContent.ko,
      zh: RRAlgorithmContent.zh,
      ar: RRAlgorithmContent.ar,
      ru: RRAlgorithmContent.ru,
      es: RRAlgorithmContent.es,
      id: RRAlgorithmContent.id,
      th: RRAlgorithmContent.th,
      vi: RRAlgorithmContent.vi,
      tr: RRAlgorithmContent.tr,
    },
    children: [
      {
        id: "slippage-fee",
        title: {
          en: "Slippage & Fee Structure",
          ko: "슬리피지 & 수수료 구조",
          zh: "滑点与手续费结构",
          ar: "هيكل الانزلاق والرسوم",
          ru: "Структура проскальзывания и комиссий",
          es: "Estructura de Deslizamiento y Comisiones",
          id: "Struktur Slippage & Biaya",
          th: "โครงสร้าง Slippage และค���าธรรมเนียม",
          vi: "Cấu trúc Trượt giá & Phí",
          tr: "Kayma ve Ücret Yapısı",
        },
        content: {
          en: SlippageFeeContent.en,
          ko: SlippageFeeContent.ko,
          zh: SlippageFeeContent.zh,
          ar: SlippageFeeContent.ar,
          ru: SlippageFeeContent.ru,
          es: SlippageFeeContent.es,
          id: SlippageFeeContent.id,
          th: SlippageFeeContent.th,
          vi: SlippageFeeContent.vi,
          tr: SlippageFeeContent.tr,
        },
      },
      {
        id: "qna",
        title: {
          en: "BUYLOW QnA",
          ko: "BUYLOW QnA",
          zh: "BUYLOW 问答",
          ar: "أسئلة وأجوبة BUYLOW",
          ru: "BUYLOW Вопросы и ответы",
          es: "BUYLOW Preguntas y Respuestas",
          id: "BUYLOW Tanya Jawab",
          th: "BUYLOW คำถาม-���อบ",
          vi: "BUYLOW Hỏi Đáp",
          tr: "BUYLOW Soru-Cevap",
        },
        content: {
          en: QnAContent.en,
          ko: QnAContent.ko,
          zh: QnAContent.zh,
          ar: QnAContent.ar,
          ru: QnAContent.ru,
          es: QnAContent.es,
          id: QnAContent.id,
          th: QnAContent.th,
          vi: QnAContent.vi,
          tr: QnAContent.tr,
        },
      },
    ],
  },
  // 05 파산과 우상향의 갈림길 : 손매매
  {
    type: "single",
    id: "manual-trading",
    title: {
      en: "The Fork Between Bankruptcy and Growth: Manual Trading",
      ko: "파산과 우상향의 갈림길 : 손매매",
      zh: "破产与增长的岔路口：手动交易",
      ar: "مفترق الطرق بين الإفلاس والنمو: التداول اليدوي",
      ru: "Развилка между банкротством и ростом: ручная торговля",
      es: "La Bifurcación Entre Bancarrota y Crecimiento: Trading Manual",
      id: "Persimpangan Antara Kebangkrutan dan Pertumbuhan: Trading Manual",
      th: "ทางแยกระหว่างการล้มละลายและ��ารเติบโต: การเ��รดแบบแมนนวล",
      vi: "Ngã rẽ Giữa Phá sản và Tăng trưởng: Giao dịch Thủ công",
      tr: "İflas ve Büyüme Arasındaki Çatallanma: Manuel Ticaret",
    },
    content: {
      en: ManualTradingContent.en,
      ko: ManualTradingContent.ko,
      zh: ManualTradingContent.zh,
      ar: ManualTradingContent.ar,
      ru: ManualTradingContent.ru,
      es: ManualTradingContent.es,
      id: ManualTradingContent.id,
      th: ManualTradingContent.th,
      vi: ManualTradingContent.vi,
      tr: ManualTradingContent.tr,
    },
  },
  // 06 마치며
  {
    type: "single",
    id: "conclusion",
    title: {
      en: "Conclusion",
      ko: "마치며",
      zh: "结语",
      ar: "الخاتمة",
      ru: "Заключение",
      es: "Conclusión",
      id: "Penutup",
      th: "บท��รุป",
      vi: "K��t luận",
      tr: "Sonuç",
    },
    content: {
      en: ConclusionContent.en,
      ko: ConclusionContent.ko,
      zh: ConclusionContent.zh,
      ar: ConclusionContent.ar,
      ru: ConclusionContent.ru,
      es: ConclusionContent.es,
      id: ConclusionContent.id,
      th: ConclusionContent.th,
      vi: ConclusionContent.vi,
      tr: ConclusionContent.tr,
    },
  },
]

// Flatten chapters for linear navigation
interface FlatPage {
  chapterIndex: number
  chapterNumber: number // 0 for preface, 1-6 for numbered chapters
  isIntro: boolean
  subChapterIndex?: number
  title: Record<Lang, string>
  content: Record<Lang, string | (() => ReactNode)>
}

function flattenChapters(): FlatPage[] {
  const pages: FlatPage[] = []
  let chapterNumber = 0

  CHAPTERS.forEach((chapter, chapterIndex) => {
    if (chapter.type === "single") {
      // Preface has no number, others are numbered
      const isPreface = chapter.id === "preface"
      if (!isPreface) chapterNumber++

      pages.push({
        chapterIndex,
        chapterNumber: isPreface ? 0 : chapterNumber,
        isIntro: false,
        title: chapter.title,
        content: chapter.content,
      })
    } else {
      // Parent chapter
      chapterNumber++

      // Add intro page if exists
      if (chapter.intro) {
        pages.push({
          chapterIndex,
          chapterNumber,
          isIntro: true,
          title: chapter.title,
          content: chapter.introContent,
        })
      }

      // Add sub-chapters
      chapter.children.forEach((sub, subIndex) => {
        pages.push({
          chapterIndex,
          chapterNumber,
          isIntro: false,
          subChapterIndex: subIndex,
          title: sub.title,
          content: sub.content,
        })
      })
    }
  })

  return pages
}

const FLAT_PAGES = flattenChapters()
const TOTAL_MAIN_CHAPTERS = 7 // Preface + 6 numbered chapters

// UI translations
const UI_TEXT = {
  tableOfContents: {
    en: "Table of Contents",
    ko: "목차",
    zh: "目录",
    ar: "جدول المحتويات",
    ru: "Содержание",
    es: "Tabla de Contenidos",
    id: "Daftar Isi",
    th: "สารบัญ",
    vi: "Mục lục",
    tr: "İçindekiler",
  },
  previous: {
    en: "Previous",
    ko: "이전",
    zh: "上一章",
    ar: "السابق",
    ru: "Назад",
    es: "Anterior",
    id: "Sebelumnya",
    th: "ก่อนหน้า",
    vi: "Trước",
    tr: "Önceki",
  },
  next: {
    en: "Next",
    ko: "다음",
    zh: "下一章",
    ar: "التالي",
    ru: "Далее",
    es: "Siguiente",
    id: "Selanjutnya",
    th: "ถัดไป",
    vi: "Tiếp",
    tr: "Sonraki",
  },
  backToHome: {
    en: "Back to Home",
    ko: "홈으로 돌아가기",
    zh: "返回首页",
    ar: "العودة للرئيسية",
    ru: "На главную",
    es: "Volver al Inicio",
    id: "Kembali ke Beranda",
    th: "กลับหน้าหลัก",
    vi: "Về Trang chủ",
    tr: "Ana Sayfaya Dön",
  },
  chapterOf: {
    en: "Chapter {current} of {total}",
    ko: "챕터 {current} / {total}",
    zh: "第 {current} 章 / 共 {total} 章",
    ar: "الف��ل {current} من {total}",
    ru: "Глава {current} и�� {total}",
    es: "Capítulo {current} de {total}",
    id: "Bab {current} dari {total}",
    th: "บทที่ {current} จาก {total}",
    vi: "Chương {current} / {total}",
    tr: "Bölüm {current} / {total}",
  },
  preface: {
    en: "Preface",
    ko: "서문",
    zh: "序言",
    ar: "مقدمة",
    ru: "Предисловие",
    es: "Prefacio",
    id: "Kata Pengantar",
    th: "ค��นำ",
    vi: "Lời nói đầu",
    tr: "Önsöz",
  },
}

function EbookContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: globalLang, setLang: setGlobalLang } = useLanguage()

  // Get language from URL param or fall back to global language
  const urlLang = searchParams.get("lang") as Lang | null
  const lang = urlLang || (globalLang as Lang) || "en"

  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([1, 4])) // Expand parent chapters by default
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // If URL has a lang param, update global language
    if (urlLang && urlLang !== globalLang) {
      setGlobalLang(urlLang)
    }
  }, [urlLang, globalLang, setGlobalLang])

  const currentPage = FLAT_PAGES[currentPageIndex]
  const isFirstPage = currentPageIndex === 0
  const isLastPage = currentPageIndex === FLAT_PAGES.length - 1

  const toggleChapterExpand = (chapterIndex: number) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterIndex)) {
      newExpanded.delete(chapterIndex)
    } else {
      newExpanded.add(chapterIndex)
    }
    setExpandedChapters(newExpanded)
  }

  const goToPage = (pageIndex: number) => {
    setCurrentPageIndex(pageIndex)
    setSidebarOpen(false)
    // Use 'auto' for immediate scroll reset to avoid browser scroll restoration interference
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  // Ensure scroll resets on page change (backup for any edge cases)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [currentPageIndex])

  const goToPrevious = () => {
    if (!isFirstPage) {
      goToPage(currentPageIndex - 1)
    }
  }

  const goToNext = () => {
    if (!isLastPage) {
      goToPage(currentPageIndex + 1)
    }
  }

  // Find page index for a given chapter/subchapter
  const findPageIndex = (chapterIndex: number, isIntro: boolean, subChapterIndex?: number): number => {
    return FLAT_PAGES.findIndex(p =>
      p.chapterIndex === chapterIndex &&
      p.isIntro === isIntro &&
      p.subChapterIndex === subChapterIndex
    )
  }

  // Get chapter number for display (1-based, 0 for preface)
  const getChapterDisplayNumber = (chapterIndex: number): string => {
    if (chapterIndex === 0) return "" // Preface
    return String(chapterIndex).padStart(2, "0")
  }

  // Build chapter indicator text
  const getChapterIndicator = (): string => {
    const page = currentPage
    const template = UI_TEXT.chapterOf[lang]
    const current = page.chapterNumber === 0 ? UI_TEXT.preface[lang] : page.chapterNumber
    return template.replace("{current}", String(current)).replace("{total}", String(TOTAL_MAIN_CHAPTERS))
  }

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-background/90 backdrop-blur-md border-b border-foreground/10">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 font-mono text-xs text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">{UI_TEXT.backToHome[lang]}</span>
        </button>

        <div className="flex items-center gap-3">
          <BookOpen size={18} className="text-cyan-400" />
          <span className="font-mono text-sm text-foreground/70">
            {getChapterIndicator()}
          </span>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 rounded-lg bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Desktop spacer */}
        <div className="hidden md:block w-24" />
      </header>

      {/* Progress bar */}
      <div className="h-[2px] bg-foreground/5">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${((currentPageIndex + 1) / FLAT_PAGES.length) * 100}%` }}
        />
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-80 min-h-[calc(100vh-60px)] border-r border-foreground/10 bg-foreground/[0.02]">
          <div className="sticky top-[60px] p-6 max-h-[calc(100vh-60px)] overflow-y-auto">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40 mb-4">
              {UI_TEXT.tableOfContents[lang]}
            </h2>
            <nav className="space-y-1">
              {CHAPTERS.map((chapter, chapterIndex) => {
                const displayNum = getChapterDisplayNumber(chapterIndex)
                const isParent = chapter.type === "parent"
                const isExpanded = expandedChapters.has(chapterIndex)

                // Check if current page is in this chapter
                const isCurrentChapter = currentPage.chapterIndex === chapterIndex

                return (
                  <div key={chapter.id}>
                    {/* Main chapter button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isParent) {
                          // Go to intro page of parent chapter
                          const introIdx = findPageIndex(chapterIndex, true, undefined)
                          if (introIdx >= 0) goToPage(introIdx)
                          // Expand if not expanded
                          if (!isExpanded) toggleChapterExpand(chapterIndex)
                        } else {
                          // Go to single chapter
                          const pageIdx = findPageIndex(chapterIndex, false, undefined)
                          if (pageIdx >= 0) goToPage(pageIdx)
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg font-mono text-sm transition-all duration-200 flex items-center gap-2 ${isCurrentChapter && (chapter.type === "single" || currentPage.isIntro)
                        ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                        : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                        }`}
                    >
                      {displayNum && (
                        <span className="text-foreground/30 text-xs w-6">{displayNum}</span>
                      )}
                      <span className="flex-1 truncate">{chapter.title[lang]}</span>
                      {isParent && (
                        <ChevronDown
                          size={14}
                          className={`text-foreground/30 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleChapterExpand(chapterIndex)
                          }}
                        />
                      )}
                    </button>

                    {/* Sub-chapters */}
                    {isParent && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-foreground/10 pl-3">
                        {chapter.children.map((sub, subIndex) => {
                          const isCurrentSub = isCurrentChapter && !currentPage.isIntro && currentPage.subChapterIndex === subIndex
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                const pageIdx = findPageIndex(chapterIndex, false, subIndex)
                                if (pageIdx >= 0) goToPage(pageIdx)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg font-mono text-xs transition-all duration-200 ${isCurrentSub
                                ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                                : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                                }`}
                            >
                              <span className="block truncate">{sub.title[lang]}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <aside
              className="absolute top-[60px] left-0 w-80 h-[calc(100vh-60px)] bg-background border-r border-foreground/10 p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40 mb-4">
                {UI_TEXT.tableOfContents[lang]}
              </h2>
              <nav className="space-y-1">
                {CHAPTERS.map((chapter, chapterIndex) => {
                  const displayNum = getChapterDisplayNumber(chapterIndex)
                  const isParent = chapter.type === "parent"
                  const isExpanded = expandedChapters.has(chapterIndex)
                  const isCurrentChapter = currentPage.chapterIndex === chapterIndex

                  return (
                    <div key={chapter.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (isParent) {
                            const introIdx = findPageIndex(chapterIndex, true, undefined)
                            if (introIdx >= 0) goToPage(introIdx)
                            if (!isExpanded) toggleChapterExpand(chapterIndex)
                          } else {
                            const pageIdx = findPageIndex(chapterIndex, false, undefined)
                            if (pageIdx >= 0) goToPage(pageIdx)
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg font-mono text-sm transition-all duration-200 flex items-center gap-2 ${isCurrentChapter && (chapter.type === "single" || currentPage.isIntro)
                          ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                          : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                          }`}
                      >
                        {displayNum && (
                          <span className="text-foreground/30 text-xs w-6">{displayNum}</span>
                        )}
                        <span className="flex-1 truncate">{chapter.title[lang]}</span>
                        {isParent && (
                          <ChevronDown
                            size={14}
                            className={`text-foreground/30 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleChapterExpand(chapterIndex)
                            }}
                          />
                        )}
                      </button>

                      {isParent && isExpanded && (
                        <div className="ml-6 mt-1 space-y-1 border-l border-foreground/10 pl-3">
                          {chapter.children.map((sub, subIndex) => {
                            const isCurrentSub = isCurrentChapter && !currentPage.isIntro && currentPage.subChapterIndex === subIndex
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => {
                                  const pageIdx = findPageIndex(chapterIndex, false, subIndex)
                                  if (pageIdx >= 0) goToPage(pageIdx)
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg font-mono text-xs transition-all duration-200 ${isCurrentSub
                                  ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                                  : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                                  }`}
                              >
                                <span className="block truncate">{sub.title[lang]}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-60px)]">
          <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-16">
            {/* Chapter Title */}
            <h1 className="font-[var(--font-bebas)] text-3xl md:text-5xl tracking-tight text-foreground mb-8">
              {currentPage.title[lang]}
            </h1>

            {/* Chapter Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              {typeof currentPage.content[lang] === "function" ? (
                // JSX content (styled components)
                <div className="ebook-content">
                  {(currentPage.content[lang] as () => ReactNode)()}
                </div>
              ) : (
                // Simple text content
                <div className="font-mono text-base leading-relaxed text-foreground/70 whitespace-pre-line">
                  {currentPage.content[lang] as string}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-16 pt-8 border-t border-foreground/10">
              <button
                type="button"
                onClick={goToPrevious}
                disabled={isFirstPage}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-sm transition-all duration-200 ${isFirstPage
                  ? "opacity-30 cursor-not-allowed text-foreground/30"
                  : "border border-foreground/15 text-foreground/60 hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 cursor-pointer"
                  }`}
              >
                <ChevronLeft size={16} />
                {UI_TEXT.previous[lang]}
              </button>

              <button
                type="button"
                onClick={goToNext}
                disabled={isLastPage}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-sm transition-all duration-200 ${isLastPage
                  ? "opacity-30 cursor-not-allowed text-foreground/30"
                  : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 hover:border-cyan-400/50 cursor-pointer"
                  }`}
              >
                {UI_TEXT.next[lang]}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function EbookPage({ marketerId }: { marketerId?: string }) {
  return (
    <MarketerIdContext.Provider value={marketerId}>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <EbookContent />
      </Suspense>
    </MarketerIdContext.Provider>
  )
}
