import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  FileText, 
  User, 
  Timer, 
  Send, 
  X,
  MessageSquare,
  Trophy,
  Zap,
  Loader2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BlogPost } from '../types';
import { cn } from '../utils';

interface BlogEventsViewProps {
  user: any;
}

export default function BlogEventsView({ user }: BlogEventsViewProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'blog' | 'event'>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'blog' | 'event'>('blog');
  const [eventDate, setEventDate] = useState('');

  const isTutor = user?.user_metadata?.role === 'tutor' || user?.email?.includes('admin');

  useEffect(() => {
    fetchPosts();
    
    if (isSupabaseConfigured) {
      const subscription = supabase
        .channel('public:posts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
        .subscribe();
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const fetchPosts = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !user) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from('posts').insert([
        {
          title,
          content,
          type,
          author_id: user.id,
          author_name: user.email.split('@')[0],
          event_date: type === 'event' ? eventDate : null,
        }
      ]);

      if (error) throw error;
      
      setIsAdding(false);
      setTitle('');
      setContent('');
      setEventDate('');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Make sure the "posts" table exists in your Supabase database.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(p => filter === 'all' || p.type === filter);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif italic text-burgundy mb-2">Blog & Events</h1>
          <p className="text-burgundy/40 font-medium">Stay updated with the latest news and upcoming sessions</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-burgundy/5 p-1 rounded-2xl border border-burgundy/10">
            {(['all', 'blog', 'event'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  filter === f 
                    ? "bg-burgundy text-cream shadow-lg" 
                    : "text-burgundy/40 hover:text-burgundy"
                )}
              >
                {f}s
              </button>
            ))}
          </div>

          {isTutor && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-burgundy text-cream p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
              aria-label="Add new post or event"
            >
              <Plus size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-burgundy" size={40} />
          <p className="text-burgundy/40 font-mono text-xs uppercase tracking-widest">Loading updates...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-[40px] border-dashed border-2 border-burgundy/10">
          <MessageSquare size={48} className="mx-auto text-burgundy/10 mb-4" />
          <p className="text-burgundy/40 font-medium italic">No posts yet. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group"
              >
                <div className="glass-card h-full rounded-[40px] p-8 border border-burgundy/5 hover:border-burgundy/20 transition-all hover:shadow-2xl relative overflow-hidden">
                  {/* Type Badge */}
                  <div className={cn(
                    "absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                    post.type === 'event' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {post.type === 'event' ? <Zap size={10} /> : <FileText size={10} />}
                    {post.type}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-burgundy leading-tight group-hover:text-burgundy/80 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-burgundy/40 uppercase tracking-widest">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>{post.author_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer size={12} />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-ink/60 text-sm leading-relaxed line-clamp-4">
                      {post.content}
                    </p>

                    {post.type === 'event' && post.event_date && (
                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-cream shadow-lg">
                          <CalendarIcon size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Event Date</p>
                          <p className="text-sm font-bold text-amber-700">{new Date(post.event_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-burgundy/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-xl w-full glass-card p-10 rounded-[50px] shadow-2xl relative z-10 border border-burgundy/10"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-8 right-8 text-burgundy/20 hover:text-burgundy transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-serif italic text-burgundy mb-2">Create New Post</h2>
                <p className="text-burgundy/40 text-sm font-medium">Share updates or schedule an event</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex bg-burgundy/5 p-1 rounded-2xl border border-burgundy/10">
                  {(['blog', 'event'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                        type === t 
                          ? "bg-burgundy text-cream shadow-lg" 
                          : "text-burgundy/40 hover:text-burgundy"
                      )}
                    >
                      {t === 'event' ? <Zap size={14} /> : <FileText size={14} />}
                      {t}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Post Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-burgundy/5 border border-burgundy/10 rounded-2xl py-4 px-6 text-burgundy font-bold placeholder:text-burgundy/20 focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                    required
                  />

                  {type === 'event' && (
                    <div className="relative">
                      <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-burgundy/20" size={18} />
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-burgundy/5 border border-burgundy/10 rounded-2xl py-4 pl-14 pr-6 text-burgundy font-bold focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                        required
                      />
                    </div>
                  )}

                  <textarea
                    placeholder="Write your content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full bg-burgundy/5 border border-burgundy/10 rounded-3xl py-4 px-6 text-burgundy placeholder:text-burgundy/20 focus:outline-none focus:ring-2 focus:ring-burgundy/20 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-burgundy text-cream py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Publish Post
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
