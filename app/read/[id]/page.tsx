import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Home } from 'lucide-react';

// Keshni tozalash (yangi bob qo'shilganda darhol chiqishi uchun)
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function ReadChapter({ params }: { params: { id: string } }) {
  // 1. Hozirgi bobni (chapter) topish
  const { data: currentChapter, error: chapterError } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', params.id)
    .single();

  if (chapterError || !currentChapter) {
    return (
      <div className="min-h-screen bg-[#0E0E10] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Bob topilmadi 😕</h1>
        <Link href="/" className="text-purple-500 hover:underline">Главная страница</Link>
      </div>
    );
  }

  // 2. Ushbu bob tegishli bo'lgan mangani topish (Nomi kerak)
  const { data: manga } = await supabase
    .from('mangas')
    .select('*')
    .eq('id', currentChapter.manga_id)
    .single();

  // 3. Oldingi va keyingi boblarni topish (Navigatsiya uchun)
  const { data: allChapters } = await supabase
    .from('chapters')
    .select('id, chapter_number')
    .eq('manga_id', currentChapter.manga_id)
    .order('chapter_number', { ascending: true });

  let prevChapter = null;
  let nextChapter = null;

  if (allChapters) {
    const currentIndex = allChapters.findIndex(c => c.id === currentChapter.id);
    if (currentIndex > 0) prevChapter = allChapters[currentIndex - 1];
    if (currentIndex < allChapters.length - 1) nextChapter = allChapters[currentIndex + 1];
  }

  return (
    <main className="min-h-screen bg-[#0E0E10] text-gray-200 font-sans flex flex-col">
      
      {/* 1. Tepa menyu (Navbar) - O'qish paytida xalaqit bermasligi uchun ixcham */}
      <nav className="sticky top-0 z-50 bg-[#151518]/95 backdrop-blur-md border-b border-gray-800 px-4 h-14 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Link href={`/manga/${currentChapter.manga_id}`} className="text-gray-400 hover:text-white transition flex items-center gap-1.5">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline text-sm font-medium">К тайтлу</span>
          </Link>
          <div className="h-5 w-px bg-gray-700 mx-1"></div>
          <h1 className="text-sm font-bold text-gray-100 truncate max-w-[150px] sm:max-w-[300px]">
            {manga?.title || 'Манга'}
          </h1>
          <span className="text-xs font-medium bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
            Глава {currentChapter.chapter_number}
          </span>
        </div>

        <Link href="/" className="text-gray-400 hover:text-white transition">
          <Home size={20} />
        </Link>
      </nav>

      {/* 2. Asosiy o'qish qismi (Siz PDF saqlaganingiz uchun iframe qo'yildi) */}
      <div className="flex-1 w-full max-w-[1000px] mx-auto bg-black flex flex-col items-center">
        {currentChapter.pdf_url ? (
          <iframe 
            src={`${currentChapter.pdf_url}#toolbar=0&navpanes=0&scrollbar=0`} 
            className="w-full h-[85vh] border-none bg-white"
            title={`Глава ${currentChapter.chapter_number}`}
          />
        ) : (
          <div className="py-20 text-center text-gray-500">
            <p>PDF fayl manzili topilmadi. Admin paneldan to'g'ri kiritilganini tekshiring.</p>
          </div>
        )}
      </div>

      {/* 3. Pastki Navigatsiya (Keyingi / Oldingi bobga o'tish tugmalari) */}
      <div className="bg-[#151518] border-t border-gray-800 p-4 sticky bottom-0 z-50">
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          
          {/* Oldingi bob */}
          {prevChapter ? (
            <Link 
              href={`/read/${prevChapter.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              <ChevronLeft size={18} />
              <span className="text-sm font-medium hidden sm:inline">Предыдущая</span>
            </Link>
          ) : (
            <div className="w-[120px]"></div> /* Bo'sh joy saqlash uchun */
          )}

          {/* O'rta qism: Bob raqami */}
          <div className="text-sm text-gray-400 font-medium bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
            Глава {currentChapter.chapter_number}
          </div>

          {/* Keyingi bob */}
          {nextChapter ? (
            <Link 
              href={`/read/${nextChapter.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              <span className="text-sm font-medium hidden sm:inline">Следующая</span>
              <ChevronRight size={18} />
            </Link>
          ) : (
            <Link 
              href={`/manga/${currentChapter.manga_id}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              <span className="text-sm font-medium">Конец</span>
              <Home size={18} />
            </Link>
          )}

        </div>
      </div>

    </main>
  );
}