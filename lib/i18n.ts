// ═══════════════════════════════════════════════════════════════
// CENTRALIZED i18n — BuyLow AI
// ═══════════════════════════════════════════════════════════════
// Languages: EN, KO, AR, RU, ZH, ES, ID, TH, VI, TR — all 10 active
// CTAs like "START AI", "Try for Free" must ALWAYS stay English.
// Tickers/symbols (BTC, XAU, TSLA, etc.) must ALWAYS stay English.
// ═══════════════════════════════════════════════════════════════

export type SupportedLang = "en" | "ko" | "ar" | "ru" | "zh" | "es" | "id" | "th" | "vi" | "tr"

// All 10 languages are now fully active
export const ACTIVE_LANGUAGES: SupportedLang[] = ["en", "ko", "ar", "ru", "zh", "es", "id", "th", "vi", "tr"]

// No longer any "Coming Soon" languages
export const COMING_SOON_LANGUAGES: SupportedLang[] = []

export const translations = {
  // ═══════════════════════════════════════════════════════════════
  // NAV
  // ═══════════════════════════════════════════════════════════════
  nav: {
    partners: { en: "Partners", ko: "파트너", ar: "الشركاء", ru: "Партнёры", zh: "合作伙伴", es: "Socios", id: "Mitra", th: "พันธมิตร", vi: "Đối tác", tr: "Ortaklar" },
    markets: { en: "Markets", ko: "종목", ar: "الأسواق", ru: "Рынки", zh: "市场", es: "Mercados", id: "Pasar", th: "ตลาด", vi: "Thị trường", tr: "Piyasalar" },
    strategy: { en: "Strategy", ko: "전략", ar: "الاستراتيجية", ru: "Стратегия", zh: "策略", es: "Estrategia", id: "Strategi", th: "กลยุทธ์", vi: "Chiến lược", tr: "Strateji" },
    demo: { en: "Demo", ko: "데모", ar: "عرض توضيحي", ru: "Демо", zh: "演示", es: "Demo", id: "Demo", th: "สาธิต", vi: "Demo", tr: "Demo" },
    home: { en: "Home", ko: "홈", ar: "الرئيسية", ru: "Главная", zh: "首页", es: "Inicio", id: "Beranda", th: "หน้าแรก", vi: "Trang chủ", tr: "Ana Sayfa" },
  },

  // ═══════════════════════════════════════════════════════════════
  // HERO SECTION
  // ═══════════════════════════════════════════════════════════════
  hero: {
    subtitle: {
      en: "Secure Quant Investing Powered by AI Strategy Solution",
      ko: "AI 전략 솔루션을 기반으로 한 안전한 퀀트 투자",
      ar: "استثمار كمي آمن مدعوم بحلول استراتيجية الذكاء الاصطناعي",
      ru: "Безопасное квант-инвестирование на базе AI-стратегий",
      zh: "由AI策略解决方案驱动的安全量化投资",
      es: "Inversión cuantitativa segura impulsada por soluciones de estrategia de IA",
      id: "Investasi Kuantitatif Aman Didukung Solusi Strategi AI",
      th: "การลงทุนเชิงปริมาณที่ปลอดภัยด้วยโซลูชั่นกลยุทธ์ AI",
      vi: "Đầu tư định lượng an toàn được hỗ trợ bởi giải pháp chiến lược AI",
      tr: "AI Strateji Çözümü ile Güvenli Kantitatif Yatırım",
    },
    description: {
      en: "We manage risk with deep financial market experience and non-custodial AI quant strategies to deliver secure and consistent performance.",
      ko: "깊은 금융 시장 경험과 비수탁 AI 퀀트 전략으로 리스크를 관리하여 안전하고 일관된 수익을 제공합니다.",
      ar: "نحن ندير المخاطر بخبرة عميقة في الأسواق المالية واستراتيجيات الذكاء الاصطناعي الكمية غير الحفظية لتقديم أداء آمن ومتسق.",
      ru: "Мы управляем рисками, используя глубокий опыт на финансовых рынках и некастодиальные AI-квант стратегии для стабильной и безопасной доходности.",
      zh: "我们凭借深厚的金融市场经验和非托管AI量化策略来管理风险，提供安全且稳定的收益。",
      es: "Gestionamos el riesgo con una profunda experiencia en mercados financieros y estrategias cuantitativas de IA sin custodia para ofrecer un rendimiento seguro y constante.",
      id: "Kami mengelola risiko dengan pengalaman pasar keuangan yang mendalam dan strategi kuantitatif AI non-kustodian untuk memberikan kinerja yang aman dan konsisten.",
      th: "เราจัดการความเสี่ยงด้วยประสบการณ์ตลาดการเงินที่ลึกซึ้งและกลยุทธ์ AI เชิงปริมาณแบบ non-custodial เพื่อมอบผลตอบแทนที่ปลอดภัยและสม่ำเสมอ",
      vi: "Chúng tôi quản lý rủi ro với kinh nghiệm thị trường tài chính sâu rộng và chiến lược quant AI không giữ hộ để mang lại hiệu suất an toàn và ổn định.",
      tr: "Derin finans piyasası deneyimi ve saklama dışı AI quant stratejileri ile riski yöneterek güvenli ve tutarlı performans sunuyoruz.",
    },
    joinTelegram: { en: "Join Official Community", ko: "공식 커뮤니티 입장", ar: "انضم إلى المجتمع الرسمي", ru: "Присоединиться к сообществу", zh: "加入官方社区", es: "Unirse a la comunidad oficial", id: "Bergabung dengan Komunitas Resmi", th: "เข้าร่วมชุมชนอย่างเป็นทางการ", vi: "Tham gia cộng đồng chính thức", tr: "Resmi Topluluğa Katıl" },
  },

  // ═══════════════════════════════════════════════════════════════
  // PARTNERS SECTION (01)
  // ═══════════════════════════════════════════════════════════════
  partners: {
    sectionLabel: { en: "01 / Partners", ko: "01 / 파트너", ar: "01 / الشركاء", ru: "01 / Партнёры", zh: "01 / 合作伙伴", es: "01 / Socios", id: "01 / Mitra", th: "01 / พันธมิตร", vi: "01 / Đối tác", tr: "01 / Ortaklar" },
    heading1: { en: "Backed By", ko: "업계 리더와", ar: "مدعوم من", ru: "При поддержке", zh: "获得支持", es: "Respaldado por", id: "Didukung Oleh", th: "ได้รับการสนับสนุนจาก", vi: "Được hỗ trợ bởi", tr: "Destekleyen" },
    heading2: { en: "Industry Leaders", ko: "기관의", ar: "قادة الصناعة", ru: "Лидеров индустрии", zh: "行业领袖", es: "Líderes de la industria", id: "Pemimpin Industri", th: "ผู้นำอุตสาหกรรม", vi: "Các nhà lãnh đạo ngành", tr: "Sektör Liderleri" },
    heading3: { en: "And Institutions", ko: "지원을 받습니다", ar: "والمؤسسات", ru: "И институций", zh: "与机构", es: "E instituciones", id: "Dan Institusi", th: "และสถาบัน", vi: "Và các tổ chức", tr: "Ve Kurumlar" },
    description: {
      en: "Trusted by leading financial institutions and technology partners worldwide.",
      ko: "전 세계 선도적인 금융 기관과 기술 파트너들의 신뢰를 받고 있습니다.",
      ar: "موثوق به من قبل المؤسسات المالية الرائدة وشركاء التكنولوجيا في جميع أنحاء العالم.",
      ru: "Нам доверяют ведущие финансовые институты и технологические партнёры по всему миру.",
      zh: "受到全球领先金融机构和技术合作伙伴的信赖。",
      es: "Con la confianza de instituciones financieras líderes y socios tecnológicos en todo el mundo.",
      id: "Dipercaya oleh institusi keuangan terkemuka dan mitra teknologi di seluruh dunia.",
      th: "ได้รับความไว้วางใจจากสถาบันการเงินชั้นนำและพันธมิตรเทคโนโลยีทั่วโลก",
      vi: "Được tin tưởng bởi các tổ chức tài chính hàng đầu và đối tác công nghệ trên toàn thế giới.",
      tr: "Dünya çapında önde gelen finans kurumları ve teknoloji ortakları tarafından güvenilmektedir.",
    },
    viewMore: { en: "View More +", ko: "더 보기 +", ar: "عرض المزيد +", ru: "Показать ещё +", zh: "查看更多 +", es: "Ver más +", id: "Lihat Lebih +", th: "ดูเพิ่มเติม +", vi: "Xem thêm +", tr: "Daha Fazla +" },
  },

  // ═══════════════════════════════════════════════════════════════
  // MARKETS SECTION (02)
  // ═══════════════════════════════════════════════════════════════
  markets: {
    sectionLabel: { en: "02 / Markets", ko: "02 / 종목", ar: "02 / الأسواق", ru: "02 / Рынки", zh: "02 / 市场", es: "02 / Mercados", id: "02 / Pasar", th: "02 / ตลาด", vi: "02 / Thị trường", tr: "02 / Piyasalar" },
    heading: { en: "SELECTED MARKETS", ko: "운용 가능 종목", ar: "الأسواق المختارة", ru: "ИЗБРАННЫЕ РЫНКИ", zh: "精选市场", es: "MERCADOS SELECCIONADOS", id: "PASAR PILIHAN", th: "ตลาดที่เลือก", vi: "THỊ TRƯỜNG ĐƯỢC CHỌN", tr: "SEÇİLİ PİYASALAR" },
    commodities: { en: "Commodities", ko: "원자재", ar: "السلع", ru: "Сырьё", zh: "大宗商品", es: "Materias primas", id: "Komoditas", th: "สินค้าโภคภัณฑ์", vi: "Hàng hóa", tr: "Emtialar" },
    crypto: { en: "Crypto", ko: "암호화폐", ar: "العملات المشفرة", ru: "Крипто", zh: "加密货币", es: "Cripto", id: "Kripto", th: "คริปโต", vi: "Tiền điện tử", tr: "Kripto" },
    index: { en: "Index", ko: "지수", ar: "المؤشر", ru: "Индекс", zh: "指数", es: "Índice", id: "Indeks", th: "ดัชนี", vi: "Chỉ số", tr: "Endeks" },
    nasdaq: { en: "Nasdaq", ko: "나스닥", ar: "ناسداك", ru: "Nasdaq", zh: "纳斯达克", es: "Nasdaq", id: "Nasdaq", th: "นาสแด็ก", vi: "Nasdaq", tr: "Nasdaq" },
  },

  // ═══════════════════════════════════════════════════════════════
  // STRATEGY SECTION (03)
  // ═══════════════════════════════════════��═══════════════════════
  strategy: {
    sectionLabel: { en: "03 / STRATEGY", ko: "03 / 전략", ar: "03 / الاستراتيجية", ru: "03 / СТРАТЕГИЯ", zh: "03 / 策略", es: "03 / ESTRATEGIA", id: "03 / STRATEGI", th: "03 / กลยุทธ์", vi: "03 / CHIẾN LƯỢC", tr: "03 / STRATEJİ" },
    heading: { en: "Strategy Engine", ko: "구동 알고리즘", ar: "محرك الاستراتيجية", ru: "Движок стратегии", zh: "策略引擎", es: "Motor de estrategia", id: "Mesin Strategi", th: "เครื่องยนต์กลยุทธ์", vi: "Công cụ chiến lược", tr: "Strateji Motoru" },
    description: {
      en: "Built for rotation. Designed to survive drawdowns.",
      ko: "순환매 로직에 의해 설계되었습니다. 손실을 최소화하며 안정적으로 수익을 쌓아나갈 수 있도록 만들어졌습니다.",
      ar: "مصمم للتدوير. صُمم للصمود أمام التراجعات.",
      ru: "Создан для ротации. Спроектирован для выживания при просадках.",
      zh: "专为轮换而构建。旨在抵御回撤。",
      es: "Construido para rotación. Diseñado para sobrevivir a las caídas.",
      id: "Dibangun untuk rotasi. Dirancang untuk bertahan dari drawdown.",
      th: "สร้างขึ้นเพื่อการหมุนเวียน ออกแบบมาเพื่อรอดจากการลดลง",
      vi: "Được xây dựng cho luân chuyển. Được thiết kế để tồn tại qua các đợt sụt giảm.",
      tr: "Rotasyon için inşa edildi. Düşüşlere dayanmak için tasarlandı.",
    },
    engineModules: { en: "Engine Modules", ko: "엔진 모듈", ar: "وحدات المحرك", ru: "Модули движка", zh: "引擎模块", es: "Módulos del motor", id: "Modul Mesin", th: "โมดูลเครื่องยนต์", vi: "Các module động cơ", tr: "Motor Modülleri" },
    preflightCheck: { en: "Pre-flight Check", ko: "사전 점검", ar: "فحص ما قبل الإقلاع", ru: "Предполётная проверка", zh: "起飞前检查", es: "Verificación previa", id: "Pemeriksaan Pra-penerbangan", th: "ตรวจสอบก่อนบิน", vi: "Kiểm tra trước khi bay", tr: "Uçuş Öncesi Kontrol" },
    learnMore: { en: "Learn More +", ko: "더 알아보기 +", ar: "اعرف المزيد +", ru: "Узнать больше +", zh: "了解更多 +", es: "Saber más +", id: "Pelajari Lebih +", th: "เรียนรู้เพิ่มเติม +", vi: "Tìm hiểu thêm +", tr: "Daha Fazla +" },
    strategyConfig: { en: "Strategy Config", ko: "전략 설정", ar: "إعدادات الاستراتيجية", ru: "Настройка стратегии", zh: "策略配置", es: "Configuración de estrategia", id: "Konfigurasi Strategi", th: "การตั้งค่ากลยุทธ์", vi: "Cấu hình chiến lược", tr: "Strateji Yapılandırması" },
    // Engine module names
    rotationEngine: { en: "Rotation Engine", ko: "로테이션 엔진", ar: "محرك الدوران", ru: "Движок ротации", zh: "轮换引擎", es: "Motor de rotación", id: "Mesin Rotasi", th: "เครื่องยนต์หมุนเวียน", vi: "Động cơ luân chuyển", tr: "Rotasyon Motoru" },
    bollingerTiming: { en: "Bollinger Timing", ko: "볼린저 타이밍", ar: "توقيت بولينجر", ru: "Тайминг Боллинджера", zh: "布林带时机", es: "Temporización Bollinger", id: "Waktu Bollinger", th: "จังหวะ Bollinger", vi: "Thời điểm Bollinger", tr: "Bollinger Zamanlaması" },
    fibonacciGrid: { en: "Fibonacci Grid", ko: "피보���치 그리드", ar: "شبكة فيبوناتشي", ru: "Сетка Фибоначчи", zh: "斐波那契网格", es: "Cuadrícula Fibonacci", id: "Grid Fibonacci", th: "ตาราง Fibonacci", vi: "Lưới Fibonacci", tr: "Fibonacci Izgarası" },
    riskGuard: { en: "Risk Guard", ko: "리스크 가드", ar: "حماية المخاطر", ru: "Защита от рисков", zh: "风险保护", es: "Protección de riesgo", id: "Penjaga Risiko", th: "การ์ดความเสี่ยง", vi: "Bảo vệ rủi ro", tr: "Risk Koruması" },
    active: { en: "ACTIVE", ko: "활성화", ar: "نشط", ru: "АКТИВЕН", zh: "已激活", es: "ACTIVO", id: "AKTIF", th: "ใช้งาน", vi: "HOẠT ĐỘNG", tr: "AKTİF" },
    // Checklist items
    volatilityScan: { en: "Volatility Scan", ko: "변동성 스캔", ar: "مسح التقلبات", ru: "Сканирование волатильности", zh: "波动率扫描", es: "Escaneo de volatilidad", id: "Pemindaian Volatilitas", th: "สแกนความผันผวน", vi: "Quét biến động", tr: "Volatilite Taraması" },
    autoEntryMode: { en: "Auto Entry Mode", ko: "자동 진입 모드", ar: "وضع الدخول التلقائي", ru: "Режим авто-входа", zh: "自动入场模式", es: "Modo de entrada automática", id: "Mode Masuk Otomatis", th: "โหมดเข้าอัตโนมัติ", vi: "Chế độ vào lệnh tự động", tr: "Otomatik Giriş Modu" },
    positionResetLogic: { en: "Position Reset Logic", ko: "포지션 리셋 로직", ar: "منطق إعادة تعيين المركز", ru: "Логика сброса позиции", zh: "仓位重置逻辑", es: "Lógica de reinicio de posición", id: "Logika Reset Posisi", th: "ตรรกะรีเซ็ตตำแหน่ง", vi: "Logic đặt lại vị thế", tr: "Pozisyon Sıfırlama Mantığı" },
    maxLossLimit: { en: "Max Loss Limit", ko: "최대 손실 한도", ar: "حد الخسارة الأقصى", ru: "Лимит макс. убытка", zh: "最大亏损限制", es: "Límite de pérdida máxima", id: "Batas Kerugian Maksimum", th: "ขีดจำกัดการขาดทุนสูงสุด", vi: "Giới hạn thua lỗ tối đa", tr: "Maksimum Kayıp Limiti" },
    longShortDirection: { en: "Long / Short Direction", ko: "롱/숏 방향", ar: "اتجاه طويل/قصير", ru: "Направление Long/Short", zh: "多空方向", es: "Dirección Long / Short", id: "Arah Long / Short", th: "ทิศทาง Long / Short", vi: "Hướng Long / Short", tr: "Long / Short Yönü" },
  },

  // ═══════════════════════════════════════════════════════════════
  // DEMO SECTION (04)
  // ═══════════════════════════════════════════════════════════════
  demo: {
    sectionLabel: { en: "04 / DEMO", ko: "04 / 데모", ar: "04 / عرض توضيحي", ru: "04 / ДЕМО", zh: "04 / 演示", es: "04 / DEMO", id: "04 / DEMO", th: "04 / สาธิต", vi: "04 / DEMO", tr: "04 / DEMO" },
    heading: {
      en: "SEE HOW BUYLOW AI\nSETS YOU UP\nIN MINUTES",
      ko: "BUYLOW AI 데모 기능을 이용해\n실제로 어떻게 구동되는지\n확인해보세요.",
      ar: "شاهد كيف يقوم BUYLOW AI\nبإعدادك\nفي دقائق",
      ru: "УЗНАЙТЕ, КАК BUYLOW AI\nНАСТРОИТ ВАС\nЗА МИНУТЫ",
      zh: "了解BUYLOW AI\n如何在几分钟内\n为您完成设置",
      es: "VEA CÓMO BUYLOW AI\nLE CONFIGURA\nEN MINUTOS",
      id: "LIHAT BAGAIMANA BUYLOW AI\nMENGATUR ANDA\nDALAM HITUNGAN MENIT",
      th: "ดูว่า BUYLOW AI\nตั้งค่าให้คุณอย่างไร\nในไม่กี่นาที",
      vi: "XEM CÁCH BUYLOW AI\nTHIẾT LẬP CHO BẠN\nTRONG VÀI PHÚT",
      tr: "BUYLOW AI'NIN SİZİ\nDAKİKALAR İÇİNDE\nNASIL HAZIRLAYACAĞINI GÖRÜN",
    },
    description: {
      en: "Tap-only onboarding. No typing. Clear settings.",
      ko: "탭만으로 온보딩. 타이핑 불필요. 명확한 설정.",
      ar: "إعداد بنقرة واحدة. بدون كتابة. إعدادات واضحة.",
      ru: "Онбординг одним касанием. Без ввода текста. Понятные настройки.",
      zh: "仅需点击即可完成注册。无需输入。设置清晰明了。",
      es: "Incorporación solo con toques. Sin escribir. Configuración clara.",
      id: "Onboarding hanya dengan ketuk. Tanpa mengetik. Pengaturan jelas.",
      th: "การเริ่มต้นใช้งานแบบแตะเท่านั้น ไม่ต้องพิมพ์ การตั้งค่าชัดเจน",
      vi: "Khởi động chỉ cần nhấn. Không cần gõ. Cài đặt rõ ràng.",
      tr: "Sadece dokunarak başlangıç. Yazma yok. Net ayarlar.",
    },
    checkTapBased: { en: "Tap-based setup flow", ko: "탭 기반 설정 플로우", ar: "تدفق الإعداد بالنقر", ru: "Настройка касанием", zh: "点击式设置流程", es: "Flujo de configuración por toques", id: "Alur pengaturan berbasis ketuk", th: "ขั้นตอนการตั้งค่าแบบแตะ", vi: "Luồng thiết lập dựa trên nhấn", tr: "Dokunma tabanlı kurulum akışı" },
    checkPresets: { en: "Strategy presets (Risk / Balanced / Safe)", ko: "전략 프리셋 (리스크 / 밸런스 / 안전)", ar: "إعدادات الاستراتيجية المسبقة (مخاطر / متوازن / آمن)", ru: "Пресеты стратегий (Риск / Баланс / Безопасный)", zh: "策略预设（风险/平衡/安全）", es: "Preajustes de estrategia (Riesgo / Equilibrado / Seguro)", id: "Preset strategi (Risiko / Seimbang / Aman)", th: "พรีเซ็ตกลยุทธ์ (เสี่ยง / สมดุล / ปลอดภัย)", vi: "Thiết lập sẵn chiến lược (Rủi ro / Cân bằng / An toàn)", tr: "Strateji önayarları (Risk / Dengeli / Güvenli)" },
    checkCompound: { en: "Compound simulation preview", ko: "복리 시뮬레이션 미리보기", ar: "معاينة محاكاة التراكم", ru: "Предпросмотр симуляции сложного процента", zh: "复利模拟预览", es: "Vista previa de simulación de interés compuesto", id: "Pratinjau simulasi bunga majemuk", th: "ตัวอย่างการจำลองดอกเบี้ยทบต้น", vi: "Xem trước mô phỏng lãi kép", tr: "Bileşik simülasyon önizlemesi" },
    paragraph1: {
      en: "BuyLow AI walks you through every trading decision with a simple question-and-select flow. Pick your target, choose a style, and the system handles the rest.",
      ko: "BuyLow AI는 간단한 질문 및 선택 흐름으로 모든 거래 결정을 안내합니다. 목표를 선택하고 스타일을 선택하면 시스템이 나머지를 처리합니다.",
      ar: "يرشدك BuyLow AI خلال كل قرار تداول من خلال تدفق بسيط للأسئلة والاختيار. اختر هدفك، واختر أسلوبك، والنظام يتولى الباقي.",
      ru: "BuyLow AI проведёт вас через каждое торговое решение с помощью простого потока вопросов и выбора. Выберите цель, выберите стиль, и система сделает остальное.",
      zh: "BuyLow AI 通过简单的问答选择流程引导您做出每一个交易决策。选择您的目标，选择风格，系统会处理其余的一切。",
      es: "BuyLow AI te guía a través de cada decisión de trading con un flujo simple de preguntas y selección. Elige tu objetivo, elige un estilo, y el sistema se encarga del resto.",
      id: "BuyLow AI memandu Anda melalui setiap keputusan trading dengan alur tanya-pilih sederhana. Pilih target Anda, pilih gaya, dan sistem menangani sisanya.",
      th: "BuyLow AI แนะนำคุณผ่านทุกการตัดสินใจการซื้อขายด้วยขั้นตอนถาม-เลือกที่ง่าย เลือกเป้าหมาย เลือกสไตล์ และระบบจัดการส่วนที่เหลือ",
      vi: "BuyLow AI hướng dẫn bạn qua mọi quyết định giao dịch với luồng hỏi-chọn đơn giản. Chọn mục tiêu, chọn phong cách, và hệ thống xử lý phần còn lại.",
      tr: "BuyLow AI, basit bir soru-seç akışıyla her işlem kararında size rehberlik eder. Hedefinizi seçin, bir stil seçin ve sistem gerisini halleder.",
    },
    paragraph2: {
      en: "Even first-time users can complete the full setup by tapping buttons only. No manual input, no complex forms.",
      ko: "처음 사용하는 사용자도 버튼 탭만으로 전체 설정을 완료할 수 있습니다. 수동 입력이나 복잡한 양식이 필요 없습니다.",
      ar: "حتى المستخدمون لأول مرة يمكنهم إكمال الإعداد الكامل بالنقر على الأزرار فقط. لا إدخال يدوي، ولا نماذج معقدة.",
      ru: "Даже новички могут завершить пол��ую настройку, нажимая только кнопки. Без ручного ввода, без сложных форм.",
      zh: "即使是首次使用的用户也可以仅通过点击按钮完成全部设置。无需手动输入，无需复杂表单。",
      es: "Incluso los usuarios primerizos pueden completar la configuración completa tocando solo botones. Sin entrada manual, sin formularios complejos.",
      id: "Bahkan pengguna pertama kali dapat menyelesaikan pengaturan lengkap hanya dengan mengetuk tombol. Tanpa input manual, tanpa formulir kompleks.",
      th: "แม้แต่ผู้ใช้ครั้งแรกก็สามารถตั้งค่าทั้งหมดได้ด้วยการแตะปุ่มเท่านั้น ไม่ต้องป้อนข้อมูลด้วยตนเอง ไม่มีแบบฟอร์มที่ซับซ้อน",
      vi: "Ngay cả người dùng lần đầu cũng có thể hoàn thành toàn bộ thiết lập chỉ bằng cách nhấn nút. Không cần nhập thủ công, không có biểu mẫu phức tạp.",
      tr: "İlk kez kullananlar bile sadece düğmelere dokunarak tam kurulumu tamamlayabilir. Manuel giriş yok, karmaşık formlar yok.",
    },
    disclaimer: {
      en: "The demo UI is for illustration only and does not guarantee actual trading returns.",
      ko: "데모 UI는 설명용이며 실제 거래 수익을 보장하지 않습니다.",
      ar: "واجهة العرض التوضيحي للتوضيح فقط ولا تضمن عوائد التداول الفعلية.",
      ru: "Демо-интерфейс предназначен только для иллюстрации и не гарантирует фактическую торговую прибыль.",
      zh: "演示界面仅供说明用途，不保证实际交易收益。",
      es: "La interfaz de demostración es solo ilustrativa y no garantiza rendimientos reales de trading.",
      id: "UI demo hanya untuk ilustrasi dan tidak menjamin pengembalian trading aktual.",
      th: "UI สาธิตมีไว้เพื่อการแสดงเท่านั้นและไม่รับประกันผลตอบแทนการซื้อขายจริง",
      vi: "Giao diện demo chỉ để minh họa và không đảm bảo lợi nhuận giao dịch thực tế.",
      tr: "Demo arayüzü yalnızca gösterim amaçlıdır ve gerçek işlem getirilerini garanti etmez.",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // COLOPHON (Footer CTA)
  // ═══════════════════════════════════════════════════════════════
  colophon: {
    heading: { en: "Trading made effortless", ko: "지금 시작하기", ar: "تداول بلا جهد", ru: "Трейдинг без усилий", zh: "轻松交易", es: "Trading sin esfuerzo", id: "Trading tanpa usaha", th: "การซื้อขายที่ง่ายดาย", vi: "Giao dịch dễ dàng", tr: "Zahmetsiz işlem" },
    description: {
      en: "Automated AI trading for anyone.\n24/7 rotation-based strategies, running securely on our own render servers.",
      ko: "누구나 할 수 있는 자동 AI 트레이딩.\n24시간 로테이션 기반 전략, 자체 렌더 서버에서 안전하게 실행됩니다.",
      ar: "تداول آلي بالذكاء الاصطناعي للجميع.\nاستراتيجيات قائمة على التدوير على مدار الساعة، تعمل بأمان على خوادمنا الخاصة.",
      ru: "Автоматизированный AI-трейдинг для всех.\nСтратегии ротации 24/7, безопасно работающие на наших серверах.",
      zh: "面向所有人的自动化AI交易。\n24/7轮换策略，安全运行在我们自己的渲染服务器上。",
      es: "Trading automatizado con IA para todos.\nEstrategias basadas en rotación 24/7, ejecutándose de forma segura en nuestros propios servidores.",
      id: "Trading AI otomatis untuk siapa saja.\nStrategi berbasis rotasi 24/7, berjalan aman di server render kami sendiri.",
      th: "การซื้อขาย AI อัตโนมัติสำหรับทุกคน\nกลยุทธ์แบบหมุนเวียน 24/7 ทำงานอย่างปลอดภัยบนเซิร์ฟเวอร์ของเรา",
      vi: "Giao dịch AI tự động cho mọi người.\nChiến lược dựa trên luân chuyển 24/7, chạy an toàn trên máy chủ riêng của chúng tôi.",
      tr: "Herkes için otomatik AI işlemi.\n7/24 rotasyon tabanlı stratejiler, kendi render sunucularımızda güvenli bir şekilde çalışır.",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // SERVER GUIDE PAGE
  // ═══════════════════════════════════════════════════════════════
  server: {
    selectExchange: { en: "Select Exchange", ko: "거래소 선택", ar: "اختر البورصة", ru: "Выберите биржу", zh: "选择交易所", es: "Seleccionar Exchange", id: "Pilih Bursa", th: "เลือกตลาด", vi: "Chọn sàn giao dịch", tr: "Borsa Seçin" },
    selectAsset: { en: "Select Asset", ko: "자산 선택", ar: "اختر الأصل", ru: "Выберите актив", zh: "选择资产", es: "Seleccionar activo", id: "Pilih Aset", th: "เลือกสินทรัพย์", vi: "Chọn tài sản", tr: "Varlık Seçin" },
    chooseExchangeAsset: { en: "Choose your exchange and asset type", ko: "거래소와 자산 유형을 선택하세요", ar: "ا��تر البورصة ونوع الأصل", ru: "Выберите биржу и тип актива", zh: "选择您的交易所和资产类型", es: "Elige tu exchange y tipo de activo", id: "Pilih bursa dan jenis aset Anda", th: "เลือกตลาดและประเภทสินทรัพย์ของคุณ", vi: "Chọn sàn và loại tài sản của bạn", tr: "Borsanızı ve varlık türünüzü seçin" },
    previous: { en: "Previous", ko: "이전", ar: "السابق", ru: "Назад", zh: "上一步", es: "Anterior", id: "Sebelumnya", th: "ก่อนหน้า", vi: "Trước", tr: "Önceki" },
    next: { en: "Next", ko: "다음", ar: "التالي", ru: "Далее", zh: "下一步", es: "Siguiente", id: "Berikutnya", th: "ถัดไป", vi: "Tiếp theo", tr: "Sonraki" },
    btcTrading: { en: "Bitcoin Trading", ko: "비트코인 트레이딩", ar: "تداول البيتكوين", ru: "Торговля Bitcoin", zh: "比特币交易", es: "Trading de Bitcoin", id: "Trading Bitcoin", th: "การซื้อขาย Bitcoin", vi: "Giao dịch Bitcoin", tr: "Bitcoin İşlemi" },
    goldTrading: { en: "Gold Trading", ko: "골드 트레이딩", ar: "تداول الذهب", ru: "Торговля золотом", zh: "黄金交易", es: "Trading de Oro", id: "Trading Emas", th: "การซื้อขายทองคำ", vi: "Giao dịch Vàng", tr: "Altın İşlemi" },
    silverTrading: { en: "Silver Trading", ko: "실버 트레이딩", ar: "تداول الفضة", ru: "Торговля серебром", zh: "白银交易", es: "Trading de Plata", id: "Trading Perak", th: "การซื้อขายเงิน", vi: "Giao dịch Bạc", tr: "Gümüş İşlemi" },
    teslaTrading: { en: "Tesla Trading", ko: "테슬라 트레이딩", ar: "تداول تسلا", ru: "Торговля Tesla", zh: "特斯拉交易", es: "Trading de Tesla", id: "Trading Tesla", th: "การซื้อขาย Tesla", vi: "Giao dịch Tesla", tr: "Tesla İşlemi" },
    recommended: { en: "Recommended", ko: "추천", ar: "موصى به", ru: "Рекомендуется", zh: "推荐", es: "Recomendado", id: "Direkomendasikan", th: "แนะนำ", vi: "Đề xuất", tr: "Önerilen" },
    step: { en: "Step", ko: "단계", ar: "خطوة", ru: "Шаг", zh: "步骤", es: "Paso", id: "Langkah", th: "ขั้นตอน", vi: "Bước", tr: "Adım" },
    back: { en: "Back", ko: "뒤로", ar: "رجوع", ru: "Назад", zh: "返回", es: "Atrás", id: "Kembali", th: "กลับ", vi: "Quay lại", tr: "Geri" },
    pleaseSelectExchange: { en: "Please select an exchange first.", ko: "먼저 거래소를 선택해주세요.", ar: "الرجاء اختيار البورصة أولاً.", ru: "Сначала выберите биржу.", zh: "请先选择交易所。", es: "Por favor seleccione un exchange primero.", id: "Silakan pilih bursa terlebih dahulu.", th: "กรุณาเลือกตลาดก่อน", vi: "Vui lòng chọn sàn giao dịch trước.", tr: "Lütfen önce bir borsa seçin." },
    goToExchangeSelection: { en: "Go to Exchange Selection", ko: "거래소 선택으로", ar: "اذهب إلى اختيار البورصة", ru: "Перейти к выбору биржи", zh: "前往选择交易所", es: "Ir a selección de Exchange", id: "Ke Pemilihan Bursa", th: "ไปที่การเลือกตลาด", vi: "Đi đến Chọn sàn giao dịch", tr: "Borsa Seçimine Git" },
  },

  // ═══════════════════════════════════════════════════════════════
  // STRATEGY PAGE UI
  // ═══════════════════════════════════════════════════════════════
  strategyUI: {
    home: { en: "Home", ko: "홈", ar: "الرئيسية", ru: "Главная", zh: "首页", es: "Inicio", id: "Beranda", th: "หน้าแรก", vi: "Trang chủ", tr: "Ana Sayfa" },
    previous: { en: "← Previous", ko: "← 이전", ar: "→ السابق", ru: "← Назад", zh: "← 上一步", es: "← Anterior", id: "← Sebelumnya", th: "← ก่อนหน้า", vi: "← Trước", tr: "← Önceki" },
    next: { en: "Next →", ko: "다음 →", ar: "التالي ←", ru: "Далее →", zh: "下一步 →", es: "Siguiente →", id: "Berikutnya →", th: "ถัดไป →", vi: "Tiếp theo →", tr: "Sonraki →" },
    mission: { en: "Mission", ko: "미션", ar: "المهمة", ru: "Миссия", zh: "任务", es: "Misión", id: "Misi", th: "ภารกิจ", vi: "Nhiệm vụ", tr: "Görev" },
    completed: { en: "Completed", ko: "완료", ar: "مكتمل", ru: "Завершено", zh: "已完成", es: "Completado", id: "Selesai", th: "เสร็จสิ้น", vi: "Hoàn thành", tr: "Tamamlandı" },
    trainingModules: { en: "Training Modules", ko: "트레이닝 모듈", ar: "وحدات التدريب", ru: "Учебные модули", zh: "训练模块", es: "Módulos de entrenamiento", id: "Modul Pelatihan", th: "โมดูลการฝึก", vi: "Các module đào tạo", tr: "Eğitim Modülleri" },
    missionLog: { en: "Mission Log", ko: "미션 로그", ar: "سجل المهمة", ru: "Журнал миссий", zh: "任务日志", es: "Registro de misión", id: "Log Misi", th: "บันทึกภารกิจ", vi: "Nhật ký nhiệm vụ", tr: "Görev Günlüğü" },
    // E-Book Completion Popup
    ebookPopupTitle: { 
      en: "Want to Learn More?", 
      ko: "더 자세하게 학습하시겠습니까?", 
      ar: "هل تريد معرفة المزيد؟", 
      ru: "Хотите узнать больше?", 
      zh: "想了解更多吗？", 
      es: "¿Quiere aprender más?", 
      id: "Ingin Belajar Lebih Lanjut?", 
      th: "ต้องการเรียนรู้เพิ่มเติมหรือไม่?", 
      vi: "Muốn tìm hiểu thêm?", 
      tr: "Daha Fazla Öğrenmek İster misiniz?" 
    },
    ebookPopupSubtitle: { 
      en: "E-Book available to learn the strategy logic in detail", 
      ko: "E-Book으로 전략 로직을 더 깊게 확인할 수 있습니다", 
      ar: "الكتاب الإلكتروني متاح لتعلم منطق الاستراتيجية بالتفصيل", 
      ru: "E-Book доступен для детального изучения логики стратегии", 
      zh: "可通过E-Book详细学习策略逻辑", 
      es: "E-Book disponible para aprender la lógica de estrategia en detalle", 
      id: "E-Book tersedia untuk mempelajari logika strategi secara detail", 
      th: "E-Book พร้อมให้เรียนรู้ตรรกะกลยุทธ์โดยละเอียด", 
      vi: "E-Book có sẵn để tìm hiểu chi tiết logic chiến lược", 
      tr: "Strateji mantığını detaylı öğrenmek için E-Kitap mevcut" 
    },
    ebookPopupDesc: { 
      en: "You have reviewed the core structure.\n\nIf you want to study more in depth, download the E-Book to learn the strategy logic and settings structure more precisely.", 
      ko: "지금까지 핵심 구조는 확인하셨습니다.\n\n더 자세하게 공부하고 싶다면 E-Book을 다운로드해서 전략 로직과 설정 구조를 더 정확하게 학습해보세요.", 
      ar: "لقد راجعت الهيكل الأساسي.\n\nإذا كنت تريد الدراسة بمزيد من العمق، قم بتنزيل الكتاب الإلكتروني لتعلم منطق الاستراتيجية وهيكل الإعدادات بدقة أكبر.", 
      ru: "Вы изучили основную структуру.\n\nЕсли хотите изучить более подробно, скачайте E-Book, чтобы точнее понять логику стратегии и структуру настроек.", 
      zh: "您已经了解了核心结构。\n\n如果想更深入学习，请下载E-Book以更准确地学习策略逻辑和设置结构。", 
      es: "Ha revisado la estructura principal.\n\nSi desea estudiar más a fondo, descargue el E-Book para aprender la lógica de estrategia y la estructura de configuración con más precisión.", 
      id: "Anda telah meninjau struktur inti.\n\nJika ingin mempelajari lebih dalam, unduh E-Book untuk mempelajari logika strategi dan struktur pengaturan dengan lebih tepat.", 
      th: "คุณได้ตรวจสอบโครงสร้างหลักแล้ว\n\nหากต้องการศึกษาเพิ่มเติม ดาวน์โหลด E-Book เพื่อเรียนรู้ตรรกะกลยุทธ์และโครงสร้างการตั้งค่าอย่างแม่นยำยิ่งขึ้น", 
      vi: "Bạn đã xem xét cấu trúc cốt lõi.\n\nNếu muốn nghiên cứu sâu hơn, hãy tải E-Book để tìm hiểu chính xác hơn về logic chiến lược và cấu trúc cài đặt.", 
      tr: "Temel yapıyı incelediniz.\n\nDaha derinlemesine çalışmak istiyorsanız, strateji mantığını ve ayar yapısını daha kesin öğrenmek için E-Kitap'ı indirin." 
    },
    ebookDownloadBtn: { 
      en: "Download E-Book", 
      ko: "E-Book 다운로드", 
      ar: "تحميل الكتاب الإلكتروني", 
      ru: "Скачать E-Book", 
      zh: "下载E-Book", 
      es: "Descargar E-Book", 
      id: "Unduh E-Book", 
      th: "ดาวน์โหลด E-Book", 
      vi: "Tải xuống E-Book", 
      tr: "E-Kitap İndir" 
    },
    ebookGoToLanding: { 
      en: "Start Now", 
      ko: "지금 시작하기", 
      ar: "ابدأ الآن", 
      ru: "Начать сейчас", 
      zh: "立即开始", 
      es: "Comenzar ahora", 
      id: "Mulai Sekarang", 
      th: "เริ่มตอนนี้", 
      vi: "Bắt đầu ngay", 
      tr: "Şimdi Başla" 
    },
    // E-Book Entry Popup (step=1)
    ebookEntryPopupTitle: { 
      en: "Start with the Full Strategy Guide?", 
      ko: "전체 전략 가이드로 시작할까요?", 
      ar: "هل تريد البدء بدليل الاستراتيجية الكامل؟", 
      ru: "Начать с полного руководства по стратегии?", 
      zh: "从完整策略指南开始？", 
      es: "¿Comenzar con la guía de estrategia completa?", 
      id: "Mulai dengan Panduan Strategi Lengkap?", 
      th: "เริ่มต้นด้วยคู่มือกลยุทธ์ฉบับเต็ม?", 
      vi: "Bắt đầu với hướng dẫn chiến lược đầy đủ?", 
      tr: "Tam Strateji Rehberiyle Başla?" 
    },
    ebookEntryPopupSubtitle: { 
      en: "Choose how you want to learn the strategy", 
      ko: "전략 학습 방법을 선택하세요", 
      ar: "اختر كيف تريد تعلم الاستراتيجية", 
      ru: "Выберите, как вы хотите изучить стратегию", 
      zh: "选择您想要学习策略的方式", 
      es: "Elige cómo quieres aprender la estrategia", 
      id: "Pilih cara Anda ingin mempelajari strategi", 
      th: "เลือกวิธีที่คุณต้องการเรียนรู้กลยุทธ์", 
      vi: "Chọn cách bạn muốn học chiến lược", 
      tr: "Stratejiyi nasıl öğrenmek istediğinizi seçin" 
    },
    ebookEntryPopupDesc: { 
      en: "You can explore the strategy step-by-step here,\nor download the E-Book to understand\nthe full trading logic and settings in detail.", 
      ko: "여기에서 단계별로 전략을 탐색하거나,\nE-Book을 다운로드하여 전체 트레이딩 로직과\n설정을 상세하게 이해할 수 있습니다.", 
      ar: "يمكنك استكشاف الاستراتيجية خطوة بخطوة هنا،\nأو تنزيل الكتاب الإلكتروني لفهم\nمنطق التداول الكامل والإعدادات بالتفصيل.", 
      ru: "Вы можете изучить стратегию пошагово здесь,\nили скачать E-Book, чтобы понять\nполную логику торговли и настройки в деталях.", 
      zh: "您可以在此逐步探索策略，\n或下载E-Book以详细了解\n完整的交易逻辑和设置。", 
      es: "Puede explorar la estrategia paso a paso aquí,\no descargar el E-Book para comprender\nla lógica de trading completa y la configuración en detalle.", 
      id: "Anda dapat menjelajahi strategi langkah demi langkah di sini,\natau unduh E-Book untuk memahami\nlogika trading lengkap dan pengaturan secara detail.", 
      th: "คุณสามารถสำรวจกลยุทธ์ทีละขั้นตอนที่นี่\nหรือดาวน์โหลด E-Book เพื่อทำความเข้าใจ\nตรรกะการเทรดและการตั้งค่าทั้งหมดโดยละเอียด", 
      vi: "Bạn có thể khám phá chiến lược từng bước ở đây,\nhoặc tải E-Book để hiểu\nlogic giao dịch đầy đủ và cài đặt chi tiết.", 
      tr: "Stratejiyi burada adım adım keşfedebilir,\nveya E-Kitap'ı indirerek tüm trading mantığını\nve ayarlarını detaylı öğrenebilirsiniz." 
    },
    ebookContinueStrategy: { 
      en: "Continue Strategy", 
      ko: "전략 계속 보기", 
      ar: "متابعة الاستراتيجية", 
      ru: "Продолжить стратегию", 
      zh: "继续查看策略", 
      es: "Continuar estrategia", 
      id: "Lanjutkan Strategi", 
      th: "ดำเนินการกลยุทธ์ต่อ", 
      vi: "Tiếp tục chiến lược", 
      tr: "Stratejiye Devam Et" 
    },
    // E-Book Format Selection
    ebookFormatTitle: { 
      en: "How would you like to access the E-Book?", 
      ko: "전자책을 어떻게 이용하시겠습니까?", 
      ar: "كيف تريد الوصول إلى الكتاب الإلكتروني؟", 
      ru: "Как вы хотите получить доступ к E-Book?", 
      zh: "您想如何访问电子书？", 
      es: "¿Cómo le gustaría acceder al E-Book?", 
      id: "Bagaimana Anda ingin mengakses E-Book?", 
      th: "คุณต้องการเข้าถึง E-Book อย่างไร?", 
      vi: "Bạn muốn truy cập E-Book như thế nào?", 
      tr: "E-Kitap'a nasıl erişmek istersiniz?" 
    },
    ebookFormatPdf: { 
      en: "Download PDF", 
      ko: "PDF로 다운로드", 
      ar: "تحميل PDF", 
      ru: "Скачать PDF", 
      zh: "下载PDF", 
      es: "Descargar PDF", 
      id: "Unduh PDF", 
      th: "ดาวน์โหลด PDF", 
      vi: "Tải xuống PDF", 
      tr: "PDF İndir" 
    },
    ebookFormatPdfDesc: { 
      en: "Save offline • Keep as file • Instant download", 
      ko: "오프라인 저장 • 파일로 보관 • 바로 다운로드", 
      ar: "حفظ دون اتصال • احتفظ كملف • تنزيل فوري", 
      ru: "Сохранить офлайн • Хранить как файл • Мгновенная загрузка", 
      zh: "离线保存 • 文件保管 • 即时下载", 
      es: "Guardar sin conexión • Guardar como archivo • Descarga instantánea", 
      id: "Simpan offline • Simpan sebagai file • Unduhan instan", 
      th: "บันทึกออฟไลน์ • เก็บเป็นไฟล์ • ดาวน์โหลดทันที", 
      vi: "Lưu ngoại tuyến • Giữ làm tệp • Tải xuống ngay", 
      tr: "Çevrimdışı kaydet • Dosya olarak sakla • Anında indir" 
    },
    ebookFormatWeb: { 
      en: "Read on Web", 
      ko: "웹에서 바로 읽기", 
      ar: "اقرأ على الويب", 
      ru: "Читать на сайте", 
      zh: "网页在线阅读", 
      es: "Leer en la Web", 
      id: "Baca di Web", 
      th: "อ่านบนเว็บ", 
      vi: "Đọc trên Web", 
      tr: "Web'de Oku" 
    },
    ebookFormatWebDesc: { 
      en: "No install needed • Page-by-page reading • Chapter navigation", 
      ko: "설치 없이 바로 열람 • 페이지별 읽기 • 챕터별 이동", 
      ar: "لا حاجة للتثبيت • قراءة صفحة بصفحة • تنقل بين الفصول", 
      ru: "Без установки • Постраничное чтение • Навигация по главам", 
      zh: "无需安装 • 逐页阅读 • 章节导航", 
      es: "Sin instalación • Lectura página por página • Navegación por capítulos", 
      id: "Tanpa instalasi • Baca halaman demi halaman • Navigasi bab", 
      th: "ไม่ต้องติดตั้ง • อ่านทีละหน้า • นำทางตามบท", 
      vi: "Không cần cài đặt • Đọc từng trang • Điều hướng chương", 
      tr: "Kurulum gerektirmez • Sayfa sayfa okuma • Bölüm navigasyonu" 
    },
    ebookSelectLanguage: { 
      en: "Select your language", 
      ko: "언어를 선택하세요", 
      ar: "اختر لغتك", 
      ru: "Выберите язык", 
      zh: "选择您的语言", 
      es: "Seleccione su idioma", 
      id: "Pilih bahasa Anda", 
      th: "เลือกภาษาของคุณ", 
      vi: "Chọn ngôn ngữ của bạn", 
      tr: "Dilinizi seçin" 
    },
    ebookMoreLangs: { 
      en: "More languages will be available soon", 
      ko: "더 많은 언어가 곧 제공됩니다", 
      ar: "ستتوفر المزيد من اللغات قريباً", 
      ru: "Больше языков скоро будет доступно", 
      zh: "更多语言即将推出", 
      es: "Más idiomas estarán disponibles pronto", 
      id: "Lebih banyak bahasa akan segera tersedia", 
      th: "จะมีภาษาเพิ่มเติมเร็วๆ นี้", 
      vi: "Sẽ có thêm nhiều ngôn ngữ sớm", 
      tr: "Yakında daha fazla dil mevcut olacak" 
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // COMMON UI
  // ═══════════════════════════════════════════════════════════════
  common: {
    comingSoon: { en: "Coming Soon", ko: "곧 출시 예정", ar: "قريباً", ru: "Скоро", zh: "即将推出", es: "Próximamente", id: "Segera Hadir", th: "เร็วๆ นี้", vi: "Sắp ra mắt", tr: "Yakında" },
    online: { en: "Online", ko: "온라인", ar: "متصل", ru: "Онлайн", zh: "在线", es: "En línea", id: "Online", th: "ออนไลน์", vi: "Trực tuyến", tr: "Çevrimiçi" },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROOF PAGE (유도글 랜딩)
  // ═══════════════════════════════════════════════════════════════
  proof: {
    // Navigation
    home: { en: "HOME", ko: "홈", ar: "الرئيسية", ru: "ГЛАВНАЯ", zh: "首页", es: "INICIO", id: "BERANDA", th: "หน้าแรก", vi: "TRANG CHỦ", tr: "ANA SAYFA" },
    back: { en: "Back", ko: "뒤로", ar: "رجوع", ru: "Назад", zh: "返回", es: "Atrás", id: "Kembali", th: "กลับ", vi: "Quay lại", tr: "Geri" },
    
    // Hero Section
    tagline: { en: "AI QUANT TRADING", ko: "AI 퀀트 트레이딩", ar: "التداول الكمي بالذكاء الاصطناعي", ru: "AI КВАНТ ТРЕЙДИНГ", zh: "AI量化交易", es: "TRADING CUANTITATIVO IA", id: "TRADING KUANTITATIF AI", th: "การซื้อขายเชิงปริมาณ AI", vi: "GIAO DỊCH ĐỊNH LƯỢNG AI", tr: "AI KANTITATIF IŞLEM" },
    heroTitle: { en: "I Finally Did It", ko: "와 드디어 제가 해냈습니다", ar: "لقد فعلتها أخيراً", ru: "Наконец-то я сделал это", zh: "我终于做到了", es: "Finalmente lo logré", id: "Akhirnya Saya Berhasil", th: "ในที่สุดฉันก็ทำได้", vi: "Cuối cùng tôi đã làm được", tr: "Sonunda Başardım" },
    heroSubtitle: { 
      en: "September 14 - October 15, 2025: +20,223 USDT (~$20K) profit in one month with AI Quant Trading",
      ko: "2025년 9월 14일 ~ 10월 15일, AI 퀀트 트레이딩으로 한 달간 +20,223 USDT (약 3천만원) 수익 달성",
      ar: "14 سبتمبر - 15 أكتوبر 2025: +20,223 USDT (~20 ألف دولار) ربح في شهر واحد مع التداول الكمي بالذكاء الاصطناعي",
      ru: "14 сентября - 15 октября 2025: +20,223 USDT (~$20K) прибыли за один месяц с AI Квант Трейдингом",
      zh: "2025年9月14日至10月15日：通过AI量化交易一个月盈利+20,223 USDT（约2万美元）",
      es: "14 de septiembre - 15 de octubre de 2025: +20,223 USDT (~$20K) de ganancia en un mes con Trading Cuantitativo IA",
      id: "14 September - 15 Oktober 2025: +20.223 USDT (~$20K) keuntungan dalam satu bulan dengan Trading Kuantitatif AI",
      th: "14 กันยายน - 15 ตุลาคม 2025: +20,223 USDT (~$20K) กำไรในหนึ่งเดือนด้วย AI Quant Trading",
      vi: "14 tháng 9 - 15 tháng 10, 2025: +20.223 USDT (~$20K) lợi nhuận trong một tháng với Giao dịch định lượng AI",
      tr: "14 Eylül - 15 Ekim 2025: AI Kantitatif İşlem ile bir ayda +20.223 USDT (~$20K) kâr"
    },
    
    // Stats
    takeProfits: { en: "Take Profits", ko: "익절 횟수", ar: "جني الأرباح", ru: "Тейк-профитов", zh: "止盈次数", es: "Tomas de ganancia", id: "Ambil Keuntungan", th: "ทำกำไร", vi: "Chốt lời", tr: "Kar Al" },
    stopLosses: { en: "Stop Losses", ko: "손절 횟수", ar: "وقف الخسارة", ru: "Стоп-лоссов", zh: "止损次数", es: "Stop losses", id: "Stop Loss", th: "หยุดขาดทุน", vi: "Cắt lỗ", tr: "Zarar Durdur" },
    winRate: { en: "Win Rate", ko: "승률", ar: "معدل الفوز", ru: "Винрейт", zh: "胜率", es: "Tasa de éxito", id: "Tingkat Kemenangan", th: "อัตราชนะ", vi: "Tỷ lệ thắng", tr: "Kazanma Oranı" },
    totalBuys: { en: "Total Buys", ko: "총 매수 횟수", ar: "إجمالي الشراء", ru: "Всего покупок", zh: "总买入次数", es: "Total de compras", id: "Total Pembelian", th: "การซื้อทั้งหมด", vi: "Tổng số mua", tr: "Toplam Alımlar" },
    
    // Image Captions
    heroCaption: { en: "AI Quant Monthly Trading Results", ko: "AI 퀀트 한 달간 구동 수익 인증", ar: "نتائج التداول الشهرية للذكاء الاصطناعي الكمي", ru: "Ежемесячные результаты AI Квант трейдинга", zh: "AI量化月度交易结果", es: "Resultados mensuales de Trading Cuantitativo IA", id: "Hasil Trading Bulanan AI Quant", th: "ผล��ารซื้อขายรายเดือน AI Quant", vi: "Kết quả giao dịch hàng tháng AI Quant", tr: "AI Quant Aylık İşlem Sonuçları" },
    aiSetupCaption: { en: "AI Configuration", ko: "AI 활용 설정", ar: "إعداد الذكاء الاصطناعي", ru: "Настройка AI", zh: "AI配置", es: "Configuración de IA", id: "Konfigurasi AI", th: "การตั้งค่า AI", vi: "Cấu hình AI", tr: "AI Yapılandırması" },
    pnlCaption: { en: "Daily PNL Records (Bitget)", ko: "일별 PNL 수익 내역 (비트겟)", ar: "سجلات PNL اليومية (Bitget)", ru: "Дневные записи PNL (Bitget)", zh: "每日PNL记录 (Bitget)", es: "Registros diarios de PNL (Bitget)", id: "Catatan PNL Harian (Bitget)", th: "บันทึก PNL รายวัน (Bitget)", vi: "Bản ghi PNL hàng ngày (Bitget)", tr: "Günlük PNL Kayıtları (Bitget)" },
    onewayCaption: { en: "AI Response in One-way Market", ko: "원웨이 상황에서의 AI 대응", ar: "استجابة الذكاء الاصطناعي في سوق أحادي الاتجاه", ru: "Реакция AI на односторонний рынок", zh: "AI在单边行情中的应对", es: "Respuesta de IA en mercado unidireccional", id: "Respons AI di Pasar Satu Arah", th: "การตอบสนองของ AI ในตลาดทางเดียว", vi: "Phản hồi AI trong thị trường một chiều", tr: "Tek Yönlü Piyasada AI Tepkisi" },
    results2026Caption: { en: "2026 Cumulative Profit Status", ko: "2026년 누적 수익 현황", ar: "حالة الأرباح التراكمية 2026", ru: "Накопленная прибыль 2026", zh: "2026年累计收益状况", es: "Estado de ganancias acumuladas 2026", id: "Status Keuntungan Kumulatif 2026", th: "สถานะกำไรสะสม 2026", vi: "Tình trạng lợi nhuận tích lũy 2026", tr: "2026 Kümülatif Kâr Durumu" },
    dubaiCaption: { en: "Dubai Corporate Entity Establishment", ko: "두바이 법인 사업자 개설", ar: "تأسيس كيان شركة في دبي", ru: "Регистрация компании в Дубае", zh: "迪拜公司实体设立", es: "Establecimiento de entidad corporativa en Dubái", id: "Pendirian Entitas Korporat Dubai", th: "การจัดตั้งนิติบุคคลในดูไบ", vi: "Thành lập pháp nhân tại Dubai", tr: "Dubai Kurumsal Varlık Kuruluşu" },
    tradeCaption1: { en: "Rotation Trading History 1", ko: "순환매매 트레이딩 내역 1", ar: "سجل التداول الدوراني 1", ru: "История ротационной торговли 1", zh: "轮换交易记录 1", es: "Historial de trading rotacional 1", id: "Riwayat Trading Rotasi 1", th: "ประวัติการซื้อขายหมุนเวียน 1", vi: "Lịch sử giao dịch luân chuyển 1", tr: "Rotasyon İşlem Geçmişi 1" },
    tradeCaption2: { en: "Rotation Trading History 2", ko: "순환매매 트레이딩 내역 2", ar: "سجل التداول الدوراني 2", ru: "История ротационной торговли 2", zh: "轮换交易记录 2", es: "Historial de trading rotacional 2", id: "Riwayat Trading Rotasi 2", th: "ประวัติการซื้อขายหมุนเวียน 2", vi: "Lịch sử giao dịch luân chuyển 2", tr: "Rotasyon İşlem Geçmişi 2" },
    qqqChartCaption: { en: "Nasdaq 100 (QQQ) Quant Trading Chart", ko: "나스닥 100(QQQ) 퀀트 트레이딩 차트", ar: "مخطط تداول ناسداك 100 (QQQ) الكمي", ru: "График квант-трейдинга Nasdaq 100 (QQQ)", zh: "纳斯达克100(QQQ)量化交易图表", es: "Gráfico de Trading Cuantitativo Nasdaq 100 (QQQ)", id: "Grafik Trading Quant Nasdaq 100 (QQQ)", th: "กราฟการซื้อขาย Quant Nasdaq 100 (QQQ)", vi: "Biểu đồ giao dịch Quant Nasdaq 100 (QQQ)", tr: "Nasdaq 100 (QQQ) Quant İşlem Grafiği" },
    xauChartCaption: { en: "Gold (XAU) Quant Trading Chart", ko: "금(XAU) 퀀트 트레이딩 차트", ar: "مخطط تداول ��لذ��ب (XAU) الكمي", ru: "График квант-трейдинга Золота (XAU)", zh: "黄金(XAU)量化交易图表", es: "Gráfico de Trading Cuantitativo Oro (XAU)", id: "Grafik Trading Quant Emas (XAU)", th: "กราฟการซื้อขาย Quant ทองคำ (XAU)", vi: "Biểu đồ giao dịch Quant Vàng (XAU)", tr: "Altın (XAU) Quant İşlem Grafi��i" },
    nasdaqIndex: { en: "Nasdaq Index", ko: "나스닥 지수", ar: "مؤشر ناسداك", ru: "Индекс Nasdaq", zh: "纳斯达克指数", es: "Índice Nasdaq", id: "Indeks Nasdaq", th: "ดัชนี Nasdaq", vi: "Chỉ số Nasdaq", tr: "Nasdaq Endeksi" },
    nasdaq100Results: { en: "Nasdaq 100 (QQQ) Trading Results", ko: "나스닥 100(QQQ) 트레이딩 결과", ar: "نتائج تداول ناسداك 100 (QQQ)", ru: "Результаты трейдинга Nasdaq 100 (QQQ)", zh: "纳斯达克100(QQQ)交易结果", es: "Resultados de Trading Nasdaq 100 (QQQ)", id: "Hasil Trading Nasdaq 100 (QQQ)", th: "ผลการซื้อขาย Nasdaq 100 (QQQ)", vi: "Kết quả giao dịch Nasdaq 100 (QQQ)", tr: "Nasdaq 100 (QQQ) İşlem Sonuçları" },
    sp500Results: { en: "S&P 500 (SPY) Trading Results", ko: "S&P 500(SPY) 트레이딩 결과", ar: "نتائج تداول S&P 500 (SPY)", ru: "Результаты трейдинга S&P 500 (SPY)", zh: "标普500(SPY)交易结果", es: "Resultados de Trading S&P 500 (SPY)", id: "Hasil Trading S&P 500 (SPY)", th: "ผลการซื้อขาย S&P 500 (SPY)", vi: "Kết quả giao dịch S&P 500 (SPY)", tr: "S&P 500 (SPY) İşlem Sonuçları" },
    
    // Section 1: AI Revolution
    section1Title: { 
      en: "AI Development Speed Has Exploded in the Past Year",
      ko: "최근 1년간 AI의 발전 속도가 미친듯이 빨라졌다",
      ar: "سرعة تطور الذكاء الاصطناعي انفجرت في العام الماضي",
      ru: "Скорость развития AI взорвалась за последний год",
      zh: "过去一年AI发展速度爆发式增长",
      es: "La velocidad de desarrollo de IA ha explotado en el último año",
      id: "Kecepatan Pengembangan AI Telah Meledak dalam Setahun Terakhir",
      th: "ความเร็วในการพัฒนา AI ระเบิดขึ้นในปีที่ผ่านมา",
      vi: "Tốc độ phát triển AI đã bùng nổ trong năm qua",
      tr: "AI Geliştirme Hızı Geçen Yıl Patladı"
    },
    section1Text1: {
      en: "Now, as long as you have a trading strategy, AI will automatically invest 24/7 for you.",
      ko: "이제 내가 원하는 '트레이딩 전략'만 있다면, AI가 알아서 24시간 투자를 해주는 시대가 왔다.",
      ar: "الآن، طالما لديك استراتيجية تداول، سيستثمر الذكاء الاصطناعي تلقائياً على مدار الساعة من أجلك.",
      ru: "Теперь, если у вас есть торговая стратегия, AI будет автоматически инвестировать 24/7 за вас.",
      zh: "现在，只要你有交易策略，AI就会为你24/7自动投资。",
      es: "Ahora, mientras tengas una estrategia de trading, la IA invertirá automáticamente las 24/7 por ti.",
      id: "Sekarang, selama Anda memiliki strategi trading, AI akan secara otomatis berinvestasi 24/7 untuk Anda.",
      th: "ตอนนี้ ตราบใดที่คุณมีกลยุทธ์การซื้อขาย AI จะลงทุนอัตโนมัติตลอด 24/7 ให้คุณ",
      vi: "Bây giờ, miễn là bạn có chiến lược giao dịch, AI sẽ tự động đầu tư 24/7 cho bạn.",
      tr: "Artık bir işlem stratejiniz olduğu sürece, AI sizin için 7/24 otomatik olarak yatırım yapacak."
    },
    section1Text2: {
      en: "ChatGPT, DeepSeek, Gemini, and other top global companies have entered the quant trading market, showing incredible returns over the past month.",
      ko: "ChatGPT, DeepSeek, Gemini 등 전세계 TOP5 기업들이 퀀트(자동매매) 시장에 직접 뛰어들어 지난 한 달간 말도 안 나오는 수익률을 보여줬다.",
      ar: "دخلت ChatGPT وDeepSeek وGemini وغيرها من الشركات العالمية الكبرى سوق التداول الكمي، وأظهرت عوائد لا تصدق خلال الشهر الماضي.",
      ru: "ChatGPT, DeepSeek, Gemini и другие топовые мировые компании вышли на рынок квант-трейдинга, показав невероятную доходность за последний месяц.",
      zh: "ChatGPT、DeepSeek、Gemini等全球顶尖公司已进入量化交易市场，在过去一个月展现了惊人的回报。",
      es: "ChatGPT, DeepSeek, Gemini y otras empresas líderes mundiales han entrado en el mercado de trading cuantitativo, mostrando retornos increíbles en el último mes.",
      id: "ChatGPT, DeepSeek, Gemini, dan perusahaan global top lainnya telah memasuki pasar trading kuantitatif, menunjukkan pengembalian luar biasa selama sebulan terakhir.",
      th: "ChatGPT, DeepSeek, Gemini และบริษัทชั้นนำระดับโลกอื่นๆ ได้เข้าสู่ตลาดการซื้อขายเชิงปริมาณ แสดงผลตอบแทนที่น่าทึ่งในเดือนที่ผ่านมา",
      vi: "ChatGPT, DeepSeek, Gemini và các công ty hàng đầu thế giới khác đã tham gia thị trường giao dịch định lượng, cho thấy lợi nhuận đáng kinh ngạc trong tháng qua.",
      tr: "ChatGPT, DeepSeek, Gemini ve diğer dünya liderler kantitatif işlem piyasasına girdi ve geçen ay inanılmaz getiriler gösterdi."
    },
    section1Quote: {
      en: "I believe the era of humans trading manually is over.",
      ko: "내 생각으로는 이제 인간이 직접 매매하는 시대가 끝났다고 생각한다.",
      ar: "أعتقد أن عصر التداول اليدوي للبشر قد انتهى.",
      ru: "Я считаю, что эра ручной торговли людьми закончилась.",
      zh: "我认为人类手动交易的时代已经结束。",
      es: "Creo que la era del trading manual humano ha terminado.",
      id: "Saya percaya era manusia melakukan trading secara manual sudah berakhir.",
      th: "ฉันเชื่อว่ายุคของมนุษย์ที่ทำการซื้อขายด้วยตนเองสิ้นสุดลงแล้ว",
      vi: "Tôi tin rằng kỷ nguyên con người giao dịch thủ công đã kết thúc.",
      tr: "İnsanların manuel olarak işlem yaptığı dönemin sona erdiğine inanıyorum."
    },
    
    // Section 2: Proof
    section2Title: {
      en: "Sharing Only 'Profits' Would Make Me Look Like a Scammer",
      ko: "단순히 '수익' 공유만 한다면 나를 '사기꾼'으로 생각할 것이기에",
      ar: "مشاركة 'الأرباح' فقط ستجعلني أبدو كمحتال",
      ru: "Если бы я делился только 'прибылью', меня бы приняли за мошенника",
      zh: "如果只分享'收益'，我会被认为是骗子",
      es: "Compartir solo 'ganancias' me haría parecer un estafador"
    },
    section2Text1: {
      en: "I've disclosed every single daily PNL. The AI made 130 profitable trades and 34 stop losses, earning over $20K while surviving the market.",
      ko: "매일 발생한 PNL(수익)까지 싹다 공개했다. 나 대신 AI가 익절을 130번 했고, 손절은 34번을 하면서 약 3천만원이 넘는 수익을 AI가 시장에서 살아남아 벌어다주었다.",
      ar: "لقد كشفت عن كل PNL يومي. قام الذكاء الاصطناعي بـ 130 صفقة مربحة و 34 وقف خسارة، وكسب أكثر من 20 ألف دولار مع البقاء في السوق.",
      ru: "Я раскрыл каждый дневной PNL. AI совершил 130 прибыльных сделок и 34 стоп-лосса, заработав более $20K, выживая на рынке.",
      zh: "我公开了每一笔日常PNL。AI完成了130次盈利交易和34次止损，在市场中生存并赚取了超过2万美元。",
      es: "He revelado cada PNL diario. La IA realizó 130 operaciones rentables y 34 stop losses, ganando más de $20K mientras sobrevivía en el mercado."
    },
    section2Text2: {
      en: "99% of people won't believe it, but all I do each day is turn on my phone and say \"AI, trade however you want like this\"...",
      ko: "99%의 사람들은 못 믿겠지만, 내가 하루 동안 하는 거라곤 그저 단순히 폰을 키고 \"AI야 '이렇게' 맘대로 트레이딩 해줘\"라고 명령한 것밖에 없다...",
      ar: "99% من الناس لن يصدقوا ذلك، لكن كل ما أفعله كل يوم هو تشغيل هاتفي والقول \"AI، تداول كما تريد هكذا\"...",
      ru: "99% людей не поверят, но всё, что я делаю каждый день - включаю телефон и говорю \"AI, торгуй как хочешь вот так\"...",
      zh: "99%的人不会相信，但我每天做的就是打开手机说'AI，像这样随便交易'...",
      es: "El 99% de la gente no lo creerá, pero todo lo que hago cada día es encender mi teléfono y decir \"IA, opera como quieras así\"..."
    },
    
    // Section 3: RWA
    section3Title: {
      en: "RWA Development is Expanding AI Investment Range",
      ko: "RWA(자산토큰화)의 발전으로 AI 투자범위는 점점 넓어지고 있다",
      ar: "تطوير RWA يوسع نطاق استثمار الذكاء الاصطناعي",
      ru: "Развитие RWA расширяет диапазон AI инвестиций",
      zh: "RWA发展正在扩大AI投资范围",
      es: "El desarrollo de RWA está expandiendo el rango de inversión de IA"
    },
    coreFinancial: { en: "Core Financial Assets", ko: "근본 금융자산", ar: "الأصول ال��الية الأساسية", ru: "Основные финансовые ак��ивы", zh: "核心金融资产", es: "Activos financieros principales" },
    safeHaven: { en: "Safe Haven Asset", ko: "근본 안전자산", ar: "أصل الملاذ الآمن", ru: "Актив-убежище", zh: "避险资产", es: "Activo refugio" },
    digitalAsset: { en: "Digital Asset", ko: "디지털 자산", ar: "الأصول الرقمية", ru: "Цифровой актив", zh: "数字资产", es: "Activo digital" },
    individualStocks: { en: "Individual Stocks", ko: "개별 주식", ar: "الأسهم الفردية", ru: "Отдельные акции", zh: "个股", es: "Acciones individuales" },
    section3Text: {
      en: "AI handles quant trading for everything from S&P500 and Nasdaq (QQQ) to gold and Bitcoin.",
      ko: "AI는 대표적인 금융자산인 S&P500, 나스닥(QQQ)부터 근본 안전자산인 금(GOLD), 그리고 비트코인까지 전부 퀀트 트레이딩을 해준다.",
      ar: "يتعامل الذكاء الاصطناعي مع التداول الكمي لكل شيء من S&P500 و Nasdaq (QQQ) إلى الذهب والبيتكوين.",
      ru: "AI осуществляет квант-трейдинг всем: от S&P500 и Nasdaq (QQQ) до золота и Bitcoin.",
      zh: "AI处理从���普500和纳斯达克(QQQ)到黄金和比特币的所有量化交易。",
      es: "La IA maneja el trading cuantitativo para todo, desde S&P500 y Nasdaq (QQQ) hasta oro y Bitcoin."
    },
    
    // Section 4: Strategy
    section4Title: {
      en: "How to Automate Trading Strategy 24H with ChatGPT and Gemini",
      ko: "ChatGPT와 Gemini로 트레이딩 전략 24H 자동화 시키는 방법",
      ar: "كيفية أتمتة استراتيجية التداول على مدار الساعة مع ChatGPT و Gemini",
      ru: "Как автоматизировать торговую стратегию 24/7 с помощью ChatGPT и Gemini",
      zh: "如何使用ChatGPT和Gemini实现24小时交易策略自动化",
      es: "Cómo automatizar la estrategia de trading 24H con ChatGPT y Gemini"
    },
    section4Intro: {
      en: "Getting straight to the point: I created an automated trading strategy based on 'rotation trading' using ChatGPT.",
      ko: "바로 본론부터 말하자면, 나는 ChatGPT라는 AI를 통해 '순환매'를 기반으로 자동 트레이딩 전략을 만들었다.",
      ar: "للدخول مباشرة في صلب الموضوع: لقد أنشأت استراتيجية تداول آلية تعتمد على 'التداول الدوراني' باستخدام ChatGPT.",
      ru: "Сразу к делу: я создал автоматизированную торговую стратегию на основе 'ротационной торговли' используя ChatGPT.",
      zh: "直接说重点：我使用ChatGPT创建了一个基于'轮换交易'的自动交易策略。",
      es: "Yendo directo al grano: creé una estrategia de trading automatizada basada en 'trading rotacional' usando ChatGPT."
    },
    section4Text1: {
      en: "These two images show AI's actual rotation trading history. It continuously repeats rotation trading based on specific algorithmic strategies.",
      ko: "위 2가지 사진은 AI가 실제로 '순환매매'를 사용해 트레이딩을 한 내역이다. 특정한 알고리즘 전략을 토대로 순환매를 계속 반복한다.",
      ar: "تظهر هاتان الصورتان سجل التداول الدوراني الفعلي للذكاء الاصطناعي. يكرر التداول الدوراني باستمرار بناءً على استراتيجيات خوارزمية محددة.",
      ru: "Эти два изображения показывают реальную историю ротационной торговли AI. Он непрерывно повторяет ротационную торговлю на ос��ове определённых алгоритмических стратегий.",
      zh: "这两张图展示了AI实际的轮换交易记录。它根据特定的算法策略持续重复轮换交易。",
      es: "Estas dos imágenes muestran el historial real de trading rotacional de la IA. Repite continuamente el trading rotacional basado en estrategias algorítmicas específicas."
    },
    section4Text2: {
      en: "Even in 'one-way' situations where the chart rises more than 5%, the AI uses rotation strategy to take profits at the 'gaps' during pullbacks.",
      ko: "차트가 5% 이상 상승하는 '원웨이' 상황에서도 AI가 순환매 전략을 사용해 하락할 때 나오는 '갭'에서 익절해준다.",
      ar: "حتى في حالات 'الاتجاه الواحد' حيث يرتفع الرسم البياني أكثر من 5%، يستخدم الذكاء الاصطناعي استراتيجية التدوير لجني الأرباح عند 'الفجوات' أثناء التراجعات.",
      ru: "Даже в ситуациях 'одностороннего' движения, когда график растёт более чем на 5%, AI использует ротационную стратегию для фиксации прибыли на 'гэпах' во время откатов.",
      zh: "即使在图表上涨超过5%的'单边'行情中，AI也会使用轮换策略在回调时的'缺口'处获利了结。",
      es: "Incluso en situaciones de 'un solo sentido' donde el gráfico sube más del 5%, la IA usa la estrategia de rotación para tomar ganancias en los 'gaps' durante los retrocesos."
    },
    
    // Section 5: 2026 Results
    section5Title: { en: "Continued Profits in 2026", ko: "2026년에도 계속되는 수익", ar: "استمرار الأرباح في 2026", ru: "Продолжение прибыли в 2026", zh: "2026年持续盈利", es: "Ganancias continuas en 2026" },
    section5Text: {
      en: "In 2026, AI made 124 total buys with a 91% win rate, and the account continues to grow. AI trading has established itself as a strategy, and we're now in an era where AIs compete against each other for returns.",
      ko: "2026년에도 AI는 총 124번의 매수를 했고, 승률 91%를 기록하면서 계좌는 우상향하고 있다. AI 트레이딩이 하나의 전략으로 자리 잡고 있고, AI끼리 조차도 수익률을 경쟁하는 시대에 왔다고 보면 된다.",
      ar: "في عام 2026، قام الذكاء الاصطناعي بـ 124 عملية شراء بمعدل فوز 91%، والحساب يستمر في النمو. أصبح تداول الذكاء الاصطناعي استراتيجية راسخة، ونحن الآن في عصر تتنافس فيه الذكاءات الاصطناعية مع بعضها البعض على العوائد.",
      ru: "В 2026 году AI совершил 124 покупок с винрейтом 91%, и счёт продолжает расти. AI-трейдинг утвердился как стратегия, и мы сейчас в эпохе, когда AI конкурируют друг с другом за доходность.",
      zh: "2026年，AI共进行了124次买入，胜率91%，账户持续增长。AI交易已确立为一种策略，我们现在进入了AI之间相互竞争回报的时代。",
      es: "En 2026, la IA realizó 124 compras totales con una tasa de éxito del 91%, y la cuenta sigue creciendo. El trading con IA se ha establecido como una estrategia, y ahora estamos en una era donde las IAs compiten entre sí por los retornos."
    },
    
    // Section 6: No Emotions
    section6Title: { en: "AI Has No Emotions", ko: "AI는 감정이 없다", ar: "الذكاء الاصطناعي ليس لديه مشاعر", ru: "AI не имеет эмоций", zh: "AI没有情绪", es: "La IA no tiene emociones" },
    section6Text1: {
      en: "Humans have emotions, so they will 100% lose money due to \"greed, euphoria, and fear.\"",
      ko: "사람이라면 '감정'을 가지고 있기 때문에 \"탐욕, 환희, 공포\"로 인해서 100% 돈을 잃게 될 것이다.",
      ar: "البشر لديهم مشاعر، لذلك سيخسرون المال بنسبة 100% بسبب \"الجشع والنشوة والخوف\".",
      ru: "У людей есть эмоции, поэтому они на 100% потеряют деньги из-за \"жадности, эйфории и страха\".",
      zh: "人类有情绪，所以会因为'贪婪、狂喜和恐惧'而100%亏钱。",
      es: "Los humanos tienen emociones, por lo que perderán dinero al 100% debido a \"la codicia, la euforia y el miedo\"."
    },
    section6Text2: {
      en: "But AI quant trading is different. AI follows the strategy 100% according to the rules, so even if the chart drops -30% or rises +100%, it feels no euphoria.",
      ko: "하지만 AI가 진행하는 퀀트 트레이딩은 다르다. AI가 100% '전략'대로 규칙을 지켜 매매하기에, 차트가 -30% 이상 떨어진다고 해도, +100% 상승한다고 해도 '환희'를 느끼지 않는다.",
      ar: "لكن التداول الكمي بالذكاء الاصطناعي مختلف. يتبع الذكاء الاصطناعي الاستراتيجية 100% وفقاً للقواعد، لذلك حتى لو انخفض الرسم البياني -30% أو ارتفع +100%، فإنه لا يشعر بالنشوة.",
      ru: "Но AI квант-трейдинг отличается. AI следует стратегии на 100% согласно правилам, поэтому даже если график упадёт на -30% или вырастет на +100%, он не чувствует эйфории.",
      zh: "但AI量化交易不同。AI 100%按照策略规则进行交易，所以即使图表下跌-30%或上涨+100%，它也不会感到狂喜。",
      es: "Pero el trading cuantitativo con IA es diferente. La IA sigue la estrategia al 100% según las reglas, así que incluso si el gráfico cae -30% o sube +100%, no siente euforia."
    },
    section6Highlight: {
      en: "AI can only do two things based on algorithms: buy and sell.",
      ko: "AI는 단순하게 알고리즘을 바탕으로 사고, 팔고 - 단 2가지만 할 수 있다.",
      ar: "يمكن للذكاء الاصطناعي القيام بشيئين فقط بناءً على الخوارزميات: الشراء والبيع.",
      ru: "AI может делать только две вещи на основе алгоритмов: покупать и продавать.",
      zh: "AI基于算法只能做两件事：买和卖。",
      es: "La IA solo puede hacer dos cosas basadas en algoritmos: comprar y vender."
    },
    
    // Section 7: How to Use
    section7Title: {
      en: "How to Train AI with Your Own Strategy",
      ko: "자신만의 전략을 AI에게 학습시켜 트레이딩 시키는 방법",
      ar: "كيفية تدريب الذكاء الاصطناعي على استراتيجيتك الخاصة",
      ru: "Как обучить AI вашей собственной стратегии",
      zh: "如何用你自己的策略训练AI进行交易",
      es: "Cómo entrenar a la IA con tu propia estrategia"
    },
    step1: {
      en: "Open ChatGPT or Gemini and ask them to create a 'strategy' that will grow your account.",
      ko: "ChatGPT나 Gemini를 켜서 계좌를 우상향 시킬만한 '전략'을 구성해달라고 한다.",
      ar: "افتح ChatGPT أو Gemini واطلب منهم إنشاء 'استراتيجية' ستنمي حسابك.",
      ru: "Откройте ChatGPT или Gemini и попросите их создать 'стратегию', которая увеличит ваш счёт.",
      zh: "打开ChatGPT或Gemini，让它们创建一个能让你账户增长的'策略'。",
      es: "Abre ChatGPT o Gemini y pídeles que creen una 'estrategia' que haga crecer tu cuenta."
    },
    step2: {
      en: "Ask AI to code that strategy into actual code.",
      ko: "해당 전략을 AI에게 코딩을 해서 코드로 만들어달라고 한다.",
      ar: "اطلب من الذكاء الاصطناعي برمجة تلك الاستراتيجية إلى كود فعلي.",
      ru: "Попросите AI закодировать эту стратегию в реальный код.",
      zh: "让AI把该策略编写成实际代码。",
      es: "Pide a la IA que codifique esa estrategia en código real."
    },
    warningTitle: {
      en: "99% of people will give up and run away here",
      ko: "여기서 99% 이상의 사람들은 포기하고 도망을 갈 것이다",
      ar: "99% من الناس سيستسلمون ويهربون هنا",
      ru: "99% людей сдадутся и убегут на этом этапе",
      zh: "99%的人会在这里放弃并逃跑",
      es: "El 99% de las personas se rendirán y huirán aquí"
    },
    warningText: {
      en: "You need basic coding knowledge to use AI to create this. People who don't know coding will probably hit 'back' and return to emotional trading.",
      ko: "'코딩'에 관한 기본 정보가 있어야만 AI를 사용해 만들 수 있다. 아마 코딩을 모르는 사람들은 '뒤로 가기'를 눌러 다시 뇌동매매의 길로 돌아갈 것이라고 생각한다.",
      ar: "تحتاج إلى معرفة أساسية بالبرمجة لاس��خدام الذكاء الاصطناعي لإنشاء هذا. الأشخاص الذين لا يعرفون البرمجة سيضغطون على 'رجوع' ويعودون إلى التداول العاطفي.",
      ru: "Вам нужны базовые знания программирования, чтобы использовать AI для создания этого. Люди, не знающие кодинг, скорее всего нажмут 'назад' и вернутся к эмоциональной торговле.",
      zh: "你需要基本的编程知识才能使用AI创建这个。不懂编程的人可能会点击'返回'回到情绪化交易。",
      es: "Necesitas conocimientos básicos de programación para usar la IA para crear esto. Las personas que no saben programar probablemente presionarán 'atrás' y volverán al trading emocional."
    },
    
    // Section 8: Free Distribution
    section8Title: {
      en: "Releasing All Quant Programs for Free",
      ko: "모든 퀀트 프로그램을 전부 무료로 풀고 있다",
      ar: "إطلاق جميع برامج التداول الكمي مجاناً",
      ru: "Выпускаю все квант-программы бесплатно",
      zh: "免费发布所有量化程序",
      es: "Liberando todos los programas cuantitativos gratis"
    },
    section8Text1: {
      en: "You might think I wrote this to sell AI quant programs, but contrary to what readers think, I'm releasing all quant programs I've made for free.",
      ko: "지금 필자가 AI 퀀트 프로그램을 돈을 받고 팔려고 이 글을 썼다고 생각하겠지만, 지금 이런 독자들의 생각과 다르게 나는 여태까지 만든 모든 퀀트 프로그램을 전부 무료로 풀고 있다.",
      ar: "قد تعتقد أنني كتبت هذا لبيع برامج التداول الكمي بالذكاء الاصطناعي، لكن على عكس ما يعتقده القراء، أنا أطلق جميع برامج التداول الكمي التي صنعتها مجاناً.",
      ru: "Вы можете подумать, что я написал это, чтобы продавать AI квант-программы, но вопреки тому, что думают читатели, я выпускаю все квант-программы, которые создал, бесплатно.",
      zh: "你可能认为我写这个是为了卖AI量化程序，但与读者想的相反，我正在免费发��我制作的所有量化程序。",
      es: "Podrías pensar que escribí esto para vender programas cuantitativos de IA, pero contrario a lo que piensan los lectores, estoy liberando todos los programas cuantitativos que he hecho gratis."
    },
    section8Quote: {
      en: "Because I'm looking a bit further ahead.",
      ko: "나는 조금 더 멀리 바라보고 있기 때문이다.",
      ar: "لأنني أنظر إلى أبعد قليلاً.",
      ru: "Потому что я смотрю немного дальше вперёд.",
      zh: "因为我看得更远一些。",
      es: "Porque estoy mirando un poco más adelante."
    },
    section8Text2: {
      en: "I established a corporate entity in Dubai this summer. If you're in the industry, you know that getting VC investment requires a lot of data.",
      ko: "올해 여름에 두바이에서 법인 사업자를 개설했다. 이미 업계에 있으면 알겠지만 VC한테 투자받으려면 정말 많은 데이터 값이 필요하다.",
      ar: "أسست كياناً تجارياً في دبي هذا الصيف. إذا كنت في الصناعة، فأنت تعلم أن الحصول على استثمار ��أس المال المخاطر يتطلب الكثير من البيانات.",
      ru: "Этим летом я зарегистрировал юридическое лицо в Дубае. Если вы в индустрии, вы знаете, что для получения инвестиций от венчурных капиталистов нужно много данных.",
      zh: "今年夏天我在迪拜设立了公司。如果你在这个行业，你知道获得风险投资需要大量数据。",
      es: "Establecí una entidad corporativa en Dubái este verano. Si estás en la industria, sabes que obtener inversión de capital de riesgo requiere muchos datos."
    },
    section8Text3: {
      en: "What happens when thousands of users share their results from using my quant program?",
      ko: "이렇게 수많은 사용자가 내 퀀트 프로그램을 써서 결과물들 공유해주는 사용자가 수천 명이 넘어간다면 어떻게 될까?",
      ar: "ماذا يحدث عندما يشارك آلاف المستخدمين نتائجهم من استخدام برنامجي الكمي؟",
      ru: "Что произойдёт, когда тысячи пользователей поделятся своими результатами использования моей квант-программы?",
      zh: "当数千用户分享他们使用我的量化程序的结果时会发生什么？",
      es: "¿Qué pasa cuando miles de usuarios comparten sus resultados de usar mi programa cuantitativo?"
    },
    section8Text4: {
      en: "I thought I could get investment from numerous VCs.",
      ko: "아마 수많은 VC(벤처)들에게 투자를 받을 수 있다고 생각했다.",
      ar: "اعتقدت أنني يمكن أن أحصل على استثمار من العديد من شركات رأس المال المخاطر.",
      ru: "Я подумал, что смогу получить инвестиции от многочисленных венчурных капиталистов.",
      zh: "我认为我可以从众多风险投资机构获得投资。",
      es: "Pensé que podría obtener inversión de numerosos VCs."
    },
    section8Text5: {
      en: "Maybe, as Peter Thiel said, I could finish in 6 months what would take 10 years.",
      ko: "어쩌면 피터 틸의 말대로 10년이 걸릴 일을 어쩌면 6개월 안으로 끝낼 수 있다고 판단했다.",
      ar: "ربما، كما قال بيتر ثيل، يمكنني إنهاء ما يستغرق 10 سنوات في 6 أشهر.",
      ru: "Может быть, как сказал Питер Тиль, я мог бы закончить за 6 месяцев то, что заняло бы 10 лет.",
      zh: "也许，正如彼得·蒂尔所说，我可以在6个月内完成需要10年才能完成的事情。",
      es: "Tal vez, como dijo Peter Thiel, podría terminar en 6 meses lo que tomaría 10 años."
    },
    
    // Section 9: Transparency
    section9Title: { en: "\"Does It Actually Make Profit?\"", ko: "\"실제로 수익이 날까요?\"", ar: "\"هل تحقق ربحاً فعلاً؟\"", ru: "\"Действительно ли это приносит прибыль?\"", zh: "\"真的能盈利吗？\"", es: "\"¿Realmente genera ganancias?\"" },
    section9Text1: {
      en: "Many auto-trading companies hide their algorithms and call them secrets. They just tell you to trust them.",
      ko: "많은 자동매매 업체들이 자신의 프로그램 알고리즘을 감추고 비밀이라고 한다. 그냥 믿으라고만 한다.",
      ar: "تخفي العديد من شركات التداول الآلي خوارزمياتها وتسميها أسراراً. يطلبون منك فقط أن تثق بهم.",
      ru: "Многие компании автоматической торговли скрывают свои алгоритмы и называют их секретами. Они просто говорят вам доверять им.",
      zh: "许多自动交易公司隐藏他们的算法并称之为秘密。他们只是告诉你要信任他们。",
      es: "Muchas empresas de trading automático ocultan sus algoritmos y los llaman secretos. Solo te dicen que confíes en ellos."
    },
    section9Text2: {
      en: "But I believe users should understand how the program works from start to finish.",
      ko: "하지만 나는 사용자가 처음부터 끝까지 프로그램이 어떻게 동작되는지 이해할 수 있어야 한다고 생각했다.",
      ar: "لكنني أعتقد أن المستخدمين يجب أن يفهموا كيف يعمل البرنامج من البداية إلى النهاية.",
      ru: "Но я считаю, что пользователи должны понимать, как работает программа от начала до конца.",
      zh: "但我认为用户应该从头到尾理解程序是如何工作的。",
      es: "Pero creo que los usuarios deberían entender cómo funciona el programa de principio a fin."
    },
    section9Text3: {
      en: "That way users can run quant trading at maximum efficiency in all situations, starting with risk management.",
      ko: "그래야 사용자가 리스크 관리부터 모든 상황에서 최고 효율로 퀀트 트레이딩을 구동할 수 있기 때문이다.",
      ar: "بهذه الطريقة يمكن للمستخدمين تشغيل التداول الكمي بأقصى كفاءة في جميع المواقف، بدءاً من إدارة المخاطر.",
      ru: "Таким образом пользователи могут запускать квант-трейдинг с максимальной эффективностью во всех ситуациях, начиная с управления рисками.",
      zh: "这样用户才能在所有情况下以最高效率运行量化交易，从风险管理开始。",
      es: "De esa manera los usuarios pueden ejecutar trading cuantitativo con máxima eficiencia en todas las situaciones, comenzando con la gestión de riesgos."
    },
    section9Text4: {
      en: "So I've opened not just the quant program but also the entire quant algorithm strategy. This will create many copies and competitors, but in return, I believed I could gain the strongest quant community and larger fanbase in Korea.",
      ko: "그래서 퀀트 프로그램뿐만 아니라 퀀트 알고리즘 전략까지 전부 오픈했다. 이로 인해 수많은 카피들과 경쟁자들이 생기겠지만, 그 대가로 나는 대한민국에서 가장 강력한 퀀트 커뮤니티와 더 큰 팬층을 얻을 수 있다고 생각했다.",
      ar: "لذلك فتحت ليس فقط ��رنامج التداول الكمي ولكن أيضاً استراتيجية الخوارزمية الكمية بالكامل. سيخلق هذا العديد من النسخ والمنافسين، لكن في المقابل، اعتقدت أنني يمكن أن أكسب أقوى مجتمع للتداول الكمي وقاعدة معجبين أكبر في كوريا.",
      ru: "��оэтому я открыл не только квант-программу, но и всю стратегию квант-алгоритма. Это создаст много копий и конкурентов, но взамен я верил, что смогу получить сильнейшее квант-сообщество и большую фанбазу в Корее.",
      zh: "所以我不仅开���了量化程序，还开放了整个量化算法策略。这会产生很多复制品和竞争对手，但作为回报，我相信我可以在韩国获得最强大的量化社区和更大的粉丝群。",
      es: "Así que abrí no solo el programa cuantitativo sino también toda la estrategia del algoritmo cuantitativo. Esto creará muchas copias y competidores, pero a cambio, creí que podría ganar la comunidad cuantitativa más fuerte y una base de fans más grande en Corea."
    },
    section9Text5: {
      en: "My quant program works with Nasdaq, S&P500, gold, Bitcoin, silver, Nvidia, etc. Users can read the shared quant algorithm PDF and decide which asset to automate 24h trading with.",
      ko: "내가 제작한 퀀트 프로그램은 나스닥, S&P500, 금, 비트코인, 은, 엔비디아 등 전부 돌아간다. 사용자는 공유해준 퀀트 알고리즘[PDF]를 읽고, 나스닥, 금, 비트코인 등 어떤 자산으로 트레이딩 전략을 24h 자동화 시킬지 정하면 된다.",
      ar: "يعمل برنامج التداول الكمي الخاص بي مع Nasdaq و S&P500 والذهب والبيتكوين والفضة و Nvidia وما إلى ذلك. يمكن للمستخدمين قراءة PDF خوارزمية التداول الكمي المشتركة وتحديد الأصل الذي سيتم أتمتة التداول عليه على مدار الساعة.",
      ru: "Моя квант-программа работает с Nasdaq, S&P500, золотом, Bitcoin, серебром, Nvidia и т.д. Пользователи могут прочитать общий PDF квант-алгоритма и решить, с каким активом автоматизировать 24-часовую торговлю.",
      zh: "我的量化程序适用于纳斯达克、标普500、黄金、比特币、白银、英伟达等。用户可以阅读共享的量化算法PDF，决定用哪种资产进行24小时自动交易。",
      es: "Mi programa cuantitativo funciona con Nasdaq, S&P500, oro, Bitcoin, plata, Nvidia, etc. Los usuarios pueden leer el PDF del algoritmo cuantitativo compartido y decidir con qué activo automatizar el trading 24h."
    },
    
    // Final CTA
    ctaTitle: {
      en: "Last Call: Only 100 More Spots Available",
      ko: "마지막으로 선착순 100명만 더 뽑도록 하겠다",
      ar: "النداء الأخير: 100 مكان فقط متاح",
      ru: "Последний звонок: осталось только 100 мест",
      zh: "最后通知：仅剩100个名额",
      es: "Última llamada: Solo quedan 100 lugares disponibles"
    },
    ctaText: {
      en: "Too many people are getting the quant program, which could lead to stop-loss hunting by market makers due to repetitive order patterns.",
      ko: "너무 많은 사람들이 퀀트 프로그램을 받아가는 바람에 반복적인 '호가창' 및 '주문패턴'으로 인해 MM(마켓메이커)들이 스탑로스 사냥을 할 수도 있다.",
      ar: "الكثير من الناس يحصلون على برنامج التداول الكمي، مما قد يؤدي إلى صيد وقف الخسارة من قبل صناع السوق بسبب أنماط الطلبات المتكررة.",
      ru: "Слишком много людей получают квант-программу, что может привести к охоте на стоп-лоссы маркет-мейкерами из-за повторяющихся паттернов заказов.",
      zh: "太多人获取了量化程序，由于重复的订单模式，可能导致做市商进行止损狩猎。",
      es: "Demasiadas personas están obteniendo el programa cuantitativo, lo que podría llevar a la caza de stop-loss por parte de los creadores de mercado debido a patrones de órdenes repetitivos."
    },
    startFree: { en: "Start Free", ko: "무료로 시작하기", ar: "ابدأ مجاناً", ru: "Начать бесплатно", zh: "免费开始", es: "Comenzar gratis", id: "Mulai Gratis", th: "เริ่มฟรี", vi: "Bắt đầu Miễn phí", tr: "Ücretsiz Başla" },
    ctaButton: { en: "Start Free", ko: "무료로 시작하기", ar: "ابدأ مجاناً", ru: "Начать бесплатно", zh: "免费开始", es: "Comenzar gratis", id: "Mulai Gratis", th: "เริ่มฟรี", vi: "Bắt đầu Miễn phí", tr: "��cretsiz Başla" },
    ctaGuidance: {
      en: "After clicking 'Start Free', press the [Start AI] button on the homepage to begin AI automated trading immediately.",
      ko: "무료로 시작하기 버튼을 누른 뒤, 홈페이지에서 [Start AI] 버튼을 누르면 AI 자���매매를 바로 시작할 수 있습니다.",
      ar: "بعد النقر على 'ابدأ مجاناً'، اضغط على زر [Start AI] في الصفحة الرئيسية لبدء التداول الآلي بالذكاء الاصطناعي فوراً.",
      ru: "После нажатия 'Начать бесплатно' нажмите кнопку [Start AI] на главной странице, чтобы сразу начать автоматическую торговлю AI.",
      zh: "点击'免费开始'后，在首页按下[Start AI]按钮即可立即开始AI自动交易。",
      es: "Después de hacer clic en 'Comenzar gratis', presiona el botón [Start AI] en la página de inicio para comenzar el trading automatizado de IA inmediatamente."
    },
    // Telegram Section - Full CTA Block (like Final CTA)
    telegramSectionTitle: {
      en: "Thousands Are Already Watching in Telegram",
      ko: "이미 수천 명이 확인 중인 텔레그램 방",
      ar: "الآلاف يتابعون بالفعل في تيليجرام",
      ru: "Тысячи уже следят в нашем Telegram",
      zh: "数千人已在电报群中关注",
      es: "Miles ya están viendo en nuestro Telegram"
    },
    telegramSectionDesc1: {
      en: "I won't say much more.",
      ko: "긴말 안 하겠다.",
      ar: "لن أقول الكثير.",
      ru: "Я не буду много говорить.",
      zh: "我不多说了。",
      es: "No diré mucho más."
    },
    telegramSectionDesc2: {
      en: "Come and see for yourself in the Telegram group where many people are already active.",
      ko: "이미 많은 사람들이 들어와 있는 텔레그램 방에 직접 들어와서 확인해봐라.",
      ar: "تعال وشاهد بنفسك في مجموعة تيليجرام حيث الكثير من الأشخاص نشطون بالفعل.",
      ru: "Приходите и убедитесь сами в группе Telegram, где уже активны многие люди.",
      zh: "来电报群亲自看看吧，那里已经有很多人活跃。",
      es: "Ven y compruébalo tú mismo en el grupo de Telegram donde muchas personas ya están activas."
    },
    telegramSectionDesc3: {
      en: "Real profit proofs are constantly being shared, and many people are actively using the program right now.",
      ko: "실제 수익 공유도 계속 올라오고 있고, 지금도 많은 사람���이 프로그램을 실제로 사용하고 있다.",
      ar: "يتم مشاركة إثباتات الأرباح الحقيقية باستمرار، والكثير من الناس يستخدمون البرنامج بنشاط الآن.",
      ru: "Постоянно публикуются реальные подтверждения прибыли, и многие люди активно используют программу прямо сейчас.",
      zh: "真实的收益证明不断被分享，很多人现在正在积极使用该程序。",
      es: "Se comparten constantemente pruebas de ganancias reales, y muchas personas están usando activamente el programa ahora mismo."
    },
    telegramBadgeLive: { en: "LIVE", ko: "실 가동중", ar: "مباشر", ru: "LIVE", zh: "运行中", es: "EN VIVO" },
    telegramBadgeProfit: { en: "Profit Sharing", ko: "실수익 공유중", ar: "مشاركة الأرباح", ru: "Прибыль", zh: "收益分享中", es: "Ganancias" },
    telegramBadgeReview: { en: "Real Reviews", ko: "실사용자 후기", ar: "مراجعات حقيقية", ru: "Отзывы", zh: "真实评价", es: "Reseñas" },
    telegramStatMembers: { en: "Members", ko: "참여자 수", ar: "الأعضاء", ru: "Участн��ков", zh: "成员数", es: "Miembros" },
    telegramStatShares: { en: "Profit Shares", ko: "수익 공유", ar: "مشاركات الأرباح", ru: "Отчётов", zh: "收益分享", es: "Compartidos" },
    telegramStatReviews: { en: "Reviews", ko: "후기 수", ar: "المراجعات", ru: "Отзывов", zh: "评价数", es: "Reseñas" },
    telegramCtaButton: {
      en: "Join Telegram Group",
      ko: "텔레그램 방 입장하기",
      ar: "انضم إلى مجموعة تيليجرام",
      ru: "Присоединиться к Telegram",
      zh: "加入电报群",
      es: "Unirse al grupo de Telegram"
    },
  },
} as const

// Helper function to get translation with fallback to English
export function t(
  obj: Record<string, string> | undefined,
  lang: SupportedLang
): string {
  if (!obj) return ""
  return obj[lang] ?? obj.en ?? ""
}
