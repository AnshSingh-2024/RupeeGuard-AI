import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import FastAPI, UploadFile
from fastapi.responses import HTMLResponse
import torch
from torchvision import transforms
from PIL import Image
import io

from src.model import RupeeGuardFusion
from src.rag_llm import retrieve, generate_report

app = FastAPI()

device = torch.device('cpu')
model = RupeeGuardFusion()
model.load_state_dict(torch.load("models/fusion_model.pt", map_location=device))
model.eval()

transform = transforms.Compose([
    transforms.Resize((384, 384)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

classes = ['fake', 'genuine']

@app.get("/", response_class=HTMLResponse)
async def home():
    return open("app/templates/index.html").read()

@app.post("/predict")
async def predict(file: UploadFile):
    img_bytes = await file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        output = model(tensor)
        probs = torch.softmax(output, dim=1)[0]
        pred_idx = torch.argmax(probs).item()
        verdict = classes[pred_idx]
        confidence = float(probs[pred_idx]) * 100

    query = "security thread colour change" if verdict == "fake" else "watermark portrait"
    chunks = retrieve(query)
    report = generate_report(verdict.upper(), round(confidence, 2), chunks)

    return {
        "verdict": verdict,
        "confidence": round(confidence, 2),
        "forensic_report": report
    }