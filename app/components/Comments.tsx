'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MessageSquare, Send, Trash2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Comments({ mangaId }: { mangaId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Foydalanuvchini tekshirish
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Sharhlarni yuklash
    fetchComments();
  }, [mangaId]);

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('manga_id', mangaId)
      .order('created_at', { ascending: false });
    if (data) setComments(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert("Sharh qoldirish uchun tizimga kiring!");
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('comments').insert({
      manga_id: mangaId,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || 'Foydalanuvchi',
      user_avatar: user.user_metadata?.avatar_url,
      content: newComment
    });

    if (!error) {
      setNewComment('');
      fetchComments();
    }
    setLoading(false);
  }

  async function deleteComment(id: string) {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) fetchComments();
  }

  return (
    <div className="mt-12 bg-[#151518] rounded-2xl border border-gray-800/60 overflow-hidden">
      <div className="p-6 border-b border-gray-800/50 flex items-center gap-2">
        <MessageSquare className="text-purple-500" size={22} />
        <h3 className="text-xl font-bold text-white">Обсуждение</h3>
        <span className="text-gray-500 text-sm ml-2">({comments.length})</span>
      </div>

      <div className="p-6">
        {/* Sharh yozish qismi */}
        {user ? (
          <form onSubmit={handleSubmit} className="mb-8 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите свое мнение..."
              className="w-full bg-[#0E0E10] border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:border-purple-600 focus:outline-none transition-all min-h-[100px] resize-none"
            />
            <button
              disabled={loading}
              className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        ) : (
          <div className="bg-[#0E0E10] border border-dashed border-gray-800 rounded-xl p-6 text-center mb-8">
            <p className="text-gray-500 text-sm">Чтобы оставить комментарий, пожалуйста, войдите на сайт.</p>
          </div>
        )}

        {/* Sharhlar ro'yxati */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 group">
                <img
                  src={comment.user_avatar || 'https://via.placeholder.com/150'}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-800"
                  alt="avatar"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-white">{comment.user_name}</h4>
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{comment.content}</p>
                  
                  {/* O'z sharhini o'chirish tugmasi */}
                  {user?.id === comment.user_id && (
                    <button 
                      onClick={() => deleteComment(comment.id)}
                      className="mt-2 text-[10px] text-gray-700 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12} /> Удалить
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 opacity-20">
              <MessageSquare size={48} className="mx-auto mb-2" />
              <p>Hozircha hech qanday sharh yo'q.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}