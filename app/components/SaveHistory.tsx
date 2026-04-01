'use client';

import { useEffect } from 'react';

export default function SaveHistory({ mangaId, mangaTitle, mangaImage, chapterId, chapterNumber }: any) {
  useEffect(() => {
    // Xotiradan eski o'qilganlarni oladi
    const history = JSON.parse(localStorage.getItem('manga_history') || '[]');
    
    // Hozir o'qilayotganini yangi ro'yxatga qo'shadi
    const newEntry = { mangaId, mangaTitle, mangaImage, chapterId, chapterNumber, timestamp: Date.now() };
    const filtered = history.filter((h: any) => h.mangaId !== mangaId);
    filtered.unshift(newEntry);
    
    // Xotira to'lib ketmasligi uchun faqat oxirgi 10 tasini saqlaydi
    localStorage.setItem('manga_history', JSON.stringify(filtered.slice(0, 10)));
  }, [mangaId, mangaTitle, mangaImage, chapterId, chapterNumber]);

  return null; // Ekranda hech narsa ko'rsatmaydi
}