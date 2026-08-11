import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-1.5-flash";

export async function POST(req: Request) {
  const { question } = await req.json();

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY غير موجود");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `أنت «سَمَر»، مرشد سياحي ذكي يتحدث باللهجة السعودية النجدية الودودة.

قواعد الرد:
- أجب دائماً باللهجة السعودية النجدية (استخدم: وش، أبشر، يا هلا، وين، شلون، حياك).
- لا تستخدم اللهجة المصرية أو الشامية.
- للأسئلة التراثية: أجب بدقة علمية في 2-4 جمل مع ذكر المصدر الرسمي عند توفره (هيئة التراث، هيئة العلا، هيئة الدرعية، اليونسكو).
- للأسئلة الاجتماعية (تحيات، شكر، مدح): أجب بشكل طبيعي نجدي مختصر.
- لا تكتب JSON ولا أكواد، فقط نص عادي.

سؤال المستخدم: "${question}"

اكتب ردك مباشرة:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text().trim();

    if (!answer) throw new Error("empty response from Gemini");

    return Response.json({ answer, source: "Gemini AI", isLive: true });

  } catch (error) {
    console.error("⚠️ Gemini API error:", error);
    return Response.json(
      { answer: null, error: "Gemini unavailable" },
      { status: 503 }
    );
  }
}
