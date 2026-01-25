# Cognitive Pattern Decoder

**Cognitive Pattern Decoder** is a full-stack application that analyzes a developer's coding behavior (typing speed, pauses, deletions, navigation) to predict their "Cognitive Style" (e.g., Fast & Confident, Careful Problem Solver).

It uses a **3-Layer Architecture** ensuring separation of concerns and scalability.

---

## 🏗 Architecture

The system consists of three distinct microservices integration:

1.  **Frontend (UI)**: React.js + Tailwind CSS
    *   Collects real-time keystroke metrics.
    *   Displays analysis results and visualizations.
2.  **Backend (API)**: Node.js + Express + MongoDB
    *   Acts as the secure gateway/middleware.
    *   Manages user sessions, authentication, and data storage.
    *   Forwards analysis requests to the ML Service.
3.  **ML Service (Intelligence)**: Python + FastAPI + Scikit-learn
    *   Receives raw metric data.
    *   Runs K-Means clustering prediction.
    *   Generates dynamic visualization charts (Matplotlib).

---

## 🚀 Features

*   **Real-time Analysis**: Instant feedback on your coding style.
*   **Cognitive Profiling**: Categorizes behavior into styles like "Fast & Confident" or "Debugging/Copy-Paste".
*   **Dynamic Confidence Score**: Calculates how closely you match a specific profile.
*   **Visual Data**: Generates radar/bar charts for each session.
*   **Session History**: Tracks your progress over time.
*   **Secure Integration**: No direct connection between Frontend and ML Service.

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd congnitive-pattern-decoder
```

### 2. ML Service Setup
```bash
cd ml-services
pip install fastapi uvicorn pandas scikit-learn matplotlib numpy joblib
# Run the service
python app.py
```
*Runs on `http://localhost:5001`*

### 3. Backend Setup
```bash
cd ../backend
npm install
# Configure .env (see specific section below)
npm start
```
*Runs on `http://localhost:5000`*

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Runs on `http://localhost:5173`*

---

## ⚙️ Configuration (.env)

**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cognitive-decoder
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://localhost:5001
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
