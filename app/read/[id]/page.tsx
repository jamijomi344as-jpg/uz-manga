import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FloatingMenu from "@/components/FloatingMenu";

export const dynamic = 'force-dynamic';

export default async function ChapterReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: chapter, error } = await supabase
    .from('chapters')
    .select('*, mangas(id, title)')
    .eq('id', id)
    .single();

  let allChapters: any[] = [];
  if (chapter) {
    const { data } = await supabase
      .from('chapters')
      .select('id, chapter_number')
      .eq('manga_id', chapter.manga_id)
      .order('chapter_number', { ascending: true });
    if (data) allChapters = data;
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">
        <h1 className="text-red-500 font-bold text-2xl">Bob topilmadi!</h1>
      </div>
    );
  }

  // XATO TUZATILDI: file_url emas, pdf_url ishlatildi
  const cleanPdfUrl = chapter.pdf_url 
    ? `${chapter.pdf_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=100` 
    : "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative overflow-hidden">
      
      <header className="h-14 bg-[#141414] border-b border-zinc-800 flex items-center px-6 sticky top-0 z-[60]">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-2xl tracking-tighter text-[#6E3FD1]">UM</Link>
          <span className="text-zinc-500 text-sm">{chapter.mangas.title}</span>
          <span className="text-zinc-600">←</span>
          <span className="text-zinc-300 text-sm font-bold">{chapter.chapter_number}-bob</span>
          <span className="text-zinc-600">→</span>
        </div>
        
        <div className="ml-auto flex items-center gap-4 text-zinc-400">
          <Link href={`/manga/${chapter.mangas.id}`} className="hover:text-white transition flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Asosiyga qaytish
          </Link>
        </div>
      </header>

      <div className="flex-1 w-full flex justify-center relative">
        <main className="w-full max-w-[800px] bg-black h-[calc(100vh-56px)] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {cleanPdfUrl ? (
             <iframe 
               src={cleanPdfUrl} 
               className="absolute top-[-56px] left-0 w-full h-[calc(100vh+56px)] border-none bg-white"
               title={`Bob ${chapter.chapter_number}`}
             ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500">PDF fayl topilmadi</div>
          )}
        </main>
        
        {/* Suzuvchi menyu (Floating Menu) id orqali ulandi */}
        <FloatingMenu chapters={allChapters} currentChapterId={id} />
      </div>
    </div>
  );
}
