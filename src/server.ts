// Force production mode to prevent TanStack from emitting dev scripts on Netlify
process.env.NODE_ENV = "production";

import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { identifySaudiLandmark } from "./lib/saudi-landmarks-db";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

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
    question: "ما اسم الحضارة التي نحتت مقابر الحجر في العلا؟",
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

const VISION_SYSTEM_PROMPT = `أنت مساعد ذكاء اصطناعي خبير ومتخصص في التعرف على المعالم التراثية والسياحية في المملكة العربية السعودية ضمن تطبيق "سمر".
تعتمد إجاباتك على المصادر الرسمية المعتمدة (هيئة التراث بوزارة الثقافة، الهيئة الملكية لمحافظة العلا، هيئة تطوير بوابة الدرعية، روح السعودية).

المهمة:
عند استلام صورة من المستخدم، قم بتحليلها وتحديد المعلم التراثي أو الموقع الظاهر فيها بدقة بدلاً من التخمين العام.

الخطوات:
1. حلل الصورة المرسلة وحدد المعلم/الموقع بناءً على السمات المعمارية والبصرية (الجبال الصخرية المنحوتة = العلا / مدائن صالح، المباني الطينية بفتحات مثلثية = الدرعية/الرياض، الحصن الطيني ذو 4 أبراج = المصمك، البيوت المرجانية برواشين خشبية = جدة التاريخية، النخيل والمغارات = الأحساء).
2. إذا تطابق المعلم مع أحد المواقع في المملكة، اربطه مباشرة وأعد بطاقته الكاملة بالصيغة المطلوبة.
3. اعتمد الدقة والتوثيق من المصادر السعودية الرسمية.

أعد الإجابة بصيغة JSON بالشكل التالي فقط، دون أي نص إضافي:

{
  "اسم_المعلم": "اسم المعلم الدقيق (مثال: قصر الفريد — العلا أو حي الطريف — الدرعية)",
  "الموقع": "المدينة / المنطقة",
  "نسبة_الثقة": "نسبة مئوية من 0 إلى 100",
  "الوصف": "نبذة تاريخية وثقافية موثقة من المصادر الرسمية (3-4 جمل)",
  "الفترة_الزمنية": "الفترة الزمنية البارزة",
  "تصنيف": "موقع صخري / قلعة / بلدة قديمة / واحة",
  "معلومة_ممتعة": "حقيقة تاريخية حقيقية أو قصة قصيرة عن الموقع",
  "مرتبط_بقاعدة_البيانات": true
}`;

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // ─── 1. Intercept /api/ask ───────────────────────────────────────────
    if (url.pathname === "/api/ask" && request.method === "POST") {
      try {
        const { question } = await request.clone().json();
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
          } catch {
            // Try next
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

    // ─── 2. Intercept /api/vision ────────────────────────────────────────
    if (url.pathname === "/api/vision" && request.method === "POST") {
      try {
        const { imageBase64, imageName } = await request.clone().json();
        const apiKey = process.env.GEMINI_API_KEY;

        const matchedLandmark = identifySaudiLandmark(imageName || imageBase64 || "");

        if (!apiKey || !imageBase64) {
          return Response.json({
            اسم_المعلم: matchedLandmark.اسم_المعلم,
            الموقع: matchedLandmark.الموقع,
            نسبة_الثقة: matchedLandmark.نسبة_الثقة,
            الوصف: matchedLandmark.الوصف,
            الفترة_الزمنية: matchedLandmark.الفترة_الزمنية,
            تصنيف: matchedLandmark.تصنيف,
            معلومة_ممتعة: matchedLandmark.معلومة_ممتعة,
            مصدر_رسمي: matchedLandmark.مصدر_رسمي,
            مرتبط_بقاعدة_البيانات: true,
          });
        }

        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
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
                  contents: [
                    {
                      parts: [
                        { text: VISION_SYSTEM_PROMPT },
                        {
                          inline_data: {
                            mime_type: "image/jpeg",
                            data: cleanBase64,
                          },
                        },
                      ],
                    },
                  ],
                }),
              }
            );

            if (res.ok) {
              const data = await res.json();
              rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
              if (rawText) break;
            }
          } catch {
            // Next
          }
        }

        if (!rawText) throw new Error("Empty response from vision models");

        const jsonText = extractJson(rawText);
        const parsed = JSON.parse(jsonText);

        return Response.json(parsed);
      } catch (error) {
        console.error("⚠️ Vision API Error:", error);
        const matchedLandmark = identifySaudiLandmark("");
        return Response.json({
          اسم_المعلم: matchedLandmark.اسم_المعلم,
          الموقع: matchedLandmark.الموقع,
          نسبة_الثقة: matchedLandmark.نسبة_الثقة,
          الوصف: matchedLandmark.الوصف,
          الفترة_الزمنية: matchedLandmark.الفترة_الزمنية,
          تصنيف: matchedLandmark.تصنيف,
          معلومة_ممتعة: matchedLandmark.معلومة_ممتعة,
          مصدر_رسمي: matchedLandmark.مصدر_رسمي,
          مرتبط_بقاعدة_البيانات: true,
        });
      }
    }

    // ─── 3. Intercept /api/challenge ─────────────────────────────────────
    if (url.pathname === "/api/challenge" && request.method === "POST") {
      let site = "";
      try {
        const body = await request.clone().json();
        site = body.site || "";
      } catch {
        // Ignore
      }

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
            // Next
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

    // ─── 4. Intercept /api/memories ──────────────────────────────────────
    if (url.pathname === "/api/memories" && request.method === "POST") {
      let site = "الدرعية";
      let points = 100;
      try {
        const body = await request.clone().json();
        site = body.site || "الدرعية";
        points = body.points || 100;
      } catch {
        // Ignore
      }

      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("GEMINI_API_KEY is not defined");
        }

        const prompt = `أنت صانع محتوى محترف على TikTok و Instagram Reels متقدم في التسويق السياحي السعودي.
أنشئ حزمة ذكريات انتشارية (Viral Memories) لسائح زار ${site} وحصل على ${points} نقطة.

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
            // Next
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

    // ─── 5. Fallthrough to TanStack Start rendering handler ───────────────
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
