'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

export default function BookmarkButton({ manga }: { manga: any }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Brauzer xotirasidan saqlangan mangalarni tekshiramiz
    const bookmarks = JSON.parse(localStorage.getItem('manga_bookmarks') || '[]');
    const exists = bookmarks.some((b: any) => b.id === manga.id);
    setIsSaved(exists);
  }, [manga.id]);

  const toggleBookmark = () => {
    let bookmarks = JSON.parse(localStorage.getItem('manga_bookmarks') || '[]');
    
    if (isSaved) {
      // Agar saqlangan bo'lsa, ro'yxatdan olib tashlaymiz
      bookmarks = bookmarks.filter((b: any) => b.id !== manga.id);
      setIsSaved(false);
    } else {
      // Agar saqlanmagan bo'lsa, ro'yxatga qo'shamiz
      bookmarks.unshift({
        id: manga.id,
        title: manga.title,
        image_url: manga.image_url,
        type: manga.type,
        genres: manga.genres
      });
      setIsSaved(true);
    }
    
    localStorage.setItem('manga_bookmarks', JSON.stringify(bookmarks));
  };

  return (
    <button 
      onClick={toggleBookmark}
      className={`flex items-center justify-center p-3.5 rounded-xl border transition-all ${
        isSaved 
          ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' 
          : 'bg-[#151518] border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
      }`}
      title={isSaved ? "Удалить из закладок" : "Добавить в закладки"}
    >
      <Bookmark size={22} className={isSaved ? "fill-white" : ""} />
    </button>
  );
}