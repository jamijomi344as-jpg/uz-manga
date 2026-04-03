'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Ikonkalar uchun kerak bo'lsa:
// import { ArrowLeft } from 'lucide-react'; 

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// MANA SHU YERDA YANGI JANRLAR RO'YXATI TURIBDI
const GENRES = [
  "Jangari", "Sport", "Komediya", "Fantastika", "Ekshen", 
  "Syonen", "Romantika", "Sarguzasht", "Isekai", "Kultivatsiya", 
  "Reenkarnatsiya", "Dahshatli", "Drama"
];

export default function AddMangaAdmin() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mangaType, setMangaType] = useState('Manhva');
  const [status, setStatus] = useState('Davom etmoqda');
  
  // Janrlarni tanlash uchun
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleAddManga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return alert("Nom va rasm URL majburiy!");
    
    setLoading(true);
    const { error } = await supabase.from('mangas').insert([
      { 
        title, 
        description, 
        image_url: imageUrl, 
        manga_type: mangaType,
        status,
        genres: selectedGenres 
      }
    ]);

    setLoading(false);
    if (error) {
      alert("Xatolik: " + error.message);
    } else {
      alert("Manga muvaffaqiyatli qo'shildi!");
      router.push('/catalog');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-200 p-8">
      <div className="max-w-[800px] mx-auto bg-[#151518] p-8 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Yangi Asar Qo'shish</h1>
          <Link href="/" className="text-purple-500 hover:underline">Orqaga</Link>
        </div>
        
        <form onSubmit={handleAddManga} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nomi</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-[#0E0E10] border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-600" />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Rasm URL manzil</label>
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className="w-full bg-[#0E0E10] border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Turi</label>
              <select value={mangaType} onChange={e => setMangaType(e.target.value)} className="w-full bg-[#0E0E10] border border-gray-800 rounded-xl px-4 py-3 outline-none">
                <option value="Manhva">Manhva</option>
                <option value="Manga">Manga</option>
                <option value="Manhua">Manhua</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Holati</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-[#0E0E10] border border-gray-800 rounded-xl px-4 py-3 outline-none">
                <option value="Davom etmoqda">Davom etmoqda</option>
                <option value="Tugallangan">Tugallangan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Janrlar (Bir nechtasini tanlang)</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <button 
                  type="button" 
                  key={g} 
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${selectedGenres.includes(g) ? 'bg-purple-600 text-white' : 'bg-[#0E0E10] border border-gray-800 text-gray-400'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Tavsif</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-[#0E0E10] border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-600" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-500 transition-colors">
            {loading ? 'Saqlanmoqda...' : 'Bazaga qo\'shish'}
          </button>
        </form>
      </div>
    </div>
  );
}
