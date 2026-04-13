import { useState, useEffect } from 'react';
import { ScheduledSession, Day } from '../types';
import { formatTime, cn } from '../utils';
import { CheckCircle2, Circle, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface CheckInViewProps {
  schedule: ScheduledSession[];
  user: any;
}

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CheckInView({ schedule, user }: CheckInViewProps) {
  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({});
  const [filterDay, setFilterDay] = useState<Day | 'All'>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;

    const fetchCheckins = async () => {
      const { data, error } = await supabase
        .from('checkins')
        .select('session_id')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching checkins:', error);
        return;
      }

      if (data) {
        const checkinMap: Record<string, boolean> = {};
        data.forEach(c => {
          checkinMap[c.session_id] = true;
        });
        setCheckedIn(checkinMap);
      }
    };

    fetchCheckins();
  }, [user]);

  const toggleCheckIn = async (id: string) => {
    if (!user) {
      alert("Please log in to check in.");
      return;
    }

    const isCurrentlyCheckedIn = checkedIn[id];
    
    // Optimistic update
    setCheckedIn(prev => ({ ...prev, [id]: !isCurrentlyCheckedIn }));

    if (isSupabaseConfigured) {
      if (!isCurrentlyCheckedIn) {
        const { error } = await supabase.from('checkins').insert([
          { session_id: id, user_id: user.id }
        ]);
        if (error) {
          console.error('Error checking in:', error);
          // Revert on error
          setCheckedIn(prev => ({ ...prev, [id]: false }));
        }
      } else {
        const { error } = await supabase
          .from('checkins')
          .delete()
          .eq('session_id', id)
          .eq('user_id', user.id);
        if (error) {
          console.error('Error removing checkin:', error);
          // Revert on error
          setCheckedIn(prev => ({ ...prev, [id]: true }));
        }
      }
    }
  };

  const filteredSessions = schedule.filter(s => {
    const matchesDay = filterDay === 'All' || s.day === filterDay;
    const matchesSearch = s.volunteer_name.toLowerCase().includes(search.toLowerCase()) || 
                         s.subject.toLowerCase().includes(search.toLowerCase());
    return matchesDay && matchesSearch;
  }).sort((a, b) => {
    const dayIndexA = DAYS.indexOf(a.day);
    const dayIndexB = DAYS.indexOf(b.day);
    if (dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
    return a.start - b.start;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
        <div className="relative w-full lg:w-[450px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-burgundy/20 group-focus-within:text-burgundy transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search volunteer or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 glass-card rounded-[24px] text-sm font-medium focus:ring-4 focus:ring-burgundy/10 transition-all shadow-xl"
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto no-scrollbar">
          <div className="w-10 h-10 rounded-xl bg-burgundy/5 flex items-center justify-center shrink-0">
            <Filter size={16} className="text-burgundy/40" />
          </div>
          <button 
            onClick={() => setFilterDay('All')}
            className={cn(
              "px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shrink-0 shadow-lg",
              filterDay === 'All' ? "bg-burgundy text-cream shadow-burgundy/20" : "glass-card text-burgundy/40 hover:bg-burgundy/5"
            )}
          >
            All
          </button>
          {DAYS.map(day => (
            <button 
              key={day}
              onClick={() => setFilterDay(day)}
              className={cn(
                "px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shrink-0 shadow-lg",
                filterDay === day ? "bg-burgundy text-cream shadow-burgundy/20" : "glass-card text-burgundy/40 hover:bg-burgundy/5"
              )}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[40px] shadow-[0_40px_80px_-15px_rgba(128,0,32,0.1)] border border-burgundy/5 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-burgundy/5 border-b border-burgundy/10">
                <th className="p-8 text-[10px] font-bold uppercase tracking-[0.3em] text-burgundy/40">Status</th>
                <th className="p-8 text-[10px] font-bold uppercase tracking-[0.3em] text-burgundy/40">Volunteer</th>
                <th className="p-8 text-[10px] font-bold uppercase tracking-[0.3em] text-burgundy/40">Subject</th>
                <th className="p-8 text-[10px] font-bold uppercase tracking-[0.3em] text-burgundy/40">Grade</th>
                <th className="p-8 text-[10px] font-bold uppercase tracking-[0.3em] text-burgundy/40">Time</th>
              </tr>
            </thead>
            <motion.tbody
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {filteredSessions.map((session) => (
                <motion.tr 
                  key={session.id} 
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="border-b border-burgundy/5 last:border-b-0 hover:bg-burgundy/[0.02] transition-colors cursor-pointer group"
                  onClick={() => toggleCheckIn(session.id)}
                >
                  <td className="p-8">
                    <div className="relative">
                      {checkedIn[session.id] ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <CheckCircle2 size={24} className="text-burgundy" />
                        </motion.div>
                      ) : (
                        <Circle size={24} className="text-burgundy/10 group-hover:text-burgundy/30 transition-colors" />
                      )}
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="font-bold text-sm text-burgundy group-hover:translate-x-1 transition-transform duration-300">{session.volunteer_name}</div>
                  </td>
                  <td className="p-8">
                    <span className="px-4 py-2 bg-burgundy/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-burgundy/60">
                      {session.subject}
                    </span>
                  </td>
                  <td className="p-8 text-xs font-mono text-burgundy/40">Grade {session.grade}</td>
                  <td className="p-8">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-burgundy/40">
                      {session.day}, <span className="text-burgundy/60">{formatTime(session.start)}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
        {filteredSessions.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-20 text-center text-burgundy/20 font-serif italic text-2xl"
          >
            No sessions found for the selected criteria.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
