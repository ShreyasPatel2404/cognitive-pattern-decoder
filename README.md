# Cognitive Pattern Decoder

> Analyzes your real-time coding behavior to detect and visualize your cognitive coding style.

**[🚀 Live Demo](#)** · **[📺 Demo Video](#)** · **[📦 VS Code Extension](#)**

![Tests](https://github.com/ShreyasPatel2404/cognitive-pattern-decoder/actions/workflows/ci.yml/badge.svg)

---

## What it does

Type code in VS Code → the extension streams your keystroke patterns (speed, pauses, deletions) to a backend via WebSocket → a Python ML service classifies your Cognitive Style using K-Means clustering → your dashboard shows your profile, trend over time, and AI-generated improvement tips powered by Google Gemini.

## Architecture
VS Code Extension (TypeScript)
│  WebSocket
▼
Node.js + Express Backend  ──→  MongoDB Atlas
│  HTTP
▼
Python FastAPI ML Service
│
▼
React Dashboard (Vercel)

## Tech Stack

| Layer | Technology |
|---|---|
| VS Code Extension | TypeScript, VS Code API |
| Backend | Node.js, Express, Socket.io, JWT |
| Database | MongoDB + Mongoose |
| ML Service | Python, FastAPI, Scikit-learn |
| Frontend | React, Vite, Tailwind CSS, Recharts |
| AI Feedback | Google Gemini API |
| Deployment | Vercel + Render + MongoDB Atlas (all free) |

## Features

- Real-time keystroke telemetry via VS Code extension
- K-Means cognitive style classification (Fast & Confident, Careful, Debugging, etc.)
- Dynamic confidence score per session
- AI-generated personalized feedback (Gemini API)
- Progress tracking with trend charts
- Session history with pagination
- Shareable result cards (PNG + public link)
- JWT authentication

## Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local) or MongoDB Atlas account

### 1. Clone
```bash
git clone https://github.com/ShreyasPatel2404/cognitive-pattern-decoder
cd cognitive-pattern-decoder
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Configure environment variables
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both files with your values
```

### 4. Start all services
```bash
# Terminal 1 — ML Service
cd ml-services && pip install -r requirements.txt && python app.py

# Terminal 2 — Backend
npm run dev:backend

# Terminal 3 — Frontend
npm run dev:frontend
```

### 5. Install VS Code extension
Open VS Code → Extensions → ··· → Install from VSIX → select `vs-code-extension/cognitive-pattern-decoder.vsix`

Open VS Code settings and set:
```json
{
  "cognitivePatternDecoder.serverUrl": "http://localhost:5000"
}
```

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

## License

MIT

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
