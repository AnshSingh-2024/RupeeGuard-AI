# RupeeGuard AI — Counterfeit Indian Currency Detection System

[![Hugging Face Space](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Space-blue?style=for-the-badge)](https://huggingface.co/spaces/Anshsactivity/rupeeguard-ai)
[![Deployment](https://img.shields.io/badge/Deployed%20on-Hugging%20Face%20Spaces%20(Docker%20SDK)-orange?style=for-the-badge&logo=huggingface)](https://huggingface.co/spaces/Anshsactivity/rupeeguard-ai)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

An end-to-end system that detects counterfeit Indian currency notes using classical machine learning, deep learning (CNN + Vision Transformer fusion), explainable AI, and a RAG-powered LLM explanation layer, deployed as a full-stack web application.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Live Demo](#live-demo)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Datasets Used](#datasets-used)
6. [Results & Known Limitations](#results--known-limitations)
7. [Project Structure](#project-structure)
8. [Setup & Local Run Instructions](#setup--local-run-instructions)
9. [Deployment](#deployment)
10. [Honest Limitations](#honest-limitations)
11. [Future Work](#future-work)
12. [License](#license)

---

## Project Overview
RupeeGuard AI provides a counterfeit detection system for Indian currency notes. It integrates PyTorch deep learning models, GradCAM and sliding-window occlusion explainability, and a Retrieval-Augmented Generation (RAG) backend utilizing a FAISS vector index with the Google Gemini API to generate plain-English forensic explanation reports.

## Live Demo
The live application is hosted on Hugging Face Spaces:
* **Hugging Face Space**: [https://huggingface.co/spaces/Anshsactivity/rupeeguard-ai](https://huggingface.co/spaces/Anshsactivity/rupeeguard-ai)

---

## Tech Stack

| Domain | Technologies / Libraries |
| :--- | :--- |
| **ML / Deep Learning** | PyTorch, `timm` (EfficientNet-B4, ViT-B/16), scikit-learn |
| **Explainability** | `pytorch-grad-cam` (GradCAM), custom occlusion-based importance mapping |
| **GenAI / RAG** | `sentence-transformers` (all-MiniLM-L6-v2), FAISS, Google Gemini API (`google-genai` SDK) |
| **Backend** | FastAPI, Uvicorn |
| **Frontend** | React, Vite, Tailwind CSS |
| **Deployment** | Docker, Hugging Face Spaces (backend + frontend), model weights hosted on Hugging Face Hub |
| **Tooling** | Google Colab (GPU training), Git / GitHub |

---

## System Architecture

The application is structured into three main layers:

### 1. Detection Core
* **Classical ML Baseline**: A `RandomForestClassifier` trained on wavelet-transformed features from the UCI Banknote Authentication dataset (~99.27% accuracy).
* **Standalone Deep Learning**: An `EfficientNet-B4` model fine-tuned standalone, achieving 99.21% validation accuracy and a fake-class recall of 1.00.
* **Hybrid Deep Learning (RupeeGuardFusion)**: A custom fusion model combining `EfficientNet-B4` (for local texture features, 1792-dim) and `ViT-B/16` (for global structural features, 768-dim). Both feature vectors are projected to 512-dim, combined via an 8-head cross-attention module, and passed through an MLP classifier head (90.89% validation accuracy).

### 2. Explainability Layer
* **GradCAM**: Generates heatmaps targeting the final convolutional layer of the EfficientNet branch to visualize the regions of the note that most heavily influenced the classification verdict.
* **Occlusion-based Importance Mapping**: A custom, lightweight sliding-window patch masking method that measures changes/drops in prediction confidence per region to outline key areas as a resource-friendly SHAP-style alternative.

### 3. GenAI / RAG Layer
* **Retrieval-Augmented Generation**: Extracts details on RBI security features, embeds them using `sentence-transformers` (all-MiniLM-L6-v2), and indexes them in a local FAISS vector database. On prediction, queries retrieve matching RBI guidelines to ground Google Gemini prompts, generating verified, hallucination-free forensic report logs.

---

## Datasets Used

| Dataset Name | Source | Size | Use |
| :--- | :--- | :--- | :--- |
| **UCI Banknote Authentication Dataset** | UCI Machine Learning Repository | 1,372 records | Training and testing the classical ML baseline |
| **Mendeley Indian Currency Dataset** | Mendeley Data | ~1,500 image subset | Genuine note training data across multiple denominations |
| **Currency Dataset (500 INR note) real+fake** | Kaggle (by iayushanand) | Real & fake ₹500 images | Primary genuine/counterfeit classification training |
| **Fake-Currency-Detection-System** | GitHub (aprameya2001) | Small supplementary image set | Supplementary real/fake ₹500 and ₹2000 verification |

---

## Results & Known Limitations

### Model Validation Results
| Model | Metric | Value |
| :--- | :--- | :--- |
| **UCI Baseline (RandomForest)** | Test Accuracy | 99.27% |
| **EfficientNet-B4 (Standalone)** | Validation Accuracy | 99.21% |
| **EfficientNet-B4 (Standalone)** | Fake-Class Recall | 1.00 |
| **RupeeGuardFusion (CNN + ViT)** | Validation Accuracy | 90.89% |

### Identified Dataset / Prediction Bias
During testing, some fake notes were misclassified as genuine with high confidence. Root cause analysis indicates a photography-style bias in the training datasets (specifically, hand-held notes vs. notes shot on a flat surface) rather than a purely model-architectural failure. 

---

## Project Structure

```text
rupeeguard-ai/
├── app/                  # FastAPI backend (main.py) + templates
├── frontend/             # React + Vite + Tailwind CSS frontend source and static configs
├── src/                  # Application source logic
│   ├── model.py          # RupeeGuardFusion model class definition
│   ├── rag_llm.py        # FAISS vector database and Gemini RAG pipeline
│   ├── explain.py        # Occlusion-based region importance mapping
│   └── baseline_uci.py   # Baseline RandomForest implementation
├── data/                 # genuine/ and fake/ sorted training images (gitignored)
├── models/               # Directory for model weights (gitignored; weights pull from HF Hub)
├── notebooks/            # Colab notebooks used for model training and experiments
├── outputs/              # Saved GradCAM and occlusion explainability output images
├── Dockerfile            # Hugging Face Spaces Docker build configuration
├── requirements.txt      # Python dependencies list
└── sort_dataset.py       # Helper script to organize and partition raw images
```

---

## Setup & Local Run Instructions

Follow these steps to run the frontend and backend locally:

### 1. Environment Preparation
Clone the repository, initialize a Python virtual environment, and install dependencies:
```bash
git clone https://github.com/AnshSingh-2024/RupeeGuard-AI.git
cd RupeeGuard-AI
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Model Weights
Model checkpoints are hosted on the Hugging Face Hub and automatically fetched at runtime using `huggingface_hub.hf_hub_download` (no manual download steps are required).

### 3. Configure API Credentials
Expose your Gemini API key in your terminal:
```bash
export GEMINI_API_KEY="your_api_key_here"  # On Windows PowerShell use: $env:GEMINI_API_KEY="your_api_key_here"
```

### 4. Build the Frontend Assets
Navigate to the frontend folder, install npm dependencies, and compile Vite assets:
```bash
cd frontend
npm install
npm run build
cd ..
```

### 5. Start the Server
Run the FastAPI backend server using Uvicorn:
```bash
uvicorn app.main:app --reload
```

### 6. Access the Application
Open your browser and navigate to [http://localhost:8000](http://localhost:8000).

---

## Deployment
RupeeGuard AI is deployed using a custom **Dockerfile** on **Hugging Face Spaces** (Docker SDK). Hugging Face Spaces was chosen over Render's free tier because it offers a 16GB RAM limit, allowing the full PyTorch, sentence-transformers, and Vite assets compilation pipeline to run without encountering out-of-memory (OOM) errors. 

Model checkpoints are stored on the Hugging Face Hub and downloaded dynamically at container initialization via `huggingface_hub.hf_hub_download`.

---

## Honest Limitations
* **Fusion Model vs. Standalone Baseline**: The custom `RupeeGuardFusion` model accuracy (90.89%) is currently lower than the standalone fine-tuned `EfficientNet-B4` baseline (99.21%). This is attributed to limited training epochs under project time constraints and the inherent difficulty of jointly training two large backbones (CNN + ViT) from scratch/frozen projection layers.
* **Explainability Approximation**: Explainability features occlusion-based importance mapping rather than a full SHAP attribution, as the multi-label 14-feature auxiliary classifier head proposed in the initial spec was not trained within the project timeline.
* **Cold Starts**: Because of the hosting on Hugging Face Spaces free-tier resources, the container carries cold-start latency on the first request after an idle period.

---

## Future Work
* **Multi-Label Attribution**: Implement and train the multi-label security-feature auxiliary head to provide true SHAP-based feature attributions.
* **Expanded Datasets**: Source a larger, more balanced set of fake notes to reduce model variance and increase generalization.
* **Photography Bias Mitigation**: Introduce data augmentation to mitigate dataset collection styles (such as hand-held notes vs. document-scanner style alignments).
* **GPU Deployment**: Migrate hosting to GPU-backed nodes to reduce inference times.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
