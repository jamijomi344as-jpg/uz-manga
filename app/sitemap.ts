import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://uz-manga-sanz.vercel.app';

  // 1. Asosiy sahifalar
  const routes = ['', '/catalog', '/popular', '/genres', '/new', '/bookmarks'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // 2. Barcha mangalarni bazadan olamiz
  const { data: mangas } = await supabase.from('mangas').select('id');

  const mangaEntries = (mangas || []).map((manga) => ({
    url: `${baseUrl}/manga/${manga.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...mangaEntries];
}