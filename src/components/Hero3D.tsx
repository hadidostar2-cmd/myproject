import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, AlertCircle } from 'lucide-react';
import Spline from '@splinetool/react-spline';

export function Hero3D({ onEnter }: { onEnter: () => void }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pre-warm the Spline scene
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = 'https://prod.spline.design/bb488115-a656-49a7-9cff-00ebbde1518d/scene.splinecode';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="w-full h-screen absolute inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white gap-4"
          >
            <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
            <p className="font-mono text-xs uppercase tracking-widest text-white/50">Initializing 3D Experience...</p>
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-burgundy/20 text-white gap-4 backdrop-blur-sm"
          >
            <AlertCircle className="w-12 h-12 text-burgundy" />
            <div className="text-center space-y-2">
              <p className="font-serif italic text-2xl">Something went wrong</p>
              <p className="font-mono text-xs uppercase tracking-widest text-white/50">The 3D environment could not be loaded</p>
            </div>
            <button 
              onClick={onEnter}
              className="mt-4 px-8 py-3 bg-white text-burgundy rounded-full font-bold uppercase tracking-widest text-xs hover:bg-cream transition-colors"
            >
              Enter Hub Anyway
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full h-full relative">
        <Spline 
          scene="https://prod.spline.design/bb488115-a656-49a7-9cff-00ebbde1518d/scene.splinecode"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            console.error('Spline failed to load:', e);
            setError('Failed to load 3D scene');
          }}
        />
      </div>
    </div>
  );
}
