"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, ShieldCheck } from 'lucide-react';

export default function StorytellerTab() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const simulateChat = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setResponse({
        answer: "الدرعية هي مهد انطلاق الدولة السعودية الأولى وتاريخها عريق جداً، وتضم حي الطريف المسجل في اليونسكو.",
        source: "هيئة تطوير بوابة الدرعية"
      });
    }, 2000);
  };

  return (
    <div className="h-full min-h-[80vh] flex flex-col items-center justify-center px-6 relative pb-24">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=500&auto=format&fit=crop)', backgroundSize: 'cover' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-samar-bg/80 to-samar-bg pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm text-center">
        <h2 className="text-3xl font-black text-samar-primary mb-2">تحدث مع<br/>راوي المكان.</h2>
        <p className="text-samar-secondary font-medium mb-12">اضغط وتحدث.</p>

        {/* Microphone Button */}
        <div className="relative flex justify-center mb-12">
          {isRecording && (
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-samar-accent rounded-full"
            />
          )}
          <button 
            onClick={simulateChat}
            className={`w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-colors relative z-10 ${
              isRecording ? 'bg-red-500 text-white' : 'bg-samar-primary text-white'
            }`}
          >
            {isRecording ? <Square size={32} /> : <Mic size={40} />}
          </button>
        </div>

        {/* Waveform Visualization (Fake) */}
        {isRecording && (
          <div className="flex items-center justify-center gap-1 h-12 mb-8">
            {[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [10, h * 10, 10] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                className="w-1.5 bg-samar-accent rounded-full"
              />
            ))}
          </div>
        )}

        {/* Response */}
        {response && !isRecording && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-lg text-right border border-samar-bg"
          >
            <div className="flex items-center gap-2 text-samar-secondary text-sm font-bold border-b border-stone-100 pb-2 mb-3">
              <ShieldCheck size={16} />
              <span>موثق من: {response.source}</span>
            </div>
            <p className="text-samar-text font-medium leading-relaxed">{response.answer}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
