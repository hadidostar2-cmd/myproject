import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cn } from '../utils';

interface LoginProps {
  user: any;
  onLogin: (user: any) => void;
}

export default function Login({ user, onLogin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'tutor' | 'student'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      const missing = [];
      if (!import.meta.env.VITE_SUPABASE_URL) missing.push('SUPABASE_URL');
      if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missing.push('SUPABASE_ANON_KEY');
      setError(`Supabase is not configured. Missing: ${missing.join(', ')}. Please add them to Secrets.`);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role === 'tutor' ? 'volunteer' : 'student',
            },
          },
        });
        if (error) throw error;
        
        if (data.user) {
          // Sync with public.users table as per new SQL schema
          const { error: profileError } = await supabase.from('users').insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: email.split('@')[0],
              role: role === 'tutor' ? 'volunteer' : 'student'
            }
          ]);
          
          if (profileError) {
            console.error('Error creating user profile:', profileError);
          }

          setError('Check your email for the confirmation link!');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured) {
      const missing = [];
      if (!import.meta.env.VITE_SUPABASE_URL) missing.push('SUPABASE_URL');
      if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missing.push('SUPABASE_ANON_KEY');
      setError(`Supabase is not configured. Missing: ${missing.join(', ')}. Please add them to Secrets.`);
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-burgundy/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-burgundy/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-12 rounded-[50px] border border-burgundy/5 shadow-2xl relative z-10"
      >
        {user ? (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-burgundy rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <User size={40} className="text-cream" />
            </div>
            <div>
              <h2 className="text-3xl font-serif italic text-burgundy mb-2">Your Account</h2>
              <p className="text-burgundy/40 text-sm font-medium">Manage your session and profile</p>
            </div>
            
            <div className="bg-burgundy/5 p-6 rounded-3xl border border-burgundy/10 text-left space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-burgundy/30 block mb-1">Email Address</span>
                <span className="text-burgundy font-bold">{user.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-burgundy/30 block mb-1">User ID</span>
                <span className="text-burgundy/60 font-mono text-xs">{user.id}</span>
              </div>
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              aria-label="Sign out of your account"
              className="w-full bg-red-500 text-cream py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 min-h-[56px]"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-burgundy rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <GraduationCap size={32} className="text-cream" />
              </div>
              <h2 className="text-3xl font-serif italic text-burgundy mb-2">
                {isLogin ? 'Welcome Back' : 'Join the Hub'}
              </h2>
              <p className="text-burgundy/40 text-sm font-medium">
                {isLogin ? 'Login to access your dashboard' : 'Create an account to start learning'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                      role === 'student' 
                        ? "bg-burgundy border-burgundy text-cream shadow-lg" 
                        : "bg-burgundy/5 border-burgundy/10 text-burgundy/40 hover:bg-burgundy/10"
                    )}
                  >
                    <User size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('tutor')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                      role === 'tutor' 
                        ? "bg-burgundy border-burgundy text-cream shadow-lg" 
                        : "bg-burgundy/5 border-burgundy/10 text-burgundy/40 hover:bg-burgundy/10"
                    )}
                  >
                    <GraduationCap size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tutor</span>
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-burgundy/20" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    aria-label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-burgundy/5 border border-burgundy/10 rounded-2xl py-4 pl-12 pr-4 text-burgundy placeholder:text-burgundy/20 focus:outline-none focus:ring-2 focus:ring-burgundy/20 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-burgundy/20" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-burgundy/5 border border-burgundy/10 rounded-2xl py-4 pl-12 pr-4 text-burgundy placeholder:text-burgundy/20 focus:outline-none focus:ring-2 focus:ring-burgundy/20 transition-all"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 font-bold text-center"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                aria-label={isLogin ? 'Login to your account' : 'Sign up for a new account'}
                className="w-full bg-burgundy text-cream py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 min-h-[56px]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isLogin ? 'Login' : 'Sign Up'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-burgundy/10"></div>
              </div>
              <div className="relative bg-white px-4 text-[10px] font-black uppercase tracking-widest text-burgundy/30">
                Or continue with
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              aria-label="Continue with Google"
              className="mt-6 w-full bg-white border border-burgundy/10 text-burgundy py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm hover:bg-burgundy/5 transition-all flex items-center justify-center gap-3 min-h-[56px]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-black uppercase tracking-widest text-burgundy/40 hover:text-burgundy transition-colors"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
