import React from 'react';

const CardCanvas = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0"></feColorMatrix>
        </filter>
      </svg>
      {children}
    </div>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-[1.5px] bg-gradient-to-r from-burgundy/30 via-blue-400/20 to-burgundy/30 rounded-[26px] blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"></div>
      <div className="relative bg-surface backdrop-blur-xl border border-border/50 rounded-3xl h-full shadow-sm group-hover:shadow-burgundy/5 transition-all duration-700">
        {children}
      </div>
    </div>
  );
};

export { CardCanvas, Card };
