import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ScheduledSession, Volunteer } from '../types';
import { motion } from 'motion/react';

interface StatsViewProps {
  schedule: ScheduledSession[];
  volunteers: Volunteer[];
}

const COLORS = ['#800020', '#2D000B', '#A52A2A', '#D2691E', '#8B4513', '#A0522D', '#CD853F'];

export default function StatsView({ schedule, volunteers }: StatsViewProps) {
  const hoursByVolunteer = useMemo(() => {
    const data: Record<string, number> = {};
    schedule.forEach(session => {
      data[session.volunteer_name] = (data[session.volunteer_name] || 0) + 1;
    });
    return Object.entries(data).map(([name, hours]) => ({ name, hours }));
  }, [schedule]);

  const subjectDistribution = useMemo(() => {
    const data: Record<string, number> = {};
    schedule.forEach(session => {
      data[session.subject] = (data[session.subject] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [schedule]);

  const gradeDistribution = useMemo(() => {
    const data: Record<string, number> = {};
    schedule.forEach(session => {
      const key = `Grade ${session.grade}`;
      data[key] = (data[key] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [schedule]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Hours per Volunteer */}
        <motion.div variants={itemVariants} className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl border border-burgundy/5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 md:mb-10 text-burgundy/40 font-sans">Hours Distribution</h3>
          <div className="h-[300px] md:h-[350px] min-h-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={hoursByVolunteer}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#80002010" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#800020', opacity: 0.4, fontWeight: 'bold' }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#800020', opacity: 0.4, fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFDD0', border: '1px solid rgba(128,0,32,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#800020', fontSize: '11px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#800020', opacity: 0.4, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Bar dataKey="hours" fill="#800020" radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Coverage */}
        <motion.div variants={itemVariants} className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl border border-burgundy/5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 md:mb-10 text-burgundy/40 font-sans">Subject Coverage</h3>
          <div className="h-[300px] md:h-[350px] min-h-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFDD0', border: '1px solid rgba(128,0,32,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#800020', fontSize: '11px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center mt-4 md:mt-6">
            {subjectDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 md:gap-3">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight text-burgundy/60">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Grade Distribution */}
      <motion.div variants={itemVariants} className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl border border-burgundy/5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 md:mb-10 text-burgundy/40 font-sans">Grade Level Focus</h3>
        <div className="h-[200px] md:h-[250px] min-h-0 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={gradeDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#80002010" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#800020', opacity: 0.4, fontWeight: 'bold' }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFDD0', border: '1px solid rgba(128,0,32,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#800020', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Bar dataKey="value" fill="#800020" radius={[0, 8, 8, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
