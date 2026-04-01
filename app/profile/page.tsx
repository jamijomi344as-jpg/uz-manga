'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft, User, Mail, ShieldCheck } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
  }, []);

  if (!user) return <div className="min-h-screen bg-[#0E0E10] text-white flex items-center justify-center">Iltimos, tizimga kiring.</div>;

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white p-8 font-sans">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"><ArrowLeft size={18}/> Asosiyga qaytish</Link>
      
      <div className="max-w-2xl mx-auto bg-[#151518] p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <h1 className="text-2xl font-black mb-8 flex items-center gap-2 border-b border-gray-800 pb-4"><User className="text-purple-500"/> Shaxsiy Kabinet</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/150'} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-purple-600 object-cover shadow-[0_0_20px_rgba(147,51,234,0.4)]" />
          
          <div className="space-y-4 w-full">
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1">To'liq ismingiz</span>
              <div className="font-bold text-lg">{user.user_metadata?.full_name || 'Kiritilmagan'}</div>
            </div>
            
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-gray-800 flex items-center gap-3">
              <Mail className="text-gray-500" size={20} />
              <div>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1">Elektron pochta</span>
                <div className="font-bold">{user.email}</div>
              </div>
            </div>

            <div className="bg-green-500/10 text-green-500 p-4 rounded-xl border border-green-500/20 flex items-center gap-3">
              <ShieldCheck size={20} />
              <span className="font-bold text-sm">Google orqali himoyalangan va tasdiqlangan hisob</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}