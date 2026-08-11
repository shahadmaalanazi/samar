"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Compass, Mic, Square, Hourglass, User,
  Search, Star, Headphones, Heart, MapPin, ShieldCheck,
  Sparkles, Trophy, CheckCircle2, Clock, Circle,
  ChevronLeft, ChevronRight, Send, Award, Download, Share2, QrCode,
  Volume2, VolumeX, Settings, Moon, ArrowRight, Map, Globe, Bell, Volume, Info, LogOut,
  Camera, Eye, Video, Play, Zap
} from "lucide-react";
import { toPng } from "html-to-image";

/* ═══════════════════════════════════════════════════════════════════════
   SPEECH UTILITIES
═══════════════════════════════════════════════════════════════════════ */
function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ar-SA"; utt.rate = 0.9;
  const v = window.speechSynthesis.getVoices().find(x => x.lang.startsWith("ar"));
  if (v) utt.voice = v;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

function useSpeechInput(onResult: (t: string) => void) {
  const [listening, setListening] = useState(false);
  const ref = useRef<any>(null);
  const start = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("استخدم Chrome للتعرف على الصوت."); return; }
    const r = new SR(); r.lang = "ar-SA"; r.continuous = false; r.interimResults = false;
    r.onresult = (e: any) => onResult(e.results[0][0].transcript);
    r.onend = () => setListening(false); r.onerror = () => setListening(false);
    ref.current = r; r.start(); setListening(true);
  }, [onResult]);
  const stop = useCallback(() => { ref.current?.stop(); setListening(false); }, []);
  return { listening, start, stop };
}

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS (DYNAMIC THEMING)
═══════════════════════════════════════════════════════════════════════ */
const LIGHT_C = {
  bg:      "oklch(0.965 0.012 80)",
  card:    "oklch(0.985 0.006 82)",
  primary: "oklch(0.43 0.075 52)",
  fg:      "oklch(0.975 0.012 84)",
  sec:     "oklch(0.94 0.018 78)",
  muted:   "oklch(0.60 0.025 60)",
  accent:  "oklch(0.60 0.09 55)",
  border:  "oklch(0.90 0.015 78)",
  ink:     "oklch(0.24 0.03 52)",
};

const DARK_C = {
  bg:      "oklch(0.18 0.015 50)",
  card:    "oklch(0.22 0.012 52)",
  primary: "oklch(0.58 0.11 55)",
  fg:      "oklch(0.95 0.01 80)",
  sec:     "oklch(0.26 0.015 52)",
  muted:   "oklch(0.65 0.02 65)",
  accent:  "oklch(0.65 0.10 55)",
  border:  "oklch(0.30 0.015 52)",
  ink:     "oklch(0.94 0.012 80)",
};

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */
const places = [
  { id:"diriyah",  name:"الدرعية",       region:"الرياض",          tagline:"عاصمة الطين والتاريخ",        desc:"حي الطريف في الدرعية، مهد الدولة السعودية الأولى، حيث تتشابك بيوت الطين مع النخيل على ضفاف وادي حنيفة.", img:"/images/diriyah.jpg",  stories:24, rating:4.9, cat:"old-towns" },
  { id:"alula",    name:"العلا",          region:"المدينة المنورة", tagline:"مدينة العجائب والقصص",       desc:"بين جبال الحجر المنحوتة تقف مقابر الأنباط شاهدة على حضارة عبرت طرق البخور.",                           img:"/images/alula.jpg",    stories:24, rating:5.0, cat:"rocks"     },
  { id:"masmak",   name:"قصر المصمك",    region:"الرياض",          tagline:"حصن الطين في قلب الرياض",   desc:"قلعة طينية بأبراجها الأربعة، شهدت لحظة فاصلة في تاريخ الجزيرة العربية.",                               img:"/images/masmak.jpg",   stories:12, rating:4.7, cat:"forts"     },
  { id:"jeddah",   name:"جدة التاريخية", region:"مكة المكرمة",     tagline:"بوابة الحرمين ورواشين البحر",desc:"البلد، بأزقتها الضيقة وبيوتها المرجانية، ميناء الحجاج والتجار منذ قرون.",                             img:"/images/jeddah.jpg",   stories:18, rating:4.8, cat:"old-towns" },
  { id:"ahsa",     name:"الأحساء",       region:"الشرقية",         tagline:"أكبر واحة نخيل في العالم", desc:"ملايين النخلات وعيون الماء الدافئة وقرى الطين. الأحساء واحة تسقي الذاكرة.",                            img:"/images/ahsa.jpg",     stories:15, rating:4.6, cat:"oasis"     },
  { id:"sharqiya", name:"الشرقية",       region:"الشرقية",         tagline:"قلاع الساحل وحكايات اللؤلؤ",desc:"قلعة تاروت وقرى الساحل، حيث اجتمع الغوص على اللؤلؤ بالتجارة البحرية.",                               img:"/images/sharqiya.jpg", stories:10, rating:4.5, cat:"forts"     },
];
type Place = typeof places[0];

const CATS = [
  {id:"all",label:"الكل"},{id:"forts",label:"قلاع"},
  {id:"old-towns",label:"بلدات قديمة"},{id:"rocks",label:"مواقع صخرية"},{id:"oasis",label:"واحات"},
];

const challenges = [
  {id:"c1",title:"اعثر على الباب القديم", place:"في الدرعية",        pts:100,status:"active"      as const},
  {id:"c2",title:"ما اسم هذا البرج؟",    place:"في قصر المصمك",    pts:100,status:"in-progress" as const},
  {id:"c3",title:"اكتشف النقش المخفي",   place:"في العلا",          pts:150,status:"in-progress" as const},
  {id:"c4",title:"أين يقع هذا السوق؟",   place:"في جدة التاريخية", pts:100,status:"done"        as const},
  {id:"c5",title:"سمِّ عيون الأحساء",    place:"في الأحساء",        pts:120,status:"done"        as const},
  {id:"c6",title:"حكاية الغوص",          place:"في الشرقية",        pts: 90,status:"active"      as const},
];

const TIPS = ["من بنى قصر المصمك؟","احكِ لي قصة من العلا","ما أفضل وقت لزيارة الدرعية؟","ماذا كان يحدث هنا قبل ٣٠٠ سنة؟"];

type Tab = "home"|"explore"|"voice"|"achievements"|"profile";

const NAV_ITEMS: {id:Tab; icon:React.ElementType; label:string}[] = [
  {id:"home",         icon:Home,      label:"الرئيسية"},
  {id:"explore",      icon:Compass,   label:"اكتشف"   },
  {id:"voice",        icon:Mic,       label:"الراوي"  },
  {id:"achievements", icon:Hourglass, label:"إنجازاتي"},
  {id:"profile",      icon:User,      label:"ملفي"    },
];

/* ═══════════════════════════════════════════════════════════════════════
   SHARED BITS
═══════════════════════════════════════════════════════════════════════ */
const Veil = () => (
  <div className="absolute inset-0 pointer-events-none"
       style={{background:"linear-gradient(to top,oklch(0.15 0.02 50 / 0.85),transparent 60%)"}} />
);

function IconBtn({icon:Icon, onClick, C}: {icon:React.ElementType; onClick?:()=>void; C: typeof LIGHT_C}) {
  return (
    <button onClick={onClick}
      className="h-9 w-9 rounded-full flex items-center justify-center border shrink-0 transition-colors"
      style={{background:C.card,borderColor:C.border}}>
      <Icon className="h-4 w-4" style={{color:C.ink}} />
    </button>
  );
}

function PageHdr({title,sub,left,right,C}:{title:string;sub?:string;left?:React.ReactNode;right?:React.ReactNode;C:typeof LIGHT_C}) {
  return (
    <div className="px-5 pt-5 pb-2 shrink-0">
      <div className="flex items-center justify-between">
        {left ?? <div className="w-9"/>}
        <h1 className="text-base font-bold" style={{color:C.ink}}>{title}</h1>
        {right ?? <div className="w-9"/>}
      </div>
      {sub && <p className="text-xs text-center mt-0.5" style={{color:C.muted}}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   BOTTOM NAV (mobile / tablet)
═══════════════════════════════════════════════════════════════════════ */
function BottomNav({active,set,C}:{active:Tab;set:(t:Tab)=>void;C:typeof LIGHT_C}) {
  const left  = [{id:"profile" as Tab,icon:User,label:"ملفي"},{id:"achievements" as Tab,icon:Hourglass,label:"إنجازاتي"}];
  const right = [{id:"explore" as Tab,icon:Compass,label:"اكتشف"},{id:"home" as Tab,icon:Home,label:"الرئيسية"}];
  const item = (id:Tab,Icon:React.ElementType,label:string) => {
    const on = active===id;
    return (
      <button key={id} onClick={()=>set(id)}
        className="flex w-14 flex-col items-center gap-1 py-1 text-[10px] font-semibold transition-colors"
        style={{color: on ? C.primary : C.muted}}>
        <Icon className="h-5 w-5" style={{strokeWidth: on ? 2.5 : 2}} />
        {label}
      </button>
    );
  };
  return (
    <nav className="shrink-0 border-t transition-colors" style={{background:C.card,borderColor:C.border}}>
      <div className="flex items-end justify-between px-3 pt-1 pb-3">
        <div className="flex">{left.map(x=>item(x.id,x.icon,x.label))}</div>
        <button onClick={()=>set("voice")} className="-mt-5"
          style={{filter:`drop-shadow(0 6px 14px ${C.primary}55)`}}>
          <div className="h-14 w-14 rounded-full flex items-center justify-center text-white border-4"
               style={{background:C.primary,borderColor:C.card}}>
            <Mic className="h-6 w-6 text-white" />
          </div>
        </button>
        <div className="flex">{right.map(x=>item(x.id,x.icon,x.label))}</div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SIDEBAR NAV (desktop)
═══════════════════════════════════════════════════════════════════════ */
function SideNav({active,set,C}:{active:Tab;set:(t:Tab)=>void;C:typeof LIGHT_C}) {
  return (
    <aside className="hidden lg:flex flex-col shrink-0 border-l h-full sticky top-0 transition-colors"
           style={{width:220,background:C.card,borderColor:C.border}}>
      <div className="px-6 py-6 border-b flex flex-col items-center text-center" style={{borderColor:C.border}}>
        <img src="/logo.png" alt="شعار سمر" className="h-16 w-auto object-contain mb-2" />
        <p className="text-sm font-bold" style={{color:C.ink}}>سَمَر</p>
        <p className="text-[11px] mt-0.5" style={{color:C.muted}}>حيث تحكي الأماكن قصصها</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({id,icon:Icon,label})=>{
          const on = active===id;
          return (
            <button key={id} onClick={()=>set(id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-right"
              style={{
                background: on ? C.sec : "transparent",
                color: on ? C.primary : C.muted,
              }}>
              <Icon className="h-5 w-5 shrink-0" style={{strokeWidth: on ? 2.5 : 2}} />
              {label}
              {id==="voice" && (
                <span className="mr-auto h-2 w-2 rounded-full" style={{background:C.primary}} />
              )}
            </button>
          );
        })}
      </nav>
      <div className="px-6 py-6 border-t text-xs text-center" style={{borderColor:C.border,color:C.muted}}>
        SAMAR AI · 2026
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME TAB
═══════════════════════════════════════════════════════════════════════ */
function HomeTab({onPlace,goExplore,toggleTheme,C}:{onPlace:(p:Place)=>void;goExplore:()=>void;toggleTheme:()=>void;C:typeof LIGHT_C}) {
  return (
    <div className="pb-6">
      <div className="px-5 pt-6 flex items-start justify-between">
        <div className="flex gap-2 items-center">
          <IconBtn icon={Moon} onClick={toggleTheme} C={C} />
          <div className="h-9 px-3 rounded-full flex items-center border text-xs font-bold"
               style={{background:C.card,borderColor:C.border,color:C.ink}}>EN</div>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-lg font-bold" style={{color:C.ink}}>السلام عليكم</p>
            <p className="text-xs" style={{color:C.muted}}>إلى أين تريد السفر اليوم؟</p>
          </div>
          <img src="/logo.png" alt="شعار سمر" className="h-10 w-auto object-contain shrink-0" />
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border"
             style={{background:C.card,borderColor:C.border}}>
          <ChevronLeft className="h-4 w-4" style={{color:C.muted}} />
          <span className="flex-1 text-sm text-right" style={{color:C.muted}}>ابحث عن مكان...</span>
          <Search className="h-4 w-4" style={{color:C.muted}} />
        </div>
      </div>

      <section className="px-5 pt-6">
        <div className="flex items-center justify-between mb-3">
          <button onClick={goExplore} className="text-xs font-bold" style={{color:C.muted}}>الخريطة</button>
          <h2 className="text-base font-bold" style={{color:C.ink}}>اكتشف المناطق</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
          {places.map((p,i)=>(
            <motion.button key={p.id}
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              onClick={()=>onPlace(p)}
              className="relative overflow-hidden rounded-2xl border transition-transform hover:scale-[1.02]"
              style={{borderColor:C.border}}>
              <img src={p.img} alt={p.name} className="h-36 lg:h-40 w-full object-cover" />
              <Veil />
              <span className="absolute bottom-3 end-3 text-sm font-bold text-white drop-shadow-md">{p.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="px-5 pt-6">
        <div className="flex items-center justify-between mb-3">
          <button className="text-xs font-bold" style={{color:C.muted}}>الكل</button>
          <h2 className="text-base font-bold" style={{color:C.ink}}>جولة صوتية مميزة</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {places.slice(0,2).map(p=>(
            <FeatCard key={p.id} place={p} onClick={()=>onPlace(p)} C={C} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatCard({place,onClick,C}:{place:Place;onClick:()=>void;C:typeof LIGHT_C}) {
  const [fav,setFav] = useState(false);
  return (
    <div className="overflow-hidden rounded-3xl border transition-colors" style={{background:C.card,borderColor:C.border}}>
      <button onClick={onClick} className="block w-full">
        <div className="relative"><img src={place.img} alt={place.name} className="h-44 w-full object-cover" /><Veil /><span className="absolute bottom-3 end-4 text-base font-bold text-white">{place.name}</span></div>
      </button>
      <div className="flex items-center gap-3 p-4">
        <button onClick={()=>setFav(f=>!f)} className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full border"
          style={{borderColor:C.border,background:fav?C.primary:C.sec}}>
          <Heart className="h-4 w-4" style={{color:fav?"white":C.muted,fill:fav?"white":"none"}} />
        </button>
        <div className="flex-1 text-right">
          <p className="text-sm font-semibold" style={{color:C.ink}}>{place.tagline}</p>
          <div className="flex items-center justify-end gap-3 mt-0.5 text-xs" style={{color:C.muted}}>
            <span className="flex items-center gap-1"><Star className="h-3 w-3" />{place.rating}</span>
            <span className="flex items-center gap-1"><Headphones className="h-3 w-3" />{place.stories} قصة</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   EXPLORE TAB
═══════════════════════════════════════════════════════════════════════ */
function ExploreTab({onPlace,C}:{onPlace:(p:Place)=>void;C:typeof LIGHT_C}) {
  const [search,setSearch] = useState("");
  const [cat,setCat] = useState("all");
  const [favs,setFavs] = useState<string[]>([]);
  const list = places.filter(p=>(cat==="all"||p.cat===cat)&&(p.name.includes(search)||p.tagline.includes(search)));

  return (
    <div className="pb-6">
      <PageHdr title="اكتشف" sub={`${places.length} مواقع تراثية`}
        left={<IconBtn icon={Map} C={C} />} right={<IconBtn icon={ArrowRight} C={C} />} C={C} />

      <div className="px-5 pt-2 pb-3">
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border" style={{background:C.card,borderColor:C.border}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن مكان..."
            className="flex-1 bg-transparent outline-none text-sm text-right" style={{color:C.ink}} />
          <Search className="h-4 w-4 shrink-0" style={{color:C.muted}} />
        </div>
      </div>

      <div className="px-5 pb-4 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
        {CATS.map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)}
            className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold border transition-colors"
            style={{background:cat===c.id?C.primary:C.card,color:cat===c.id?C.fg:C.muted,borderColor:cat===c.id?"transparent":C.border}}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="px-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list.map((p,i)=>{
          const isFav=favs.includes(p.id);
          return (
            <motion.div key={p.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              className="overflow-hidden rounded-3xl border transition-colors" style={{background:C.card,borderColor:C.border}}>
              <button onClick={()=>onPlace(p)} className="block w-full">
                <div className="relative"><img src={p.img} alt={p.name} className="h-44 w-full object-cover" /><Veil /><span className="absolute bottom-3 end-4 text-base font-bold text-white">{p.name}</span></div>
              </button>
              <div className="flex items-center gap-3 px-4 py-3">
                <button onClick={()=>setFavs(f=>isFav?f.filter(x=>x!==p.id):[...f,p.id])}
                  className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full border"
                  style={{borderColor:C.border,background:isFav?C.primary:C.sec}}>
                  <Heart className="h-4 w-4" style={{color:isFav?"white":C.muted,fill:isFav?"white":"none"}} />
                </button>
                <div className="flex-1 text-right">
                  <p className="text-sm font-semibold" style={{color:C.ink}}>{p.tagline}</p>
                  <div className="flex items-center justify-end gap-3 mt-0.5 text-xs" style={{color:C.muted}}>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" />{p.rating}</span>
                    <span className="flex items-center gap-1"><Headphones className="h-3 w-3" />{p.stories} قصة</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ACHIEVEMENTS TAB
═══════════════════════════════════════════════════════════════════════ */
function AchievementsTab({toggleTheme,C}:{toggleTheme:()=>void;C:typeof LIGHT_C}) {
  const [filter,setFilter] = useState<"all"|"in-progress"|"done">("all");
  const filters=[{id:"all" as const,label:"الكل"},{id:"in-progress" as const,label:"قيد التقدم"},{id:"done" as const,label:"مكتملة"}];
  const list=challenges.filter(c=>filter==="all"||c.status===filter);
  return (
    <div className="pb-6">
      <PageHdr title="التحديات" sub="اجمع النقاط واكشف القصص" left={<IconBtn icon={Moon} onClick={toggleTheme} C={C} />} right={<IconBtn icon={ArrowRight} C={C} />} C={C} />
      <div className="px-5 pt-2 pb-4 flex gap-2 justify-end">
        {filters.map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)}
            className="rounded-full px-4 py-2 text-xs font-semibold border transition-colors"
            style={{background:filter===f.id?C.primary:C.card,color:filter===f.id?C.fg:C.muted,borderColor:filter===f.id?"transparent":C.border}}>
            {f.label}
          </button>
        ))}
      </div>
      <ul className="px-5 space-y-3">
        {list.map((c,i)=>(
          <motion.li key={c.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="flex items-center gap-3 rounded-2xl border p-4 transition-colors"
            style={{background:C.card,borderColor:C.border}}>
            <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center border"
                 style={{borderColor:c.status==="done"?C.primary:C.border,background:c.status==="done"?C.primary:C.sec}}>
              {c.status==="done"?<CheckCircle2 className="h-5 w-5 text-white" />
               :c.status==="in-progress"?<Clock className="h-5 w-5" style={{color:C.accent}} />
               :<Circle className="h-5 w-5" style={{color:C.muted}} />}
            </div>
            <div className="flex-1 text-right min-w-0">
              <p className="text-sm font-bold truncate" style={{color:C.ink}}>{c.title}</p>
              <p className="text-xs mt-0.5" style={{color:C.muted}}>{c.place}</p>
            </div>
            <span className="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
              style={{background:C.sec,color:C.muted}}>{c.pts} نقطة</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PROFILE TAB
═══════════════════════════════════════════════════════════════════════ */
function ProfileTab({goAch,goFav,goSettings,toggleTheme,C}:{goAch:()=>void;goFav:()=>void;goSettings:()=>void;toggleTheme:()=>void;C:typeof LIGHT_C}) {
  return (
    <div className="pb-6">
      <PageHdr title="ملفي" left={<IconBtn icon={Moon} onClick={toggleTheme} C={C} />} right={<IconBtn icon={ArrowRight} C={C} />} C={C} />
      <div className="flex flex-col items-center pt-4 pb-6">
        <div className="h-20 w-20 rounded-full flex items-center justify-center border-2 mb-3"
             style={{background:C.sec,borderColor:C.accent}}>
          <span className="text-3xl font-black" style={{color:C.primary}}>س</span>
        </div>
        <h2 className="text-xl font-bold" style={{color:C.ink}}>سارة الحربي</h2>
        <p className="text-xs mt-1" style={{color:C.muted}}>مستكشف</p>
      </div>

      <div className="mx-5 rounded-3xl border p-4 mb-3 transition-colors" style={{background:C.card,borderColor:C.border}}>
        <div className="grid grid-cols-3">
          {[{v:15,l:"التحديات"},{v:28,l:"القصص"},{v:12,l:"الرحلات"}].map((s,i)=>(
            <div key={s.l} className={`text-center px-2 ${i>0?"border-r":""}`} style={{borderColor:C.border}}>
              <p className="text-2xl font-black" style={{color:C.ink}}>{s.v}</p>
              <p className="text-[10px] mt-0.5" style={{color:C.muted}}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-5 rounded-3xl border p-4 mb-3 transition-colors" style={{background:C.card,borderColor:C.border}}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs" style={{color:C.muted}}>مستواك الحالي</p>
        </div>
        <p className="text-base font-bold text-right mb-3" style={{color:C.ink}}>مستكشف</p>
        <div className="h-2.5 rounded-full overflow-hidden" style={{background:C.sec}}>
          <div className="h-full rounded-full w-[60%]" style={{background:C.primary}} />
        </div>
        <p className="text-xs mt-2" style={{color:C.muted}}>3500 / 2100</p>
      </div>

      <div className="mx-5 space-y-2">
        {[
          {icon:Award,   label:"إنجازاتي", sub:"12 شارة",onClick:goAch},
          {icon:Heart,   label:"المفضلة",  sub:"0 موقع", onClick:goFav},
          {icon:Settings,label:"الإعدادات",sub:"",        onClick:goSettings},
        ].map(item=>(
          <button key={item.label} onClick={item.onClick}
            className="w-full flex items-center gap-3 rounded-3xl border p-4 text-right transition-colors"
            style={{background:C.card,borderColor:C.border}}>
            <ChevronLeft className="h-4 w-4 shrink-0" style={{color:C.muted}} />
            {item.sub && <span className="text-xs" style={{color:C.muted}}>{item.sub}</span>}
            <div className="flex-1" />
            <span className="text-sm font-bold" style={{color:C.ink}}>{item.label}</span>
            <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{background:C.sec}}>
              <item.icon className="h-4 w-4" style={{color:C.accent}} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SETTINGS PAGE (MATCHING THE USER'S SCREENSHOT EXACTLY)
═══════════════════════════════════════════════════════════════════════ */
function SettingsPage({onBack,isDark,toggleDark,C}:{onBack:()=>void;isDark:boolean;toggleDark:()=>void;C:typeof LIGHT_C}) {
  const [autoVoice, setAutoVoice] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="pb-8">
      <PageHdr title="الإعدادات" left={<div className="w-9"/>} right={<IconBtn icon={ArrowRight} onClick={onBack} C={C} />} C={C} />

      <div className="px-5 pt-4 space-y-3.5 max-w-lg mx-auto" dir="rtl">
        {/* Dark Mode Switch */}
        <div className="flex items-center justify-between rounded-3xl border p-4 transition-colors" style={{background:C.card, borderColor:C.border}}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{background:C.sec}}>
              <Moon className="h-4.5 w-4.5" style={{color:C.accent}} />
            </div>
            <span className="text-sm font-bold" style={{color:C.ink}}>الوضع الليلي</span>
          </div>
          <button onClick={toggleDark} className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
                  style={{background: isDark ? C.primary : C.border}}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? "translate-x-1" : "translate-x-6"}`} />
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between rounded-3xl border p-4 transition-colors" style={{background:C.card, borderColor:C.border}}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{background:C.sec}}>
              <Globe className="h-4.5 w-4.5" style={{color:C.accent}} />
            </div>
            <span className="text-sm font-bold" style={{color:C.ink}}>اللغة</span>
          </div>
          <span className="text-xs px-3.5 py-1.5 rounded-full font-bold" style={{background:C.sec, color:C.muted}}>العربية</span>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between rounded-3xl border p-4 transition-colors" style={{background:C.card, borderColor:C.border}}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{background:C.sec}}>
              <Bell className="h-4.5 w-4.5" style={{color:C.accent}} />
            </div>
            <span className="text-sm font-bold" style={{color:C.ink}}>الإشعارات</span>
          </div>
          <button onClick={()=>setNotifications(n=>!n)} className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
                  style={{background: notifications ? C.primary : C.border}}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? "translate-x-1" : "translate-x-6"}`} />
          </button>
        </div>

        {/* Auto Voice */}
        <div className="flex items-center justify-between rounded-3xl border p-4 transition-colors" style={{background:C.card, borderColor:C.border}}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{background:C.sec}}>
              <Volume className="h-4.5 w-4.5" style={{color:C.accent}} />
            </div>
            <span className="text-sm font-bold" style={{color:C.ink}}>تشغيل الصوت تلقائياً</span>
          </div>
          <button onClick={()=>setAutoVoice(v=>!v)} className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
                  style={{background: autoVoice ? C.primary : C.border}}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoVoice ? "translate-x-1" : "translate-x-6"}`} />
          </button>
        </div>

        {/* About App */}
        <div className="flex items-center justify-between rounded-3xl border p-4 transition-colors" style={{background:C.card, borderColor:C.border}}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{background:C.sec}}>
              <Info className="h-4.5 w-4.5" style={{color:C.accent}} />
            </div>
            <span className="text-sm font-bold" style={{color:C.ink}}>عن التطبيق</span>
          </div>
          <span className="text-xs font-medium" style={{color:C.muted}}>v1.0</span>
        </div>

        {/* Logout button */}
        <div className="pt-4">
          <button onClick={()=>alert("تم تسجيل الخروج")}
            className="w-full flex items-center justify-center gap-2 rounded-full border py-3.5 text-sm font-bold transition-all active:scale-[0.98]"
            style={{borderColor:"oklch(0.65 0.18 30 / 0.4)", color:"oklch(0.65 0.18 30)", background:"transparent"}}>
            <LogOut className="h-4 w-4 rotate-180" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   VOICE TAB
═══════════════════════════════════════════════════════════════════════ */
type VS = "idle"|"listening"|"thinking"|"speaking";

function VoiceTab({toggleTheme,C}:{toggleTheme:()=>void;C:typeof LIGHT_C}) {
  const [vs,setVs]             = useState<VS>("idle");
  const [transcript,setTrans]  = useState("");
  const [answer,setAnswer]     = useState("");
  const [source,setSrc]        = useState("");
  const [isLive,setLive]       = useState(true);
  const [bars,setBars]         = useState<number[]>(Array.from({length:36},(_,i)=>0.25 + Math.abs(Math.sin(i * 0.45)) * 0.55));
  const [muted,setMuted]       = useState(false);
  const [textMode,setTextMode] = useState(false);
  const [textQ,setTextQ]       = useState("");

  useEffect(()=>{
    if(vs!=="listening" && vs!=="speaking") return;
    const id = setInterval(()=>setBars(Array.from({length:36},()=>0.15+Math.random()*0.85)), 80);
    return ()=>clearInterval(id);
  },[vs]);

  const askGemini = async (q:string)=>{
    setVs("thinking");
    try {
      const r = await fetch("/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q,site:"التراث السعودي"})});
      const d = await r.json();
      setAnswer(d.answer); setSrc(d.source); setLive(d.isLive);
      if(!muted){setVs("speaking"); speak(d.answer,()=>setVs("idle"));}
      else setVs("idle");
    } catch { setAnswer("عذراً، واجهت مشكلة في الاتصال."); setVs("idle"); }
  };

  const {listening,start,stop} = useSpeechInput((t)=>{setTrans(t); askGemini(t);});

  const handleMic = ()=>{
    if(vs==="listening"){ stop(); setVs("idle"); }
    else if(vs==="speaking"){ window.speechSynthesis?.cancel(); setVs("idle"); }
    else { setTrans(""); setAnswer(""); start(); setVs("listening"); }
  };

  const subtitle:Record<VS,string> = {
    idle:      "اضغط وتحدث",
    listening: "🎤 يستمع إليك…",
    thinking:  "✨ يفكر راوي المكان…",
    speaking:  "🔊 يتحدث الآن…",
  };
  const micBg:Record<VS,string> = {
    idle:      C.primary,
    listening: "oklch(0.55 0.17 28)",
    thinking:  C.accent,
    speaking:  "oklch(0.5 0.13 170)",
  };
  const barColor:Record<VS,string> = {
    idle:     `${C.primary}cc`,
    listening: "oklch(0.55 0.17 28)",
    thinking:  C.accent,
    speaking:  "oklch(0.5 0.13 170)",
  };

  return (
    <div className="pb-6 flex flex-col">
      <div className="px-5 pt-5 flex items-center justify-between">
        <IconBtn icon={Moon} onClick={toggleTheme} C={C} />
        <div className="text-center">
          <p className="text-base font-bold" style={{color:C.ink}}>راوي المكان</p>
          <p className="text-xs mt-0.5" style={{color:C.muted}}>{subtitle[vs]}</p>
        </div>
        <IconBtn icon={ArrowRight} C={C} />
      </div>

      {/* Accessible Voice Mode Banner for Visually Impaired */}
      <div className="mx-5 mt-4 p-3 rounded-2xl border flex items-center justify-between"
           style={{background:`${C.primary}12`, borderColor:C.primary}}>
        <button onClick={()=>{
          speak("مرحباً بك في سَمَر. وضع الراوي الصوتي للمكفوفين مفعّل. اضغط على الميكروفون بالأسفل في أي وقت للتحدث والاستماع للوصف التاريخي الموثق فوراً.");
        }} className="flex items-center gap-2 text-xs font-bold" style={{color:C.primary}}>
          <Eye className="h-4 w-4 shrink-0" />
          <span>نمط سَمَر الشامل للمكفوفين 🔊</span>
        </button>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{background:C.primary}}>
          قراءة تلقائية
        </span>
      </div>

      <div className="mx-5 mt-5 rounded-3xl border flex items-center justify-center gap-[3px] px-5 transition-colors"
           style={{background:C.card, borderColor:C.border, height:88}}>
        {bars.map((b,i)=>(
          <span key={i} className="rounded-full"
            style={{
              width: 3.5,
              height: `${(vs==="idle" ? (0.25+Math.abs(Math.sin(i*0.45))*0.55) : b)*100}%`,
              background: barColor[vs],
              transition: vs==="idle" ? "none" : "height 80ms ease-out",
            }} />
        ))}
      </div>

      {!textMode ? (
        <>
          <div className="relative flex justify-center mt-8 mb-3">
            {(vs==="listening"||vs==="speaking") && (
              <>
                <span className="absolute rounded-full"
                  style={{width:100,height:100,background:`${micBg[vs]}28`,animation:"ring 2s ease-out infinite"}} />
                <span className="absolute rounded-full"
                  style={{width:100,height:100,background:`${micBg[vs]}14`,animation:"ring 2s ease-out .75s infinite"}} />
              </>
            )}
            <button onClick={handleMic}
              className="relative rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
              style={{
                width:84, height:84,
                background: micBg[vs],
                boxShadow: `0 8px 28px -6px ${micBg[vs]}99`,
              }}>
              {vs==="listening" ? <Square className="h-8 w-8 text-white" />
               : vs==="thinking" ? <div className="h-6 w-6 rounded-full border-4 border-white/30 border-t-white animate-spin" />
               : vs==="speaking" ? <Volume2 className="h-8 w-8 text-white" />
               : <Mic className="h-8 w-8 text-white" />}
            </button>
          </div>

          <p className="text-sm text-center mb-6" style={{color:C.muted}}>
            {vs==="idle" ? "اضغط على الميكروفون لبدء المحادثة" : subtitle[vs]}
          </p>

          <div className="px-5 space-y-3">
            <AnimatePresence>
              {transcript && (
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  className="rounded-2xl border p-4" style={{background:C.sec,borderColor:C.border}}>
                  <p className="text-xs font-bold mb-1" style={{color:C.muted}}>🎤 سؤالك</p>
                  <p className="text-sm text-right" style={{color:C.ink}}>{transcript}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {answer && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                  className="rounded-2xl border p-4 transition-colors" style={{background:C.card,borderColor:C.border}}>
                  <div className="flex items-center gap-2 text-xs font-bold pb-2 mb-2 border-b" style={{color:C.primary,borderColor:C.border}}>
                    <ShieldCheck className="h-4 w-4" />
                    <span>موثّق · {source}</span>
                    {!isLive && <span className="mr-auto text-[10px] px-2 py-0.5 rounded-full" style={{background:C.sec,color:C.accent}}>محلي</span>}
                    <button onClick={()=>speak(answer)} className="mr-auto">
                      <Volume2 className="h-4 w-4" style={{color:C.accent}} />
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-right" style={{color:C.ink}}>{answer}</p>
                  <button onClick={()=>{setTrans("");setAnswer("");}}
                    className="mt-3 w-full rounded-xl py-2.5 text-sm font-bold text-white"
                    style={{background:C.primary}}>
                    سؤال جديد
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {vs==="idle" && !answer && (
            <div className="px-5 mt-2 mb-4">
              <p className="text-sm font-bold mb-3 flex items-center gap-1.5 justify-end" style={{color:C.ink}}>
                جرّب أن تسأل <Sparkles className="h-4 w-4" style={{color:C.accent}} />
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TIPS.map(s=>(
                  <button key={s} onClick={()=>{setTrans(s); askGemini(s);}}
                    className="rounded-full border px-4 py-2.5 text-xs text-right transition-colors active:scale-[.97]"
                    style={{background:C.card,borderColor:C.border,color:C.muted}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="px-5 mt-auto">
            <button onClick={()=>setTextMode(true)}
              className="w-full rounded-2xl border py-4 text-sm font-bold text-center transition-colors"
              style={{background:C.card, borderColor:C.border, color:C.ink}}>
              التبديل إلى المحادثة الكتابية
            </button>
          </div>
        </>
      ) : (
        <div className="px-5 mt-5 space-y-4">
          <div className="relative">
            <textarea value={textQ} onChange={e=>setTextQ(e.target.value)}
              placeholder="اكتب سؤالك هنا…"
              className="w-full resize-none rounded-2xl border px-4 py-3 text-sm text-right outline-none pe-14 transition-colors"
              style={{borderColor:C.border,background:C.card,color:C.ink,minHeight:100}} />
            <button
              onClick={()=>{if(textQ.trim()){setTrans(textQ);askGemini(textQ);}}}
              disabled={!textQ.trim()||vs==="thinking"}
              className="absolute bottom-3 start-3 h-9 w-9 flex items-center justify-center rounded-xl text-white disabled:opacity-40"
              style={{background:C.primary}}>
              {vs==="thinking"
                ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : <Send className="h-4 w-4 rotate-180 text-white" />}
            </button>
          </div>

          <AnimatePresence>
            {answer && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                className="rounded-2xl border p-4 transition-colors" style={{background:C.card,borderColor:C.border}}>
                <div className="flex items-center gap-2 text-xs font-bold pb-2 mb-2 border-b" style={{color:C.primary,borderColor:C.border}}>
                  <ShieldCheck className="h-4 w-4" /><span>موثّق · {source}</span>
                  <button onClick={()=>speak(answer)} className="mr-auto">
                    <Volume2 className="h-4 w-4" style={{color:C.accent}} />
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-right" style={{color:C.ink}}>{answer}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={()=>{setTextMode(false);setAnswer("");setTrans("");setTextQ("");}}
            className="w-full rounded-2xl border py-3.5 text-sm font-bold text-center transition-colors"
            style={{background:C.card,borderColor:C.border,color:C.ink}}>
            ← العودة للوضع الصوتي
          </button>
        </div>
      )}

      <style>{`@keyframes ring{0%{opacity:.5;transform:scale(.85)}100%{opacity:0;transform:scale(1.7)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FAVORITES PAGE
═══════════════════════════════════════════════════════════════════════ */
function FavoritesPage({onBack,goExplore,C}:{onBack:()=>void;goExplore:()=>void;C:typeof LIGHT_C}) {
  return (
    <div className="pb-6">
      <PageHdr title="المفضلة" sub="0 موقع محفوظ" left={<div className="w-9"/>} right={<IconBtn icon={ArrowRight} onClick={onBack} C={C} />} C={C} />
      <div className="flex flex-col items-center justify-center mt-24 gap-6 px-10">
        <p className="text-sm text-center" style={{color:C.muted}}>لا توجد مواقع محفوظة بعد.</p>
        <button onClick={goExplore} className="rounded-full px-8 py-3 font-bold text-sm text-white" style={{background:C.primary}}>
          اكتشف المواقع
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PLACE DETAIL
═══════════════════════════════════════════════════════════════════════ */
function VoiceMicBtn({onText,C}:{onText:(t:string)=>void;C:typeof LIGHT_C}) {
  const {listening,start,stop}=useSpeechInput(onText);
  return (
    <button type="button" onClick={listening?stop:start}
      className="absolute top-3 end-3 h-9 w-9 flex items-center justify-center rounded-xl border transition-all"
      style={{background:listening?"oklch(0.55 0.17 28 / 0.1)":C.sec,borderColor:listening?"oklch(0.55 0.17 28)":C.border}}>
      <Mic className="h-4 w-4" style={{color:listening?"oklch(0.55 0.17 28)":C.primary}} />
    </button>
  );
}

function PlaceDetail({place,onBack,C}:{place:Place;onBack:()=>void;C:typeof LIGHT_C}) {
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(false);
  const [resp,setResp]=useState<{answer:string;source:string;isLive:boolean}|null>(null);
  const [challenge,setChallenge]=useState<{question:string;options:string[];correct:number}|null>(null);
  const [step,setStep]=useState<"idle"|"answered"|"challenged"|"success">("idle");
  const [points,setPoints]=useState(0);
  const [showCard,setShowCard]=useState(false);

  const ask=async()=>{
    if(!q.trim())return; setLoading(true);
    try{
      const r=await fetch("/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q,site:place.name})});
      const d=await r.json(); setResp(d); setStep("answered"); speak(d.answer);
      setTimeout(loadChallenge,2000);
    }finally{setLoading(false);}
  };
  const loadChallenge=async()=>{
    const r=await fetch("/api/challenge",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({site:place.name})});
    setChallenge(await r.json()); setStep("challenged");
  };
  const ans=(idx:number)=>{
    if(idx===challenge?.correct){const np=points+10;setPoints(np);setStep("success");if(np>=10)setShowCard(true);}
    else alert("حاول مرة أخرى!");
  };

  return (
    <div className="pb-6">
      <div className="relative h-72 lg:h-96">
        <img src={place.img} alt={place.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{background:"linear-gradient(to top,oklch(0.15 0.02 50 / 0.85),transparent 55%)"}} />
        <button onClick={onBack} className="absolute top-4 end-4 h-10 w-10 rounded-full flex items-center justify-center text-white"
          style={{background:"oklch(0.18 0.03 52 / 0.4)",backdropFilter:"blur(8px)"}}>
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </button>
        <div className="absolute bottom-4 start-4">
          <h1 className="text-2xl font-bold text-white">{place.name}</h1>
          <div className="flex items-center gap-1 text-white/80 text-xs mt-1"><MapPin className="h-3 w-3" />{place.region}</div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5 max-w-2xl mx-auto">
        {/* Inclusivity & Vision AI Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={()=>speak(`${place.name}. ${place.desc}`)}
            className="flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition-all active:scale-95"
            style={{background:C.card, borderColor:C.border, color:C.ink}}>
            <Eye className="h-4 w-4" style={{color:C.accent}} />
            وصف صوتي شامل (للمكفوفين)
          </button>
          
          <label className="flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold cursor-pointer transition-all active:scale-95 text-white"
                 style={{background:C.primary}}>
            <Camera className="h-4 w-4" />
            صور المعلم (+100 نقطة)
            <input type="file" accept="image/*" capture="environment" className="hidden"
                   onChange={async (e)=>{
                     const file = e.target.files?.[0];
                     if(!file) return;
                     const reader = new FileReader();
                     reader.onload = async () => {
                       const res = await fetch("/api/vision", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ imageBase64: reader.result, site: place.name })
                       });
                       const data = await res.json();
                       alert(`🎉 ${data.name}\n\n${data.description}\n\nحصلت على +${data.points} نقطة وشارة [${data.badge}]!`);
                       setPoints(p => p + data.points);
                       setShowCard(true);
                     };
                     reader.readAsDataURL(file);
                   }} />
          </label>
        </div>

        <p className="text-sm leading-relaxed text-right" style={{color:C.muted}}>{place.desc}</p>
        <div className="relative">
          <textarea value={q} onChange={e=>setQ(e.target.value)} placeholder={`اسأل عن تاريخ ${place.name}…`}
            className="w-full resize-none rounded-2xl border px-4 py-3 text-sm text-right outline-none pe-14 transition-colors"
            style={{borderColor:C.border,background:C.card,color:C.ink,minHeight:90}} />
          <button onClick={ask} disabled={loading||!q.trim()}
            className="absolute bottom-3 start-3 h-9 w-9 flex items-center justify-center rounded-xl text-white disabled:opacity-40"
            style={{background:C.primary}}>
            {loading?<div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />:<Send className="h-4 w-4 rotate-180 text-white" />}
          </button>
          <VoiceMicBtn onText={t=>setQ(t)} C={C} />
        </div>

        <AnimatePresence>
          {resp&&(
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              className="rounded-2xl border p-4 transition-colors" style={{background:C.card,borderColor:C.border}}>
              <div className="flex items-center gap-2 text-xs font-bold pb-2 mb-2 border-b" style={{color:C.primary,borderColor:C.border}}>
                <ShieldCheck className="h-4 w-4" /><span>موثّق · {resp.source}</span>
                {!resp.isLive&&<span className="mr-auto text-[10px] px-2 py-0.5 rounded-full" style={{background:C.sec,color:C.accent}}>محلي</span>}
                <button onClick={()=>speak(resp.answer)} className="mr-auto"><Volume2 className="h-4 w-4" style={{color:C.accent}} /></button>
              </div>
              <p className="text-sm leading-relaxed text-right" style={{color:C.ink}}>{resp.answer}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step==="challenged"&&challenge&&(
            <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}}
              className="rounded-3xl p-5 relative overflow-hidden text-white" style={{background:C.primary}}>
              <div className="absolute -top-4 -start-4 opacity-10"><Trophy className="h-28 w-28" /></div>
              <span className="text-xs font-bold px-3 py-1 rounded-full relative" style={{background:"oklch(1 0 0 / 0.15)"}}>تحدي سريع +10 نقاط</span>
              <h3 className="text-base font-bold mt-3 mb-4 relative">{challenge.question}</h3>
              <div className="space-y-2 relative">
                {challenge.options.map((opt,i)=>(
                  <button key={i} onClick={()=>ans(i)}
                    className="w-full text-right px-4 py-3 rounded-xl text-sm font-medium"
                    style={{background:"oklch(1 0 0 / 0.12)",border:"1px solid oklch(1 0 0 / 0.2)"}}>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step==="success"&&(
            <motion.div initial={{scale:0.6,opacity:0}} animate={{scale:1,opacity:1}} className="text-center py-8 space-y-3">
              <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto" style={{background:C.sec}}>
                <Trophy className="h-10 w-10" style={{color:C.accent}} />
              </div>
              <h2 className="text-lg font-bold" style={{color:C.ink}}>رائع! +{points} نقطة</h2>
              <button onClick={()=>{setStep("idle");setResp(null);setQ("");setChallenge(null);}}
                className="px-8 py-3 rounded-full font-bold text-sm text-white" style={{background:C.primary}}>
                سؤال جديد
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showCard&&<AchievementCard points={points} siteName={place.name} rank="حارس التراث" onClose={()=>setShowCard(false)} C={C} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ACHIEVEMENT CARD
═══════════════════════════════════════════════════════════════════════ */
function AchievementCard({points,siteName,rank,onClose,C}:{points:number;siteName:string;rank:string;onClose:()=>void;C:typeof LIGHT_C}) {
  const ref=useRef<HTMLDivElement>(null);
  const dl=async()=>{
    if(!ref.current)return;
    const url=await toPng(ref.current,{cacheBust:true});
    Object.assign(document.createElement("a"),{download:`samar-${siteName}.png`,href:url}).click();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"oklch(0.15 0.02 50 / 0.85)",backdropFilter:"blur(8px)"}}>
      <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="w-full max-w-sm">
        <div ref={ref} dir="rtl" className="rounded-[2.5rem] p-8 border-8" style={{background:C.card,borderColor:C.border}}>
          <div className="flex justify-between mb-8"><Award style={{color:C.primary}} size={32} /><div><p className="font-black text-xl" style={{color:C.ink}}>سَمَر</p><p className="text-[10px] tracking-widest" style={{color:C.accent}}>SAMAR GUIDE</p></div></div>
          <div className="text-center my-6 space-y-2"><p className="text-2xl font-black" style={{color:C.ink}}>مستكشف سَمَر</p><p className="text-sm" style={{color:C.muted}}>أتمّ رحلة المعرفة في <span style={{color:C.primary}}>{siteName}</span></p></div>
          <div className="grid grid-cols-2 gap-4 rounded-2xl p-4 mb-6" style={{background:C.sec}}>
            <div className="text-center border-l" style={{borderColor:C.border}}><p className="text-xs mb-1" style={{color:C.muted}}>النقاط</p><p className="text-2xl font-black" style={{color:C.primary}}>+{points}</p></div>
            <div className="text-center"><p className="text-xs mb-1" style={{color:C.muted}}>اللقب</p><p className="text-sm font-bold" style={{color:C.ink}}>{rank}</p></div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-dashed" style={{borderColor:C.border}}><p className="text-[9px] font-mono" style={{color:C.muted}}>SAMAR AI 2026</p><QrCode size={36} style={{color:C.ink}} /></div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <button onClick={async () => {
            const res = await fetch("/api/memories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ site: siteName, points })
            });
            const d = await res.json();
            alert(`🎬 مولد فيديوهات الذكريات (TikTok / Instagram Reels):\n\n📌 العنوان: ${d.title}\n\n🎙️ السيناريو:\n"${d.script}"\n\n🏷️ الهاشتاقات: ${d.hashtags}\n\n🖼️ وصف المشهد المولد: ${d.videoPrompt}`);
          }} className="w-full rounded-2xl py-3 font-bold text-xs text-white flex items-center justify-center gap-2 shadow-md"
             style={{background:`linear-gradient(135deg, ${C.primary}, ${C.accent})`}}>
            <Video size={16} /> توليد فيديو ذكريات الرحلة (TikTok / Reels)
          </button>
          
          <div className="flex gap-2">
            <button onClick={dl} className="flex-1 rounded-2xl py-3 font-bold text-xs text-white flex items-center justify-center gap-2" style={{background:C.primary}}><Download size={16} /> بطاقة الإنجاز</button>
            <button onClick={()=>(navigator as any).share?.({title:"إنجازي في سمر"})} className="h-11 w-11 rounded-2xl flex items-center justify-center border" style={{background:C.card,borderColor:C.border}}><Share2 size={16} style={{color:C.ink}} /></button>
            <button onClick={onClose} className="h-11 w-11 rounded-2xl flex items-center justify-center font-bold" style={{background:C.sec,color:C.ink}}>✕</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════════════════════════════════════ */
const SLIDES=[
  {title:"اسمع التاريخ…",sub:"كل مكان لديه قصة.",img:"/images/alula.jpg",ov:null},
  {title:"تحدث مع راوي المكان.",sub:"اضغط وتحدث.",img:"/images/hero-valley.jpg",ov:"mic"},
  {title:"عش التجربة.",sub:"",img:"/images/masmak.jpg",ov:"bullets"},
];
const BULLETS=[{icon:Search,label:"اسأل."},{icon:Compass,label:"اكتشف."},{icon:Trophy,label:"اجمع الإنجازات."}];

function Onboarding({onDone,C}:{onDone:()=>void;C:typeof LIGHT_C}) {
  const [step,setStep]=useState(0);
  const s=SLIDES[step]!; const last=step===SLIDES.length-1;
  return (
    <div className="min-h-screen flex justify-center items-center transition-colors" style={{background:C.bg}}>
      <div className="flex min-h-screen lg:min-h-[840px] lg:h-[840px] w-full max-w-lg flex-col justify-between overflow-hidden lg:rounded-[2.5rem] lg:border shadow-2xl relative"
           style={{background:C.bg, borderColor:C.border}}>
        <div className="flex justify-between items-center px-5 pt-6 shrink-0 z-10">
          <img src="/logo.png" alt="شعار سمر" className="h-10 w-auto object-contain" />
          <button onClick={onDone} className="text-xs font-bold px-3 py-1.5 rounded-full border" style={{color:C.muted, borderColor:C.border, background:C.card}}>تخطي</button>
        </div>

        <div className="px-8 pt-2 text-center shrink-0 z-10">
          <AnimatePresence mode="wait">
            <motion.h1 key={step} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="font-black leading-snug" style={{fontSize:"clamp(22px,5vw,32px)",color:C.ink}}>
              {s.title}
            </motion.h1>
          </AnimatePresence>
          {s.sub&&<p className="mt-1 text-sm font-medium" style={{color:C.primary}}>{s.sub}</p>}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="relative flex-1 my-2 mx-4 h-[320px] min-h-[240px] rounded-3xl overflow-hidden border shrink-0"
                      style={{borderColor:C.border}}>
            <img src={s.img} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0" style={{background:"linear-gradient(to top,oklch(0.15 0.02 50 / 0.5),transparent 60%)"}} />
            {s.ov==="mic"&&(
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full flex items-center justify-center border-2 shadow-lg" style={{background:`${C.card}ee`,borderColor:C.accent}}>
                  <Mic className="h-8 w-8" style={{color:C.primary}} />
                </div>
              </div>
            )}
            {s.ov==="bullets"&&(
              <ul className="absolute inset-x-0 top-6 flex flex-col items-center gap-3">
                {BULLETS.map(({icon:Icon,label})=>(
                  <li key={label} className="flex items-center gap-3 rounded-full px-5 py-2 text-sm font-semibold backdrop-blur-md shadow-md"
                      style={{background:`${C.card}ee`,color:C.ink, borderColor:C.border}}>
                    <Icon className="h-4 w-4 shrink-0" style={{color:C.primary}} />{label}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="shrink-0 px-8 pb-8 pt-2 space-y-4 z-10 transition-colors" style={{background:C.bg}}>
          <div className="flex justify-center gap-1.5">
            {SLIDES.map((_,i)=>(
              <span key={i} className="h-1.5 rounded-full transition-all duration-300"
                style={{width:i===step?24:6,background:i===step?C.primary:C.border}} />
            ))}
          </div>
          <button onClick={()=>last?onDone():setStep(s=>s+1)}
            className="w-full rounded-full py-3.5 text-sm font-bold text-white active:scale-[0.98] transition-transform shadow-md"
            style={{background:C.primary}}>
            {last?"ابدأ الرحلة":"التالي"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [onboarded,setOnboarded] = useState(false);
  const [isDark,setIsDark]       = useState(false);
  const [tab,setTab]             = useState<Tab>("home");
  const [place,setPlace]         = useState<Place|null>(null);
  const [subPage,setSubPage]     = useState<"favorites"|"settings"|null>(null);

  const C = isDark ? DARK_C : LIGHT_C;
  const toggleTheme = () => setIsDark(d => !d);

  if(!onboarded) return <Onboarding onDone={()=>setOnboarded(true)} C={C} />;

  const content = (
    <AnimatePresence mode="wait">
      {subPage==="settings" && (
        <motion.div key="settings" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0}}>
          <SettingsPage onBack={()=>setSubPage(null)} isDark={isDark} toggleDark={toggleTheme} C={C} />
        </motion.div>
      )}

      {subPage==="favorites" && (
        <motion.div key="fav" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0}}>
          <FavoritesPage onBack={()=>setSubPage(null)} goExplore={()=>{setSubPage(null);setTab("explore");}} C={C} />
        </motion.div>
      )}

      {!subPage && place && (
        <motion.div key="detail" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <PlaceDetail place={place} onBack={()=>setPlace(null)} C={C} />
        </motion.div>
      )}

      {!subPage && !place && (
        <motion.div key={tab} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          {tab==="home"         && <HomeTab onPlace={setPlace} goExplore={()=>setTab("explore")} toggleTheme={toggleTheme} C={C} />}
          {tab==="explore"      && <ExploreTab onPlace={setPlace} C={C} />}
          {tab==="voice"        && <VoiceTab toggleTheme={toggleTheme} C={C} />}
          {tab==="achievements" && <AchievementsTab toggleTheme={toggleTheme} C={C} />}
          {tab==="profile"      && (
            <ProfileTab
              goAch={()=>setTab("achievements")}
              goFav={()=>setSubPage("favorites")}
              goSettings={()=>setSubPage("settings")}
              toggleTheme={toggleTheme}
              C={C}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const showBottomNav = !place && !subPage;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{background:C.bg}}>
      {/* Desktop layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <SideNav active={tab} set={(t)=>{setPlace(null);setSubPage(null);setTab(t);}} C={C} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-6">
            {content}
          </div>
        </main>
      </div>

      {/* Mobile / Tablet layout */}
      <div className="lg:hidden flex justify-center min-h-screen">
        <div className="flex flex-col w-full max-w-lg min-h-screen transition-colors duration-300" style={{background:C.bg}}>
          <main className="flex-1 overflow-y-auto">{content}</main>
          {showBottomNav && <BottomNav active={tab} set={(t)=>{setPlace(null);setSubPage(null);setTab(t);}} C={C} />}
        </div>
      </div>
    </div>
  );
}

