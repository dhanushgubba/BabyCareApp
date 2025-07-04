import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

# Create a synthetic dataset for baby cry classification
# This is a simplified model for demonstration purposes
X, y = make_classification(
    n_samples=100,
    n_features=60,  # Match the feature size from our feature extraction (40 mfcc + 12 chroma + 7 contrast + 1 zcr)
    n_informative=20,
    n_redundant=10,
    n_classes=5,
    random_state=42
)

# Create class labels that make sense for baby cries
class_names = ['hunger', 'tiredness', 'discomfort', 'needs attention', 'burping']

# Train a simple Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)
model.classes_ = np.array([0, 1, 2, 3, 4])  # Ensure class indices are as expected

# Save the model
joblib.dump(model, "CryMLClassifier_random_forest_new.pkl")

print("Created new compatible model: CryMLClassifier_random_forest_new.pkl")
print(f"Model trained with scikit-learn version: {joblib.__version__}")
print(f"Class names: {class_names}")
