'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Clock, Star } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NewReleasesPage() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewMangas() {
      // Bazadan mangalarni yaratilgan vaqti (created_at) bo'yicha eng yangilarini tortib olamiz
      const { data, error } = await supabase
        .from('mangas')
        .select('*')
        .order('created_at', { ascending: false }) 
        .limit(24); // Eng oxirgi 24 ta manga chiqadi
      
      if (data) {
        setMangas(data);
      }
      setLoading(false);
    }
    fetchNewMangas();
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
          Свежие <span className="text-purple-600">Новинки</span>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        {/* Sarlavha qismi */}
        <div className="flex items-center gap-3 mb-10 bg-[#151518] p-6 rounded-2xl border border-gray-800/60 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-purple-900/20 to-transparent"></div>
          <div className="bg-purple-600/20 p-3 rounded-xl border border-purple-500/30">
            <Sparkles size={28} className="text-purple-500" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold text-white leading-tight">Горячие новинки</h1>
            <p className="text-gray-400 text-sm mt-1">Самые последние добавленные тайтлы на сайте</p>
          </div>
        </div>

        {/* Mangalar ro'yxati */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {mangas.length > 0 ? (
              mangas.map((manga: any) => (
                <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col cursor-pointer relative">
                  
                  {/* Yangi nishoni (Badge) */}
                  <div className="absolute -top-2 -right-2 z-10 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-[0_0_10px_rgba(147,51,234,0.5)] flex items-center gap-1">
                    <Clock size={12} /> New
                  </div>

                  {/* Rasm qismi */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md mb-3 bg-[#1A1A1D] border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                    <img 
                      src={manga.image_url || 'https://via.placeholder.com/300x400'} 
                      alt={manga.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                  
                  {/* Ma'lumot qismi */}
                  <div className="flex flex-col">
                    <h2 className="text-[15px] font-semibold text-gray-200 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors" title={manga.title}>
                      {manga.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                        {manga.type || 'Манхва'}
                      </span>
                      <span className="flex items-center gap-1 text-[12px] text-gray-500">
                        <Star size={10} className="fill-gray-500" /> 
                        {new Date(manga.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500">
                <Sparkles size={48} className="mb-4 opacity-20 mx-auto" />
                <p className="text-lg">Пока нет новых тайтлов.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}