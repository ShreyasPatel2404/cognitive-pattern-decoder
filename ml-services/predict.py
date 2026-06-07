import joblib
import os
import pandas as pd
from preprocess import preprocess_data
from train import train_model

MODEL_PATH = "model/kmeans_model.pkl"
SCALER_PATH = "model/scaler.pkl"

def load_or_train_model():
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        print("Model loaded from disk")
    else:
        model, scaler = train_model()
        os.makedirs("model", exist_ok=True)
        joblib.dump(model, MODEL_PATH)
        joblib.dump(scaler, SCALER_PATH)
        print("Model trained and saved to disk")
    return model, scaler

model, scaler = load_or_train_model()

def predict_user(session_data):
    df = pd.DataFrame([session_data])
    X = preprocess_data(df)
    X_scaled = scaler.transform(X)
    
    # Get cluster prediction
    cluster = model.predict(X_scaled)[0]
    
    # Calculate Confidence (Distance to nearest centroid)
    # Transform returns distance to all centroids
    distances = model.transform(X_scaled)[0]
    min_dist = distances[cluster]
    
    # Heuristic for confidence: 1 / (1 + distance)
    # The closer to the centroid, the higher the confidence
    confidence = 1.0 / (1.0 + min_dist)
    
    return int(cluster), float(confidence)
