import matplotlib.pyplot as plt
from pathlib import Path
from PIL import Image
import random

BASE = Path(r"C:\Users\ansh\rupeeguard-ai")
genuine_dir = BASE / "data/genuine"
fake_dir = BASE / "data/fake"

genuine_samples = random.sample(list(genuine_dir.glob("*")), 4)
fake_samples = random.sample(list(fake_dir.glob("*")), 4)

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
for i, img_path in enumerate(genuine_samples):
    axes[0, i].imshow(Image.open(img_path))
    axes[0, i].set_title(f"genuine\n{img_path.name}", fontsize=8)
    axes[0, i].axis("off")
for i, img_path in enumerate(fake_samples):
    axes[1, i].imshow(Image.open(img_path))
    axes[1, i].set_title(f"fake\n{img_path.name}", fontsize=8)
    axes[1, i].axis("off")
plt.tight_layout()
plt.savefig(BASE / "outputs" / "dataset_check.png")
plt.show()
print("Saved preview to outputs/dataset_check.png")