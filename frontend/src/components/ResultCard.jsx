import React from 'react';
import { RefreshCw, ShieldCheck, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import ConfidenceRing from './ConfidenceRing';
import { HeritageShield } from './HeritageDividers';

export default function ResultCard({ result, onReset, isDarkMode, showExplain, setShowExplain }) {
  if (!result) return null;

  const { verdict, confidence } = result;
  const isGenuine = verdict.toLowerCase() === 'genuine';

  // Animation variants for the stamp/seal impact effect
  const stampVariants = {
    hidden: { scale: 3, rotate: -25, opacity: 0 },
    visible: { 
      scale: 1, 
      rotate: isGenuine ? -4 : 6, 
      opacity: 1,
      transition: { 
        type: "spring", 
        damping: 12, 
        stiffness: 120,
        mass: 1.2
      } 
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-stretch">
        
        {/* Left Card: Stamp, Verdict, & Confidence */}
        <div className={`md:col-span-5 flex flex-col justify-center items-center p-8 rounded-2xl relative overflow-hidden text-center ${
          isGenuine 
            ? 'border-hGreen-500/20 bg-hGreen-950/10' 
            : 'border-saffron-600/20 bg-saffron-950/10'
          } ${isDarkMode ? 'glass-panel' : 'glass-panel-light'}`}
        >
          {/* Subtle colored glow backdrop */}
          <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-3xl opacity-20 ${
            isGenuine ? 'bg-hGreen-500' : 'bg-saffron-500'
          }`} />
          <div className={`absolute -bottom-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 ${
            isGenuine ? 'bg-hGreen-500' : 'bg-saffron-500'
          }`} />

          {/* Stamp / Seal Entrance Impact */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stampVariants}
            className="mb-4 z-10 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          >
            <div className={`inline-flex flex-col items-center p-5 rounded-2xl border-4 uppercase font-extrabold tracking-widest ${
              isGenuine 
                ? 'border-hGreen-500 text-hGreen-500 bg-hGreen-950/20 rotate-[-4deg]' 
                : 'border-saffron-600 text-saffron-600 bg-saffron-950/20 rotate-[6deg]'
            }`}>
              <div className="flex items-center space-x-2">
                <HeritageShield className="w-12 h-12" isGenuine={isGenuine} />
              </div>
              <span className="text-2xl mt-2 tracking-wider font-mono">
                {verdict}
              </span>
            </div>
          </motion.div>

          <p className={`text-sm max-w-[200px] mb-4 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {isGenuine 
              ? 'Security features verify authenticity. Currency classified as GENUINE.' 
              : 'Structural anomalies detected. Note flagged as COUNTERFEIT.'
            }
          </p>

          {/* Confidence Progress Ring */}
          <div className="border-t border-slate-800/60 w-full pt-4 mt-2">
            <ConfidenceRing confidence={confidence} isGenuine={isGenuine} />
          </div>
        </div>

        {/* Right Card: Quick Insights & Controls */}
        <div className={`md:col-span-7 flex flex-col justify-between p-8 rounded-2xl ${
          isDarkMode ? 'glass-panel' : 'glass-panel-light'
        }`}>
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                Forensic Analysis Complete
              </h3>
              <p className={`text-sm mt-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                The machine-learning pipeline evaluated the uploaded bill structure against trained models and the RBI security corpus.
              </p>
            </div>

            {/* Quick parameter status grids */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono">
                <span className="text-[10px] text-slate-500 block uppercase">Classifier Model</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 block">CNN + ViT Hybrid</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono">
                <span className="text-[10px] text-slate-500 block uppercase">Reference Standard</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 block">RBI Security Standard</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono">
                <span className="text-[10px] text-slate-500 block uppercase">RAG Documents</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 block">8 Knowledge Bases</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono">
                <span className="text-[10px] text-slate-500 block uppercase">Response Time</span>
                <span className="text-sm font-semibold text-aiCyan-400 mt-1 block">~2.4 seconds</span>
              </div>
            </div>

            {/* Explainability toggle description */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-start space-x-3 pr-2">
                <Sparkles className="w-5 h-5 text-aiCyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    AI Attention Heatmap
                  </h4>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Highlight scanner regions that most influenced this classification verdict.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExplain(!showExplain)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  showExplain 
                    ? 'bg-aiCyan-500/10 border-aiCyan-500 text-aiCyan-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {showExplain ? "Hide Overlay" : "Show Overlay"}
              </button>
            </div>
          </div>

          {/* Action Reset CTA button */}
          <div className="border-t border-slate-800/60 pt-6 mt-6 flex justify-end">
            <button
              onClick={onReset}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 text-white font-semibold flex items-center space-x-2 shadow-lg hover:shadow-saffron-500/10 transform hover:scale-[1.01] transition-all text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Scan Another Note</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
