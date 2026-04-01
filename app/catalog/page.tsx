'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Search, X, SearchX, Bookmark } from 'lucide-react';
// XATO MANA SHU YERDA EDI, MANZIL TO'G'IRLANDI:
import UserProfile from '../components/UserProfile'; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CatalogPage() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mangalarni yuklash
  async function loadMangas(query = '') {
    setLoading(true);
    let request = supabase.from('mangas').select('*').order('title', { ascending: true });

    if (query.trim()) {
      request = request.ilike('title', `%${query}%`);
    }

    const { data, error } = await request;
    if (!error) {
      setMangas(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMangas(searchQuery);
    }, 400); 

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans">
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl font-black text-white tracking-tighter">U<span className="text-purple-600">M</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-400">
              <Link href="/" className="hover:text-white">Asosiy</Link>
              <Link href="/catalog" className="text-purple-500 border-b-2 border-purple-500 pb-[21px] pt-[23px]">Katalog</Link>
              <Link href="/popular" className="hover:text-white">Ommabop</Link>
              <Link href="/genres" className="hover:text-white">Janrlar</Link>
              <Link href="/new" className="hover:text-white">Yangi</Link>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-gray-400">
            <Link href="/bookmarks" className="hidden sm:block hover:text-white"><Bookmark size={20} /></Link>
            <UserProfile />
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        <div className="relative w-full max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text"
            placeholder="Manga qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-[#151518] border border-gray-800 rounded-2xl pl-12 pr-12 focus:border-purple-600 focus:outline-none transition-all text-white shadow-lg"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : mangas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {mangas.map((manga) => (
              <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-gray-800 mb-3 bg-[#1A1A1D]">
                  <img src={manga.image_url} alt={manga.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h3 className="text-sm font-bold group-hover:text-purple-500 transition-colors truncate">{manga.title}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchX size={64} className="text-gray-800 mb-4" />
            <h2 className="text-xl font-bold text-white">Manga topilmadi</h2>
            <p className="text-gray-500 mt-2">Kechirasiz, qidiruvingiz bo'yicha "{searchQuery}" hech narsa topilmadi.</p>
            <button onClick={() => setSearchQuery('')} className="mt-6 text-purple-500 hover:underline">Qidiruvni tozalash</button>
          </div>
        )}
      </div>
    </main>
  );
}
