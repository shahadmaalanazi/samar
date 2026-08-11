export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return Response.json({ answer: null, error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }

    const systemPrompt = `أنت «سَمَر»، مرشد سياحي ذكي يتحدث باللهجة السعودية النجدية الودودة.

قواعد الرد:
- أجب دائماً باللهجة السعودية النجدية (استخدم: وش، أبشر، يا هلا، وين، شلون، حياك).
- لا تستخدم اللهجة المصرية أو الشامية.
- للأسئلة التراثية والأماكن والمعالم والجغرافية: أجب بدقة علمية وجغرافية في 2-4 جمل مع ذكر الموقع والمصدر الرسمي عند توفره (هيئة التراث، هيئة العلا، هيئة الدرعية، اليونسكو).
- للأسئلة الاجتماعية: أجب بشكل طبيعي نجدي مختصر.
- لا تكتب JSON ولا أكواد، فقط نص عادي.

سؤال المستخدم: "${question}"

اكتب ردك مباشرة:`;

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let answer = "";

    for (const model of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
          if (answer) break;
        }
      } catch (e) {
        console.warn(`Model ${model} failed, trying next...`, e);
      }
    }

    if (!answer) {
      throw new Error("Empty text returned from Gemini API models");
    }

    return Response.json({ answer, source: "Gemini AI", isLive: true });
  } catch (error) {
    console.error("⚠️ Gemini API error in /api/ask:", error);
    return Response.json(
      { answer: null, error: "Gemini unavailable" },
      { status: 503 }
    );
  }
}
