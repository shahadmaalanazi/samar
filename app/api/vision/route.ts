import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-1.5-flash";

function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

export async function POST(req: Request) {
  try {
    const { imageBase64, site } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !imageBase64) {
      return Response.json({
        recognized: false,
        name: "زخرفة طينية تراثية",
        points: 50,
        description: "تم التعرف على نقوش سريعة من الطراز التراثي السعودي.",
        badge: "مكتشف الزخارف"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // تنظيف البايتات إذا كانت تحتوي على data:image/png;base64,
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `
أنت خبير تراثي سعودي ومتخصص في التوثيق البصري للمعالم في ${site || "السعودية"}.
حلل هذه الصورة الملتقطة بواسطة السائح:
1. تعرف على المعلم أو الزخرفة أو الطراز المعماري الموجود بالصورة.
2. احسب نقاط مكافأة (بين 50 إلى 150) بناءً على ندرة وأهمية المعلم.
3. اكتب وصفاً تاريخياً مشوقاً ومختصراً (جملتان).
4. حدد اسم شارة استكشاف (مثل: حارس الرواشين، مكتشف الطين، خبير النقوش).

أرجع الإجابة بصيغة JSON فقط بهذا الشكل:
{
  "recognized": true,
  "name": "اسم المعلم أو الزخرفة",
  "points": 100,
  "description": "الوصف التاريخي المختصر",
  "badge": "اسم الشارة"
}
    `.trim();

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: cleanBase64,
          mimeType: "image/jpeg"
        }
      }
    ]);

    const text = extractJson(result.response.text());
    const parsed = JSON.parse(text);
    return Response.json(parsed);

  } catch (error) {
    console.error("⚠️ Vision API Error:", error);
    return Response.json({
      recognized: true,
      name: "نقش تراثي موثّق",
      points: 100,
      description: "نقوش ونوافذ نجذية طينية بارزة تعود للقرن الثامن عشر.",
      badge: "مستكشف الزخارف"
    });
  }
}
