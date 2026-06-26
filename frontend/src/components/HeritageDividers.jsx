import React from 'react';

/**
 * Ashoka Chakra - Stylized 24-spoke wheel representing motion and order.
 */
export const AshokaChakra = ({ className = "w-24 h-24 text-hBlue-500", animated = true }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} ${animated ? 'animate-spin-slow' : ''}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Rim */}
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
      
      {/* Inner Rim */}
      <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      
      {/* 24 Spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        return (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
            {/* Main Spoke Line */}
            <line x1="50" y1="50" x2="50" y2="8" stroke="currentColor" strokeWidth="1.5" />
            {/* Stylized triangular wedge at the rim */}
            <path d="M48.5 12 L50 8 L51.5 12 Z" fill="currentColor" />
            {/* Small circular dot between spoke tips */}
            <circle cx="50" cy="6" r="1" fill="currentColor" transform={`rotate(${180/24} 50 50)`} />
          </g>
        );
      })}
    </svg>
  );
};

/**
 * PaisleyDivider - Mirrored abstract paisley vectors acting as a content divider.
 */
export const PaisleyDivider = ({ className = "text-saffron-500" }) => {
  return (
    <div className={`flex items-center justify-center space-x-4 my-6 opacity-80 ${className}`}>
      <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-current max-w-[150px]"></div>
      
      <svg className="w-24 h-8" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Paisley */}
        <path 
          d="M50 20 C50 12, 40 5, 30 5 C20 5, 10 12, 10 20 C10 28, 22 35, 35 30 C32 26, 32 20, 36 16 C40 12, 45 15, 47 18 C49 20, 50 21, 50 20 Z" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        />
        <circle cx="28" cy="18" r="3" fill="currentColor" />
        
        {/* Center Lotus Motif */}
        <path 
          d="M60 10 C57 18, 55 24, 60 30 C65 24, 63 18, 60 10 Z M60 18 C54 22, 50 26, 52 30 C59 30, 58 24, 60 18 Z M60 18 C66 22, 70 26, 68 30 C61 30, 62 24, 60 18 Z" 
          fill="currentColor"
        />
        
        {/* Right Paisley (Mirrored) */}
        <path 
          d="M70 20 C70 12, 80 5, 90 5 C100 5, 110 12, 110 20 C110 28, 98 35, 85 30 C88 26, 88 20, 84 16 C80 12, 75 15, 73 18 C71 20, 70 21, 70 20 Z" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        />
        <circle cx="92" cy="18" r="3" fill="currentColor" />
      </svg>
      
      <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-current max-w-[150px]"></div>
    </div>
  );
};

/**
 * AjantaBorder - corner accent border overlay resembling heritage architectural margins.
 */
export const AjantaBorder = ({ className = "text-saffron-500/30" }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none p-3 ${className}`}>
      {/* Top Left */}
      <svg className="absolute top-3 left-3 w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 40 V0 H40" stroke="currentColor" strokeWidth="2" />
        <path d="M6 34 V6 H34" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <path d="M12 28 V12 H28" stroke="currentColor" strokeWidth="0.5" />
        <rect x="2" y="2" width="4" height="4" fill="currentColor" />
      </svg>
      
      {/* Top Right */}
      <svg className="absolute top-3 right-3 w-8 h-8 rotate-90" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 40 V0 H40" stroke="currentColor" strokeWidth="2" />
        <path d="M6 34 V6 H34" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <rect x="2" y="2" width="4" height="4" fill="currentColor" />
      </svg>
      
      {/* Bottom Left */}
      <svg className="absolute bottom-3 left-3 w-8 h-8 -rotate-90" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 40 V0 H40" stroke="currentColor" strokeWidth="2" />
        <path d="M6 34 V6 H34" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <rect x="2" y="2" width="4" height="4" fill="currentColor" />
      </svg>
      
      {/* Bottom Right */}
      <svg className="absolute bottom-3 right-3 w-8 h-8 rotate-180" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 40 V0 H40" stroke="currentColor" strokeWidth="2" />
        <path d="M6 34 V6 H34" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <path d="M12 28 V12 H28" stroke="currentColor" strokeWidth="0.5" />
        <rect x="2" y="2" width="4" height="4" fill="currentColor" />
      </svg>
    </div>
  );
};

/**
 * HeritageShield - Abstract shield incorporating a concentric chakra security theme.
 */
export const HeritageShield = ({ className = "w-16 h-16", isGenuine = true }) => {
  const colorClass = isGenuine ? "text-hGreen-500" : "text-saffron-600";
  return (
    <svg 
      className={`${className} ${colorClass}`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield Outer Outline */}
      <path 
        d="M50 5 L88 20 V50 C88 72, 72 88, 50 95 C28 88, 12 72, 12 50 V20 L50 5 Z" 
        stroke="currentColor" 
        strokeWidth="4" 
        fill="currentColor"
        fillOpacity="0.05"
      />
      {/* Inner Shield Lining */}
      <path 
        d="M50 12 L80 24 V48 C80 67, 67 80, 50 86 C33 80, 20 67, 20 48 V24 L50 12 Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeDasharray="3,3"
      />
      {/* Center Chakra Motif */}
      <circle cx="50" cy="46" r="16" stroke="currentColor" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12;
        return (
          <line 
            key={i} 
            x1="50" 
            y1="46" 
            x2={50 + 16 * Math.cos((angle * Math.PI) / 180)} 
            y2={46 + 16 * Math.sin((angle * Math.PI) / 180)} 
            stroke="currentColor" 
            strokeWidth="1.5" 
          />
        );
      })}
      
      {/* Success Check or Failure Alert Icon */}
      {isGenuine ? (
        // Check symbol inside shield
        <path 
          d="M40 48 L47 55 L60 38" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      ) : (
        // Alert Exclamation symbol inside shield
        <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
          <line x1="50" y1="34" x2="50" y2="52" />
          <circle cx="50" cy="62" r="3" fill="currentColor" stroke="none" />
        </g>
      )}
    </svg>
  );
};
