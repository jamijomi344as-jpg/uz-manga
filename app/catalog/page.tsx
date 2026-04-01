'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Catalog() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Bazadan barcha mangalarni tortib olish
  useEffect(() => {
    async function fetchMangas() {
      const { data, error } = await supabase
        .from('mangas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setMangas(data);
      setLoading(false);
    }
    fetchMangas();
  }, []);

  // Qidiruv tizimi (Live Search) - harf yozilganda avtomat saralaydi
  const filteredMangas = mangas.filter(manga => 
    manga.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (manga.genres && manga.genres.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans">
      
      {/* Tepa menyu (Navbar) */}
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800 h-16 flex items-center px-4 md:px-8 shadow-md">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">На главную</span>
        </Link>
        <div className="mx-auto font-bold text-lg tracking-wider text-white flex items-center gap-2">
          Каталог <span className="text-purple-600">Манг</span>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        {/* Qidiruv qutisi (Search Bar) */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full bg-[#1A1A1D] border border-gray-700 text-white text-base rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] placeholder-gray-500"
            placeholder="Найти мангу, манхву или дунхуа..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Natijalar soni */}
        <div className="mb-6 flex justify-between items-end">
          <h1 className="text-2xl font-bold text-white">Все тайтлы</h1>
          <span className="text-gray-500 text-sm">Найдено: {filteredMangas.length}</span>
        </div>

        {/* Mangalar ro'yxati (Grid) */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {filteredMangas.length > 0 ? (
              filteredMangas.map((manga: any) => (
                <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col cursor-pointer">
                  {/* Rasm qismi */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md mb-3 bg-[#1A1A1D]">
                    <img 
                      src={manga.image_url || 'https://via.placeholder.com/300x400?text=No+Image'} 
                      alt={manga.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                    />
                    {manga.status && (
                      <div className="absolute top-0 left-0 bg-purple-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase tracking-wider backdrop-blur-sm">
                        {manga.status}
                      </div>
                    )}
                  </div>
                  
                  {/* Ma'lumot qismi */}
                  <div className="flex flex-col">
                    <h2 className="text-[15px] font-semibold text-gray-200 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors" title={manga.title}>
                      {manga.title}
                    </h2>
                    <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">
                      {manga.type || 'Манхва'}, {manga.genres || 'Экшен'}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-lg">По вашему запросу "{searchQuery}" ничего не найдено.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-purple-500 hover:text-purple-400 font-medium"
                >
                  Сбросить поиск
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}