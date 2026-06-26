import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileCode, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECURITY_FEATURES = [
  "Metallic Security Thread",
  "Latent Denomination Image",
  "Feature Portrait Watermark",
  "Microprinted Text Lines",
  "Intaglio Print Texture",
  "See-Through Register",
  "UV-Fluorescent Fibres",
  "Optically Variable Ink",
  "Raised Identification Shapes",
  "Angular Marginal Bleed Lines",
  "Numeric Value Watermark",
  "Reverse Year Stamp",
  "Multi-language Panel",
  "Progressive Serial Grid"
];

export default function ScannerUpload({ onScanStart, onScanComplete, isLoading, error, isDarkMode }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [checkedCount, setCheckedCount] = useState(0);
  const fileInputRef = useRef(null);
  const checklistIntervalRef = useRef(null);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Handle checking off items one by one during scan loading
  useEffect(() => {
    if (isLoading) {
      setCheckedCount(0);
      let count = 0;
      checklistIntervalRef.current = setInterval(() => {
        count += 1;
        if (count <= SECURITY_FEATURES.length) {
          setCheckedCount(count);
        } else {
          clearInterval(checklistIntervalRef.current);
        }
      }, 180); // ~2.5 seconds total for 14 items
    } else {
      clearInterval(checklistIntervalRef.current);
      if (!selectedFile) {
        setCheckedCount(0);
      } else {
        // If loading finished early or wasn't triggered, complete checklist
        setCheckedCount(SECURITY_FEATURES.length);
      }
    }
    return () => clearInterval(checklistIntervalRef.current);
  }, [isLoading, selectedFile]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    onScanStart(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
      {/* Scanner Viewport bed (Left Side) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={!isLoading && !previewUrl ? triggerFileInput : undefined}
          className={`relative w-full aspect-[2/1] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
            dragActive 
              ? 'border-aiCyan-500 bg-aiCyan-500/10 scale-[1.01]' 
              : previewUrl 
                ? 'border-slate-800 bg-slate-950/80 cursor-default' 
                : 'border-slate-700/80 hover:border-saffron-500 bg-slate-900/40 hover:bg-slate-900/60 cursor-pointer'
          } ${isDarkMode ? 'glass-panel' : 'glass-panel-light'}`}
        >
          {/* Invisible file input */}
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleChange}
            disabled={isLoading}
          />

          {/* Viewfinder corner brackets */}
          <div className={`absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 transition-colors duration-300 ${
            dragActive || isLoading ? 'border-aiCyan-500 scale-105 animate-pulse' : 'border-saffron-500/60'
          }`} />
          <div className={`absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 transition-colors duration-300 ${
            dragActive || isLoading ? 'border-aiCyan-500 scale-105 animate-pulse' : 'border-saffron-500/60'
          }`} />
          <div className={`absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 transition-colors duration-300 ${
            dragActive || isLoading ? 'border-aiCyan-500 scale-105 animate-pulse' : 'border-saffron-500/60'
          }`} />
          <div className={`absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 transition-colors duration-300 ${
            dragActive || isLoading ? 'border-aiCyan-500 scale-105 animate-pulse' : 'border-saffron-500/60'
          }`} />

          <AnimatePresence mode="wait">
            {!previewUrl ? (
              // Idle state - Prompt to upload
              <motion.div 
                key="upload-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center p-6 text-center space-y-3"
              >
                <div className="p-4 rounded-full bg-slate-800/80 border border-slate-700 text-saffron-500 group-hover:text-aiCyan-500 transition-colors">
                  <Upload className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <p className={`font-semibold text-lg ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    Drag and drop your note image
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Supports PNG, JPG, JPEG (Max 10MB)
                  </p>
                </div>
                <button 
                  type="button"
                  className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 text-white shadow-lg transition-all transform hover:scale-[1.02]"
                >
                  Browse Files
                </button>
              </motion.div>
            ) : (
              // Preview state
              <motion.div 
                key="image-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center bg-black/40"
              >
                <img 
                  src={previewUrl} 
                  alt="Scanned currency note preview" 
                  className="w-full h-full object-contain"
                />

                {/* Laser scan line overlay */}
                {isLoading && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-aiCyan-500 to-transparent shadow-[0_0_12px_#00f0ff] animate-scan" />
                  </div>
                )}

                {/* Scanning blur filter overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-aiCyan-500/5 mix-blend-overlay animate-pulse pointer-events-none" />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick info bar when previewing */}
          {previewUrl && !isLoading && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-hGreen-500 animate-ping"></span>
              <span>Loaded: {selectedFile?.name.substring(0, 20)}...</span>
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setCheckedCount(0);
                }} 
                className="ml-2 text-saffron-500 hover:text-saffron-400 font-semibold"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        
        {/* Error message indicator */}
        {error && (
          <div className="mt-4 w-full p-4 rounded-xl border border-red-900/40 bg-red-950/20 text-red-400 flex items-center space-x-3 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>Analysis failed: {error}</span>
          </div>
        )}
      </div>

      {/* Security Feature Checklist (Right Side) */}
      <div className={`lg:col-span-5 w-full p-6 rounded-2xl ${isDarkMode ? 'glass-panel' : 'glass-panel-light'}`}>
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <h3 className={`font-semibold text-lg flex items-center space-x-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
            <FileCode className="w-5 h-5 text-saffron-500" />
            <span>Forensic Validation Engine</span>
          </h3>
          <span className="text-xs font-mono px-2 py-1 rounded bg-slate-950 text-aiCyan-400 border border-slate-800">
            {checkedCount} / 14 VERIFIED
          </span>
        </div>

        {/* Feature list grid */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {SECURITY_FEATURES.map((feature, idx) => {
            const isCompleted = idx < checkedCount;
            const isChecking = idx === checkedCount && isLoading;
            const isPending = idx > checkedCount || (!isLoading && !selectedFile);

            return (
              <div 
                key={feature} 
                className={`flex items-center justify-between p-2 rounded-lg border transition-all text-xs ${
                  isCompleted 
                    ? 'border-hGreen-500/20 bg-hGreen-500/5 text-hGreen-500' 
                    : isChecking 
                      ? 'border-aiCyan-500/40 bg-aiCyan-500/5 text-aiCyan-400 font-medium' 
                      : 'border-slate-800/40 bg-slate-900/20 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-[10px] w-4 text-slate-600">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className={isCompleted ? 'line-through opacity-80' : ''}>
                    {feature}
                  </span>
                </div>

                <div>
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-hGreen-500 animate-scale-up" />
                  )}
                  {isChecking && (
                    <Loader2 className="w-4 h-4 text-aiCyan-400 animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 bg-slate-950/50" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Scan status log */}
        <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px]">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>ENGINE STATUS LOG</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 animate-pulse">
              {isLoading ? 'RUNNING' : 'STANDBY'}
            </span>
          </div>
          <div className="text-slate-400 space-y-0.5 leading-relaxed">
            {isLoading ? (
              <>
                <p className="text-aiCyan-400">&gt; Initializing CNN + ViT model weights...</p>
                {checkedCount > 2 && <p className="text-saffron-500">&gt; Running texture alignment checks...</p>}
                {checkedCount > 6 && <p className="text-hGreen-500">&gt; Extracting watermarks and fiber density...</p>}
                {checkedCount > 10 && <p className="text-slate-300">&gt; Commencing FAISS index retrieval...</p>}
                {checkedCount === 14 && <p className="text-aiCyan-400">&gt; Synthesizing final AI report...</p>}
              </>
            ) : selectedFile ? (
              <p className="text-hGreen-500">&gt; Scan complete. Reviewing analysis card.</p>
            ) : (
              <p className="text-slate-600">&gt; Ready. Insert note image to launch scan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
