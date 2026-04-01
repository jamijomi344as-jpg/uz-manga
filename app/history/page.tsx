'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, History } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('manga_history') || '[]'));
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white p-8">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"><ArrowLeft size={18}/> Asosiyga qaytish</Link>
      <h1 className="text-3xl font-bold mb-8">O'qish Tarixi</h1>
      
      {history.length > 0 ? (
        <div className="space-y-4 max-w-3xl">
          {history.map((item, idx) => (
            <Link href={`/read/${item.chapterId}`} key={idx} className="flex items-center gap-4 bg-[#151518] p-4 rounded-xl border border-gray-800 hover:border-purple-500">
              <img src={item.mangaImage} className="w-16 h-20 object-cover rounded-lg" />
              <div>
                <h3 className="font-bold text-lg">{item.mangaTitle}</h3>
                <p className="text-gray-400 text-sm">{item.chapterNumber}-bob</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-gray-600"><History size={48} className="mb-4"/><p>Hech narsa o'qilmagan!</p></div>
      )}
    </div>
  );
}