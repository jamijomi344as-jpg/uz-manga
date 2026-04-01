'use client';

import Link from 'next/link';
import { PlayCircle, Star, BookOpen } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function HeroSlider({ mangas }: { mangas: any[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Bazadagi eng oxirgi qo'shilgan 5 ta mangani ajratib olamiz
  const topMangas = mangas?.slice(0, 5) || [];

  // Karusel o'z-o'zidan aylanishi uchun kichik effekt
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 5000); // Har 5 soniyada keyingisiga o'tadi
    return () => clearInterval(interval);
  }, []);

  if (topMangas.length === 0) return null;

  return (
    <div className="relative w-full mb-10 group">
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Scrollbarni yashirish
      >
        {topMangas.map((manga, index) => (
          <div 
            key={manga.id} 
            className="min-w-full lg:min-w-[85%] snap-center relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[21/9] md:aspect-[25/9] bg-[#1A1A1D] border border-gray-800 shrink-0 shadow-2xl"
          >
            {/* Orqa fon rasmi */}
            <img 
              src={manga.image_url || 'https://via.placeholder.com/1200x500'} 
              alt={manga.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            
            {/* Qoraytirilgan gradient (Yozuvlar aniq ko'rinishi uchun) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-[#0E0E10]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E10] via-transparent to-transparent"></div>
            
            {/* Ma'lumotlar */}
            <div className="absolute bottom-0 left-0 p-5 sm:p-8 md:p-12 w-full md:w-3/4 lg:w-2/3">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-600 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded">Новинка</span>
                <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2 py-0.5 rounded">
                  <Star size={14} className="fill-yellow-500" /> 9.8
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3 line-clamp-1 sm:line-clamp-2 leading-tight drop-shadow-lg">
                {manga.title}
              </h2>
              
              <p className="text-gray-300 line-clamp-2 mb-6 text-sm sm:text-base hidden sm:block">
                {manga.description || 'Приготовьтесь к невероятному путешествию в мир магии и боевых искусств! Начните читать прямо сейчас.'}
              </p>
              
              <div className="flex items-center gap-4">
                <Link 
                  href={`/manga/${manga.id}`} 
                  className="flex items-center gap-2 bg-white text-black font-bold py-2.5 px-6 rounded-full hover:bg-purple-500 hover:text-white transition-all transform hover:scale-105"
                >
                  <PlayCircle size={20} /> <span className="hidden sm:inline">Читать сейчас</span><span className="sm:hidden">Читать</span>
                </Link>
                <Link 
                  href={`/manga/${manga.id}`} 
                  className="flex items-center gap-2 bg-[#1A1A1D]/80 backdrop-blur-md text-white border border-gray-600 font-bold py-2.5 px-6 rounded-full hover:bg-gray-800 transition-all"
                >
                  <BookOpen size={20} /> <span className="hidden sm:inline">Подробнее</span><span className="sm:hidden">Инфо</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}