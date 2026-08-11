"use client";
import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Award, MapPin, Calendar, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  userName: string;
  siteName: string;
  points: number;
  rank: string; // مثال: "مستكشف تاريخي"
  onClose: () => void;
}

export default function AchievementCard({ userName, siteName, points, rank, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (cardRef.current === null) return;
    const dataUrl = await toPng(cardRef.current, { cacheBust: true });
    const link = document.createElement('a');
    link.download = `samar-achievement-${siteName}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        {/* البطاقة التي سيتم تحويلها لصورة */}
        <div 
          ref={cardRef}
          className="bg-[#FDFCF8] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-emerald-900/10 p-8 relative"
          dir="rtl"
        >
          {/* نمط خلفية تراثي (Sadu Pattern) */}
          <div className="absolute top-0 right-0 w-full h-2 bg-emerald-800 opacity-20 shadow-inner" />
          <div className="absolute bottom-0 right-0 w-full h-2 bg-emerald-800 opacity-20 shadow-inner" />

          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-emerald-900 font-bold text-xl leading-none">سَمَر</h4>
              <span className="text-[10px] text-emerald-700 tracking-widest uppercase font-bold">Samar Guide</span>
            </div>
            <Award className="text-emerald-700" size={32} />
          </div>

          <div className="text-center space-y-4 my-8">
            <div className="inline-block px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-2">
              بطاقة إنجاز رقمية
            </div>
            <h2 className="text-3xl font-black text-stone-800 tracking-tight">
              {userName || "مستكشف سَمَر"}
            </h2>
            <p className="text-stone-600 font-medium">
              أتمّ بنجاح رحلة المعرفة في <span className="text-emerald-700">{siteName}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-stone-100 p-6 rounded-3xl mb-8">
            <div className="text-center border-l border-stone-200">
              <span className="block text-xs text-stone-500 mb-1">النقاط المكتسبة</span>
              <span className="text-2xl font-black text-emerald-800">+{points}</span>
            </div>
            <div className="text-center">
              <span className="block text-xs text-stone-500 mb-1">اللقب المحرز</span>
              <span className="text-lg font-bold text-stone-800 leading-none block mt-1">{rank}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-dashed border-stone-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-stone-200">
                <QrCode size={40} className="text-stone-800" />
              </div>
              <div className="text-[10px] text-stone-400 leading-tight">
                امسح الرمز<br/>لتبدأ رحلتك الخاصة
              </div>
            </div>
            <div className="text-left text-[10px] text-stone-400 font-mono">
              VERIFIED BY<br/>SAMAR AI ENGINE 2026
            </div>
          </div>
        </div>

        {/* أزرار التحكم (خارج الصورة) */}
        <div className="flex gap-4 mt-6">
          <button 
            onClick={downloadImage}
            className="flex-1 bg-emerald-700 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <Download size={20} />
            تحميل الصورة
          </button>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'إنجازي في سمر', text: 'لقد حصلت على لقب مستكشف تاريخي في الدرعية!', url: window.location.href });
              }
            }}
            className="w-14 h-14 bg-white text-stone-800 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={onClose}
            className="w-14 h-14 bg-stone-200 text-stone-600 rounded-2xl flex items-center justify-center font-bold"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
}
