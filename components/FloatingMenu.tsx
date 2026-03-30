"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, List, Heart, AlertCircle, MessageCircle, Maximize, Minimize, Send, X } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Supabase ni ulaymiz

export default function FloatingMenu({ chapters, currentChapterId }: { chapters: any[], currentChapterId: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Haqiqiy layklar uchun yangi holatlar (State)
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Sahifa ochilganda bazadan haqiqiy layklar sonini tortib olish
  useEffect(() => {
    const fetchLikes = async () => {
      const { data } = await supabase.from('chapters').select('likes').eq('id', currentChapterId).single();
      if (data && data.likes !== null) {
        setLikesCount(data.likes);
      }
      
      // Brauzer xotirasini tekshiramiz (bu odam oldin layk bosganmi?)
      if (localStorage.getItem(`liked_chapter_${currentChapterId}`)) {
        setHasLiked(true);
      }
    };
    fetchLikes();
  }, [currentChapterId]);

  // Menyu ochish
  const toggleMenu = (menuName: string, requiresAuth: boolean = false) => {
    if (requiresAuth && !isLoggedIn) {
      setActiveMenu('login-warning');
      return;
    }
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // LAYK BOSISH FUNKSIYASI (Haqiqiy hisoblash)
  const handleLikeClick = async () => {
    // 1. Agar akkauntga kirmagan bo'lsa, ogohlantirish chiqarish
    if (!isLoggedIn) {
      setActiveMenu('login-warning');
      return;
    }

    // 2. Agar oldin bosgan bo'lsa, qayta bosishga ruxsat bermaslik
    if (hasLiked) return;

    // 3. Ekranda sonni bittaga ko'paytirish (Kutib turmaslik uchun darhol o'zgaradi)
    const newLikes = likesCount + 1;
    setLikesCount(newLikes);
    setHasLiked(true);
    localStorage.setItem(`liked_chapter_${currentChapterId}`, 'true'); // Brauzer xotirasiga yozib qo'yish

    // 4. Supabase bazasiga yangi raqamni jo'natish
    await supabase.from('chapters').update({ likes: newLikes }).eq('id', currentChapterId);
  };

  return (
    <>
      {/* O'NG TOMONDAGI ASOSIY PANEL */}
      <div className="hidden xl:flex flex-col items-center gap-4 fixed right-8 top-1/2 -translate-y-1/2 bg-[#141414] p-3 rounded-2xl border border-zinc-800/80 shadow-2xl z-[70]">
        
        <button onClick={() => toggleMenu('chapters')} className={`p-3 rounded-xl transition ${activeMenu === 'chapters' ? 'bg-[#6E3FD1] text-white' : 'text-zinc-400 hover:text-[#6E3FD1] hover:bg-zinc-800'}`} title="Boblar">
          <List size={20} />
        </button>

        <button onClick={toggleFullscreen} className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition" title="To'liq ekran">
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        <button onClick={() => toggleMenu('telegram')} className={`p-3 rounded-xl transition ${activeMenu === 'telegram' ? 'bg-[#0088cc] text-white' : 'text-zinc-400 hover:text-[#0088cc] hover:bg-zinc-800'}`} title="Telegram kanalimiz">
          <Send size={20} />
        </button>

        <div className="w-8 h-px bg-zinc-800 my-1"></div>

        <button onClick={() => toggleMenu('bookmark', true)} className={`p-3 rounded-xl transition ${activeMenu === 'bookmark' ? 'bg-[#6E3FD1] text-white' : 'text-zinc-400 hover:text-[#6E3FD1] hover:bg-zinc-800'}`} title="Saqlash">
          <Bookmark size={20} />
        </button>

        <button onClick={() => toggleMenu('comments', true)} className={`p-3 rounded-xl transition ${activeMenu === 'comments' ? 'bg-[#6E3FD1] text-white' : 'text-zinc-400 hover:text-[#6E3FD1] hover:bg-zinc-800'}`} title="Fikrlar">
          <MessageCircle size={20} />
        </button>

        {/* HAQIQIY LAYK TUGMASI */}
        <button 
          onClick={handleLikeClick} 
          className={`p-3 rounded-xl transition flex flex-col items-center gap-1 ${hasLiked ? 'text-red-500 bg-red-500/10' : 'text-zinc-400 hover:text-red-500 hover:bg-zinc-800'}`} 
          title="Yoqdi"
        >
          <Heart size={20} fill={hasLiked ? "#ef4444" : "none"} />
          <span className="text-[9px] font-bold">{likesCount}</span>
        </button>

        <button onClick={() => toggleMenu('report', true)} className="p-3 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition" title="Shikoyat qilish">
          <AlertCircle size={18} />
        </button>
      </div>

      {/*================ MENYULARNING OCHILADIGAN DARCHALARI ================*/}
      
      {activeMenu === 'login-warning' && (
        <div className="fixed right-24 top-1/2 -translate-y-1/2 bg-[#141414] border border-zinc-700 p-6 rounded-2xl shadow-2xl z-[70] w-72">
          <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2"><AlertCircle size={18}/> Kirish talab qilinadi!</h3>
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">Bu funksiyadan foydalanish uchun Google orqali ro'yxatdan o'tishingiz kerak.</p>
          <button onClick={() => { setIsLoggedIn(true); setActiveMenu(null); }} className="w-full bg-white text-black font-bold p-3 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200">
            Google orqali kirish
          </button>
          <button onClick={() => setActiveMenu(null)} className="w-full mt-2 text-zinc-500 text-sm hover:text-white">Yopish</button>
        </div>
      )}

      {activeMenu === 'chapters' && (
        <div className="fixed right-24 top-1/2 -translate-y-1/2 bg-[#141414] border border-zinc-800 rounded-2xl shadow-2xl z-[70] w-72 max-h-[60vh] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#0a0a0a]">
            <span className="font-black text-white">Mundarija</span>
            <button onClick={() => setActiveMenu(null)} className="text-zinc-500 hover:text-white"><X size={18}/></button>
          </div>
          <div className="overflow-y-auto p-2 flex flex-col gap-1">
            {chapters.map((ch: any) => (
              <Link 
                key={ch.id} 
                href={`/read/${ch.id}`}
                className={`px-4 py-3 text-sm font-bold rounded-xl transition ${ch.id === currentChapterId ? 'bg-[#6E3FD1] text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
              >
                Bob {ch.chapter_number}
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeMenu === 'telegram' && (
        <div className="fixed right-24 top-1/2 -translate-y-1/2 bg-[#141414] border border-[#0088cc]/50 p-6 rounded-2xl shadow-2xl z-[70] w-72 text-center">
          <div className="w-12 h-12 bg-[#0088cc]/20 text-[#0088cc] rounded-full flex items-center justify-center mx-auto mb-3">
            <Send size={24} />
          </div>
          <h3 className="font-bold text-white mb-1">Telegramda kuzating</h3>
          <p className="text-zinc-400 text-xs font-mono bg-black border border-zinc-800 rounded-lg p-2 mb-4">@Manga_uzbekcha</p>
          <a href="https://t.me/Manga_uzbekcha" target="_blank" rel="noopener noreferrer" className="block w-full bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold p-3 rounded-xl transition">
            Kanalga o'tish
          </a>
          <button onClick={() => setActiveMenu(null)} className="mt-3 text-zinc-500 text-sm hover:text-white">Yopish</button>
        </div>
      )}

      {activeMenu === 'bookmark' && (
        <div className="fixed right-24 top-1/2 -translate-y-1/2 bg-[#141414] border border-zinc-800 p-2 rounded-2xl shadow-2xl z-[70] w-64 flex flex-col gap-1">
          <div className="flex justify-between items-center px-3 py-2 border-b border-zinc-800 mb-1">
            <span className="font-bold text-sm text-white">Xatcho'p (Saqlash)</span>
            <button onClick={() => setActiveMenu(null)} className="text-zinc-500 hover:text-white"><X size={16}/></button>
          </div>
          <button className="text-left px-4 py-3 text-sm font-bold text-white bg-zinc-800/50 hover:bg-[#6E3FD1] rounded-xl transition">📖 O'qiyman</button>
          <button className="text-left px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-[#6E3FD1] rounded-xl transition">⏳ Kelajakda o'qiyman</button>
          <button className="text-left px-4 py-3 text-sm font-bold text-zinc-500 hover:bg-red-500 hover:text-white rounded-xl transition">❌ Hech qachon o'qimayman</button>
        </div>
      )}
    </>
  );
}