"use client";
import React from 'react';
import { Home, Map, Heart, User, Mic } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: Props) {
  const tabs = [
    { id: 'profile', icon: User, label: 'ملفي' },
    { id: 'achievements', icon: Heart, label: 'إنجازاتي' },
    { id: 'storyteller', icon: Mic, label: '', isCenter: true },
    { id: 'explore', icon: Map, label: 'اكتشف' },
    { id: 'home', icon: Home, label: 'الرئيسية' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#FDFCF8] border-t border-samar-secondary/10 shadow-[0_-10px_40px_rgba(75,46,32,0.05)] pb-safe z-50 rounded-t-[2.5rem]">
      <div className="flex justify-around items-end h-24 px-6 max-w-md mx-auto pb-6 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-samar-primary text-samar-accent shadow-xl border-4 border-[#FDFCF8] transition-transform active:scale-95"
              >
                <Icon size={28} />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-16 transition-all duration-300 ${
                isActive ? 'text-samar-primary' : 'text-samar-secondary/60 hover:text-samar-secondary'
              }`}
            >
              <div className="relative flex flex-col items-center justify-center gap-1.5">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? 'currentColor' : 'none'} />
                <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-3 w-1.5 h-1.5 bg-samar-accent rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
