import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Lock, 
  Eye, 
  Bell, 
  LogOut, 
  ChevronRight, 
  ShieldCheck,
  Settings,
  Key,
  Database,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../utils';

interface ProfileViewProps {
  user: any;
}

export default function ProfileView({ user }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'security'>('account');

  const role = user?.user_metadata?.role || 'student';

  const sections = [
    {
      id: 'account',
      label: 'Account Details',
      icon: User,
      content: (
        <div className="space-y-6">
          <div className="bg-burgundy/5 p-8 rounded-[40px] border border-burgundy/10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-burgundy rounded-3xl flex items-center justify-center shadow-2xl">
                <User size={40} className="text-cream" />
              </div>
              <div>
                <h3 className="text-2xl font-serif italic text-burgundy">{user?.email?.split('@')[0]}</h3>
                <p className="text-burgundy/40 text-xs font-mono uppercase tracking-widest">{role} Account</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-burgundy/30">Email Address</span>
                <p className="text-burgundy font-bold">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-burgundy/30">Member Since</span>
                <p className="text-burgundy font-bold">{new Date(user?.created_at).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-burgundy/30">User ID</span>
                <p className="text-burgundy/60 font-mono text-xs truncate">{user?.id}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-burgundy/30">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-green-600 font-bold text-sm uppercase tracking-widest">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="p-6 glass-card rounded-3xl border border-burgundy/5 hover:border-burgundy/20 transition-all text-left group">
              <Bell size={20} className="text-burgundy mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-black uppercase tracking-widest text-burgundy">Notifications</p>
            </button>
            <button className="p-6 glass-card rounded-3xl border border-burgundy/5 hover:border-burgundy/20 transition-all text-left group">
              <Settings size={20} className="text-burgundy mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-black uppercase tracking-widest text-burgundy">Preferences</p>
            </button>
            <button className="p-6 glass-card rounded-3xl border border-burgundy/5 hover:border-burgundy/20 transition-all text-left group">
              <Database size={20} className="text-burgundy mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-black uppercase tracking-widest text-burgundy">Data Usage</p>
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'privacy',
      label: 'Privacy & Confidentiality',
      icon: Eye,
      content: (
        <div className="space-y-6">
          <div className="bg-burgundy/5 p-8 rounded-[40px] border border-burgundy/10">
            <h3 className="text-xl font-bold text-burgundy mb-6 flex items-center gap-3">
              <Shield size={24} /> Data Privacy Policy
            </h3>
            <div className="space-y-4 text-ink/60 text-sm leading-relaxed">
              <p>Your privacy is our priority. At ACM AUB Hub, we ensure that all your interactions and personal data are encrypted and stored securely.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ShieldCheck size={16} className="text-green-500 mt-1 shrink-0" />
                  <span>Your email is only visible to organizers for administrative purposes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck size={16} className="text-green-500 mt-1 shrink-0" />
                  <span>Session history is kept confidential between you and your tutor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck size={16} className="text-green-500 mt-1 shrink-0" />
                  <span>We do not share your data with third-party services.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 glass-card rounded-3xl border border-burgundy/5">
              <div>
                <p className="font-bold text-burgundy">Profile Visibility</p>
                <p className="text-xs text-ink/40">Control who can see your profile details</p>
              </div>
              <div className="w-12 h-6 bg-burgundy rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-cream rounded-full absolute right-1" />
              </div>
            </div>
            <div className="flex items-center justify-between p-6 glass-card rounded-3xl border border-burgundy/5">
              <div>
                <p className="font-bold text-burgundy">Activity Tracking</p>
                <p className="text-xs text-ink/40">Allow us to track your progress for analytics</p>
              </div>
              <div className="w-12 h-6 bg-burgundy/20 rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-cream rounded-full absolute left-1" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      label: 'Security & Permissions',
      icon: Lock,
      content: (
        <div className="space-y-6">
          <div className="bg-burgundy/5 p-8 rounded-[40px] border border-burgundy/10">
            <h3 className="text-xl font-bold text-burgundy mb-6 flex items-center gap-3">
              <Key size={24} /> Security Settings
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-6 bg-cream rounded-3xl border border-burgundy/10 hover:border-burgundy/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-burgundy/5 rounded-xl flex items-center justify-center text-burgundy">
                    <Lock size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-burgundy">Change Password</p>
                    <p className="text-xs text-ink/40">Update your account password</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-burgundy/20 group-hover:text-burgundy transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-6 bg-cream rounded-3xl border border-burgundy/10 hover:border-burgundy/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-burgundy/5 rounded-xl flex items-center justify-center text-burgundy">
                    <Shield size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-burgundy">Two-Factor Auth</p>
                    <p className="text-xs text-ink/40">Add an extra layer of security</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-burgundy/20 group-hover:text-burgundy transition-colors" />
              </button>
            </div>
          </div>

          <div className="p-8 bg-red-50 rounded-[40px] border border-red-100">
            <h4 className="text-red-600 font-bold mb-2 flex items-center gap-2">
              <Info size={18} /> Danger Zone
            </h4>
            <p className="text-red-600/60 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-8 py-3 bg-red-600 text-cream rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-72 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-300 group",
                activeTab === section.id 
                  ? "bg-burgundy text-cream shadow-2xl scale-[1.02]" 
                  : "hover:bg-burgundy/5 text-burgundy/40 hover:text-burgundy"
              )}
            >
              <section.icon size={20} className={cn(activeTab === section.id ? "text-cream" : "text-inherit")} />
              <span className="font-bold text-sm">{section.label}</span>
            </button>
          ))}

          <div className="pt-8">
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-red-500 hover:bg-red-50 transition-all group"
            >
              <LogOut size={20} />
              <span className="font-bold text-sm">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {sections.find(s => s.id === activeTab)?.content}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
