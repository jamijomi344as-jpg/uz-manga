'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Eye, Star } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PopularPage() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopularMangas() {
      // Bazadan mangalarni views (ko'rishlar) bo'yicha eng ko'pidan oziga qarab tortib olamiz
      const { data, error } = await supabase
        .from('mangas')
        .select('*')
        .order('views', { ascending: false, nullsFirst: false }) // Eng mashhurlari tepada
        .limit(20); // Faqat eng zo'r 20 tasini olamiz
      
      if (error) {
        // Agar "views" ustuni yo'q bo'lsa, xato berishi mumkin
        console.error("Xato:", error.message);
        setError("Ma'lumotlarni yuklashda xatolik. Bazada 'views' ustuni borligini tekshiring.");
      } else if (data) {
        setMangas(data);
      }
      setLoading(false);
    }
    fetchPopularMangas();
  }, []);

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans">
      
      {/* Tepa menyu (Navbar) */}
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800 h-16 flex items-center px-4 md:px-8 shadow-md">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">На главную</span>
        </Link>
        <div className="mx-auto font-bold text-lg tracking-wider text-white flex items-center gap-2">
          Топ <span className="text-purple-600">Популярных</span>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        {/* Sarlavha qismi */}
        <div className="flex items-center gap-3 mb-10 bg-[#151518] p-6 rounded-2xl border border-gray-800/60 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-purple-900/20 to-transparent"></div>
          <div className="bg-purple-600/20 p-3 rounded-xl border border-purple-500/30">
            <TrendingUp size={28} className="text-purple-500" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold text-white leading-tight">Популярное</h1>
            <p className="text-gray-400 text-sm mt-1">Самые читаемые тайтлы за всё время</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {/* Mangalar ro'yxati */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
            {mangas.length > 0 ? (
              mangas.map((manga: any, index: number) => (
                <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col cursor-pointer relative">
                  
                  {/* TOP Reyting nishoni (#1, #2, #3...) */}
                  <div className={`absolute -top-3 -left-3 z-10 w-10 h-10 flex items-center justify-center rounded-full text-white font-black text-lg shadow-lg border-2 border-[#0E0E10] ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    #{index + 1}
                  </div>

                  {/* Rasm qismi */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl mb-3 bg-[#1A1A1D] border border-gray-800 group-hover:border-purple-500/50 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <img 
                      src={manga.image_url || 'https://via.placeholder.com/300x400'} 
                      alt={manga.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                    />
                    
                    {/* Qora gradient pastki qismda (chiroyli ko'rinish uchun) */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent"></div>
                    
                    {/* Ko'rishlar soni */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-xs font-bold text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
                      <Eye size={12} className="text-purple-400" />
                      {manga.views ? (manga.views > 1000 ? (manga.views / 1000).toFixed(1) + 'K' : manga.views) : '0'}
                    </div>
                  </div>
                  
                  {/* Ma'lumot qismi */}
                  <div className="flex flex-col px-1">
                    <h2 className="text-[16px] font-bold text-gray-100 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors" title={manga.title}>
                      {manga.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[12px] font-medium text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                        {manga.type || 'Манхва'}
                      </span>
                      <span className="text-[12px] text-gray-500 line-clamp-1">
                        {manga.genres || 'Экшен'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500">
                <TrendingUp size={48} className="mb-4 opacity-20 mx-auto" />
                <p className="text-lg">Пока нет данных о просмотрах.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}