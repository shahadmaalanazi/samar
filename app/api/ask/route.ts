import { GoogleGenerativeAI } from "@google/generative-ai";
import { FALLBACK_KNOWLEDGE } from "@/lib/fallbackData";

// ─── الموديل — تحقق من AI Studio إذا تغيّر الاسم ───────────────────────
const GEMINI_MODEL = "gemini-1.5-flash";

// ─── مساعد: استخرج JSON من نص قد يحتوي على markdown ```json ─────────────
function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

export async function POST(req: Request) {
  const { question, site } = await req.json();

  // ─── 1. محاولة Gemini ──────────────────────────────────────────────────
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY غير موجود");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `
أنت مرشد سياحي سعودي خبير ومتخصص في ${site}.
أجب على السؤال التالي بدقة تاريخية وعلمية: "${question}"
يجب أن:
- تكون الإجابة باللغة العربية الفصحى.
- لا تتجاوز 3 جمل قصيرة وواضحة.
- تذكر اسم المصدر الرسمي (مثل: هيئة التراث، هيئة الدرعية، اليونسكو...).
أرجع الإجابة بصيغة JSON فقط بدون أي نص إضافي:
{ "answer": "...", "source": "...", "isLive": true }
    `.trim();

    const result = await model.generateContent(prompt);
    const text = extractJson(result.response.text());

    // تحقق أن المخرج JSON صالح
    const parsed = JSON.parse(text);
    return Response.json(parsed);

  } catch (error) {
    console.error("⚠️ Gemini فشل — تشغيل Fallback:", error);

    // ─── 2. Fallback: البيانات المحلية الموثّقة ───────────────────────────
    const siteData = FALLBACK_KNOWLEDGE[site as keyof typeof FALLBACK_KNOWLEDGE];
    return Response.json({
      answer: siteData?.description ?? "هذا الموقع التراثي يحمل تاريخاً عريقاً يمتد لمئات السنين.",
      source: siteData?.source ?? "قاعدة بيانات سمر المحلية",
      isLive: false,
    });
  }
}
