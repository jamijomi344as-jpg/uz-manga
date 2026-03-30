"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Star, Info } from "lucide-react";

export default function RatingStars({ mangaId, initialRating, initialCount }: { mangaId: string, initialRating: number, initialCount: number }) {
  const [rating, setRating] = useState(initialRating || 0);
  const [count, setCount] = useState(initialCount || 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [message, setMessage] = useState("");

  const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 soat (millisekundlarda)
  const LAST_RATED_KEY = `rated_manga_time_${mangaId}`;

  useEffect(() => {
    // Sahifa ochilganda oldin baho berilgan vaqtni tekshiramiz
    const lastRatedTime = localStorage.getItem(LAST_RATED_KEY);
    if (lastRatedTime) {
      const timePassed = Date.now() - parseInt(lastRatedTime);
      if (timePassed < COOLDOWN_MS) {
        setHasRated(true); // 24 soat o'tmagan bo'lsa, yopib qo'yamiz
      } else {
        setHasRated(false); // 24 soat o'tgan bo'lsa, yana ochamiz
      }
    }
  }, [mangaId]);

  const handleRate = async (score: number) => {
    // 24 soatlik tekshiruv
    const lastRatedTime = localStorage.getItem(LAST_RATED_KEY);
    if (lastRatedTime) {
      const timePassed = Date.now() - parseInt(lastRatedTime);
      if (timePassed < COOLDOWN_MS) {
        setMessage("⏳ 1 kundan keyin qayta urining!");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
    }

    try {
      let tempUserIp = localStorage.getItem('temp_user_ip');
      if (!tempUserIp) {
        tempUserIp = `ip_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('temp_user_ip', tempUserIp);
      }

      const { error } = await supabase.from('ratings').insert([
        { manga_id: mangaId, score: score, user_ip: tempUserIp }
      ]);

      if (error) {
        setMessage("Xatolik yuz berdi. Qayta urinib ko'ring.");
      } else {
        setMessage("✅ Bahoingiz qabul qilindi!");
        setHasRated(true);
        // Hozirgi vaqtni saqlab qo'yamiz (Keyingi 24 soatlik sanoq boshlanadi)
        localStorage.setItem(LAST_RATED_KEY, Date.now().toString());
        
        setCount(prev => prev + 1);
        setRating(prev => Number(((prev * count + score) / (count + 1)).toFixed(1)));
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#141414] rounded-2xl border border-zinc-800/80 shadow-lg relative mt-2">
      
      {/* Chap tomon: O'rtacha baho */}
      <div className="flex items-center gap-3">
        <div className="bg-black border border-zinc-800 p-3 rounded-xl">
          <span className="text-3xl font-black text-[#4CD964] leading-none">{rating.toFixed(1)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm tracking-wide">Asar Reytingi</span>
          <span className="text-zinc-500 text-xs font-medium">{count} ta foydalanuvchi baholadi</span>
        </div>
      </div>
      
      {/* O'ng tomon: Yulduzchalar */}
      <div className="flex flex-col items-center sm:items-end">
        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">O'z bahoingizni bering</span>
        <div 
          className={`flex items-center gap-1 ${hasRated ? 'opacity-50 cursor-not-allowed' : ''}`}
          onMouseLeave={() => setHoveredStar(0)}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => !hasRated && setHoveredStar(star)}
              className="focus:outline-none transition-transform hover:scale-125"
              title={`${star} ball`}
            >
              <Star 
                size={20} 
                fill={(hoveredStar || (rating / 10) * 10) >= star ? "#4CD964" : "transparent"} 
                className={`${(hoveredStar || (rating / 10) * 10) >= star ? "text-[#4CD964]" : "text-zinc-700 hover:text-zinc-500"}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Xabar chiqadigan joy */}
      {message && (
        <div className="absolute -top-12 right-4 bg-black text-white text-xs font-bold px-4 py-3 rounded-xl border border-zinc-700 shadow-2xl z-50 animate-fade-in-up flex items-center gap-2">
          {message.includes('⏳') ? <Info size={14} className="text-yellow-500"/> : null}
          {message}
        </div>
      )}
    </div>
  );
}