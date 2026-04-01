'use client';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Search, X, SearchX, Filter, ListOrdered, Hash } from 'lucide-react';
import UserProfile from '@/components/UserProfile';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const GENRES = ["Hammasi", "Ekshen", "Fantastika", "Syonen", "Romantika", "Sarguzasht", "Isekai", "Kultivatsiya", "Reenkarnatsiya"];

function CatalogContent() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Qidiruv va Filtrlar uchun holatlar (States)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Hammasi');
  const [minChapters, setMinChapters] = useState('');
  const [maxChapters, setMaxChapters] = useState('');

  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      // chapters jadvali bilan bog'lab, boblar sonini hisoblash uchun select qilamiz
      let query = supabase.from('mangas').select(`*, chapters(id)`);

      if (searchQuery.trim()) query = query.ilike('title', `%${searchQuery}%`);
      if (selectedGenre !== 'Hammasi') query = query.contains('genres', [selectedGenre]);

      const { data, error } = await query;

      if (!error && data) {
        // Har bir manganing boblar sonini hisoblaymiz
        let processedData = data.map(m => ({ 
          ...m, 
          chapters_count: m.chapters?.length || 0 
        }));

        // Boblar soni bo'yicha filtrlash (Kamida va Ko'pi bilan)
        if (minChapters) {
          processedData = processedData.filter(m => m.chapters_count >= parseInt(minChapters));
        }
        if (maxChapters) {
          processedData = processedData.filter(m => m.chapters_count <= parseInt(maxChapters));
        }

        setMangas(processedData);
      }
      setLoading(false);
    }
    fetchFiltered();
  }, [searchQuery, selectedGenre, minChapters, maxChapters]);

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans pb-10">
      {/* Navbar - "Janrlar" olib tashlandi */}
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-white">U<span className="text-purple-600">M</span></Link>
          <div className="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-400">
            <Link href="/" className="hover:text-white">Asosiy</Link>
            <Link href="/catalog" className="text-purple-500 border-b-2 border-purple-500 pb-[21px] pt-[23px]">Katalog</Link>
            <Link href="/popular" className="hover:text-white">Ommabop</Link>
            <Link href="/new" className="hover:text-white">Yangi</Link>
          </div>
          <UserProfile />
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Katalog va Filtrlar</h1>

        {/* ASOSIY QIDIRUV VA BOB FILTRI KONTEYNERI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          
          {/* Nom bo'yicha qidirish */}
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Manga nomini yozing..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-[#151518] border border-gray-800 rounded-xl pl-12 pr-10 focus:border-purple-600 outline-none text-white transition-all" 
            />
          </div>

          {/* Boblar soni: Kamida */}
          <div className="lg:col-span-2 relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" size={16} />
            <input 
              type="number" 
              placeholder="Kamida bob" 
              value={minChapters} 
              onChange={(e) => setMinChapters(e.target.value)}
              className="w-full h-12 bg-[#151518] border border-gray-800 rounded-xl pl-10 pr-2 outline-none text-sm text-white focus:border-purple-600" 
            />
          </div>

          {/* Boblar soni: Ko'pi bilan */}
          <div className="lg:col-span-2 relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" size={16} />
            <input 
              type="number" 
              placeholder="Ko'pi bilan bob" 
              value={maxChapters} 
              onChange={(e) => setMaxChapters(e.target.value)}
              className="w-full h-12 bg-[#151518] border border-gray-800 rounded-xl pl-10 pr-2 outline-none text-sm text-white focus:border-purple-600" 
            />
          </div>

          {/* Janr tanlash */}
          <div className="lg:col-span-3">
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full h-12 bg-[#151518] border border-gray-800 rounded-xl px-4 outline-none text-sm font-bold text-gray-300 focus:border-purple-600"
            >
              {GENRES.map(g => <option key={g} value={g}>{g === 'Hammasi' ? 'Barcha Janrlar' : g}</option>)}
            </select>
          </div>
        </div>

        {/* Natijalar soni */}
        <div className="mb-6 text-sm text-gray-500 italic">
          Jami topildi: {mangas.length} ta asar
        </div>

        {/* MANGA GRIDI */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : mangas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {mangas.map((manga) => (
              <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-800 mb-3 bg-[#1A1A1D] group-hover:border-purple-500/50 transition-all">
                  <img src={manga.image_url} alt={manga.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-purple-400">
                    {manga.chapters_count} BOB
                  </div>
                </div>
                <h3 className="text-[14px] font-bold group-hover:text-purple-500 transition-colors line-clamp-2 px-1">{manga.title}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchX size={64} className="text-gray-800 mb-4" />
            <h2 className="text-xl font-bold text-white">Hech narsa topilmadi</h2>
            <p className="text-gray-500 mt-2">Boshqa filtrlar bilan qidirib ko'ring.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedGenre('Hammasi'); setMinChapters(''); setMaxChapters('');}} 
              className="mt-6 text-purple-500 hover:underline"
            >
              Filtrlarni tozalash
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="bg-[#0E0E10] min-h-screen"></div>}>
      <CatalogContent />
    </Suspense>
  );
}
