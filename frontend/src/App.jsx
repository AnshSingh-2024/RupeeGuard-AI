import React, { useState, useEffect, useRef } from 'react';
import { Shield, Sun, Moon, Volume2, VolumeX, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ScannerUpload from './components/ScannerUpload';
import ResultCard from './components/ResultCard';
import ForensicReportPanel from './components/ForensicReportPanel';
import PipelineDiagram from './components/PipelineDiagram';
import ScanHistoryPanel from './components/ScanHistoryPanel';
import { AshokaChakra, PaisleyDivider } from './components/HeritageDividers';

// Synthesize sound effects using Web Audio API (completely self-contained)
const playSound = (type, enabled) => {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'success') {
      // Ascending major chord (C5 -> E5 -> G5 -> C6)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } else if (type === 'error') {
      // Dissonant double alert
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.type = 'triangle';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(220, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.3);
      osc2.frequency.setValueAtTime(225, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(112, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    console.warn("AudioContext failed", e);
  }
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  
  // session in-memory scan history log
  const [history, setHistory] = useState([]);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(-1);
  const [historyFiles, setHistoryFiles] = useState([]); // tracks active image preview links

  const scannerRef = useRef(null);

  // Apply dark/light class to html document
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle uploading and predicting
  const handleScanStart = async (file) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowExplain(false);
    
    // Save preview URL for result cards
    const localUrl = URL.createObjectURL(file);
    setUploadedImageUrl(localUrl);

    playSound('beep', soundEnabled);

    // Call API predict
    const formData = new FormData();
    formData.append("file", file);

    try {
      // A minimum loading time of 2.5 seconds to showcase the 14-step checklist animation elegantly!
      const apiPromise = fetch("/predict", { method: "POST", body: formData });
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 2500));
      
      const [response] = await Promise.all([apiPromise, delayPromise]);
      
      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      // Add to session history
      const newHistoryItem = {
        verdict: data.verdict,
        confidence: data.confidence,
        forensic_report: data.forensic_report,
        previewUrl: localUrl,
        fileName: file.name
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);
      setActiveHistoryIndex(0);

      // Play chime based on result
      if (data.verdict.toLowerCase() === 'genuine') {
        playSound('success', soundEnabled);
      } else {
        playSound('error', soundEnabled);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      playSound('error', soundEnabled);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (index) => {
    const selected = history[index];
    if (selected) {
      setResult({
        verdict: selected.verdict,
        confidence: selected.confidence,
        forensic_report: selected.forensic_report
      });
      setUploadedImageUrl(selected.previewUrl);
      setActiveHistoryIndex(index);
      setShowExplain(false);
      
      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById("results-section");
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleReset = () => {
    setResult(null);
    setUploadedImageUrl(null);
    setActiveHistoryIndex(-1);
    setShowExplain(false);
    setError(null);
    
    // Scroll back to scanner upload bed
    if (scannerRef.current) {
      scannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 w-full pb-12 relative overflow-hidden ${
      isDarkMode ? 'bg-jali-dark text-slate-100' : 'bg-jali-light text-slate-800'
    }`}>
      
      {/* Background Floating Fiber Glints */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className="floating-fiber animate-pulse"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 90 + 5}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Global Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-850 relative z-20">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={handleReset}>
          {/* Custom vector logo combining Shield and Chakra */}
          <div className="p-2 rounded-xl bg-saffron-500/10 border border-saffron-500/30 text-saffron-500 shadow-glow">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-extrabold tracking-tight m-0 leading-none">
              Rupee<span className="text-saffron-500">Guard</span> <span className="text-aiCyan-400 font-mono text-xs">AI</span>
            </h1>
            <span className="text-[9px] text-slate-500 tracking-wider block font-bold uppercase mt-0.5">
              Currency Integrity Protocol
            </span>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-3">
          {/* Sound Design Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled 
                ? 'bg-saffron-500/10 border-saffron-500/40 text-saffron-500' 
                : 'border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? "Mute sound design" : "Enable sound design"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Light/Dark Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl border border-slate-800 text-slate-500 hover:text-slate-400 transition-all"
            title={isDarkMode ? "Toggle Light Theme" : "Toggle Dark Theme"}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-saffron-500" /> : <Moon className="w-5 h-5 text-hBlue-500" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 relative z-10 space-y-16 mt-6">
        
        {/* Section 1: Hero Landing Area */}
        <section className="relative flex flex-col items-center justify-center min-h-[70vh] text-center overflow-hidden py-12">
          {/* Faint rotating backdrop chakra */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-10 scale-125 z-0">
            <AshokaChakra className="w-[500px] h-[500px] text-saffron-500" />
          </div>

          <div className="max-w-3xl space-y-6 relative z-10 flex flex-col items-center">
            
            {/* Indian heritage stylized divider badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
              <span>Advanced Neural Network Verification</span>
            </div>

            {/* Glowing scan line headline */}
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight m-0 text-slate-100 font-sans">
              Rupee<span className="text-saffron-500">Guard</span> <span className="scan-line-text text-aiCyan-400 font-mono">AI</span>
            </h2>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
              Verify counterfeit currency notes instantly using our hybrid <strong className="text-slate-200">CNN + Vision Transformer</strong> neural fusion models and real-time RBI standard report vector retrieval.
            </p>

            <div className="pt-4">
              <button
                onClick={scrollToScanner}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 text-white font-bold text-base flex items-center space-x-2 shadow-2xl hover:shadow-saffron-500/20 transform hover:scale-[1.03] transition-all relative group"
              >
                <span>Scan a Note</span>
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>

          </div>
        </section>

        {/* Section 2: Scanning Interface Bed */}
        <section ref={scannerRef} className="scroll-mt-12">
          <ScannerUpload 
            onScanStart={handleScanStart}
            onScanComplete={(res) => setResult(res)}
            isLoading={isLoading}
            error={error}
            isDarkMode={isDarkMode}
          />
        </section>

        {/* Section 3: Results Display */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.section 
              id="results-section"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 20, stiffness: 80 }}
              className="space-y-8 scroll-mt-6"
            >
              <PaisleyDivider className="text-saffron-500/50" />
              
              <ResultCard 
                result={result}
                onReset={handleReset}
                isDarkMode={isDarkMode}
                showExplain={showExplain}
                setShowExplain={setShowExplain}
              />

              <ForensicReportPanel 
                reportText={result.forensic_report}
                uploadedImage={uploadedImageUrl}
                showExplain={showExplain}
                setShowExplain={setShowExplain}
                verdict={result.verdict}
                isDarkMode={isDarkMode}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Section: Session Scan Logs */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="pt-6"
            >
              <ScanHistoryPanel 
                history={history}
                onSelectItem={handleSelectItem}
                activeIndex={activeHistoryIndex}
                isDarkMode={isDarkMode}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Section 4: Architecture Pipeline diagram */}
        <section className="pt-8">
          <PipelineDiagram isDarkMode={isDarkMode} />
        </section>

      </main>

      {/* Section 5: Footer */}
      <footer className="mt-20 border-t border-slate-900 pt-8 relative overflow-hidden bg-slate-950/80 backdrop-blur-sm">
        {/* Subtle repeating jali border strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-saffron-500/20" />
        <div className="absolute top-1 inset-x-0 h-2 bg-gradient-to-b from-slate-950/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-mono space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-hGreen-500"></span>
            <span>RupeeGuard AI Currency Inspection Protocol v1.2</span>
          </div>
          <div>
            <span>Generic architectural & historic motifs inspired. Verbatim reproduction restricted.</span>
          </div>
          <div className="text-[10px] text-slate-600">
            <span>© 2026 RupeeGuard AI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
