import React, { useState, useEffect } from 'react';

export default function ConfidenceRing({ confidence = 0, isGenuine = true }) {
  const [offset, setOffset] = useState(251.32);
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.327

  useEffect(() => {
    // Staged animation to fill the progress ring
    const progressOffset = circumference - (circumference * confidence) / 100;
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 300);
    return () => clearTimeout(timer);
  }, [confidence, circumference]);

  const strokeColor = isGenuine ? 'stroke-hGreen-500' : 'stroke-saffron-600';
  const glowColor = isGenuine ? 'shadow-[0_0_15px_rgba(19,136,8,0.4)]' : 'shadow-[0_0_15px_rgba(234,88,12,0.4)]';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Ashoka Chakra Radial Grid Elements in Background */}
        <svg className="absolute w-full h-full text-slate-800/40 rotate-12" viewBox="0 0 100 100">
          {/* Inner ring grids */}
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="0.5" fill="none" />
          {/* Chakra spoke lines */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 46 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={50 + 46 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="0.25"
            />
          ))}
        </svg>

        {/* Circular Progress Gauge */}
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
          {/* Progress Backing circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-800/60"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress Foreground circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`${strokeColor} transition-all duration-1000 ease-out`}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
          />
          {/* Glowing accent border */}
          <circle
            cx="50"
            cy="50"
            r={radius + 4}
            className={`${strokeColor} opacity-20`}
            strokeWidth="1"
            strokeDasharray="2, 4"
            fill="none"
          />
        </svg>

        {/* Floating Percentage label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold font-mono tracking-tighter text-slate-100 flex items-baseline">
            {Math.round(confidence)}
            <span className="text-sm font-semibold text-slate-400 ml-0.5">%</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-slate-500 mt-1 uppercase">
            Confidence
          </span>
        </div>
      </div>
    </div>
  );
}
