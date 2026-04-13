import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, User, BookOpen, ExternalLink, Calendar, CheckCircle2, Plus, X, Filter } from 'lucide-react';
import { Volunteer, Day, Video, Subject, Grade, Language } from '../types';
import { formatTime, cn } from '../utils';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface VideosViewProps {
  volunteers: Volunteer[];
  user: SupabaseUser | null;
}

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SUBJECTS: Subject[] = ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Arabic', 'French'];
const GRADES: Grade[] = ['9', '10', '11', '12'];
const LANGUAGES: Language[] = ['EN', 'FR'];

export default function VideosView({ volunteers, user }: VideosViewProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSubject, setFilterSubject] = useState<Subject | 'All'>('All');
  const [filterGrade, setFilterGrade] = useState<Grade | 'All'>('All');
  const [filterLanguage, setFilterLanguage] = useState<Language | 'All'>('All');

  // Form state
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [subject, setSubject] = useState<Subject>('Maths');
  const [grade, setGrade] = useState<Grade>('12');
  const [language, setLanguage] = useState<Language>('EN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTutor = user?.user_metadata?.role === 'tutor' || user?.user_metadata?.role === 'admin';

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*, users(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedVideos = data.map(v => ({
        ...v,
        author_name: v.users?.name || 'Unknown Tutor'
      }));
      
      setVideos(formattedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('videos').insert([
        {
          title,
          url,
          subject,
          grade,
          language,
          type: 'problem_solving',
          uploaded_by: user.id
        }
      ]);

      if (error) throw error;

      setShowAddModal(false);
      setTitle('');
      setUrl('');
      fetchVideos();
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVideos = videos.filter(v => {
    if (filterSubject !== 'All' && v.subject !== filterSubject) return false;
    if (filterGrade !== 'All' && v.grade !== filterGrade) return false;
    if (filterLanguage !== 'All' && v.language !== filterLanguage) return false;
    return true;
  });

  // Helper to extract YouTube ID for thumbnail
  const getYoutubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop';
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto">
      {/* Videos Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 gap-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-serif italic text-burgundy">Video Library</h2>
            <p className="text-burgundy/40 text-sm font-medium">Watch and learn from our expert volunteers</p>
          </div>
          {isTutor && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="glass-card px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-burgundy hover:bg-burgundy hover:text-cream transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add Video
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 px-4">
          <select 
            value={filterSubject} 
            onChange={(e) => setFilterSubject(e.target.value as Subject | 'All')}
            className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-burgundy border-none focus:ring-2 focus:ring-burgundy/20 outline-none"
            aria-label="Filter by Subject"
          >
            <option value="All">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={filterGrade} 
            onChange={(e) => setFilterGrade(e.target.value as Grade | 'All')}
            className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-burgundy border-none focus:ring-2 focus:ring-burgundy/20 outline-none"
            aria-label="Filter by Grade"
          >
            <option value="All">All Grades</option>
            {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          <select 
            value={filterLanguage} 
            onChange={(e) => setFilterLanguage(e.target.value as Language | 'All')}
            className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-burgundy border-none focus:ring-2 focus:ring-burgundy/20 outline-none"
            aria-label="Filter by Language"
          >
            <option value="All">All Languages</option>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-burgundy/20 border-t-burgundy rounded-full animate-spin" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-[40px] border border-burgundy/5">
            <BookOpen size={48} className="mx-auto text-burgundy/20 mb-4" />
            <h3 className="text-xl font-serif italic text-burgundy mb-2">No videos found</h3>
            <p className="text-burgundy/40 text-sm">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video, idx) => (
              <motion.a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-[40px] overflow-hidden shadow-2xl border border-burgundy/5 group block"
              >
                <div className="relative aspect-video overflow-hidden bg-burgundy/5">
                  <img 
                    src={getYoutubeThumbnail(video.url)} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-burgundy/20 group-hover:bg-burgundy/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-cream/90 flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                      <Play size={24} className="text-burgundy fill-burgundy ml-1" />
                    </div>
                  </div>
                  {video.language && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase">
                      {video.language}
                    </div>
                  )}
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="px-3 py-1 bg-burgundy/5 rounded-full text-[9px] font-black uppercase tracking-widest text-burgundy/40">
                      Grade {video.grade}
                    </div>
                    <div className="flex items-center gap-1.5 text-burgundy/40">
                      <BookOpen size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">{video.subject}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-burgundy leading-tight group-hover:text-burgundy/70 transition-colors line-clamp-2">
                    {video.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-burgundy/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy font-bold text-[10px]">
                        {video.author_name?.charAt(0) || 'T'}
                      </div>
                      <span className="text-xs font-bold text-burgundy/60 truncate max-w-[120px]">{video.author_name}</span>
                    </div>
                    <ExternalLink size={16} className="text-burgundy/20 group-hover:text-burgundy transition-colors shrink-0" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </section>

      {/* Capabilities Table Section */}
      <section className="space-y-8">
        <div className="space-y-1 px-4">
          <h2 className="text-4xl font-serif italic text-burgundy">Volunteer Capabilities</h2>
          <p className="text-burgundy/40 text-sm font-medium">Available session types for each volunteer</p>
        </div>

        <div className="glass-card rounded-[50px] shadow-2xl border border-burgundy/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-burgundy/5 border-b border-burgundy/10">
                  <th className="p-8 font-serif italic text-burgundy font-bold text-lg sticky left-0 bg-cream/90 backdrop-blur-md z-10">Volunteer</th>
                  <th className="p-8 text-center font-mono text-[10px] text-burgundy/40 uppercase tracking-[0.3em]">
                    Problem Solving
                  </th>
                  <th className="p-8 text-center font-mono text-[10px] text-burgundy/40 uppercase tracking-[0.3em]">
                    Review Sessions
                  </th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v, idx) => (
                  <motion.tr 
                    key={v.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-burgundy/5 last:border-b-0 hover:bg-burgundy/[0.02] transition-colors group"
                  >
                    <td className="p-8 sticky left-0 bg-cream/90 backdrop-blur-md z-10 group-hover:bg-burgundy/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center text-cream font-bold text-xs shrink-0" style={{ backgroundColor: v.color }}>
                          {v.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-burgundy whitespace-nowrap">{v.name}</p>
                          <p className="text-[10px] text-burgundy/40 uppercase tracking-widest font-mono">{v.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {v.can_problem_solve !== false ? (
                        <div className="flex justify-center">
                          <CheckCircle2 size={20} className="text-green-600" />
                        </div>
                      ) : (
                        <div className="text-burgundy/10 flex justify-center">
                          <X size={20} className="text-red-400/50" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {v.can_review !== false ? (
                        <div className="flex justify-center">
                          <CheckCircle2 size={20} className="text-green-600" />
                        </div>
                      ) : (
                        <div className="text-burgundy/10 flex justify-center">
                          <X size={20} className="text-red-400/50" />
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add Video Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-[40px] shadow-2xl border border-burgundy/10 overflow-hidden"
            >
              <div className="p-8 border-b border-burgundy/10 flex items-center justify-between bg-burgundy/5">
                <h3 className="text-2xl font-serif italic text-burgundy">Add New Video</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy hover:bg-burgundy hover:text-cream transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddVideo} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-burgundy/60 mb-2">Video Title</label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-burgundy/5 border border-burgundy/10 text-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                      placeholder="e.g. Solving Grade 12 Physics: Mechanics"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-burgundy/60 mb-2">Video URL (YouTube)</label>
                    <input 
                      type="url" 
                      required
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-burgundy/5 border border-burgundy/10 text-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-burgundy/60 mb-2">Subject</label>
                      <select 
                        value={subject}
                        onChange={e => setSubject(e.target.value as Subject)}
                        className="w-full px-4 py-3 rounded-xl bg-burgundy/5 border border-burgundy/10 text-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                      >
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-burgundy/60 mb-2">Grade</label>
                      <select 
                        value={grade}
                        onChange={e => setGrade(e.target.value as Grade)}
                        className="w-full px-4 py-3 rounded-xl bg-burgundy/5 border border-burgundy/10 text-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                      >
                        {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-burgundy/60 mb-2">Language</label>
                    <select 
                      value={language}
                      onChange={e => setLanguage(e.target.value as Language)}
                      className="w-full px-4 py-3 rounded-xl bg-burgundy/5 border border-burgundy/10 text-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                    >
                      {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-burgundy text-cream font-black uppercase tracking-widest text-xs hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Uploading...' : 'Publish Video'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
