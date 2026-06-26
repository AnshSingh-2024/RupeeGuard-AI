import React from 'react';
import { History, ShieldCheck, ShieldAlert, ChevronRight, Eye } from 'lucide-react';

export default function ScanHistoryPanel({ history = [], onSelectItem, activeIndex, isDarkMode = true }) {
  if (history.length === 0) return null;

  return (
    <div className={`w-full p-6 rounded-2xl border ${
      isDarkMode ? 'glass-panel' : 'glass-panel-light'
    }`}>
      <div className="flex items-center space-x-2.5 mb-4 border-b border-slate-800/80 pb-3">
        <History className="w-5 h-5 text-saffron-500" />
        <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          Session Scan History
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 font-mono text-slate-400">
          {history.length} SCANS
        </span>
      </div>

      {/* History scroll list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item, idx) => {
          const isGenuine = item.verdict.toLowerCase() === 'genuine';
          const isActive = idx === activeIndex;

          return (
            <div 
              key={idx}
              onClick={() => onSelectItem(idx)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                isActive 
                  ? 'border-aiCyan-500 bg-aiCyan-500/5' 
                  : isDarkMode
                    ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-950/80 hover:border-slate-700'
                    : 'border-cream-200 bg-cream-50 hover:bg-white hover:border-cream-300'
              }`}
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                {/* Thumbnail */}
                <div className="w-12 h-8 rounded bg-black/40 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {item.previewUrl ? (
                    <img 
                      src={item.previewUrl} 
                      alt="History thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center font-mono text-[8px] text-slate-600">
                      BILL
                    </div>
                  )}
                </div>

                {/* Verdict details */}
                <div className="text-left overflow-hidden">
                  <div className="flex items-center space-x-1.5">
                    {isGenuine ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-hGreen-500 flex-shrink-0" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-saffron-600 flex-shrink-0" />
                    )}
                    <span className={`text-xs font-bold uppercase tracking-wide truncate ${
                      isGenuine ? 'text-hGreen-500' : 'text-saffron-600'
                    }`}>
                      {item.verdict}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5 truncate">
                    {item.fileName || `Scan #${idx + 1}`}
                  </span>
                </div>
              </div>

              {/* Confidence badge */}
              <div className="flex items-center space-x-2 pl-2">
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-slate-200 block">
                    {Math.round(item.confidence)}%
                  </span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">
                    CONF
                  </span>
                </div>
                
                {isActive ? (
                  <Eye className="w-4 h-4 text-aiCyan-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
