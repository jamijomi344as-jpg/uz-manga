import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Search, Bookmark } from 'lucide-react';
import ContinueReading from './components/ContinueReading';
import UserProfile from './components/UserProfile'; 

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Home() {
  const { data: mangas, error } = await supabase
    .from('mangas')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans">
      
      {/* Navbar - Ixcham va UM logoli */}
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl font-black text-white tracking-tighter">U<span className="text-purple-600">M</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-400">
              <Link href="/" className="text-purple-500 border-b-2 border-purple-500 pb-[21px] pt-[23px]">Главная</Link>
              <Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link>
              <Link href="/popular" className="hover:text-white transition-colors">Популярное</Link>
              <Link href="/genres" className="hover:text-white transition-colors">Жанры</Link>
              <Link href="/new" className="hover:text-white transition-colors">Новинки</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 text-gray-400">
            <Link href="/catalog" className="hover:text-white transition"><Search size={20} /></Link>
            <Link href="/bookmarks" className="hidden sm:block hover:text-white transition"><Bookmark size={20} /></Link>
            <UserProfile />
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        {/* O'qishda davom etish qismi (Faqat o'qigan bo'lsa chiqadi) */}
        <ContinueReading />
        
        <h1 className="text-[24px] font-bold text-white mb-6">Свежие обновления</h1>
        
        {/* Manga kartalari - ixcham grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {mangas && mangas.length > 0 ? (
            mangas.map((manga: any) => (
              <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col cursor-pointer">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg mb-3 bg-[#1A1A1D] border border-gray-800 group-hover:border-purple-500/50 transition-all">
                  <img 
                    src={manga.image_url || 'https://via.placeholder.com/300x400'} 
                    alt={manga.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  {manga.status && (
                    <div className="absolute top-0 left-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-md uppercase tracking-wider">
                      {manga.status}
                    </div>
                  )}
                </div>
                <div className="flex flex-col px-1">
                  <h2 className="text-[14px] font-bold text-gray-200 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
                    {manga.title}
                  </h2>
                  <p className="text-[12px] text-gray-500 mt-1 truncate">
                    {manga.type || 'Манхва'} • {manga.genres || 'Приключения'}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-600 border border-dashed border-gray-800 rounded-2xl">
              Список пуст. Добавьте мангу в базу данных.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}