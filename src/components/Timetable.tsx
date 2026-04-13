import { useMemo, useState } from 'react';
import { ScheduledSession, Day, Volunteer } from '../types';
import { formatTime, formatPhone, cn } from '../utils';
import { VOLUNTEERS } from '../data';
import { ChevronDown, Phone, Calendar, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LiquidButton } from './ui/liquid-glass-button';

interface TimetableProps {
  schedule: ScheduledSession[];
}

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Timetable({ schedule }: TimetableProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [filterDay, setFilterDay] = useState<Day | 'All'>('All');

  const sessionsByDay = useMemo(() => {
    const map: Record<string, ScheduledSession[]> = {};
    schedule.forEach(session => {
      if (!map[session.day]) map[session.day] = [];
      map[session.day].push(session);
    });
    Object.keys(map).forEach(day => {
      map[day].sort((a, b) => a.start - b.start);
    });
    return map;
  }, [schedule]);

  const filteredDays = filterDay === 'All' ? DAYS : [filterDay];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Compact Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center px-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar">
          <LiquidButton 
            onClick={() => setFilterDay('All')}
            size="sm"
            className={cn(
              "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
              filterDay === 'All' ? "bg-burgundy text-cream shadow-lg" : "bg-burgundy/5 text-burgundy/40 hover:bg-burgundy/10"
            )}
            aria-label="Show all days"
          >
            All
          </LiquidButton>
          {DAYS.map(day => (
            <LiquidButton 
              key={day}
              onClick={() => setFilterDay(day)}
              size="sm"
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                filterDay === day ? "bg-burgundy text-cream shadow-lg" : "bg-burgundy/5 text-burgundy/40 hover:bg-burgundy/10"
              )}
              aria-label={`Show ${day}`}
            >
              {day.substring(0, 3)}
            </LiquidButton>
          ))}
        </div>

        <div className="relative z-30">
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="glass-card px-4 py-2 rounded-xl shadow-md border border-burgundy/10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-burgundy"
          >
            <span>Key</span>
            <ChevronDown size={12} className={cn("transition-transform", isLegendOpen && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {isLegendOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-48 glass-card rounded-2xl shadow-2xl border border-burgundy/10 p-4 z-40"
              >
                <div className="space-y-2">
                  {VOLUNTEERS.map(v => (
                    <div key={v.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                      <span className="text-[9px] font-bold text-burgundy/80 truncate">{v.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Simplified Vertical Timeline */}
      <div className="space-y-12">
        {filteredDays.map(day => {
          const sessions = sessionsByDay[day] || [];
          if (sessions.length === 0) return null;

          return (
            <div key={day} className="relative pl-6 md:pl-24">
              <div className="absolute left-0 top-0 hidden md:block">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy/30 [writing-mode:vertical-lr] rotate-180 py-4">
                  {day}
                </h2>
              </div>

              <div className="absolute left-[31px] md:left-[103px] top-4 bottom-0 w-[1px] bg-burgundy/10" />

              <div className="space-y-4">
                {sessions.map((session, idx) => {
                  const volunteer = VOLUNTEERS.find(v => v.id === session.volunteer_id);
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative group"
                    >
                      <div 
                        className="absolute -left-[35px] md:-left-[35px] top-6 w-2 h-2 rounded-full z-10 shadow-sm"
                        style={{ backgroundColor: session.volunteer_color }}
                      />

                      <div className="glass-card rounded-3xl p-5 shadow-lg border border-burgundy/5 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-burgundy/[0.01] transition-colors">
                        <div className="shrink-0 min-w-[100px]">
                          <div className="text-sm font-mono font-black text-burgundy">
                            {formatTime(session.start)} — {formatTime(session.end)}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-burgundy/40">Grade {session.grade} • {session.subject}</span>
                          </div>
                          <h3 className="text-lg font-serif italic text-burgundy">{session.volunteer_name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5 text-burgundy/60">
                            <span className="text-[10px] font-mono font-bold tracking-widest">{formatPhone(session.volunteer_phone)}</span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-4">
                          <div className="flex gap-1">
                            {volunteer?.languages.map(lang => (
                              <span key={lang} className="text-[8px] font-black uppercase text-burgundy/20">{lang.substring(0, 2)}</span>
                            ))}
                          </div>
                          <a 
                            href={`tel:${session.volunteer_phone}`}
                            className="w-8 h-8 rounded-xl bg-burgundy/5 flex items-center justify-center text-burgundy/40 hover:bg-burgundy hover:text-cream transition-all"
                          >
                            <Phone size={12} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
