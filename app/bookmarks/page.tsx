'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookmarkX } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('manga_bookmarks') || '[]');
    setBookmarks(saved);
  }, []);

  const removeBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Manga sahifasiga o'tib ketmasligi uchun
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('manga_bookmarks', JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans">
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800 h-16 flex items-center px-4 md:px-8 shadow-md">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">На главную</span>
        </Link>
        <div className="mx-auto font-bold text-lg tracking-wider text-white">
          Мои <span className="text-purple-600">Закладки</span>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-[28px] font-bold text-white mb-8">Сохраненные тайтлы</h1>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <BookmarkX size={60} className="mb-4 opacity-20" />
            <p className="text-lg">У вас пока нет сохраненных манг.</p>
            <Link href="/catalog" className="mt-6 text-purple-500 hover:text-purple-400 font-medium border border-purple-500/30 px-6 py-2.5 rounded-full hover:bg-purple-500/10 transition-colors">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {bookmarks.map((manga: any) => (
              <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col cursor-pointer relative">
                
                {/* O'chirish tugmasi (X ustiga bosganda o'chadi) */}
                <button 
                  onClick={(e) => removeBookmark(manga.id, e)}
                  className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                  title="Удалить"
                >
                  <BookmarkX size={16} />
                </button>

                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md mb-3 bg-[#1A1A1D]">
                  <img src={manga.image_url || 'https://via.placeholder.com/300x400'} alt={manga.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-300"/>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[15px] font-semibold text-gray-200 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">{manga.title}</h2>
                  <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">{manga.type}, {manga.genres}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}