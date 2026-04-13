import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, XCircle, BookOpen } from 'lucide-react';
import { Volunteer, Subject } from '../types';

interface CourseCoverageProps {
  volunteers: Volunteer[];
}

const SUBJECTS: Subject[] = ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Arabic', 'French'];
const GRADES = ['9', '10', '11', '12'];

export default function CourseCoverage({ volunteers }: CourseCoverageProps) {
  const coverageData = SUBJECTS.map(subject => {
    const gradesCovered = GRADES.filter(grade => 
      volunteers.some(v => v.subjects[grade as keyof typeof v.subjects]?.includes(subject))
    );
    
    const status = gradesCovered.length === GRADES.length ? 'full' : gradesCovered.length > 0 ? 'partial' : 'none';
    
    return {
      subject,
      gradesCovered,
      status
    };
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="space-y-2 px-4">
        <h2 className="text-4xl font-serif italic text-burgundy">Course Coverage</h2>
        <p className="text-burgundy/40 text-sm font-medium uppercase tracking-widest">Academic support availability across grades 9-12</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coverageData.map((item, idx) => (
          <motion.div
            key={item.subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card rounded-[40px] p-8 border border-burgundy/5 shadow-xl hover:shadow-2xl transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-burgundy/5 flex items-center justify-center text-burgundy group-hover:bg-burgundy group-hover:text-cream transition-all">
                <BookOpen size={24} />
              </div>
              <div className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                item.status === 'full' ? "bg-green-500/10 text-green-600" : 
                item.status === 'partial' ? "bg-amber-500/10 text-amber-600" : 
                "bg-red-500/10 text-red-600"
              )}>
                {item.status === 'full' && <CheckCircle2 size={12} />}
                {item.status === 'partial' && <AlertCircle size={12} />}
                {item.status === 'none' && <XCircle size={12} />}
                {item.status} coverage
              </div>
            </div>

            <h3 className="text-2xl font-serif italic text-burgundy mb-4">{item.subject}</h3>
            
            <div className="flex gap-2">
              {GRADES.map(grade => {
                const isCovered = item.gradesCovered.includes(grade);
                return (
                  <div 
                    key={grade}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-center text-[10px] font-black transition-all",
                      isCovered ? "bg-burgundy text-cream shadow-lg" : "bg-burgundy/5 text-burgundy/20"
                    )}
                  >
                    G{grade}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
