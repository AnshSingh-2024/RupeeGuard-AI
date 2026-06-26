import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Sparkles, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { AjantaBorder } from './HeritageDividers';

export default function ForensicReportPanel({ 
  reportText = "", 
  uploadedImage = null, 
  showExplain = false, 
  setShowExplain = null,
  verdict = "genuine",
  isDarkMode = true
}) {
  const [displayedText, setDisplayedText] = useState("");
  const borderClass = isDarkMode ? 'border-slate-800' : 'border-cream-200';
  const textClass = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  // Detect denomination from report text (e.g. "Rs 500", "Rs 2000", "500 Rupee")
  const getDenomination = () => {
    if (!reportText) return null;
    const match = reportText.match(/(?:Rs|₹)\s?(\d+)/i) || reportText.match(/(\d+)\s?rupee/i);
    return match ? `₹${match[1]}` : null;
  };

  const denomination = getDenomination();

  // Typewriter effect slice calculator
  useEffect(() => {
    if (!reportText) return;
    
    let currentLength = 0;
    setDisplayedText("");
    
    const interval = setInterval(() => {
      // Type 4 characters at a time for high speed but clear terminal feel
      currentLength += 4;
      if (currentLength >= reportText.length) {
        setDisplayedText(reportText);
        clearInterval(interval);
      } else {
        setDisplayedText(reportText.slice(0, currentLength));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [reportText]);

  return (
    <div className={`w-full p-6 rounded-2xl relative overflow-hidden border ${
      isDarkMode ? 'glass-panel' : 'glass-panel-light'
    }`}>
      {/* Ajanta borders for heritage alignment */}
      <AjantaBorder className={isDarkMode ? 'text-slate-800/40' : 'text-slate-200'} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Heatmap/Explainability Visualizer (Left) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className={`relative w-full aspect-[2/1] rounded-xl overflow-hidden border ${borderClass} bg-black/60`}>
            {uploadedImage ? (
              <img 
                src={uploadedImage} 
                alt="Scanned note image for explainability review" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                No note image preview available
              </div>
            )}

            {/* GradCAM Simulated Heatmap Overlay */}
            {showExplain && uploadedImage && (
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                isDarkMode ? 'heatmap-overlay opacity-80' : 'heatmap-overlay-light opacity-75'
              }`}>
                {/* Visual heat target borders */}
                <div className="absolute top-[35%] left-[20%] w-10 h-10 border-2 border-dashed border-aiCyan-400 rounded-full animate-ping opacity-60" />
                <div className="absolute top-[45%] left-[70%] w-12 h-12 border-2 border-dashed border-saffron-500 rounded-full animate-ping opacity-60" />
                
                {/* Heat annotations */}
                <span className="absolute top-[28%] left-[20%] text-[8px] font-mono bg-slate-950/80 px-1 py-0.5 rounded border border-slate-700 text-aiCyan-400">
                  Sec-Thread (OVI)
                </span>
                <span className="absolute top-[38%] left-[68%] text-[8px] font-mono bg-slate-950/80 px-1 py-0.5 rounded border border-slate-700 text-saffron-400">
                  Watermark Reg
                </span>
              </div>
            )}

            {/* Scanning beam overlay when explainability is ON */}
            {showExplain && uploadedImage && (
              <div className="absolute inset-x-0 top-0 h-0.5 bg-aiCyan-500/80 shadow-[0_0_8px_#00f0ff] animate-scan" />
            )}
          </div>

          {/* Explainability Toggle control */}
          <div className="mt-3 flex items-center justify-between w-full">
            <span className="text-xs text-slate-500">
              {showExplain ? "Heatmap Overlays Enabled" : "Heatmap Overlays Disabled"}
            </span>
            <button
              onClick={() => setShowExplain && setShowExplain(!showExplain)}
              className="text-xs font-semibold text-saffron-500 hover:text-saffron-400 flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Toggle Heatmap</span>
            </button>
          </div>
        </div>

        {/* Terminal Monospaced Report Text (Right) */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-saffron-500" />
              <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                FORENSIC_ANALYSIS_REPORT.TXT
              </span>
            </div>
            
            {/* Denomination Analysis Badge */}
            {denomination && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-500">
                Made for {denomination} currency analysis
              </span>
            )}
          </div>

          {/* Typewriter terminal container */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 h-[190px] overflow-y-auto font-mono text-xs text-left relative">
            <div className={`whitespace-pre-wrap leading-relaxed ${
              verdict.toLowerCase() === 'genuine' ? 'text-hGreen-500' : 'text-saffron-500/90'
            }`}>
              {displayedText}
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse align-middle" />
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
            {verdict.toLowerCase() === 'genuine' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-hGreen-500" />
                <span>ALL VALIDATION DOMAINS COMPLIANT</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-saffron-500" />
                <span>ANOMALIES PRESENT — FLAG SUBMITTED TO LOCAL SYSTEM</span>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
