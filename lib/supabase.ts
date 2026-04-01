import { createClient } from '@supabase/supabase-js';

// Vercel va Local muhit uchun kalitlarni tekshirish
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase kalitlari topilmadi!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
