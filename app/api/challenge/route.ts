function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

const CHALLENGE_FALLBACK: Record<string, { question: string; options: string[]; correct: number }> = {
  "الدرعية": {
    question: "في أي عام بدأ تأسيس الدولة السعودية الأولى في الدرعية؟",
    options: ["1744 م", "1902 م", "1932 م"],
    correct: 0,
  },
  "العلا": {
    question: "ما اسم الحضارة التي نحتت مقابر الحجر في العلا? ",
    options: ["الأنباط", "الفراعنة", "الرومان"],
    correct: 0,
  },
  "قصر المصمك": {
    question: "من قاد معركة استرداد الرياض عبر قصر المصمك عام 1902م؟",
    options: ["الملك عبدالعزيز", "الملك فيصل", "الملك سعود"],
    correct: 0,
  },
  "جدة التاريخية": {
    question: "ما المادة الأساسية التي بُنيت منها بيوت جدة القديمة؟",
    options: ["الشعاب المرجانية", "الطين", "الجبس"],
    correct: 0,
  },
  "الأحساء": {
    question: "بماذا تُعرف الأحساء عالمياً؟",
    options: ["أكبر واحة نخيل في العالم", "أقدم ميناء عربي", "أعلى قلعة في الخليج"],
    correct: 0,
  },
  "الشرقية": {
    question: "بماذا اشتهرت قرى الشرقية تاريخياً على ضفاف الخليج؟",
    options: ["الغوص على اللؤلؤ", "صناعة الأسلحة", "تجارة التوابل"],
    correct: 0,
  },
};

export async function POST(req: Request) {
  const { site } = await req.json();

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }

    const prompt = `أنت مرشد تراثي سعودي. ابتكر تحدياً تفاعلياً وممتعاً عن ${site} للزائر.
شروط التحدي:
- سؤال واحد قصير ومثير للاهتمام عن تاريخ ${site} أو معمارها.
- 3 خيارات فقط، إجابة واحدة صحيحة.
- لا تكن سهلاً جداً ولا صعباً جداً.
أرجع JSON فقط بهذا الشكل بدون أي نص إضافي:
{ "question": "...", "options": ["...", "...", "..."], "correct": 0 }
ملاحظة: "correct" هو رقم index الإجابة الصحيحة (0، 1، أو 2).`;

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

    if (!rawText) throw new Error("Empty response from challenge models");

    const jsonText = extractJson(rawText);
    const parsed = JSON.parse(jsonText);

    if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length < 3) {
      throw new Error("Invalid output format");
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("⚠️ Challenge API Error:", error);
    const fallback = CHALLENGE_FALLBACK[site] ?? {
      question: "كم عدد مواقع التراث السعودي المسجلة في اليونسكو؟",
      options: ["7 مواقع", "3 مواقع", "12 موقعاً"],
      correct: 0,
    };
    return Response.json(fallback);
  }
}
