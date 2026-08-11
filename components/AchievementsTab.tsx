"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

export default function AchievementsTab() {
  const badges = [
    { name: 'الدرعية', icon: '🏰' },
    { name: 'العلا', icon: '⛰️' },
    { name: 'قصر المصمك', icon: '🏛️' },
    { name: 'جدة التاريخية', icon: '🪟' },
    { name: 'الأحساء', icon: '🌴' },
    { name: 'الشرقية', icon: '🌊' },
  ];

  return (
    <div className="pt-12 px-6 pb-24 text-center">
      <h2 className="text-3xl font-black text-samar-primary mb-2">إنجازاتي</h2>
      
      <div className="my-8">
        <span className="text-6xl font-black text-samar-primary">12</span>
        <p className="text-samar-secondary font-bold mt-2">الشارات المحققة</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        {badges.map((badge, i) => (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-24 bg-samar-secondary/10 rounded-t-full rounded-b-3xl flex items-center justify-center border-2 border-samar-secondary/20 mb-2">
              <span className="text-3xl">{badge.icon}</span>
            </div>
            <span className="text-[10px] font-bold text-samar-primary">{badge.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
