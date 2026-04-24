"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { X, Globe, ChevronDown, Headphones, MessageCircle, ChevronRight, Bell, HelpCircle, ArrowLeft, Download } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { SupportedLang } from "@/lib/i18n"
import { EbookDownloadModal } from "@/components/ebook-download-modal"

// Helper function to parse **text** into bold elements
function parseBoldText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2)
      return <strong key={index} className="font-semibold text-foreground">{boldText}</strong>
    }
    return part
  })
}

// ═══════════════════════════════════════════════════════════════
// WIDGET TRANSLATIONS
// ═══════════════════════════════════════════════════════════════
const widgetTranslations = {
  header: {
    en: "BuyLow AI Assistant",
    ko: "BuyLow AI 어시스턴트",
    ar: "مساعد BuyLow AI",
    ru: "Ассистент BuyLow AI",
    zh: "BuyLow AI 助手",
    es: "Asistente BuyLow AI",
    id: "Asisten BuyLow AI",
    th: "ผู้ช่วย BuyLow AI",
    vi: "Trợ lý BuyLow AI",
    tr: "BuyLow AI Asistanı",
  },
  buttonLabel: {
    en: "1:1 Chat",
    ko: "1:1 채팅",
    ar: "محادثة 1:1",
    ru: "Чат 1:1",
    zh: "1:1 聊天",
    es: "Chat 1:1",
    id: "Chat 1:1",
    th: "แชท 1:1",
    vi: "Chat 1:1",
    tr: "1:1 Sohbet",
  },
  announcementTitle: {
    en: "Welcome to BuyLow AI Support",
    ko: "BuyLow AI 지원에 오신 것을 환영합니다",
    ar: "مرحبًا بك في دعم BuyLow AI",
    ru: "Добро пожаловать в поддержку BuyLow AI",
    zh: "欢迎来到 BuyLow AI 支持",
    es: "Bienvenido al soporte de BuyLow AI",
    id: "Selamat datang di Dukungan BuyLow AI",
    th: "ยินดีต้อนรับสู่การสนับสนุน BuyLow AI",
    vi: "Chào mừng đến với Hỗ trợ BuyLow AI",
    tr: "BuyLow AI Desteğine Hoş Geldiniz",
  },
  announcementDesc: {
    en: "Get help with your AI trading setup, account questions, and strategy optimization.",
    ko: "AI 트레이딩 설정, 계정 문의 및 전략 최적화에 대한 도움을 받으세요.",
    ar: "احصل على مساعدة في إعداد تداول الذكاء الاصطناعي وأسئلة الحساب وتحسين الاستراتيجية.",
    ru: "Получите помощь по настройке AI-трейдинга, вопросам аккаунта и оптимизации стратегий.",
    zh: "获取有关AI交易设置、账户问题和策略优化的帮助。",
    es: "Obtenga ayuda con su configuración de trading de IA, preguntas sobre la cuenta y optimización de estrategias.",
    id: "Dapatkan bantuan untuk pengaturan trading AI, pertanyaan akun, dan optimalisasi strategi.",
    th: "รับความช่วยเหลือเกี่ยวกับการตั้งค่าการซื้อขาย AI คำถามเกี่ยวกับบัญชี และการเพิ่มประสิทธิภาพกลยุทธ์",
    vi: "Nhận trợ giúp về thiết lập giao dịch AI, câu hỏi về tài khoản và tối ưu hóa chiến lược.",
    tr: "AI işlem kurulumu, hesap soruları ve strateji optimizasyonu için yardım alın.",
  },
  announcementCta: {
    en: "Start Now",
    ko: "지금 시작하기",
    ar: "ابدأ الآن",
    ru: "Начать сейчас",
    zh: "立即开始",
    es: "Comenzar ahora",
    id: "Mulai Sekarang",
    th: "เริ่มเลย",
    vi: "Bắt đầu ngay",
    tr: "Şimdi Başla",
  },
  hotQuestions: {
    en: "Hot Questions",
    ko: "자주 묻는 질문",
    ar: "الأسئلة الشائعة",
    ru: "Популярные вопросы",
    zh: "热门问题",
    es: "Preguntas frecuentes",
    id: "Pertanyaan Populer",
    th: "คำถามยอดนิยม",
    vi: "Câu hỏi nổi bật",
    tr: "Popüler Sorular",
  },
  viewAll: {
    en: "View All",
    ko: "전체 보기",
    ar: "عرض الكل",
    ru: "Смотреть все",
    zh: "查看全部",
    es: "Ver todo",
    id: "Lihat Semua",
    th: "ดูทั้งหมด",
    vi: "Xem tất cả",
    tr: "Tümünü Gör",
  },
  chatService: {
    en: "1:1 Chat Service",
    ko: "1:1 채팅 서비스",
    ar: "خدمة الدردشة 1:1",
    ru: "Чат-сервис 1:1",
    zh: "1:1 聊天服务",
    es: "Servicio de chat 1:1",
    id: "Layanan Chat 1:1",
    th: "บริการแชท 1:1",
    vi: "Dịch vụ Chat 1:1",
    tr: "1:1 Sohbet Hizmeti",
  },
  chatServiceDesc: {
    en: "Can't find your answer? Start a conversation with our support team.",
    ko: "답을 찾을 수 없으신가요? 지원팀과 대화를 시작하세요.",
    ar: "لم تجد إجابتك؟ ابدأ محادثة مع فريق الدعم.",
    ru: "Не нашли ответ? Начните разговор с нашей командой поддержки.",
    zh: "找不到答案？与我们的支持团队开始对话。",
    es: "¿No encuentra su respuesta? Inicie una conversación con nuestro equipo de soporte.",
    id: "Tidak menemukan jawaban? Mulai percakapan dengan tim dukungan kami.",
    th: "หาคำตอบไม่เจอ? เริ่มการสนทนากับทีมสนับสนุนของเรา",
    vi: "Không tìm thấy câu trả lời? Bắt đầu cuộc trò chuyện với đội ngũ hỗ trợ của chúng tôi.",
    tr: "Cevabınızı bulamıyor musunuz? Destek ekibimizle sohbet başlatın.",
  },
  startChat: {
    en: "Start Chat",
    ko: "채팅 시작",
    ar: "بدء الدردشة",
    ru: "Начать чат",
    zh: "开始聊天",
    es: "Iniciar chat",
    id: "Mulai Chat",
    th: "เริ่มแชท",
    vi: "Bắt đầu Chat",
    tr: "Sohbet Başlat",
  },
  selectLanguage: {
    en: "Select Language",
    ko: "언어 선택",
    ar: "اختر اللغة",
    ru: "Выберите язык",
    zh: "选择语言",
    es: "Seleccionar idioma",
    id: "Pilih Bahasa",
    th: "เลือกภาษา",
    vi: "Chọn ngôn ngữ",
    tr: "Dil Seçin",
  },
  stillNeedHelp: {
    en: "Still Need Help?",
    ko: "아직 도움이 필요하신가요?",
    ar: "هل ما زلت بحاجة إلى مساعدة؟",
    ru: "Все еще нужна помощь?",
    zh: "还需要帮助吗？",
    es: "¿Aún necesita ayuda?",
    id: "Masih Butuh Bantuan?",
    th: "ยังต้องการความช่วยเหลือ?",
    vi: "Vẫn cần trợ giúp?",
    tr: "Hâlâ Yardıma İhtiyacınız Var mı?",
  },
  stillNeedHelpDesc: {
    en: "If this guide did not solve your issue, our support team is ready to help.",
    ko: "이 가이드로 문제가 해결되지 않았다면 지원팀이 도와드릴 준비가 되어 있습니다.",
    ar: "إذا لم يحل هذا الدليل مشكلتك، فريق الدعم جاهز للمساعدة.",
    ru: "Если это руководство не решило вашу проблему, наша команда поддержки готова помочь.",
    zh: "如果本指南未能解决您的问题，我们的支持团队随时为您提供帮助。",
    es: "Si esta guía no resolvió su problema, nuestro equipo de soporte está listo para ayudar.",
    id: "Jika panduan ini tidak menyelesaikan masalah Anda, tim dukungan kami siap membantu.",
    th: "หากคู่มือนี้ไม่สามารถแก้ไขปัญหาของคุณได้ ทีมสนับสนุนของเราพร้อมช่วยเหลือ",
    vi: "Nếu hướng dẫn này không giải quyết được vấn đề của bạn, đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ.",
    tr: "Bu kılavuz sorununuzu çözmediyse, destek ekibimiz yardıma hazır.",
  },
  start1on1Chat: {
    en: "Start 1:1 Chat",
    ko: "1:1 채팅 시작",
    ar: "بدء محادثة 1:1",
    ru: "Начать чат 1:1",
    zh: "开始1:1聊天",
    es: "Iniciar chat 1:1",
    id: "Mulai Chat 1:1",
    th: "เริ่มแชท 1:1",
    vi: "Bắt đầu Chat 1:1",
    tr: "1:1 Sohbet Başlat",
  },
  openSetupGuide: {
    en: "Open Setup Guide",
    ko: "설정 가이드 열기",
    ar: "فتح دليل الإعداد",
    ru: "Открыть руководство по настройке",
    zh: "打开设置指南",
    es: "Abrir guía de configuración",
    id: "Buka Panduan Pengaturan",
    th: "เปิดคู่มือการตั้งค่า",
    vi: "Mở hướng dẫn cài đặt",
    tr: "Kurulum Kılavuzunu Aç",
  },
  viewFullDocumentation: {
    en: "View full documentation",
    ko: "전체 문서 보기",
    ar: "عرض الوثائق الكاملة",
    ru: "Просмотреть полную документацию",
    zh: "查看完整文档",
    es: "Ver documentación completa",
    id: "Lihat dokumentasi lengkap",
    th: "ดูเอกสารฉบับเต็ม",
    vi: "Xem tài liệu đầy đủ",
    tr: "Tam dokümantasyonu görüntüle",
  },
  quickFixGuide: {
    en: "Quick Fix Guide",
    ko: "빠른 해결 가이드",
    ar: "دليل الإصلاح السريع",
    ru: "Краткое руководство",
    zh: "快速解决指南",
    es: "Guía de solución rápida",
    id: "Panduan Perbaikan Cepat",
    th: "คู่มือแก้ไขด่วน",
    vi: "Hướng dẫn sửa nhanh",
    tr: "Hızlı Çözüm Kılavuzu",
  },
  moreQuestions: {
    en: "More Questions",
    ko: "추가 질문",
    ar: "المزيد من الأسئلة",
    ru: "Больше вопросов",
    zh: "更多问题",
    es: "Más preguntas",
    id: "Pertanyaan Lainnya",
    th: "คำถามเพิ่มเติม",
    vi: "Thêm câu hỏi",
    tr: "Diğer Sorular",
  },
}

// ═══════════════════════════════════════════════════════════════
// HOT QUESTIONS DATA (6 languages)
// ═══════════════════════════════════════════════════════════════
interface QuestionData {
  id: number
  question: Partial<Record<SupportedLang, string>> & { en: string }
  answer: Partial<Record<SupportedLang, string>> & { en: string }
}

const hotQuestions: QuestionData[] = [
  {
    id: 1,
    question: {
      en: "API Key connection is not working",
      ko: "API Key 연결이 잘 되지 않습니다.",
      ar: "اتصال مفتاح API لا يعمل",
      es: "La conexión de API Key no funciona",
      ru: "Подключение API Key не работает",
      zh: "API Key 连接不成功",
      id: "Koneksi API Key tidak berfungsi",
      th: "การเชื่อมต่อ API Key ไม่ทำงาน",
      vi: "Kết nối API Key không hoạt động",
      tr: "API Key bağlantısı çalışmıyor",
    },
answer: {
      en: "**API KEY Invalid Error**\n\n**Solution:**\n\n1. **Check Render Environment Variables**\n• Go to Render Server → Environment\n• Verify API KEY is entered correctly\n• Variable names must be exact!\n• Example: `API_KEY`, `SECRET_KEY`, `PASSPHRASE`\n\n2. **Check OKX Account**\n• Confirm account was created with BuyLow invite code\n• Verify API was issued from the correct account\n\n3. **Check API KEY Expiration**\n• Check expiration date in OKX API → API Management\n• If expired, generate a new API KEY\n\n4. **Check PassPhrase Special Characters**\n• Verify no special characters are missing in PassPhrase\n• Remove leading/trailing spaces when copy-pasting\n• Re-confirm special characters: `!@#$%^&*()` etc.",
      ko: "**API KEY 유효하지 않음 문제**\n\n**해결 방법:**\n\n1. **Render 환경 변수 확인**\n• Render 서버 → Environment로 이동\n• API KEY가 올바르게 입력되었는지 확인\n• 변수 이름도 토시 하나라도 틀리면 안됨!\n• 예: `API_KEY`, `SECRET_KEY`, `PASSPHRASE`\n\n2. **OKX 계정 확인**\n• BuyLow 전용 계정(초대 코드)으로 가입되었는지 확인\n• API가 정확한 계정에서 발급되었는지 확인\n\n3. **API KEY 만료 확인**\n• OKX API → API Management에서 만료일 확인\n• 만료된 경우 새 API KEY 발급 필요\n\n4. **PassPhrase 특수문자 확인**\n• PassPhrase에 특수문자가 누락되지 않았는지 확인\n• 복사-붙여넣기 시 앞뒤 공백 제거\n• 특수문자: `!@#$%^&*()` 등 포함 여부 재확인",
      ar: "**مشكلة مفتاح API غير صالح**\n\n**الحل:**\n\n1. **تحقق من متغيرات بيئة Render**\n• انتقل إلى خادم Render → Environment\n• تحقق من إدخال مفتاح API بشكل صحيح\n• أسماء المتغيرات يجب أن تكون دقيقة!\n• مثال: `API_KEY`, `SECRET_KEY`, `PASSPHRASE`\n\n2. **تحقق من حساب OKX**\n• تأكد من إنشاء الحساب برمز دعوة BuyLow\n• تحقق من إصدار API من الحساب الصحيح\n\n3. **تحقق من انتهاء صلاحية API KEY**\n• تحقق من تاريخ الانتهاء في OKX API → API Management\n• إذا انتهت الصلاحية، أنشئ مفتاح API جديد\n\n4. **تحقق من الأحرف الخاصة في PassPhrase**\n• تحقق من عدم فقدان أحرف خاصة\n• أزل المسافات عند النسخ واللصق\n• أعد التأكيد من الأحرف الخاصة: `!@#$%^&*()` إلخ",
      es: "**Problema de API KEY Inválida**\n\n**Solución:**\n\n1. **Verificar Variables de Entorno en Render**\n• Ir a Render Server → Environment\n• Verificar que API KEY esté ingresada correctamente\n• Los nombres de variables deben ser exactos!\n• Ejemplo: `API_KEY`, `SECRET_KEY`, `PASSPHRASE`\n\n2. **Verificar Cuenta OKX**\n• Confirmar que la cuenta fue creada con código de invitación BuyLow\n• Verificar que API fue emitida desde la cuenta correcta\n\n3. **Verificar Expiración de API KEY**\n• Verificar fecha de expiración en OKX API → API Management\n• Si expiró, generar nueva API KEY\n\n4. **Verificar Caracteres Especiales en PassPhrase**\n• Verificar que no falten caracteres especiales en PassPhrase\n• Eliminar espacios al copiar y pegar\n• Re-confirmar caracteres especiales: `!@#$%^&*()` etc.",
      ru: "**Проблема недействительного API KEY**\n\n**Решение:**\n\n1. **Проверьте переменные окружения Render**\n• Перейдите в Render Server → Environment\n• Убедитесь, что API KEY введён правильно\n• Имена переменных должны быть точными!\n• Пример: `API_KEY`, `SECRET_KEY`, `PASSPHRASE`\n\n2. **Проверьте аккаунт OKX**\n• Убедитесь, что аккаунт создан с кодом приглашения BuyLow\n• Проверьте, что API выдан с правильного аккаунта\n\n3. **Проверьте срок действия API KEY**\n• Проверьте дату истечения в OKX API → API Management\n• Если истёк, создайте новый API KEY\n\n4. **Проверьте спецсимволы в PassPhrase**\n• Убедитесь, что спецсимволы не пропущены\n• Удалите пробелы при копировании\n• Перепроверьте спецсимволы: `!@#$%^&*()` и т.д.",
      zh: "**API KEY 无效问题**\n\n**解决方法:**\n\n1. **检查 Render 环境变量**\n• 前往 Render 服务器 → Environment\n• 确认 API KEY 输入正确\n• 变量名必须完全正确!\n• 例如: `API_KEY`, `SECRET_KEY`, `PASSPHRASE`\n\n2. **检查 OKX 账户**\n• 确认账户是使用 BuyLow 邀请码注册的\n• 确认 API 是从正确的账户发放的\n\n3. **检查 API KEY 有效期**\n• 在 OKX API → API Management 中检查到期日期\n• 如已过期，需要生成新的 API KEY\n\n4. **检查 PassPhrase 特殊字符**\n• 确认 PassPhrase 中特殊字符没有遗漏\n• 复制粘贴时删除前后空格\n• 重新确认特殊字符: `!@#$%^&*()` 等",
      id: "**Error API KEY Tidak Valid**\n\n**Solusi:**\n\n1. **Periksa Variabel Lingkungan Render**\n• Buka Render Server → Environment\n• Verifikasi API KEY dimasukkan dengan benar\n• Nama variabel harus tepat!\n\n2. **Periksa Akun OKX**\n• Konfirmasi akun dibuat dengan kode undangan BuyLow\n\n3. **Periksa Kedaluwarsa API KEY**\n• Periksa tanggal kedaluwarsa di OKX API → API Management\n\n4. **Periksa Karakter Khusus PassPhrase**\n• Verifikasi tidak ada karakter khusus yang hilang",
      th: "**ข้อผิดพลาด API KEY ไม่ถูกต้อง**\n\n**วิธีแก้ไข:**\n\n1. **ตรวจสอบตัวแปรสภาพแวดล้อม Render**\n• ไปที่ Render Server → Environment\n• ตรวจสอบว่าป้อน API KEY ถูกต้อง\n\n2. **ตรวจสอบบัญชี OKX**\n• ยืนยันว่าบัญชีสร้างด้วยรหัสเชิญ BuyLow\n\n3. **ตรวจสอบวันหมดอายุ API KEY**\n• ตรวจสอบวันหมดอายุใน OKX API → API Management\n\n4. **ตรวจสอบอักขระพิเศษ PassPhrase**",
      vi: "**Lỗi API KEY Không Hợp Lệ**\n\n**Giải pháp:**\n\n1. **Kiểm tra Biến Môi Trường Render**\n• Vào Render Server → Environment\n• Xác minh API KEY đã nhập đúng\n\n2. **Kiểm tra Tài Khoản OKX**\n• Xác nhận tài khoản được tạo bằng mã mời BuyLow\n\n3. **Kiểm tra Hạn API KEY**\n• Kiểm tra ngày hết hạn trong OKX API → API Management\n\n4. **Kiểm tra Ký Tự Đặc Biệt PassPhrase**",
      tr: "**API KEY Geçersiz Hatası**\n\n**Çözüm:**\n\n1. **Render Ortam Değişkenlerini Kontrol Edin**\n• Render Server → Environment'a gidin\n• API KEY'in doğru girildiğini doğrulayın\n\n2. **OKX Hesabını Kontrol Edin**\n• Hesabın BuyLow davet koduyla oluşturulduğunu onaylayın\n\n3. **API KEY Son Kullanma Tarihini Kontrol Edin**\n• OKX API → API Management'ta son kullanma tarihini kontrol edin\n\n4. **PassPhrase Özel Karakterlerini Kontrol Edin**",
    },
  },
  {
    id: 2,
    question: {
      en: "What is the minimum investment amount?",
      ko: "최소 투자 금액은 얼마인가요?",
      ar: "ما هو الحد الأدنى لمبلغ الاستثمار؟",
      es: "¿Cuál es el monto mínimo de inversión?",
      ru: "Какова минимальная сумма инвестиций?",
      zh: "最低投资金额是多少？",
      id: "Berapa jumlah investasi minimum?",
      th: "จำนวนเงินลงทุนขั้นต่ำคือเท่าไหร่?",
      vi: "Số tiền đầu tư tối thiểu là bao nhiêu?",
      tr: "Minimum yatırım tutarı nedir?",
    },
    answer: {
      en: "The minimum investment depends on the exchange and strategy settings.\n\nMost users start with 500–1000 USDT or more for stable operation.",
      ko: "최소 투자 금액은 거래소와 전략 설정에 따라 달라집니다.\n\n일반적으로 500~1000 USDT 이상으로 시작하는 것이 안정적인 운용에 도움이 됩니다.",
      ar: "يعتمد الحد الأدنى للاستثمار على المنصة وإعدادات الاستراتيجية.\n\nعادة يبدأ المستخدمون بمبلغ 500 إلى 1000 USDT أو أكثر لتحقيق استقرار أفضل.",
      es: "La inversión mínima depende del exchange y de la estrategia utilizada.\n\nLa mayoría de usuarios comienza con 500–1000 USDT o más.",
      ru: "Минимальная сумма зависит от биржи и настроек стратегии.\n\nБольшинство пользователей начинают с 500–1000 USDT и выше.",
      zh: "最低投资金额取决于交易所和策略设置。\n\n大多数用户通常从 500–1000 USDT 或以上开始。",
      id: "Investasi minimum tergantung pada bursa dan pengaturan strategi.\n\nSebagian besar pengguna mulai dengan 500–1000 USDT atau lebih untuk operasi yang stabil.",
      th: "การลงทุนขั้นต่ำขึ้นอยู่กับการแลกเปลี่ยนและการตั้งค่ากลยุทธ์\n\nผู้ใช้ส่วนใหญ่เริ่มต้นด้วย 500–1000 USDT หรือมากกว่าเพื่อการดำเนินงานที่มั่นคง",
      vi: "Mức đầu tư tối thiểu phụ thuộc vào sàn giao dịch và cài đặt chiến lược.\n\nHầu hết người dùng bắt đầu với 500–1000 USDT hoặc hơn để hoạt động ổn định.",
      tr: "Minimum yatırım, borsa ve strateji ayarlarına bağlıdır.\n\nÇoğu kullanıcı istikrarlı çalışma için 500–1000 USDT veya daha fazlasıyla başlar.",
    },
  },
  {
    id: 3,
    question: {
      en: "How does the rotation strategy work?",
      ko: "순환매 전략은 어떻게 작동하나요?",
      ar: "كيف تعمل استراتيجية التدوير؟",
      es: "¿Cómo funciona la estrategia de rotación?",
      ru: "Как работает стратегия ротации?",
      zh: "轮动策略是如何运作的？",
      id: "Bagaimana cara kerja strategi rotasi?",
      th: "กลยุทธ์การหมุนเวียนทำงานอย่างไร?",
      vi: "Chiến lược luân chuyển hoạt động như thế nào?",
      tr: "Rotasyon stratejisi nasıl çalışır?",
    },
    answer: {
      en: "**Rotation (Infinite Loop)** is a strategy that lowers the average entry price through split entries during price drops, and secures re-entry capacity by partially closing during rebounds.\n\nThe core is not predicting market direction, but accumulating profits infinitely by cycling through the repetitive structure of drops and rebounds.\n\nBy endlessly repeating **buy-sell cycles** to rotate positions, profits are locked in each time a cycle completes and the next cycle immediately begins. The engine never stops, accumulating profits through **unlimited rotation** with compound interest.\n\n**1) Lower Average Price (Reduce Escape Price)**\nSystematically reduce overall position's average entry price through split buys during decline zones. As the average price decreases, the breakeven point lowers, enabling profit conversion even from small rebounds.\n\n**2) Partial Close on Each Rebound (Secure Re-entry Capacity)**\nTake partial profits (not full position) during rebounds to always maintain capacity (cash) to re-enter on the next decline. This is the core driving force of 'infinite rotation'.\n\n**3) Easier Risk Management in Downtrends**\nFollowing Fibonacci-based entry intervals and capital allocation rules enables mechanical response without emotional judgment even during sharp declines. Risk is pre-structured, enabling survival through prolonged downtrends.",
      ko: "**순환매(무한 로테이션)**란, 가격 하락 시 분할 진입으로 평단가를 낮추고, 반등 시 일부를 정리하여 재대응 여력을 확보하는 전략입니다.\n\n시장의 방향을 예측하는 것이 아니라, 하락과 반등의 반복 구조를 이용해 무한히 순환하며 수익을 누적하는 것이 핵심입니다.\n\n**매수-매도 사이클**을 끊임없이 반복하여 포지션을 순환시키며, 한 사이클이 완료될 때마다 수익을 확정하고 즉시 다음 사이클을 개시합니다. 엔진은 멈추지 않으며, **무제한 순환**을 통해 수익을 복리로 누적합니다.\n\n**1) 평단가를 낮춤 (탈출 가능한 가격을 내림)**\n하락 구간마다 분할 매수로 진입하여 전체 포지션의 평균 매입 단가를 체계적으로 절감합니다. 평단가가 낮아질수록 손익분기점이 내려가므로, 작은 반등에서도 수익 전환이 가능합니다.\n\n**2) 반등마다 일부 정리 (재대응 여력 확보)**\n가격이 반등할 때 전량이 아닌 일부만 익절하여, 다음 하락에 다시 진입할 수 있는 여력(현금)을 항상 확보합니다. 이것이 '무한 순환'의 핵심 동력입니다.\n\n**3) 하락장에서 리스크 관리가 쉬워짐**\n피보나치 기반 진입 간격과 자본 배분 규칙을 따르므로, 급락장에서도 감정적 판단 없이 기계적으로 대응할 수 있습니다. 리스크가 사전에 구조화되어 있어 장기 하락에도 생존 가능합니다.",
      ar: "**التدوير (الحلقة اللانهائية)** هي استراتيجية تخفض متوسط سعر الدخول من خلال الدخول المجزأ أثناء انخفاض الأسعار، وتؤمن قدرة إعادة الدخول عن طريق الإغلاق الجزئي أثناء الارتدادات.\n\nالجوهر ليس التنبؤ باتجاه السوق، بل تراكم الأرباح بلا حدود من خلال الدوران عبر الهيكل المتكرر للانخفاضات والارتدادات.\n\nمن خلال تكرار **دورات البيع والشراء** بلا نهاية لتدوير المراكز، يتم تأمين الأرباح في كل مرة تكتمل فيها دورة وتبدأ الدورة التالية فوراً. المحرك لا يتوقف أبداً، ويراكم الأرباح من خلال **التدوير غير المحدود** بفائدة مركبة.\n\n**1) خفض متوسط السعر**\nتقليل متوسط سعر الدخول بشكل منهجي من خلال الشراء المجزأ أثناء مناطق الانخفاض.\n\n**2) إغلاق جزئي عند كل ارتداد**\nجني أرباح جزئية أثناء الارتدادات للحفاظ على القدرة على إعادة الدخول.\n\n**3) إدارة مخاطر أسهل في الاتجاهات الهبوطية**\nاتباع فترات دخول قائمة على فيبوناتشي وقواعد تخصيص رأس المال.",
      es: "**Rotación (Bucle Infinito)** es una estrategia que reduce el precio promedio de entrada mediante entradas divididas durante caídas de precio, y asegura capacidad de reentrada cerrando parcialmente durante rebotes.\n\nEl núcleo no es predecir la dirección del mercado, sino acumular ganancias infinitamente ciclando a través de la estructura repetitiva de caídas y rebotes.\n\nAl repetir infinitamente **ciclos de compra-venta** para rotar posiciones, las ganancias se aseguran cada vez que se completa un ciclo y el siguiente ciclo comienza inmediatamente. El motor nunca se detiene, acumulando ganancias a través de **rotación ilimitada** con interés compuesto.\n\n**1) Reducir Precio Promedio**\nReducir sistemáticamente el precio promedio de entrada mediante compras divididas durante zonas de declive.\n\n**2) Cierre Parcial en Cada Rebote**\nTomar ganancias parciales durante rebotes para mantener capacidad de reentrada.\n\n**3) Gestión de Riesgo Más Fácil en Tendencias Bajistas**\nSeguir intervalos de entrada basados en Fibonacci y reglas de asignación de capital.",
      ru: "**Ротация (Бесконечный Цикл)** — это стратегия, которая снижает среднюю цену входа через разделённые входы при падении цены и обеспечивает возможность повторного входа путём частичного закрытия при отскоках.\n\nСуть не в предсказании направления рынка, а в бесконечном накоплении прибыли через цикличную структуру падений и отскоков.\n\nБесконечно повторяя **циклы покупки-продажи** для ротации позиций, прибыль фиксируется каждый раз при завершении цикла, и следующий цикл немедленно начинается. Двигатель никогда не останавливается, накапливая прибыль через **неограниченную ротацию** со сложным процентом.\n\n**1) Снижение Средней Цены**\nСистематическое снижение средней цены входа через разделённые покупки в зонах снижения.\n\n**2) Частичное Закрытие при Каждом Отскоке**\nЧастичная фиксация прибыли при отскоках для поддержания возможности повторного входа.\n\n**3) Упрощённое Управление Рисками при Нисходящих Трендах**\nСледование интервалам входа на основе Фибоначчи и правилам распределения капитала.",
      zh: "**轮动（无限循环）**是一种在价格下跌时通过分批入场降低平均入场价，并在反弹时通过部分平仓确保再入场能力的策略。\n\n核心不是预测市场方向，而是通过下跌和反弹的重复结构无限循环累积利润。\n\n通过不断重复**买卖周期**来轮动仓位，每次周期完成时锁定利润并立即开始下一个周期。引擎永不停止，通过**无限轮动**以复利方式累积利润。\n\n**1) 降低平均价格（降低逃离价格）**\n通过在下跌区间分批买入，系统性地降低整体仓位的平均入场价。随着平均价格下降，盈亏平衡点降低，即使小幅反弹也能实现盈利。\n\n**2) 每次反弹部分平仓（确保再入场能力）**\n在反弹时获取部分利润（而非全部仓位），始终保持在下次下跌时重新入场的能力（现金）。这是无限轮动的核心驱动力。\n\n**3) 下跌趋势中更容易的风险管理**\n遵循基于斐波那契的入场间隔和资本分配���则，即使在急跌中也能无情绪判断地机械响应。风险预先结构化，能够在长期下跌中生存。",
      id: "**Rotasi (Loop Tak Terbatas)** adalah strategi yang menurunkan harga entry rata-rata melalui entry terbagi selama penurunan harga, dan mengamankan kapasitas re-entry dengan menutup sebagian selama rebound.\n\nIntinya bukan memprediksi arah pasar, tetapi mengakumulasi profit tanpa batas dengan berputar melalui struktur berulang dari penurunan dan rebound.\n\nDengan terus-menerus mengulangi **siklus beli-jual** untuk merotasi posisi, profit dikunci setiap kali siklus selesai dan siklus berikutnya segera dimulai. Mesin tidak pernah berhenti, mengakumulasi profit melalui **rotasi tanpa batas** dengan bunga majemuk.\n\n**1) Menurunkan Harga Rata-rata**\nSecara sistematis mengurangi harga entry rata-rata melalui pembelian terbagi selama zona penurunan.\n\n**2) Penutupan Sebagian di Setiap Rebound**\nMengambil profit sebagian selama rebound untuk selalu mempertahankan kapasitas re-entry.\n\n**3) Manajemen Risiko Lebih Mudah dalam Tren Turun**\nMengikuti interval entry berbasis Fibonacci dan aturan alokasi modal.",
      th: "**การหมุนเวียน (Loop ไม่สิ้นสุด)** เป็นกลยุทธ์ที่ลดราคาเข้าเฉลี่ยผ่านการเข้าแบบแบ่งในช่วงราคาตก และรักษาความสามารถในการเข้าใหม่โดยปิดบางส่วนในช่วง rebound\n\nหัวใจสำคัญไม่ใช่การทำนายทิศทางตลาด แต่เป็นการสะสมกำไรอย่างไม่สิ้นสุดโดยหมุนเวียนผ่านโครงสร้างซ้ำของการตกและ rebound\n\nด้วยการทำซ้ำ **วงจรซื้อ-ขาย** อย่างไม่สิ้นสุดเพื่อหมุนเวียนสถานะ กำไรจะถูกล็อคทุกครั้งที่วงจรเสร็จสิ้นและวงจรถัดไปเริ่มทันที เครื่องยนต์ไม่เคยหยุด สะสมกำไรผ่าน **การหมุนเวียนไม่จำกัด** ด้วยดอกเบี้ยทบต้น\n\n**1) ลดราคาเฉลี่ย**\nลดราคาเข้าเฉลี่ยอย่างเป็นระบบผ่านการซื้อแบบแบ่งในช่วงขาลง\n\n**2) ปิดบางส่วนในทุก Rebound**\nรับกำไรบางส่วนในช่วง rebound เพื่อรักษาความสามารถในการเข้าใหม่\n\n**3) การจัดการความเสี่ยงง่ายขึ้นในแนวโน้มขาลง**\nทำตามช่วงเข้าตาม Fibonacci และกฎการจัดสรรเงินทุน",
      vi: "**Luân chuyển (Vòng lặp vô hạn)** là chiến lược giảm giá vào trung bình thông qua các lệnh vào chia nhỏ trong thời gian giá giảm, và đảm bảo khả năng vào lại bằng cách đóng một phần trong thời gian hồi phục.\n\nCốt lõi không phải là dự đoán hướng thị trường, mà là tích lũy lợi nhuận vô hạn bằng cách xoay vòng qua cấu trúc lặp lại của giảm và hồi phục.\n\nBằng cách lặp đi lặp lại **chu kỳ mua-bán** để luân chuyển vị thế, lợi nhuận được khóa mỗi khi một chu kỳ hoàn thành và chu kỳ tiếp theo bắt đầu ngay lập tức. Động cơ không bao giờ dừng, tích lũy lợi nhuận thông qua **luân chuyển không giới hạn** với lãi kép.\n\n**1) Giảm Giá Trung Bình**\nGiảm giá vào trung bình một cách có hệ thống thông qua mua chia nhỏ trong các vùng giảm.\n\n**2) Đóng Một Phần ở Mỗi Lần Hồi Phục**\nChốt lời một phần trong thời gian hồi phục để luôn duy trì khả năng vào lại.\n\n**3) Quản Lý Rủi Ro Dễ Dàng Hơn trong Xu Hướng Giảm**\nTheo các khoảng vào dựa trên Fibonacci và quy tắc phân bổ vốn.",
      tr: "**Rotasyon (Sonsuz Döngü)** fiyat düşüşleri sırasında bölünmüş girişlerle ortalama giriş fiyatını düşüren ve toparlanmalar sırasında kısmen kapatarak yeniden giriş kapasitesini güvence altına alan bir stratejidir.\n\nÖz, piyasa yönünü tahmin etmek değil, düşüşlerin ve toparlanmaların tekrarlayan yapısı aracılığıyla döngüsel olarak sonsuz kar biriktirmektir.\n\nPozisyonları döndürmek için **al-sat döngülerini** sonsuza kadar tekrarlayarak, her döngü tamamlandığında karlar kilitlenir ve bir sonraki döngü hemen başlar. Motor asla durmaz, **sınırsız rotasyon** ile bileşik faizle kar biriktirir.\n\n**1) Ortalama Fiyatı Düşürme**\nDüşüş bölgelerinde bölünmüş alımlarla ortalama giriş fiyatını sistematik olarak azaltma.\n\n**2) Her Toparlanmada Kısmi Kapanış**\nYeniden giriş kapasitesini korumak için toparlanmalar sırasında kısmi kar alma.\n\n**3) Düşüş Trendlerinde Daha Kolay Risk Yönetimi**\nFibonacci tabanlı giriş aralıklarını ve sermaye tahsis kurallarını takip etme.",
    },
  },
  {
    id: 4,
    question: {
      en: "Is my investment safe with BuyLow AI?",
      ko: "BuyLow AI에서 내 투자금은 안전한가요?",
      ar: "هل استثماري آمن مع BuyLow AI؟",
      es: "¿Está segura mi inversión con BuyLow AI?",
      ru: "Безопасны ли мои инвестиции с BuyLow AI?",
      zh: "我在BuyLow AI的投资安全吗？",
      id: "Apakah investasi saya aman dengan BuyLow AI?",
      th: "การลงทุนของฉันปลอดภัยกับ BuyLow AI หรือไม่?",
      vi: "Khoản đầu tư của tôi có an toàn với BuyLow AI không?",
      tr: "BuyLow AI ile yatırımım güvende mi?",
    },
    answer: {
      en: "BuyLow AI operates with a **Non-Custodial structure**.\n\nUsers do not hand over exchange API keys to BuyLow AI. Instead, users **directly register on their own Render server and create their own Telegram bot to operate**.\n\nIn other words, BuyLow AI has the following structure:\n\n**1) Runs directly on user's server**\n• The auto-trading program runs on the Render server created by the user.\n• BuyLow AI cannot access or control that server.\n\n**2) Direct API key management**\n• Exchange API keys are entered directly by users into Render environment variables.\n• API keys are never transmitted to BuyLow AI servers or systems.\n\n**3) Funds always remain in exchange account**\n• All funds remain in the user's exchange account.\n• BuyLow AI has no authority to store or move funds.\n\n**4) Technically inaccessible**\n• BuyLow AI does not have a structure to access user API keys, trading accounts, or funds.\n• Access to user accounts is **technically impossible** by system design.\n\nBecause BuyLow AI does not store or manage user accounts or funds, **there is no centralized fund custody risk**.\n\nTherefore, BuyLow AI operates as a **completely non-custodial auto-trading structure** that does not store or manage user funds or accounts.",
      ko: "BuyLow AI는 **비수탁형(Non-Custodial) 구조**로 운영됩니다.\n\n사용자는 거래소 API 키를 BuyLow AI에 전달하는 것이 아니라, **직접 Render 서버에 등록하고 본인의 텔레그램 봇을 생성하여 운영하는 방식**입니다.\n\n즉, BuyLow AI는 다음과 같은 구조를 가지고 있습니다.\n\n**1) 사용자 서버에서 직접 실행**\n• 자동매매 프로그램은 사용자가 직접 생성한 Render 서버에서 실행됩니다.\n• BuyLow AI는 해당 서버에 접근하거나 제어할 수 없습니다.\n\n**2) API 키 직접 관리**\n• 거래소 API 키는 사용자가 직접 Render 환경 변수에 입력합니다.\n• BuyLow AI 서버나 시스템으로 API 키가 전달되지 않습니다.\n\n**3) 자금은 항상 거래소 계정에 보관**\n• 모든 자금은 사용자의 거래소 계정에 그대로 유지됩니다.\n• BuyLow AI는 자금을 보관하거나 이동시킬 권한이 없습니다.\n\n**4) 기술적으로 접근 불가능**\n• BuyLow AI는 사용자의 API 키, 거래 계정, 자금에 접근할 수 있는 구조가 아닙니다.\n• 시스템 구조상 사용자 계정에 대한 접근 자체가 **기술적으로 불가능합니다.**\n\nBuyLow AI는 사용자 계정이나 자금을 보관하지 않는 구조이기 때문에 **중앙화된 자금 보관 리스크가 존재하지 않습니다.**\n\n따라서 BuyLow AI는 **사용자의 자금이나 계정을 보관하거나 관리하지 않는 완전한 비수탁형 자동매매 구조**로 운영됩니다.",
      ar: "يعمل BuyLow AI بـ **هيكل غير وصائي**.\n\nلا يقوم المستخدمون بتسليم مفاتيح API للمنصة إلى BuyLow AI. بدلاً من ذلك، يقوم المستخدمون **بالتسجيل مباشرة على خادم Render الخاص بهم وإنشاء بوت Telegram الخاص بهم للتشغيل**.\n\n**1) يعمل مباشرة على خادم المستخدم**\n• برنامج التداول الآلي يعمل على خادم Render الذي أنشأه المستخدم.\n\n**2) إدارة مفتاح API مباشرة**\n• يتم إدخال مفاتيح API مباشرة من قبل المستخدمين.\n\n**3) الأموال تبقى دائماً في حساب المنصة**\n• جميع الأموال تبقى في حساب المستخدم في المنصة.\n\n**4) لا يمكن الوصول تقنياً**\n• الوصول إلى حسابات المستخدمين **مستحيل تقنياً** حسب تصميم النظام.\n\nلأن BuyLow AI لا يخزن حسابات أو أموال المستخدمين، **لا يوجد خطر حفظ أموال مركزي**.",
      es: "BuyLow AI opera con una **estructura No Custodial**.\n\nLos usuarios no entregan las claves API del exchange a BuyLow AI. En cambio, los usuarios **se registran directamente en su propio servidor Render y crean su propio bot de Telegram para operar**.\n\n**1) Se ejecuta directamente en el servidor del usuario**\n• El programa de trading automático se ejecuta en el servidor Render creado por el usuario.\n\n**2) Gestión directa de claves API**\n• Las claves API son ingresadas directamente por los usuarios.\n\n**3) Los fondos siempre permanecen en la cuenta del exchange**\n• Todos los fondos permanecen en la cuenta del exchange del usuario.\n\n**4) Técnicamente inaccesible**\n• El acceso a las cuentas de usuarios es **técnicamente imposible** por diseño del sistema.\n\nComo BuyLow AI no almacena cuentas o fondos de usuarios, **no existe riesgo de custodia centralizada de fondos**.",
      ru: "BuyLow AI работает с **некастодиальной структурой**.\n\nПользователи не передают API-ключи биржи в BuyLow AI. Вместо этого пользователи **напрямую регистрируются на своём собственном сервере Render и создают собственного Telegram-бота для работы**.\n\n**1) Работает напрямую на сервере пользователя**\n• Программа автоторговли работает на сервере Render, созданном пользователем.\n\n**2) Прямое управление API-ключами**\n• API-ключи вводятся пользователями напрямую.\n\n**3) Средства всегда остаются на счёте биржи**\n• Все средства остаются на счёте пользователя на бирже.\n\n**4) Технически недоступно**\n• Доступ к аккаунтам пользователей **технически невозможен** по дизайну системы.\n\nПоскольку BuyLow AI не хранит аккаунты или средства пользователей, **отсутствует риск централизованного хранения средств**.",
      zh: "BuyLow AI 采用**非托管结构**运营。\n\n用户不会将交易所 API 密钥交给 BuyLow AI。相反，用户**直接在自己的 Render 服务器上注册并创建自己的 Telegram 机器人来运营**。\n\n**1) 直接在用户服务器上运行**\n• 自动交易程序在用户创建的 Render 服务器上运行。\n• BuyLow AI 无法访问或控制该服务器。\n\n**2) 直接管理 API 密钥**\n• 交易所 API 密钥由用户直接输入到 Render 环境变量中。\n• API 密钥永远不会传输到 BuyLow AI 服务器或系统。\n\n**3) 资金始终保留在交易所账户中**\n• 所有资金保留在用户的交易所账户中。\n• BuyLow AI 无权存储或转移资金。\n\n**4) 技术上无法访问**\n• BuyLow AI 没有访问用户 API 密钥、交易账户或资金的结构。\n• 按系统设计，访问用户账户在**技术上是不可能的**。\n\n由于 BuyLow AI 不存储或管理用户账户或资金，**不存在中心化资金托管风险**。\n\n因此，BuyLow AI 作为**完全非托管的自动交易结构**运营，不存储或管理用户资金或账户。",
      id: "BuyLow AI beroperasi dengan **struktur Non-Custodial**.\n\nPengguna tidak menyerahkan kunci API bursa ke BuyLow AI. Sebaliknya, pengguna **langsung mendaftar di server Render mereka sendiri dan membuat bot Telegram mereka sendiri untuk beroperasi**.\n\nDengan kata lain, BuyLow AI memiliki struktur berikut:\n\n**1) Berjalan langsung di server pengguna**\n• Program auto-trading berjalan di server Render yang dibuat oleh pengguna.\n• BuyLow AI tidak dapat mengakses atau mengontrol server tersebut.\n\n**2) Manajemen kunci API langsung**\n• Kunci API bursa dimasukkan langsung oleh pengguna ke variabel lingkungan Render.\n• Kunci API tidak pernah ditransmisikan ke server atau sistem BuyLow AI.\n\n**3) Dana selalu tetap di akun bursa**\n• Semua dana tetap di akun bursa pengguna.\n• BuyLow AI tidak memiliki wewenang untuk menyimpan atau memindahkan dana.\n\n**4) Secara teknis tidak dapat diakses**\n• BuyLow AI tidak memiliki struktur untuk mengakses kunci API pengguna, akun trading, atau dana.\n• Akses ke akun pengguna **secara teknis tidak mungkin** berdasarkan desain sistem.\n\nKarena BuyLow AI tidak menyimpan atau mengelola akun atau dana pengguna, **tidak ada risiko kustodi dana terpusat**.",
      th: "BuyLow AI ดำเนินงานด้วย **โครงสร้าง Non-Custodial**\n\nผู้ใช้ไม่ส่งมอบคีย์ API ของแลกเปลี่ยนให้ BuyLow AI แต่ผู้ใช้ **ลงทะเบียนโดยตรงบนเซิร์ฟเวอร์ Render ของตนเองและสร้างบอท Telegram ของตนเองเพื่อดำเนินการ**\n\nกล่าวอีกนัยหนึ่ง BuyLow AI มีโครงสร้างดังนี้:\n\n**1) ทำงานโดยตรงบนเซิร์ฟเวอร์ของผู้ใช้**\n• โปรแกรมเทรดอัตโนมัติทำงานบนเซิร์ฟเวอร์ Render ที่ผู้ใช้สร้างขึ้น\n• BuyLow AI ไม่สามารถเข้าถึงหรือควบคุมเซิร์ฟเวอร์นั้นได้\n\n**2) การจัดการคีย์ API โดยตรง**\n• คีย์ API แลกเปลี่ยนถูกป้อนโดยตรงโดยผู้ใช้ในตัวแปรสภาพแวดล้อม Render\n• คีย์ API ไม่เคยถูกส่งไปยังเซิร์ฟเวอร์หรือระบบ BuyLow AI\n\n**3) เงินทุนอ��ู่ในบัญชีแลกเปลี่ยนเสมอ**\n• เงินทุนทั้งหมดอยู่ในบัญชีแลกเปลี่ยนของผู้ใช้\n• BuyLow AI ไม่มีอำนาจในการจัดเก็บหรือย้ายเงินทุน\n\n**4) ไม่สามารถเข้าถึงได้ทางเทคนิค**\n• BuyLow AI ไม่มีโครงสร้างในการเข้าถึงคีย์ API บัญชีเทรด หรือเงินทุนของผู้ใช้\n• การเข้าถึงบัญชีผู้ใช้ **เป็นไปไม่ได้ทางเทคนิค** ตามการออกแบบระบบ\n\nเนื่องจาก BuyLow AI ไม่จัดเก็บหรือจัดการบัญชีหรือเงินทุนของผู้ใช้ **จึงไม่มีความเสี่ยงในการดูแลเงินทุนแบบรวมศูนย์**",
      vi: "BuyLow AI hoạt động với **cấu trúc Non-Custodial**.\n\nNgười dùng không giao khóa API sàn giao dịch cho BuyLow AI. Thay vào đó, người dùng **trực tiếp đăng ký trên máy chủ Render của riêng họ và tạo bot Telegram riêng để vận hành**.\n\nNói cách khác, BuyLow AI có cấu trúc như sau:\n\n**1) Chạy trực tiếp trên máy chủ của người dùng**\n• Chương trình giao dịch tự động chạy trên máy chủ Render do người dùng tạo.\n• BuyLow AI không thể truy cập hoặc kiểm soát máy chủ đó.\n\n**2) Quản lý khóa API trực tiếp**\n• Khóa API sàn giao dịch được người dùng nhập trực tiếp vào biến môi trường Render.\n• Khóa API không bao giờ được truyền đến máy chủ hoặc hệ thống BuyLow AI.\n\n**3) Tiền luôn nằm trong tài khoản sàn giao dịch**\n• Tất cả tiền vẫn nằm trong tài khoản sàn giao dịch của người dùng.\n• BuyLow AI không có quyền lưu trữ hoặc di chuyển tiền.\n\n**4) Về mặt kỹ thuật không thể truy cập**\n• BuyLow AI không có cấu trúc để truy cập khóa API, tài khoản giao dịch hoặc tiền của người dùng.\n• Việc truy cập tài khoản người dùng là **không thể về mặt kỹ thuật** theo thiết kế hệ thống.\n\nVì BuyLow AI không lưu trữ hoặc quản lý tài khoản hoặc tiền của người dùng, **không có rủi ro lưu ký tiền tập trung**.",
      tr: "BuyLow AI **Non-Custodial yapı** ile çalışır.\n\nKullanıcılar borsa API anahtarlarını BuyLow AI'a teslim etmez. Bunun yerine, kullanıcılar **doğrudan kendi Render sunucularına kaydolur ve çalıştırmak için kendi Telegram botlarını oluşturur**.\n\nBaşka bir deyişle, BuyLow AI şu yapıya sahiptir:\n\n**1) Doğrudan kullanıcının sunucusunda çalışır**\n• Otomatik işlem programı, kullanıcı tarafından oluşturulan Render sunucusunda çalışır.\n• BuyLow AI bu sunucuya erişemez veya kontrol edemez.\n\n**2) Doğrudan API anahtarı yönetimi**\n• Borsa API anahtarları doğrudan kullanıcılar tarafından Render ortam değişkenlerine girilir.\n• API anahtarları asla BuyLow AI sunucularına veya sistemlerine iletilmez.\n\n**3) Fonlar her zaman borsa hesabında kalır**\n• Tüm fonlar kullanıcının borsa hesabında kalır.\n• BuyLow AI fonları depolama veya taşıma yetkisine sahip değildir.\n\n**4) Teknik olarak erişilemez**\n• BuyLow AI, kullanıcı API anahtarlarına, işlem hesaplarına veya fonlara erişme yapısına sahip değildir.\n• Kullanıcı hesaplarına erişim sistem tasarımı gereği **teknik olarak imkansızdır**.\n\nBuyLow AI kullanıcı hesaplarını veya fonlarını depolamadığı veya yönetmediği için, **merkezi fon saklama riski yoktur**.",
    },
  },
  {
    id: 5,
    question: {
      en: "How can I withdraw my profits?",
      ko: "수익을 어떻게 출금하나요?",
      ar: "كيف يمكنني سحب أرباحي؟",
      es: "¿Cómo puedo retirar mis ganancias?",
      ru: "Как я могу вывести свою прибыль?",
      zh: "如何提取我的利润？",
      id: "Bagaimana cara menarik keuntungan saya?",
      th: "ฉันจะถอนกำไรได้อย่างไร?",
      vi: "Làm thế nào để rút lợi nhuận?",
      tr: "Kârımı nasıl çekebilirim?",
    },
    answer: {
      en: "You can withdraw profits directly from your exchange account at any time.\n\nSince BuyLow AI uses a non-custodial model, all your funds and profits remain in your personal exchange wallet.",
      ko: "수익금은 언제든지 거래소 계정에서 직접 출금할 수 있습니다.\n\nBuyLow AI는 비수탁 모델을 사용하므로 모든 자금과 수익은 개인 거래소 지갑에 남아 있습니다.",
      ar: "يمكنك سحب الأرباح مباشرة من حسابك في المنصة في أي وقت.\n\nنظرًا لأن BuyLow AI يستخدم نموذجًا غير وصائي، فإن جميع أموالك وأرباحك تبقى في محفظتك الشخصية في المنصة.",
      es: "Puedes retirar tus ganancias directamente desde tu cuenta del exchange en cualquier momento.\n\nDado que BuyLow AI utiliza un modelo no custodial, todos tus fondos y ganancias permanecen en tu billetera personal del exchange.",
      ru: "Вы можете вывести прибыль напрямую из своего аккаунта на бирже в любое время.\n\nПоскольку BuyLow AI использует некустодиальную модель, все ваши средства и прибыль остаются в вашем личном кошельке на бирже.",
      zh: "用户可以随时从交易所账户直接提现利润。\n\n由于 BuyLow AI 采用非托管模式，您所有的资金和利润都保留在您个人的交易所钱包中。",
      id: "Anda dapat menarik keuntungan langsung dari akun bursa Anda kapan saja.\n\nKarena BuyLow AI menggunakan model non-custodial, semua dana dan keuntungan Anda tetap di dompet bursa pribadi Anda.",
      th: "คุณสามารถถอนกำไรได้โดยตรงจากบัญชีแลกเปลี่ยนของคุณได้ตลอดเวลา\n\nเนื่องจาก BuyLow AI ใช้โมเดลแบบ non-custodial เงินทุนและกำไรทั้งหมดของคุณจึงอยู่ในกระเป๋าเงินส่วนตัวของคุณ",
      vi: "Bạn có thể rút lợi nhuận trực tiếp từ tài khoản sàn giao dịch của mình bất cứ lúc nào.\n\nVì BuyLow AI sử dụng mô hình non-custodial, tất cả tiền và lợi nhuận của bạn vẫn nằm trong ví sàn giao dịch cá nhân của bạn.",
      tr: "Kârınızı istediğiniz zaman doğrudan borsa hesabınızdan çekebilirsiniz.\n\nBuyLow AI saklama dışı bir model kullandığından, tüm fonlarınız ve kârlarınız kişisel borsa cüzdanınızda kalır.",
    },
  },
]

// Additional questions for "View All" (6-15)
const additionalQuestions: QuestionData[] = [
  {
    id: 6,
    question: {
      en: "My bot is set up correctly but no positions are opening",
      ko: "봇 세팅이 완료��었는데 포지션이 진입되지 않습니다",
      ar: "إعداد البوت مكتمل ولكن لم يتم فتح أي صفقات",
      es: "Mi bot está configurado correctamente pero no se abren posiciones",
      ru: "Бот настроен правильно, но позиции не открываются",
      zh: "机器人设置正确但未开仓",
      id: "Bot saya sudah diatur dengan benar tapi tidak ada posisi yang terbuka",
      th: "บอทของฉันตั้งค่าถูกต้องแล้วแต่ไม่มีการเปิดสถานะ",
      vi: "Bot của tôi đã được cài đặt đúng nhưng không có vị thế nào được mở",
      tr: "Botum doğru şekilde kuruldu ancak pozisyonlar açılmıyor",
    },
    answer: {
      en: "**Position Entry Issue**\n\n**Solution:**\n\n1. **Check Position Mode**\n• OKX Settings → Trade Settings\n• Must be set to **Hedge Mode**\n• One-way Mode is not supported\n\n2. **Check Fibonacci Conditions**\n• Verify if current chart meets Fibonacci conditions\n• Waiting state is normal if conditions are not met\n\n3. **Check USDT Location**\n• Confirm USDT has been moved to **Trading** account\n• Need to transfer from Funding → Trading\n• OKX App → Assets → Transfer\n\n4. **Check Minimum Entry Amount**\n• Verify entry amount meets minimum order requirements\n• For BTC: minimum 0.001 BTC or ~100 USDT (with leverage)",
      ko: "**포지션 진입 불가 문제**\n\n**해결 방법:**\n\n1. **Position Mode 확인**\n• OKX 설정 → Trade Settings\n• **Hedge Mode**로 설정되어 있어야 함\n• One-way Mode는 지원하지 않음\n\n2. **피보나치 조건 확인**\n• 현재 차트가 피보나치 조건을 충족하는지 확인\n• 조건 미충족 시 대기 상태가 정상\n\n3. **USDT 위치 확인**\n• USDT가 **Trading** 계좌로 옮겨졌는지 확인\n• Funding → Trading으로 이동 필요\n• OKX 앱 → Assets → Transfer 사용\n\n4. **최소 진입 금액 확인**\n• 설정된 진입 금액이 최소 주문 가능 금액 이상인지 확인\n• BTC의 경우 최소 0.001 BTC 또는 약 100 USDT (레버리지 포함)",
      ar: "**مشكلة دخول الصفقات**\n\n**الحل:**\n\n1. **تحقق من وضع الصفقات**\n• إعدادات OKX → Trade Settings\n• يجب ضبطه على **Hedge Mode**\n• وضع One-way غير مدعوم\n\n2. **تحقق من شروط فيبوناتشي**\n• تأكد من أن الرسم البياني يستوفي شروط فيبوناتشي\n• حالة الانتظار طبيعية إذا لم تتحقق الشروط\n\n3. **تحقق من موقع USDT**\n• تأكد من نقل USDT إلى حساب **Trading**\n• يجب النقل من Funding → Trading\n• تطبيق OKX → Assets → Transfer\n\n4. **تحقق من الحد الأدنى للدخول**\n• تأكد من أن مبلغ الدخول يلبي الحد الأدنى للطلب\n• لـ BTC: الحد الأدنى 0.001 BTC أو ~100 USDT (مع الرافعة)",
      es: "**Problema de Entrada de Posición**\n\n**Solución:**\n\n1. **Verificar Position Mode**\n• Configuración de OKX → Trade Settings\n• Debe estar en **Hedge Mode**\n• One-way Mode no está soportado\n\n2. **Verificar Condiciones de Fibonacci**\n• Confirmar si el gráfico actual cumple las condiciones de Fibonacci\n• Estado de espera es normal si no se cumplen las condiciones\n\n3. **Verificar Ubicación de USDT**\n• Confirmar que USDT se ha movido a la cuenta **Trading**\n• Necesita transferir de Funding → Trading\n• App OKX → Assets → Transfer\n\n4. **Verificar Monto Mínimo de Entrada**\n• Verificar que el monto de entrada cumple los requisitos mínimos\n• Para BTC: mínimo 0.001 BTC o ~100 USDT (con apalancamiento)",
      ru: "**Проблема с открытием позиций**\n\n**Решение:**\n\n1. **Проверьте режим позиций**\n• Настройки OKX → Trade Settings\n• Должен быть установлен **Hedge Mode**\n• One-way Mode не поддерживается\n\n2. **Проверьте условия Фибоначчи**\n• Убедитесь, что текущий график соответствует условиям Фибоначчи\n• Состояние ожидания нормально, если условия не выполнены\n\n3. **Проверьте расположение USDT**\n• Убедитесь, что USDT переведены на счет **Trading**\n• Нужен перевод из Funding → Trading\n• Приложение OKX → Assets → Transfer\n\n4. **Проверьте минимальную сумму входа**\n• Убедитесь, что сумма входа соответствует минимальным требованиям\n• Для BTC: минимум 0.001 BTC или ~100 USDT (с плечом)",
      zh: "**无法开仓问题**\n\n**解决方法:**\n\n1. **检查持仓模式**\n• OKX 设置 → Trade Settings\n• 必须设置为 **Hedge Mode**\n• 不支持 One-way Mode\n\n2. **检查斐波那契条件**\n• 确认当前图表是否满足斐波那契条件\n• 如条件未满足，等待状态是正常的\n\n3. **检查 USDT 位置**\n• 确认 USDT 已转移到 **Trading** 账户\n• 需要从 Funding → Trading 转账\n• OKX 应用 → Assets → Transfer\n\n4. **检查最小入场金额**\n• 确认入场金额满足最低订单要求\n• BTC: 最低 0.001 BTC 或约 100 USDT（含杠杆）",
    },
  },
  {
    id: 7,
    question: {
      en: "I deposited funds but the bot balance shows zero",
      ko: "입금했는데 봇 잔액이 0으로 표시됩니다",
      ar: "قمت بالإيداع لكن رصيد البوت يظهر صفر",
      es: "Deposité fondos pero el saldo del bot muestra cero",
      ru: "Внес депозит, но баланс бота показывает ноль",
      zh: "已入金但机器人余额显示为零",
      id: "Saya sudah deposit tapi saldo bot menunjukkan nol",
      th: "ฉันฝากเงินแล้วแต่ยอดคงเหลือของบอทแสดงเป็นศูนย์",
      vi: "Tôi đã nạp tiền nhưng số dư bot hiển thị bằng không",
      tr: "Para yatırdım ama bot bakiyesi sıfır gösteriyor",
    },
    answer: {
      en: "**Balance Shows Zero Issue**\n\n**Solution:**\n\n1. **Check Account Mode**\n• OKX Settings → Account Mode\n• Must be set to **Futures Mode**\n• Single-currency margin or Multi-currency margin\n\n2. **Check USDT Location**\n• Confirm USDT is in **Trading** account\n• Balance shows 0 if in Funding account\n• Assets → Transfer → Funding to Trading\n\n3. **Check Account Level**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot - Cannot trade futures",
      ko: "**잔액 0 표시 문제**\n\n**해결 방법:**\n\n1. **Account Mode 확인**\n• OKX 설정 → Account Mode\n• **Futures Mode** (선물 모드)로 설정 필요\n• Single-currency margin 또는 Multi-currency margin\n\n2. **USDT 위치 확인**\n• USDT가 **Trading** 계좌에 있는지 확인\n• Funding 계좌에 있으면 잔액 0으로 표시됨\n• Assets → Transfer → Funding to Trading\n\n3. **계정 레벨 확인**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot (현물) - 선물 거래 불가",
      ar: "**مشكلة عرض الرصيد صفر**\n\n**الحل:**\n\n1. **تحقق من وضع الحساب**\n• إعدادات OKX → Account Mode\n• يجب ضبطه على **Futures Mode**\n• Single-currency margin أو Multi-currency margin\n\n2. **تحقق من موقع USDT**\n• تأكد من أن USDT في حساب **Trading**\n• يظهر الرصيد 0 إذا كان في حساب Funding\n• Assets → Transfer → Funding to Trading\n\n3. **تحقق من مستوى الحساب**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot - لا يمكن تداول العقود الآجلة",
      es: "**Problema de Saldo Cero**\n\n**Solución:**\n\n1. **Verificar Account Mode**\n• Configuración de OKX → Account Mode\n• Debe estar en **Futures Mode**\n• Single-currency margin o Multi-currency margin\n\n2. **Verificar Ubicación de USDT**\n• Confirmar que USDT está en cuenta **Trading**\n• El saldo muestra 0 si está en cuenta Funding\n• Assets → Transfer → Funding to Trading\n\n3. **Verificar Nivel de Cuenta**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot - No puede operar futuros",
      ru: "**Проблема отображения нулевого баланса**\n\n**Решение:**\n\n1. **Проверьте режим аккаунта**\n• Настройки OKX → Account Mode\n• Должен быть установлен **Futures Mode**\n• Single-currency margin или Multi-currency margin\n\n2. **Проверьте расположение USDT**\n• Убедитесь, что USDT на счете **Trading**\n• Баланс показывает 0, если на счете Funding\n• Assets → Transfer → Funding to Trading\n\n3. **Проверьте уровень аккаунта**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot - Фьючерсы недоступны",
      zh: "**余额显示为零问题**\n\n**解决方法:**\n\n1. **检查账户模式**\n• OKX 设置 → Account Mode\n• 必须设置为 **Futures Mode**\n• Single-currency margin 或 Multi-currency margin\n\n2. **检查 USDT 位置**\n• 确认 USDT 在 **Trading** 账户中\n• 如在 Funding 账户则显示余额为 0\n• Assets → Transfer → Funding to Trading\n\n3. **检查账户级别**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot - 无法交易合约",
      id: "**Masalah Saldo Menunjukkan Nol**\n\n**Solusi:**\n\n1. **Periksa Account Mode**\n• Pengaturan OKX → Account Mode\n• Harus diatur ke **Futures Mode**\n• Single-currency margin atau Multi-currency margin\n\n2. **Periksa Lokasi USDT**\n• Konfirmasi USDT ada di akun **Trading**\n• Saldo menunjukkan 0 jika di akun Funding\n• Assets → Transfer → Funding to Trading\n\n3. **Periksa Level Akun**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot - Tidak bisa trading futures",
      th: "**ปัญหายอดคงเหลือแสดงเป็นศูนย์**\n\n**วิธีแก้ไข:**\n\n1. **ตรวจสอบ Account Mode**\n• ตั้งค่า OKX → Account Mode\n• ต้องตั้งค่าเป็น **Futures Mode**\n• Single-currency margin หรือ Multi-currency margin\n\n2. **ตรวจสอบตำแหน่ง USDT**\n• ยืนยันว่า USDT อยู่ในบัญชี **Trading**\n• ยอดคงเหลือแสดง 0 ถ้าอยู่ในบัญชี Funding\n• Assets → Transfer → Funding to Trading\n\n3. **ตรวจสอบระดับบัญชี**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot - ไม่สามารถเทรด futures ได้",
      vi: "**Vấn Đề Số Dư Hiển Thị Bằng Không**\n\n**Giải pháp:**\n\n1. **Kiểm tra Account Mode**\n• Cài đặt OKX → Account Mode\n• Phải được đặt thành **Futures Mode**\n• Single-currency margin hoặc Multi-currency margin\n\n2. **Kiểm tra Vị trí USDT**\n• Xác nhận USDT nằm trong tài khoản **Trading**\n• Số dư hiển thị 0 nếu ở tài khoản Funding\n• Assets → Transfer → Funding to Trading\n\n3. **Kiểm tra Cấp độ Tài khoản**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot - Không thể giao dịch futures",
      tr: "**Bakiye Sıfır Gösteriyor Sorunu**\n\n**Çözüm:**\n\n1. **Hesap Modunu Kontrol Edin**\n• OKX Ayarları → Account Mode\n• **Futures Mode** olarak ayarlanmalı\n• Single-currency margin veya Multi-currency margin\n\n2. **USDT Konumunu Kontrol Edin**\n• USDT'nin **Trading** hesabında olduğunu onaylayın\n• Funding hesabındaysa bakiye 0 gösterir\n• Assets → Transfer → Funding to Trading\n\n3. **Hesap Seviyesini Kontrol Edin**\n• acctLv = 2: Single-currency margin (Futures) ✓\n• acctLv = 3: Multi-currency margin ✓\n• acctLv = 1: Spot - Vadeli işlem yapılamaz",
    },
  },
  {
    id: 8,
    question: {
      en: "I typed /start in Telegram but the bot does not respond",
      ko: "텔레그램에서 /start를 입력했는데 봇이 응답하지 않습니다",
      ar: "كتبت /start في تيليجرام لكن البوت لا يستجيب",
      es: "Escribí /start en Telegram pero el bot no responde",
      ru: "Ввел /start в Telegram, но бот не отвечает",
      zh: "在Telegram中输入/start但机器人无响应",
      id: "Saya mengetik /start di Telegram tapi bot tidak merespons",
      th: "ฉันพิมพ์ /start ใน Telegram แต่บอทไม่ตอบสนอง",
      vi: "Tôi đã gõ /start trong Telegram nhưng bot không phản hồi",
      tr: "Telegram'da /start yazdım ama bot yanıt vermiyor",
    },
    answer: {
      en: "**Telegram Bot No Response Issue**\n\n**Solution:**\n\n1. **Check Render Service Registration**\n• Have you completed all steps of Render service registration?\n• Verify the service is running properly\n• Check status in Render dashboard\n\n2. **Check Telegram Bot Token**\n• Verify the token from BotFather is entered correctly\n• Double-check for any typos\n• Remove leading/trailing spaces when copying token\n• Ensure format is number:letters combination\n• Also verify Telegram Chat ID is correct (don't confuse with token)",
      ko: "**텔레그램 봇 무응답 문제**\n\n**해결 방법:**\n\n1. **Render 서비스 등록 완료 확인**\n• Render 서비스에 등록하는 모든 절차를 완료하셨습니까?\n• 서비스가 정상적으로 실행 중인지 확인\n• Render 대시보드에서 상태 확인\n\n2. **텔레그램 봇 토큰 확인**\n• BotFather에서 발급받은 토큰을 정확히 등록했는지 확인\n• 잘못 입력되지 않았는지 재확인\n• 토큰 복사 시 앞뒤 공백 제거 및 숫자:영어 조합으로 입력했는지 확인\n• 텔레그램 Chat ID도 정확히 입력했는지 확인 (토큰과 헷갈리지 않았는지 확인)",
      ar: "**مشكلة عدم استجابة بوت تيليجرام**\n\n**الحل:**\n\n1. **تحقق من اكتمال تسجيل خدمة Render**\n• هل أكملت جميع خطوات تسجيل خدمة Render؟\n• تحقق من أن الخدمة تعمل بشكل صحيح\n• تحقق من الحالة في لوحة Render\n\n2. **تحقق من رمز بوت تيليجرام**\n• تأكد من إدخال الرمز من BotFather بشكل صحيح\n• تحقق مرة أخرى من عدم وجود أخطاء إملائية\n• أزل المسافات عند نسخ الرمز\n• تأكد من أن الصيغة هي أرقام:حروف\n• تحقق أيضًا من صحة Chat ID (لا تخلط بينه وبين الرمز)",
      es: "**Problema de Bot de Telegram Sin Respuesta**\n\n**Solución:**\n\n1. **Verificar Registro de Servicio Render**\n• ¿Has completado todos los pasos del registro de Render?\n• Verifica que el servicio esté ejecutándose correctamente\n• Revisa el estado en el panel de Render\n\n2. **Verificar Token del Bot de Telegram**\n• Verifica que el token de BotFather esté ingresado correctamente\n• Revisa que no haya errores de escritura\n• Elimina espacios al copiar el token\n• Asegúrate de que el formato sea números:letras\n• También verifica que el Chat ID sea correcto (no confundir con token)",
      ru: "**Проблема с отсутствием ответа Telegram бота**\n\n**Решение:**\n\n1. **Проверьте регистрацию сервиса Render**\n• Завершили ли вы все шаги регистрации в Render?\n• Убедитесь, что сервис работает корректно\n• Проверьте статус в панели Render\n\n2. **Проверьте токен Telegram бота**\n• Убедитесь, что токен от BotFather введён правильно\n• Перепроверьте на наличие опечаток\n• Удалите пробелы при копировании токена\n• Убедитесь, что формат: цифры:буквы\n• Также проверьте правильность Chat ID (не путайте с токеном)",
      zh: "**Telegram 机器人无响应问题**\n\n**解决方法:**\n\n1. **检查 Render 服务注册完成**\n• 是否已完成 Render 服务的所有注册步骤？\n• 确认服务正在正常运行\n• 在 Render 仪表板中检查状态\n\n2. **检查 Telegram Bot Token**\n• 确认从 BotFather 获取的 Token 输入正确\n• 再次检查是否有输入错误\n• 复制 Token 时删除前后空格\n• 确保格式为 数字:字母 组合\n• 同时确认 Chat ID 正确（不要与 Token 混淆）",
      id: "**Masalah Bot Telegram Tidak Merespons**\n\n**Solusi:**\n\n1. **Periksa Pendaftaran Layanan Render**\n• Apakah Anda sudah menyelesaikan semua langkah pendaftaran layanan Render?\n• Verifikasi layanan berjalan dengan benar\n• Periksa status di dashboard Render\n\n2. **Periksa Token Bot Telegram**\n• Verifikasi token dari BotFather dimasukkan dengan benar\n• Periksa ulang kesalahan ketik\n• Hapus spasi di awal/akhir saat menyalin token\n• Pastikan format adalah kombinasi angka:huruf\n• Juga verifikasi Chat ID Telegram sudah benar (jangan bingung dengan token)",
      th: "**ปัญหาบอท Telegram ไม่ตอบสนอง**\n\n**วิธีแก้ไข:**\n\n1. **ตรวจสอบการลงทะเบียนบริการ Render**\n• คุณได้ทำทุกขั้นตอนการลงทะเบียนบริการ Render แล้วหรือยัง?\n• ตรวจสอบว่าบริการทำงานอย่างถูกต้อง\n• ตรวจสอบสถานะใน Render dashboard\n\n2. **ตรวจสอบ Token บอท Telegram**\n• ตรวจสอบว่าป้อน token จาก BotFather ถูกต้อง\n• ตรวจสอบการพิมพ์ผิดอีกครั้ง\n• ลบช่องว่างที่ต้นและท้ายเมื่อคัดลอก token\n• ให้แน่ใจว่ารูปแบบเป็น ตัวเลข:ตัวอักษร\n• ตรวจสอบ Chat ID ถูกต้องด้วย (อย่าสับสนกับ token)",
      vi: "**Vấn Đề Bot Telegram Không Phản Hồi**\n\n**Giải pháp:**\n\n1. **Kiểm tra Đăng ký Dịch vụ Render**\n• Bạn đã hoàn thành tất cả các bước đăng ký dịch vụ Render chưa?\n• Xác minh dịch vụ đang chạy đúng cách\n• Kiểm tra trạng thái trong dashboard Render\n\n2. **Kiểm tra Token Bot Telegram**\n• Xác minh token từ BotFather được nhập đúng\n• Kiểm tra lại lỗi đánh máy\n• Xóa khoảng trắng đầu/cuối khi sao chép token\n• Đảm bảo định dạng là số:chữ\n• Cũng xác minh Chat ID Telegram đúng (đừng nhầm với token)",
      tr: "**Telegram Bot Yanıt Vermiyor Sorunu**\n\n**Çözüm:**\n\n1. **Render Hizmet Kaydını Kontrol Edin**\n• Render hizmet kaydının tüm adımlarını tamamladınız mı?\n• Hizmetin düzgün çalıştığını doğrulayın\n• Render kontrol panelinde durumu kontrol edin\n\n2. **Telegram Bot Token'ını Kontrol Edin**\n• BotFather'dan alınan token'ın doğru girildiğini doğrulayın\n• Yazım hatalarını tekrar kontrol edin\n• Token kopyalarken baştaki/sondaki boşlukları kaldırın\n• Formatın sayı:harf kombinasyonu olduğundan emin olun\n• Chat ID'nin de doğru olduğunu kontrol edin (token ile karıştırmayın)",
    },
  },
  {
    id: 9,
    question: {
      en: "Telegram Bot Token or Telegram ID is not recognized in Render",
      ko: "Render에서 텔레그램 토큰 또는 ID가 인식되지 않습니다",
      ar: "لم يتم التعرف على رمز بوت تيليجرام أو المعرف في Render",
      es: "El token del bot de Telegram o el ID no se reconoce en Render",
      ru: "Токен Telegram бота или ID не распознается в Render",
      zh: "Render中无法识别Telegram Bot Token或ID",
      id: "Token Bot Telegram atau ID Telegram tidak dikenali di Render",
      th: "Token บอท Telegram หรือ ID Telegram ไม่ถูกรู้จักใน Render",
      vi: "Token Bot Telegram hoặc ID Telegram không được nhận dạng trong Render",
      tr: "Telegram Bot Token veya Telegram ID Render'da tanınmıyor",
    },
    answer: {
      en: "**Telegram Settings Recognition Issue**\n\n**Solution:**\n\n1. **Check Bot Token Format**\n• Must be `numbers:letters` combination\n• Example: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• Only tokens from BotFather are valid\n\n2. **Check Chat ID**\n• Chat ID is numbers only\n• Can be negative (for group chats)\n• Check at @userinfobot\n\n3. **Check Bot Activation**\n• Confirm /start command was sent to bot\n• Confirm bot is not blocked\n\n4. **Check Environment Variables**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• Enter exactly without spaces",
      ko: "**텔레그램 설정 인식 불가 문제**\n\n**해결 방법:**\n\n1. **Bot Token 형식 확인**\n• 반드시 `숫자:영어` 조합이어야 함\n• 예: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• BotFather에서 발급받은 토큰만 유효\n\n2. **Chat ID 확인**\n• Chat ID는 숫자만 입력\n• 음수일 수 있음 (그룹 채팅의 경우)\n• @userinfobot 에서 확인 가능\n\n3. **봇 활성화 확인**\n• 봇에게 /start 명령 전송했는지 확인\n• 봇이 차단되지 않았는지 확인\n\n4. **환경 변수 확인**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• 공백 없이 정확히 입력",
      ar: "**مشكلة التعرف على إعدادات تيليجرام**\n\n**الحل:**\n\n1. **تحقق من صيغة Bot Token**\n• يجب أن يكون مزيجًا من `أرقام:حروف`\n• مثال: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• الرموز من BotFather فقط صالحة\n\n2. **تحقق من Chat ID**\n• Chat ID أرقام فقط\n• قد يكون سالبًا (للمحادثات الجماعية)\n• تحقق عبر @userinfobot\n\n3. **تحقق من تفعيل البوت**\n• تأكد من إرسال أمر /start للبوت\n• تأكد من عدم حظر البوت\n\n4. **تحقق من متغيرات البيئة**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• أدخل بدقة بدون مسافات",
      es: "**Problema de Reconocimiento de Configuración de Telegram**\n\n**Solución:**\n\n1. **Verificar Formato de Bot Token**\n• Debe ser combinación `números:letras`\n• Ejemplo: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• Solo tokens de BotFather son válidos\n\n2. **Verificar Chat ID**\n• Chat ID es solo números\n• Puede ser negativo (para chats grupales)\n• Verificar en @userinfobot\n\n3. **Verificar Activación del Bot**\n• Confirmar que se envió comando /start al bot\n• Confirmar que el bot no está bloqueado\n\n4. **Verificar Variables de Entorno**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• Ingresar exactamente sin espacios",
      ru: "**Проблема распознавания настроек Telegram**\n\n**Решение:**\n\n1. **Проверьте формат Bot Token**\n• Должна быть комбинация `цифры:буквы`\n• Пример: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• Только токены от BotFather действительны\n\n2. **Проверьте Chat ID**\n• Chat ID только цифры\n• Может быть отрицательным (для групповых чатов)\n• Проверьте через @userinfobot\n\n3. **Проверьте активацию бота**\n• Убедитесь, что команда /start отправлена боту\n• Убедитесь, что бот не заблокирован\n\n4. **Проверьте переменные окружения**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• Введите точно без пробелов",
      zh: "**Telegram 设置无法识别问题**\n\n**解决方法:**\n\n1. **检查 Bot Token 格式**\n• 必须是 `数字:字母` 组合\n• 例如: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• 只有 BotFather 发放的 Token 有效\n\n2. **检查 Chat ID**\n• Chat ID 只能是数字\n• 可能是负数（群聊的情况）\n• 可在 @userinfobot 确认\n\n3. **检查机器人激活状态**\n• 确认已向机器人发送 /start 命令\n• 确认机器人未被屏蔽\n\n4. **检查环境变量**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• 准确输入，不要有空格",
      id: "**Masalah Pengenalan Pengaturan Telegram**\n\n**Solusi:**\n\n1. **Periksa Format Bot Token**\n• Harus kombinasi `angka:huruf`\n• Contoh: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• Hanya token dari BotFather yang valid\n\n2. **Periksa Chat ID**\n• Chat ID hanya angka\n• Bisa negatif (untuk chat grup)\n• Periksa di @userinfobot\n\n3. **Periksa Aktivasi Bot**\n• Konfirmasi perintah /start dikirim ke bot\n• Konfirmasi bot tidak diblokir\n\n4. **Periksa Variabel Lingkungan**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• Masukkan dengan tepat tanpa spasi",
      th: "**ปัญหาการรู้จักการตั้งค่า Telegram**\n\n**วิธีแก้ไข:**\n\n1. **ตรวจสอบรูปแบบ Bot Token**\n• ต้องเป็นการรวมกันของ `ตัวเลข:ตัวอักษร`\n• ตัวอย่าง: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• เฉพาะ token จาก BotFather เท่านั้นที่ใช้ได้\n\n2. **ตรวจสอบ Chat ID**\n• Chat ID เป็นตัวเลขเท่านั้น\n• อาจเป็นลบ (สำหรับแชทกลุ่ม)\n• ตรวจสอบที่ @userinfobot\n\n3. **ตรวจสอบการเปิดใช้งานบอท**\n• ยืนยันว่าส่งคำสั่ง /start ไปยังบอทแล้ว\n• ยืนยันว่าบอทไม่ถูกบล็อก\n\n4. **ตรวจสอบตัวแปรสภาพแวดล้อม**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• ป้อนอย่างแม่นยำโดยไม่มีช่องว่าง",
      vi: "**Vấn Đề Nhận Dạng Cài Đặt Telegram**\n\n**Giải pháp:**\n\n1. **Kiểm tra Định dạng Bot Token**\n• Phải là tổ hợp `số:chữ`\n• Ví dụ: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• Chỉ token từ BotFather mới hợp lệ\n\n2. **Kiểm tra Chat ID**\n• Chat ID chỉ là số\n• Có thể là số âm (cho chat nhóm)\n• Kiểm tra tại @userinfobot\n\n3. **Kiểm tra Kích hoạt Bot**\n• Xác nhận đã gửi lệnh /start đến bot\n• Xác nhận bot không bị chặn\n\n4. **Kiểm tra Biến Môi Trường**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• Nhập chính xác không có khoảng trắng",
      tr: "**Telegram Ayarları Tanıma Sorunu**\n\n**Çözüm:**\n\n1. **Bot Token Formatını Kontrol Edin**\n• `sayı:harf` kombinasyonu olmalı\n• Örnek: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`\n• Sadece BotFather'dan alınan tokenlar geçerli\n\n2. **Chat ID'yi Kontrol Edin**\n• Chat ID sadece sayı\n• Negatif olabilir (grup sohbetleri için)\n• @userinfobot'ta kontrol edin\n\n3. **Bot Aktivasyonunu Kontrol Edin**\n• Bot'a /start komutunun gönderildiğini onaylayın\n• Bot'un engellenmediğini onaylayın\n\n4. **Ortam Değişkenlerini Kontrol Edin**\n• `TELEGRAM_BOT_TOKEN`\n• `TELEGRAM_CHAT_ID`\n• Boşluk olmadan tam olarak girin",
    },
  },
  {
    id: 10,
    question: {
      en: "My Render server keeps stopping",
      ko: "Render 서버가 계속 중지됩니다",
      ar: "خادم Render يتوقف باستمرار",
      es: "Mi servidor Render sigue deteniéndose",
      ru: "Мой сервер Render постоянно останавливается",
      zh: "我的Render服务器持续停止",
      id: "Server Render saya terus berhenti",
      th: "เซิร์ฟเวอร์ Render ของฉันหยุดทำงานอยู่เรื่อยๆ",
      vi: "Máy chủ Render của tôi liên tục dừng",
      tr: "Render sunucum sürekli duruyor",
    },
    answer: {
      en: "**Render Server Stopping Issue**\n\n**Solution:**\n\n1. **Check Worker Type**\n• Must be created as **Background Worker**\n• If created as Web Service, it will auto-stop\n• Dashboard → New + → Background Worker\n\n2. **Check Region Settings**\n• **US (Oregon)** region recommended\n• Other regions may be unstable",
      ko: "**Render 서버 중지 문제**\n\n**해결 방법:**\n\n1. **Worker 유형 확인**\n• **Background Worker**로 생성해야 함\n• Web Service로 생성하면 자동 중지됨\n• Dashboard → New + → Background Worker\n\n2. **지역 설정 확인**\n• **US (Oregon)** 지역 선택 권장\n• 다른 지역 선택 시 불안정할 수 있음",
      ar: "**مشكلة توقف خادم Render**\n\n**الحل:**\n\n1. **تحقق من نوع Worker**\n• يجب إنشاؤه كـ **Background Worker**\n• إذا تم إنشاؤه كـ Web Service سيتوقف تلقائيًا\n• Dashboard → New + → Background Worker\n\n2. **تحقق من إعدادات المنطقة**\n• منطقة **US (Oregon)** موصى بها\n• المناطق الأخرى قد تكون غير مستقرة",
      es: "**Problema de Servidor Render Deteniéndose**\n\n**Solución:**\n\n1. **Verificar Tipo de Worker**\n• Debe crearse como **Background Worker**\n• Si se crea como Web Service, se detendrá automáticamente\n• Dashboard → New + → Background Worker\n\n2. **Verificar Configuración de Región**\n• Región **US (Oregon)** recomendada\n• Otras regiones pueden ser inestables",
      ru: "**Проблема остановки сервера Render**\n\n**Решение:**\n\n1. **Проверьте тип Worker**\n• Должен быть создан как **Background Worker**\n• Если создан как Web Service, будет автоматически останавливаться\n• Dashboard → New + → Background Worker\n\n2. **Проверьте настройки региона**\n• Рекомендуется регион **US (Oregon)**\n• Другие регионы могут быть нестабильны",
      zh: "**Render 服务器停止问题**\n\n**解决方法:**\n\n1. **检查 Worker 类型**\n• 必须创建为 **Background Worker**\n• 如果创建为 Web Service 会自动停止\n• Dashboard → New + → Background Worker\n\n2. **检查区域设置**\n• 推荐选择 **US (Oregon)** 区域\n• 其他区域可能不稳定",
      id: "**Masalah Server Render Berhenti**\n\n**Solusi:**\n\n1. **Periksa Jenis Worker**\n• Harus dibuat sebagai **Background Worker**\n• Jika dibuat sebagai Web Service, akan berhenti otomatis\n• Dashboard → New + → Background Worker\n\n2. **Periksa Pengaturan Region**\n• Region **US (Oregon)** disarankan\n• Region lain mungkin tidak stabil",
      th: "**ปัญหาเซิร์ฟเวอร์ Render หยุดทำงาน**\n\n**วิธีแก้ไข:**\n\n1. **ตรวจสอบประเภท Worker**\n• ต้องสร้างเป็น **Background Worker**\n• ถ้าสร้างเป็น Web Service จะหยุดอัตโนมัติ\n• Dashboard → New + → Background Worker\n\n2. **ตรวจสอบการตั้งค่า Region**\n• แนะนำ region **US (Oregon)**\n• Region อื่นอาจไม่เสถียร",
      vi: "**Vấn Đề Máy Chủ Render Dừng**\n\n**Giải pháp:**\n\n1. **Kiểm tra Loại Worker**\n• Phải được tạo dưới dạng **Background Worker**\n• Nếu tạo dưới dạng Web Service, sẽ tự động dừng\n• Dashboard → New + → Background Worker\n\n2. **Kiểm tra Cài đặt Region**\n• Khuyến nghị region **US (Oregon)**\n• Các region khác có thể không ổn định",
      tr: "**Render Sunucu Durma Sorunu**\n\n**Çözüm:**\n\n1. **Worker Türünü Kontrol Edin**\n• **Background Worker** olarak oluşturulmalı\n• Web Service olarak oluşturulursa otomatik durur\n• Dashboard → New + → Background Worker\n\n2. **Bölge Ayarlarını Kontrol Edin**\n• **US (Oregon)** bölgesi önerilir\n• Diğer bölgeler kararsız olabilir",
    },
  },
  {
    id: 11,
    question: {
      en: "What is Render service?",
      ko: "Render 서비스란 무엇인가요?",
      ar: "ما هي خدمة Render؟",
      es: "¿Qué es el servicio Render?",
      ru: "Что такое сервис Render?",
      zh: "什么是Render服务？",
      id: "Apa itu layanan Render?",
      th: "บริการ Render คืออะไร?",
      vi: "Dịch vụ Render là gì?",
      tr: "Render hizmeti nedir?",
    },
    answer: {
      en: "**Render Service Description**\n\n**What is Render?**\nA cloud service for running programs on a server.\n\n**Key Information:**\n\n1. **Cost**\n• Approximately $7/month per service\n• Additional cost when adding more symbols\n\n2. **Payment**\n• Personal card registration required\n• Monthly automatic billing\n\n3. **Stopping Charges**\n• No charges when service is stopped (can stop in Settings)\n• Run service only when needed",
      ko: "**Render 서비스 설명**\n\n**Render란?**\n프로그램을 서버에 돌리기 위한 클라우드 서비스입니다.\n\n**주요 정보:**\n\n1. **비용**\n• 서비스 1개당 월 약 $7 소모\n• 종목 추가 시 비용도 추가됨\n\n2. **결제**\n• 개인 카드 등록 필수\n• 월별 자동 결제\n\n3. **요금 중지**\n• 서비스를 중지하면 요금이 부과되지 않음 (Settings에서 중지 가능)\n• 필요할 때만 서비스 실행 가능",
      ar: "**وصف خدمة Render**\n\n**ما هو Render؟**\nخدمة سحابية لتشغيل البرامج على خادم.\n\n**معلومات رئيسية:**\n\n1. **التكلفة**\n• حوالي $7/شهر لكل خدمة\n• تكلفة إضافية عند إضافة المزيد من الرموز\n\n2. **الدفع**\n• يتطلب تسجيل بطاقة شخصية\n• فوترة شهرية تلقائية\n\n3. **إيقاف الرسوم**\n• لا رسوم عند إيقاف الخدمة (يمكن الإيقاف من Settings)\n• تشغيل الخدمة عند الحاجة فقط",
      es: "**Descripción del Servicio Render**\n\n**¿Qué es Render?**\nUn servicio en la nube para ejecutar programas en un servidor.\n\n**Información Clave:**\n\n1. **Costo**\n• Aproximadamente $7/mes por servicio\n• Costo adicional al agregar más símbolos\n\n2. **Pago**\n• Registro de tarjeta personal requerido\n• Facturación mensual automática\n\n3. **Detener Cargos**\n• Sin cargos cuando el servicio está detenido (se puede detener en Settings)\n• Ejecutar servicio solo cuando sea necesario",
      ru: "**Описание сервиса Render**\n\n**Что такое Render?**\nОблачный сервис для запуска программ на сервере.\n\n**Ключевая информация:**\n\n1. **Стоимость**\n• Примерно $7/месяц за сервис\n• Дополнительная стоимость при добавлении символов\n\n2. **Оплата**\n• Требуется регистрация личной карты\n• Ежемесячное автоматическое списание\n\n3. **Остановка платежей**\n• Без платы при остановке сервиса (можно остановить в Settings)\n• Запускайте сервис только при необходимости",
      zh: "**Render 服务说明**\n\n**什么是 Render？**\n用于在服务器上运行程序的云服务。\n\n**主要信息:**\n\n1. **费用**\n• 每个服务每月约 $7\n• 添加更多交易对时会增加费用\n\n2. **支付**\n• 需要注册个人银行卡\n• 每月自动扣款\n\n3. **停止收费**\n• 停止服务时不收费（可在 Settings 中停止）\n• 仅在需要时运行服务",
      id: "**Deskripsi Layanan Render**\n\n**Apa itu Render?**\nLayanan cloud untuk menjalankan program di server.\n\n**Informasi Utama:**\n\n1. **Biaya**\n• Sekitar $7/bulan per layanan\n• Biaya tambahan saat menambahkan lebih banyak simbol\n\n2. **Pembayaran**\n• Pendaftaran kartu pribadi diperlukan\n• Penagihan bulanan otomatis\n\n3. **Menghentikan Biaya**\n• Tidak ada biaya saat layanan dihentikan (dapat dihentikan di Settings)\n• Jalankan layanan hanya saat diperlukan",
      th: "**คำอธิบายบริการ Render**\n\n**Render คืออะไร?**\nบริการคลาวด์สำหรับรันโปรแกรมบนเซิร์ฟเวอร์\n\n**ข้อมูลสำคัญ:**\n\n1. **ค่าใช้จ่าย**\n• ประมาณ $7/เดือน ต่อบริการ\n• ค่าใช้จ่ายเพิ่มเติมเมื่อเพิ่มสัญลักษณ์มากขึ้น\n\n2. **การชำระเงิน**\n• ต้องลงทะเบียนบัตรส่วนตัว\n• เรียกเก็บเงินรายเดือนอัตโนมัติ\n\n3. **หยุดค่าใช้จ่าย**\n• ไม่มีค่าใช้จ่ายเมื่อหยุดบริการ (สามารถหยุดได้ใน Settings)\n• รันบริการเฉพาะเมื่อจำเป็น",
      vi: "**Mô Tả Dịch Vụ Render**\n\n**Render là gì?**\nDịch vụ cloud để chạy chương trình trên máy chủ.\n\n**Thông Tin Chính:**\n\n1. **Chi phí**\n• Khoảng $7/tháng mỗi dịch vụ\n• Chi phí bổ sung khi thêm nhiều symbol hơn\n\n2. **Thanh toán**\n• Yêu cầu đăng ký thẻ cá nhân\n• Thanh toán tự động hàng tháng\n\n3. **Dừng Tính Phí**\n• Không tính phí khi dịch vụ dừng (có thể dừng trong Settings)\n• Chỉ chạy dịch vụ khi cần",
      tr: "**Render Hizmeti Açıklaması**\n\n**Render nedir?**\nSunucuda program çalıştırmak için bulut hizmeti.\n\n**Temel Bilgiler:**\n\n1. **Maliyet**\n• Hizmet başına yaklaşık $7/ay\n• Daha fazla sembol eklendiğinde ek maliyet\n\n2. **Ödeme**\n• Kişisel kart kaydı gerekli\n• Aylık otomatik faturalandırma\n\n3. **Ücretleri Durdurma**\n• Hizmet durdurulduğunda ücret yok (Settings'de durdurulabilir)\n• Hizmeti sadece gerektiğinde çalıştırın",
    },
  },
  {
    id: 12,
    question: {
      en: "Network connection error on Render server",
      ko: "Render 서버에서 네트워크 연결 오류가 발생합니다",
      ar: "خطأ في اتصال الشبكة على خادم Render",
      es: "Error de conexión de red en el servidor Render",
      ru: "Ошибка сетевого подключения на сервере Render",
      zh: "Render服务器网络连接错误",
      id: "Error koneksi jaringan di server Render",
      th: "ข้อผิดพลาดการเชื่อมต่อเครือข่ายบนเซิร์ฟเวอร์ Render",
      vi: "Lỗi kết nối mạng trên máy chủ Render",
      tr: "Render sunucusunda ağ bağlantı hatası",
    },
    answer: {
      en: "**Network Error Issue**\n\n**Common Error Messages:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**Solution:**\n\n1. **Temporary Error**\n• Most are temporary network instability\n• Program automatically retries\n• Logged after 3 failed retries\n\n2. **Check OKX API Status**\n• Check OKX Status Page\n• Verify no maintenance in progress\n\n3. **Check VPN/Firewall**\n• VPN may cause connection instability\n• Check if firewall blocks API connection\n\n4. **Change Server Region**\n• Try changing Render server region\n• Oregon region recommended",
      ko: "**네트워크 오류 문제**\n\n**일반적인 오류 메시지:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**해결 방법:**\n\n1. **일시적 오류**\n• 대부분 일시적 네트워크 불안정\n• 프로그램이 자동으로 재시도함\n• 3회 재시도 후에도 실패하면 기록됨\n\n2. **OKX API 상태 확인**\n• OKX Status Page 확인\n• 점검 중이 아닌지 확인\n\n3. **VPN/방화벽 확인**\n• VPN 사용 시 연결 불안정 가능\n• 방화벽이 API 연결을 차단하는지 확인\n\n4. **서버 지역 변경**\n• Render 서버 지역 변경 시도\n• Oregon 지역 권장",
      ar: "**مشكلة خطأ الشبكة**\n\n**رسائل الخطأ الشائعة:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**الحل:**\n\n1. **خطأ مؤقت**\n• معظمها عدم استقرار مؤقت في الشبكة\n• البرنامج يعيد المحاولة تلقائيًا\n• يتم التسجيل بعد 3 محاولات فاشلة\n\n2. **تحقق من حالة OKX API**\n• تحقق من صفحة حالة OKX\n• تأكد من عدم وجود صيانة\n\n3. **تحقق من VPN/جدار الحماية**\n• VPN قد يسبب عدم استقرار الاتصال\n• تحقق من عدم حظر جدار الحماية لاتصال API\n\n4. **تغيير منطقة الخادم**\n• جرب تغيير منطقة خادم Render\n• منطقة Oregon موصى بها",
      es: "**Problema de Error de Red**\n\n**Mensajes de Error Comunes:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**Solución:**\n\n1. **Error Temporal**\n• La mayoría son inestabilidad temporal de red\n• El programa reintenta automáticamente\n• Se registra después de 3 reintentos fallidos\n\n2. **Verificar Estado de OKX API**\n• Verificar página de estado de OKX\n• Confirmar que no hay mantenimiento\n\n3. **Verificar VPN/Firewall**\n• VPN puede causar inestabilidad de conexión\n• Verificar si firewall bloquea conexión API\n\n4. **Cambiar Región del Servidor**\n• Intentar cambiar región del servidor Render\n• Región Oregon recomendada",
      ru: "**Проблема сетевой ошибки**\n\n**Распространённые сообщения об ошибках:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**Решение:**\n\n1. **Временная ошибка**\n• Большинство - временная нестабильность сети\n• Программа автоматически повторяет попытку\n• Записывается после 3 неудачных попыток\n\n2. **Проверьте статус OKX API**\n• Проверьте страницу статуса OKX\n• Убедитесь, что нет техобслуживания\n\n3. **Проверьте VPN/брандмауэр**\n• VPN может вызвать нестабильность соединения\n• Проверьте, не блокирует ли брандмауэр API\n\n4. **Смените регион сервера**\n• Попробуйте сменить регион сервера Render\n• Рекомендуется регион Oregon",
      zh: "**网络错误问题**\n\n**常见错误信息:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**解决方法:**\n\n1. **临时错误**\n• 大多数是临时网络不稳定\n• 程序会自动重试\n• 3次重试失败后会记录\n\n2. **检查 OKX API 状态**\n• 检查 OKX 状态页面\n• 确认没有维护中\n\n3. **检查 VPN/防火墙**\n• VPN 可能导致连接不稳定\n• 检查防火墙是否阻止 API 连接\n\n4. **更改服务器区域**\n• 尝试更改 Render 服务器区域\n• 推荐 Oregon 区域",
      id: "**Masalah Error Jaringan**\n\n**Pesan Error Umum:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**Solusi:**\n\n1. **Error Sementara**\n• Kebanyakan adalah ketidakstabilan jaringan sementara\n• Program secara otomatis mencoba ulang\n• Dicatat setelah 3 kali percobaan gagal\n\n2. **Periksa Status OKX API**\n• Periksa Halaman Status OKX\n• Verifikasi tidak ada pemeliharaan\n\n3. **Periksa VPN/Firewall**\n• VPN dapat menyebabkan ketidakstabilan koneksi\n• Periksa apakah firewall memblokir koneksi API\n\n4. **Ubah Region Server**\n• Coba ubah region server Render\n• Region Oregon disarankan",
      th: "**ปัญหาข้อผิดพลาดเครือข่าย**\n\n**ข้อความข้อผิดพลาดทั่วไป:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**วิธีแก้ไข:**\n\n1. **ข้อผิดพลาดชั่วคราว**\n• ส่วนใหญ่เป็นความไม่เสถียรของเครือข่ายชั่วคราว\n• โปรแกรมลองใหม่อัตโนมัติ\n• บันทึกหลังจากลองใหม่ล้มเหลว 3 ครั้ง\n\n2. **ตรวจสอบสถานะ OKX API**\n• ตรวจสอบหน้าสถานะ OKX\n• ตรวจสอบว่าไม่มีการบำรุงรักษา\n\n3. **ตรวจสอบ VPN/Firewall**\n• VPN อาจทำให้การเชื่อมต่อไม่เสถียร\n• ตรวจสอบว่า firewall บล็อกการเชื่อมต่อ API หรือไม่\n\n4. **เปลี่ยน Region เซิร์ฟเวอร์**\n• ลองเปลี่ยน region เซิร์ฟเวอร์ Render\n• แนะนำ region Oregon",
      vi: "**Vấn Đề Lỗi Mạng**\n\n**Thông Báo Lỗi Phổ Biến:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**Giải pháp:**\n\n1. **Lỗi Tạm Thời**\n• Hầu hết là mạng không ổn định tạm thời\n• Chương trình tự động thử lại\n• Ghi nhận sau 3 lần thử lại thất bại\n\n2. **Kiểm tra Trạng thái OKX API**\n• Kiểm tra Trang Trạng thái OKX\n• Xác minh không có bảo trì\n\n3. **Kiểm tra VPN/Firewall**\n• VPN có thể gây ra kết nối không ổn định\n• Kiểm tra firewall có chặn kết nối API không\n\n4. **Đổi Region Máy Chủ**\n• Thử đổi region máy chủ Render\n• Khuyến nghị region Oregon",
      tr: "**Ağ Hatası Sorunu**\n\n**Yaygın Hata Mesajları:**\n• ConnectionTerminated\n• PROTOCOL_ERROR\n• Connection aborted\n• Timeout error\n• WinError 10035/10054\n\n**Çözüm:**\n\n1. **Geçici Hata**\n• Çoğu geçici ağ kararsızlığı\n• Program otomatik olarak yeniden dener\n• 3 başarısız denemeden sonra kaydedilir\n\n2. **OKX API Durumunu Kontrol Edin**\n• OKX Durum Sayfasını kontrol edin\n• Bakım olmadığını doğrulayın\n\n3. **VPN/Firewall Kontrol Edin**\n• VPN bağlantı kararsızlığına neden olabilir\n• Firewall'un API bağlantısını engelleyip engellemediğini kontrol edin\n\n4. **Sunucu Bölgesini Değiştirin**\n• Render sunucu bölgesini değiştirmeyi deneyin\n• Oregon bölgesi önerilir",
    },
  },
  {
    id: 13,
    question: {
      en: "Leverage setting issues",
      ko: "레버리지 설정 관련 문제",
      ar: "مشاكل إعداد الرافعة المالية",
      es: "Problemas de configuración de apalancamiento",
      ru: "Проблемы с настройкой плеча",
      zh: "杠杆设置问题",
      id: "Masalah pengaturan leverage",
      th: "ปัญหาการตั้งค่า Leverage",
      vi: "Vấn đề cài đặt đòn bẩy",
      tr: "Kaldıraç ayarı sorunları",
    },
    answer: {
      en: "**Leverage Setting Issue**\n\n**Solution:**\n\n1. **Leverage 0 Error**\n• Cannot trade if leverage is set to 0\n• Set range: minimum 1x ~ maximum 125x\n\n2. **Cannot Change Leverage**\n• Cannot change while holding a position\n• Change after closing the position\n\n3. **Maximum Leverage by Symbol**\n• BTC: maximum 125x\n• Other coins: varies by symbol\n\n4. **Cross/Isolated Mode**\n• Program uses Cross mode by default\n• Check settings in OKX app beforehand",
      ko: "**레버리지 설정 문제**\n\n**해결 방법:**\n\n1. **레버리지 0 오류**\n• 레버리지가 0으로 설정되면 거래 불가\n• 최소 1x ~ 최대 125x 범위 설정\n\n2. **레버리지 변경 안됨**\n• 포지션을 보유 중이면 변경 불가\n• 포지션 종료 후 변경\n\n3. **심볼별 최대 레버리지**\n• BTC: 최대 125x\n• 기타 코인: 심볼마다 다름\n\n4. **Cross/Isolated 모드**\n• 프로그램은 기본 Cross 모드 사용\n• OKX 앱에서 미리 설정 확인",
      ar: "**مشكلة إعداد الرافعة المالية**\n\n**الحل:**\n\n1. **خطأ الرافعة 0**\n• لا يمكن التداول إذا كانت الرافعة 0\n• النطاق: الحد الأدنى 1x ~ الحد الأقصى 125x\n\n2. **لا يمكن تغيير الرافعة**\n• لا يمكن التغيير أثناء الاحتفاظ بمركز\n• قم بالتغيير بعد إغلاق المركز\n\n3. **الحد الأقصى للرافعة حسب الرمز**\n• BTC: الحد الأقصى 125x\n• العملات الأخرى: تختلف حسب الرمز\n\n4. **وضع Cross/Isolated**\n• البرنامج يستخدم وضع Cross افتراضيًا\n• تحقق من الإعدادات في تطبيق OKX مسبقًا",
      es: "**Problema de Configuración de Apalancamiento**\n\n**Solución:**\n\n1. **Error de Apalancamiento 0**\n• No se puede operar si el apalancamiento es 0\n• Rango: mínimo 1x ~ máximo 125x\n\n2. **No se Puede Cambiar el Apalancamiento**\n• No se puede cambiar mientras se tiene una posición\n• Cambiar después de cerrar la posición\n\n3. **Apalancamiento Máximo por Símbolo**\n• BTC: máximo 125x\n• Otras monedas: varía según el símbolo\n\n4. **Modo Cross/Isolated**\n• El programa usa modo Cross por defecto\n• Verificar configuración en app OKX previamente",
      ru: "**Проблема настройки плеча**\n\n**Решение:**\n\n1. **Ошибка плеча 0**\n• Нельзя торговать, если плечо установлено на 0\n• Диапазон: минимум 1x ~ максимум 125x\n\n2. **Не удается изменить плечо**\n• Нельзя изменить при открытой позиции\n• Измените после закрытия позиции\n\n3. **Максимальное плечо по символу**\n• BTC: максимум 125x\n• Другие монеты: зависит от символа\n\n4. **Режим Cross/Isolated**\n• Программа использует режим Cross по умолчанию\n• Заранее проверьте настройки в приложении OKX",
      zh: "**杠杆设置问题**\n\n**解决方法:**\n\n1. **杠杆 0 错误**\n• 杠杆设置为 0 时无法交易\n• 设置范围: 最小 1x ~ 最大 125x\n\n2. **无法更改杠杆**\n• 持有仓位时无法更改\n• 平仓后再更改\n\n3. **按交易对的最大杠杆**\n• BTC: 最大 125x\n• 其他币种: 因交易对而异\n\n4. **Cross/Isolated 模式**\n• 程序默认使用 Cross 模式\n• 提前在 OKX 应用中检查设置",
      id: "**Masalah Pengaturan Leverage**\n\n**Solusi:**\n\n1. **Error Leverage 0**\n• Tidak dapat trading jika leverage diatur ke 0\n• Rentang pengaturan: minimum 1x ~ maksimum 125x\n\n2. **Tidak Dapat Mengubah Leverage**\n• Tidak dapat diubah saat memegang posisi\n• Ubah setelah menutup posisi\n\n3. **Leverage Maksimum per Simbol**\n• BTC: maksimum 125x\n• Koin lain: bervariasi per simbol\n\n4. **Mode Cross/Isolated**\n• Program menggunakan mode Cross secara default\n• Periksa pengaturan di aplikasi OKX terlebih dahulu",
      th: "**ปัญหาการตั้งค่า Leverage**\n\n**วิธีแก้ไข:**\n\n1. **ข้อผิดพลาด Leverage 0**\n• ไม่สามารถเทรดได้ถ้า leverage ตั้งเป็น 0\n• ช่วงการตั้งค่า: ขั้นต่ำ 1x ~ สูงสุด 125x\n\n2. **ไม่สามารถเปลี่ยน Leverage**\n• ไม่สามารถเปลี่ยนได้ขณะถือสถานะ\n• เปลี่ยนหลังจากปิดสถานะ\n\n3. **Leverage สูงสุดตามสัญลักษณ์**\n• BTC: สูงสุด 125x\n• เหรียญอื่น: แตกต่างกันตามสัญลักษณ์\n\n4. **โหมด Cross/Isolated**\n• โปรแกรมใช้โหมด Cross เป็นค่าเริ่มต้น\n• ตรวจสอบการตั้งค่าในแอป OKX ล่วงหน้า",
      vi: "**Vấn Đề Cài Đặt Đòn Bẩy**\n\n**Giải pháp:**\n\n1. **Lỗi Đòn Bẩy 0**\n• Không thể giao dịch nếu đòn bẩy được đặt thành 0\n• Phạm vi cài đặt: tối thiểu 1x ~ tối đa 125x\n\n2. **Không Thể Thay Đổi Đòn Bẩy**\n• Không thể thay đổi khi đang giữ vị thế\n• Thay đổi sau khi đóng vị thế\n\n3. **Đòn Bẩy Tối Đa Theo Symbol**\n• BTC: tối đa 125x\n• Coin khác: thay đổi theo symbol\n\n4. **Chế Độ Cross/Isolated**\n• Chương trình mặc định sử dụng chế độ Cross\n• Kiểm tra cài đặt trong ứng dụng OKX trước",
      tr: "**Kaldıraç Ayarı Sorunu**\n\n**Çözüm:**\n\n1. **Kaldıraç 0 Hatası**\n• Kaldıraç 0 olarak ayarlanırsa işlem yapılamaz\n• Ayar aralığı: minimum 1x ~ maksimum 125x\n\n2. **Kaldıraç Değiştirilemiyor**\n• Pozisyon tutulurken değiştirilemez\n• Pozisyonu kapattıktan sonra değiştirin\n\n3. **Sembole Göre Maksimum Kaldıraç**\n• BTC: maksimum 125x\n• Diğer coinler: sembole göre değişir\n\n4. **Cross/Isolated Modu**\n• Program varsayılan olarak Cross modunu kullanır\n• OKX uygulamasında ayarları önceden kontrol edin",
    },
  },
  {
    id: 14,
    question: {
      en: "SL (Stop Loss) and TP (Take Profit) not working",
      ko: "SL(손절)과 TP(익절)가 작동하지 않습니다",
      ar: "SL (وقف الخسارة) و TP (جني الربح) لا يعملان",
      es: "SL (Stop Loss) y TP (Take Profit) no funcionan",
      ru: "SL (Стоп-лосс) и TP (Тейк-профит) не работают",
      zh: "SL（止损）和TP（止盈）不起作用",
      id: "SL (Stop Loss) dan TP (Take Profit) tidak berfungsi",
      th: "SL (Stop Loss) และ TP (Take Profit) ไม่ทำงาน",
      vi: "SL (Stop Loss) và TP (Take Profit) không hoạt động",
      tr: "SL (Stop Loss) ve TP (Take Profit) çalışmıyor",
    },
    answer: {
      en: "**SL/TP Not Working Issue**\n\n**Solution:**\n\n1. **Check Stop Loss Setting**\n• Verify stop loss is not set to 0\n\n2. **Check Existing Orders**\n• SL/TP orders may already be set\n\n3. **Check Position**\n• Cannot set SL/TP without an open position\n• Auto-set after position entry\n\n4. **Check Price Condition**\n• SL price too close to current price may be rejected\n• Minimum 0.1% difference required",
      ko: "**SL/TP 미작동 문제**\n\n**해결 방법:**\n\n1. **손절 확인**\n• 손절이 0으로 설정되어 있지 않은지 확인\n\n2. **기존 주문 확인**\n• 이미 SL/TP 주문이 설정되어 있을 수 있음\n\n3. **포지션 확인**\n• 포지션이 없으면 SL/TP 설정 불가\n• 포지션 진입 후 자동 설정됨\n\n4. **가격 조건 확인**\n• SL 가격이 현재 가격과 너무 가까우면 거부될 수 있음\n• 최소 0.1% 이상 차이 필요",
      ar: "**مشكلة عدم عمل SL/TP**\n\n**الحل:**\n\n1. **تحقق من إعداد وقف الخسارة**\n• تأكد من أن وقف الخسارة ليس 0\n\n2. **تحقق من الأوامر الموجودة**\n• قد تكون أوامر SL/TP مضبوطة بالفعل\n\n3. **تحقق من المركز**\n• لا يمكن ضبط SL/TP بدون مركز مفتوح\n• يتم الضبط التلقائي بعد فتح المركز\n\n4. **تحقق من شرط السعر**\n• سعر SL قريب جدًا من السعر الحالي قد يُرفض\n• يجب أن يكون الفرق 0.1% على الأقل",
      es: "**Problema de SL/TP No Funciona**\n\n**Solución:**\n\n1. **Verificar Stop Loss**\n• Verificar que stop loss no esté en 0\n\n2. **Verificar Órdenes Existentes**\n• Ya pueden existir órdenes SL/TP\n\n3. **Verificar Posición**\n• No se puede configurar SL/TP sin posición abierta\n• Se configura automáticamente después de abrir posición\n\n4. **Verificar Condición de Precio**\n• Precio SL muy cercano al precio actual puede ser rechazado\n• Se requiere diferencia mínima de 0.1%",
      ru: "**Проблема неработающего SL/TP**\n\n**Решение:**\n\n1. **Проверьте стоп-лосс**\n• Убедитесь, что стоп-лосс не равен 0\n\n2. **Проверьте существующие ордера**\n• Ордера SL/TP могут быть уже установлены\n\n3. **Проверьте позицию**\n• Нельзя установить SL/TP без открытой позиции\n• Автоматически устанавливается после открытия позиции\n\n4. **Проверьте условие цены**\n• Цена SL слишком близка к текущей цене может быть отклонена\n• Требуется разница минимум 0.1%",
      zh: "**SL/TP 不起作用问题**\n\n**解决方法:**\n\n1. **检查止损设置**\n• 确认止损没有设置为 0\n\n2. **检查现有订单**\n• 可能已经设置了 SL/TP 订单\n\n3. **检查仓位**\n• 没有仓位无法设置 SL/TP\n• 开仓后自动设置\n\n4. **检查价格条件**\n• SL 价格与当前价格太接近可能被拒绝\n• 需要至少 0.1% 的差异",
      id: "**Masalah SL/TP Tidak Berfungsi**\n\n**Solusi:**\n\n1. **Periksa Pengaturan Stop Loss**\n• Verifikasi stop loss tidak diatur ke 0\n\n2. **Periksa Order yang Ada**\n• Order SL/TP mungkin sudah diatur\n\n3. **Periksa Posisi**\n• Tidak dapat mengatur SL/TP tanpa posisi terbuka\n• Diatur otomatis setelah membuka posisi\n\n4. **Periksa Kondisi Harga**\n• Harga SL terlalu dekat dengan harga saat ini mungkin ditolak\n• Diperlukan perbedaan minimum 0.1%",
      th: "**ปัญหา SL/TP ไม่ทำงาน**\n\n**วิธีแก้ไข:**\n\n1. **ตรวจสอบการตั้งค่า Stop Loss**\n• ตรวจสอบว่า stop loss ไม่ได้ตั้งเป็น 0\n\n2. **ตรวจสอบคำสั่งที่มีอยู่**\n• คำสั่ง SL/TP อาจถูกตั้งไว้แล้ว\n\n3. **ตรวจสอบสถานะ**\n• ไม่สามารถตั้ง SL/TP ได้โดยไม่มีสถานะเปิด\n• ตั้งอัตโนมัติหลังจากเปิดสถานะ\n\n4. **ตรวจสอบเงื่อนไขราคา**\n• ราคา SL ใกล้เคียงราคาปัจจุบันมากอาจถูกปฏิเสธ\n• ต้องมีความแตกต่างขั้นต่ำ 0.1%",
      vi: "**Vấn Đề SL/TP Không Hoạt Động**\n\n**Giải pháp:**\n\n1. **Kiểm tra Cài đặt Stop Loss**\n• Xác minh stop loss không được đặt thành 0\n\n2. **Kiểm tra Lệnh Hiện Có**\n• Lệnh SL/TP có thể đã được đặt\n\n3. **Kiểm tra Vị Thế**\n• Không thể đặt SL/TP mà không có vị thế mở\n• Tự động đặt sau khi mở vị thế\n\n4. **Kiểm tra Điều Kiện Giá**\n• Giá SL quá gần giá hiện tại có thể bị từ chối\n• Yêu cầu chênh lệch tối thiểu 0.1%",
      tr: "**SL/TP Çalışmıyor Sorunu**\n\n**Çözüm:**\n\n1. **Stop Loss Ayarını Kontrol Edin**\n• Stop loss'un 0 olarak ayarlanmadığını doğrulayın\n\n2. **Mevcut Emirleri Kontrol Edin**\n• SL/TP emirleri zaten ayarlanmış olabilir\n\n3. **Pozisyonu Kontrol Edin**\n• Açık pozisyon olmadan SL/TP ayarlanamaz\n• Pozisyon açıldıktan sonra otomatik ayarlanır\n\n4. **Fiyat Koşulunu Kontrol Edin**\n• SL fiyatı mevcut fiyata çok yakınsa reddedilebilir\n• Minimum %0.1 fark gerekli",
    },
  },
  {
    id: 15,
    question: {
      en: "How to run multiple trading pairs simultaneously",
      ko: "여러 종목을 동시에 실행하는 방법",
      ar: "كيفية تشغيل عدة أزواج تداول في وقت واحد",
      es: "Cómo ejecutar múltiples pares de trading simultáneamente",
      ru: "Как запустить несколько торговых пар одновременно",
      zh: "如何同时运行多个交易对",
      id: "Bagaimana cara menjalankan beberapa pasangan trading secara bersamaan",
      th: "วิธีรันหลายคู่เทรดพร้อมกัน",
      vi: "Cách chạy nhiều cặp giao dịch cùng lúc",
      tr: "Birden fazla işlem çifti aynı anda nasıl çalıştırılır",
    },
    answer: {
      en: "**Adding Other Symbols**\n\n**Setup Method:**\n\n1. **Create New Render Service**\n• Dashboard → New + → Background Worker\n• Separate service required for each symbol\n\n2. **Insert Docker Image Link**\n• Enter Docker image address per symbol:\n• Bitcoin: exitant/buylow-okx-2.0:latest\n• Gold: exitant/buylow-okx-2.0-gold:latest\n• Silver: exitant/buylow-okx-2.0-silver:latest\n• Tesla: exitant/buylow-okx-2.0-tesla:latest\n• NVDA: exitant/buylow-okx-2.0-nvda:latest\n• S&P 500 (SPY): exitant/buylow-okx-spy:latest\n• Nasdaq (QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **Set Environment Variables**\n• Proceed with same settings as API KEY etc.\n• Can use same OKX account/API\n• Need to create additional Telegram bot\n\n4. **Using Subaccount**\n• Can create subaccount from OKX main account\n• Need separate API KEY per subaccount\n• Enter each subaccount's API KEY in Render env vars\n• Need to transfer funds (USDT) to subaccount\n• Subaccount also requires Hedge Mode and Futures Mode settings\n\n**Cost Information**\n• $7 server cost per symbol monthly\n• Example: 3 symbols = $21/month",
      ko: "**다른 종목 추가 방법**\n\n**설정 방법:**\n\n1. **Render 서비스 새로 생성**\n• Dashboard → New + → Background Worker\n• 각 종목별로 별도 서비스 생성 필요\n\n2. **Docker Image 링크 삽입**\n• 종목별 Docker image 주소 입력:\n• 비트코인: exitant/buylow-okx-2.0:latest\n• 골드: exitant/buylow-okx-2.0-gold:latest\n• 은: exitant/buylow-okx-2.0-silver:latest\n• 테슬라: exitant/buylow-okx-2.0-tesla:latest\n• 엔비디아(NVDA): exitant/buylow-okx-2.0-nvda:latest\n• S&P 500(SPY): exitant/buylow-okx-spy:latest\n• 나스닥(QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **환경 변수 설정**\n• API KEY 등 기존 세팅 그대로 진행\n• 동일한 OKX 계정/API 사용 가능\n• 텔레그램 봇 추가 생성 필요\n\n4. **서브 계정(Subaccount) 사용 시**\n• OKX 메인 계정에서 서브 계정 생성 가능\n• 서브 계정별로 별도 API KEY 발급 필요\n• 각 서브 계정의 API KEY를 Render 환경 변수에 입력\n• 서브 계정 사용 시 자금(USDT)을 해당 서브 계정으로 이체 필요\n• 서브 계정도 Hedge Mode 및 Futures Mode 설정 필수\n\n**비용 안내**\n• 종목마다 매달 $7 서버 비용 발생\n• 예: 3개 종목 운영 시 월 $21",
      ar: "**طريقة إضافة رموز أخرى**\n\n**طريقة الإعداد:**\n\n1. **إنشاء خدمة Render جديدة**\n• Dashboard → New + → Background Worker\n• يلزم خدمة منفصلة لكل رمز\n\n2. **إدخال رابط Docker Image**\n• أدخل عنوان Docker image لكل رمز:\n• بيتكوين: exitant/buylow-okx-2.0:latest\n• ذهب: exitant/buylow-okx-2.0-gold:latest\n• فضة: exitant/buylow-okx-2.0-silver:latest\n• تسلا: exitant/buylow-okx-2.0-tesla:latest\n• NVDA: exitant/buylow-okx-2.0-nvda:latest\n• S&P 500 (SPY): exitant/buylow-okx-spy:latest\n• ناسداك (QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **إعداد متغيرات البيئة**\n• تابع نفس إعدادات API KEY إلخ\n• يمكن استخدام نفس حساب/API OKX\n• يجب إنشاء بوت تيليجرام إضافي\n\n4. **استخدام حساب فرعي**\n• يمكن إنشاء حساب فرعي من حساب OKX الرئيسي\n• يلزم API KEY منفصل لكل حساب فرعي\n• أدخل API KEY لكل حساب فرعي في متغيرات Render\n• يجب تحويل الأموال (USDT) للحساب الفرعي\n• الحساب الفرعي يتطلب أيضًا إعدادات Hedge Mode و Futures Mode\n\n**معلومات التكلفة**\n• $7 تكلفة خادم شهريًا لكل رمز\n• مثال: 3 رموز = $21/شهر",
      es: "**Método para Agregar Otros Símbolos**\n\n**Método de Configuración:**\n\n1. **Crear Nuevo Servicio Render**\n• Dashboard → New + → Background Worker\n• Se requiere servicio separado para cada símbolo\n\n2. **Insertar Link de Docker Image**\n• Ingresar dirección Docker image por símbolo:\n• Bitcoin: exitant/buylow-okx-2.0:latest\n• Oro: exitant/buylow-okx-2.0-gold:latest\n• Plata: exitant/buylow-okx-2.0-silver:latest\n• Tesla: exitant/buylow-okx-2.0-tesla:latest\n• NVDA: exitant/buylow-okx-2.0-nvda:latest\n• S&P 500 (SPY): exitant/buylow-okx-spy:latest\n• Nasdaq (QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **Configurar Variables de Entorno**\n• Proceder con misma configuración de API KEY etc.\n• Puede usar misma cuenta/API de OKX\n• Necesita crear bot de Telegram adicional\n\n4. **Usando Subcuenta**\n• Puede crear subcuenta desde cuenta principal OKX\n• Necesita API KEY separada por subcuenta\n• Ingresar API KEY de cada subcuenta en vars de Render\n• Necesita transferir fondos (USDT) a subcuenta\n• Subcuenta también requiere config de Hedge Mode y Futures Mode\n\n**Información de Costos**\n• $7 costo de servidor mensual por símbolo\n• Ejemplo: 3 símbolos = $21/mes",
      ru: "**Метод добавления других символов**\n\n**Метод настройки:**\n\n1. **Создайте новый сервис Render**\n• Dashboard → New + → Background Worker\n• Для каждого символа нужен отдельный сервис\n\n2. **Вставьте ссылку Docker Image**\n• Введите адрес Docker image для каждого символа:\n• Bitcoin: exitant/buylow-okx-2.0:latest\n• Золото: exitant/buylow-okx-2.0-gold:latest\n• Серебро: exitant/buylow-okx-2.0-silver:latest\n• Tesla: exitant/buylow-okx-2.0-tesla:latest\n• NVDA: exitant/buylow-okx-2.0-nvda:latest\n• S&P 500 (SPY): exitant/buylow-okx-spy:latest\n• Nasdaq (QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **Настройте переменные окружения**\n• Продолжите с теми же настройками API KEY и т.д.\n• Можно использовать тот же аккаунт/API OKX\n• Нужно создать дополнительный Telegram бот\n\n4. **Использование субаккаунта**\n• Можно создать субаккаунт из основного аккаунта OKX\n• Нужен отдельный API KEY для каждого субаккаунта\n• Введите API KEY каждого субаккаунта в переменные Render\n• Нужно перевести средства (USDT) на субаккаунт\n• Субаккаунт также требует настроек Hedge Mode и Futures Mode\n\n**Информация о стоимости**\n• $7 стоимость сервера ежемесячно за символ\n• Пример: 3 символа = $21/месяц",
      zh: "**添加其他交易对方法**\n\n**设置方法:**\n\n1. **创建新的 Render 服务**\n• Dashboard → New + → Background Worker\n• 每个交易对需要单独的服务\n\n2. **插入 Docker Image 链接**\n• 输入每个交易对的 Docker image 地址:\n• 比特币: exitant/buylow-okx-2.0:latest\n• 黄金: exitant/buylow-okx-2.0-gold:latest\n• 白银: exitant/buylow-okx-2.0-silver:latest\n• 特斯拉: exitant/buylow-okx-2.0-tesla:latest\n• NVDA: exitant/buylow-okx-2.0-nvda:latest\n• S&P 500 (SPY): exitant/buylow-okx-spy:latest\n• 纳斯达克 (QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **设置环境变量**\n• 按照 API KEY 等相同设置进行\n• 可以使用相同的 OKX 账户/API\n• 需要创建额外的 Telegram 机器人\n\n4. **使用子账户**\n• 可以从 OKX 主账户创建子账户\n• 每个子账户需要单独的 API KEY\n• 在 Render 环境变量中输入每个子账户的 API KEY\n• 需要将资金 (USDT) 转移到子账户\n• 子账户也需要设置 Hedge Mode 和 Futures Mode\n\n**费用信息**\n• 每个交易对每月 $7 服务器费用\n• 例如: 3个交易对 = $21/月",
      id: "**Menambahkan Simbol Lain**\n\n**Metode Pengaturan:**\n\n1. **Buat Layanan Render Baru**\n• Dashboard → New + → Background Worker\n• Diperlukan layanan terpisah untuk setiap simbol\n\n2. **Masukkan Link Docker Image**\n• Masukkan alamat Docker image per simbol:\n• Bitcoin: exitant/buylow-okx-2.0:latest\n• Emas: exitant/buylow-okx-2.0-gold:latest\n• Perak: exitant/buylow-okx-2.0-silver:latest\n• Tesla: exitant/buylow-okx-2.0-tesla:latest\n• NVDA: exitant/buylow-okx-2.0-nvda:latest\n• S&P 500 (SPY): exitant/buylow-okx-spy:latest\n• Nasdaq (QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **Atur Variabel Lingkungan**\n• Lanjutkan dengan pengaturan yang sama seperti API KEY dll.\n• Dapat menggunakan akun/API OKX yang sama\n• Perlu membuat bot Telegram tambahan\n\n4. **Menggunakan Subakun**\n• Dapat membuat subakun dari akun utama OKX\n• Perlu API KEY terpisah per subakun\n• Masukkan API KEY setiap subakun di variabel Render\n• Perlu mentransfer dana (USDT) ke subakun\n• Subakun juga memerlukan pengaturan Hedge Mode dan Futures Mode\n\n**Info Biaya**\n• Biaya server $7 per simbol bulanan\n• Contoh: 3 simbol = $21/bulan",
      th: "**การเพิ่มสัญลักษณ์อื่น**\n\n**วิธีการตั้งค่า:**\n\n1. **สร้างบริการ Render ใหม่**\n• Dashboard → New + → Background Worker\n• ต้องมีบริการแยกต่างหากสำหรับแต่ละสัญลักษณ์\n\n2. **ใส่ลิงก์ Docker Image**\n• ป้อนที่อยู่ Docker image ต่อสัญลักษณ์:\n• Bitcoin: exitant/buylow-okx-2.0:latest\n• ทอง: exitant/buylow-okx-2.0-gold:latest\n• เงิน: exitant/buylow-okx-2.0-silver:latest\n• Tesla: exitant/buylow-okx-2.0-tesla:latest\n• NVDA: exitant/buylow-okx-2.0-nvda:latest\n• S&P 500 (SPY): exitant/buylow-okx-spy:latest\n• Nasdaq (QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **ตั้งค่าตัวแปรสภาพแวดล้อม**\n• ดำเนินการด้วยการตั้งค่าเดียวกันกับ API KEY เป็นต้น\n• สามารถใช้บัญชี/API OKX เดียวกันได้\n• ต้องสร้างบอท Telegram เพิ่มเติม\n\n4. **การใช้ Subaccount**\n• สามารถสร้าง subaccount จากบัญชีหลัก OKX\n• ต้องมี API KEY แยกต่างหากต่อ subaccount\n• ป้อน API KEY ของแต่ละ subaccount ในตัวแปร Render\n• ต้องโอนเงิน (USDT) ไปยัง subaccount\n• Subaccount ต้องตั้งค่า Hedge Mode และ Futures Mode ด้วย\n\n**ข้อมูลค่าใช้จ่าย**\n• ค่าเซิร์ฟเวอร์ $7 ต่อสัญลักษณ์รายเดือน\n• ตัวอย่าง: 3 สัญลักษณ์ = $21/เดือน",
      vi: "**Thêm Symbol Khác**\n\n**Phương Pháp Cài Đặt:**\n\n1. **Tạo Dịch Vụ Render Mới**\n• Dashboard → New + → Background Worker\n• Cần dịch vụ riêng cho mỗi symbol\n\n2. **Chèn Link Docker Image**\n• Nhập địa chỉ Docker image cho mỗi symbol:\n• Bitcoin: exitant/buylow-okx-2.0:latest\n• Vàng: exitant/buylow-okx-2.0-gold:latest\n• Bạc: exitant/buylow-okx-2.0-silver:latest\n• Tesla: exitant/buylow-okx-2.0-tesla:latest\n• NVDA: exitant/buylow-okx-2.0-nvda:latest\n• S&P 500 (SPY): exitant/buylow-okx-spy:latest\n• Nasdaq (QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **Đặt Biến Môi Trường**\n• Tiến hành với cùng cài đặt như API KEY v.v.\n• Có thể sử dụng cùng tài khoản/API OKX\n• Cần tạo thêm bot Telegram\n\n4. **Sử Dụng Tài Khoản Phụ**\n• Có thể tạo tài khoản phụ từ tài khoản OKX chính\n• Cần API KEY riêng cho mỗi tài khoản phụ\n• Nhập API KEY của mỗi tài khoản phụ vào biến Render\n• Cần chuyển tiền (USDT) vào tài khoản phụ\n• Tài khoản phụ cũng cần cài đặt Hedge Mode và Futures Mode\n\n**Thông Tin Chi Phí**\n• Chi phí máy chủ $7 mỗi symbol hàng tháng\n• Ví dụ: 3 symbol = $21/tháng",
      tr: "**Diğer Sembolleri Ekleme**\n\n**Kurulum Yöntemi:**\n\n1. **Yeni Render Hizmeti Oluşturun**\n• Dashboard → New + → Background Worker\n• Her sembol için ayrı hizmet gerekli\n\n2. **Docker Image Linkini Ekleyin**\n• Sembol başına Docker image adresini girin:\n• Bitcoin: exitant/buylow-okx-2.0:latest\n• Altın: exitant/buylow-okx-2.0-gold:latest\n• Gümüş: exitant/buylow-okx-2.0-silver:latest\n• Tesla: exitant/buylow-okx-2.0-tesla:latest\n• NVDA: exitant/buylow-okx-2.0-nvda:latest\n• S&P 500 (SPY): exitant/buylow-okx-spy:latest\n• Nasdaq (QQQ): exitant/buylow-okx-nasdaq:latest\n\n3. **Ortam Değişkenlerini Ayarlayın**\n• API KEY vb. ile aynı ayarlarla devam edin\n• Aynı OKX hesabı/API kullanılabilir\n• Ek Telegram botu oluşturmanız gerekir\n\n4. **Alt Hesap Kullanma**\n• OKX ana hesabından alt hesap oluşturulabilir\n• Her alt hesap için ayrı API KEY gerekli\n• Her alt hesabın API KEY'ini Render değişkenlerine girin\n• Alt hesaba fon (USDT) transfer etmeniz gerekir\n• Alt hesap da Hedge Mode ve Futures Mode ayarları gerektirir\n\n**Maliyet Bilgisi**\n• Sembol başına aylık $7 sunucu maliyeti\n• Örnek: 3 sembol = $21/ay",
    },
  },
]

const LANGUAGES: { code: SupportedLang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia" },
  { code: "th", label: "Thai", native: "ไทย" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
]

function tx(key: keyof typeof widgetTranslations, lang: SupportedLang): string {
  const obj = widgetTranslations[key] as Record<string, string>
  return obj[lang] ?? obj.en ?? ""
}

export function ChatWidget() {
  const { lang, setLang } = useLanguage()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionData | null>(null)
  const [showAllQuestions, setShowAllQuestions] = useState(false)
  const [ebookModalOpen, setEbookModalOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  // Build server path based on current route (same logic as Start AI button)
  // /1 -> /server/1, /2 -> /server/2, / -> /server
  const getServerPath = () => {
    // Extract route number from pathname (e.g., "/1" -> "1", "/20" -> "20")
    const match = pathname.match(/^\/(\d+)$/)
    if (match) {
      return `/server/${match[1]}`
    }
    // Default to /server for root or other paths
    return "/server?step=1"
  }

  // Close panel on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        const button = document.getElementById("chat-widget-button")
        if (button && !button.contains(event.target as Node)) {
          setIsOpen(false)
          setShowLangDropdown(false)
          setSelectedQuestion(null)
          setShowAllQuestions(false)
        }
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Close language dropdown on click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false)
      }
    }
    if (showLangDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showLangDropdown])

  const allQuestions = [...hotQuestions, ...additionalQuestions]

  return (
    <>
      {/* E-Book Floating Button - Mobile Only (above FAQ button) */}
      <button
        type="button"
        onClick={() => setEbookModalOpen(true)}
        className="fixed bottom-[12.5rem] md:hidden right-4 z-50 flex flex-col items-center gap-1 p-3 rounded-2xl border border-accent/30 bg-background/90 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:border-accent/50 cursor-pointer"
        style={{
          boxShadow: "0 0 20px rgba(249, 115, 22, 0.2), 0 4px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Download className="w-5 h-5 text-accent" />
        <span className="font-mono text-[9px] text-foreground/80 tracking-wide">E-Book</span>
      </button>

      {/* Fixed Button - Bottom Right (FAQ/1:1) */}
      <button
        id="chat-widget-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-[7.5rem] md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-center gap-1 p-3 md:p-3 rounded-2xl border border-accent/30 bg-background/90 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:border-accent/50 cursor-pointer ${
          isOpen ? "scale-95 opacity-70" : ""
        }`}
        style={{
          boxShadow: "0 0 20px rgba(249, 115, 22, 0.2), 0 4px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Headphones className="w-5 h-5 md:w-6 md:h-6 text-accent" />
        <span className="font-mono text-[9px] text-foreground/80 tracking-wide whitespace-nowrap text-center">
          <span className="md:hidden">1:1<br />Chat</span>
          <span className="hidden md:inline">{tx("buttonLabel", lang)}</span>
        </span>
      </button>

      {/* E-Book Download Modal */}
      <EbookDownloadModal 
        isOpen={ebookModalOpen} 
        onClose={() => setEbookModalOpen(false)} 
      />

      {/* Support Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-[10.5rem] md:bottom-20 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-[380px] max-h-[60vh] md:max-h-[600px] rounded-2xl border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            boxShadow: "0 0 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(249, 115, 22, 0.1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-foreground/5">
            <span className="font-mono text-sm font-semibold text-foreground tracking-wide">
              {tx("header", lang)}
            </span>
            <div className="flex items-center gap-2">
              {/* Language Toggle - Inline Dropdown */}
              <div ref={langDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-foreground/60" />
                  <span className="font-mono text-[11px] text-foreground/70">
                    {LANGUAGES.find(l => l.code === lang)?.label ?? "English"}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-foreground/50 transition-transform duration-200 ${showLangDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* Inline Dropdown */}
                {showLangDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-48 rounded-xl border border-foreground/10 bg-background/98 backdrop-blur-xl shadow-2xl overflow-hidden z-10">
                    <div className="px-3 py-2 border-b border-foreground/10">
                      <span className="font-mono text-[10px] text-foreground/50 uppercase tracking-wider">
                        {tx("selectLanguage", lang)}
                      </span>
                    </div>
                    <div className="py-1 max-h-[240px] overflow-y-auto">
                      {LANGUAGES.map((language) => (
                        <button
                          key={language.code}
                          type="button"
                          onClick={() => {
                            setLang(language.code)
                            setShowLangDropdown(false)
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 transition-colors cursor-pointer ${
                            lang === language.code
                              ? "bg-accent/10 text-accent"
                              : "hover:bg-foreground/5 text-foreground/80"
                          }`}
                        >
                          <span className="font-mono text-[12px]">
                            {language.native}
                          </span>
                          {lang === language.code && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-foreground/60" />
              </button>
            </div>
          </div>

          {/* Main Content Area Wrapper - relative for half sheet positioning */}
          <div className="flex-1 min-h-0 flex flex-col relative">
            {/* Scrollable Content */}
            <div 
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
              onWheel={(e) => {
                e.currentTarget.scrollTop += e.deltaY
              }}
            >
              {/* Main Announcement Card */}
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Bell className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-mono text-sm font-semibold text-foreground">
                      {tx("announcementTitle", lang)}
                    </h3>
                    <p className="font-mono text-[11px] text-foreground/60 leading-relaxed">
                      {tx("announcementDesc", lang)}
                    </p>
                    <button
                      type="button"
                      onClick={() => { window.location.href = getServerPath() }}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:text-accent/80 transition-colors cursor-pointer"
                    >
                      {tx("announcementCta", lang)}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hot Questions Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-accent" />
                    <h4 className="font-mono text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                      {tx("hotQuestions", lang)}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllQuestions(true)}
                    className="font-mono text-[11px] text-accent hover:text-accent/80 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {tx("viewAll", lang)}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  {hotQuestions.map((q, i) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setSelectedQuestion(q)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer group text-left"
                    >
                      <span className="font-mono text-[11px] font-semibold text-accent/70 group-hover:text-accent">
                        {i + 1}
                      </span>
<span className="flex-1 font-mono text-[12px] text-foreground/70 group-hover:text-foreground/90 line-clamp-2">
{q.question[lang] ?? q.question.en}
</span>
                      <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-foreground/50 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 1:1 Chat Service Section */}
              <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-mono text-sm font-semibold text-foreground">
                        {tx("chatService", lang)}
                      </h4>
                      <p className="font-mono text-[11px] text-foreground/50 mt-1">
                        {tx("chatServiceDesc", lang)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open("https://t.me/m/fYm9UtOxODE1", "_blank")}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] font-semibold text-background bg-emerald-500 hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      {tx("startChat", lang)}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Half Sheet - Question Detail (slides up from bottom INSIDE the panel) */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-background/98 backdrop-blur-xl border-t border-foreground/10 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
                selectedQuestion ? "translate-y-0" : "translate-y-full"
              }`}
              style={{ height: "85%", maxHeight: "85%" }}
            >
              {selectedQuestion && (
                <div className="flex flex-col h-full">
                  {/* Half Sheet Header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/10">
                    <button
                      type="button"
                      onClick={() => setSelectedQuestion(null)}
                      className="flex items-center gap-1 font-mono text-[11px] text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
<h3 className="flex-1 font-mono text-[12px] font-semibold text-foreground truncate text-center pr-8">
{selectedQuestion.question[lang] ?? selectedQuestion.question.en}
</h3>
                    <button
                      type="button"
                      onClick={() => setSelectedQuestion(null)}
                      className="absolute right-3 p-1 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-foreground/60" />
                    </button>
                  </div>

                  {/* Half Sheet Content - Scrollable */}
                  <div 
                    className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                    onWheel={(e) => {
                      e.stopPropagation()
                      const target = e.currentTarget
                      const { scrollTop, scrollHeight, clientHeight } = target
                      const isAtTop = scrollTop === 0
                      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
                      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                        e.preventDefault()
                      }
                    }}
                  >
                    {/* Quick Fix Guide Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-md bg-accent/10 font-mono text-[10px] text-accent font-medium">
                        {tx("quickFixGuide", lang)}
                      </span>
                    </div>

{/* Answer Content - Explanation Text */}
<div className="space-y-3">
{(selectedQuestion.answer[lang] ?? selectedQuestion.answer.en).split("\n").map((line, i) => {
                        // Skip empty lines
                        if (!line.trim()) return null
                        
                        // Check if line starts with bullet point
                        if (line.startsWith("•") || line.startsWith("-")) {
                          const bulletContent = line.replace(/^[•-]\s*/, "")
                          return (
                            <div key={i} className="flex items-start gap-2 pl-2">
                              <span className="text-accent mt-0.5">•</span>
                              <p className="font-mono text-[12px] text-foreground/70 leading-relaxed">
                                {parseBoldText(bulletContent)}
                              </p>
                            </div>
                          )
                        }
                        // Check if line starts with "Step" or number pattern (e.g., "1.", "2.")
                        if (line.match(/^(Step\s*\d+|[①②③④⑤]|\d+\.)/i)) {
                          const stepMatch = line.match(/^(Step\s*\d+|\d+\.|[①②③④⑤])/i)
                          const stepLabel = stepMatch?.[0] || ""
                          const stepContent = line.replace(/^(Step\s*\d+\s*|[①②③④⑤]\s*|\d+\.\s*)/i, "")
                          return (
                            <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-foreground/5">
                              <span className="font-mono text-[11px] font-bold text-accent">
                                {stepLabel}
                              </span>
                              <p className="font-mono text-[12px] text-foreground/80 leading-relaxed">
                                {parseBoldText(stepContent)}
                              </p>
                            </div>
                          )
                        }
                        // Check if entire line is bold (header-like)
                        if (line.match(/^\*\*[^*]+\*\*$/)) {
                          return (
                            <h4 key={i} className="font-mono text-[13px] font-semibold text-foreground pt-2">
                              {line.replace(/^\*\*|\*\*$/g, "")}
                            </h4>
                          )
                        }
                        // Regular paragraph with potential inline bold
                        return (
                          <p key={i} className="font-mono text-[12px] text-foreground/70 leading-relaxed">
                            {parseBoldText(line)}
                          </p>
                        )
                      })}
                    </div>

                    {/* Primary Action Button - hidden for question #2, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, #15 */}
                    {selectedQuestion.id !== 2 && selectedQuestion.id !== 4 && selectedQuestion.id !== 5 && selectedQuestion.id !== 6 && selectedQuestion.id !== 7 && selectedQuestion.id !== 8 && selectedQuestion.id !== 9 && selectedQuestion.id !== 10 && selectedQuestion.id !== 11 && selectedQuestion.id !== 12 && selectedQuestion.id !== 13 && selectedQuestion.id !== 14 && selectedQuestion.id !== 15 && (
                      <button
                        type="button"
                        onClick={() => {
                          // Question #3 (rotation strategy) -> /strategy page
                          if (selectedQuestion.id === 3) {
                            window.location.href = "/strategy"
                          } else {
                            // Default behavior for other questions
                            window.location.href = getServerPath()
                          }
                        }}
                        className="w-full py-3 rounded-xl font-mono text-[12px] font-semibold text-background bg-emerald-500 hover:bg-emerald-400 transition-colors cursor-pointer"
                      >
                        {tx("openSetupGuide", lang)}
                      </button>
                    )}

                    {/* Divider */}
                    <div className="border-t border-foreground/10" />

                    {/* Still Need Help Section */}
                    <div className="space-y-3 pb-4">
                      <h4 className="font-mono text-[12px] font-semibold text-foreground">
                        {tx("stillNeedHelp", lang)}
                      </h4>
                      <p className="font-mono text-[11px] text-foreground/50 leading-relaxed">
                        {tx("stillNeedHelpDesc", lang)}
                      </p>
                      <button
                        type="button"
                        onClick={() => window.open("https://t.me/m/fYm9UtOxODE1", "_blank")}
                        className="w-full py-2.5 rounded-xl font-mono text-[12px] font-medium text-foreground border border-foreground/20 hover:bg-foreground/5 transition-colors cursor-pointer"
                      >
                        {tx("start1on1Chat", lang)}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Half Sheet - All Questions List */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-background/98 backdrop-blur-xl border-t border-foreground/10 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
                showAllQuestions && !selectedQuestion ? "translate-y-0" : "translate-y-full"
              }`}
              style={{ height: "85%", maxHeight: "85%" }}
            >
              {showAllQuestions && (
                <div className="flex flex-col h-full">
                  {/* Half Sheet Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
                    <button
                      type="button"
                      onClick={() => setShowAllQuestions(false)}
                      className="flex items-center gap-2 font-mono text-[12px] text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {tx("moreQuestions", lang)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAllQuestions(false)}
                      className="p-1 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-foreground/60" />
                    </button>
                  </div>

                  {/* All Questions List - Scrollable */}
                  <div 
                    className="flex-1 overflow-y-auto overscroll-contain p-2"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                    onWheel={(e) => {
                      e.stopPropagation()
                      const target = e.currentTarget
                      const { scrollTop, scrollHeight, clientHeight } = target
                      const isAtTop = scrollTop === 0
                      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
                      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                        e.preventDefault()
                      }
                    }}
                  >
                    {allQuestions.map((q, i) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setSelectedQuestion(q)
                          setShowAllQuestions(false)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer group text-left border-b border-foreground/5 last:border-b-0"
                      >
                        <span className="font-mono text-[11px] font-semibold text-accent/70 group-hover:text-accent w-5 flex-shrink-0">
                          {i + 1}
                        </span>
<span className="flex-1 font-mono text-[12px] text-foreground/70 group-hover:text-foreground/90">
{q.question[lang] ?? q.question.en}
</span>
                        <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-foreground/50 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
