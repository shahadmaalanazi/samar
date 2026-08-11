function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

export async function POST(req: Request) {
  const { site, stories, points } = await req.json();

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }

    const prompt = `أنت صانع محتوى محترف على TikTok و Instagram Reels متقدم في التسويق السياحي السعودي.
أنشئ حزمة ذكريات انتشارية (Viral Memories) لسائح زار ${site || "الدرعية"} وحصل على ${points || 100} نقطة.

أرجع الإجابة بصيغة JSON فقط:
{
  "title": "عنوان جذاب ومحفز للمشاهدة",
  "script": "سيناريو صادي وصوت راوي قصير (30 ثانية)",
  "hashtags": "هاشتاقات ترند متوافقة",
  "videoPrompt": "وصف ذكي للمشهد البصري المولد بالفيديو"
}`;

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let rawText = "";

    for (const model of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
          if (rawText) break;
        }
      } catch {
        // Next model
      }
    }

    if (!rawText) throw new Error("Empty response from memories models");

    const jsonText = extractJson(rawText);
    const parsed = JSON.parse(jsonText);
    return Response.json(parsed);

  } catch (error) {
    console.error("⚠️ Memories API Error:", error);
    return Response.json({
      title: `رحلتي المذهلة في ${site}`,
      script: `زرنا ${site} واستكشفنا أجمل معالم التاريخ السعودي! تجربة لا تُنسى في سَمَر ✨🇸🇦`,
      hashtags: `#سمر #${site} #تراث_السعودية`,
      videoPrompt: "مشهد سينمائي بانورامي للشمس تشرق على البيوت الطينية"
    });
  }
}
