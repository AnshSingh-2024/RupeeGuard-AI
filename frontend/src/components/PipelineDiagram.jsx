import React from 'react';
import { motion } from 'framer-motion';
import { Image, Cpu, CheckSquare, Database, MessageSquareCode, ArrowRight } from 'lucide-react';

const PIPELINE_STEPS = [
  {
    id: 'image',
    title: 'Scanned Image',
    subtitle: 'Upload & Preprocessing',
    icon: Image,
    color: 'text-aiCyan-400 border-aiCyan-500/30 bg-aiCyan-500/5',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.2)]',
    description: 'Resized to 384x384 & normalized for deep learning ingestion.'
  },
  {
    id: 'fusion',
    title: 'CNN + ViT Fusion',
    subtitle: 'Feature Extraction',
    icon: Cpu,
    color: 'text-saffron-500 border-saffron-500/30 bg-saffron-500/5',
    glow: 'shadow-[0_0_15px_rgba(255,153,51,0.2)]',
    description: 'Multi-head attention combines EfficientNet texture & ViT spatial features.'
  },
  {
    id: 'verdict',
    title: 'Verdict & Confidence',
    subtitle: 'Softmax Classification',
    icon: CheckSquare,
    color: 'text-hGreen-500 border-hGreen-500/30 bg-hGreen-500/5',
    glow: 'shadow-[0_0_15px_rgba(19,136,8,0.2)]',
    description: 'Binary classifier predicts probability of authentic vs fake note.'
  },
  {
    id: 'rag',
    title: 'RAG Retrieval',
    subtitle: 'FAISS Index Matching',
    icon: Database,
    color: 'text-hBlue-500 border-hBlue-500/30 bg-hBlue-500/5',
    glow: 'shadow-[0_0_15px_rgba(0,0,128,0.25)]',
    description: 'Retrieves relevant RBI security guidelines using SentenceTransformers.'
  },
  {
    id: 'llm',
    title: 'LLM Report Synthesis',
    subtitle: 'Gemini Generative AI',
    icon: MessageSquareCode,
    color: 'text-slate-200 border-slate-700/60 bg-slate-800/10',
    glow: 'shadow-[0_0_15px_rgba(255,255,255,0.1)]',
    description: 'Generates plain-English forensic report based on verification evidence.'
  }
];

export default function PipelineDiagram({ isDarkMode = true }) {
  // Framer Motion staggered node variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25
      }
    }
  };

  const nodeVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 70, 
        damping: 15 
      } 
    }
  };

  const bgBorderClass = isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-cream-200 bg-white/60';

  return (
    <div className={`w-full p-8 rounded-2xl border text-center relative overflow-hidden ${
      isDarkMode ? 'glass-panel' : 'glass-panel-light'
    }`}>
      <div className="mb-8">
        <h3 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          Analysis Pipeline Architecture
        </h3>
        <p className={`text-sm mt-1.5 max-w-xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          A look under the hood of RupeeGuard AI's multi-layered neural and retrieval augmented verification network.
        </p>
      </div>

      {/* SVG Connecting Flow Lines (Desktop Only) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ top: '40%' }}>
        <svg className="w-full h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* We animate dashed strokes representing flowing data packets */}
          <path 
            d="M 12% 15 H 88%" 
            stroke="url(#flowGradient)" 
            strokeWidth="2" 
            strokeDasharray="8 8" 
            className="animate-flow-line" 
          />
          <defs>
            <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ff9933" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#138808" stopOpacity="0.8" />
            </linearGradient>
            {/* Custom SVG styling to animate dashoffset */}
            <style>
              {`
                @keyframes strokeFlow {
                  to {
                    stroke-dashoffset: -20;
                  }
                }
                .animate-flow-line {
                  animation: strokeFlow 1.2s linear infinite;
                }
              `}
            </style>
          </defs>
        </svg>
      </div>

      {/* Nodes grid container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 items-stretch relative z-10"
      >
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <motion.div 
                variants={nodeVariants}
                className={`flex flex-col items-center p-5 rounded-xl border relative text-center transition-all hover:scale-[1.02] ${bgBorderClass}`}
              >
                <div className={`p-3.5 rounded-2xl border ${step.color} ${step.glow} mb-3.5 flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                  STAGE {String(idx + 1).padStart(2, '0')}
                </span>
                
                <h4 className={`text-sm font-bold mt-1.5 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {step.title}
                </h4>
                
                <span className={`text-[10px] font-semibold mt-0.5 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {step.subtitle}
                </span>

                <p className={`text-xs mt-3 leading-relaxed border-t ${
                  isDarkMode ? 'border-slate-800 text-slate-500' : 'border-cream-100 text-slate-500'
                } pt-3`}>
                  {step.description}
                </p>
              </motion.div>

              {/* Mobile Arrows Separator */}
              {idx < PIPELINE_STEPS.length - 1 && (
                <div className="flex lg:hidden items-center justify-center py-2 text-slate-700">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </motion.div>
    </div>
  );
}
