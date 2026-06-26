# RupeeGuard AI — Counterfeit Indian Currency Detection System

RupeeGuard AI is a state-of-the-art counterfeit currency verification platform. It combines a deep learning classification pipeline (CNN + Vision Transformer Fusion) with a vector-database Retrieval-Augmented Generation (RAG) system to inspect Indian banknotes and output plain-English forensic reports for bank tellers.

The visual direction follows a **"techy meets heritage"** theme — blending a modern dark glassmorphic AI-product interface (neon lasers, active viewfinders) with geometric motifs inspired by traditional Indian art (rotating Ashoka Chakras, diagonal Mughal jali lattice backdrops, and paisley delimiters).

---

## Key Features

1. **Dual Neural Net Engine**: Uses a fused classifier (EfficientNet-B4 + ViT-Base) to assess banknote characteristics.
2. **14-Step Forensic Validation Checklist**: Ticks off security indicators (OVI thread, watermarks, microprinting) sequentially during inspection.
3. **Dynamic Ashoka Chakra Confidence Dial**: A 24-spoke progress circle that fills up to indicate classification confidence.
4. **Interactive Heatmap Overlay (Explainability)**: Toggles simulated GradCAM attention heatmaps over the note image.
5. **Session Scan History Panel**: A client-side memory bank showing thumbnails, verdicts, and confidence logs from the current session.
6. **Zero-Asset Audio cues**: Uses the browser's built-in **Web Audio API** to synthesize scan sound effects and success/error chord chimes without relying on external media files.
7. **Robust RAG Fallback**: Upgraded API error-trapping returns detailed text-based reports even if Gemini keys or internet access are unavailable during demo setups.

---

## Compliance & Security Constraints

To respect copyright regulations and national currency guidelines, the system adheres to strict visual rules:
- **No portraits or likeness of real people** (including Mahatma Gandhi) are present or generated.
- **No verbatim copying or tracing** of exact note layouts, security thread designs, or typography.
- **No verbatim reproduction of official emblems** (RBI seal, Ashoka Pillar emblem). Replaced with generic original geometric interpretations.
- Decorative motifs represent generic historic architectural and textile patterns (jali, mandala, paisley) rather than specific monuments.

---

## Directory Structure

```text
rupeeguard-ai/
├── app/
│   ├── main.py            # FastAPI main router (serves built React pages & handles /predict)
│   └── templates/
│       └── index.html      # Server-side HTML fallback page
├── src/
│   ├── model.py           # PyTorch CNN + ViT Multihead Attention fusion model definition
│   └── rag_llm.py         # FAISS retrieval & Gemini report synthesis logic
├── models/
│   └── fusion_model.pt    # Pre-trained classification model weights
├── frontend/
│   ├── index.html         # Frontend container
│   ├── vite.config.js     # Dev server proxy configuration
│   ├── tailwind.config.js # Theme color overrides (Saffron, Heritage Green/Blue)
│   ├── src/
│   │   ├── index.css      # Core styles & diagonal SVG jali repeating patterns
│   │   ├── App.jsx        # Routing, sound synthesis, and page wrapper
│   │   └── components/    # Reusable modular React components
│   └── dist/              # Built compiled production files
└── README.md              # Project documentation
```

---

## Installation & Running

### Prerequisites

- **Python 3.10+** (Virtual environment recommended)
- **Node.js 18+** & **npm 9+**

### Setup Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AnshSingh-2024/RupeeGuard-AI.git
   cd RupeeGuard-AI
   ```

2. **Initialize Python virtual environment**:
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt # (if present, or ensure dependencies like torch, fastapi, uvicorn, timm, sentence-transformers, faiss-cpu, google-genai are installed)
   ```

3. **Install Frontend packages**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

### Running the App

#### Option A: Production Mode (Recommended)
This runs the entire app served from the FastAPI backend.

1. **Compile the React production build**:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```
2. **Launch the FastAPI server**:
   ```bash
   .venv\Scripts\python -m uvicorn app.main:app --reload
   ```
3. **Open browser**: Go to [http://localhost:8000](http://localhost:8000).

#### Option B: Development Mode (Hot-Reloading)
Run two parallel processes for instant frontend compilation.

1. **Start Backend Server**:
   ```bash
   .venv\Scripts\python -m uvicorn app.main:app --reload
   ```
   *(Backend API runs on port `8000`)*

2. **Start Frontend Server** (In a new terminal window):
   ```bash
   cd frontend
   npm run dev
   ```
   *(Frontend runs on port `5173`)*

3. **Open browser**: Go to [http://localhost:5173](http://localhost:5173).
