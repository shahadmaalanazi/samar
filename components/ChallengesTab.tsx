"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

export default function ChallengesTab() {
  const challenges = [
    { title: 'اعثر على الباب القديم', loc: 'في الدرعية', done: true },
    { title: 'ما اسم هذا البرج؟', loc: 'في قصر المصمك', done: true },
    { title: 'اكتشف النقش المخفي', loc: 'في العلا', done: false },
    { title: 'أين يقع هذا السوق؟', loc: 'في جدة التاريخية', done: false },
  ];

  return (
    <div className="pt-12 px-6 pb-24">
      <h2 className="text-3xl font-black text-samar-primary mb-6 text-center">التحديات</h2>
      
      {/* Tabs */}
      <div className="flex bg-samar-secondary/20 p-1 rounded-full mb-8">
        <button className="flex-1 py-2 text-sm font-bold bg-samar-primary text-white rounded-full">الكل</button>
        <button className="flex-1 py-2 text-sm font-bold text-samar-secondary">قيد التقدم</button>
        <button className="flex-1 py-2 text-sm font-bold text-samar-secondary">مكتملة</button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {challenges.map((c, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className={`p-4 rounded-3xl flex items-center justify-between border ${
              c.done ? 'bg-samar-secondary/10 border-samar-secondary/20' : 'bg-white border-stone-200 shadow-sm'
            }`}
          >
            <div>
              <h4 className={`font-bold ${c.done ? 'text-samar-secondary' : 'text-samar-primary'}`}>{c.title}</h4>
              <p className="text-xs text-stone-500 mt-1">01 {c.loc}</p>
            </div>
            {c.done ? (
              <CheckCircle2 className="text-samar-secondary" size={24} />
            ) : (
              <Circle className="text-stone-300" size={24} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
