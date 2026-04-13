import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoveRight, Loader2 } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function Hero3D({ onEnter }: { onEnter: () => void }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Fallback timeout: if Spline hasn't loaded in 10 seconds, show the content anyway
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 10000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []); // Only run once on mount

  return (
    <div className="w-full h-screen absolute inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white gap-4"
          >
            <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
            <p className="font-mono text-xs uppercase tracking-widest text-white/50">Initializing 3D Experience...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
        </div>
      }>
        <div className="w-full h-full relative">
          <Spline 
            scene="https://prod.spline.design/bb488115-a656-49a7-9cff-00ebbde1518d/scene.splinecode"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              console.error('Spline failed to load');
              setIsLoaded(true);
            }}
          />
        </div>
      </Suspense>
    </div>
  );
}
