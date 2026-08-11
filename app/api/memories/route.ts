import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-1.5-flash";

function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

export async function POST(req: Request) {
  try {
    const { site, stories, points } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({
        title: `رحلتي المذهلة في ${site}`,
        script: `زرنا ${site} واستكشفنا أجمل معالم التاريخ السعودي! تجربة لا تُنسى في سَمَر ✨🇸🇦`,
        hashtags: `#سمر #${site.replace(/\s+/g, '_')} #تراث_السعودية #سياحة_السعودية`,
        videoPrompt: "مشهد سينمائي بانورامي للشمس تشرق على النخيل والبيوت الطينية في السعودية"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `
أنت صانع محتوى محترف على TikTok و Instagram Reels متقدم في التسويق السياحي السعودي.
أنشئ حزمة ذكريات انتشارية (Viral Memories) لسائح زار ${site || "الدرعية"} وحصل على ${points || 100} نقطة.

أرجع الإجابة بصيغة JSON فقط:
{
  "title": "عنوان جذاب ومحفز للمشاهدة",
  "script": "سيناريو صادي وصوت راوي قصير (30 ثانية)",
  "hashtags": "هاشتاقات ترند متوافقة",
  "videoPrompt": "وصف ذكي للمشهد البصري المولد بالفيديو"
}
    `.trim();

    const result = await model.generateContent(prompt);
    const text = extractJson(result.response.text());
    const parsed = JSON.parse(text);
    return Response.json(parsed);

  } catch (error) {
    return Response.json({
      title: `رحلتي المذهلة في ${site}`,
      script: `زرنا ${site} واستكشفنا أجمل معالم التاريخ السعودي! تجربة لا تُنسى في سَمَر ✨🇸🇦`,
      hashtags: `#سمر #${site} #تراث_السعودية`,
      videoPrompt: "مشهد سينمائي بانورامي للشمس تشرق على البيوت الطينية"
    });
  }
}
