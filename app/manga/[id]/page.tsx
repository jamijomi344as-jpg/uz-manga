import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Eye, Star } from 'lucide-react';
import BookmarkButton from '../../components/BookmarkButton';
import ViewTracker from '../../components/ViewTracker'; 
import RatingStars from '../../../components/RatingStars'; // YANGI
import SaveHistory from '../../components/SaveHistory'; // YANGI
import Comments from '../../components/Comments'; // YANGI

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function MangaDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: manga, error: mangaError } = await supabase.from('mangas').select('*').eq('id', id).single();
  const { data: chapters } = await supabase.from('chapters').select('*').eq('manga_id', id).order('chapter_number', { ascending: false });

  if (mangaError || !manga) {
    return (
      <div className="min-h-screen bg-[#0E0E10] text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Manga topilmadi 😕</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans pb-20">
      <ViewTracker mangaId={manga.id} currentViews={manga.views || 0} />
      
      <div className="w-full h-[350px] relative overflow-hidden flex justify-center">
        <div className="absolute inset-0 bg-[#0E0E10]/85 z-10"></div>
        <img src={manga.image_url} className="w-full h-full object-cover opacity-60" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 relative z-30 -mt-[250px]">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 mb-6 bg-black/40 px-3 py-1.5 rounded-full">
          <ArrowLeft size={18} /> Asosiyga qaytish
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-[220px] md:w-[280px] shrink-0">
            <img src={manga.image_url} className="w-full rounded-xl border border-gray-800 aspect-[3/4] object-cover mb-6" />
            <div className="flex gap-3">
              {chapters && chapters.length > 0 ? (
                <Link href={`/read/${chapters[chapters.length - 1].id}`} className="flex-1 flex justify-center gap-2 bg-purple-600 text-white font-bold py-3.5 rounded-xl">
                  <BookOpen size={20} /> O'qish
                </Link>
              ) : (
                <button disabled className="flex-1 bg-gray-800 text-gray-500 font-bold py-3.5 rounded-xl">Tez orada</button>
              )}
              <BookmarkButton manga={manga} />
            </div>
          </div>

          <div className="flex-1 md:mt-10">
            <h1 className="text-4xl font-black text-white mb-3">{manga.title}</h1>
            <div className="flex gap-3 mb-8">
              <span className="bg-purple-600/20 text-purple-400 px-2.5 py-1 rounded-md">{manga.manga_type || 'Manhva'}</span>
              <span className="bg-gray-800/80 px-2.5 py-1 rounded-md text-gray-300">{manga.genres || 'Sarguzasht'}</span>
              <span className="flex items-center gap-1.5 bg-gray-800/80 px-2.5 py-1 rounded-md text-gray-300"><Eye size={16}/> {manga.views || 0}</span>
            </div>

            {/* REYTING TIZIMI ULANDI */}
            <RatingStars mangaId={manga.id.toString()} initialRating={9.5} initialCount={12} />

            <div className="my-10 bg-[#151518] p-5 rounded-2xl border border-gray-800">
              <h3 className="font-bold text-white mb-2">Tavsif</h3>
              <p className="text-gray-400 text-sm">{manga.description || 'Tavsif yo\'q'}</p>
            </div>

            <h3 className="text-lg font-bold text-white mb-4">Boblar ({chapters?.length || 0})</h3>
            <div className="bg-[#151518] border border-gray-800 rounded-2xl max-h-[400px] overflow-y-auto mb-10">
              {chapters?.map((ch: any) => (
                <Link href={`/read/${ch.id}`} key={ch.id} className="flex justify-between p-4 border-b border-gray-800 hover:bg-gray-800/50">
                  <span className="font-semibold text-gray-300">{ch.chapter_number}-bob</span>
                  <span className="text-xs text-gray-500">{new Date(ch.created_at).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
            
            {/* SHARHLAR ULANDI */}
            <Comments mangaId={manga.id.toString()} />
          </div>
        </div>
      </div>
    </main>
  );
}
