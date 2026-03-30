import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Star } from "lucide-react";

export default async function HomePage() {
  const { data: mangas } = await supabase.from('mangas').select('*').order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8 border-l-4 border-[#6E3FD1] pl-4">SO'NGGI YANGILANISHLAR</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {mangas?.map((manga) => (
            <Link key={manga.id} href={`/manga/${manga.id}`} className="group relative">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-zinc-800">
                <img src={manga.image_url} alt={manga.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-black/80 text-[#4CD964] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                  <Star size={12} fill="#4CD964" /> 9.4
                </div>
              </div>
              <h2 className="font-bold text-sm leading-tight group-hover:text-[#6E3FD1] transition-colors line-clamp-2">{manga.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}