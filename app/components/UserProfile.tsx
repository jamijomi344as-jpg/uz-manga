'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { 
  User, Bookmark, Heart, Bell, MessageSquare, 
  History, Settings, LogOut, ChevronDown, LogIn 
} from 'lucide-react';

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
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
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 cursor-pointer group"
      >
        <img 
          src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/150'} 
          alt="Avatar" 
          className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-purple-500 transition-all object-cover" 
        />
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-[#151518] border border-gray-800 rounded-xl shadow-2xl py-3 z-[100] animate-in fade-in zoom-in duration-150">
          {/* User Info Section */}
          <div className="px-4 pb-3 mb-2 border-b border-gray-800/50">
            <p className="text-sm font-bold text-white truncate">{user.user_metadata?.full_name || 'Пользователь'}</p>
            <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
          </div>

          <div className="flex flex-col">
            <MenuLink href="/profile" icon={<User size={18}/>} label="Мой профиль" />
            <MenuLink href="/bookmarks" icon={<Bookmark size={18}/>} label="Закладки" />
            <MenuLink href="/favorites" icon={<Heart size={18}/>} label="Избранное" />
            
            <MenuLink href="/notifications" icon={<Bell size={18}/>} label="Уведомления" />
            
            <Link href="/messages" className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <div className="flex items-center gap-3"><MessageSquare size={18}/> Сообщения</div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">1</span>
            </Link>

            <MenuLink href="/history" icon={<History size={18}/>} label="История чтения" />
            
            <div className="h-px bg-gray-800/50 my-2"></div>
            
            <MenuLink href="/settings" icon={<Settings size={18}/>} label="Настройки" />
            
            <button 
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
            >
              <LogOut size={18} /> Выход
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon, label }: { href: string, icon: any, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
      <span className="text-gray-500">{icon}</span>
      {label}
    </Link>
  );
}