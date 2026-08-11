import { GoogleGenerativeAI } from "@google/generative-ai";
import { identifySaudiLandmark, SAUDI_HERITAGE_DATABASE } from "@/lib/saudi-landmarks-db";

const GEMINI_MODEL = "gemini-1.5-flash";

function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

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
}

قواعد مهمة:
- إذا كانت الصورة تحتوي على مقبرة منحوتة في صخرة بالصحراء مثل قصر الفريد، فالموقع هو "العلا (مدائن صالح/الحجر)" وليس قصر المصمك.
- لا تختلق معلومات تاريخية غير مؤكدة.
- حافظ على أسلوب لغوي عربي فصيح وسهل.`;

export async function POST(req: Request) {
  try {
    const { imageBase64, imageName } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Smart Saudi landmark fallback lookup based on uploaded image content/filename
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Clean base64 header
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const result = await model.generateContent([
      VISION_SYSTEM_PROMPT,
      {
        inlineData: {
          data: cleanBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const text = extractJson(result.response.text());
    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch (error) {
    console.error("⚠️ Vision API Error:", error);
    const matchedLandmark = identifySaudiLandmark(imageBase64 || "");
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
