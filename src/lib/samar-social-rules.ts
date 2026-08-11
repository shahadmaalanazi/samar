/**
 * تعليمات الردود الاجتماعية الثابتة بالمحادثة الكتابية والصوتية — سَمَر
 * مرشد سياحي ذكي يتحدث باللهجة السعودية النجدية الودودة.
 */

export function getSamarSocialReply(input: string): string | null {
  const t = input.trim().toLowerCase();

  // 1. التحية
  if (
    t.includes("السلام عليكم") ||
    t.includes("سلام عليكم") ||
    t === "السلام" ||
    t === "هلا" ||
    t === "مرحبا" ||
    t === "يا هلا" ||
    t === "أهلا" ||
    t === "اهلا" ||
    t.includes("مرحبتين") ||
    t.includes("اهلين")
  ) {
    return "وعليكم السلام ورحمة الله وبركاته، يا هلا ومرحبا! وش أقدر أخدمك فيه؟";
  }

  // 2. الشكر
  if (
    t.includes("شكرا") ||
    t.includes("شكرًا") ||
    t.includes("يعطيك العافية") ||
    t.includes("الله يعطيك العافية") ||
    t.includes("مشكور") ||
    t.includes("ما قصرت") ||
    t.includes("تسلم ايدك") ||
    t.includes("تسلم")
  ) {
    return "العفو، ما سوّينا إلا الواجب! حياك الله بأي وقت.";
  }

  // 3. المدح
  if (
    t.includes("كفو") ||
    t.includes("رهيب") ||
    t.includes("ممتاز") ||
    t.includes("حلو") ||
    t.includes("أحسنت") ||
    t.includes("احسنت") ||
    t.includes("ما شاء الله") ||
    t.includes("مشاء الله") ||
    t.includes("عجيب") ||
    t.includes("مبدع")
  ) {
    return "تسلم، هذا من ذوقك! ✨";
  }

  // 4. الاعتذار
  if (
    t.includes("آسف") ||
    t.includes("اسف") ||
    t.includes("المعذرة") ||
    t.includes("معذرة") ||
    t.includes("سامحني") ||
    t.includes("أعتذر") ||
    t.includes("اعتذر")
  ) {
    return "أبد ما عليك، ولا يهمك.";
  }

  // 5. الوداع
  if (
    t.includes("مع السلامة") ||
    t.includes("باي") ||
    t.includes("اشوفك") ||
    t.includes("أشوفك") ||
    t.includes("بروح") ||
    t.includes("إلى اللقاء") ||
    t.includes("الى اللقاء") ||
    t.includes("مع السلامه")
  ) {
    return "في أمان الله، ونشوفك على خير!";
  }

  // 6. السؤال عن الحال
  if (
    t.includes("شلونك") ||
    t.includes("كيفك") ||
    t.includes("كيف الحال") ||
    t.includes("كيف حالك") ||
    t.includes("كيف الحالك") ||
    t.includes("وش أخبارك") ||
    t.includes("وش اخبارك") ||
    t.includes("اخبارك") ||
    t.includes("أخبارك") ||
    t.includes("عساك بخير") ||
    t.includes("علومك") ||
    t.includes("شحالك") ||
    t.includes("شخبار")
  ) {
    return "بخير ولله الحمد، دامك بخير! وش ودك تعرف؟";
  }

  // 7. السؤال عن الهوية
  if (
    t.includes("من أنت") ||
    t.includes("من انت") ||
    t.includes("وش اسمك") ||
    t.includes("منو أنت") ||
    t.includes("منو انت") ||
    t.includes("وش تسوي")
  ) {
    return "أنا سَمَر، راويك الذكي. أرافقك في رحلتك وأحكي لك قصص الأماكن اللي تزورها.";
  }

  // 8. السؤال عن القدرة
  if (
    t.includes("وش تقدر تسوي") ||
    t.includes("وش تقدر") ||
    t.includes("وش تعرف") ||
    t.includes("وش تقدر تساعدني") ||
    t.includes("وش تساعدني")
  ) {
    return "أقدر أحكي لك عن تاريخ المكان ومعالمه، وأجاوبك عن اللي تشوفه حولك، ونقدر بعد نسوي تحديات تراثية سوا.";
  }

  // 9. طلب إعادة الكلام
  if (
    t.includes("ما سمعتك") ||
    t.includes("أعد") ||
    t.includes("اعد") ||
    t.includes("عيد") ||
    t.includes("ما فهمت") ||
    t.includes("وش قلت") ||
    t.includes("ممكن تعيد")
  ) {
    return "أبشر، أعيدها لك.";
  }

  // 11. طلب المساعدة العامة
  if (
    t.includes("ساعدني") ||
    t.includes("وش أسوي") ||
    t.includes("وش اسوي") ||
    t.includes("أبي مساعدة") ||
    t.includes("ابي مساعدة")
  ) {
    return "أبشر، أنا معك. قل لي وش تحتاج.";
  }

  return null;
}
