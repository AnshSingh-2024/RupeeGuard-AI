import shutil
from pathlib import Path

BASE = Path(r"C:\Users\ansh\rupeeguard-ai")

GENUINE_SOURCES = [
    BASE / "data/raw/mendeley_subset",
    BASE / "data/raw/kaggle_extracted/indian currency/REAL 500",
    BASE / "data/raw/kaggle_extracted/indian currency/real 500 AUGUMENTED",
    BASE / "data/raw/github_extracted/Fake-Currency-Detection-System-main/Project_files/Dataset/500_dataset",
    BASE / "data/raw/github_extracted/Fake-Currency-Detection-System-main/Project_files/Dataset/2000_dataset",
]

FAKE_SOURCES = [
    BASE / "data/raw/kaggle_extracted/indian currency/FAKE 500",
    BASE / "data/raw/kaggle_extracted/indian currency/FAKE 500  AUGUMENTED",
    BASE / "data/raw/github_extracted/Fake-Currency-Detection-System-main/Project_files/Fake Notes/500",
    BASE / "data/raw/github_extracted/Fake-Currency-Detection-System-main/Project_files/Fake Notes/2000",
]

dest_genuine = BASE / "data/genuine"
dest_fake = BASE / "data/fake"
dest_genuine.mkdir(parents=True, exist_ok=True)
dest_fake.mkdir(parents=True, exist_ok=True)

def copy_all_images(sources, dest, label):
    counter = 0
    for src in sources:
        if not src.exists():
            print(f"SKIPPED (not found): {src}")
            continue
        for img in src.glob("*"):
            if img.suffix.lower() in [".jpg", ".jpeg", ".png"]:
                new_name = f"{label}_{counter:05d}{img.suffix.lower()}"
                shutil.copy(img, dest / new_name)
                counter += 1
    print(f"Copied {counter} images into {dest}")

copy_all_images(GENUINE_SOURCES, dest_genuine, "genuine")
copy_all_images(FAKE_SOURCES, dest_fake, "fake")