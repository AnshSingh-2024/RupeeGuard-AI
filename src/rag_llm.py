from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
from google import genai as genai_client

rbi_chunks = [
    "The Rs 500 note has a windowed security thread inscribed Bharat and RBI, which shifts from green to blue when tilted.",
    "The Rs 2000 note features a see-through register and a latent image of the denomination visible at eye level.",
    "Optically Variable Ink (OVI) is used on the denomination numeral, changing colour from green to blue when tilted.",
    "Intaglio printing gives a raised feel to the Mahatma Gandhi portrait, RBI seal, guarantee clause, and Ashoka Pillar emblem.",
    "Micro-lettering of RBI and the denomination value is printed between the vertical band and portrait, visible under magnification.",
    "A see-through register on the left of the watermark window shows the denomination numeral when held against light.",
    "UV-fluorescent security fibres are randomly dispersed in the note and glow under ultraviolet light.",
    "The portrait watermark of Mahatma Gandhi is visible when the note is held against light, matching the printed portrait.",
]

embedder = SentenceTransformer('all-MiniLM-L6-v2')
chunk_embeddings = embedder.encode(rbi_chunks)
index = faiss.IndexFlatL2(chunk_embeddings.shape[1])
index.add(np.array(chunk_embeddings))

def retrieve(query, k=3):
    q_emb = embedder.encode([query])
    distances, indices = index.search(q_emb, k)
    return [rbi_chunks[i] for i in indices[0]]



def generate_report(verdict, confidence, retrieved_chunks):
    client = genai_client.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    prompt = f"""You are a forensic currency analyst. Note classified as: {verdict} (confidence: {confidence}%).
Relevant RBI security feature info: {' '.join(retrieved_chunks)}
Write a 100-word plain-English explanation for a bank teller, citing the relevant feature."""
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    return response.text

if __name__ == "__main__":
    chunks = retrieve("security thread colour change")
    print("Retrieved:", chunks)
    report = generate_report("COUNTERFEIT", 94.2, chunks)
    print("\nReport:\n", report)