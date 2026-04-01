"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Plus, Check, AlertCircle } from "lucide-react";

// Katalogdagi bilan bir xil bo'lgan tanlovlar ro'yxati
const GENRES = ["Ekshen", "Fantastika", "Syonen", "Romantika", "Sarguzasht", "Isekai", "Tarixiy", "Muzika", "Maktab", "Kultivatsiya", "Reenkarnatsiya", "Aql o'yinlari"];
const TYPES = ["Manxva", "Manxua", "Manga", "Donghua"];
const STATUSES = ["Chiqyapti", "Tugallangan", "To'xtatilgan"];
const RATINGS = ["12+", "16+", "18+"];

export default function AddMangaPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Yangi filtr holatlari
  const [mangaType, setMangaType] = useState("Manxua");
  const [status, setStatus] = useState("Chiqyapti");
  const [ageRating, setAgeRating] = useState("16+");
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Janrlarni tanlash va bekor qilish funksiyasi
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  // Bazaga saqlash
  const handleAddManga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      setMessage("Iltimos, nom va rasm manzilini kiriting!");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.from('mangas').insert([
      { 
        title, 
        description, 
        image_url: imageUrl,
        manga_type: mangaType,
        status,
        age_rating: ageRating,
        release_year: releaseYear,
        // XATO TUZATILDI: Janrlar massivdan matnga o'girildi
        genres: selectedGenres.join(', ') 
      }
    ]);

    if (error) {
      setMessage("Xatolik: " + error.message);
    } else {
      setMessage("✅ Manga bazaga muvaffaqiyatli qo'shildi!");
      // Formani tozalash
      setTitle("");
      setDescription("");
      setImageUrl("");
      setSelectedGenres([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto bg-[#141414] border border-zinc-800 p-8 rounded-2xl shadow-2xl">
