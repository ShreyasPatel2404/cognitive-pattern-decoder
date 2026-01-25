import joblib
import pandas as pd
from preprocess import preprocess_data

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

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
