'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { User, Bookmark, History, Settings, LogOut, ChevronDown, Bell, MessageSquare, LogIn } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

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

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  if (!user) {
    return (
      <button 
        onClick={signInWithGoogle} 
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-1.5 rounded-full transition-all text-sm font-medium"
      >
        <LogIn size={16} className="text-purple-500" />
        Войти
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 cursor-pointer group">
        <img 
          src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/150'} 
          alt="User avatar" 
          className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-purple-500 transition-all object-cover" 
        />
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-[#151518] border border-gray-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
          <div className="px-4 py-3 border-b border-gray-800/60 mb-2">
            <p className="text-sm font-bold text-white truncate">{user.user_metadata?.full_name || 'Пользователь'}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
          </div>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <User size={18} className="text-gray-400" /> Мой профиль
          </Link>
          <Link href="/bookmarks" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Bookmark size={18} className="text-gray-400" /> Закладки
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors text-left">
            <LogOut size={18} /> Выход
          </button>
        </div>
      )}
    </div>
  );
}