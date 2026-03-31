import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// KESHNI TOZALASH UCHUN SEHRLI KOD (Yangi boblar darhol chiqishi uchun):
export const dynamic = 'force-dynamic';

// Supabase'ga ulanish sozlamalari
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Home() {
  // Supabase'dagi "mangas" jadvalidan barcha mangalarni tortib olish
  const { data: mangas, error } = await supabase
    .from('mangas')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0f1115] text-white p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            Uz-Manga
          </h1>
          <p className="text-gray-400">Eng sara mangalar, manxvalar va dunxualar olami</p>
        </header>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-8 text-center">
            Ma'lumotlarni yuklashda xatolik yuz berdi. Supabase ulanishini tekshiring.
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {mangas && mangas.length > 0 ? (
            mangas.map((manga: any) => (
              <Link 
                href={`/manga/${manga.id}`} 
                key={manga.id} 
                className="bg-[#1a1d24] rounded-xl overflow-hidden hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img 
                    src={manga.image_url || 'https://via.placeholder.com/300x400?text=Rasm+yo%27q'} 
                    alt={manga.title} 
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                  />
                  {manga.status && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-xs font-bold px-2 py-1 rounded-md shadow-md uppercase">
                      {manga.status}
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <h2 className="font-bold text-sm sm:text-base text-gray-100 line-clamp-2 mb-1" title={manga.title}>
                    {manga.title}
                  </h2>
                  <p className="text-xs text-gray-400 capitalize">{manga.type || 'Manga'}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
              <span className="text-6xl mb-4">📂</span>
              <p className="text-lg">Hozircha bazada hech qanday manga yo'q.</p>
              <p className="text-sm mt-2">Admin paneldan yangi manga qo'shing!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}