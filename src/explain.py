import torch
import numpy as np
import matplotlib.pyplot as plt
from torchvision import transforms, datasets
from src.model import RupeeGuardFusion

device = torch.device('cpu')
model = RupeeGuardFusion()
model.load_state_dict(torch.load("models/fusion_model.pt", map_location=device))
model.eval()

transform = transforms.Compose([
    transforms.Resize((384, 384)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

dataset = datasets.ImageFolder("data", transform=transform)
classes = dataset.classes
print("Classes:", classes)

def occlusion_importance(img_tensor, patch_size=48, stride=48):
    img_tensor = img_tensor.unsqueeze(0)
    with torch.no_grad():
        base_out = torch.softmax(model(img_tensor), dim=1)
        base_conf = base_out.max().item()
        base_class = base_out.argmax().item()

    _, _, H, W = img_tensor.shape
    heatmap = np.zeros((H // stride, W // stride))

    for i, y in enumerate(range(0, H - patch_size, stride)):
        for j, x in enumerate(range(0, W - patch_size, stride)):
            occluded = img_tensor.clone()
            occluded[:, :, y:y+patch_size, x:x+patch_size] = 0
            with torch.no_grad():
                out = torch.softmax(model(occluded), dim=1)
                conf = out[0, base_class].item()
            heatmap[i, j] = base_conf - conf
    return heatmap, base_class, base_conf

img_tensor, label = dataset[0]
heatmap, pred_class, conf = occlusion_importance(img_tensor)

plt.figure(figsize=(6,5))
plt.imshow(heatmap, cmap='hot')
plt.colorbar(label='Importance (confidence drop)')
plt.title(f"pred: {classes[pred_class]} ({conf:.2f})")
plt.savefig("outputs/occlusion_importance.png", bbox_inches='tight')
print("Saved to outputs/occlusion_importance.png")