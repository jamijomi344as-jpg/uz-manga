'use client';

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ViewTracker({ mangaId, currentViews }: { mangaId: string, currentViews: number }) {
  useEffect(() => {
    async function incrementView() {
      // Bitta brauzerdan 1 marta kirganda sanashi uchun xotirani tekshiramiz
      const viewed = sessionStorage.getItem(`viewed_${mangaId}`);
      
      if (!viewed) {
        // Agar birinchi marta kirayotgan bo'lsa, bazaga +1 qo'shamiz
        const { error } = await supabase
          .from('mangas')
          .update({ views: (currentViews || 0) + 1 })
          .eq('id', mangaId);
          
        if (!error) {
          // Xotiraga yozib qo'yamiz (sahifani yangilasa yana +1 bo'lib ketmasligi uchun)
          sessionStorage.setItem(`viewed_${mangaId}`, 'true');
        }
      }
    }
    
    incrementView();
  }, [mangaId, currentViews]);

  return null; // Bu kod ekranda hech narsa chiqarmaydi, faqat orqa fonda ishlaydi
}