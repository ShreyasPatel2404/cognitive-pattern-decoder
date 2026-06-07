import joblib
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from preprocess import preprocess_data

def train_model():
    print("Training model with synthetic data...")
    
    # Use synthetic data directly - don't attempt MongoDB connection
    synthetic_data = [
        # Style 0: Fast & Confident Coder (High speed, low pauses, few errors)
        {"typingSpeed": 80.0, "typedChars": 2000, "backspaceCount": 8, "pasteCount": 1, "avgPauseTime": 1.2, "sessionTime": 600.0},
        {"typingSpeed": 85.0, "typedChars": 2500, "backspaceCount": 10, "pasteCount": 2, "avgPauseTime": 1.5, "sessionTime": 700.0},
        {"typingSpeed": 90.0, "typedChars": 3000, "backspaceCount": 12, "pasteCount": 2, "avgPauseTime": 1.0, "sessionTime": 800.0},
        {"typingSpeed": 75.0, "typedChars": 1800, "backspaceCount": 6, "pasteCount": 1, "avgPauseTime": 1.8, "sessionTime": 550.0},
        {"typingSpeed": 88.0, "typedChars": 2800, "backspaceCount": 9, "pasteCount": 1, "avgPauseTime": 1.3, "sessionTime": 650.0},
        {"typingSpeed": 95.0, "typedChars": 3200, "backspaceCount": 11, "pasteCount": 2, "avgPauseTime": 0.9, "sessionTime": 750.0},
        
        # Style 1: Careful Problem Solver (Low speed, high pauses, careful thinking)
        {"typingSpeed": 40.0, "typedChars": 1000, "backspaceCount": 5, "pasteCount": 1, "avgPauseTime": 5.0, "sessionTime": 800.0},
        {"typingSpeed": 45.0, "typedChars": 1200, "backspaceCount": 6, "pasteCount": 2, "avgPauseTime": 4.5, "sessionTime": 900.0},
        {"typingSpeed": 38.0, "typedChars": 900, "backspaceCount": 4, "pasteCount": 1, "avgPauseTime": 5.5, "sessionTime": 750.0},
        {"typingSpeed": 50.0, "typedChars": 1400, "backspaceCount": 7, "pasteCount": 2, "avgPauseTime": 4.2, "sessionTime": 950.0},
        {"typingSpeed": 42.0, "typedChars": 1100, "backspaceCount": 5, "pasteCount": 1, "avgPauseTime": 5.8, "sessionTime": 850.0},
        {"typingSpeed": 48.0, "typedChars": 1300, "backspaceCount": 6, "pasteCount": 2, "avgPauseTime": 4.8, "sessionTime": 920.0},
        
        # Style 2: Debugging / Copy-Paste Style (Low speed, many deletions, high paste)
        {"typingSpeed": 30.0, "typedChars": 1500, "backspaceCount": 50, "pasteCount": 25, "avgPauseTime": 8.0, "sessionTime": 1200.0},
        {"typingSpeed": 35.0, "typedChars": 1800, "backspaceCount": 60, "pasteCount": 30, "avgPauseTime": 7.5, "sessionTime": 1300.0},
        {"typingSpeed": 28.0, "typedChars": 1400, "backspaceCount": 55, "pasteCount": 28, "avgPauseTime": 8.5, "sessionTime": 1100.0},
        {"typingSpeed": 32.0, "typedChars": 1600, "backspaceCount": 65, "pasteCount": 35, "avgPauseTime": 7.2, "sessionTime": 1250.0},
        {"typingSpeed": 25.0, "typedChars": 1300, "backspaceCount": 70, "pasteCount": 40, "avgPauseTime": 9.0, "sessionTime": 1350.0},
        {"typingSpeed": 36.0, "typedChars": 1900, "backspaceCount": 58, "pasteCount": 32, "avgPauseTime": 7.8, "sessionTime": 1280.0},
    ]
    df = pd.DataFrame(synthetic_data)
        
    print("Preprocessing...")
    X = preprocess_data(df)
    
    # 🔹 Normalize data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    print("Training KMeans...")
    model = KMeans(n_clusters=3, random_state=42)
    model.fit(X_scaled)
    
    return model, scaler

if __name__ == "__main__":
    model, scaler = train_model()
    import os
    os.makedirs("model", exist_ok=True)
    joblib.dump(model, "model/kmeans_model.pkl")
    joblib.dump(scaler, "model/scaler.pkl")
    print("Model and scaler saved!")
