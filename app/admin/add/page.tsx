"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Plus, Check, AlertCircle } from "lucide-react";

// Katalogdagi bilan bir xil bo'lgan tanlovlar ro'yxati
const GENRES = ["Ekshen", "Fantastika", "Syonen", "Romantika", "Sarguzasht", "Isekai", "Tarixiy", "Muzika", "Maktab", "Kultivatsiya", "Reenkarnatsiya", "Aql o'yinlari"];
const TYPES = ["Manxva", "Manxua", "Manga", "Donghua"];
const STATUSES = ["Chiqyapti", "Tugallangan", "To'xtatilgan"];
const RATINGS = ["12+", "16+", "18+"];

export default function AddMangaPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [mangaType, setMangaType] = useState("Manxua");
  const [status, setStatus] = useState("Chiqyapti");
  const [ageRating, setAgeRating] = useState("16+");
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Janrlarni tanlash va bekor qilish funksiyasi
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  // Bazaga saqlash
  const handleAddManga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      setMessage("Iltimos, nom va rasm manzilini kiriting!");
      return;
    }

    setLoading(true);
    setMessage("");

    // XATO TO'G'IRLANDI: Janrlar massiv (array) sifatida yuborilmoqda
    const { data, error } = await supabase.from('mangas').insert([
      { 
        title, 
        description, 
        image_url: imageUrl,
        manga_type: mangaType,
        status,
        age_rating: ageRating,
        release_year: releaseYear,
        genres: selectedGenres // .join(', ') o'chirildi, endi bu massiv
      }
    ]);

    if (error) {
      setMessage("Xatolik: " + error.message);
    } else {
      setMessage("✅ Manga bazaga muvaffaqiyatli qo'shildi!");
      // Formani tozalash
      setTitle("");
      setDescription("");
      setImageUrl("");
      setSelectedGenres([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto bg-[#141414] border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-800 pb-4">
          <div className="bg-[#6E3FD1] p-2 rounded-lg text-white">
            <Plus size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-wide text-white">YANGI ASAR QO'SHISH</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 font-bold flex items-center gap-2 ${message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message.includes('✅') ? <Check size={20}/> : <AlertCircle size={20}/>}
            {message}
          </div>
        )}

        <form onSubmit={handleAddManga} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Asar nomi</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 focus:border-[#6E3FD1] outline-none transition-all text-white" 
                placeholder="Masalan: Solo Leveling"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Muqova rasmi (URL)</label>
              <input 
                type="text" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 focus:border-[#6E3FD1] outline-none transition-all text-white" 
                placeholder="Rasm manzili..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Tavsif (Opisaniye)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={4} 
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 focus:border-[#6E3FD1] outline-none transition-all text-white"
                placeholder="Asar haqida qisqacha..."
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2">Asar Tipi</label>
              <select 
                value={mangaType} 
                onChange={(e) => setMangaType(e.target.value)} 
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-white outline-none"
              >
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2">Holati</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-white outline-none"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2">Yosh chegarasi</label>
              <select 
                value={ageRating} 
                onChange={(e) => setAgeRating(e.target.value)} 
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-white outline-none"
              >
                {RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2">Chiqarilgan yili</label>
              <input 
                type="number" 
                value={releaseYear} 
                onChange={(e) => setReleaseYear(parseInt(e.target.value))} 
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-white outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest">Janrlarni tanlang</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(genre => {
                const isActive = selectedGenres.includes(genre);
                return (
                  <button 
                    key={genre} 
                    type="button" 
                    onClick={() => toggleGenre(genre)}
                    className={`text-sm font-bold px-4 py-2 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-[#6E3FD1] border-[#8356E8] text-white shadow-[0_0_15px_rgba(110,63,209,0.3)]' 
                        : 'bg-[#0a0a0a] border-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    {isActive && <Check size={14} className="inline mr-1" />}
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-8 bg-[#6E3FD1] hover:bg-[#5D34B5] text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Yuklanmoqda..." : "BAZAGA SAQLASH"}
          </button>
        </form>
      </div>
    </div>
  );
}
