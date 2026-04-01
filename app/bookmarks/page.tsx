'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookmarkX, Trash2 } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    // Brauzer xotirasidan saqlangan mangalarni olamiz
    setBookmarks(JSON.parse(localStorage.getItem('manga_bookmarks') || '[]'));
  }, []);

  // Xatcho'plardan o'chirish funksiyasi
  const removeBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Manga sahifasiga kirib ketmasligi uchun
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('manga_bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        
        {/* Orqaga qaytish */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
          <ArrowLeft size={18}/> Asosiyga qaytish
        </Link>
        
        <h1 className="text-3xl font-black mb-10 text-white">Mening Xatcho'plarim</h1>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {bookmarks.map((manga) => (
              <Link href={`/manga/${manga.id}`} key={manga.id} className="group relative flex flex-col cursor-pointer">
                
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl mb-3 bg-[#1A1A1D] border border-gray-800 group-hover:border-purple-500/50 transition-all">
                  <img src={manga.image_url} alt={manga.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                  
                  {/* O'chirish tugmasi */}
                  <button
                    onClick={(e) => removeBookmark(manga.id, e)}
                    className="absolute top-2 right-2 bg-black/70 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-black transition z-10 backdrop-blur-md"
                    title="Xatcho'plardan olib tashlash"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <h2 className="text-[14px] font-bold text-gray-200 line-clamp-2 leading-tight group-hover:text-purple-400">
                  {manga.title}
                </h2>
                <p className="text-[12px] text-gray-500 mt-1">
                  {manga.type || 'Manhva'} • {manga.genres?.split(',')[0] || 'Sarguzasht'}
                </p>
                
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-[#151518] rounded-2xl border border-gray-800/60">
            <BookmarkX size={64} className="mb-4 opacity-20 text-gray-500"/>
            <p className="text-lg font-bold text-gray-300">Xatcho'plar ro'yxati bo'sh!</p>
            <p className="text-sm text-gray-500 mt-2">Siz hali birorta ham mangani saqlamadingiz.</p>
            <Link href="/catalog" className="mt-6 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              Katalogga o'tish
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
