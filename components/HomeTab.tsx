"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, CheckCircle2 } from 'lucide-react';

export default function HomeTab() {
  const regions = [
    { name: 'الدرعية', sub: 'حي الطريف', img: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=500&auto=format&fit=crop' },
    { name: 'العلا', sub: 'مدائن صالح', img: 'https://images.unsplash.com/photo-1590487053528-912b7aee2f1c?q=80&w=500&auto=format&fit=crop' },
    { name: 'قصر المصمك', sub: 'الرياض', img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=500&auto=format&fit=crop' },
    { name: 'الأحساء', sub: 'واحة النخيل', img: 'https://images.unsplash.com/photo-1632766324888-de882b542475?q=80&w=500&auto=format&fit=crop' },
  ];

  return (
    <div className="pb-32 bg-samar-bg min-h-screen">
      {/* Header */}
      <div className="pt-16 px-6 mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-samar-primary mb-1 tracking-tight">السلام عليكم</h2>
          <p className="text-samar-secondary font-medium text-sm">إلى أين تريدين السفر اليوم؟</p>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-samar-secondary/10">
          <span className="text-2xl">👋</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-10">
        <div className="bg-white rounded-[2rem] h-14 flex items-center px-5 shadow-sm border border-samar-secondary/10 relative">
          <Search className="text-samar-secondary/50 absolute left-5" size={20} />
          <input 
            type="text" 
            placeholder="ابحث عن مكان..." 
            className="w-full bg-transparent outline-none text-samar-primary placeholder:text-samar-secondary/50 font-medium pl-10"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="px-6">
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-bold text-xl text-samar-primary">اكتشف المناطق</h3>
          <button className="text-sm text-samar-accent font-bold">عرض الكل</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {regions.map((region, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="relative h-48 rounded-[2rem] overflow-hidden shadow-md group cursor-pointer border border-samar-primary/10"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${region.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-samar-primary/90 via-samar-primary/20 to-transparent" />
              <div className="absolute bottom-4 right-4 left-4 text-white">
                <h4 className="font-bold text-lg leading-tight mb-1">{region.name}</h4>
                <div className="flex items-center gap-1 opacity-80">
                  <MapPin size={10} />
                  <p className="text-[10px] font-medium">{region.sub}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
