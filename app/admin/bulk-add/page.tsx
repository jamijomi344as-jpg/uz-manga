'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function BulkAddChapters() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [selectedMangaId, setSelectedMangaId] = useState('');
  const [folderPath, setFolderPath] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [statusLogs, setStatusLogs] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMangas() {
      const { data } = await supabase.from('mangas').select('id, title').order('created_at', { ascending: false });
      if (data) setMangas(data);
    }
    fetchMangas();
  }, []);

  const addLog = (msg: string) => setStatusLogs(prev => [...prev, msg]);

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMangaId || !folderPath) return alert("Manga va Papka manzilini kiriting!");

    setLoading(true);
    setStatusLogs([]);
    addLog("Papkadan PDF fayllar qidirilmoqda...");

    try {
      const bucketName = 'manga-pages'; // O'zingizning Supabase storage bucket nomingiz
      
      // 1. Bazada oldin qo'shilgan boblarni tekshiramiz (Dublikatni oldini olish uchun)
      const { data: existingChapters, error: checkError } = await supabase
        .from('chapters')
        .select('chapter_number')
        .eq('manga_id', selectedMangaId);

      if (checkError) throw checkError;

      // Oldin qo'shilgan bob raqamlarini bitta ro'yxatga yig'ib olamiz (masalan: [1, 2, 3])
      const existingChapterNums = new Set(existingChapters?.map(ch => ch.chapter_number) || []);

      // 2. Papkadagi fayllarni olamiz
      const { data: files, error: storageError } = await supabase
        .storage
        .from(bucketName)
        .list(folderPath, { limit: 500 });

      if (storageError || !files || files.length === 0) {
        throw new Error(`Papka topilmadi yoki bo'sh! ${storageError?.message || ''}`);
      }

      const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
      addLog(`${pdfFiles.length} ta PDF fayl topildi. Tekshirilmoqda...`);

      if (pdfFiles.length === 0) throw new Error("Papkada birorta ham PDF fayl yo'q!");

      const chaptersToInsert = [];
      let skippedCount = 0;

      for (const file of pdfFiles) {
        const match = file.name.match(/\d+(\.\d+)?/);
        
        if (!match) {
          addLog(`DIQQAT: '${file.name}' nomidan raqam topilmadi.`);
          continue;
        }

        const chapterNum = parseFloat(match[0]);

        // ENG ASOSIY JOYI: Agar bu bob raqami bazada bor bo'lsa, o'tkazib yuboramiz!
        if (existingChapterNums.has(chapterNum)) {
          addLog(`⚠️ ${chapterNum}-bob allaqachon bazada bor. O'tkazib yuborildi.`);
          skippedCount++;
          continue;
        }
        
        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${folderPath}/${file.name}`);

        chaptersToInsert.push({
          manga_id: selectedMangaId,
          chapter_number: chapterNum,
          pdf_url: publicUrlData.publicUrl,
        });
      }

      // 3. Faqat YANGI boblarni bazaga yozish
      if (chaptersToInsert.length > 0) {
        addLog("Yangi boblar bazaga yozilmoqda...");
        const { error: dbError } = await supabase.from('chapters').insert(chaptersToInsert);
        
        if (dbError) throw dbError;
        
        addLog(`✅ MUVAFFAQIYATLI! ${chaptersToInsert.length} ta yangi bob qo'shildi!`);
        if (skippedCount > 0) {
          addLog(`ℹ️ ${skippedCount} ta eski bob dublikat bo'lmasligi uchun o'tkazib yuborildi.`);
        }
        setFolderPath('');
      } else {
        addLog(`ℹ️ Papkadagi hamma boblar allaqachon bazada bor ekan. Hech narsa qo'shilmadi.`);
      }

    } catch (err: any) {
      addLog(`❌ XATOLIK: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-200 p-8">
      <div className="max-w-[800px] mx-auto bg-[#151518] p-8 rounded-2xl border border-gray-800 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Barcha Boblarni Avtomatik Qo'shish</h1>
          <Link href="/admin/add" className="text-purple-500 hover:underline">Orqaga</Link>
        </div>
        
        <form onSubmit={handleBulkUpload} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Qaysi asar uchun?</label>
            <select value={selectedMangaId} onChange={e => setSelectedMangaId(e.target.value)} required className="w-full bg-[#0E0E10] border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-600">
              <option value="">-- Mangani tanlang --</option>
              {mangas.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-purple-400 font-bold mb-2">Supabase Papka Manzili</label>
            <input type="text" placeholder="masalan: naruto/pdfs" value={folderPath} onChange={e => setFolderPath(e.target.value)} required className="w-full bg-[#0E0E10] border border-purple-500/50 rounded-xl px-4 py-3 outline-none focus:border-purple-600" />
          </div>

          <div className="bg-green-900/10 border border-green-800/50 p-4 rounded-xl text-sm text-green-400">
            <span className="font-bold">Aqlli tizim:</span> Papkani qayta-qayta yuklasangiz ham, tizim faqat yangi qo'shilgan boblarni topib saqlaydi. Oldin kiritilganlari dublikat bo'lib qolmaydi.
          </div>

          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50">
            {loading ? 'Tekshirilmoqda...' : 'Papkadagi PDF larni bazaga urish'}
          </button>

          {statusLogs.length > 0 && (
            <div className="bg-[#0E0E10] border border-gray-800 p-4 rounded-xl font-mono text-sm h-40 overflow-y-auto custom-scrollbar">
              {statusLogs.map((log, idx) => (
                <div key={idx} className={`mb-1 ${log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : log.includes('⚠️') ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {'>'} {log}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
