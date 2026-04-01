'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { User, Bookmark, History, Settings, LogOut, ChevronDown, Bell, MessageSquare } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Dastlabki foydalanuvchini tekshirish
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // 2. Tizimga kirish/chiqish o'zgarishlarini kuzatish
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Ekranning boshqa joyini bossa, menyu yopilishi uchun
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Haqiqiy Google orqali kirish funksiyasi
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  // Tizimdan chiqish
  const signOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  // AGAR FOYDALANUVCHI TIZIMGA KIRMAGAN BO'LSA:
  if (!user) {
    return (
      <button 
        onClick={signInWithGoogle} 
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-full transition-all text-sm font-medium"
      >
        {/* Google logotipi */}
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Войти
      </button>
    );
  }

  // AGAR FOYDALANUVCHI TIZIMGA KIRGAN BO'LSA (Rasm va Menyu chiqadi):
  return (
    <div className="relative" ref={menuRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 cursor-pointer group"
      >
        <img 
          src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/150'} 
          alt="User avatar" 
          className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-purple-500 transition-all object-cover" 
        />
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-[#151518] border border-gray-800 rounded-2xl shadow-2xl py-2 z-50">
          
          {/* Ism va Email qismi */}
          <div className="px-4 py-3 border-b border-gray-800/60 mb-2">
            <p className="text-sm font-bold text-white truncate">
              {user.user_metadata?.full_name || 'Пользователь'}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
          </div>
          
          {/* Menyu ro'yxati (Keraksizlari olib tashlangan) */}
          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <User size={18} className="text-gray-400" /> Мой профиль
          </Link>
          <Link href="/bookmarks" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Bookmark size={18} className="text-gray-400" /> Закладки
          </Link>
          <Link href="/notifications" className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <div className="flex items-center gap-3"><Bell size={18} className="text-gray-400" /> Уведомления</div>
          </Link>
          <Link href="/messages" className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <div className="flex items-center gap-3"><MessageSquare size={18} className="text-gray-400" /> Сообщения</div>
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">1</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <History size={18} className="text-gray-400" /> История чтения
          </Link>
          
          <div className="h-px bg-gray-800/60 my-2"></div>
          
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Settings size={18} className="text-gray-400" /> Настройки
          </Link>
          <button 
            onClick={signOut} 
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors text-left"
          >
            <LogOut size={18} /> Выход
          </button>
        </div>
      )}
    </div>
  );
}