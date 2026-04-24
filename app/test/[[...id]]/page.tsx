"use client"

import { useState, useMemo } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, BookOpen, RotateCcw } from "lucide-react"

// ===== TEST DATA =====
const TEST_DATA = {
  title: "BUYLOW AI 3.0 TEST",
  description: "전자책 내용을 충분히 이해했는지 확인하는 단계입니다.",
  passingScore: 75,
  scorePerQuestion: 5,
  questions: [
    {
      id: 1,
      question: "AI 퀀트 프로그램을 사용해야 하는 이유로 올바른 설명은?",
      options: [
        "퀀트는 감정을 배제하고 전략대로 24시간 자동으로 매매된다",
        "AI니까 월 1000% 이상 수익을 낼 수 있다",
        "어떠한 상황에서도 무조건 수익을 낼 수 있다"
      ],
      answer: 0
    },
    {
      id: 2,
      question: "자산 선택이 중요한 이유를 잘못 설명한 사람은?",
      options: [
        "자산의 변동성에 따라 수익률이 달라진다",
        "장기적으로 우상향 자산을 선택하는 것이 중요하다",
        "변동성이 큰 알트코인이 가장 유리하다"
      ],
      answer: 2
    },
    {
      id: 3,
      question: "자산별 특징 설명 중 틀린 것은?",
      options: [
        "비트코인은 -50% 이상 원웨이 하락 가능성이 있다",
        "주식은 예측 불가능한 변수가 존재한다",
        "나스닥은 리스크가 없고 항상 안전하다",
        "금은 원웨이 하락 가능성이 높은 자산이다"
      ],
      answer: 3
    },
    {
      id: 4,
      question: "자산 분산의 중요성을 잘못 설명한 사람은?",
      options: [
        "한 종목 하락 시 다른 자산이 방어해준다",
        "특정 악재 리스크를 줄일 수 있다",
        "변동성이 큰 코인 위주로 분산해야 한다"
      ],
      answer: 2
    },
    {
      id: 5,
      question: "금(Gold)의 특징 중 틀린 것은?",
      options: [
        "금리는 상승하면 금 가격이 하락할 수 있다",
        "역사적으로 우상향 자산이다",
        "화폐 가치 하락 방어 역할을 한다",
        "비트코인이 금보다 더 안정적이다"
      ],
      answer: 3
    },
    {
      id: 6,
      question: "나스닥 / S&P500 특징 중 틀린 것은?",
      options: [
        "S&P500은 미국 대표 기업 지수다",
        "나스닥은 기술 기업 중심이다",
        "나스닥은 결국 -99% 폭락한다",
        "인플레이션 헤지 자산으로 수요가 증가한다"
      ],
      answer: 2
    },
    {
      id: 7,
      question: "비트코인 특징 중 틀린 것은?",
      options: [
        "4년 주기 사이클이 있다",
        "-70% 이상 하락 가능하다",
        "24시간 시장이다",
        "금보다 더 안정적이다"
      ],
      answer: 3
    },
    {
      id: 8,
      question: "승자의 저주 설명 중 틀린 것은?",
      options: [
        "계속 이길 것이라는 착각",
        "승리가 반복되면 리스크 증가",
        "많이 이겼으니 한 번 져도 괜찮다"
      ],
      answer: 2
    },
    {
      id: 9,
      question: "BUYLOW 알고리즘 설명 중 틀린 것은?",
      options: [
        "횡보장에서 수익을 낸다",
        "상승장에서 수익을 낸다",
        "반등 시 손실 방어 가능",
        "원웨이 하락에서도 수익 가능"
      ],
      answer: 3
    },
    {
      id: 10,
      question: "알고리즘이 손실 나는 상황은?",
      options: [
        "횡보장",
        "원웨이 하락",
        "반등 시 손실 발생"
      ],
      answer: 1
    },
    {
      id: 11,
      question: "슬리피지 & 수수료 설명 중 틀린 것은?",
      options: [
        "지정가는 수수료가 저렴하다",
        "시장가는 슬리피지 손해가 있다",
        "BUYLOW 지정가 기반이다",
        "시장가가 더 효율적이다"
      ],
      answer: 3
    },
    {
      id: 12,
      question: "1차 가두리 설명 중 틀린 것은?",
      options: [
        "횡보장에서 수익 극대화",
        "피보나치 기반 반복 매매",
        "순환매 시작 전 단계",
        "추세만 먹는 전략"
      ],
      answer: 3
    },
    {
      id: 13,
      question: "변동률 설명 중 올바른 것은?",
      options: [
        "평단가를 낮출 수 있다",
        "N차 진입 시 물량 증가",
        "진입할수록 물량 감소"
      ],
      answer: 0
    },
    {
      id: 14,
      question: "TP 시 PNL 손실이 뜨는 이유는?",
      options: [
        "실제 손실이다",
        "익절 구조 때문",
        "평단가 하락 때문",
        "전체 구조 계산 결과 이익이다"
      ],
      answer: 3
    },
    {
      id: 15,
      question: "자산 분산 설명 중 틀린 것은?",
      options: [
        "폭락 리스크 대비",
        "안전자산과 위험자산 상호 보완",
        "해킹 방지 목적"
      ],
      answer: 2
    },
    {
      id: 16,
      question: "N차 초기화가 필요 없는 상황은?",
      options: [
        "초기화가 안될 때",
        "리스크가 커질 때",
        "진입이 멈췄을 때",
        "진입 규모 변경"
      ],
      answer: 3
    },
    {
      id: 17,
      question: "롱/숏 손익비 설명 중 틀린 것은?",
      options: [
        "롱은 상승 무한대",
        "숏은 하락 제한 존재",
        "숏이 항상 더 유리하다"
      ],
      answer: 2
    },
    {
      id: 18,
      question: "손매매 위험성 중 틀린 것은?",
      options: [
        "감정 개입 가능",
        "도파민 중독 유도",
        "인생 역전 가능"
      ],
      answer: 2
    },
    {
      id: 19,
      question: "BUYLOW 가치 설명 중 올바른 것은?",
      options: [
        "한방 투자",
        "지속가능한 수익",
        "고레버리지 전략"
      ],
      answer: 1
    },
    {
      id: 20,
      question: "BUYLOW AI 설명 중 틀린 것은?",
      options: [
        "자동화 도구",
        "수익 보장",
        "사용자가 전략 설정",
        "오류 발생 가능"
      ],
      answer: 1
    }
  ]
}

// ===== TRANSLATIONS =====
const TEST_TRANSLATIONS: Record<string, {
  title: string
  description: string
  passDescription: string
  submitButton: string
  retryButton: string
  readEbookButton: string
  startGuideButton: string
  progressLabel: string
  questionPrefix: string
  resultTitle: string
  passMessage: string
  failMessage: string
  scoreLabel: string
  correctLabel: string
  passSubMessage: string
  failSubMessage: string
  selectAnswer: string
}> = {
  ko: {
    title: "BUYLOW AI 3.0 TEST",
    description: "전자책 내용을 충분히 이해했는지 확인하는 단계입니다.",
    passDescription: "15문제 이상 정답 시 가이드를 진행할 수 있습니다.",
    submitButton: "시험 제출하기",
    retryButton: "다시 풀기",
    readEbookButton: "전자책 다시 읽기",
    startGuideButton: "가이드 시작하기",
    progressLabel: "진행률",
    questionPrefix: "Q",
    resultTitle: "시험 결과",
    passMessage: "시험 통과",
    failMessage: "아쉽습니다",
    scoreLabel: "총 점수",
    correctLabel: "정답 수",
    passSubMessage: "이제 가이드를 시작할 수 있습니다",
    failSubMessage: "전자책을 다시 읽고 재도전하세요",
    selectAnswer: "답변을 선택해주세요",
  },
  en: {
    title: "BUYLOW AI 3.0 TEST",
    description: "This step confirms you fully understand the ebook content.",
    passDescription: "You must get 15 or more correct answers to proceed.",
    submitButton: "Submit Test",
    retryButton: "Try Again",
    readEbookButton: "Read Ebook Again",
    startGuideButton: "Start Guide",
    progressLabel: "Progress",
    questionPrefix: "Q",
    resultTitle: "Test Results",
    passMessage: "Test Passed",
    failMessage: "Unfortunately",
    scoreLabel: "Total Score",
    correctLabel: "Correct Answers",
    passSubMessage: "You can now start the guide",
    failSubMessage: "Please read the ebook again and try again",
    selectAnswer: "Please select an answer",
  },
  zh: {
    title: "BUYLOW AI 3.0 测试",
    description: "此步骤确认您完全理解电子书内容。",
    passDescription: "答对15题或以上才能继续。",
    submitButton: "提交测试",
    retryButton: "重新测试",
    readEbookButton: "重新阅读电子书",
    startGuideButton: "开始指南",
    progressLabel: "进度",
    questionPrefix: "Q",
    resultTitle: "测试结果",
    passMessage: "测试通过",
    failMessage: "很遗憾",
    scoreLabel: "总分",
    correctLabel: "正确数",
    passSubMessage: "您现在可以开始指南",
    failSubMessage: "请重新阅读电子书并再试一次",
    selectAnswer: "请选择答案",
  },
  ar: {
    title: "اختبار BUYLOW AI 3.0",
    description: "هذه الخطوة تؤكد أنك تفهم محتوى الكتاب الإلكتروني بشكل كامل.",
    passDescription: "يجب أن تحصل على 15 إجابة صحيحة أو أكثر للمتابعة.",
    submitButton: "إرسال الاختبار",
    retryButton: "حاول مرة أخرى",
    readEbookButton: "اقرأ الكتاب مرة أخرى",
    startGuideButton: "بدء الدليل",
    progressLabel: "التقدم",
    questionPrefix: "س",
    resultTitle: "نتائج الاختبار",
    passMessage: "اجتزت الاختبار",
    failMessage: "للأسف",
    scoreLabel: "المجموع",
    correctLabel: "الإجابات الصحيحة",
    passSubMessage: "يمكنك الآن بدء الدليل",
    failSubMessage: "يرجى قراءة الكتاب مرة أخرى والمحاولة مجدداً",
    selectAnswer: "يرجى اختيار إجابة",
  },
  ru: {
    title: "BUYLOW AI 3.0 ТЕСТ",
    description: "Этот шаг подтверждает, что вы полностью понимаете содержание электронной книги.",
    passDescription: "Для продолжения необходимо ответить правильно на 15 или более вопросов.",
    submitButton: "Отправить тест",
    retryButton: "Попробовать снова",
    readEbookButton: "Перечитать книгу",
    startGuideButton: "Начать руководство",
    progressLabel: "Прогресс",
    questionPrefix: "В",
    resultTitle: "Результаты теста",
    passMessage: "Тест пройден",
    failMessage: "К сожалению",
    scoreLabel: "Общий балл",
    correctLabel: "Правильных ответов",
    passSubMessage: "Теперь вы можете начать руководство",
    failSubMessage: "Пожалуйста, перечитайте книгу и попробуйте снова",
    selectAnswer: "Пожалуйста, выберите ответ",
  },
  es: {
    title: "BUYLOW AI 3.0 TEST",
    description: "Este paso confirma que comprendes completamente el contenido del ebook.",
    passDescription: "Debes obtener 15 o más respuestas correctas para continuar.",
    submitButton: "Enviar examen",
    retryButton: "Intentar de nuevo",
    readEbookButton: "Leer ebook de nuevo",
    startGuideButton: "Iniciar guía",
    progressLabel: "Progreso",
    questionPrefix: "P",
    resultTitle: "Resultados del examen",
    passMessage: "Examen aprobado",
    failMessage: "Lamentablemente",
    scoreLabel: "Puntuación total",
    correctLabel: "Respuestas correctas",
    passSubMessage: "Ahora puedes iniciar la guía",
    failSubMessage: "Por favor, lee el ebook de nuevo e intenta otra vez",
    selectAnswer: "Por favor selecciona una respuesta",
  },
  id: {
    title: "BUYLOW AI 3.0 TEST",
    description: "Langkah ini mengkonfirmasi bahwa Anda sepenuhnya memahami konten ebook.",
    passDescription: "Anda harus menjawab benar 15 atau lebih untuk melanjutkan.",
    submitButton: "Kirim Ujian",
    retryButton: "Coba Lagi",
    readEbookButton: "Baca Ebook Lagi",
    startGuideButton: "Mulai Panduan",
    progressLabel: "Progres",
    questionPrefix: "Q",
    resultTitle: "Hasil Ujian",
    passMessage: "Ujian Lulus",
    failMessage: "Sayangnya",
    scoreLabel: "Skor Total",
    correctLabel: "Jawaban Benar",
    passSubMessage: "Anda sekarang dapat memulai panduan",
    failSubMessage: "Silakan baca ebook lagi dan coba lagi",
    selectAnswer: "Silakan pilih jawaban",
  },
  th: {
    title: "BUYLOW AI 3.0 ข้อสอบ",
    description: "ขั้นตอนนี้ยืนยันว่าคุณเข้าใจเนื้อหา ebook อย่างครบถ้วน",
    passDescription: "คุณต้องตอบถูก 15 ข้อขึ้นไปเพื่อดำเนินการต่อ",
    submitButton: "ส่งข้อสอบ",
    retryButton: "ลองอีกครั้ง",
    readEbookButton: "อ่าน Ebook อีกครั้ง",
    startGuideButton: "เริ่มคู่มือ",
    progressLabel: "ความคืบหน้า",
    questionPrefix: "Q",
    resultTitle: "ผลการสอบ",
    passMessage: "สอบผ่าน",
    failMessage: "น่าเสียดาย",
    scoreLabel: "คะแนนรวม",
    correctLabel: "ตอบถูก",
    passSubMessage: "คุณสามารถเริ่มคู่มือได้แล้ว",
    failSubMessage: "กรุณาอ่าน ebook อีกครั้งและลองใหม่",
    selectAnswer: "กรุณาเลือกคำตอบ",
  },
  vi: {
    title: "BÀI KIỂM TRA BUYLOW AI 3.0",
    description: "Bước này xác nhận bạn đã hiểu đầy đủ nội dung ebook.",
    passDescription: "Bạn phải trả lời đúng 15 câu trở lên để tiếp tục.",
    submitButton: "Nộp bài",
    retryButton: "Làm lại",
    readEbookButton: "Đọc lại Ebook",
    startGuideButton: "Bắt đầu hướng dẫn",
    progressLabel: "Tiến độ",
    questionPrefix: "C",
    resultTitle: "Kết quả kiểm tra",
    passMessage: "Đã vượt qua",
    failMessage: "Tiếc quá",
    scoreLabel: "Tổng điểm",
    correctLabel: "Số câu đúng",
    passSubMessage: "Bạn có thể bắt đầu hướng dẫn ngay",
    failSubMessage: "Vui lòng đọc lại ebook và thử lại",
    selectAnswer: "Vui lòng chọn câu trả lời",
  },
  tr: {
    title: "BUYLOW AI 3.0 TESTİ",
    description: "Bu adım, e-kitap içeriğini tam olarak anladığınızı doğrular.",
    passDescription: "Devam etmek için 15 veya daha fazla doğru cevap vermelisiniz.",
    submitButton: "Testi Gönder",
    retryButton: "Tekrar Dene",
    readEbookButton: "E-kitabı Tekrar Oku",
    startGuideButton: "Rehbere Başla",
    progressLabel: "İlerleme",
    questionPrefix: "S",
    resultTitle: "Test Sonuçları",
    passMessage: "Testi Geçtiniz",
    failMessage: "Maalesef",
    scoreLabel: "Toplam Puan",
    correctLabel: "Doğru Cevaplar",
    passSubMessage: "Artık rehbere başlayabilirsiniz",
    failSubMessage: "Lütfen e-kitabı tekrar okuyun ve tekrar deneyin",
    selectAnswer: "Lütfen bir cevap seçin",
  },
}

// ===== QUESTION COMPONENT =====
function QuestionCard({
  questionNumber,
  question,
  options,
  selectedAnswer,
  onSelect,
  showResult,
  correctAnswer,
  questionPrefix,
}: {
  questionNumber: number
  question: string
  options: string[]
  selectedAnswer: number | null
  onSelect: (index: number) => void
  showResult: boolean
  correctAnswer: number
  questionPrefix: string
}) {
  return (
    <div className="p-5 md:p-6 bg-foreground/[0.03] border border-foreground/10 rounded-2xl">
      {/* Question header */}
      <div className="flex items-start gap-3 mb-5">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-sm font-bold text-accent">
          {questionPrefix}{questionNumber}
        </span>
        <p className="text-foreground font-medium leading-relaxed pt-1">{question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2 ml-11">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === correctAnswer
          const showCorrect = showResult && isCorrect
          const showWrong = showResult && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => !showResult && onSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${showCorrect
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                  : showWrong
                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                    : isSelected
                      ? "bg-accent/10 border-accent/50 text-accent"
                      : "bg-foreground/[0.02] border-foreground/10 text-foreground/80 hover:bg-foreground/[0.05] hover:border-foreground/20"
                } ${showResult ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3">
                {/* Radio indicator */}
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${showCorrect
                      ? "border-emerald-500 bg-emerald-500"
                      : showWrong
                        ? "border-red-500 bg-red-500"
                        : isSelected
                          ? "border-accent bg-accent"
                          : "border-foreground/30"
                    }`}
                >
                  {(isSelected || showCorrect) && (
                    <span className="w-2 h-2 rounded-full bg-background" />
                  )}
                </span>
                <span className="text-sm md:text-base leading-relaxed">{option}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ===== RESULT COMPONENT =====
function ResultCard({
  score,
  correctCount,
  totalQuestions,
  passed,
  onRetry,
  onNavigate,
  translations,
}: {
  score: number
  correctCount: number
  totalQuestions: number
  passed: boolean
  onRetry: () => void
  onNavigate: () => void
  translations: typeof TEST_TRANSLATIONS.ko
}) {
  return (
    <div
      className={`p-8 md:p-10 rounded-2xl border text-center ${passed
          ? "bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/30"
          : "bg-gradient-to-b from-red-500/10 to-transparent border-red-500/30"
        }`}
      style={{
        boxShadow: passed
          ? "0 0 60px rgba(16, 185, 129, 0.1)"
          : "0 0 60px rgba(239, 68, 68, 0.1)",
      }}
    >
      {/* Icon */}
      <div
        className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${passed ? "bg-emerald-500/20" : "bg-red-500/20"
          }`}
      >
        {passed ? (
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        ) : (
          <XCircle className="w-10 h-10 text-red-400" />
        )}
      </div>

      {/* Message */}
      <h2
        className={`text-2xl md:text-3xl font-bold mb-2 ${passed ? "text-emerald-400" : "text-red-400"
          }`}
      >
        {passed ? translations.passMessage : translations.failMessage}
      </h2>
      <p className="text-foreground/60 mb-8">
        {passed ? translations.passSubMessage : translations.failSubMessage}
      </p>

      {/* Score display */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-xs mx-auto">
        <div className="p-4 bg-foreground/5 rounded-xl">
          <p className="text-xs text-foreground/50 mb-1">{translations.scoreLabel}</p>
          <p className="text-2xl font-bold text-foreground">{score}</p>
        </div>
        <div className="p-4 bg-foreground/5 rounded-xl">
          <p className="text-xs text-foreground/50 mb-1">{translations.correctLabel}</p>
          <p className="text-2xl font-bold text-foreground">
            {correctCount}/{totalQuestions}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {passed ? (
          <button
            onClick={onNavigate}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent text-background font-bold text-lg transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: "0 0 30px rgba(31, 224, 165, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
            }}
          >
            {translations.startGuideButton}
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <>
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground/10 text-foreground font-medium transition-all hover:bg-foreground/15"
            >
              <RotateCcw className="w-4 h-4" />
              {translations.retryButton}
            </button>
            <button
              onClick={onNavigate}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-foreground/20 text-foreground/70 font-medium transition-all hover:border-foreground/40 hover:text-foreground"
            >
              <BookOpen className="w-4 h-4" />
              {translations.readEbookButton}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ===== MAIN PAGE COMPONENT =====
export default function TestPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const marketerId = params.id?.[0] as string | undefined
  const lang = searchParams.get("lang") || "ko"

  const t = TEST_TRANSLATIONS[lang] || TEST_TRANSLATIONS.ko

  // State
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState(false)

  // Calculate score
  const { score, correctCount } = useMemo(() => {
    let correct = 0
    TEST_DATA.questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++
      }
    })
    return {
      score: correct * TEST_DATA.scorePerQuestion,
      correctCount: correct,
    }
  }, [answers])

  const passed = score >= TEST_DATA.passingScore
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / TEST_DATA.questions.length) * 100

  // Handlers
  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const handleSubmit = () => {
    setShowResult(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleRetry = () => {
    setAnswers({})
    setShowResult(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNavigate = () => {
    if (passed) {
      // Pass: go to /server with marketer ID
      window.location.href = marketerId ? `/server/${marketerId}` : "/server"
    } else {
      // Fail: go to /ebook with marketer ID and lang
      window.location.href = marketerId
        ? `/ebook/${marketerId}?lang=${lang}`
        : `/ebook?lang=${lang}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-foreground/10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <a
              href={marketerId ? `/ebook/${marketerId}?lang=${lang}` : `/ebook?lang=${lang}`}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Ebook</span>
            </a>

            {/* Progress */}
            {!showResult && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/50">{t.progressLabel}</span>
                <div className="w-24 h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-foreground/70 font-medium">
                  {answeredCount}/{TEST_DATA.questions.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Title section */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t.title}</h1>
          <p className="text-foreground/60 mb-2">{t.description}</p>
          <p className="text-sm text-accent/80">{t.passDescription}</p>
        </div>

        {/* Result or Questions */}
        {showResult ? (
          <ResultCard
            score={score}
            correctCount={correctCount}
            totalQuestions={TEST_DATA.questions.length}
            passed={passed}
            onRetry={handleRetry}
            onNavigate={handleNavigate}
            translations={t}
          />
        ) : (
          <>
            {/* Questions */}
            <div className="space-y-4 mb-10">
              {TEST_DATA.questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  questionNumber={q.id}
                  question={q.question}
                  options={q.options}
                  selectedAnswer={answers[q.id] ?? null}
                  onSelect={(index) => handleSelect(q.id, index)}
                  showResult={showResult}
                  correctAnswer={q.answer}
                  questionPrefix={t.questionPrefix}
                />
              ))}
            </div>

            {/* Submit button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={answeredCount < TEST_DATA.questions.length}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${answeredCount === TEST_DATA.questions.length
                    ? "bg-accent text-background hover:scale-105"
                    : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
                  }`}
                style={
                  answeredCount === TEST_DATA.questions.length
                    ? {
                      boxShadow:
                        "0 0 30px rgba(31, 224, 165, 0.35), 0 6px 20px rgba(0, 0, 0, 0.35)",
                    }
                    : undefined
                }
              >
                {t.submitButton}
                <ArrowRight className="w-5 h-5" />
              </button>
              {answeredCount < TEST_DATA.questions.length && (
                <p className="mt-3 text-sm text-foreground/50">{t.selectAnswer}</p>
              )}
            </div>
          </>
        )}

        {/* Show answers after submission */}
        {showResult && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-foreground mb-6 text-center">
              {t.resultTitle}
            </h3>
            <div className="space-y-4">
              {TEST_DATA.questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  questionNumber={q.id}
                  question={q.question}
                  options={q.options}
                  selectedAnswer={answers[q.id] ?? null}
                  onSelect={() => { }}
                  showResult={true}
                  correctAnswer={q.answer}
                  questionPrefix={t.questionPrefix}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
