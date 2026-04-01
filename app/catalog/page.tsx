'use client';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, X, SearchX, Layers, ListOrdered } from 'lucide-react';
import UserProfile from '@/components/UserProfile';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function CatalogContent() {
  const searchParams = useSearchParams();
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'Hammasi');
  const [selectedType, setSelectedType] = useState('Hammasi');
  const [sortBy, setSortBy] = useState('new'); 

  const GENRES = ["Hammasi", "Ekshen", "Fantastika", "Syonen", "Romantika", "Sarguzasht", "Isekai", "Kultivatsiya", "Reenkarnatsiya"];
  const TYPES = ["Hammasi", "Manxva", "Manxua", "Manga", "Donghua"];

  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      // chapters jadvali bilan bog'lab, boblar sonini ham olamiz
      let query = supabase.from('mangas').select(`*, chapters(id)`);

      if (searchQuery.trim()) query = query.ilike('title', `%${searchQuery}%`);
      if (selectedType !== 'Hammasi') query = query.eq('manga_type', selectedType);
      
      // Janr bo'yicha qidirish (Massiv uchun moslangan)
      if (selectedGenre !== 'Hammasi') {
        query = query.contains('genres', [selectedGenre]);
      }

      const { data, error } = await query;
      if (!error && data) {
        let processedData = data.map(m => ({ 
          ...m, 
          chapters_count: m.chapters?.length || 0 
        }));
        
        // Saralash
        if (sortBy === 'chapters') {
          processedData.sort((a, b) => b.chapters_count - a.chapters_count);
        } else {
          processedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        
        setMangas(processedData);
      }
      setLoading(false);
    }
    fetchFiltered();
  }, [searchQuery, selectedGenre, selectedType, sortBy]);

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans pb-10">
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-white hover:opacity-80 transition">U<span className="text-purple-600">M</span></Link>
          <UserProfile />
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Manga qidirish..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 bg-[#151518] border border-gray-800 rounded-2xl pl-12 pr-12 focus:border-purple-600 outline-none text-white shadow-lg transition-all" 
            />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={18} /></button>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" size={16} />
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-14 bg-[#151518] border border-gray-800 rounded-2xl pl-10 pr-4 outline-none appearance-none text-sm font-bold text-gray-300"
              >
                {TYPES.map(t => <option key={t} value={t} className="bg-[#151518]">{t === 'Hammasi' ? 'Barcha turlar' : t}</option>)}
              </select>
            </div>
            <div className="flex-1 relative">
              <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" size={16} />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-14 bg-[#151518] border border-gray-800 rounded-2xl pl-10 pr-4 outline-none appearance-none text-sm font-bold text-gray-300"
              >
                <option value="new" className="bg-[#151518]">Eng yangilar</option>
                <option value="chapters" className="bg-[#151518]">Boblar soni</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {GENRES.map(g => (
            <button 
              key={g} 
              onClick={() => setSelectedGenre(g)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${selectedGenre === g ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 translate-y-[-2px]' : 'bg-[#151518] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600'}`}
            >
              {g}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : mangas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {mangas.map((manga) => (
              <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-800 mb-3 bg-[#1A1A1D] group-hover:border-purple-500/50 transition-all shadow-lg">
                  <img src={manga.image_url} alt={manga.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-purple-400 border border-purple-500/20">
                    {manga.chapters_count} BOB
                  </div>
                </div>
                <h3 className="text-[14px] font-bold text-gray-200 group-hover:text-purple-500 transition-colors line-clamp-2 leading-tight px-1">{manga.title}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchX size={64} className="text-gray-800 mb-4" />
            <h2 className="text-xl font-bold text-white">Hech narsa topilmadi</h2>
            <p className="text-gray-500 mt-2 text-sm">Boshqa janr yoki nom bilan qidirib ko'ring.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedGenre('Hammasi'); setSelectedType('Hammasi');}} 
              className="mt-6 bg-purple-600/10 text-purple-500 px-6 py-2 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition-all"
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
    <Suspense fallback={<div className="min-h-screen bg-[#0E0E10] flex items-center justify-center text-purple-500 font-bold">Yuklanmoqda...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
