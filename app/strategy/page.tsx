"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, ChevronDown, Check, Terminal, Shield, Crosshair, Book, Download, X, ArrowUpRight } from "lucide-react"
import { LanguageDropdown } from "@/components/language-dropdown"
import { STRATEGY_CONTENT, TOTAL_STRATEGY_STEPS } from "@/data/strategy/content.registry"
import type { LocalizedText, StrategySection, StrategyCardItem } from "@/data/strategy/types"
import { BackgroundWave } from "@/components/BackgroundWave"
import { playTypingClick } from "@/components/split-flap-text"
import { EbookDownloadModal } from "@/components/ebook-download-modal"

import { useLanguage } from "@/lib/language-context"
import { translations, type SupportedLang, t as tHelper } from "@/lib/i18n"

type Lang = SupportedLang

function t(text: LocalizedText | undefined, lang: Lang): string {
  if (!text) return ""
  return (text as Record<string, string | undefined>)[lang] ?? text.en ?? ""
}

/* ─── Mission titles per step (multilingual with 10 languages) ─── */
const MISSIONS: Record<number, LocalizedText> = {
  1: { en: "Rotation Core Definition", ko: "순환매 핵심 정의 (도입)", ar: "تعريف جوهر التدوير", ru: "Определение ядра ротации", zh: "轮换核心定义", es: "Definición del Núcleo de Rotación", id: "Definisi Inti Rotasi", th: "คำจำกัดความหลักของการหมุนเวียน", vi: "Định Nghĩa Cốt Lõi Luân Chuyển", tr: "Rotasyon Çekirdek Tanımı" },
  2: { en: "Three Core Logic Engines", ko: "기반 로직 3가지 (상세)", ar: "ثلاثة محركات منطقية أساسية", ru: "Три основных логических движка", zh: "三个核心逻辑引擎", es: "Tres Motores Lógicos Principales", id: "Tiga Mesin Logika Inti", th: "สามเครื่องยนต์ลอจิกหลัก", vi: "Ba Động Cơ Logic Cốt Lõi", tr: "Üç Temel Mantık Motoru" },
  3: { en: "Entry & Take-Profit Structure", ko: "진입 / 익절 구조", ar: "هيكل الدخول وجني الأرباح", ru: "Структура входа и фиксации прибыли", zh: "入场与获利结构", es: "Estructura de Entrada y Toma de Ganancias", id: "Struktur Entry & Take-Profit", th: "โครงสร้างการเข้าและการทำกำไร", vi: "Cấu Trúc Entry & Take-Profit", tr: "Giriş ve Kar Al Yapısı" },
  4: { en: "AI Auto Entry — 3 Levels", ko: "AI 자동진입 3단계", ar: "الدخول الآلي بالذكاء الاصطناعي — 3 مستويات", ru: "AI Авто-вход — 3 уровня", zh: "AI 自动入场 — 3个级别", es: "Entrada Automática AI — 3 Niveles", id: "AI Auto Entry — 3 Level", th: "AI Auto Entry — 3 ระดับ", vi: "AI Auto Entry — 3 Cấp Độ", tr: "AI Otomatik Giriş — 3 Seviye" },
  5: { en: "Recommended Settings by Target Profit", ko: "목표 수익률 별 세팅값 추천", ar: "الإعدادات الموصى بها حسب الربح المستهدف", ru: "Рекомендуемые настройки по целевой прибыли", zh: "按目标收益推荐设置", es: "Configuración Recomendada por Objetivo de Ganancia", id: "Pengaturan yang Direkomendasikan berdasarkan Target Profit", th: "การตั้งค่าที่แนะนำตามเป้าหมายกำไร", vi: "Cài Đặt Khuyến Nghị theo Mục Tiêu Lợi Nhuận", tr: "Hedef Kâra Göre Önerilen Ayarlar" },
  6: { en: "Advanced Controls", ko: "고급 설정 — 기능/설정 상세", ar: "الضوابط المتقدمة", ru: "Расширенные настройки", zh: "高级设置", es: "Controles Avanzados", id: "Kontrol Lanjutan", th: "การควบคุมขั้นสูง", vi: "Kiểm Soát Nâng Cao", tr: "Gelişmiş Kontroller" },
}

/* ─── Checklist items per step (titles MUST match content block titles 1:1) ─── */
const CHECKLISTS: Record<number, LocalizedText[]> = {
  1: [
    { en: "Core Definition of Rotation Trading", ko: "순환매 핵심 정의", ar: "التعريف الأساسي للتداول الدوري", ru: "Основное определение ротационной торговли", zh: "轮换交易核心定义", es: "Definición Principal del Trading Rotacional", id: "Definisi Inti Trading Rotasi", th: "คำจำกัดความหลักของการเทรดแบบหมุนเวียน", vi: "Định Nghĩa Cốt Lõi Giao Dịch Luân Chuyển", tr: "Rotasyon Ticaretinin Temel Tanımı" },
    { en: "Three Things Rotation Trading Does", ko: "순환매가 하는 일 3가지", ar: "ثلاثة أشياء يفعلها التداول الدوري", ru: "Три вещи, которые делает ротационная торговля", zh: "轮换交易做的三件事", es: "Tres Cosas que Hace el Trading Rotacional", id: "Tiga Hal yang Dilakukan Trading Rotasi", th: "สามสิ่งที่การเทรดแบบหมุนเวียนทำ", vi: "Ba Điều Giao Dịch Luân Chuyển Thực Hiện", tr: "Rotasyon Ticaretinin Yaptığı Üç Şey" },
    { en: "Example (5-Step Flow)", ko: "예시 (1~5단계 흐름)", ar: "مثال (تدفق 5 خطوات)", ru: "Пример (5-шаговый поток)", zh: "示例（5步流程）", es: "Ejemplo (Flujo de 5 Pasos)", id: "Contoh (Alur 5 Langkah)", th: "ตัวอย่าง (ขั้นตอน 5 ขั้น)", vi: "Ví Dụ (Quy Trình 5 Bước)", tr: "Örnek (5 Adımlı Akış)" },
  ],
  2: [
    { en: "Rotation (Infinite Engine) Principle", ko: "순환매(무한 동력) 원리", ar: "مبدأ الدوران (المحرك اللانهائي)", ru: "Принцип ротации (бесконечный двигатель)", zh: "轮换（无限引擎）原理", es: "Principio de Rotación (Motor Infinito)", id: "Prinsip Rotasi (Mesin Tak Terbatas)", th: "หลักการหมุนเวียน (เครื่องยนต์ไม่สิ้นสุด)", vi: "Nguyên Tắc Luân Chuyển (Động Cơ Vô Hạn)", tr: "Rotasyon (Sonsuz Motor) İlkesi" },
    { en: "Bollinger Band (BOLL)", ko: "볼린저밴드(BOLL)", ar: "بولينجر باند (BOLL)", ru: "Полосы Боллинджера (BOLL)", zh: "布林带（BOLL）", es: "Banda de Bollinger (BOLL)", id: "Bollinger Band (BOLL)", th: "Bollinger Band (BOLL)", vi: "Bollinger Band (BOLL)", tr: "Bollinger Bandı (BOLL)" },
    { en: "Fibonacci", ko: "피보나치(Fibonacci)", ar: "فيبوناتشي", ru: "Фибоначчи", zh: "斐波那契", es: "Fibonacci", id: "Fibonacci", th: "Fibonacci", vi: "Fibonacci", tr: "Fibonacci" },
  ],
  3: [
    { en: "5-Minute Candle Entry Principle", ko: "5분봉 기준 진입 원리", ar: "مبدأ الدخول على شمعة 5 دقائق", ru: "Принцип входа по 5-минутным свечам", zh: "5分钟蜡烛入场原理", es: "Principio de Entrada en Vela de 5 Minutos", id: "Prinsip Entry Candle 5 Menit", th: "หลักการเข้าแท่งเทียน 5 นาที", vi: "Nguyên Tắc Entry Nến 5 Phút", tr: "5 Dakikalık Mum Giriş İlkesi" },
    { en: "Entry Settings (Fibonacci Extensions)", ko: "진입 설정 (피보나치 확장)", ar: "إعدادات الدخول (امتدادات فيبون��تشي)", ru: "Настройки входа (расширения Фибоначчи)", zh: "入场设置���斐波那契扩展）", es: "Configuración de Entrada (Extensiones Fibonacci)", id: "Pengaturan Entry (Ekstensi Fibonacci)", th: "การตั้งค่า Entry (ส่วนขยาย Fibonacci)", vi: "Cài Đặt Entry (Mở Rộng Fibonacci)", tr: "Giriş Ayarları (Fibonacci Uzantıları)" },
    { en: "Take-Profit Settings (Fibonacci Retracements)", ko: "익절 설정 (피보나치 되돌림)", ar: "إعدادات جني الأرباح (تصحيحات فيبوناتشي)", ru: "Настройки фиксации прибыли (коррекции Фибоначчи)", zh: "止盈设置（斐波那契回撤）", es: "Configuración de Toma de Ganancias (Retrocesos Fibonacci)", id: "Pengaturan Take-Profit (Retracement Fibonacci)", th: "การตั้งค่า Take-Profit (Fibonacci Retracement)", vi: "Cài Đặt Take-Profit (Fibonacci Retracement)", tr: "Kar Al Ayarları (Fibonacci Geri Çekilmeleri)" },
  ],
  4: [
    { en: "AI Auto Entry Concept", ko: "AI 자동진입 개념", ar: "مفهوم الدخول الآلي بالذكاء الاصطناعي", ru: "Концепция автоматического входа AI", zh: "AI自动入场概念", es: "Concepto de Entrada Automática AI", id: "Konsep AI Auto Entry", th: "แนวคิด AI Auto Entry", vi: "Khái Niệm AI Auto Entry", tr: "AI Otomatik Giriş Kavramı" },
    { en: "3-Level Comparison Table", ko: "3단계 비교표", ar: "جدول مقارنة 3 مستويات", ru: "Таблица сравнения 3 уровней", zh: "3级比较表", es: "Tabla Comparativa de 3 Niveles", id: "Tabel Perbandingan 3 Level", th: "ตารางเปรียบเทียบ 3 ระดับ", vi: "Bảng So Sánh 3 Cấp Độ", tr: "3 Seviye Karşılaştırma Tablosu" },
    { en: "Quick Examples", ko: "한눈에 예시", ar: "أمثلة سريعة", ru: "Быстрые примеры", zh: "快速示例", es: "Ejemplos Rápidos", id: "Contoh Cepat", th: "ตัวอย่างด่วน", vi: "Ví Dụ Nhanh", tr: "Hızlı Örnekler" },
  ],
  5: [
    { en: "Recommended 1st Entry Size by Target Profit", ko: "목표 수익률별 1차 진입 추천 규모", ar: "حجم الدخول الأول الموصى به حسب الربح المستهدف", ru: "Рекомендуемый размер 1-го входа по целевой прибыли", zh: "按目标收益推荐的第一次入场规模", es: "Tamaño de 1ra Entrada Recomendado por Objetivo de Ganancia", id: "Ukuran Entry Pertama yang Direkomendasikan berdasarkan Target Profit", th: "ขนาด Entry แรกที่แนะนำตามเป้าหมายกำไร", vi: "Kích Thước Entry Đầu Tiên Khuyến Nghị theo Mục Tiêu Lợi Nhuận", tr: "Hedef Kâra Göre Önerilen 1. Giriş Boyutu" },
    { en: "1st Drawdown Guard Take-Profit (By Profile)", ko: "1차 가두리 익절 기준 (성향별)", ar: "حارس السحب الأول لجني الأرباح (حسب الملف)", ru: "1-я защита от просадки (по профилю)", zh: "第一次回撤保护止盈（按配置文件）", es: "1ra Guardia de Drawdown Take-Profit (Por Perfil)", id: "Pelindung Drawdown Pertama Take-Profit (Berdasarkan Profil)", th: "ตัวป้องกัน Drawdown แรก Take-Profit (ตามโปรไฟล์)", vi: "Bảo Vệ Drawdown Đầu Tiên Take-Profit (Theo Hồ Sơ)", tr: "1. Drawdown Koruma Kar Al (Profile Göre)" },
    { en: "Infinite Rotation Zone vs Liquidation Danger Zone", ko: "무한 순환매 영역과 청산 위험 구간", ar: "منطقة الدوران اللانهائية مقابل منطقة خطر التصفية", ru: "Зона бесконечной ротации vs Зона опасности ликвидации", zh: "无限轮换区域 vs 清算危险区域", es: "Zona de Rotación Infinita vs Zona de Peligro de Liquidación", id: "Zona Rotasi Tak Terbatas vs Zona Bahaya Likuidasi", th: "โซนหมุนเวียนไม่สิ้นสุด vs โซนอันตรายการบังคับขาย", vi: "Vùng Luân Chuyển Vô Hạn vs Vùng Nguy Hiểm Thanh Lý", tr: "Sonsuz Rotasyon Bölgesi vs Tasfiye Tehlike Bölgesi" },
  ],
  6: [
    { en: "Nth Entry Reset", ko: "N차 진입 초기화", ar: "إعادة تعيين الدخول N", ru: "Сброс N-го входа", zh: "第N次入场重置", es: "Reinicio de Entrada N", id: "Reset Entry Ke-N", th: "รีเซ็ต Entry ครั้งที่ N", vi: "Đặt Lại Entry Thứ N", tr: "N. Giriş Sıfırlama" },
    { en: "Trend-Only Mode", ko: "추세전용", ar: "وضع الاتجاه فقط", ru: "Режим только тренд", zh: "仅趋势模式", es: "Modo Solo Tendencia", id: "Mode Hanya Tren", th: "โหมดเทรนด์เท่านั้น", vi: "Chế Độ Chỉ Xu Hướng", tr: "Sadece Trend Modu" },
    { en: "Fibonacci Swap", ko: "피보나치 스왑", ar: "تبديل فيبوناتشي", ru: "Своп Фибоначчи", zh: "斐波那契交换", es: "Intercambio Fibonacci", id: "Fibonacci Swap", th: "Fibonacci Swap", vi: "Fibonacci Swap", tr: "Fibonacci Swap" },
    { en: "Max Loss Limit", ko: "한계손실", ar: "حد الخسارة الأقصى", ru: "Лимит максимального убытка", zh: "最大损失限制", es: "Límite de Pérdida Máxima", id: "Batas Kerugian Maksimum", th: "ขีดจำกัดการขาดทุนสูงสุด", vi: "Giới Hạn Lỗ Tối Đa", tr: "Maksimum Kayıp Limiti" },
    { en: "Long / Short Mode", ko: "Long / Short 모드", ar: "وضع Long / Short", ru: "Режим Long / Short", zh: "Long / Short 模式", es: "Modo Long / Short", id: "Mode Long / Short", th: "โหมด Long / Short", vi: "Chế Độ Long / Short", tr: "Long / Short Modu" },
    { en: "Golden X Rotation", ko: "황금X 순환", ar: "دوران X الذهبي", ru: "Ротация Золотой X", zh: "黄金X轮动", es: "Rotación X Dorada", id: "Rotasi Golden X", th: "การหมุนเวียน Golden X", vi: "Luân Chuyển Golden X", tr: "Altın X Rotasyonu" },
    { en: "Take-Profit Rules (On Full Exit)", ko: "익절 규칙 (전량 익절 시)", ar: "قواعد جني الأرباح (عند الخروج الكامل)", ru: "Правила фиксации прибыли (при полном выходе)", zh: "止盈规则（全部退出时）", es: "Reglas de Toma de Ganancias (En Salida Completa)", id: "Aturan Take-Profit (Saat Keluar Penuh)", th: "กฎการทำกำไร (เมื่อออกเต็มจำนวน)", vi: "Quy Tắc Take-Profit (Khi Thoát Hoàn Toàn)", tr: "Kar Al Kuralları (Tam Çıkışta)" },
  ],
}

/* ─── Simulator code per step (en/ko, other langs fallback to en) ─── */
const SIM_CODE: Record<number, { en: string[]; ko?: string[] }> = {
  1: {
    en: [
      "engine: infinite_rotation",
      "concept: lower_avg → partial_exit → repeat",
      "step_1: BOLL_lower_break → 1st_entry",
      "step_2: fib_ext(N) → Nth_entry → avg_down",
      "step_3: fib_retrace → partial_TP → cash_secured",
      "step_4: re_entry → avg_further_down",
      "step_5: cycle_complete → restart",
      "status: INFINITE_LOOP",
    ],
    ko: [
      "엔진: 무한_순환매",
      "개념: 평단_낮추기 → 일부_익절 → 반복",
      "1단계: BOLL_하단_이탈 → 1차_진입",
      "2단계: 피보_확장(N) → N차_진입 → 평단_하락",
      "3단계: 피보_되돌림 → 일부_익절 → ��금_확보",
      "4단계: 재진입 → 평단_추가_하락",
      "5단계: 사이클_완료 → ���시작",
      "상태: 무한_루프",
    ],
  },
  2: {
    en: [
      "module_1: rotation_engine   [ACTIVE]",
      "  // infinite buy-sell cycle compounding",
      "module_2: bollinger_BOLL    [ACTIVE]",
      "  // 5M oversold detection trigger",
      "module_3: fibonacci_grid    [ACTIVE]",
      "  // ext(1.236~1.618) + retrace(0.764~0.5)",
      "",
      "cycle: continuous",
      "profit_lock: on_rotation_complete",
    ],
    ko: [
      "모듈_1: 순환매_엔진        [가동중]",
      "  // 무한 매수-매도 복리 사이클",
      "모듈_2: 볼린저밴드_BOLL    [가동중]",
      "  // 5분봉 과매도 감지 트리거",
      "모듈_3: 피보나치_그리드    [가동중]",
      "  // 확장(1.236~1.618) + 되돌림(0.764~0.5)",
      "",
      "사이클: 연속",
      "수익_잠금: 로테이션_완료_시",
    ],
  },
  3: {
    en: [
      "timeframe: 5m_candle",
      "trigger: BOLL_lower_first_break",
      "",
      "entry_levels:     // fib extension",
      "  - 1.236  // conservative",
      "  - 1.382  // standard",
      "  - 1.500  // balanced",
      "  - AI_auto // 0-1 range adaptive",
      "",
      "tp_levels:        // fib retracement",
      "  - 0.764  // 1st TP (scalp)",
      "  - 0.618  // standard TP",
      "  - 0.500  // deep TP",
    ],
    ko: [
      "타임프레임: 5분봉",
      "트리거: BOLL_하단_첫_이탈",
      "",
      "진입_레벨:       // 피보 확장",
      "  - 1.236  // 보수적",
      "  - 1.382  // 표준",
      "  - 1.500  // 밸런스",
      "  - AI_자동 // 0~1 범위 적응형",
      "",
      "익절_레벨:       // 피보 되돌림",
      "  - 0.764  // 1차 익절 (스캘프)",
      "  - 0.618  // 표준 익절",
      "  - 0.500  // 깊은 익절",
    ],
  },
  4: {
    en: [
      "ai_auto_entry_mode:",
      "  risk:     vol>=1.25%→1.236 | ~1%→1.382 | ~0.75%→1.5 | <0.75%→1.618",
      "  moderate: vol>=1.5%→1.236  | ~1.25%→1.382 | ~1%→1.382 | <1%→1.618",
      "  safe:     vol>=2%→1.236    | ~1.5%→1.382  | ~1%→1.5   | <1%→1.618",
      "",
      "current_mode: moderate",
      "auto_entry: enabled",
    ],
    ko: [
      "AI_자동진입_모드:",
      "  리스크:  변동>=1.25%→1.236 | ~1%→1.382 | ~0.75%→1.5 | <0.75%→1.618",
      "  중도:    변동>=1.5%→1.236  | ~1.25%→1.382 | ~1%→1.382 | <1%→1.618",
      "  안전:    변동>=2%→1.236    | ~1.5%→1.382  | ~1%→1.5   | <1%→1.618",
      "",
      "현재_모드: 중도",
      "자동_진입: 활성",
    ],
  },
  5: {
    en: [
      "risk_analysis:",
      "  target_profit: 3%",
      "  first_entry_size: 10%",
      "  liquidation_dist: -70%",
      "  risk_level: LOW",
      "",
      "drawdown_guard: ACTIVE",
      "infinite_rotation_zone: 1%~5%",
      "danger_zone: 11%~20%  // use max_loss_limit",
    ],
    ko: [
      "리스크_분석:",
      "  목표_수익: 3%",
      "  1차_진입_규모: 10%",
      "  청산_거리: -70%",
      "  위험_등급: 낮음",
      "",
      "가두리_익절: 가동중",
      "무한_순환매_영역: 1%~5%",
      "위험_구간: 11%~20%  // 한계손실 적용",
    ],
  },
  6: {
    en: [
      "advanced_controls:",
      "  nth_entry_reset: auto",
      "  trend_only: 1H/4H filter",
      "  fib_swap: dynamic",
      "  max_loss_limit: -25%",
      "  direction: long | short | hedge",
      "  golden_x: 1.618_multiplier",
      "  tp_rule: full_exit→clear_pending",
      "",
      "status: ALL_SYSTEMS_NOMINAL",
    ],
    ko: [
      "고급_설정:",
      "  N차_진입_초기화: 자동",
      "  추세전용: 1H/4H 필터",
      "  피보_스왑: 동적",
      "  한계손실: -25%",
      "  방향: 롱 | 숏 | 헷지",
      "  황금X: 1.618_배수",
      "  익절_규칙: 전량익절→대기주문_취소",
      "",
      "상태: 전체_시스템_정상",
    ],
  },
}

/* ─── Color/glow helpers ─── */
const GLOW: Record<string, string> = {
  emerald: "shadow-[0_0_20px_rgba(16,185,129,0.12)] border-emerald-500/25 hover:border-emerald-400/40",
  cyan: "shadow-[0_0_20px_rgba(6,182,212,0.12)] border-cyan-500/25 hover:border-cyan-400/40",
  amber: "shadow-[0_0_20px_rgba(245,158,11,0.12)] border-amber-500/25 hover:border-amber-400/40",
  rose: "shadow-[0_0_20px_rgba(244,63,94,0.12)] border-rose-500/25 hover:border-rose-400/40",
}
const NEON: Record<string, string> = {
  emerald: "text-emerald-400",
  cyan: "text-cyan-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
}
const RISK_CLR: Record<string, string> = { low: "text-emerald-400", medium: "text-amber-400", high: "text-rose-400" }

/* ═══════════════════════════════════════════════════════
   Typing Console — center panel simulator
   ═══════════════════════════════════════════════════════ */
function TypingConsole({ lines, step }: { lines: string[]; step: number }) {
  const [displayed, setDisplayed] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setDisplayed([])
    setDone(false)
    abortRef.current?.abort()

    const ac = new AbortController()
    abortRef.current = ac

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      setDisplayed(lines)
      setDone(true)
      return
    }

    let charCount = 0
    async function run() {
      const result: string[] = []
      for (let li = 0; li < lines.length; li++) {
        if (ac.signal.aborted) return
        const line = lines[li]
        let current = ""
        for (let ci = 0; ci < line.length; ci++) {
          if (ac.signal.aborted) return
          current += line[ci]
          result[li] = current
          setDisplayed([...result])
          charCount++
          if (charCount % 3 === 0) playTypingClick()
          await new Promise<void>((res, rej) => {
            const id = setTimeout(res, 18 + Math.random() * 22)
            ac.signal.addEventListener("abort", () => { clearTimeout(id); rej() }, { once: true })
          }).catch(() => { })
        }
        result[li] = line
        setDisplayed([...result])
        await new Promise<void>((res, rej) => {
          const id = setTimeout(res, 60)
          ac.signal.addEventListener("abort", () => { clearTimeout(id); rej() }, { once: true })
        }).catch(() => { })
      }
      if (!ac.signal.aborted) setDone(true)
    }
    run()

    return () => ac.abort()
  }, [step, lines])

  return (
    <div className="relative rounded-xl border border-foreground/10 bg-black/40 backdrop-blur-sm overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-foreground/8 bg-white/[0.02]">
        <Terminal size={14} className="text-cyan-400" />
        <span className="font-mono text-[11px] text-white uppercase tracking-wider">Strategy Simulator</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
        </div>
      </div>

      {/* Code area */}
      <div className="p-4 md:p-5 font-mono text-[13px] leading-relaxed min-h-[260px] md:min-h-[320px]">
        {displayed.map((line, i) => (
          <div key={i} className="flex">
            <span className="w-8 shrink-0 text-foreground/20 text-right mr-4 select-none">{i + 1}</span>
            <span className="text-foreground/70 whitespace-pre">
              {colorize(line)}
            </span>
          </div>
        ))}
        {/* Blinking cursor */}
        {!done && (
          <div className="flex">
            <span className="w-8 shrink-0 text-foreground/20 text-right mr-4 select-none">{displayed.length + 1}</span>
            <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* SYSTEM ONLINE flash */}
      {done && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-[fadeout_2s_ease-in-out_forwards]">
          <div className="px-8 py-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-sm">
            <span className="font-mono text-sm font-bold text-white tracking-widest">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/** Syntax-color a line */
function colorize(line: string) {
  // Comment
  if (line.includes("//")) {
    const [code, ...rest] = line.split("//")
    return (
      <>
        {colorizeTokens(code)}
        <span className="text-foreground/30">{"//"}{rest.join("//")}</span>
      </>
    )
  }
  return colorizeTokens(line)
}
function colorizeTokens(s: string) {
  // key: value
  const match = s.match(/^(\s*)([\w._-]+)(:)(.*)$/)
  if (match) {
    const [, indent, key, colon, val] = match
    const hasActive = val.includes("[ACTIVE]")
    const hasNumber = /\d+\.?\d*/.test(val)
    return (
      <>
        {indent}
        <span className="text-cyan-400">{key}</span>
        <span className="text-foreground/30">{colon}</span>
        {hasActive ? (
          <span className="text-emerald-400">{val}</span>
        ) : hasNumber ? (
          <span className="text-amber-400">{val}</span>
        ) : (
          <span className="text-foreground/60">{val}</span>
        )}
      </>
    )
  }
  // List item
  if (s.trim().startsWith("-")) {
    return <span className="text-amber-400">{s}</span>
  }
  // Empty
  if (!s.trim()) return <span>{s}</span>
  return <span className="text-foreground/60">{s}</span>
}

/* ═══════════════════════════════════════════════════════
   Left Panel — Mission Log
   ═══════════════════════════════════════════════════════ */
function MissionLog({ step, lang, readIndices }: { step: number; lang: Lang; readIndices: Set<number> }) {
  const items = CHECKLISTS[step] ?? []
  const checks = items.map((_, i) => readIndices.has(i))
  const allDone = checks.length > 0 && checks.every(Boolean)

  return (
    <div className="rounded-xl border border-foreground/10 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-foreground/8 bg-white/[0.02]">
        <Crosshair size={14} className="text-amber-400" />
        <span className="font-mono text-[11px] text-foreground/50 uppercase tracking-wider">Mission Log</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Current mission */}
        <div>
          <div className="font-mono text-[10px] text-foreground/30 uppercase tracking-wider mb-1">
            {tHelper(translations.strategyUI.mission, lang)} {step}
          </div>
          <div className="font-mono text-sm text-cyan-400 font-medium">
            {t(MISSIONS[step], lang)}
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-500 ${checks[i]
                ? "border-emerald-500/50 bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.35)]"
                : "border-foreground/15 bg-transparent"
                }`}>
                {checks[i] && <Check size={10} className="text-emerald-400 animate-[scalein_0.3s_ease-out]" />}
              </div>
              <span className={`font-mono text-xs transition-colors duration-500 ${checks[i] ? "text-foreground/70" : "text-foreground/35"
                }`}>
                {t(item, lang)}
              </span>
            </div>
          ))}
        </div>

        {/* Completed badge */}
        {allDone && (
          <div className="mt-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-center">
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
              {tHelper(translations.strategyUI.completed, lang)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}



/* ═══════════════════════════════════════════════════════
   Training Modules — tabs below center console
   ═══════════════════════════════════════════════════════ */
/** Renders card description with optional inline images inserted before marker text. */
function CardDescription({ card, lang }: { card: StrategyCardItem | undefined; lang: Lang }) {
  if (!card) return null
  const text = t(card.description, lang)
  const inlineImgs = card.inlineImages

  if (!inlineImgs || inlineImgs.length === 0) {
    return (
      <p className="font-mono text-sm text-white leading-relaxed whitespace-pre-line">{text}</p>
    )
  }

  // Split text by markers and interleave images
  const segments: { text: string; imgBefore?: typeof inlineImgs[0] }[] = []
  let remaining = text

  // Sort markers by their position in the text (earliest first)
  const sorted = [...inlineImgs].sort((a, b) => {
    const posA = remaining.indexOf(t(a.marker, lang))
    const posB = remaining.indexOf(t(b.marker, lang))
    return posA - posB
  })

  for (const img of sorted) {
    const resolvedMarker = t(img.marker, lang)
    const idx = remaining.indexOf(resolvedMarker)
    if (idx === -1) continue
    // Text before the marker
    const before = remaining.slice(0, idx)
    if (before) segments.push({ text: before })
    // Image + marker onwards
    segments.push({ text: "", imgBefore: img })
    remaining = remaining.slice(idx)
  }
  if (remaining) segments.push({ text: remaining })

  return (
    <div className="space-y-0">
      {segments.map((seg, i) => (
        <div key={i}>
          {seg.imgBefore && (
            <div className="mt-3 mb-3">
              <img
                src={t(seg.imgBefore.src, lang)}
                alt={t(seg.imgBefore.alt, lang)}
                className="w-full rounded-lg border border-foreground/10 shadow-md"
                loading="lazy"
              />
            </div>
          )}
          {seg.text && (
            <p className="font-mono text-sm text-white leading-relaxed whitespace-pre-line">{seg.text}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function TrainingModules({ section, lang, onOpenTab }: { section: StrategySection | undefined; lang: Lang; onOpenTab?: (index: number) => void }) {
  const [activeTab, setActiveTab] = useState(0)
  const cards = section?.cards ?? []

  useEffect(() => setActiveTab(0), [section])

  const handleTab = useCallback((i: number) => {
    setActiveTab(i)
    onOpenTab?.(i)
  }, [onOpenTab])

  if (!cards.length) return null

  return (
    <div className="mt-6">
      {/* Tab buttons */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {cards.map((card, i) => {
          const color = card.color ?? "emerald"
          const isActive = activeTab === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleTab(i)}
              className={`shrink-0 px-5 py-3 md:px-7 md:py-3.5 rounded-xl font-mono text-base md:text-lg font-bold tracking-wide transition-all duration-200 cursor-pointer border-2 min-h-[48px] ${isActive
                  ? `${NEON[color]} bg-white/[0.10] border-white/25`
                  : "text-foreground/40 bg-white/[0.04] border-white/10 hover:text-foreground/65 hover:bg-white/[0.08] hover:border-white/20"
                }`}
            >
              {t(card.title, lang)}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-foreground/10 bg-black/30 p-4 md:p-5 min-h-[80px] max-h-[70vh] overflow-y-auto lg:max-h-none lg:overflow-visible">
        {cards[activeTab]?.image && (
          <div className="mb-4">
            <img
              src={t(cards[activeTab].image!.src, lang)}
              alt={t(cards[activeTab].image!.alt, lang)}
              className="w-full rounded-lg border border-foreground/10 shadow-md"
              loading="lazy"
            />
          </div>
        )}
        <CardDescription card={cards[activeTab]} lang={lang} />
      </div>
    </div>
  )
}

/* ─── IntersectionObserver wrapper — fires once when visible ─── */
function FullSectionObserver({ onVisible, children }: { onVisible: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { onVisible(); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [onVisible])
  return <div ref={ref} className="space-y-3">{children}</div>
}

/* ═══════════════════════════════════════════════════════
   Section renderers for non-step-1 content
   ═══════════════════════════════════════════════════════ */
function SectionBlock({ section, lang, onInteract, onItemInteract }: { section: StrategySection; lang: Lang; onInteract?: () => void; onItemInteract?: (cardIndex: number) => void }) {
  const [selectedMode, setSelectedMode] = useState(0)
  const hasFired = useRef(false)
  const fireOnce = useCallback(() => {
    if (!hasFired.current) { hasFired.current = true; onInteract?.() }
  }, [onInteract])

  // Reset hasFired when section changes
  useEffect(() => { hasFired.current = false }, [section])

  if (section.layout === "full" || (!section.layout && !section.cards)) {
    return (
      <FullSectionObserver onVisible={fireOnce}>
        {section.heading && (
          <h3 className="font-mono text-sm text-cyan-400 uppercase tracking-wider">{t(section.heading, lang)}</h3>
        )}
        {section.paragraphs?.map((p, i) => {
          let html = t(p, lang)
          if (!html.includes("warn-red") && html.includes("**")) {
            html = html.replace(/\*\*(.+?)\*\*/g, '<span class="warn-red"><strong>$1</strong></span>')
          }
          return (
            <div key={i} className="font-mono text-sm text-foreground/55 leading-relaxed whitespace-pre-line [&_strong]:text-foreground/80 [&_strong]:font-semibold [&_.warn-red]:text-red-400 [&_.warn-red]:font-semibold" dangerouslySetInnerHTML={{ __html: html }} />
          )
        })}
      </FullSectionObserver>
    )
  }

  if (section.layout === "cards") {
    const isFib = section.cards?.every((c) => /^\d+\.\d+$/.test(t(c.title, "en")))
    return (
      <div className="space-y-3">
        {section.heading && (
          <h3 className="font-mono text-sm text-cyan-400 uppercase tracking-wider">{t(section.heading, lang)}</h3>
        )}
        <div className={`grid gap-3 ${isFib ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}>
          {section.cards?.map((card, i) => {
            const color = card.color ?? "emerald"
            return (
              <div key={i} className={`rounded-lg border p-4 bg-black/30 transition-all ${GLOW[color]}`}>
                <div className={`font-mono text-lg font-bold ${NEON[color]}`} style={isFib ? { textShadow: "0 0 16px currentColor" } : undefined}>
                  {t(card.title, lang)}
                </div>
                <p className="mt-2 font-mono text-[11px] text-white leading-relaxed">{t(card.description, lang)}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (section.layout === "modes") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {section.cards?.map((card, i) => {
          const color = card.color ?? "emerald"
          const sel = selectedMode === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => { setSelectedMode(i); onItemInteract ? onItemInteract(i) : fireOnce() }}
              className={`w-full text-left rounded-lg border p-5 transition-all cursor-pointer ${sel ? `${GLOW[color]} bg-white/[0.04] ring-1 ring-inset ring-foreground/10` : "border-foreground/8 bg-black/30 hover:border-foreground/15"
                }`}
            >
              <h4 className={`font-mono text-sm font-bold uppercase tracking-wider ${sel ? NEON[color] : "text-foreground/50"}`}>
                {t(card.title, lang)}
              </h4>
              <div className={`overflow-hidden transition-all duration-300 ${sel ? "max-h-[300px] mt-3 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="font-mono text-[11px] text-white leading-relaxed whitespace-pre-line">{t(card.description, lang)}</p>
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  if (section.layout === "slider") {
    const config = section.sliderConfig
    if (!config) return null
    return <SliderBlock config={config} lang={lang} heading={section.heading} onInteract={fireOnce} />
  }

  if (section.layout === "advanced") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {section.cards?.map((card, i) => <AdvancedCard key={i} card={card} lang={lang} onInteract={() => onItemInteract ? onItemInteract(i) : fireOnce()} />)}
      </div>
    )
  }

  return null
}

function AdvancedCard({ card, lang, onInteract }: { card: StrategyCardItem; lang: Lang; onInteract?: () => void }) {
  const [open, setOpen] = useState(false)
  const color = card.color ?? "emerald"
  return (
    <button
      type="button"
      onClick={() => { setOpen(!open); if (!open) onInteract?.() }}
      className={`w-full text-left rounded-lg border p-4 transition-all cursor-pointer ${GLOW[color]} bg-black/30`}
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className={`font-mono text-sm font-bold ${NEON[color]}`}>{t(card.title, lang)}</h4>
        <ChevronDown size={14} className={`shrink-0 text-foreground/30 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[800px] mt-3 opacity-100" : "max-h-0 opacity-0"}`}>
        {card.image && (
          <img
            src={t(card.image.src, lang)}
            alt={t(card.image.alt, lang)}
            className="w-full rounded-lg border border-white/10 mb-4 object-contain"
            loading="lazy"
          />
        )}
        <p className="font-mono text-[11px] text-white leading-relaxed whitespace-pre-line">{t(card.description, lang)}</p>
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   Step 4 — Custom 3-block layout (AI 자동진입)
   ═══════════════════════════════════════════════════════ */

/* Step 4 localized texts */
const STEP4_TEXTS = {
  conceptTitle: { en: "AI Auto Entry (3 levels: Risk / Balanced / Safe)", ko: "AI 자동 진입 (3단계: 리스크 / 중도 / 안전)", ar: "الدخول الآلي بالذكاء الاصطناعي (3 مستويات: مخاطر / متوازن / آمن)", ru: "AI Авто-вход (3 уровня: Риск / Баланс / Безопасность)", zh: "AI 自动入场（3级：风险 / 平衡 / 安全）", es: "Entrada Automática AI (3 niveles: Riesgo / Equilibrado / Seguro)", id: "AI Auto Entry (3 level: Risiko / Seimbang / Aman)", th: "AI Auto Entry (3 ระดับ: ความเสี่ยง / สมดุล / ปลอดภัย)", vi: "AI Auto Entry (3 cấp độ: Rủi Ro / Cân Bằng / An Toàn)", tr: "AI Otomatik Giriş (3 seviye: Risk / Dengeli / Güvenli)" },
  conceptDesc: { en: "The AI reads the Fibonacci 0–1 range width (volatility) and auto-selects the entry spacing (1.236 / 1.382 / 1.5 / 1.618).", ko: "AI가 피보나치 [0~1] 간격(폭)을 보고, 변동성에 맞게 진입 설정값(1.236 / 1.382 / 1.5 / 1.618)을 자동 선택하는 기능", ar: "يقرأ الذكاء الاصطناعي نطاق فيبوناتشي 0-1 (التقلب) ويختار تلقائيًا مسافة الدخول (1.236 / 1.382 / 1.5 / 1.618).", ru: "AI считывает диапазон Фибоначчи 0-1 (волатильность) и автоматически выбирает интервал входа (1.236 / 1.382 / 1.5 / 1.618).", zh: "AI 读取斐波那契 0-1 范围宽度（波动性）并自动选择入场间距（1.236 / 1.382 / 1.5 / 1.618）。", es: "La IA lee el rango Fibonacci 0-1 (volatilidad) y auto-selecciona el espaciado de entrada (1.236 / 1.382 / 1.5 / 1.618).", id: "AI membaca rentang Fibonacci 0-1 (volatilitas) dan memilih jarak entry secara otomatis (1.236 / 1.382 / 1.5 / 1.618).", th: "AI อ่านช่วง Fibonacci 0-1 (ความผันผวน) และเลือกระยะห่างการเข้าโดยอัตโนมัติ (1.236 / 1.382 / 1.5 / 1.618)", vi: "AI đọc phạm vi Fibonacci 0-1 (biến động) và tự động chọn khoảng cách entry (1.236 / 1.382 / 1.5 / 1.618).", tr: "AI, Fibonacci 0-1 aralık genişliğini (volatilite) okur ve giriş aralığını otomatik olarak seçer (1.236 / 1.382 / 1.5 / 1.618)." },
  tableTitle: { en: "3-Level Comparison", ko: "3단계 비교표", ar: "مقارنة 3 مستويات", ru: "Сравнение 3 уровней", zh: "3级比较", es: "Comparación de 3 Niveles", id: "Perbandingan 3 Level", th: "การเปรียบเทียบ 3 ระดับ", vi: "So Sánh 3 Cấp Độ", tr: "3 Seviye Karşılaştırması" },
  fiboTooltip: { en: "Fibo 0–1 width = volatility range (%) of the last wave", ko: "피보 0~1 폭 = 직전 파동의 변동폭(%)", ar: "عرض فيبو 0-1 = نطاق التقلب (%) للموجة الأخيرة", ru: "Ширина Фибо 0-1 = диапазон волатильности (%) последней волны", zh: "斐波 0-1 宽度 = 最后波动的波动范围（%）", es: "Ancho Fibo 0-1 = rango de volatilidad (%) de la última onda", id: "Lebar Fibo 0-1 = rentang volatilitas (%) dari gelombang terakhir", th: "ความกว้าง Fibo 0-1 = ช่วงความผันผวน (%) ของคลื่นล่าสุด", vi: "Chiều rộng Fibo 0-1 = phạm vi biến động (%) của sóng cuối cùng", tr: "Fibo 0-1 genişliği = son dalganın volatilite aralığı (%)" },
  fiboWidthLabel: { en: "Fibo 0–1 Width", ko: "피보 0~1 폭", ar: "عرض فيبو 0-1", ru: "Ширина Фибо 0-1", zh: "斐波 0-1 宽度", es: "Ancho Fibo 0-1", id: "Lebar Fibo 0-1", th: "ความกว้าง Fibo 0-1", vi: "Chiều Rộng Fibo 0-1", tr: "Fibo 0-1 Genişliği" },
  entryLabel: { en: "Entry", ko: "진입값", ar: "الدخول", ru: "Вход", zh: "入场", es: "Entrada", id: "Entry", th: "Entry", vi: "Entry", tr: "Giriş" },
  quickExamples: { en: "Quick Examples", ko: "한눈에 예시", ar: "أمثلة سريعة", ru: "Быстрые примеры", zh: "快速示例", es: "Ejemplos Rápidos", id: "Contoh Cepat", th: "ตัวอย่างด่วน", vi: "Ví Dụ Nhanh", tr: "Hızlı Örnekler" },
  riskTitle: { en: "Risk (Aggressive)", ko: "리스크 (공격적)", ar: "مخاطر (عدواني)", ru: "Риск (Агрессивный)", zh: "风险（激进）", es: "Riesgo (Agresivo)", id: "Risiko (Agresif)", th: "ความเสี่ยง (เชิงรุก)", vi: "Rủi Ro (Tấn Công)", tr: "Risk (Agresif)" },
  riskSubtitle: { en: "Sideways likely / low chance of further crash", ko: "횡보 가능성 ↑ / 추가 급락 가능성 낮을 때", ar: "احتمال التحرك الجانبي / فرصة منخفضة للانهيار الإضافي", ru: "Боковое движение вероятно / низкий шанс дальнейшего падения", zh: "横盘可能性高 / 进一步暴跌可能性低", es: "Lateral probable / baja probabilidad de más caída", id: "Kemungkinan sideways / peluang rendah untuk crash lebih lanjut", th: "มีโอกาสเคลื่อนไหวด้านข้าง / โอกาสต่ำที่จะร่วงลงต่อ", vi: "Có khả năng đi ngang / cơ hội thấp để giảm thêm", tr: "Yatay hareket muhtemel / daha fazla düşüş şansı düşük" },
  balancedTitle: { en: "Balanced (Moderate)", ko: "중도 (밸런스)", ar: "متوازن (معتدل)", ru: "Баланс (Умеренный)", zh: "平衡（中等）", es: "Equilibrado (Moderado)", id: "Seimbang (Moderat)", th: "สมดุล (ปานกลาง)", vi: "Cân Bằng (Vừa Phải)", tr: "Dengeli (Orta)" },
  balancedSubtitle: { en: "Balance defense & profit capture", ko: "방어 + 수익 둘 다 챙기고 싶을 때", ar: "التوازن بين الدفاع والأرباح", ru: "Баланс защиты и получения прибыли", zh: "平衡防御和获利", es: "Equilibrio entre defensa y captura de ganancias", id: "Keseimbangan pertahanan & pengambilan profit", th: "สมดุลระหว่างการป้องกันและการทำกำไร", vi: "Cân bằng phòng thủ và chốt lời", tr: "Savunma ve kâr alma dengesi" },
  safeTitle: { en: "Safe (Conservative)", ko: "안전 (보수형)", ar: "آمن (محافظ)", ru: "Безопасный (Консервативный)", zh: "安全（保守）", es: "Seguro (Conservador)", id: "Aman (Konservatif)", th: "ปลอดภัย (อนุรักษ์นิยม)", vi: "An Toàn (Bảo Thủ)", tr: "Güvenli (Muhafazakar)" },
  safeSubtitle: { en: "News / events with high volatility risk", ko: "지표 발표 · 이벤트 등 변동성 가능성 ↑", ar: "أخبار / أحداث ذات مخاطر تقلب عالية", ru: "Новости / события с высоким риском волатильности", zh: "新闻/事件带来高波动风险", es: "Noticias / eventos con alto riesgo de volatilidad", id: "Berita / peristiwa dengan risiko volatilitas tinggi", th: "ข่าว / เหตุการณ์ที่มีความเสี่ยงควา���ผันผวนสูง", vi: "Tin tức / sự kiện có rủi ro biến động cao", tr: "Yüksek volatilite riski olan haberler / olaylar" },
  rangeAbove125: { en: ">= 1.25%", ko: "1.25% 이상" },
  range100to125: { en: "1% – 1.25%", ko: "1% ~ 1.25%" },
  range075to100: { en: "0.75% – 1%", ko: "0.75% ~ 1%" },
  rangeBelow075: { en: "<= 0.75%", ko: "0.75% 이하" },
  rangeAbove150: { en: ">= 1.5%", ko: "1.5% 이상" },
  range125to150: { en: "1.25% – 1.5%", ko: "1.25% ~ 1.5%" },
  rangeBelow100: { en: "<= 1%", ko: "1% 이하" },
  rangeAbove200: { en: ">= 2%", ko: "2% 이상" },
  range150to200: { en: "1.5% – 2%", ko: "1.5% ~ 2%" },
  range100to150: { en: "1% – 1.5%", ko: "1% ~ 1.5%" },
  example1: { en: "Volatility 0.8% → Risk = 1.5 / Balanced = 1.618 / Safe = 1.618", ko: "변동폭 0.8% → 리스크 = 1.5 / 중도 = 1.618 / 안전 = 1.618", ar: "التقلب 0.8% ← مخاطر = 1.5 / متوازن = 1.618 / آمن = 1.618", ru: "Волатильность 0.8% → Риск = 1.5 / Баланс = 1.618 / Безопасность = 1.618", zh: "波动率 0.8% → 风险 = 1.5 / 平衡 = 1.618 / 安全 = 1.618", es: "Volatilidad 0.8% → Riesgo = 1.5 / Equilibrado = 1.618 / Seguro = 1.618", id: "Volatilitas 0.8% → Risiko = 1.5 / Seimbang = 1.618 / Aman = 1.618", th: "ความผันผวน 0.8% → ความเสี่ยง = 1.5 / สมดุล = 1.618 / ปลอดภัย = 1.618", vi: "Biến động 0.8% → Rủi Ro = 1.5 / Cân Bằng = 1.618 / An Toàn = 1.618", tr: "Volatilite %0.8 → Risk = 1.5 / Dengeli = 1.618 / Güvenli = 1.618" },
  example2: { en: "Volatility 1.2% → Risk = 1.382 / Balanced = 1.382 / Safe = 1.5", ko: "변동폭 1.2% → 리스크 = 1.382 / 중도 = 1.382 / 안전 = 1.5", ar: "التقلب 1.2% ← مخاطر = 1.382 / متوازن = 1.382 / آمن = 1.5", ru: "Волатильность 1.2% → Риск = 1.382 / Баланс = 1.382 / Безопасность = 1.5", zh: "波动率 1.2% → 风险 = 1.382 / 平衡 = 1.382 / 安全 = 1.5", es: "Volatilidad 1.2% → Riesgo = 1.382 / Equilibrado = 1.382 / Seguro = 1.5", id: "Volatilitas 1.2% → Risiko = 1.382 / Seimbang = 1.382 / Aman = 1.5", th: "ความผันผวน 1.2% → ความเสี่ยง = 1.382 / สมดุล = 1.382 / ปลอดภัย = 1.5", vi: "Biến động 1.2% → Rủi Ro = 1.382 / Cân Bằng = 1.382 / An Toàn = 1.5", tr: "Volatilite %1.2 → Risk = 1.382 / Dengeli = 1.382 / Güvenli = 1.5" },
  example3: { en: "Volatility 2.1% → Risk = 1.236 / Balanced = 1.236 / Safe = 1.236", ko: "변동폭 2.1% → 리스크 = 1.236 / 중도 = 1.236 / 안전 = 1.236", ar: "التقلب 2.1% ← مخاطر = 1.236 / متوازن = 1.236 / آمن = 1.236", ru: "Волатильность 2.1% → Риск = 1.236 / Баланс = 1.236 / Безопасность = 1.236", zh: "波动率 2.1% → 风险 = 1.236 / 平衡 = 1.236 / 安全 = 1.236", es: "Volatilidad 2.1% → Riesgo = 1.236 / Equilibrado = 1.236 / Seguro = 1.236", id: "Volatilitas 2.1% → Risiko = 1.236 / Seimbang = 1.236 / Aman = 1.236", th: "ความผันผวน 2.1% → ความเสี่ยง = 1.236 / สมดุล = 1.236 / ปลอดภัย = 1.236", vi: "Biến động 2.1% → Rủi Ro = 1.236 / Cân Bằng = 1.236 / An Toàn = 1.236", tr: "Volatilite %2.1 → Risk = 1.236 / Dengeli = 1.236 / Güvenli = 1.236" },
}

function Step4Block({ lang, onCheckItem }: { lang: Lang; onCheckItem: (idx: number) => void }) {
  const conceptRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const exampleRef = useRef<HTMLDivElement>(null)

  // Fire check 0 (concept), 1 (table), 2 (examples) on scroll-into-view
  useEffect(() => {
    const refs = [conceptRef, tableRef, exampleRef]
    const observers: IntersectionObserver[] = []
    refs.forEach((ref, idx) => {
      const el = ref.current
      if (!el) return
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { onCheckItem(idx); obs.disconnect() }
      }, { threshold: 0.2 })
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [onCheckItem])

  // ── Condition table data ──
  const modes = [
    {
      key: "risk" as const,
      title: t(STEP4_TEXTS.riskTitle, lang),
      subtitle: t(STEP4_TEXTS.riskSubtitle, lang),
      color: "border-rose-500/40 bg-rose-500/[0.06]",
      titleColor: "text-rose-400",
      rows: [
        { range: t(STEP4_TEXTS.rangeAbove125, lang), entry: "1.236" },
        { range: t(STEP4_TEXTS.range100to125, lang), entry: "1.382" },
        { range: t(STEP4_TEXTS.range075to100, lang), entry: "1.5" },
        { range: t(STEP4_TEXTS.rangeBelow075, lang), entry: "1.618" },
      ],
    },
    {
      key: "balanced" as const,
      title: t(STEP4_TEXTS.balancedTitle, lang),
      subtitle: t(STEP4_TEXTS.balancedSubtitle, lang),
      color: "border-amber-500/40 bg-amber-500/[0.06]",
      titleColor: "text-amber-400",
      rows: [
        { range: t(STEP4_TEXTS.rangeAbove150, lang), entry: "1.236" },
        { range: t(STEP4_TEXTS.range125to150, lang), entry: "1.382" },
        { range: t(STEP4_TEXTS.range100to125, lang), entry: "1.382" },
        { range: t(STEP4_TEXTS.rangeBelow100, lang), entry: "1.618" },
      ],
    },
    {
      key: "safe" as const,
      title: t(STEP4_TEXTS.safeTitle, lang),
      subtitle: t(STEP4_TEXTS.safeSubtitle, lang),
      color: "border-emerald-500/40 bg-emerald-500/[0.06]",
      titleColor: "text-emerald-400",
      rows: [
        { range: t(STEP4_TEXTS.rangeAbove200, lang), entry: "1.236" },
        { range: t(STEP4_TEXTS.range150to200, lang), entry: "1.382" },
        { range: t(STEP4_TEXTS.range100to150, lang), entry: "1.5" },
        { range: t(STEP4_TEXTS.rangeBelow100, lang), entry: "1.618" },
      ],
    },
  ]

  const examples = [
    t(STEP4_TEXTS.example1, lang),
    t(STEP4_TEXTS.example2, lang),
    t(STEP4_TEXTS.example3, lang),
  ]

  const entryColor: Record<string, string> = {
    "1.236": "text-cyan-400",
    "1.382": "text-amber-400",
    "1.5": "text-orange-400",
    "1.618": "text-rose-400",
  }

  return (
    <div className="space-y-10">
      {/* ── (A) Concept block ── */}
      <div ref={conceptRef} className="space-y-4 rounded-xl border border-foreground/10 bg-black/30 p-5 md:p-7">
        <h2 className="text-xl md:text-2xl font-bold">
          {t(STEP4_TEXTS.conceptTitle, lang)}
        </h2>
        <p className="text-base text-foreground/90 font-semibold">
          {t(STEP4_TEXTS.conceptDesc, lang)}
        </p>
      </div>

      {/* ── (B) 3-column comparison table ── */}
      <div ref={tableRef} className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg md:text-xl font-bold">
            {t(STEP4_TEXTS.tableTitle, lang)}
          </h3>
        </div>

        {/* Fibo 0-1 tooltip */}
        <div className="rounded-lg border border-foreground/8 bg-white/[0.03] px-4 py-2.5 text-sm text-foreground/60">
          {t(STEP4_TEXTS.fiboTooltip, lang)}
        </div>

        {/* 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <div
              key={mode.key}
              className={`rounded-xl border-2 ${mode.color} p-5 space-y-4`}
            >
              {/* Column header */}
              <div className="space-y-1">
                <h4 className={`text-lg md:text-xl font-bold ${mode.titleColor}`}>
                  {mode.title}
                </h4>
                <p className="text-xs text-foreground/50 leading-snug">
                  {mode.subtitle}
                </p>
              </div>

              {/* Condition table */}
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] text-foreground/40 uppercase tracking-wider pb-2 font-medium">
                      {t(STEP4_TEXTS.fiboWidthLabel, lang)}
                    </th>
                    <th className="text-right text-[11px] text-foreground/40 uppercase tracking-wider pb-2 font-medium">
                      {t(STEP4_TEXTS.entryLabel, lang)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mode.rows.map((row, ri) => (
                    <tr key={ri} className="border-t border-foreground/6">
                      <td className="py-2 text-sm text-foreground/70">{row.range}</td>
                      <td className={`py-2 text-right text-base font-bold ${entryColor[row.entry] ?? "text-foreground/80"}`}>
                        {row.entry}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* ── (C) Quick examples ── */}
      <div ref={exampleRef} className="space-y-3 rounded-xl border border-foreground/10 bg-black/30 p-5">
        <h3 className="text-base font-bold text-foreground/90">
          {t(STEP4_TEXTS.quickExamples, lang)}
        </h3>
        <div className="space-y-2">
          {examples.map((ex, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-foreground/70 leading-relaxed">
              <span className="shrink-0 text-foreground/30 select-none">{'>'}</span>
              <span className="font-mono">{ex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* SliderBlock localized texts */
const SLIDER_TEXTS = {
  firstEntrySize: { en: "1st Entry Size", ko: "1차 진입 규모", ar: "حجم الدخول الأول", ru: "Размер 1-го входа", zh: "第一次入场规模", es: "Tamaño de 1ra Entrada", id: "Ukuran Entry Pertama", th: "ขนาด Entry แรก", vi: "Kích Thước Entry Đầu Tiên", tr: "1. Giriş Boyutu" },
  firstDrawdownGuard: { en: "1st Drawdown Guard", ko: "1차 가두리", ar: "حارس السحب الأول", ru: "1-я защита от просадки", zh: "第一次回撤保护", es: "1ra Guardia de Drawdown", id: "Pelindung Drawdown Pertama", th: "ตัวป้องกัน Drawdown แรก", vi: "Bảo Vệ Drawdown Đầu Tiên", tr: "1. Drawdown Koruma" },
  riskLevel: { en: "Risk Level", ko: "위험도", ar: "مستوى المخاطر", ru: "Уровень риска", zh: "风险级别", es: "Nivel de Riesgo", id: "Tingkat Risiko", th: "ระดับความเสี่ยง", vi: "Mức Độ Rủi Ro", tr: "Risk Seviyesi" },
  veryLow: { en: "VERY LOW", ko: "매우 낮음", ar: "منخفض جداً", ru: "ОЧЕНЬ НИЗКИЙ", zh: "非常低", es: "MUY BAJO", id: "SANGAT RENDAH", th: "ต่ำมาก", vi: "RẤT THẤP", tr: "ÇOK DÜŞÜK" },
  low: { en: "LOW", ko: "낮음", ar: "منخفض", ru: "НИЗКИЙ", zh: "低", es: "BAJO", id: "RENDAH", th: "ต่ำ", vi: "THẤP", tr: "DÜŞÜK" },
  moderate: { en: "MODERATE", ko: "보통", ar: "متوسط", ru: "УМЕРЕННЫЙ", zh: "中等", es: "MODERADO", id: "SEDANG", th: "ปานกลาง", vi: "VỪA PHẢI", tr: "ORTA" },
  high: { en: "HIGH", ko: "높음", ar: "عالي", ru: "ВЫСОКИЙ", zh: "高", es: "ALTO", id: "TINGGI", th: "สูง", vi: "CAO", tr: "YÜKSEK" },
  recommendedEntrySize: { en: "Recommended 1st Entry Size by Target Profit", ko: "수익률별 1차 진입 추천 규모", ar: "حجم الدخول الأول الموصى به حسب الربح المستهدف", ru: "Рекомендуемый размер 1-го входа по целевой прибыли", zh: "按目标收益推荐的第一次入场规模", es: "Tamaño de 1ra Entrada Recomendado por Objetivo de Ganancia", id: "Ukuran Entry Pertama yang Direkomendasikan berdasarkan Target Profit", th: "ขนาด Entry แรกที่แนะนำตามเป้าหมายกำไร", vi: "Kích Thước Entry Đầu Tiên Khuyến Nghị theo Mục Tiêu Lợi Nhuận", tr: "Hedef Kâra Göre Önerilen 1. Giriş Boyutu" },
  targetProfit: { en: "Target Profit", ko: "목표 수익률", ar: "الربح المستهدف", ru: "Целевая прибыль", zh: "目标收益", es: "Objetivo de Ganancia", id: "Target Profit", th: "เป้าหมายกำไร", vi: "Mục Tiêu Lợi Nhuận", tr: "Hedef Kâr" },
  infiniteRotationZone: { en: "Infinite Rotation Zone vs Liquidation Risk Zone", ko: "무한 순환매 영역과 청산 위험 구간", ar: "منطقة الدوران اللانهائية مقابل منطقة خطر التصفية", ru: "Зона бесконечной ротации vs Зона риска ликвидации", zh: "无限轮换区域 vs 清算风险区域", es: "Zona de Rotación Infinita vs Zona de Riesgo de Liquidación", id: "Zona Rotasi Tak Terbatas vs Zona Risiko Likuidasi", th: "โซนหมุนเวียนไม่สิ้นสุด vs โซนความเสี่ยงการบังคับขาย", vi: "Vùng Luân Chuyển Vô Hạn vs Vùng Rủi Ro Thanh Lý", tr: "Sonsuz Rotasyon Bölgesi vs Tasfiye Risk Bölgesi" },
  targetProfitRange: { en: "Target Profit Range", ko: "목표 수익률 구간", ar: "نطاق الربح المستهدف", ru: "Диапазон целевой прибыли", zh: "目标收益范围", es: "Rango de Objetivo de Ganancia", id: "Rentang Target Profit", th: "ช่วงเป้าหมายกำไร", vi: "Phạm Vi Mục Tiêu Lợi Nhuận", tr: "Hedef Kâr Aralığı" },
  liquidationRiskSummary: { en: "Liquidation Risk Summary", ko: "청산 위험도 요약", ar: "ملخص مخاطر التصفية", ru: "Сводка риска ликвидации", zh: "清算风险摘要", es: "Resumen de Riesgo de Liquidación", id: "Ringkasan Risiko Likuidasi", th: "สรุปความเสี่ยงการบังคับขาย", vi: "Tóm Tắt Rủi Ro Thanh Lý", tr: "Tasfiye Risk Özeti" },
  profileVolatilityTP: { en: "Profile: Volatility & 1st Drawdown Guard TP", ko: "성향별 변동률 / 1차 가두리 익절", ar: "الملف: التقلب وجني الأرباح الأول", ru: "Профиль: Волатильность и 1-я защита ТП", zh: "配置文件：波动性和第一次回撤保护止盈", es: "Perfil: Volatilidad y 1ra Guardia de Drawdown TP", id: "Profil: Volatilitas & Pelindung Drawdown Pertama TP", th: "โปรไฟล์: ความผันผวน & TP ป้องกัน Drawdown แรก", vi: "Hồ Sơ: Biến Động & Take-Profit Bảo Vệ Drawdown Đầu Tiên", tr: "Profil: Volatilite ve 1. Drawdown Koruma TP" },
  profile: { en: "Profile", ko: "성향", ar: "الملف", ru: "Профиль", zh: "配置", es: "Perfil", id: "Profil", th: "โปรไฟล์", vi: "Hồ Sơ", tr: "Profil" },
  volatility: { en: "Volatility", ko: "변동률", ar: "التقلب", ru: "Волатильность", zh: "波动率", es: "Volatilidad", id: "Volatilitas", th: "ความผันผวน", vi: "Biến Động", tr: "Volatilite" },
  firstDrawdownGuardTP: { en: "1st Drawdown Guard TP", ko: "1차 가두리 익절", ar: "جني الأرباح الأول", ru: "1-я защита ТП", zh: "第一次回撤保护止盈", es: "1ra Guardia de Drawdown TP", id: "Pelindung Drawdown Pertama TP", th: "TP ป้องกัน Drawdown แรก", vi: "Take-Profit Bảo Vệ Drawdown Đầu Tiên", tr: "1. Drawdown Koruma TP" },
}

function SliderBlock({ config, lang, heading, onInteract }: { config: NonNullable<StrategySection["sliderConfig"]>; lang: Lang; heading?: LocalizedText; onInteract?: () => void }) {
  const [value, setValue] = useState(config.defaultValue)
  const sliderFired = useRef(false)
  const tier = config.tiers.find((t) => t.value === value) ?? config.tiers[0]

  // Derive zone from current slider value
  const zoneRanges: [number, number][] = [[1,3],[4,6],[7,9],[10,12],[13,15],[16,18],[19,20]]
  const zoneIdx = config.zones ? zoneRanges.findIndex(([lo,hi]) => value >= lo && value <= hi) : -1
  const zone = config.zones?.[zoneIdx >= 0 ? zoneIdx : 0]

  // Risk level from zone
  const riskLabel = (() => {
    if (!zone) return { text: "-", color: "text-foreground/40" }
    const summary = t(zone.riskSummary, lang)
    if (summary.includes("< 1%")) return { text: t(SLIDER_TEXTS.veryLow, lang), color: "text-emerald-400" }
    if (summary.includes("< 5%")) return { text: t(SLIDER_TEXTS.low, lang), color: "text-emerald-400" }
    if (summary.includes("-50%") || summary.includes("-45%")) return { text: t(SLIDER_TEXTS.moderate, lang), color: "text-amber-400" }
    return { text: t(SLIDER_TEXTS.high, lang), color: "text-rose-400" }
  })()

  useEffect(() => setValue(config.defaultValue), [config])

  const thClass = "font-mono text-[10px] text-foreground/40 uppercase tracking-wider text-left px-3 py-2 border-b border-foreground/8"
  const tdClass = "font-mono text-sm text-foreground/70 px-3 py-1.5 border-b border-foreground/5"

  return (
    <div className="space-y-8">
      {heading && <h3 className="font-mono text-sm text-cyan-400 uppercase tracking-wider">{t(heading, lang)}</h3>}

      {/* ── Slider + summary cards ── */}
      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span className="font-mono text-xs text-foreground/50">{t(config.label, lang)}</span>
          <span className="font-mono text-xl font-bold text-white">{value}{config.unit}</span>
        </label>
        <input
          type="range" min={config.min} max={config.max} step={config.step} value={value}
          onChange={(e) => { setValue(Number(e.target.value)); if (!sliderFired.current) { sliderFired.current = true; onInteract?.() } }}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-foreground/10 accent-cyan-400
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-0"
        />
        <div className="flex justify-between font-mono text-[9px] text-foreground/25">
          <span>{config.min}{config.unit}</span>
          <span>{config.max}{config.unit}</span>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t(SLIDER_TEXTS.firstEntrySize, lang), val: tier?.firstEntry ?? "-", color: "text-emerald-400" },
            { label: t(SLIDER_TEXTS.firstDrawdownGuard, lang), val: zone?.drawdown ?? "-", color: "text-cyan-400" },
            { label: t(SLIDER_TEXTS.riskLevel, lang), val: riskLabel.text, color: riskLabel.color },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-foreground/8 bg-black/30 p-3 text-center">
              <div className="font-mono text-[9px] text-foreground/30 uppercase tracking-wider">{item.label}</div>
              <div className={`mt-1 font-mono text-lg font-bold ${item.color}`}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Table A: 수익률별 1차 진입 추천 규모 (1~20%) ══ */}
      <div className="space-y-3">
        <h4 className="font-mono text-lg text-emerald-400 uppercase tracking-wider">
          {t(SLIDER_TEXTS.recommendedEntrySize, lang)}
        </h4>
        <div className="rounded-xl border border-foreground/8 bg-black/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className={thClass}>{t(SLIDER_TEXTS.targetProfit, lang)}</th>
                <th className={thClass}>{t(SLIDER_TEXTS.firstEntrySize, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {config.tiers.map((row, i) => (
                <tr key={i} className={`${row.value === value ? "bg-cyan-400/10" : i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"}`}>
                  <td className={tdClass}>{row.value}%</td>
                  <td className={`${tdClass} font-semibold ${row.value === value ? "text-cyan-400" : ""}`}>{row.firstEntry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ Table B: 무한 순환매 영역과 청산 위험 구간 ══ */}
      {config.zones && config.zones.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-mono text-lg text-amber-400 uppercase tracking-wider">
            {t(SLIDER_TEXTS.infiniteRotationZone, lang)}
          </h4>
          <div className="rounded-xl border border-foreground/8 bg-black/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className={thClass}>{t(SLIDER_TEXTS.targetProfitRange, lang)}</th>
                  <th className={thClass}>{t(SLIDER_TEXTS.firstDrawdownGuard, lang)}</th>
                  <th className={thClass}>{t(SLIDER_TEXTS.liquidationRiskSummary, lang)}</th>
                </tr>
              </thead>
              <tbody>
                {config.zones.map((z, i) => {
                  const isActive = zoneIdx === i
                  return (
                    <tr key={i} className={isActive ? "bg-amber-400/10" : i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"}>
                      <td className={tdClass}>{lang === "ko" ? z.range : z.rangeEn}</td>
                      <td className={`${tdClass} font-semibold`}>{z.drawdown}</td>
                      <td className={`${tdClass} ${isActive ? "text-amber-400" : ""}`}>{t(z.riskSummary, lang)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ Table C: 성향별 변동률 / 1차 가두리 익절 ══ */}
      {config.personalityTP && config.personalityTP.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-mono text-lg text-rose-400 uppercase tracking-wider">
            {t(SLIDER_TEXTS.profileVolatilityTP, lang)}
          </h4>
          <div className="rounded-xl border border-foreground/8 bg-black/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className={thClass}>{t(SLIDER_TEXTS.profile, lang)}</th>
                  <th className={thClass}>{t(SLIDER_TEXTS.volatility, lang)}</th>
                  <th className={thClass}>{t(SLIDER_TEXTS.firstDrawdownGuardTP, lang)}</th>
                </tr>
              </thead>
              <tbody>
                {config.personalityTP.map((p, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"}>
                    <td className={`${tdClass} font-semibold`}>{t(p.label, lang)}</td>
                    <td className={tdClass}>{p.volatility}</td>
                    <td className={tdClass}>{p.tp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Step Content — combines HUD + data-driven sections
   ═══════════════════════════════════════════════════════ */
function StepContent({ step, lang }: { step: number; lang: Lang }) {
  const data = STRATEGY_CONTENT[step]
  const [readIndices, setReadIndices] = useState<Set<number>>(new Set())

  // Reset read state on step change — auto-check the first item (default-open)
  useEffect(() => setReadIndices(new Set([0])), [step])

  const handleModuleOpen = useCallback((index: number) => {
    setReadIndices(prev => {
      if (prev.has(index)) return prev
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  if (!data) return <div className="text-center text-foreground/40 font-mono">Mission data not found</div>

  const simData = SIM_CODE[step]
  // Use ko if available for ko lang, otherwise fallback to en
  const codeLines = simData ? (lang === "ko" && simData.ko ? simData.ko : simData.en) : []
  // Find the "cards" section for training modules tab (step 1 has one)
  const cardSection = data.sections.find((s) => s.layout === "cards")
  // Non-card sections (full text, modes, slider, advanced)
  const otherSections = data.sections.filter((s) => s !== cardSection)

  return (
    <div className="space-y-8">
      {/* Title area */}
      <div className="text-center space-y-2">
        <div className="font-mono text-[10px] text-foreground/30 uppercase tracking-[0.3em]">
          BuyLow AI Strategy Simulator
        </div>
        <h1 className="font-[var(--font-bebas)] text-3xl md:text-5xl tracking-tight">{t(data.title, lang)}</h1>
        {data.subtitle && <p className="font-mono text-xs text-foreground/40">{t(data.subtitle, lang)}</p>}
        <div className="mx-auto w-20 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>

      {/* 2-column HUD layout — desktop */}
      <div className="hidden lg:grid grid-cols-[1fr_260px] gap-5">
        {/* Left: Simulator + Training Modules */}
        <div>
          <TypingConsole lines={codeLines} step={step} />
          <TrainingModules section={cardSection} lang={lang} onOpenTab={handleModuleOpen} />
        </div>

        {/* Right: Mission Log */}
        <div className="space-y-4">
          <MissionLog step={step} lang={lang} readIndices={readIndices} />
        </div>
      </div>

      {/* Mobile layout — stacked */}
      <div className="lg:hidden space-y-5">
        <TypingConsole lines={codeLines} step={step} />
        <MissionLog step={step} lang={lang} readIndices={readIndices} />
        <TrainingModules section={cardSection} lang={lang} onOpenTab={handleModuleOpen} />
      </div>

      {/* Remaining data-driven sections — each fires checklist checks */}
      {otherSections.map((section, idx) => {
        // Step 4: custom 3-block layout with its own IntersectionObserver checks
        if (section.layout === "step4custom") {
          return <Step4Block key={idx} lang={lang} onCheckItem={handleModuleOpen} />
        }

        // Step 5: 3 sections (slider, full, full) → check 0,1,2
        // Step 6: 7 advanced cards → 7 checklist items

        if (section.layout === "modes") {
          return (
            <SectionBlock
              key={idx}
              section={section}
              lang={lang}
              onItemInteract={(cardIdx) => handleModuleOpen(cardIdx)}
            />
          )
        }

        if (section.layout === "advanced") {
          // 7 cards map 1:1 to 7 checklist items
          return (
            <SectionBlock
              key={idx}
              section={section}
              lang={lang}
              onItemInteract={(cardIdx) => handleModuleOpen(cardIdx)}
            />
          )
        }

        // If modes or advanced exist in this step, full/intro sections don't trigger checks
        const hasModes = otherSections.some(s => s.layout === "modes" || s.layout === "advanced")
        if (hasModes && section.layout === "full") {
          return <SectionBlock key={idx} section={section} lang={lang} />
        }

        // For slider/full sections without modes: count sequentially → check 0,1,2...
        // In step 5: sections = [slider, full, full] → indices 0,1,2
        const nonGroupSections = otherSections.filter(s => s.layout !== "modes" && s.layout !== "advanced")
        const myNonGroupIdx = nonGroupSections.indexOf(section)
        const checkIndex = myNonGroupIdx >= 0 ? myNonGroupIdx : idx

        return (
          <SectionBlock key={idx} section={section} lang={lang} onInteract={() => handleModuleOpen(checkIndex)} />
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Main Page Shell
   ═══════════════════════════════════════════════════════ */
function StrategyPageContent() {
  const router = useRouter()
  const sp = useSearchParams()
  const { lang: globalLang, setLang: setGlobalLang } = useLanguage()

  const [step, setStep] = useState(1)
  const [showCompletionPopup, setShowCompletionPopup] = useState(false)
  const [showEntryPopup, setShowEntryPopup] = useState(false)
  const [showEbookModal, setShowEbookModal] = useState(false)
  const hasShownEntryPopupRef = useRef(false)
  
  // Use global language context - all 6 languages now supported
  const lang: Lang = globalLang as Lang

  // Sync with global language context
  const handleLangChange = useCallback((l: string) => {
    setGlobalLang(l as Lang)
  }, [setGlobalLang])

  // Check if current language is RTL
  const isRTL = lang === "ar"

  useEffect(() => {
    const s = Number(sp.get("step")) || 1
    if (s < 1) { router.replace("/strategy?step=1"); return }
    if (s > TOTAL_STRATEGY_STEPS) { router.replace(`/strategy?step=${TOTAL_STRATEGY_STEPS}`); return }
    setStep(s)
    
    // Show entry popup on step=1 first visit only
    if (s === 1 && !hasShownEntryPopupRef.current) {
      hasShownEntryPopupRef.current = true
      setShowEntryPopup(true)
    }
  }, [sp, router])

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (isMobile) window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  const go = useCallback((s: number) => { router.push(`/strategy?step=${s}`) }, [router])
  const progress = (step / TOTAL_STRATEGY_STEPS) * 100

  return (
    <div id="strategy-root" className="relative min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <BackgroundWave />

      {/* Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ background: "rgba(0,0,0,0.7)" }} />
      <div
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          backgroundImage: [
            "linear-gradient(105deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(255,255,255,0.025) 70%, rgba(255,255,255,0.04) 100%)",
            "repeating-conic-gradient(rgba(255,255,255,0.04) 0% 25%, transparent 0% 50%)",
          ].join(", "),
          backgroundSize: "100% 100%, 8px 8px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-background/80 backdrop-blur-md border-b border-foreground/8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 font-mono text-xs text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <Shield size={12} className="text-emerald-400" />
            <span className="font-mono text-[10px] text-foreground/30 uppercase tracking-wider">Interactive Training Mode</span>
          </div>
          <span className="font-mono text-xs text-foreground/40">
            Step {step} / {TOTAL_STRATEGY_STEPS}
          </span>
          <LanguageDropdown lang={lang} onChangeLang={handleLangChange} />
        </div>
      </header>

      {/* Progress */}
      <div className="h-[2px] bg-foreground/5">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <StepContent step={step} lang={lang} />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-foreground/8">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-foreground/12 font-mono text-xs text-foreground/50 hover:text-foreground hover:border-foreground/25 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              {tHelper(translations.server.previous, lang)}
            </button>
          ) : <div />}

          {step < TOTAL_STRATEGY_STEPS ? (
            <button
              type="button"
              onClick={() => go(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 font-mono text-xs text-cyan-400 font-medium tracking-wider hover:bg-cyan-500/25 hover:border-cyan-400/50 transition-all cursor-pointer"
            >
              {tHelper(translations.server.next, lang)} {tHelper(translations.strategyUI.mission, lang)}
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCompletionPopup(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-background font-mono text-xs font-semibold tracking-wider hover:bg-accent/90 transition-colors cursor-pointer"
            >
              {tHelper(translations.strategyUI.completed, lang)}
            </button>
          )}
        </div>
      </main>

      {/* E-Book Completion Popup */}
      {showCompletionPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop - clicking outside keeps user on page */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCompletionPopup(false)}
          />
          
          {/* Popup Modal */}
          <div className="relative w-[90%] max-w-[420px] bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowCompletionPopup(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4 text-foreground/60" />
            </button>
            
            {/* Header with icon */}
            <div className="pt-8 pb-4 px-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <Book className="w-7 h-7 text-cyan-400" />
              </div>
              <h2 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight text-foreground mb-2">
                {tHelper(translations.strategyUI.ebookPopupTitle, lang)}
              </h2>
              <p className="font-mono text-xs text-foreground/50">
                {tHelper(translations.strategyUI.ebookPopupSubtitle, lang)}
              </p>
            </div>
            
            {/* Description */}
            <div className="px-6 pb-6">
              <p className="font-mono text-sm text-foreground/70 leading-relaxed whitespace-pre-line text-center">
                {tHelper(translations.strategyUI.ebookPopupDesc, lang)}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 pb-6 space-y-3">
              {/* E-Book Download Button */}
              <button
                type="button"
                onClick={() => {
                  setShowCompletionPopup(false)
                  setShowEbookModal(true)
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 font-mono text-sm text-cyan-400 font-medium tracking-wider hover:bg-cyan-500/25 hover:border-cyan-400/50 transition-all cursor-pointer"
              >
                <Download size={16} />
                {tHelper(translations.strategyUI.ebookDownloadBtn, lang)}
              </button>
              
              {/* Go to Landing Page Button */}
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-background font-mono text-sm font-semibold tracking-wider hover:bg-accent/90 transition-colors cursor-pointer"
              >
                {tHelper(translations.strategyUI.ebookGoToLanding, lang)}
                <ArrowUpRight size={16} />
              </button>
            </div>
            
            {/* Bottom decoration */}
            <div className="h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />
          </div>
        </div>
      )}

      {/* E-Book Entry Popup (step=1) */}
      {showEntryPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop - clicking outside closes popup */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowEntryPopup(false)}
          />
          
          {/* Popup Modal */}
          <div className="relative w-[90%] max-w-[420px] bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowEntryPopup(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4 text-foreground/60" />
            </button>
            
            {/* Header with icon */}
            <div className="pt-8 pb-4 px-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <Book className="w-7 h-7 text-cyan-400" />
              </div>
              <h2 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight text-foreground mb-2">
                {tHelper(translations.strategyUI.ebookEntryPopupTitle, lang)}
              </h2>
              <p className="font-mono text-xs text-foreground/50">
                {tHelper(translations.strategyUI.ebookEntryPopupSubtitle, lang)}
              </p>
            </div>
            
            {/* Description */}
            <div className="px-6 pb-6">
              <p className="font-mono text-sm text-foreground/70 leading-relaxed whitespace-pre-line text-center">
                {tHelper(translations.strategyUI.ebookEntryPopupDesc, lang)}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 pb-6 space-y-3">
              {/* E-Book Download Button */}
              <button
                type="button"
                onClick={() => {
                  setShowEntryPopup(false)
                  setShowEbookModal(true)
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 font-mono text-sm text-cyan-400 font-medium tracking-wider hover:bg-cyan-500/25 hover:border-cyan-400/50 transition-all cursor-pointer"
              >
                <Download size={16} />
                {tHelper(translations.strategyUI.ebookDownloadBtn, lang)}
              </button>
              
              {/* Continue Strategy Button */}
              <button
                type="button"
                onClick={() => setShowEntryPopup(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-background font-mono text-sm font-semibold tracking-wider hover:bg-accent/90 transition-colors cursor-pointer"
              >
                {tHelper(translations.strategyUI.ebookContinueStrategy, lang)}
                <ArrowRight size={16} />
              </button>
            </div>
            
            {/* Bottom decoration */}
            <div className="h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />
          </div>
        </div>
      )}

      {/* E-Book Download Modal (language selection) */}
      <EbookDownloadModal 
        isOpen={showEbookModal} 
        onClose={() => setShowEbookModal(false)} 
      />

      {/* Fadeout keyframe for SYSTEM ONLINE label */}
      <style jsx global>{`
        @keyframes fadeout {
          0% { opacity: 0; transform: scale(0.9); }
          15% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        @keyframes scalein {
          0% { opacity: 0; transform: scale(0); }
          60% { transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* ── Glow removal only — colors preserved ── */
        #strategy-root *,
        #strategy-root *::before,
        #strategy-root *::after {
          text-shadow: none !important;
        }
      `}</style>
    </div>
  )
}

export default function StrategyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StrategyPageContent />
    </Suspense>
  )
}
