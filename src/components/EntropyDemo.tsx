'use client'

import * as React from "react"
import { Entropy } from "./ui/entropy"

export function EntropyDemo({ onScrollDown }: { onScrollDown: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center bg-black text-white min-h-screen w-full p-8 relative overflow-hidden">
      <div className="flex flex-col items-center z-10">
        <Entropy className="rounded-lg shadow-2xl shadow-white/10" size={500} />
        <div className="mt-12 text-center max-w-xl">
          <div className="space-y-6 font-mono text-[16px] leading-relaxed">
            <p className="italic text-white/80 tracking-wide word-float">
              &ldquo;Order and chaos dance &mdash;
              <span className="opacity-70">digital poetry in motion.&rdquo;</span>
            </p>
            <p className="text-white/60 text-sm tracking-widest uppercase word-float" style={{ animationDelay: '0.2s' }}>
              Welcome to the ACM AUB Volunteering Hub
            </p>
          </div>
          
          <button 
            onClick={onScrollDown}
            className="mt-16 group flex flex-col items-center gap-4 transition-all hover:opacity-80 lighting-button"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/70">Scroll to Explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent opacity-50" />
          </button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-20" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />
    </div>
  )
}
