import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "./ui/button";

export function Hero({ onEnter }: { onEnter: () => void }) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Scientific Excellence", "Community Driven", "Expert Support", "Future Ready", "AUB Powered"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-10 lg:py-20 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col items-center w-full max-w-[90vw] mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl w-full tracking-tighter text-center font-serif italic text-burgundy">
              <span className="block not-italic font-sans font-black uppercase text-ink/20 text-xl md:text-3xl mb-8 tracking-[0.2em] md:tracking-[0.4em] text-center">Empowering Through</span>
              <div className="relative h-[1.4em] w-full flex justify-center items-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titleNumber}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -60 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 80, 
                      damping: 15,
                      opacity: { duration: 0.3 }
                    }}
                    className="absolute font-serif italic whitespace-nowrap text-center left-0 right-0"
                  >
                    {titles[titleNumber]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            <p className="text-base md:text-xl leading-relaxed tracking-tight text-ink/60 max-w-2xl text-center mx-auto px-4">
              Join our community of dedicated mentors and shape the future of education at the American University of Beirut. Expert tutoring in Maths, Physics, and Chemistry.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button size="lg" className="gap-4 rounded-full px-8" variant="outline" onClick={() => window.location.href = 'mailto:hadidokassem@gmail.com'}>
              Contact Support <PhoneCall className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4 rounded-full px-10 shadow-2xl shadow-burgundy/20" onClick={onEnter}>
              Enter Showcase <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
