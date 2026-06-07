from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from datetime import datetime
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError, Field
from predict import predict_user
import matplotlib
matplotlib.use('Agg') # Fix for "main thread is not in main loop" error
import matplotlib.pyplot as plt
import io
import base64
import numpy as np
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler for Validation Errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation Error: {exc}")
    body = await request.json()
    logger.error(f"Request Body: {body}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": body},
    )

class PredictRequest(BaseModel):
    typingSpeed: float = Field(..., gt=0, description="Characters per minute")
    avgPauseTime: float = Field(..., ge=0, description="Pauses per minute")
    backspaceCount: float = Field(..., ge=0, description="Percentage of deletions")
    fileSwitchCount: int = Field(..., ge=0, description="Navigation event count")
    
    # Optional fields for compatibility
    saveCount: int = 0
    compileAttempts: int = 0
    sessionDuration: float = 0
    pasteCount: int = 0
    pasteCharacters: int = 0
    pasteRatio: float = 0
    accuracyRate: float = 0
    userId: str = None
    typedChars: int = 0
    cursorMoveCount: int = 0

class SessionData(BaseModel):
    typingSpeed: float = 0
    backspaceCount: int = 0
    avgPauseTime: float = 0
    saveCount: int = 0
    compileAttempts: int = 0
    fileSwitchCount: int = 0
    sessionDuration: float = 0
    pasteCount: int = 0
    pasteCharacters: int = 0
    pasteRatio: float = 0
    accuracyRate: float = 0
    # Optional fields
    userId: str = None
    typedChars: int = 0
    cursorMoveCount: int = 0

def generate_visualization(data: dict, cognitive_style: str):
    """
    Generate a radar chart or bar chart for the session metrics.
    Returns base64 encoded string.
    """
    try:
        # Metrics to visualize
        labels = ['Speed', 'Accuracy', 'Paste Ratio', 'Pauses', 'Deletions']
        
        # Helper to strict float conversion
        def get_val(key, default=0):
            try:
                return float(data.get(key, default))
            except:
                return default
        
        # Scale values roughly to 0-100 range for the chart
        values = [
            min(get_val('typingSpeed') * 1.5, 100),     # wpm approx scale
            get_val('accuracyRate'),                    # %
            get_val('pasteRatio'),                      # %
            min(get_val('avgPauseTime') * 10, 100),     # seconds scaled
            min(get_val('backspaceCount') * 2, 100)     # count scaled
        ]
        
        # Create figure
        plt.figure(figsize=(6, 4))
        plt.bar(labels, values, color=['#3274d9', '#299c46', '#e0bf00', '#f2495c', '#9333ea'])
        plt.title(f"Session Analysis: {cognitive_style}", color='white')
        plt.ylim(0, 100)
        
        # Styling for dark theme integration
        ax = plt.gca()
        ax.set_facecolor('#1f2937') # Dark gray background
        plt.gcf().patch.set_facecolor('#1f2937')
        ax.tick_params(colors='white')
        ax.spines['bottom'].set_color('white')
        ax.spines['top'].set_color('white') 
        ax.spines['left'].set_color('white')
        ax.spines['right'].set_color('white')
        
        # Save to BytesIO
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close()
        buf.seek(0)
        
        # Convert to Base64
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        return image_base64
    except Exception as e:
        logger.error(f"Visualization Error: {e}")
        return None

@app.get("/")
def root():
    return {"message": "ML Service is running 🚀"}

@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.post("/predict")
def predict(session: PredictRequest):
    try:
        # Convert Pydantic model to dict
        data_dict = session.dict()
        
        # --- DATA CLEANING ---
        # Ensure all numeric fields are actually numbers if they came as strings (unlikely with Pydantic, but possible with relaxed types)
        # Pydantic's default coerce should handle "123" -> 123
        
        # The model expects 'sessionTime' but frontend sends 'sessionDuration'
        if 'sessionTime' not in data_dict or data_dict['sessionTime'] == 0:
            data_dict['sessionTime'] = data_dict.get('sessionDuration', 0)
            
        # The model expects 'typedChars'. Estimate if missing.
        if 'typedChars' not in data_dict or data_dict['typedChars'] == 0:
            wpm = float(data_dict.get('typingSpeed', 0))
            minutes = float(data_dict.get('sessionTime', 0)) / 60
            if minutes > 0:
                data_dict['typedChars'] = int(wpm * minutes * 5)
            else:
                data_dict['typedChars'] = 0
        # ---------------------
        
        logger.info(f"Predicting for data: {data_dict}")

        logger.info(f"Predicting for data: {data_dict}")

        # Predict Cluster & Confidence
        # Now expects a tuple: (cluster_id, confidence_score)
        cluster, confidence = predict_user(data_dict)
        
        # Map Cluster to Meaning
        meanings = {
            0: "Fast & Confident Coder",
            1: "Careful Problem Solver",
            2: "Debugging / Copy-Paste Style"
        }
        
        cognitive_style = meanings.get(cluster, "Balanced Developer")
        
        # Format confidence as percentage (0-100) or keep 0-1 depending on frontend expectation
        # Frontend seems to expect 0-1 fraction or percentage? 
        # Dashboard.jsx uses: value={`${Math.round(confidence * 100)}%`} usually.
        # Let's keep it 0.0 - 1.0 float here.
        
        # Generate Visualization
        visualization = generate_visualization(data_dict, cognitive_style)
        
        return {
            "cognitive_style": cognitive_style,
            "confidence": confidence,
            "visualization": visualization
        }
    except Exception as e:
        logger.error(f"Prediction Logic Error: {e}")
        # Log full traceback
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"ML Service Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
