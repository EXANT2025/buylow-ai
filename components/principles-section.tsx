"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { SectionOverlay } from "@/components/section-overlay"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Check, ChevronDown } from "lucide-react"
import { AnimatedBorderButton } from "@/components/animated-border-button"

gsap.registerPlugin(ScrollTrigger)

/* ────────────────────────────────────────────────────────
   i18n dictionary — 10 languages
   ──────────────────────────────────────────────────────── */
type Lang = "en" | "ko" | "zh" | "ar" | "ru" | "es" | "id" | "th" | "vi" | "tr"

const T: Record<string, Record<string, string>> = {
  welcome:      { en: "Welcome to BuyLow AI\nThis is a tap-only setup demo.\nStart and see how the settings flow works.", ko: "BuyLow AI에 오신 것을 환영합니다\n탭만으로 진행하는 설정 데모입니다.\n시작하고 설정 흐름을 확인해보세요.", zh: "欢迎使用 BuyLow AI\n这是一个纯点击式设置演示。\n开始并了解设置流程。", ar: "مرحبًا بك في BuyLow AI\nهذا عرض توضيحي للإعداد بالنقر فقط.\nابدأ وشاهد كيف يعمل تدفق الإعدادات.", ru: "Добро пожаловать в BuyLow AI\nЭто демо настройки только нажатиями.\nНачните и посмотрите, как работает процесс.", es: "Bienvenido a BuyLow AI\nEsta es una demo de configuracion solo con toques.\nComienza y ve como funciona el flujo.", id: "Selamat datang di BuyLow AI\nIni adalah demo pengaturan hanya dengan ketukan.\nMulai dan lihat bagaimana alur pengaturan bekerja.", th: "ยินดีต้อนรับสู่ BuyLow AI\nนี่คือการสาธิตการตั้งค่าแบบแตะเท่านั้น\nเริ่มต้นและดูว่าการตั้งค่าทำงานอย่างไร", vi: "Chào mừng đến với BuyLow AI\nĐây là bản demo thiết lập chỉ bằng chạm.\nBắt đầu và xem cách thiết lập hoạt động.", tr: "BuyLow AI'ye Hoş Geldiniz\nBu sadece dokunarak kurulum demosu.\nBaşlayın ve ayar akışının nasıl çalıştığını görün." },
  startSetup:   { en: "Start Setting", ko: "Start Setting", zh: "Start Setting", ar: "Start Setting", ru: "Start Setting", es: "Start Setting", id: "Start Setting", th: "Start Setting", vi: "Start Setting", tr: "Start Setting" },
  selectLang:   { en: "Select your language", ko: "언어를 선택하세요", zh: "请选择您的语言", ar: "اختر لغتك", ru: "Выберите язык", es: "Selecciona tu idioma", id: "Pilih bahasa Anda", th: "เลือกภาษาของคุณ", vi: "Chọn ngôn ngữ của bạn", tr: "Dilinizi seçin" },
  targetQ:      { en: "What monthly return do you want to target?\nPick one between 1% and 20% (demo choice).", ko: "목표 월 수익률을 선택하세요.\n1%에서 20% 사이에서 골라주세요 (데모).", zh: "您想要的目标月收益率是多少？\n请在1%到20%之间选择（演示）。", ar: "ما هو العائد الشهري المستهدف؟\nاختر بين 1% و 20% (عرض توضيحي).", ru: "Какую месячную доходность вы хотите?\nВыберите от 1% до 20% (демо).", es: "Que rendimiento mensual deseas?\nElige entre 1% y 20% (demo).", id: "Berapa target return bulanan Anda?\nPilih antara 1% dan 20% (pilihan demo).", th: "คุณต้องการผลตอบแทนรายเดือนเท่าไหร่?\nเลือกระหว่าง 1% ถึง 20% (ตัวเลือกสาธิต)", vi: "Bạn muốn nhắm mục tiêu lợi nhuận hàng tháng bao nhiêu?\nChọn từ 1% đến 20% (lựa chọn demo).", tr: "Aylık ne kadar getiri hedefliyorsunuz?\n%1 ile %20 arasında seçin (demo seçimi)." },
  manualInput:  { en: "Manual Input", ko: "직접 입력", zh: "手动输入", ar: "إدخال يدوي", ru: "Ручной ввод", es: "Entrada manual", id: "Input Manual", th: "ป้อนด้วยตนเอง", vi: "Nhập thủ công", tr: "Manuel Giriş" },
  manualToast:  { en: "Demo only — manual input is disabled in this preview.", ko: "데모 전용 — 이 미리보기에서는 직접 입력이 비활성화되어 있습니다.", zh: "仅演示 — 此预览中已禁用手动输入。", ar: "عرض توضيحي فقط — الإدخال اليدوي معطل في هذه المعاينة.", ru: "Только демо — ручной ввод отключён в этом предпросмотре.", es: "Solo demo — la entrada manual esta desactivada en esta vista previa.", id: "Demo saja — input manual dinonaktifkan dalam pratinjau ini.", th: "สาธิตเท่านั้น — การป้อนด้วยตนเองถูกปิดใช้งานในการแสดงตัวอย่างนี้", vi: "Chỉ demo — nhập thủ công bị vô hiệu hóa trong bản xem trước này.", tr: "Sadece demo — bu önizlemede manuel giriş devre dışı." },
  seedQ:        { en: "Your trading capital is detected as 10,000 USDT.\nContinue with this amount?", ko: "거래 자본이 10,000 USDT로 감지되었습니다.\n이 금액으로 계속하시겠습니까?", zh: "检测到您的交易资金为 10,000 USDT。\n是否继续使用此金额？", ar: "تم اكتشاف رأس مال التداول الخاص بك بمبلغ 10,000 USDT.\nهل تريد المتابعة بهذا المبلغ؟", ru: "Ваш торговый капитал определён как 10 000 USDT.\nПродолжить с этой суммой?", es: "Su capital de trading detectado es 10,000 USDT.\nContinuar con esta cantidad?", id: "Modal trading Anda terdeteksi sebagai 10.000 USDT.\nLanjutkan dengan jumlah ini?", th: "ตรวจพบเงินทุนการซื้อขายของคุณเป็น 10,000 USDT\nดำเนินการต่อด้วยจำนวนนี้?", vi: "Vốn giao dịch của bạn được phát hiện là 10.000 USDT.\nTiếp tục với số tiền này?", tr: "İşlem sermayeniz 10.000 USDT olarak tespit edildi.\nBu miktarla devam edilsin mi?" },
  seedContinue: { en: "Continue with 10,000 USDT", ko: "10,000 USDT로 계속", zh: "继续使用 10,000 USDT", ar: "المتابعة بـ 10,000 USDT", ru: "Продолжить с 10 000 USDT", es: "Continuar con 10,000 USDT", id: "Lanjutkan dengan 10.000 USDT", th: "ดำเนินการต่อด้วย 10,000 USDT", vi: "Tiếp tục với 10.000 USDT", tr: "10.000 USDT ile devam et" },
  seedChange:   { en: "Change Amount", ko: "금액 변경", zh: "更改金额", ar: "تغيير المبلغ", ru: "Изменить сумму", es: "Cambiar cantidad", id: "Ubah Jumlah", th: "เปลี่ยนจำนวน", vi: "Thay đổi số tiền", tr: "Miktarı Değiştir" },
  seedToast:    { en: "Demo uses fixed 10,000 USDT.", ko: "데모에서는 10,000 USDT 고정입니다.", zh: "演示使用固定的 10,000 USDT。", ar: "العرض التوضيحي يستخدم 10,000 USDT ثابت.", ru: "В демо используется фиксированная сумма 10 000 USDT.", es: "La demo usa 10,000 USDT fijos.", id: "Demo menggunakan 10.000 USDT tetap.", th: "สาธิตใช้ 10,000 USDT คงที่", vi: "Demo sử dụng 10.000 USDT cố định.", tr: "Demo sabit 10.000 USDT kullanır." },
  styleQ:       { en: "Pick your AI style\nYou can change this later.", ko: "AI 스타일을 선택하세요\n나중에 변경할 수 있습니다.", zh: "选择您的 AI 风格\n稍后可以更改。", ar: "اختر نمط الذكاء الاصطناعي\nيمكنك تغييره لاحقًا.", ru: "Выберите стиль ИИ\nВы можете изменить это позже.", es: "Elige tu estilo de IA\nPuedes cambiarlo despues.", id: "Pilih gaya AI Anda\nAnda dapat mengubahnya nanti.", th: "เลือกสไตล์ AI ของคุณ\nคุณสามารถเปลี่ยนได้ภายหลัง", vi: "Chọn phong cách AI của bạn\nBạn có thể thay đổi sau.", tr: "AI stilinizi seçin\nBunu daha sonra değiştirebilirsiniz." },
  styleHigh:    { en: "High Risk (More aggressive)", ko: "리스크 (공격적)", zh: "高风险（更激进）", ar: "مخاطر عالية (أكثر عدوانية)", ru: "Высокий риск (Агрессивный)", es: "Alto riesgo (Mas agresivo)", id: "Risiko Tinggi (Lebih agresif)", th: "ความเสี่ยงสูง (ก้าวร้าวมากขึ้น)", vi: "Rủi ro cao (Tích cực hơn)", tr: "Yüksek Risk (Daha agresif)" },
  styleBalanced:{ en: "Balanced (Recommended)", ko: "밸런스 (권장)", zh: "均衡（推荐）", ar: "متوازن (موصى به)", ru: "Сбалансированный (Рекомендуется)", es: "Equilibrado (Recomendado)", id: "Seimbang (Direkomendasikan)", th: "สมดุล (แนะนำ)", vi: "Cân bằng (Khuyến nghị)", tr: "Dengeli (Önerilen)" },
  styleSafe:    { en: "Safe (Stability first)", ko: "안전 (안정성 우선)", zh: "安全（稳定优先）", ar: "آمن (الاستقرار أولاً)", ru: "Безопасный (Стабильность)", es: "Seguro (Estabilidad primero)", id: "Aman (Stabilitas utama)", th: "ปลอดภัย (เน้นความมั่นคง)", vi: "An toàn (Ổn định trước)", tr: "Güvenli (Önce istikrar)" },
  compoundTitle:{ en: "Compound Calculation Example (Demo)\nCalculation example based on user-entered monthly rate", ko: "복리 계산 예시 (데모)\n사용자가 입력한 월 수익률 기준 계산 예시", zh: "复利计算示例（演示）\n基于用户输入的月收益率计算示例", ar: "مثال حساب الفائدة المركبة (عرض توضيحي)\nمثال حساب بناءً على معدل العائد الشهري الذي أدخله المستخدم", ru: "Пример расчёта сложного процента (демо)\nПример расчёта на основе введённой пользователем месячной ставки", es: "Ejemplo de calculo de interes compuesto (Demo)\nEjemplo de calculo basado en la tasa mensual ingresada por el usuario", id: "Contoh Perhitungan Compound (Demo)\nContoh perhitungan berdasarkan tingkat bulanan yang dimasukkan pengguna", th: "ตัวอย่างการคำนวณดอกเบี้ยทบต้น (สาธิต)\nตัวอย่างการคำนวณตามอัตราผลตอบแทนรายเดือนที่ผู้ใช้ป้อน", vi: "Ví dụ tính lãi kép (Demo)\nVí dụ tính toán dựa trên lãi suất hàng tháng do người dùng nhập", tr: "Bileşik Hesaplama Örneği (Demo)\nKullanıcının girdiği aylık orana göre hesaplama örneği" },
  compoundResultsHeader: { en: "Compound calculation results based on assumed monthly rate", ko: "월 수익률 가정 기반 복리 계산 결과", zh: "基于假设月收益率的复利计算结果", ar: "نتائج حساب الفائدة المركبة بناءً على معدل شهري مفترض", ru: "Результаты расчёта сложного процента на основе предполагаемой месячной ставки", es: "Resultados del calculo de interes compuesto basados en la tasa mensual asumida", id: "Hasil perhitungan compound berdasarkan asumsi tingkat bulanan", th: "ผลการคำนวณดอกเบี้ยทบต้นตามอัตราผลตอบแทนรายเดือนที่สมมติ", vi: "Kết quả tính lãi kép dựa trên lãi suất hàng tháng giả định", tr: "Varsayılan aylık orana göre bileşik hesaplama sonuçları" },
  compoundWarn: { en: "This is a simple compound calculation example and is unrelated to actual investment results.", ko: "단순 복리 계산 예시이며 실제 투자 결과와 무관합니다.", zh: "这是一个简单的复利计算示例，与实际投资结果无关。", ar: "هذا مثال بسيط لحساب الفائدة المركبة ولا علاقة له بنتائج الاستثمار الفعلية.", ru: "Это простой пример расчёта сложного процента, не связанный с реальными результатами инвестиций.", es: "Este es un ejemplo simple de calculo de interes compuesto y no esta relacionado con los resultados reales de inversion.", id: "Ini adalah contoh perhitungan compound sederhana dan tidak terkait dengan hasil investasi aktual.", th: "นี่เป็นตัวอย่างการคำนวณดอกเบี้ยทบต้นอย่างง่ายและไม่เกี่ยวข้องกับผลการลงทุนจริง", vi: "Đây là ví dụ tính lãi kép đơn giản và không liên quan đến kết quả đầu tư thực tế.", tr: "Bu basit bir bileşik hesaplama örneğidir ve gerçek yatırım sonuçlarıyla ilgisi yoktur." },
  compoundDisclaimer: { en: "This screen is a simple compound calculation example, not an investment performance prediction.", ko: "본 화면은 투자 성과 예측이 아닌 단순 복리 계산 예시입니다.", zh: "本画面是简单的复利计算示例，不是投资业绩预测。", ar: "هذه الشاشة هي مثال بسيط لحساب الفائدة المركبة، وليست توقعًا لأداء الاستثمار.", ru: "Этот экран является простым примером расчёта сложного процента, а не прогнозом инвестиционной доходности.", es: "Esta pantalla es un ejemplo simple de calculo de interes compuesto, no una prediccion del rendimiento de la inversion.", id: "Layar ini adalah contoh perhitungan compound sederhana, bukan prediksi kinerja investasi.", th: "หน้าจอนี้เป็นตัวอย่างการคำนวณดอกเบี้ยทบต้นอย่างง่าย ไม่ใช่การคาดการณ์ผลการลงทุน", vi: "Màn hình này là ví dụ tính lãi kép đơn giản, không phải dự đoán hiệu suất đầu tư.", tr: "Bu ekran basit bir bileşik hesaplama örneğidir, yatırım performansı tahmini değildir." },
  done:         { en: "Done", ko: "완료", zh: "完成", ar: "تم", ru: "Готово", es: "Listo", id: "Selesai", th: "เสร็จสิ้น", vi: "Xong", tr: "Tamam" },
  complete:     { en: "Setup complete! You're all set.\nIn the real app, trading would begin automatically.", ko: "설정 완료! 모든 준비가 끝났습니다.\n실제 앱에서는 자동으로 트레이딩이 시작됩니다.", zh: "设置完成！一切就绪。\n在实际应用中，交易将自动开始。", ar: "اكتمل الإعداد! أنت جاهز.\nفي التطبيق الفعلي، سيبدأ التداول تلقائيًا.", ru: "Настройка завершена! Всё готово.\nВ реальном приложении торговля начнётся автоматически.", es: "Configuracion completa! Todo listo.\nEn la app real, el trading comenzaria automaticamente.", id: "Pengaturan selesai! Anda sudah siap.\nDi aplikasi nyata, trading akan dimulai secara otomatis.", th: "ตั้งค่าเสร็จสมบูรณ์! คุณพร้อมแล้ว\nในแอปจริง การซื้อขายจะเริ่มต้นโดยอัตโนมัติ", vi: "Thiết lập hoàn tất! Bạn đã sẵn sàng.\nTrong ứng dụng thực, giao dịch sẽ bắt đầu tự động.", tr: "Kurulum tamamlandı! Hazırsınız.\nGerçek uygulamada, işlem otomatik olarak başlar." },
  jumpLatest:   { en: "Latest", ko: "최신", zh: "最新", ar: "الأحدث", ru: "Последнее", es: "Reciente", id: "Terbaru", th: "ล่าสุด", vi: "Mới nhất", tr: "En son" },
  year1:        { en: "1 year", ko: "1년", zh: "1年", ar: "سنة واحدة", ru: "1 год", es: "1 ano", id: "1 tahun", th: "1 ปี", vi: "1 năm", tr: "1 yıl" },
  year3:        { en: "3 years", ko: "3년", zh: "3年", ar: "3 سنوات", ru: "3 года", es: "3 anos", id: "3 tahun", th: "3 ปี", vi: "3 năm", tr: "3 yıl" },
  year5:        { en: "5 years", ko: "5년", zh: "5年", ar: "5 سنوات", ru: "5 лет", es: "5 anos", id: "5 tahun", th: "5 ปี", vi: "5 năm", tr: "5 yıl" },
  tapHint:      { en: "Tap buttons above to interact...", ko: "위 버튼을 눌러 상호작용하세요...", zh: "点击上方按钮进行互动...", ar: "اضغط على الأزرار أعلاه للتفاعل...", ru: "Нажмите кнопки выше для взаимодействия...", es: "Toca los botones de arriba para interactuar...", id: "Ketuk tombol di atas untuk berinteraksi...", th: "แตะปุ่มด้านบนเพื่อโต้ตอบ...", vi: "Nhấn các nút ở trên để tương tác...", tr: "Etkileşim için yukarıdaki düğmelere dokunun..." },
  tryFree:      { en: "Try for Free", ko: "무료로 시작하기", zh: "免费试用", ar: "جرب مجانًا", ru: "Попробовать бесплатно", es: "Prueba gratis", id: "Coba Gratis", th: "ทดลองใช้ฟรี", vi: "Dùng thử miễn phí", tr: "Ücretsiz Deneyin" },
}

function tx(key: string, lang: Lang): string {
  return T[key]?.[lang] ?? T[key]?.en ?? key
}

/* Language code mapping from option label */
const LANG_MAP: Record<string, Lang> = {
  English: "en", "한국어": "ko", "中文": "zh", "العربية": "ar", "Русский": "ru", "Español": "es", "Bahasa Indonesia": "id", "ไทย": "th", "Tiếng Việt": "vi", "Türkçe": "tr",
}

/* ────────────────────────────────────────────────────────
   Typing dots animation
   ──────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/40"
          style={{
            animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Toast component
   ──────────────────────────────────────────────────────── */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2500)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-md text-white text-[11px] font-mono px-4 py-2 rounded-lg border border-white/15 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[85%] text-center">
      {message}
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Compound simulation card (i18n)
   ──────────────────────────────────────────────────────── */
function CompoundCard({ lang }: { lang: Lang }) {
  const rows = [
    { period: tx("year1", lang), result: "10,000 \u2192 23,000 USDT" },
    { period: tx("year3", lang), result: "10,000 \u2192 122,000 USDT" },
    { period: tx("year5", lang), result: "10,000 \u2192 650,000 USDT" },
  ]
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 space-y-2 mx-1 mb-2">
      {/* Header above year results */}
      <p className="text-[10px] text-white/60 leading-snug mb-1">
        {tx("compoundResultsHeader", lang)}
      </p>
      {rows.map((r) => (
        <div key={r.period} className="flex justify-between font-mono text-[11px]">
          <span className="text-white/50">{r.period}</span>
          <span className="text-emerald-400 font-semibold">{r.result}</span>
        </div>
      ))}
      <p className="text-[10px] text-amber-400/80 mt-2 leading-snug">
        {"\u26A0\uFE0F " + tx("compoundWarn", lang)}
      </p>
      <p className="text-[9px] text-white/40 leading-snug">
        {tx("compoundDisclaimer", lang)}
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Matrix code rain — lightweight canvas background
   ──────────────────────────────────────────────────────── */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Respect reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) return

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン".split("")
    const fontSize = 11
    let columns = 0
    let drops: number[] = []

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      columns = Math.floor(rect.width / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -50)
    }
    resize()

    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    let raf: number
    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      // Fade trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)"
      ctx.fillRect(0, 0, w, h)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Brighter head
        if (Math.random() > 0.5) {
          ctx.fillStyle = "rgba(34, 197, 94, 0.35)"
        } else {
          ctx.fillStyle = "rgba(34, 197, 94, 0.15)"
        }
        ctx.fillText(char, x, y)

        // Reset when off screen or randomly
        if (y > h && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.4 + Math.random() * 0.3
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const onMotionChange = () => {
      if (mq.matches) {
        cancelAnimationFrame(raf)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    mq.addEventListener("change", onMotionChange)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mq.removeEventListener("change", onMotionChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.45 }}
      aria-hidden="true"
    />
  )
}

/* ───────────────────────────────────────────��────────────
   Phone Chat Demo (scroll + i18n)
   ──────────────────────────────────────────────────────── */
type HistoryEntry = {
  type: "bot" | "user"
  text?: string
  card?: React.ReactNode
}

function PhoneChatDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showButtons, setShowButtons] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)
  const [lang, setLang] = useState<Lang>("en")

  // Scroll control
  const scrollRef = useRef<HTMLDivElement>(null)
  const isUserScrolling = useRef(false)
  const [showJump, setShowJump] = useState(false)
  const initialised = useRef(false)

  // Scroll only the chat container — never the page
  const scrollChatToEnd = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [])

  const scrollToBottom = useCallback(() => {
    if (isUserScrolling.current) {
      setShowJump(true)
      return
    }
    setTimeout(scrollChatToEnd, 50)
  }, [scrollChatToEnd])

  const jumpToLatest = useCallback(() => {
    isUserScrolling.current = false
    setShowJump(false)
    scrollChatToEnd()
  }, [scrollChatToEnd])

  // Detect user scroll-up (near-bottom = within 80px)
  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distFromBottom > 80) {
      isUserScrolling.current = true
      setShowJump(true)
    } else {
      isUserScrolling.current = false
      setShowJump(false)
    }
  }, [])

  // Wheel handler: capture scroll inside chat, release at boundaries
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const atTop = scrollTop <= 0 && e.deltaY < 0
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0
    // Only let page scroll when chat is at absolute top/bottom boundary
    if (!atTop && !atBottom) {
      e.stopPropagation()
    }
  }, [])

  /* ── Build step data from i18n ── */
  const getStepData = useCallback((stepIndex: number, l: Lang) => {
    switch (stepIndex) {
      case 0: return {
        botMessages: [tx("welcome", l)],
        options: [tx("startSetup", l)],
        grid: false,
        toastOnIndex: {} as Record<number, string>,
      }
case 1: return {
  botMessages: [tx("selectLang", l)],
  options: ["English", "한국어", "中文", "العربية", "Русский", "Español", "Bahasa Indonesia", "ไทย", "Tiếng Việt", "Türkçe"],
  grid: true,
  toastOnIndex: {} as Record<number, string>,
  }
      case 2: return {
        botMessages: [tx("targetQ", l)],
        options: ["1%", "3%", "5%", "7%", "10%", "13%", "15%", "17%", "20%", tx("manualInput", l)],
        grid: true,
        toastOnIndex: { 9: tx("manualToast", l) },
      }
      case 3: return {
        botMessages: [tx("seedQ", l)],
        options: [tx("seedContinue", l), tx("seedChange", l)],
        grid: false,
        toastOnIndex: { 1: tx("seedToast", l) },
      }
      case 4: return {
        botMessages: [tx("styleQ", l)],
        options: [tx("styleHigh", l), tx("styleBalanced", l), tx("styleSafe", l)],
        grid: false,
        toastOnIndex: {} as Record<number, string>,
      }
      case 5: return {
        botMessages: [tx("compoundTitle", l)],
        options: [tx("done", l)],
        grid: false,
        toastOnIndex: {} as Record<number, string>,
        hasCard: true,
      }
      default: return null
    }
  }, [])

  const showStepMessages = useCallback(
    (stepIndex: number, l: Lang) => {
      const data = getStepData(stepIndex, l)
      if (!data) return
      setShowButtons(false)
      setIsTyping(true)
      scrollToBottom()

      setTimeout(() => {
        setIsTyping(false)
        const newEntries: HistoryEntry[] = data.botMessages.map((text) => ({
          type: "bot" as const, text,
        }))
        if (data.hasCard) {
          newEntries.push({ type: "bot", card: <CompoundCard lang={l} /> })
        }
        setHistory((prev) => [...prev, ...newEntries])
        setShowButtons(true)
        scrollToBottom()
      }, 700)
    },
    [scrollToBottom, getStepData],
  )

  // Initialise step 0
  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true
      showStepMessages(0, "en")
    }
  }, [showStepMessages])

  const handleOption = (optionLabel: string, optionIndex: number) => {
    const data = getStepData(currentStep, lang)
    if (!data) return

    // Toast-only actions
    if (data.toastOnIndex[optionIndex] !== undefined) {
      setToastMsg(data.toastOnIndex[optionIndex])
      return
    }

    // Add user message
    setHistory((prev) => [...prev, { type: "user", text: optionLabel }])
    setShowButtons(false)
    scrollToBottom()

    // Language selection at step 1
    let nextLang = lang
    if (currentStep === 1) {
      nextLang = LANG_MAP[optionLabel] ?? "en"
      setLang(nextLang)
    }

    const nextStep = currentStep + 1
    if (nextStep > 5) {
      // Demo complete
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { type: "bot", text: tx("complete", nextLang) },
        ])
        setIsDone(true)
        scrollToBottom()
        // Scroll again after CTA renders
        setTimeout(scrollToBottom, 100)
      }, 700)
      return
    }

    setCurrentStep(nextStep)
    setTimeout(() => showStepMessages(nextStep, nextLang), 400)
  }

  const stepData = getStepData(currentStep, lang)

  return (
    <div className="relative w-[320px] md:w-[340px] mx-auto">
      {/* Phone frame — flex column so chat area fills remaining space */}
      <div
        className="relative flex flex-col rounded-[2.5rem] border-[3px] border-white/15 bg-black overflow-hidden h-[493px] md:h-[600px]"
        style={{
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04), 0 25px 60px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30" />

        {/* Header bar — shrink-0 so it never collapses */}
        <div className="relative z-20 flex shrink-0 items-center justify-between px-5 pt-8 pb-3 bg-black/80 backdrop-blur-sm border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
              <img
                src="https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/buylow_demo_logo.png"
                alt="BuyLow AI"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <div className="font-mono text-xs font-semibold text-white leading-none">BuyLow AI</div>
              <div className="font-mono text-[9px] text-white/40 mt-0.5">Assistant</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-mono text-[9px] text-white/70 leading-none">24/7</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[9px] text-emerald-400">Online</span>
            </div>
          </div>
        </div>

        {/* Chat area wrapper — relative so canvas sits behind scroll content */}
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <MatrixRain />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true" />
          {/* Scrollable chat content */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onWheel={handleWheel}
            className="relative z-10 h-full overflow-y-auto px-3 py-3 space-y-2.5 scroll-smooth chat-scroll-area"
            style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", scrollbarGutter: "stable" }}
          >
          {history.map((entry, i) => {
            if (entry.card) {
              return <div key={i}>{entry.card}</div>
            }
            const isBot = entry.type === "bot"
            return (
              <div key={i} className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 font-mono text-[11.5px] leading-relaxed whitespace-pre-line ${
                    isBot
                      ? "bg-white/[0.07] text-white/90 rounded-bl-md"
                      : "bg-orange-600/80 text-white rounded-br-md"
                  }`}
                >
                  {entry.text}
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/[0.07] rounded-2xl rounded-bl-md">
                <TypingDots />
              </div>
            </div>
          )}

          {/* Option buttons */}
          {showButtons && !isDone && stepData && (
            <div
              className={`${
                stepData.grid ? "grid grid-cols-3 gap-1.5" : "flex flex-col gap-1.5"
              } mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              {stepData.options.map((opt, oi) => {
                // Step 0 "Start Setting" button: use AnimatedBorderButton with main CTA styling
                if (currentStep === 0 && oi === 0) {
                  return (
                    <AnimatedBorderButton key={oi} className="w-full">
                      <button
                        type="button"
                        onClick={() => handleOption(opt, oi)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-widest text-background transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                          boxShadow: "0 0 20px rgba(249, 115, 22, 0.3), 0 4px 12px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        {opt}
                      </button>
                    </AnimatedBorderButton>
                  )
                }
                // Default button style for other options
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => handleOption(opt, oi)}
                    className={`font-mono text-[10.5px] px-3 py-2 rounded-xl border border-white/12 bg-white/[0.05] text-white/80 hover:bg-white/[0.12] hover:border-white/25 transition-all duration-200 cursor-pointer text-left leading-snug ${
                      stepData.grid ? "text-center" : ""
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {/* Primary CTA after demo completion — identical to landing hero CTA */}
          {isDone && (
            <div className="flex justify-center mt-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <AnimatedBorderButton>
                <button
                  type="button"
                  onClick={() => { window.location.href = "/server?step=1" }}
                  className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-mono text-sm uppercase tracking-widest text-background transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                    boxShadow: "0 0 30px rgba(249, 115, 22, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
                  }}
                >
                  START AI
                </button>
              </AnimatedBorderButton>
            </div>
          )}

          {/* end of chat scroll area */}
          </div>
        </div>

        {/* Jump to latest button */}
        {showJump && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="absolute bottom-16 right-5 z-30 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 font-mono text-[10px] text-white/80 hover:bg-white/20 transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {tx("jumpLatest", lang)}
            <ChevronDown className="w-3 h-3" />
          </button>
        )}

        {/* Bottom bar — shrink-0 */}
        <div className="relative z-20 flex shrink-0 items-center gap-2 px-4 py-3 bg-black/80 backdrop-blur-sm border-t border-white/8">
          <div className="flex-1 rounded-full bg-white/[0.05] border border-white/10 px-4 py-2 font-mono text-[10px] text-white/25">
            {tx("tapHint", lang)}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg(null)} />}
    </div>
  )
}

/* ──────────────────���─────────────────────────────────────
   Main Features Section
   ──────────────────────────────────────────────────────── */
export function FeaturesSection() {
  const { lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  // Helper to get translated text
  const t = (obj: Record<string, string> | undefined): string => {
    if (!obj) return ""
    return obj[lang] ?? obj.en ?? ""
  }

  useEffect(() => {
    if (!sectionRef.current || !leftRef.current || !rightRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })
      gsap.from(rightRef.current, {
        x: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const checks = [
    t(translations.demo.checkTapBased),
    t(translations.demo.checkPresets),
    t(translations.demo.checkCompound),
  ]

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="relative py-24 md:py-32 px-6 md:px-16 lg:px-28 overflow-hidden"
    >
      <SectionOverlay />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Section label */}
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-16 block">
          {t(translations.demo.sectionLabel)}
        </span>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-16 lg:gap-20">
          {/* LEFT — Text */}
          <div ref={leftRef} className="flex-1 max-w-xl space-y-8">
            <h2 className="font-[var(--font-bebas)] text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] whitespace-pre-line">
              {t(translations.demo.heading)}
            </h2>

            <p className="font-mono text-sm md:text-base text-white/50 leading-relaxed">
              {t(translations.demo.description)}
            </p>

            <div className="space-y-3 font-mono text-sm text-white/70 leading-relaxed">
              <p>{t(translations.demo.paragraph1)}</p>
              <p>{t(translations.demo.paragraph2)}</p>
              <p className="text-white/35 text-xs">{t(translations.demo.disclaimer)}</p>
            </div>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {checks.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="font-mono text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Phone demo */}
          <div ref={rightRef} className="flex-shrink-0 w-full lg:w-auto flex justify-center">
            <PhoneChatDemo />
          </div>
        </div>
      </div>

      {/* Typing dots keyframes */}
      <style jsx global>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </section>
  )
}
