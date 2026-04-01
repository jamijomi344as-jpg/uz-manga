import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye } from 'lucide-react';
import BookmarkButton from '../../components/BookmarkButton';
import ViewTracker from '../../components/ViewTracker'; 
import RatingStars from '../../../components/RatingStars';
import Comments from '../../components/Comments';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

import UserProfile from '../../components/UserProfile';

export default async function MangaDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: manga, error: mangaError } = await supabase.from('mangas').select('*').eq('id', id).single();
  const { data: chapters } = await supabase.from('chapters').select('*').eq('manga_id', id).order('chapter_number', { ascending: false });

  if (mangaError || !manga) {
    return (
      <div className="min-h-screen bg-[#0E0E10] text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Asar topilmadi 😕</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans pb-20">
      <nav className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-white tracking-tighter">U<span className="text-purple-600">M</span></Link>
          <UserProfile />
        </div>
      </nav>

      <ViewTracker mangaId={manga.id} currentViews={manga.views || 0} />
      
      <div className="w-full h-[350px] relative overflow-hidden flex justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-[#0E0E10]/80 to-transparent z-10"></div>
        <img src={manga.image_url} className="w-full h-full object-cover opacity-40 blur-sm" alt="" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 relative z-30 -mt-[200px]">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 mb-6 bg-black/40 px-4 py-2 rounded-xl hover:text-white transition backdrop-blur-md border border-white/5">
          <ArrowLeft size={18} /> Asosiyga qaytish
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-[240px] md:w-[300px] shrink-0 mx-auto md:mx-0">
            <img src={manga.image_url} className="w-full rounded-2xl border border-gray-800 aspect-[3/4] object-cover mb-6 shadow-2xl shadow-purple-900/20" alt={manga.title} />
            <div className="flex gap-3">
              {chapters && chapters.length > 0 ? (
                <Link href={`/read/${chapters[chapters.length - 1].id}`} className="flex-1 flex justify-center gap-2 bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-500 transition">
                  <BookOpen size={20} /> O'qish
                </Link>
              ) : (
                <button disabled className="flex-1 bg-gray-800 text-gray-500 font-bold py-4 rounded-xl">Yaqinda</button>
              )}
              <BookmarkButton manga={manga} />
            </div>
          </div>

          <div className="flex-1 md:mt-6">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{manga.title}</h1>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-purple-600/20 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-500/20">{manga.manga_type || 'Manhva'}</span>
              {Array.isArray(manga.genres) ? manga.genres.map((genre: string) => (
                <Link href={`/catalog?genre=${genre}`} key={genre} className="bg-gray-800/60 hover:bg-purple-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 transition-all border border-gray-700 active:scale-95">{genre}</Link>
              )) : manga.genres?.split(',').map((g: string) => (
                <Link href={`/catalog?genre=${g.trim()}`} key={g} className="bg-gray-800/60 hover:bg-purple-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 transition-all border border-gray-700 active:scale-95">{g.trim()}</Link>
              ))}
              <span className="flex items-center gap-1.5 bg-gray-800/40 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 border border-gray-700"><Eye size={14}/> {manga.views || 0}</span>
            </div>
            <RatingStars mangaId={manga.id.toString()} initialRating={9.2} initialCount={24} />
            <div className="my-8 bg-[#151518] p-6 rounded-2xl border border-gray-800/50">
              <p className="text-gray-400 text-[15px] leading-relaxed">{manga.description || 'Tavsif qo\'shilmagan.'}</p>
            </div>
            <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">Boblar <span className="text-purple-500 text-sm bg-purple-500/10 px-2 py-0.5 rounded-md">{chapters?.length || 0}</span></h3>
            <div className="bg-[#151518] border border-gray-800/50 rounded-2xl max-h-[450px] overflow-y-auto mb-10 custom-scrollbar shadow-inner">
              {chapters?.map((ch: any) => (
                <Link href={`/read/${ch.id}`} key={ch.id} className="flex justify-between items-center p-5 border-b border-gray-800/50 hover:bg-white/5 transition-all group">
                  <span className="font-bold text-gray-300 group-hover:text-purple-400 transition-colors">{ch.chapter_number}-bob</span>
                  <span className="text-xs text-gray-600">{new Date(ch.created_at).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
            <Comments mangaId={manga.id.toString()} />
          </div>
        </div>
      </div>
    </main>
  );
}
