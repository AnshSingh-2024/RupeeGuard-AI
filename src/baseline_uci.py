import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

BASE = Path(r"C:\Users\ansh\rupeeguard-ai")
data_path = BASE / "data/raw/uci_extracted/data_banknote_authentication.txt"

cols = ['variance', 'skewness', 'curtosis', 'entropy', 'label']
df = pd.read_csv(data_path, names=cols)

print("First 5 rows:")
print(df.head())
print("\nLabel counts (0=genuine, 1=fake):")
print(df['label'].value_counts())

X = df[['variance', 'skewness', 'curtosis', 'entropy']]
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
acc = accuracy_score(y_test, preds)
print(f"\nTest Accuracy: {acc:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, preds))