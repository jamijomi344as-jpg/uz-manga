"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Filter, ChevronLeft, ChevronRight, X, Search } from "lucide-react";

const GENRES = ["Ekshen", "Fantastika", "Syonen", "Romantika", "Sarguzasht", "Isekai", "Tarixiy", "Muzika", "Maktab", "Kultivatsiya", "Reenkarnatsiya", "Aql o'yinlari"];
const TYPES = ["Manxva", "Manxua", "Manga", "Donghua"];
const STATUSES = ["Chiqyapti", "Tugallangan", "To'xtatilgan"];
const ITEMS_PER_PAGE = 15;

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre');

  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenre ? [initialGenre] : []);
  
  // YANGI: Boblar soni filtrlari (Min va Max)
  const [minChapters, setMinChapters] = useState("");
  const [maxChapters, setMaxChapters] = useState("");

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const fetchMangas = async () => {
    setLoading(true);
    let query = supabase.from('mangas').select('*', { count: 'exact' });

    if (selectedType) query = query.eq('manga_type', selectedType);
    if (selectedStatus) query = query.eq('status', selectedStatus);
    if (selectedGenres.length > 0) query = query.contains('genres', selectedGenres); 
    
    // YANGI: Boblar soni bo'yicha bazadan qidirish
    if (minChapters && !isNaN(Number(minChapters))) {
      query = query.gte('chapter_count', Number(minChapters)); // gte = kattaroq yoki teng (>=)
    }
    if (maxChapters && !isNaN(Number(maxChapters))) {
      query = query.lte('chapter_count', Number(maxChapters)); // lte = kichikroq yoki teng (<=)
    }

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, count, error } = await query;
    if (!error && data) {
      setMangas(data);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMangas();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]); 

  const handleApplyFilters = () => {
    setPage(1); 
    fetchMangas();
    setShowMobileFilter(false);
  };

  const handleClearFilters = () => {
    setSelectedType("");
    setSelectedStatus("");
    setSelectedGenres([]);
    setMinChapters("");
    setMaxChapters("");
    setPage(1);
    setTimeout(() => fetchMangas(), 100); 
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <>
      <div className="bg-[#141414] border-b border-zinc-800 p-4 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-widest text-[#6E3FD1]">KATALOG</h1>
        <button onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-sm font-bold text-white">
          <Filter size={16} /> Filtrlar
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8 relative">
        {/* CHAP TOMON: Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6E3FD1]"></div>
            </div>
          ) : mangas.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
                {mangas.map((manga) => (
                  <Link href={`/manga/${manga.id}`} key={manga.id} className="group flex flex-col gap-2">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-lg group-hover:border-[#6E3FD1]/50 transition-colors">
                      <img src={manga.image_url} alt={manga.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {manga.manga_type && (
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded border border-zinc-700">
                          {manga.manga_type}
                        </div>
                      )}
                      {/* Rasmni ustida jami boblar sonini ham ko'rsatib turamiz */}
                      <div className="absolute bottom-2 right-2 bg-[#6E3FD1] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                        {manga.chapter_count || 0} bob
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight group-hover:text-[#6E3FD1] transition-colors line-clamp-2 text-white">{manga.title}</h3>
                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                        {manga.manga_type || "Noma'lum"} • {manga.genres && manga.genres.length > 0 ? manga.genres.join(", ") : "Janr yo'q"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* SAHIFALASH */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-3 rounded-xl bg-[#141414] border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition">
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                        return (
                          <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition ${page === pageNum ? 'bg-[#6E3FD1] text-white border border-[#8356E8]' : 'bg-[#141414] border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                        return <span key={pageNum} className="text-zinc-600">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-3 rounded-xl bg-[#141414] border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-xl font-bold">Hech narsa topilmadi</p>
              <p className="text-sm">Boshqa filtrlarni tanlab ko'ring</p>
            </div>
          )}
        </div>

        {/* O'NG TOMON: Filtrlar */}
        <div className={`fixed inset-0 z-50 lg:static lg:block lg:w-72 shrink-0 ${showMobileFilter ? 'block' : 'hidden'}`}>
          <div className="absolute inset-0 bg-black/80 lg:hidden" onClick={() => setShowMobileFilter(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 lg:w-full bg-[#141414] lg:bg-transparent border-l border-zinc-800 lg:border-none p-6 lg:p-0 overflow-y-auto lg:sticky lg:top-24 h-full lg:h-auto custom-scrollbar">
            
            <div className="flex justify-between items-center mb-6 lg:mb-4">
              <h2 className="text-lg font-black tracking-wide text-white">Filtrlar</h2>
              <button onClick={handleClearFilters} className="text-xs text-zinc-500 hover:text-white font-bold transition">Tozalash</button>
              <button onClick={() => setShowMobileFilter(false)} className="lg:hidden text-zinc-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              
              {/* BOBLAR SONI (Siz so'ragan ikkita quticha) */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Boblar soni</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      placeholder="Dan" 
                      value={minChapters} 
                      onChange={(e) => setMinChapters(e.target.value)} 
                      className="w-full bg-[#0a0a0a] border border-zinc-800 text-white text-sm rounded-xl p-3 outline-none focus:border-[#6E3FD1] transition placeholder:text-zinc-600"
                    />
                  </div>
                  <span className="text-zinc-600 font-bold">-</span>
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      placeholder="Gacha" 
                      value={maxChapters} 
                      onChange={(e) => setMaxChapters(e.target.value)} 
                      className="w-full bg-[#0a0a0a] border border-zinc-800 text-white text-sm rounded-xl p-3 outline-none focus:border-[#6E3FD1] transition placeholder:text-zinc-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Manga Tipi</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 text-white text-sm rounded-xl p-3 outline-none focus:border-[#6E3FD1]">
                  <option value="">Barchasi</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Holati</label>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 text-white text-sm rounded-xl p-3 outline-none focus:border-[#6E3FD1]">
                  <option value="">Barchasi</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Janrlar</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(genre => {
                    const isActive = selectedGenres.includes(genre);
                    return (
                      <button key={genre} onClick={() => toggleGenre(genre)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${isActive ? 'bg-[#6E3FD1] border-[#8356E8] text-white' : 'bg-[#0a0a0a] border-zinc-800 text-zinc-400 hover:text-white'}`}>
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button onClick={handleApplyFilters} className="w-full bg-[#6E3FD1] hover:bg-[#8356E8] text-white font-black text-sm tracking-wide py-4 rounded-xl shadow-[0_0_20px_rgba(110,63,209,0.3)] transition-all">
                QO'LLASH
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#6E3FD1]"></div></div>}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}