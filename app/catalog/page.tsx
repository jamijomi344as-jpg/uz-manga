'use client';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, X, SearchX, Hash, Layers } from 'lucide-react';
import UserProfile from '../components/UserProfile';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const GENRES = ["Hammasi", "Ekshen", "Fantastika", "Syonen", "Romantika", "Sarguzasht", "Isekai", "Kultivatsiya", "Reenkarnatsiya", "Dahshatli", "Drama"];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre') || 'Hammasi';

  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [minChapters, setMinChapters] = useState('');
  const [maxChapters, setMaxChapters] = useState('');

  useEffect(() => {
    const genreFromUrl = searchParams.get('genre');
    if (genreFromUrl) setSelectedGenre(genreFromUrl);
  }, [searchParams]);

  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      let query = supabase.from('mangas').select(`*, chapters(id)`);
      if (searchQuery.trim()) query = query.ilike('title', `%${searchQuery}%`);
      if (selectedGenre !== 'Hammasi') query = query.contains('genres', [selectedGenre]);

      const { data, error } = await query;
      if (!error && data) {
        let processedData = data.map(m => ({ ...m, chapters_count: m.chapters?.length || 0 }));
        if (minChapters) processedData = processedData.filter(m => m.chapters_count >= parseInt(minChapters));
        if (maxChapters) processedData = processedData.filter(m => m.chapters_count <= parseInt(maxChapters));
        setMangas(processedData);
      }
      setLoading(false);
    }
    fetchFiltered();
  }, [searchQuery, selectedGenre, minChapters, maxChapters]);

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans pb-20">
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-white tracking-tighter">U<span className="text-purple-600">M</span></Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-400">
            <Link href="/" className="hover:text-white transition">ASOSIY</Link>
            <Link href="/catalog" className="text-purple-500 border-b-2 border-purple-500 pb-5 pt-5">KATALOG</Link>
          </div>
          <UserProfile />
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        <div className="bg-[#151518] p-6 rounded-3xl border border-gray-800 mb-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input type="text" placeholder="Manga nomini yozing..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 bg-[#0E0E10] border border-gray-800 rounded-2xl pl-12 pr-10 outline-none text-white focus:border-purple-600 transition-all" />
            </div>
            <div className="lg:col-span-2 relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18} />
              <input type="number" placeholder="Min Bob" value={minChapters} onChange={(e) => setMinChapters(e.target.value)}
                className="w-full h-14 bg-[#0E0E10] border border-gray-800 rounded-2xl pl-12 outline-none text-white focus:border-purple-600" />
            </div>
            <div className="lg:col-span-2 relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18} />
              <input type="number" placeholder="Max Bob" value={maxChapters} onChange={(e) => setMaxChapters(e.target.value)}
                className="w-full h-14 bg-[#0E0E10] border border-gray-800 rounded-2xl pl-12 outline-none text-white focus:border-purple-600" />
            </div>
            <div className="lg:col-span-3 relative">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18} />
              <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full h-14 bg-[#0E0E10] border border-gray-800 rounded-2xl pl-12 pr-4 outline-none font-bold text-gray-300 appearance-none focus:border-purple-600 cursor-pointer">
                {GENRES.map(g => <option key={g} value={g} className="bg-[#0E0E10]">{g === 'Hammasi' ? 'Barcha Janrlar' : g}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : mangas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {mangas.map((manga) => (
              <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-800 mb-3 bg-[#1A1A1D] group-hover:border-purple-600/50 transition-all shadow-lg">
                  <img src={manga.image_url} alt={manga.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-purple-400 border border-purple-500/20">
                    {manga.chapters_count} BOB
                  </div>
                </div>
                <h3 className="text-[14px] font-bold text-gray-200 group-hover:text-purple-500 transition-colors line-clamp-2 px-1 leading-tight">{manga.title}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-[#151518] rounded-3xl border border-dashed border-gray-800">
            <SearchX size={64} className="text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-white">Hech narsa topilmadi</h2>
            <button onClick={() => {setSearchQuery(''); setSelectedGenre('Hammasi'); setMinChapters(''); setMaxChapters('');}} className="mt-6 bg-purple-600/10 text-purple-500 px-8 py-3 rounded-2xl font-bold hover:bg-purple-600 hover:text-white transition-all">Filtrlarni tozalash</button>
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
