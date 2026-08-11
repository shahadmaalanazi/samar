import diriyah from "@/assets/diriyah.jpg";
import alula from "@/assets/alula.jpg";
import masmak from "@/assets/masmak.jpg";
import jeddah from "@/assets/jeddah.jpg";
import ahsa from "@/assets/ahsa.jpg";
import sharqiya from "@/assets/sharqiya.jpg";

export type Place = {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  tagline: string;
  description: string;
  image: string;
  stories: number;
  minutes: number;
  category: string;
  rating: number;
  coords: { x: number; y: number };
};

export const categories = [
  { id: "all", label: "الكل", labelEn: "All" },
  { id: "forts", label: "قلاع", labelEn: "Forts" },
  { id: "old-towns", label: "بلدات قديمة", labelEn: "Old towns" },
  { id: "rocks", label: "مواقع صخرية", labelEn: "Rock sites" },
  { id: "oasis", label: "واحات", labelEn: "Oases" },
];

export const places: Place[] = [
  {
    id: "diriyah",
    name: "الدرعية",
    nameEn: "Diriyah",
    region: "الرياض",
    tagline: "عاصمة الطين والتاريخ",
    description:
      "حي الطريف في الدرعية، مهد الدولة السعودية الأولى، حيث تتشابك بيوت الطين مع النخيل على ضفاف وادي حنيفة. تروي جدرانه حكايات القوافل والمجالس ومواسم الحصاد.",
    image: diriyah,
    stories: 24,
    minutes: 45,
    category: "old-towns",
    rating: 4.9,
    coords: { x: 52, y: 44 },
  },
  {
    id: "alula",
    name: "العلا",
    nameEn: "AlUla",
    region: "المدينة المنورة",
    tagline: "مدينة العجائب والقصص",
    description:
      "بين جبال الحجر المنحوتة تقف مقابر الأنباط شاهدة على حضارة عبرت طرق البخور. المكان الذي يتحدث فيه الصخر عن ألفي عام من العبور والتجارة.",
    image: alula,
    stories: 24,
    minutes: 60,
    category: "rocks",
    rating: 5.0,
    coords: { x: 30, y: 30 },
  },
  {
    id: "masmak",
    name: "قصر المصمك",
    nameEn: "Al Masmak Fort",
    region: "الرياض",
    tagline: "حصن الطين في قلب الرياض",
    description:
      "قلعة طينية بأبراجها الأربعة، شهدت لحظة فاصلة في تاريخ الجزيرة العربية. اليوم تفتح بواباتها لتحكي عن الرماح والأبواب والذاكرة.",
    image: masmak,
    stories: 12,
    minutes: 25,
    category: "forts",
    rating: 4.7,
    coords: { x: 55, y: 47 },
  },
  {
    id: "jeddah",
    name: "جدة التاريخية",
    nameEn: "Historic Jeddah",
    region: "مكة المكرمة",
    tagline: "بوابة الحرمين ورواشين البحر",
    description:
      "البلد، بأزقتها الضيقة وبيوتها المرجانية ورواشينها الخشبية، ميناء الحجاج والتجار منذ قرون. رائحة البحر ما زالت في جدرانها.",
    image: jeddah,
    stories: 18,
    minutes: 40,
    category: "old-towns",
    rating: 4.8,
    coords: { x: 24, y: 56 },
  },
  {
    id: "ahsa",
    name: "الأحساء",
    nameEn: "Al-Ahsa",
    region: "الشرقية",
    tagline: "أكبر واحة نخيل في العالم",
    description:
      "ملايين النخلات وعيون الماء الدافئة وقرى الطين. الأحساء واحة تسقي الذاكرة كما تسقي الأرض.",
    image: ahsa,
    stories: 15,
    minutes: 35,
    category: "oasis",
    rating: 4.6,
    coords: { x: 72, y: 50 },
  },
  {
    id: "sharqiya",
    name: "الشرقية",
    nameEn: "Eastern Province",
    region: "الشرقية",
    tagline: "قلاع الساحل وحكايات اللؤلؤ",
    description:
      "قلعة تاروت وقرى الساحل، حيث اجتمع الغوص على اللؤلؤ بالتجارة البحرية لتصنع هوية مختلفة على ضفاف الخليج.",
    image: sharqiya,
    stories: 10,
    minutes: 30,
    category: "forts",
    rating: 4.5,
    coords: { x: 78, y: 42 },
  },
];

export const getPlace = (id: string) => places.find((p) => p.id === id);

export type Challenge = {
  id: string;
  title: string;
  place: string;
  points: number;
  status: "active" | "in-progress" | "done";
};

export const challenges: Challenge[] = [
  { id: "c1", title: "اعثر على الباب القديم", place: "في الدرعية", points: 100, status: "active" },
  { id: "c2", title: "ما اسم هذا البرج؟", place: "في قصر المصمك", points: 100, status: "in-progress" },
  { id: "c3", title: "اكتشف النقش المخفي", place: "في العلا", points: 150, status: "in-progress" },
  { id: "c4", title: "أين يقع هذا السوق؟", place: "في جدة التاريخية", points: 100, status: "done" },
  { id: "c5", title: "سمِّ عيون الأحساء", place: "في الأحساء", points: 120, status: "done" },
  { id: "c6", title: "حكاية الغوص", place: "في الشرقية", points: 90, status: "active" },
];

export type Badge = {
  id: string;
  name: string;
  place: string;
  earned: boolean;
};

export const badges: Badge[] = [
  { id: "b1", name: "الدرعية", place: "زائر الطريف", earned: true },
  { id: "b2", name: "العلا", place: "قارئ الصخور", earned: true },
  { id: "b3", name: "قصر المصمك", place: "حارس الحصن", earned: true },
  { id: "b4", name: "جدة التاريخية", place: "ابن البلد", earned: true },
  { id: "b5", name: "الأحساء", place: "ظل النخيل", earned: false },
  { id: "b6", name: "الشرقية", place: "غواص اللؤلؤ", earned: false },
];

export const chatSuggestions = [
  "من بنى قصر المصمك؟",
  "احكِ لي قصة من العلا",
  "ما أفضل وقت لزيارة الدرعية؟",
  "ماذا كان يحدث هنا قبل ٣٠٠ سنة؟",
];

export const seedChat = [
  { role: "assistant" as const, text: "أهلاً بك في سمر. أنا راوي المكان، اسألني عن أي موقع تراثي وسأحكي لك قصته." },
];
