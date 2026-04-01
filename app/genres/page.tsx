'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft, Filter, SearchX } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function GenresPage() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('Все');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMangasAndGenres() {
      const { data, error } = await supabase
        .from('mangas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setMangas(data);
        
        // Bazadagi barcha mangalardan janrlarni ajratib olish va takroriylarini olib tashlash
        const genresSet = new Set<string>();
        data.forEach((manga) => {
          if (manga.genres) {
            // "Экшен, Драма" degan yozuvni verguldan bo'lib olamiz
            const splitGenres = manga.genres.split(',');
            splitGenres.forEach((g: string) => genresSet.add(g.trim()));
          }
        });
        
        // Alifbo tartibida to'g'irlaymiz
        setAllGenres(Array.from(genresSet).sort());
      }
      setLoading(false);
    }
    fetchMangasAndGenres();
  }, []);

  // Tanlangan janr bo'yicha mangalarni saralash (Filtr)
  const filteredMangas = selectedGenre === 'Все' 
    ? mangas 
    : mangas.filter(manga => manga.genres && manga.genres.includes(selectedGenre));

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans">
      
      {/* Tepa menyu (Navbar) */}
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800 h-16 flex items-center px-4 md:px-8 shadow-md">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">На главную</span>
        </Link>
        <div className="mx-auto font-bold text-lg tracking-wider text-white flex items-center gap-2">
          Поиск по <span className="text-purple-600">Жанрам</span>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        <div className="flex items-center gap-3 mb-6">
          <Filter size={24} className="text-purple-500" />
          <h1 className="text-[28px] font-bold text-white">Выберите жанр</h1>
        </div>

        {/* Janrlar tugmachalari ro'yxati */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 mb-10 bg-[#151518] p-5 rounded-2xl border border-gray-800/60 shadow-lg">
            <button
              onClick={() => setSelectedGenre('Все')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedGenre === 'Все' 
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' 
                  : 'bg-[#1A1A1D] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
              }`}
            >
              Все тайтлы
            </button>
            
            {allGenres.map((genre, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedGenre === genre 
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' 
                    : 'bg-[#1A1A1D] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        {/* Natijalar soni */}
        {!loading && (
          <div className="mb-6 flex justify-between items-end border-b border-gray-800 pb-4">
            <h2 className="text-xl font-bold text-white">
              {selectedGenre === 'Все' ? 'Все манги' : `Жанр: ${selectedGenre}`}
            </h2>
            <span className="text-purple-400 bg-purple-600/10 px-3 py-1 rounded-full text-sm font-semibold border border-purple-500/20">
              Найдено: {filteredMangas.length}
            </span>
          </div>
        )}

        {/* Saralangan mangalar ro'yxati */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {filteredMangas.length > 0 ? (
              filteredMangas.map((manga: any) => (
                <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col cursor-pointer">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md mb-3 bg-[#1A1A1D]">
                    <img src={manga.image_url || 'https://via.placeholder.com/300x400'} alt={manga.title} className="w-full h-full object-cover transform group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"/>
                    {manga.status && <div className="absolute top-0 left-0 bg-purple-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase tracking-wider backdrop-blur-sm">{manga.status}</div>}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[15px] font-semibold text-gray-200 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors" title={manga.title}>{manga.title}</h2>
                    <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">{manga.type || 'Манхва'}, {manga.genres}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center">
                <SearchX size={48} className="mb-4 opacity-20" />
                <p className="text-lg">В этом жанре пока нет тайтлов.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}