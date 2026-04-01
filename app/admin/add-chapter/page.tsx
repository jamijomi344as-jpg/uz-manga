"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Plus, Check, AlertCircle, BookOpen } from "lucide-react";

export default function AddChapterPage() {
  const [mangas, setMangas] = useState<any[]>([]);
  
  // Forma ma'lumotlari (States)
  const [selectedMangaId, setSelectedMangaId] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Sahifa ochilganda bazadagi "Papkalar"ni (Mangalarni) tortib kelish
  useEffect(() => {
    const fetchMangas = async () => {
      // Mangalarni nomiga qarab alifbo tartibida olib kelamiz
      const { data, error } = await supabase
        .from('mangas')
        .select('id, title')
        .order('title', { ascending: true });
      
      if (data) {
        setMangas(data);
      }
    };
    fetchMangas();
  }, []);

  // Yangi bobni bazaga jo'natish
  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tekshiruv: Hamma joy to'ldirilganmi?
    if (!selectedMangaId || !chapterNumber || !fileUrl) {
      setMessage("Iltimos, manga, bob raqami va PDF linkni kiriting!");
      return;
    }

    setLoading(true);
    setMessage("");

    // Chapters jadvaliga yangi qator qo'shish
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
      // Keyingi bobni tezroq qo'shish uchun faqat bob raqami va linkni tozalaymiz.
      // Manga tanlovi o'z joyida qoladi (masalan, birdaniga 3-4 ta bob yuklash uchun qulay).
      setChapterNumber("");
      setFileUrl("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-2xl mx-auto bg-[#141414] border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-800 pb-4">
          <div className="bg-[#6E3FD1] p-3 rounded-xl text-white shadow-lg shadow-purple-500/20">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wide">YANGI BOB QO'SHISH</h1>
            <p className="text-zinc-500 text-sm mt-1">Mavjud mangalar ichiga yangi PDF yuklash</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 font-bold flex items-center gap-2 ${message.includes('✅') ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
            {message.includes('✅') ? <Check size={20}/> : <AlertCircle size={20}/>}
            {message}
          </div>
        )}

        <form onSubmit={handleAddChapter} className="space-y-6">
          
          {/* 1. MANGA TANLASH (Bosh sahifani to'ldirib yubormaslikning siri shu yerda) */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Qaysi mangaga bob qo'shyapmiz?</label>
            <select 
              value={selectedMangaId} 
              onChange={(e) => setSelectedMangaId(e.target.value)} 
              className="w-full bg-[#0a0a0a] border border-zinc-800 text-white rounded-xl p-4 outline-none cursor-pointer focus:border-[#6E3FD1] transition"
            >
              <option value="" disabled>-- Mangani tanlang --</option>
              {mangas.map(manga => (
                <option key={manga.id} value={manga.id}>{manga.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2. BOB RAQAMI */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Bob Raqami</label>
              <input 
                type="number" 
                step="any" // 1.5 kabi yarim boblar uchun ham ruxsat beradi
                value={chapterNumber} 
                onChange={(e) => setChapterNumber(e.target.value)} 
                placeholder="Masalan: 65" 
                className="w-full bg-[#0a0a0a] border border-zinc-800 text-white rounded-xl p-4 focus:border-[#6E3FD1] focus:ring-1 focus:ring-[#6E3FD1] outline-none transition" 
              />
            </div>

            {/* 3. PDF MANZILI */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Fayl Manzili (PDF URL)</label>
              <input 
                type="text" 
                value={fileUrl} 
                onChange={(e) => setFileUrl(e.target.value)} 
                placeholder="https://.../bob-65.pdf" 
                className="w-full bg-[#0a0a0a] border border-zinc-800 text-white rounded-xl p-4 focus:border-[#6E3FD1] focus:ring-1 focus:ring-[#6E3FD1] outline-none transition" 
              />
            </div>
          </div>

          {/* YUKLASH TUGMASI */}
          <button 
            type="submit" 
            disabled={loading || !selectedMangaId || !chapterNumber || !fileUrl} 
            className="w-full mt-8 bg-[#6E3FD1] hover:bg-[#8356E8] disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black text-lg py-4 rounded-xl shadow-[0_0_30px_rgba(110,63,209,0.3)] transition-all flex justify-center items-center gap-2 active:scale-95"
          >
            {loading ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div> : <><Upload size={20} /> BOBNI BAZAGA SAQLASH</>}
          </button>

        </form>
      </div>
    </div>
  );
}
