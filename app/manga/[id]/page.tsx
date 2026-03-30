import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";
import RatingStars from "@/components/RatingStars";

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 

  const { data: manga } = await supabase.from('mangas').select('*').eq('id', id).single();
  const { data: chapters } = await supabase.from('chapters').select('*').eq('manga_id', id).order('chapter_number', { ascending: true });

  if (!manga) return <div className="text-white p-20 text-center text-2xl font-black">XATO: MANGA TOPILMADI! ❌</div>;

  const firstChapterLink = chapters && chapters.length > 0 ? `/read/${chapters[0].id}` : "#";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans antialiased">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-sm mb-2 font-medium">
          <ArrowLeft size={16} /> Barcha mangalar
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          
          {/* CHAP PANEL */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(110,63,209,0.15)] border border-zinc-800">
              <img src={manga.image_url} alt={manga.title} className="w-full aspect-[3/4] object-cover" />
              {manga.manga_type && (
                <div className="absolute top-3 right-3 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700 backdrop-blur-md">
                  {manga.manga_type}
                </div>
              )}
            </div>

            <div className="grid gap-2 text-sm font-bold">
              <Link href={firstChapterLink} className={`p-4 rounded-xl flex items-center justify-center gap-2 transition-all ${chapters && chapters.length > 0 ? 'bg-[#6E3FD1] hover:bg-[#8356E8] text-white shadow-lg shadow-purple-500/20' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}>
                {chapters && chapters.length > 0 ? "O'QISHNI BOSHLASH" : "BOBLAR YO'Q"}
              </Link>
              <button className="bg-[#141414] hover:bg-zinc-800 p-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-zinc-800 text-zinc-400">
                <Bookmark size={18} /> Tanlanganlarga qo'shish
              </button>
            </div>
          </div>

          {/* O'NG PANEL (Tartib bilan) */}
          <div className="space-y-6">
            
            {/* 1. Sarlavha va Janrlar */}
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-2 text-white tracking-tight">{manga.title}</h1>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">
                {manga.release_year ? `${manga.release_year}-yil` : "Yili noma'lum"} • {manga.status || "Holati noma'lum"}
              </p>
              
              <div className="flex flex-wrap gap-2 items-center">
                {manga.age_rating && (
                  <span className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/20">
                    {manga.age_rating}
                  </span>
                )}
                {manga.genres && manga.genres.map((genre: string) => (
                  <Link key={genre} href={`/catalog?genre=${encodeURIComponent(genre)}`} className="bg-zinc-900 hover:bg-[#6E3FD1] text-zinc-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-[#8356E8] transition-all shadow-sm">
                    {genre}
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. Tavsif (Opisaniye) */}
            <div className="bg-[#141414] rounded-2xl border border-zinc-800/80 overflow-hidden">
              <div className="flex gap-8 px-6 border-b border-zinc-800/80 text-sm font-bold uppercase tracking-wider bg-[#0f0f0f]">
                <div className="py-4 text-[#6E3FD1] border-b-2 border-[#6E3FD1]">Tavsif (Opisaniye)</div>
              </div>
              <div className="p-6 text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                {manga.description || "Ushbu asar haqida ma'lumot kiritilmagan..."}
              </div>
            </div>

            {/* 3. YULDUZLI BAHOLASH (Aynan Tavsifning tagida) */}
            <RatingStars 
              mangaId={manga.id} 
              initialRating={manga.average_rating || 0} 
              initialCount={manga.rating_count || 0} 
            />

            {/* 4. Boblar Ro'yxati */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-white">Yangi boblar</h2>
              <div className="grid gap-2">
                {chapters?.length === 0 && <p className="text-zinc-600 text-sm">Hali boblar yuklanmagan.</p>}
                {chapters?.slice().reverse().map((ch) => (
                  <Link key={ch.id} href={`/read/${ch.id}`} className="bg-[#141414] hover:bg-zinc-800 p-4 rounded-xl flex justify-between items-center transition-all border border-zinc-800/80 group">
                    <span className="font-bold text-zinc-300 group-hover:text-white">Bob {ch.chapter_number}</span>
                    <span className="text-xs font-bold text-[#6E3FD1] opacity-0 group-hover:opacity-100 transition-opacity">O'qish →</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}