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
- للأسئلة التراثية والأماكن والمعالم والجغرافية (مثل: أين تقع خيبر، العلا، المصمك، الخ): أجب بدقة علمية وجغرافية في 2-4 جمل مع ذكر الموقع والمصدر الرسمي عند توفره (هيئة التراث، هيئة العلا، هيئة الدرعية، اليونسكو).
- للأسئلة الاجتماعية: أجب بشكل طبيعي نجدي مختصر.
- لا تكتب JSON ولا أكواد، فقط نص عادي.

سؤال المستخدم: "${question}"

اكتب ردك مباشرة:`;

    // Direct REST API call to Gemini - 100% reliable in Netlify Serverless Functions
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini REST API error response:", res.status, errorText);
      throw new Error(`Gemini API returned ${res.status}`);
    }

    const data = await res.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!answer) {
      throw new Error("Empty text returned from Gemini API");
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
