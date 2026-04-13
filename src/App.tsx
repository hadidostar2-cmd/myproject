import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Users, 
  User,
  BarChart3, 
  CheckCircle2, 
  ChevronDown, 
  Menu, 
  X,
  GraduationCap,
  Timer as TimerIcon,
  ArrowRight,
  Mail,
  Phone as PhoneIcon,
  Info,
  Video,
  Settings,
  Moon,
  Sun,
  Zap,
  Target,
  ShieldCheck,
  Lock,
  Sparkles,
  MessageSquare,
  Layout,
  UserCircle,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';
import { VOLUNTEERS } from './data';
import { generateSchedule } from './scheduler';
import Timetable from './components/Timetable';
import MemberProfiles from './components/MemberProfiles';
import StatsView from './components/StatsView';
import CheckInView from './components/CheckInView';
import ChatWidget from './components/ChatWidget';
import VideosView from './components/VideosView';
import CourseCoverage from './components/CourseCoverage';
import Login from './components/Login';
import BlogEventsView from './components/BlogEventsView';
import ProfileView from './components/ProfileView';
import { useActiveUsers } from './hooks/useActiveUsers';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { BackgroundPaths } from './components/ui/background-paths';
import { CardCanvas, Card } from './components/ui/animated-glow-card';
import { Hero } from './components/Hero';
import { XCard } from './components/ui/x-gradient-card';
import { Hero3D } from './components/Hero3D';
import { Entropy } from './components/ui/entropy';

type View = 'timetable' | 'profiles' | 'stats' | 'checkin' | 'inquiry' | 'videos' | 'settings' | 'coverage' | 'login' | 'blog' | 'profile';
type Theme = 'light' | 'dark';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [activeView, setActiveView] = useState<View>('timetable');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isManagementExpanded, setIsManagementExpanded] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [showParticles, setShowParticles] = useState(false);
  const [user, setUser] = useState<any>(null);
  const activeUsers = useActiveUsers(user);

  const schedule = useMemo(() => generateSchedule(VOLUNTEERS), []);

  useEffect(() => {
    // Mobile viewport height fix
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', setAppHeight);
    setAppHeight();

    document.documentElement.setAttribute('data-theme', theme);
    return () => window.removeEventListener('resize', setAppHeight);
  }, [theme]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const missing = [];
      if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
      if (!process.env.SUPABASE_ANON_KEY) missing.push('SUPABASE_ANON_KEY');
      console.warn(`Supabase is not configured. Missing: ${missing.join(', ')}. Please add them to Secrets.`);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    setShowParticles(true);
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    setTimeout(() => setShowParticles(false), 1000);
  };

  const navItems = [
    { id: 'timetable', label: 'Weekly Schedule', icon: Calendar },
    { id: 'profiles', label: 'Member Profiles', icon: Users },
    { id: 'coverage', label: 'Course Coverage', icon: ShieldCheck },
    { id: 'videos', label: 'Problem Solving', icon: Video },
    { id: 'blog', label: 'Blog & Events', icon: MessageSquare },
  ];

  const stats = [
    { label: 'Active Mentors', value: VOLUNTEERS.length, icon: Users },
    { label: 'Available Hours', value: VOLUNTEERS.reduce((acc, v) => acc + v.target_hours, 0), icon: TimerIcon },
    { label: 'Subjects Covered', value: 7, icon: GraduationCap },
    { label: 'Active Students', value: activeUsers, icon: CheckCircle2 },
  ];

  const features = [
    { title: 'Expert Tutoring', desc: 'Personalized support from AUB\'s top students.', icon: GraduationCap },
    { title: 'Scientific Focus', desc: 'Specialized in Maths, Physics, and Chemistry.', icon: Zap },
    { title: 'Community Driven', desc: 'Building a stronger academic future together.', icon: Target },
    { title: 'Verified Quality', desc: 'Supervised by ACM AUB organizers.', icon: ShieldCheck },
  ];

  return (
    <AnimatePresence mode="wait">
      {!hasEntered ? (
        <motion.div 
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="min-h-screen w-full relative"
        >
          <Hero3D onEnter={() => setHasEntered(true)} />
          <div className="relative z-10 flex items-center justify-center min-h-screen pointer-events-none">
            <div className="pointer-events-auto">
              <Hero onEnter={() => setHasEntered(true)} />
            </div>
          </div>
          <ChatWidget />
        </motion.div>
      ) : (
        <motion.div 
          key="main-app"
          initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative overflow-hidden"
        >
          {/* Particle Overlay for Theme Change */}
          <AnimatePresence>
            {showParticles && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] pointer-events-none"
              >
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: Math.random() * window.innerHeight,
                      scale: 0,
                      opacity: 1
                    }}
                    animate={{ 
                      y: Math.random() * window.innerHeight - 200,
                      x: Math.random() * window.innerWidth,
                      scale: Math.random() * 2,
                      opacity: 0,
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute w-4 h-4 bg-burgundy rounded-full"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex h-screen bg-cream text-ink font-sans overflow-hidden transition-colors duration-500">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden md:flex bg-burgundy text-cream flex-col border-r border-burgundy/10 z-50 shadow-2xl transition-colors duration-500"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-cream rounded-sm flex items-center justify-center">
                <span className="text-burgundy font-bold text-xs">ACM</span>
              </div>
              <span className="font-bold tracking-tight text-lg">EDUCATION PROJECT</span>
            </motion.div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-cream/10 rounded-sm transition-colors cursor-pointer"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all duration-200 group cursor-pointer",
                activeView === item.id 
                  ? "bg-cream text-burgundy shadow-lg" 
                  : "hover:bg-cream/5 text-cream/60 hover:text-cream",
                item.id === 'login' && !user && "mt-4 bg-black/20 border border-cream/20 animate-pulse"
              )}
            >
              <item.icon size={20} className={cn(activeView === item.id ? "text-burgundy" : "text-inherit")} />
              {isSidebarOpen && (
                <span className="font-medium">
                  {item.id === 'login' && user ? 'My Account' : item.label}
                </span>
              )}
            </button>
          ))}

          {/* Management Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsManagementExpanded(!isManagementExpanded)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-200 group cursor-pointer",
                (activeView === 'stats' || activeView === 'checkin')
                  ? "bg-cream/10 text-cream" 
                  : "hover:bg-cream/5 text-cream/60 hover:text-cream"
              )}
            >
              <div className="flex items-center gap-4">
                <BarChart3 size={20} />
                {isSidebarOpen && <span className="font-medium">Management</span>}
              </div>
              {isSidebarOpen && (
                <ChevronDown 
                  size={16} 
                  className={cn("transition-transform duration-200", isManagementExpanded && "rotate-180")} 
                />
              )}
            </button>
            
            <AnimatePresence>
              {isManagementExpanded && isSidebarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-12 space-y-1"
                >
                  <button 
                    onClick={() => setActiveView('checkin')}
                    className={cn(
                      "w-full text-left py-2 text-sm transition-colors cursor-pointer",
                      activeView === 'checkin' ? "text-cream font-bold underline underline-offset-4" : "text-cream/60 hover:text-cream"
                    )}
                  >
                    Session Check-in
                  </button>
                  <button 
                    onClick={() => setActiveView('stats')}
                    className={cn(
                      "w-full text-left py-2 text-sm transition-colors cursor-pointer",
                      activeView === 'stats' ? "text-cream font-bold underline underline-offset-4" : "text-cream/60 hover:text-cream"
                    )}
                  >
                    Analytics
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setActiveView('inquiry')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all duration-200 group cursor-pointer",
              activeView === 'inquiry' 
                ? "bg-cream text-burgundy shadow-lg" 
                : "hover:bg-cream/5 text-cream/60 hover:text-cream"
            )}
          >
            <Info size={20} className={cn(activeView === 'inquiry' ? "text-burgundy" : "text-inherit")} />
            {isSidebarOpen && <span className="font-medium">Inquiries</span>}
          </button>

          <div className="pt-8 space-y-2">
            <div className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-cream/30 mb-2">System</div>
            <button
              onClick={() => setActiveView('settings')}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all duration-200 group cursor-pointer",
                activeView === 'settings' 
                  ? "bg-cream text-burgundy shadow-lg" 
                  : "hover:bg-cream/5 text-cream/60 hover:text-cream"
              )}
            >
              <Settings size={20} className={cn(activeView === 'settings' ? "text-burgundy" : "text-inherit")} />
              {isSidebarOpen && <span className="font-medium">Settings</span>}
            </button>

            <div className="mt-8 mx-2 p-3 bg-black/20 rounded-2xl border border-cream/10 shadow-inner">
              <button
                onClick={() => setActiveView('login')}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer",
                  activeView === 'login' 
                    ? "bg-cream text-burgundy shadow-2xl scale-[1.02]" 
                    : "hover:bg-cream/10 text-cream/70 hover:text-cream",
                  !user && activeView !== 'login' && "animate-pulse"
                )}
              >
                <Lock size={18} className={cn(activeView === 'login' ? "text-burgundy" : "text-inherit")} />
                {isSidebarOpen && (
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
                      Security
                    </span>
                    <span className="font-bold text-sm tracking-tight">
                      {user ? 'My Account' : 'Account Access'}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Footer Info */}
        {isSidebarOpen && (
          <div className="p-6 border-t border-cream/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream font-bold text-xs border border-cream/20">
                SH
              </div>
              <div>
                <p className="text-xs font-bold text-cream">Souad Housseini</p>
                <p className="text-[10px] text-cream/40 uppercase tracking-widest">Organizer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream font-bold text-xs border border-cream/20">
                HK
              </div>
              <div>
                <p className="text-xs font-bold text-cream">Hadi Kassem</p>
                <p className="text-[10px] text-cream/40 uppercase tracking-widest">Web Dev</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar scroll-smooth pb-20 md:pb-0">
        
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="h-16 md:h-20 bg-white/50 backdrop-blur-md border-b border-burgundy/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-40 transition-colors duration-500">
          <div className="flex items-center gap-3 md:gap-6">
            <h2 className="text-lg md:text-2xl font-serif italic text-burgundy truncate max-w-[150px] md:max-w-none">
              {activeView === 'timetable' && 'Weekly Timetable'}
              {activeView === 'profiles' && 'Volunteer Profiles'}
              {activeView === 'stats' && 'Analytics & Insights'}
              {activeView === 'checkin' && 'Session Check-in'}
              {activeView === 'inquiry' && 'Inquiries & Contact'}
              {activeView === 'videos' && 'Problem Solving Videos'}
              {activeView === 'settings' && 'System Settings'}
              {activeView === 'login' && 'Account Access'}
              {activeView === 'blog' && 'Blog & Events'}
              {activeView === 'profile' && 'My Profile'}
            </h2>
            <div className="hidden md:block h-4 w-[1px] bg-burgundy/10" />
            <div className="hidden md:flex items-center gap-4 text-xs font-mono text-burgundy/40 uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <TimerIcon size={12} />
                <span>GMT+3</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap size={12} />
                <span>ACM AUB</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                <button
                  onClick={() => setActiveView('profile')}
                  aria-label="View profile"
                  className={cn(
                    "flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 rounded-2xl transition-all group",
                    activeView === 'profile' ? "bg-burgundy text-cream shadow-lg" : "bg-burgundy/5 text-burgundy hover:bg-burgundy/10"
                  )}
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy group-hover:bg-burgundy group-hover:text-cream transition-colors">
                    <User size={14} />
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">Profile</span>
                    <span className="text-[10px] md:text-xs font-bold leading-none mt-1">{user.email.split('@')[0]}</span>
                  </div>
                </button>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 md:p-3 rounded-xl md:rounded-2xl glass-card text-burgundy hover:bg-red-500 hover:text-cream transition-all shadow-lg cursor-pointer"
                  aria-label="Logout"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveView('login')}
                aria-label="Log in"
                className="bg-burgundy text-cream px-4 md:px-6 py-2 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                Log In
              </button>
            )}
            <button 
              onClick={() => setHasEntered(false)}
              className="p-2 md:p-3 rounded-xl md:rounded-2xl glass-card text-burgundy hover:bg-burgundy hover:text-cream transition-all shadow-lg cursor-pointer"
              aria-label="Return to landing page"
            >
              <Home size={18} />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 md:p-3 rounded-xl md:rounded-2xl glass-card text-burgundy hover:bg-burgundy hover:text-cream transition-all shadow-lg cursor-pointer"
              aria-label={theme === 'light' ? "Switch to dark theme" : "Switch to light theme"}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeView === 'timetable' && (
                <div className="space-y-6 md:space-y-8">
                  {/* Entropy Hero Section */}
                  <div className="w-full bg-black rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col items-center justify-center py-8 md:py-12 px-4">
                    <div className="absolute inset-0 bg-gradient-to-b from-burgundy/20 to-transparent opacity-50" />
                    <div className="relative z-10 flex flex-col items-center">
                      <Entropy className="rounded-2xl md:rounded-3xl shadow-2xl shadow-burgundy/20 w-[200px] md:w-[350px]" size={350} />
                      <div className="mt-6 md:mt-8 text-center space-y-2">
                        <h2 className="text-xl md:text-2xl font-serif italic text-white">Digital Poetry in Motion</h2>
                        <p className="text-white/50 text-[10px] md:text-xs tracking-widest uppercase">Order & Chaos</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-burgundy text-cream p-6 md:p-8 rounded-[30px] md:rounded-[40px] relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-2xl">
                      <h1 className="text-2xl md:text-4xl font-serif italic mb-2">Welcome to the Hub</h1>
                      <p className="text-cream/60 leading-relaxed text-xs md:text-sm">
                        Official volunteering schedule for ACM AUB. 
                        Scientific excellence and equal opportunity.
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-cream/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  </div>
                  <Timetable schedule={schedule} />
                </div>
              )}
              {activeView === 'profiles' && <MemberProfiles volunteers={VOLUNTEERS} />}
              {activeView === 'stats' && <StatsView schedule={schedule} volunteers={VOLUNTEERS} />}
              {activeView === 'checkin' && <CheckInView schedule={schedule} user={user} />}
              {activeView === 'videos' && <VideosView volunteers={VOLUNTEERS} user={user} />}
              {activeView === 'coverage' && <CourseCoverage volunteers={VOLUNTEERS} />}
              {activeView === 'blog' && <BlogEventsView user={user} />}
              {activeView === 'profile' && <ProfileView user={user} />}
              {activeView === 'login' && (
                <div className="h-full flex items-center justify-center">
                  <Login 
                    user={user}
                    onLogin={(u) => {
                      setUser(u);
                      setActiveView('timetable');
                    }} 
                  />
                </div>
              )}
              {activeView === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
                  <div className="glass-card p-6 md:p-12 rounded-[30px] md:rounded-[40px] border border-burgundy/5">
                    <h3 className="text-2xl md:text-3xl font-serif italic text-burgundy mb-6 md:mb-8">System Settings</h3>
                    
                    <div className="space-y-8 md:space-y-12">
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 bg-burgundy/5 rounded-2xl md:rounded-3xl border border-burgundy/10 gap-6">
                        <div>
                          <h4 className="text-lg md:text-xl font-bold text-burgundy mb-1">Visual Theme</h4>
                          <p className="text-burgundy/40 text-xs md:text-sm">Switch between light and dark modes</p>
                        </div>
                        <button 
                          onClick={toggleTheme}
                          className="flex items-center justify-center gap-4 bg-burgundy text-cream px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all cursor-pointer"
                        >
                          {theme === 'light' ? <><Moon size={16} /> Dark Mode</> : <><Sun size={16} /> Light Mode</>}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="p-6 md:p-8 glass-card rounded-2xl md:rounded-3xl border border-burgundy/5">
                          <h4 className="font-bold text-burgundy mb-4">Notifications</h4>
                          <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer group">
                              <span className="text-xs md:text-sm text-burgundy/60 group-hover:text-burgundy transition-colors">Email Alerts</span>
                              <div className="w-10 h-5 md:w-12 md:h-6 bg-burgundy/10 rounded-full relative">
                                <div className="absolute left-1 top-1 w-3 h-3 md:w-4 md:h-4 bg-burgundy rounded-full" />
                              </div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer group">
                              <span className="text-xs md:text-sm text-burgundy/60 group-hover:text-burgundy transition-colors">Browser Notifications</span>
                              <div className="w-10 h-5 md:w-12 md:h-6 bg-burgundy rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 md:w-4 md:h-4 bg-cream rounded-full" />
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className="p-6 md:p-8 glass-card rounded-2xl md:rounded-3xl border border-burgundy/5">
                          <h4 className="font-bold text-burgundy mb-4">Data Privacy</h4>
                          <p className="text-xs md:text-sm text-burgundy/40 leading-relaxed mb-6">
                            Your data is encrypted and stored securely. We never share your personal information with third parties.
                          </p>
                          <button className="text-[10px] md:text-xs font-black uppercase tracking-widest text-burgundy underline underline-offset-4">
                            Privacy Policy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeView === 'inquiry' && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white p-6 md:p-12 rounded-[30px] md:rounded-[40px] shadow-xl border border-burgundy/5 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-2xl md:text-3xl font-serif italic text-burgundy mb-6 md:mb-8">Inquiries & Support</h3>
                      <p className="text-burgundy/60 mb-8 md:mb-12 text-base md:text-lg leading-relaxed">
                        If you have any questions regarding the schedule, volunteering opportunities, or technical issues with the hub, please don't hesitate to reach out.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="p-6 md:p-8 bg-burgundy/5 rounded-2xl md:rounded-3xl border border-burgundy/10">
                          <h4 className="font-bold text-burgundy mb-4 flex items-center gap-2">
                            <Users size={18} /> Hadi Kassem
                          </h4>
                          <p className="text-[10px] md:text-sm text-burgundy/40 uppercase tracking-widest mb-4 md:mb-6 font-mono">Web Developer & Support</p>
                          <div className="space-y-4">
                            <a href="tel:+96103672478" className="flex items-center gap-3 text-burgundy hover:text-burgundy/70 transition-colors text-sm">
                              <PhoneIcon size={16} />
                              <span>+961 03 672 478</span>
                            </a>
                            <a href="mailto:hadidokassem@gmail.com" className="flex items-center gap-3 text-burgundy hover:text-burgundy/70 transition-colors text-sm">
                              <Mail size={16} />
                              <span>hadidokassem@gmail.com</span>
                            </a>
                          </div>
                        </div>

                        <div className="p-6 md:p-8 bg-burgundy/5 rounded-2xl md:rounded-3xl border border-burgundy/10">
                          <h4 className="font-bold text-burgundy mb-4 flex items-center gap-2">
                            <GraduationCap size={18} /> ACM AUB
                          </h4>
                          <p className="text-[10px] md:text-sm text-burgundy/40 uppercase tracking-widest mb-4 md:mb-6 font-mono">Official Group</p>
                          <p className="text-xs md:text-sm text-burgundy/60 leading-relaxed">
                            American University of Beirut <br />
                            Computer Science Department <br />
                            Beirut, Lebanon
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-burgundy/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-burgundy/10 px-6 py-3 flex items-center justify-between z-50 safe-bottom">
          {[
            { id: 'timetable', icon: Calendar, label: 'Schedule' },
            { id: 'profiles', icon: Users, label: 'Members' },
            { id: 'videos', icon: Video, label: 'Videos' },
            { id: 'blog', icon: MessageSquare, label: 'Blog' },
            { id: 'login', icon: UserCircle, label: 'Account' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              aria-label={item.label}
              aria-current={activeView === item.id ? 'page' : undefined}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeView === item.id ? "text-burgundy scale-110" : "text-burgundy/30"
              )}
            >
              <item.icon size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        </div>
      </main>
      <ChatWidget />
    </div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}
