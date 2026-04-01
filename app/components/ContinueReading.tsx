'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ContinueReading() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Brauzer xotirasidan o'qilgan mangalarni qidirib topadi
    const saved = JSON.parse(localStorage.getItem('manga_history') || '[]');
    setHistory(saved);
  }, []);

  // Agar hali hech narsa o'qilmagan bo'lsa, bu qism umuman ko'rinmaydi
  if (history.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-[22px] font-bold text-white mb-4">Продолжить читать</h2>
      
      {/* Yonboshga suriladigan (Carousel) ro'yxat */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {history.map((item, idx) => (
          <Link 
            href={`/read/${item.chapterId}`} 
            key={idx} 
            className="min-w-[280px] max-w-[280px] bg-[#151518] hover:bg-[#1A1A1D] rounded-xl flex items-center gap-4 p-2.5 border border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer group shrink-0"
          >
            <img 
              src={item.mangaImage} 
              alt={item.mangaTitle} 
              className="w-16 h-20 object-cover rounded-md group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col justify-center overflow-hidden">
              <h3 className="text-[14px] font-semibold text-gray-200 truncate group-hover:text-purple-400 transition-colors">
                {item.mangaTitle}
              </h3>
              <p className="text-[13px] text-gray-500 mt-1">
                Глава {item.chapterNumber}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}