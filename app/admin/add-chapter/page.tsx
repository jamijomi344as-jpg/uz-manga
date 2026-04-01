"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Check, AlertCircle, BookOpen } from "lucide-react";

export default function AddChapterPage() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [selectedMangaId, setSelectedMangaId] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMangas = async () => {
      const { data } = await supabase.from('mangas').select('id, title').order('title', { ascending: true });
      if (data) setMangas(data);
    };
    fetchMangas();
  }, []);

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMangaId || !chapterNumber || !fileUrl) {
      setMessage("Iltimos, manga, bob raqami va PDF linkni kiriting!");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from('chapters').insert([
      { 
        manga_id: parseInt(selectedMangaId), 
        chapter_number: Number(chapterNumber), 
        pdf_url: fileUrl 
      }
    ]);

    if (error) {
      setMessage("Xatolik: " + error.message);
    } else {
      setMessage(`✅ ${chapterNumber}-bob muvaffaqiyatli qo'shildi!`);
      setChapterNumber("");
      setFileUrl("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-2xl mx-auto bg-[#141414] border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-800 pb-4">
          <div className="bg-[#6E3FD1] p-3 rounded-xl text-white"><BookOpen size={24} /></div>
          <div>
            <h1 className="text-2xl font-black tracking-wide">YANGI BOB QO'SHISH</h1>
            <p className="text-zinc-500 text-sm mt-1">Mavjud mangalar ichiga yangi PDF yuklash</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 font-bold flex items-center gap-2 ${message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message.includes('✅') ? <Check size={20}/> : <AlertCircle size={20}/>}
            {message}
          </div>
        )}

        <form onSubmit={handleAddChapter} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-2">Qaysi mangaga bob qo'shyapmiz?</label>
            <select value={selectedMangaId} onChange={(e) => setSelectedMangaId(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-white">
              <option value="" disabled>-- Mangani tanlang --</option>
              {mangas.map(manga => <option key={manga.id} value={manga.id}>{manga.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2">Bob Raqami</label>
              <input type="number" step="any" value={chapterNumber} onChange={(e) => setChapterNumber(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2">Fayl Manzili (PDF URL)</label>
              <input type="text" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4" />
            </div>
          </div>
          <button type="submit" disabled={loading || !selectedMangaId || !chapterNumber || !fileUrl} className="w-full mt-8 bg-[#6E3FD1] text-white font-black py-4 rounded-xl">
            {loading ? "Yuklanmoqda..." : "BOBNI BAZAGA SAQLASH"}
          </button>
        </form>
      </div>
    </div>
  );
}
