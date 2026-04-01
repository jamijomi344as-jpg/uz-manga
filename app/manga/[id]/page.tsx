import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Eye, Star } from 'lucide-react';
import BookmarkButton from '../../components/BookmarkButton';
import ViewTracker from '../../components/ViewTracker'; // YANGI KOD

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function MangaDetails({ params }: { params: { id: string } }) {
  const { data: manga, error: mangaError } = await supabase.from('mangas').select('*').eq('id', params.id).single();
  const { data: chapters } = await supabase.from('chapters').select('*').eq('manga_id', params.id).order('chapter_number', { ascending: false });

  if (mangaError || !manga) {
    return (
      <div className="min-h-screen bg-[#0E0E10] text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Manga topilmadi 😕</h1>
        <Link href="/" className="text-purple-500 hover:underline">Asosiy sahifaga qaytish</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans pb-20">
      
      {/* YANGI QO'SHILGAN QISM: KO'RISHLARNI SANASH KODI */}
      <ViewTracker mangaId={manga.id} currentViews={manga.views || 0} />

      <div className="w-full h-[350px] md:h-[450px] relative overflow-hidden flex justify-center">
        <div className="absolute inset-0 bg-[#0E0E10]/85 z-10 backdrop-blur-sm"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0E0E10] to-transparent z-20"></div>
        <img src={manga.image_url || 'https://via.placeholder.com/1000x400'} alt="Cover" className="w-full max-w-[1000px] h-full object-cover opacity-60" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 relative z-30 -mt-[200px] md:-mt-[250px]">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors w-fit bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
          <ArrowLeft size={18} /> <span className="text-sm font-medium">Главная</span>
        </Link>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="w-[220px] md:w-[280px] shrink-0 mx-auto md:mx-0">
            <div className="rounded-xl overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.15)] border border-gray-800 mb-6 bg-[#1A1A1D]">
              <img src={manga.image_url || 'https://via.placeholder.com/300x400'} alt={manga.title} className="w-full h-auto object-cover aspect-[3/4]" />
            </div>
            
            <div className="flex gap-3">
              {chapters && chapters.length > 0 ? (
                <Link href={`/read/${chapters[chapters.length - 1].id}`} className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                  <BookOpen size={20} /> Читать
                </Link>
              ) : (
                <button disabled className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-gray-500 font-bold py-3.5 px-4 rounded-xl cursor-not-allowed">
                  Скоро
                </button>
              )}
              <BookmarkButton manga={manga} />
            </div>
          </div>

          <div className="flex-1 mt-2 md:mt-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">{manga.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-[13px] md:text-sm font-medium text-gray-400 mb-8">
              <span className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-md"><Star size={16} className="fill-yellow-500" /> 9.8</span>
              <span className="bg-purple-600/20 text-purple-400 px-2.5 py-1 rounded-md border border-purple-500/20">{manga.type || 'Манхва'}</span>
              <span className="bg-gray-800/80 px-2.5 py-1 rounded-md text-gray-300">{manga.genres || 'Экшен'}</span>
              <span className="flex items-center gap-1.5 bg-gray-800/80 px-2.5 py-1 rounded-md text-gray-300">
                <Eye size={16} /> {manga.views || 0}
              </span>
            </div>

            <div className="mb-10 bg-[#151518] p-5 rounded-2xl border border-gray-800/60">
              <h3 className="text-base font-bold text-white mb-2">Описание</h3>
              <p className="text-gray-400 leading-relaxed text-[14px] md:text-[15px]">{manga.description || 'Описание пока не добавлено.'}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">Список глав <span className="bg-gray-800 text-xs text-gray-400 px-2 py-0.5 rounded-full">{chapters?.length || 0}</span></h3>
              <div className="bg-[#151518] border border-gray-800/60 rounded-2xl overflow-hidden">
                {chapters && chapters.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                    {chapters.map((chapter: any) => (
                      <Link href={`/read/${chapter.id}`} key={chapter.id} className="flex items-center justify-between p-3.5 mb-1 rounded-xl hover:bg-gray-800/50 transition-colors group">
                        <span className="font-semibold text-gray-300 group-hover:text-purple-400 transition-colors text-[15px]">Глава {chapter.chapter_number}</span>
                        <span className="text-[13px] text-gray-500 flex items-center gap-1.5"><Clock size={14} /> {new Date(chapter.created_at).toLocaleDateString('ru-RU')}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-gray-500">Пока нет глав.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}