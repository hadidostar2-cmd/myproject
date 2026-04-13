import { motion } from 'motion/react';
import { MoveRight, Sparkles, GraduationCap, Zap, Target, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const features = [
    { title: 'Expert Tutoring', desc: 'Personalized support from AUB\'s top students.', icon: GraduationCap },
    { title: 'Scientific Focus', desc: 'Specialized in Maths, Physics, and Chemistry.', icon: Zap },
    { title: 'Community Driven', desc: 'Building a stronger academic future together.', icon: Target },
    { title: 'Verified Quality', desc: 'Supervised by ACM AUB organizers.', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen w-full bg-cream flex flex-col items-center justify-center relative overflow-hidden px-6 py-20">
      {/* Subtle Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-burgundy/5 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-burgundy/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-5xl w-full relative z-10 flex flex-col items-center text-center space-y-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-burgundy/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-burgundy/40">ACM AUB • Education Project</span>
            <div className="h-[1px] w-12 bg-burgundy/20" />
          </div>

          <h1 className="text-6xl md:text-[120px] font-serif italic text-burgundy leading-[0.85] tracking-tight">
            Empowering <br />
            <span className="text-ink">Through Science</span>
          </h1>

          <p className="text-burgundy/60 text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            A sanctuary for academic excellence, where knowledge is shared and futures are forged.
          </p>
        </motion.div>

        {/* Action Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <button 
            onClick={onEnter}
            className="group relative px-12 py-6 bg-burgundy text-cream rounded-full font-bold uppercase tracking-[0.2em] text-sm shadow-2xl shadow-burgundy/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
          >
            <span className="relative z-10">Enter the Hub</span>
            <MoveRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
            
            {/* Subtle Glow */}
            <div className="absolute inset-0 rounded-full bg-burgundy blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
          </button>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-burgundy/10 w-full"
        >
          {features.map((feature, idx) => (
            <div key={idx} className="space-y-3 text-left md:text-center">
              <div className="w-10 h-10 rounded-2xl bg-burgundy/5 flex items-center justify-center text-burgundy mx-0 md:mx-auto">
                <feature.icon size={20} />
              </div>
              <h3 className="font-bold text-burgundy text-sm uppercase tracking-widest">{feature.title}</h3>
              <p className="text-burgundy/40 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer Micro-details */}
      <div className="absolute bottom-10 left-0 right-0 px-10 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-burgundy/20">
        <span>Est. 2024</span>
        <div className="flex items-center gap-2">
          <Sparkles size={10} />
          <span>ACM AUB Chapter</span>
        </div>
        <span>Beirut, Lebanon</span>
      </div>
    </div>
  );
}
