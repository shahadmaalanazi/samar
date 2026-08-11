/**
 * تعليمات الردود الاجتماعية الثابتة بالمحادثة الكتابية والصوتية — سَمَر
 * مرشد سياحي ذكي يتحدث باللهجة السعودية النجدية الودودة.
 */

export function getSamarSocialReply(input: string): string | null {
  const raw = input.trim().toLowerCase();
  const normalized = raw.replace(/[\s_\-]+/g, ""); // "السلامعليكم"

  // 1. التحية
  if (
    normalized.includes("السلامعليكم") ||
    normalized.includes("سلامعليكم") ||
    raw.includes("السلام عليكم") ||
    raw.includes("سلام عليكم") ||
    raw === "السلام" ||
    raw === "هلا" ||
    raw === "مرحبا" ||
    raw === "يا هلا" ||
    raw === "أهلا" ||
    raw === "اهلا" ||
    raw.includes("مرحبتين") ||
    raw.includes("اهلين")
  ) {
    return "وعليكم السلام ورحمة الله وبركاته، يا هلا ومرحبا! وش أقدر أخدمك فيه؟";
  }

  // 2. الشكر
  if (
    raw.includes("شكرا") ||
    raw.includes("شكرًا") ||
    raw.includes("يعطيك العافية") ||
    raw.includes("الله يعطيك العافية") ||
    raw.includes("مشكور") ||
    raw.includes("ما قصرت") ||
    raw.includes("تسلم ايدك") ||
    raw.includes("تسلم")
  ) {
    return "العفو، ما سوّينا إلا الواجب! حياك الله بأي وقت.";
  }

  // 3. المدح
  if (
    raw.includes("كفو") ||
    raw.includes("رهيب") ||
    raw.includes("ممتاز") ||
    raw.includes("حلو") ||
    raw.includes("أحسنت") ||
    raw.includes("احسنت") ||
    raw.includes("ما شاء الله") ||
    raw.includes("مشاء الله") ||
    raw.includes("عجيب") ||
    raw.includes("مبدع")
  ) {
    return "تسلم، هذا من ذوقك! ✨";
  }

  // 4. الاعتذار
  if (
    raw.includes("آسف") ||
    raw.includes("اسف") ||
    raw.includes("المعذرة") ||
    raw.includes("معذرة") ||
    raw.includes("سامحني") ||
    raw.includes("أعتذر") ||
    raw.includes("اعتذر")
  ) {
    return "أبد ما عليك، ولا يهمك.";
  }

  // 5. الوداع
  if (
    raw.includes("مع السلامة") ||
    raw.includes("باي") ||
    raw.includes("اشوفك") ||
    raw.includes("أشوفك") ||
    raw.includes("بروح") ||
    raw.includes("إلى اللقاء") ||
    raw.includes("الى اللقاء") ||
    raw.includes("مع السلامه")
  ) {
    return "في أمان الله، ونشوفك على خير!";
  }

  // 6. السؤال عن الحال
  if (
    normalized.includes("شلونك") ||
    normalized.includes("كيفك") ||
    normalized.includes("كيفالحال") ||
    normalized.includes("كيفحالك") ||
    normalized.includes("كيفالحالك") ||
    raw.includes("كيف الحال") ||
    raw.includes("كيف حالك") ||
    normalized.includes("وشاخبارك") ||
    normalized.includes("اخبارك") ||
    normalized.includes("أخبارك") ||
    normalized.includes("عساكبخير") ||
    normalized.includes("علومك") ||
    normalized.includes("شحالك") ||
    normalized.includes("شخبار")
  ) {
    return "بخير ولله الحمد، دامك بخير! وش ودك تعرف؟";
  }

  // 7. السؤال عن الهوية
  if (
    raw.includes("من أنت") ||
    raw.includes("من انت") ||
    raw.includes("وش اسمك") ||
    raw.includes("منو أنت") ||
    raw.includes("منو انت") ||
    raw.includes("وش تسوي")
  ) {
    return "أنا سَمَر، راويك الذكي. أرافقك في رحلتك وأحكي لك قصص الأماكن اللي تزورها.";
  }

  // 8. السؤال عن القدرة
  if (
    raw.includes("وش تقدر تسوي") ||
    raw.includes("وش تقدر") ||
    raw.includes("وش تعرف") ||
    raw.includes("وش تقدر تساعدني") ||
    raw.includes("وش تساعدني")
  ) {
    return "أقدر أحكي لك عن تاريخ المكان ومعالمه، وأجاوبك عن اللي تشوفه حولك، ونقدر بعد نسوي تحديات تراثية سوا.";
  }

  // 9. طلب إعادة الكلام
  if (
    raw.includes("ما سمعتك") ||
    raw.includes("أعد") ||
    raw.includes("اعد") ||
    raw.includes("عيد") ||
    raw.includes("ما فهمت") ||
    raw.includes("وش قلت") ||
    raw.includes("ممكن تعيد")
  ) {
    return "أبشر، أعيدها لك.";
  }

  // 11. طلب المساعدة العامة
  if (
    raw.includes("ساعدني") ||
    raw.includes("وش أسوي") ||
    raw.includes("وش اسوي") ||
    raw.includes("أبي مساعدة") ||
    raw.includes("ابي مساعدة")
  ) {
    return "أبشر، أنا معك. قل لي وش تحتاج.";
  }

  return null;
}
