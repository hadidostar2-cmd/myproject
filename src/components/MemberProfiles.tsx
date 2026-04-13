import { Volunteer } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, GraduationCap, BookOpen, Copy, Check, X, Languages, Target, Calendar } from 'lucide-react';
import { useState } from 'react';
import { formatPhone, cn } from '../utils';
import { LiquidButton } from './ui/liquid-glass-button';

interface MemberProfilesProps {
  volunteers: Volunteer[];
}

export default function MemberProfiles({ volunteers }: MemberProfilesProps) {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const handleCopyPhone = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    const formatted = formatPhone(phone);
    navigator.clipboard.writeText(formatted);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      <AnimatePresence>
        {copiedPhone && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-burgundy text-cream px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
          >
            <Check size={16} className="text-green-400" />
            <span className="text-sm font-bold tracking-wide">Phone number copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {selectedVolunteer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVolunteer(null)}
              className="absolute inset-0 bg-burgundy/20 backdrop-blur-xl"
            />
            <motion.div
              layoutId={`card-${selectedVolunteer.id}`}
              className="bg-cream w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[48px] shadow-2xl border border-burgundy/10 relative z-10 no-scrollbar"
            >
              <LiquidButton 
                onClick={() => setSelectedVolunteer(null)}
                size="icon"
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-burgundy/5 flex items-center justify-center text-burgundy hover:bg-burgundy/10 transition-colors z-20"
              >
                <X size={24} />
              </LiquidButton>

              <div className="p-8 md:p-16 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 bg-burgundy text-cream rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {selectedVolunteer.role}
                    </span>
                    <div className="h-[1px] flex-1 bg-burgundy/10" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-serif italic text-burgundy tracking-tight">
                    {selectedVolunteer.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-burgundy/40">
                        <Target size={14} /> About
                      </h4>
                      <p className="text-xl text-burgundy/70 leading-relaxed italic font-medium">
                        "{selectedVolunteer.description}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-burgundy/40">
                        <Languages size={14} /> Languages
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedVolunteer.languages.map(lang => (
                          <span key={lang} className="px-6 py-3 bg-burgundy/5 rounded-2xl text-sm font-bold text-burgundy">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-burgundy/40">
                        <BookOpen size={14} /> Academic Focus
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(selectedVolunteer.subjects).map(([grade, subjects]) => (
                          <div key={grade} className="p-6 bg-white rounded-3xl border border-burgundy/5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-burgundy/30 mb-2">Grade {grade}</p>
                            <div className="flex flex-wrap gap-2">
                              {subjects.map(sub => (
                                <span key={sub} className="text-sm font-bold text-burgundy">{sub}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-burgundy/40">
                        <Calendar size={14} /> Weekly Commitment
                      </h4>
                      <div className="p-6 bg-burgundy text-cream rounded-3xl shadow-xl shadow-burgundy/20 flex items-center justify-between">
                        <span className="text-sm font-medium opacity-60">Target Hours</span>
                        <span className="text-2xl font-serif italic">{selectedVolunteer.target_hours}h / week</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-burgundy/5 flex flex-col md:flex-row gap-6">
                  <LiquidButton 
                    onClick={(e) => handleCopyPhone(e, selectedVolunteer.phone)}
                    size="lg"
                    className="flex-1 bg-burgundy text-cream py-6 rounded-[32px] flex items-center justify-center gap-4 hover:bg-ink transition-all shadow-2xl shadow-burgundy/20 active:scale-95"
                  >
                    {copiedPhone === selectedVolunteer.phone ? <Check size={20} /> : <Phone size={20} />}
                    <span className="text-lg font-bold uppercase tracking-widest">
                      {copiedPhone === selectedVolunteer.phone ? 'Copied!' : formatPhone(selectedVolunteer.phone)}
                    </span>
                  </LiquidButton>
                  <LiquidButton 
                    asChild
                    size="lg"
                    className="h-20 px-12 rounded-[32px] border-2 border-burgundy/10 flex items-center justify-center text-burgundy hover:bg-burgundy/5 transition-colors gap-4"
                  >
                    <a href={`mailto:${selectedVolunteer.email || 'contact@example.com'}`}>
                      <Mail size={24} />
                      <span className="font-bold uppercase tracking-widest">Send Email</span>
                    </a>
                  </LiquidButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {volunteers.map((volunteer) => (
          <motion.div
            key={volunteer.id}
            layoutId={`card-${volunteer.id}`}
            onClick={() => setSelectedVolunteer(volunteer)}
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card rounded-[40px] p-10 space-y-8 shadow-xl border border-burgundy/5 relative overflow-hidden group cursor-pointer transition-all hover:shadow-2xl hover:shadow-burgundy/10"
          >
            {/* Minimal Accent */}
            <div 
              className="absolute top-0 left-0 w-full h-2 opacity-60"
              style={{ backgroundColor: volunteer.color }}
            />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-burgundy/40 text-[10px] font-bold uppercase tracking-[0.3em]">{volunteer.role}</span>
                <div className="flex gap-2">
                  {volunteer.languages.slice(0, 2).map(lang => (
                    <span key={lang} className="px-3 py-1 bg-burgundy/5 rounded-full text-[9px] font-bold uppercase text-burgundy/40">{lang}</span>
                  ))}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-burgundy tracking-tight group-hover:text-ink transition-colors">{volunteer.name}</h3>
              <p className="text-burgundy/60 text-sm leading-relaxed font-medium line-clamp-2 italic">
                "{volunteer.description}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-burgundy/5">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-burgundy/30 font-bold">Expertise</p>
                <div className="flex items-center gap-2">
                  <GraduationCap size={14} className="text-burgundy/40" />
                  <p className="text-xs font-bold text-burgundy/70">Science</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-burgundy/30 font-bold">Commitment</p>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-burgundy/40" />
                  <p className="text-xs font-bold text-burgundy/70">{volunteer.target_hours}h / week</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-burgundy/40 group-hover:text-burgundy transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-widest">View Full Profile</span>
              <Target size={16} className="opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
