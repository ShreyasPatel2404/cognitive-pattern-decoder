# BUILD.md — Cognitive Pattern Decoder
## Complete 21-Day Roadmap to a 10+ LPA Portfolio Project

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Feature Roadmap](#feature-roadmap)
5. [Phase 1 — Feature Parity + Foundation (Days 1–7)](#phase-1--feature-parity--foundation-days-17)
6. [Phase 2 — Power Features (Days 8–16)](#phase-2--power-features-days-816)
7. [Phase 3 — Deploy + Polish (Days 17–21)](#phase-3--deploy--polish-days-1721)
8. [Free Deployment Stack](#free-deployment-stack)
9. [Environment Variables Reference](#environment-variables-reference)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [Testing Strategy](#testing-strategy)
12. [Recruiter Talking Points](#recruiter-talking-points)
13. [Daily Execution Rules](#daily-execution-rules)

---

## Project Overview

**Cognitive Pattern Decoder** is a full-stack developer productivity tool that:
- Collects real-time keystroke telemetry via a VS Code extension
- Streams data to a Node.js backend via WebSockets
- Runs K-Means clustering in a Python ML service to classify your cognitive coding style
- Generates AI-powered personalized feedback using the Gemini LLM API
- Displays trends, history, and shareable result cards on a React dashboard

This is a **polyglot, microservices project** — TypeScript + JavaScript + Python — deployed fully for free using Vercel, Render, and MongoDB Atlas.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Developer's Machine                       │
│                                                                  │
│   ┌──────────────────────────────┐                               │
│   │   VS Code Extension           │  TypeScript                  │
│   │   - Captures keystrokes       │  - Typing speed              │
│   │   - Tracks pauses, deletions  │  - Pause patterns            │
│   │   - Streams via WebSocket     │  - Navigation events         │
│   └──────────────┬───────────────┘                               │
└──────────────────┼──────────────────────────────────────────────┘
                   │ WebSocket (real-time)
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Backend — Node.js + Express                    │
│                    Hosted on Render (free)                        │
│                                                                   │
│   - JWT Authentication         - Session Management              │
│   - WebSocket server           - MongoDB data storage            │
│   - ML Service proxy           - Gemini API integration          │
│   - Shareable link generation  - REST API                        │
└──────────┬───────────────────────────────────┬───────────────────┘
           │ HTTP                               │ HTTP
           ▼                                   ▼
┌──────────────────────┐           ┌───────────────────────────────┐
│  ML Service          │           │  MongoDB Atlas (free)          │
│  Python + FastAPI    │           │  - Users                       │
│  Hosted on Render    │           │  - Sessions                    │
│                      │           │  - LLM feedback cache          │
│  - K-Means predict   │           │  - Shared result links         │
│  - Radar/bar charts  │           └───────────────────────────────┘
│  - Confidence score  │
└──────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│                  Frontend — React + Tailwind CSS                   │
│                  Hosted on Vercel (free)                           │
│                                                                    │
│   - Live telemetry view       - Progress trend charts             │
│   - Cognitive profile card    - Session history                   │
│   - AI feedback panel         - Shareable result card             │
│   - Auth pages                - Responsive mobile UI              │
└────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| VS Code Extension | TypeScript, VS Code API | Native IDE integration |
| Backend | Node.js, Express, Socket.io | Real-time + REST API |
| Database | MongoDB + Mongoose | Flexible document storage |
| ML Service | Python, FastAPI, Scikit-learn | Clustering + chart generation |
| Frontend | React, Vite, Tailwind CSS, Recharts | Fast, modern UI |
| Auth | JWT (jsonwebtoken) | Stateless, scalable |
| LLM | Google Gemini API (free tier) | AI-powered feedback |
| Testing | Jest, Supertest, pytest, RTL | Full coverage |
| CI/CD | GitHub Actions | Auto test + deploy |
| Deployment | Vercel + Render + MongoDB Atlas | 100% free |

---

## Feature Roadmap

### Already working in your repo (DO NOT BREAK)
- [x] VS Code extension captures keystroke telemetry
- [x] Node.js backend with JWT auth (register/login)
- [x] Python ML service with K-Means clustering prediction
- [x] Cognitive style classification (Fast & Confident, Careful, etc.)
- [x] Dynamic confidence score
- [x] Visual charts from ML service (radar/bar)
- [x] Session history stored in MongoDB
- [x] React frontend with Tailwind CSS

### Missing from friend's repo (add in Phase 1)
- [ ] Proper README.md with architecture, setup, and env config
- [ ] Live deployed URL
- [ ] Root-level package.json with monorepo scripts
- [ ] .env.example files

### New recruiter-grade features (Phase 2)
- [ ] Real-time WebSocket telemetry (replace polling)
- [ ] Progress tracking dashboard with trend charts
- [ ] AI feedback via Google Gemini API
- [ ] Shareable result cards (PNG + public URL)
- [ ] Unit + integration tests with coverage badge
- [ ] VS Code extension polished to .vsix publishable state
- [ ] GitHub Actions CI/CD pipeline

### Phase 3
- [ ] Full free deployment (Vercel + Render + Atlas)
- [ ] Demo video (Loom)
- [ ] Architecture diagram in README
- [ ] GitHub profile pinning + LinkedIn update

---

## Phase 1 — Feature Parity + Foundation (Days 1–7)

### Day 1 — Repo Audit + README

**Goal:** Make the repo look professional from the first click.

**Tasks:**
1. Clone both repos and diff every file side by side
2. Write full `README.md` (see template below)
3. Create root `package.json` with monorepo scripts
4. Add `.env.example` for backend and frontend

**Root package.json to create:**
```json
{
  "name": "cognitive-pattern-decoder",
  "version": "1.0.0",
  "description": "Full-stack cognitive coding style analyzer",
  "scripts": {
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:ml": "cd ml-services && python app.py",
    "dev:extension": "cd vs-code-extension && npm run watch",
    "install:all": "cd backend && npm i && cd ../frontend && npm i && cd ../vs-code-extension && npm i",
    "test": "cd backend && npm test && cd ../frontend && npm test",
    "build:frontend": "cd frontend && npm run build",
    "build:extension": "cd vs-code-extension && npm run package"
  }
}
```

**README.md sections to write:**
- Project title + 1-line description
- Live demo link (add after Day 19)
- Architecture diagram (add after Day 20)
- Feature list with checkboxes
- Tech stack table
- Prerequisites (Node 18+, Python 3.10+, MongoDB)
- Step-by-step setup for all 4 services
- Environment variables reference
- How to install the VS Code extension
- Contributing guide
- License

**Deliverable:** README renders perfectly on GitHub, `.env.example` files present for both backend and frontend.

---

### Day 2 — Backend Stability + Auth Polish

**Goal:** Backend is rock-solid, all routes work, MongoDB is on Atlas.

**Tasks:**
1. Sign up for MongoDB Atlas → create free M0 cluster → get connection string
2. Audit all Express routes — test each one with Postman
3. Add global error handling middleware
4. Add user profile endpoint
5. Add `/health` endpoint

**Error middleware to add (`backend/middleware/errorHandler.js`):**
```js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
module.exports = errorHandler;
```

**Health endpoint to add:**
```js
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

**Profile endpoint to add:**
```js
// GET /api/user/profile  (protected route)
router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ success: true, data: user });
});
```

**Deliverable:** All backend routes tested and working with Atlas connection string.

---

### Day 3 — ML Service Hardening

**Goal:** Python service is production-ready with proper validation and a saved model.

**Tasks:**
1. Add Pydantic input validation to all endpoints
2. Train model once and save as `.pkl` file
3. Load `.pkl` on startup (don't retrain every request)
4. Add `/health` endpoint
5. Add proper requirements.txt with pinned versions

**Model save/load pattern:**
```python
import joblib, os

MODEL_PATH = "model/kmeans_model.pkl"
SCALER_PATH = "model/scaler.pkl"

def load_or_train_model():
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
    else:
        model, scaler = train_model()
        os.makedirs("model", exist_ok=True)
        joblib.dump(model, MODEL_PATH)
        joblib.dump(scaler, SCALER_PATH)
    return model, scaler

model, scaler = load_or_train_model()
```

**requirements.txt (pinned):**
```
fastapi==0.111.0
uvicorn==0.30.1
pandas==2.2.2
scikit-learn==1.5.0
matplotlib==3.9.0
numpy==1.26.4
joblib==1.4.2
pydantic==2.7.1
python-multipart==0.0.9
```

**Deliverable:** ML service starts in under 3 seconds, `/health` returns 200, predictions are consistent.

---

### Day 4 — Frontend UX Polish

**Goal:** Frontend is fully responsive, handles errors gracefully, has proper routing.

**Tasks:**
1. Audit all React components — fix broken ones
2. Add loading spinners to every async action
3. Add error toast notifications (use react-hot-toast — free)
4. Make the app fully mobile-responsive
5. Set up React Router properly (no page reloads on navigation)

**React Router setup (`frontend/src/App.jsx`):**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/session/:id" element={<PrivateRoute><SessionDetail /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/share/:token" element={<SharedResult />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Deliverable:** App works on mobile, no console errors, all routes navigate without full reload.

---

### Day 5 — VS Code Extension End-to-End Fix

**Goal:** Full pipeline works — type in VS Code, data appears in dashboard.

**Tasks:**
1. Test current extension → backend connection
2. Fix any telemetry payload structure mismatches
3. Add extension configuration (server URL in VS Code settings)
4. Add status bar item showing "CPD: Connected / Disconnected"
5. Test the full flow from scratch

**VS Code settings contribution (`package.json`):**
```json
"contributes": {
  "configuration": {
    "title": "Cognitive Pattern Decoder",
    "properties": {
      "cognitivePatternDecoder.serverUrl": {
        "type": "string",
        "default": "http://localhost:5000",
        "description": "Backend server URL"
      },
      "cognitivePatternDecoder.enabled": {
        "type": "boolean",
        "default": true,
        "description": "Enable telemetry collection"
      }
    }
  }
}
```

**Status bar item:**
```typescript
const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
statusBar.text = '$(pulse) CPD: Connecting...';
statusBar.show();

// On connect:
statusBar.text = '$(circle-filled) CPD: Active';
statusBar.backgroundColor = undefined;

// On disconnect:
statusBar.text = '$(circle-outline) CPD: Disconnected';
```

**Deliverable:** Open VS Code, type for 30 seconds, open dashboard, see session appear.

---

### Day 6 — Session History Feature

**Goal:** Users can view, navigate, and delete past sessions.

**Tasks:**
1. Build `/history` page with paginated session list
2. Each session card shows: date, cognitive style, confidence score, chart thumbnail
3. Click session → full detail view with chart + metrics
4. Add delete session button with confirmation dialog
5. Add empty state illustration when no sessions exist

**Session list component pattern:**
```jsx
const [sessions, setSessions] = useState([]);
const [page, setPage] = useState(1);
const LIMIT = 10;

useEffect(() => {
  axios.get(`/api/sessions?page=${page}&limit=${LIMIT}`)
    .then(res => setSessions(res.data.sessions));
}, [page]);
```

**Backend pagination:**
```js
router.get('/', authMiddleware, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const sessions = await Session
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Session.countDocuments({ userId: req.user.id });
  res.json({ sessions, total, pages: Math.ceil(total / limit) });
});
```

**Deliverable:** History page loads, pagination works, sessions are deletable.

---

### Day 7 — Phase 1 Integration Test

**Goal:** Every feature from Days 1–6 works together seamlessly.

**Tasks:**
1. Full end-to-end test on a fresh browser (incognito)
2. Test on mobile browser
3. Fix all remaining console errors and warnings
4. Test VS Code extension on a clean VS Code instance
5. Commit everything with clean commit messages
6. Tag the commit: `git tag v1.0.0-parity`

**Checklist before moving to Phase 2:**
- [ ] README renders correctly on GitHub
- [ ] `npm run install:all` works from root
- [ ] Backend starts and `/health` returns 200
- [ ] ML service starts and `/health` returns 200
- [ ] Frontend starts, login/register works
- [ ] VS Code extension connects and sends telemetry
- [ ] Session appears in dashboard after typing
- [ ] Session history page loads with pagination
- [ ] App is usable on a 375px mobile screen

---

## Phase 2 — Power Features (Days 8–16)

### Day 8 — Real-time WebSocket Telemetry

**Goal:** Replace HTTP polling with Socket.io for live data streaming.

**Install:**
```bash
# Backend
cd backend && npm install socket.io

# Frontend
cd frontend && npm install socket.io-client

# VS Code extension
cd vs-code-extension && npm install socket.io-client
```

**Backend Socket.io setup (`backend/server.js`):**
```js
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('telemetry', async (data) => {
    // Validate JWT from handshake
    // Save to MongoDB
    // Emit back to user's room
    socket.emit('telemetry:ack', { received: true });
    io.to(`user:${data.userId}`).emit('live:update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
```

**Deliverable:** Dashboard shows a live "● Recording" indicator when VS Code extension is active.

---

### Day 9 — Progress Tracking Dashboard

**Goal:** Users can see their cognitive style trend over time.

**Install:**
```bash
cd frontend && npm install recharts
```

**Components to build:**
- `TrendChart` — LineChart of confidence score over last 30 sessions
- `StyleDistribution` — PieChart of cognitive styles across all sessions
- `ImprovementCard` — Metric card showing score change vs last week
- `BestSessionCard` — Highlights the user's peak performance session

**Trend chart pattern:**
```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={240}>
  <LineChart data={sessions}>
    <XAxis dataKey="date" />
    <YAxis domain={[0, 100]} />
    <Tooltip />
    <Line type="monotone" dataKey="confidenceScore" stroke="#3B82F6" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

**Deliverable:** Dashboard has a trend section that loads from session history, visible improvement metrics.

---

### Day 10 — AI Feedback with Google Gemini API

**Goal:** After every ML analysis, generate natural language feedback using Gemini.

**Setup:**
1. Get free API key at aistudio.google.com
2. Set `GEMINI_API_KEY` in backend `.env`

**Install:**
```bash
cd backend && npm install @google/generative-ai
```

**Gemini service (`backend/services/geminiService.js`):**
```js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateFeedback(cognitiveStyle, metrics, confidenceScore) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert software engineering coach analyzing a developer's coding behavior.

Cognitive Style Detected: ${cognitiveStyle}
Confidence Score: ${confidenceScore}%
Metrics:
- Average typing speed: ${metrics.avgTypingSpeed} chars/min
- Pause frequency: ${metrics.pauseFrequency} pauses/min
- Deletion rate: ${metrics.deletionRate}%
- Navigation events: ${metrics.navigationEvents}

Provide:
1. A 2-sentence explanation of what this cognitive style means in practice
2. Three specific, actionable improvement tips for this developer
3. One strength to celebrate

Keep the tone encouraging and professional. Format as JSON:
{
  "explanation": "...",
  "tips": ["...", "...", "..."],
  "strength": "..."
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

module.exports = { generateFeedback };
```

**Caching pattern (save to MongoDB to avoid repeat calls):**
```js
// Check cache first
const cacheKey = `${cognitiveStyle}-${Math.round(confidenceScore)}`;
const cached = await FeedbackCache.findOne({ cacheKey });
if (cached) return cached.feedback;

// Generate + cache
const feedback = await generateFeedback(cognitiveStyle, metrics, confidenceScore);
await FeedbackCache.create({ cacheKey, feedback, createdAt: new Date() });
return feedback;
```

**Deliverable:** Every analysis result shows an "AI Insights" panel with explanation, 3 tips, and a strength.

---

### Day 11 — LLM Feedback Polish

**Goal:** Feedback is fully integrated, cached, and gracefully handles errors.

**Tasks:**
1. Show loading skeleton while Gemini generates
2. Add "Regenerate" button (clears cache for this session, calls again)
3. Add feedback to session history cards (collapsed by default, expand on click)
4. Handle Gemini rate limit (429) — show friendly message, retry after 5s
5. Unit test the Gemini service with a mock

**Deliverable:** LLM feedback works reliably, degrades gracefully if API is down.

---

### Day 12 — Shareable Result Cards

**Goal:** Users can download and share their cognitive profile as an image.

**Install:**
```bash
cd frontend && npm install html2canvas
```

**Shareable card component:**
```jsx
import html2canvas from 'html2canvas';

const downloadCard = async () => {
  const element = document.getElementById('result-card');
  const canvas = await html2canvas(element, { scale: 2 });
  const link = document.createElement('a');
  link.download = `cognitive-style-${session.id}.png`;
  link.href = canvas.toDataURL();
  link.click();
};
```

**Backend: generate shareable public link:**
```js
// POST /api/sessions/:id/share
router.post('/:id/share', authMiddleware, async (req, res) => {
  const token = crypto.randomBytes(16).toString('hex');
  await Session.findByIdAndUpdate(req.params.id, {
    shareToken: token,
    isPublic: true
  });
  res.json({ shareUrl: `${process.env.FRONTEND_URL}/share/${token}` });
});

// GET /api/sessions/shared/:token  (no auth needed)
router.get('/shared/:token', async (req, res) => {
  const session = await Session.findOne({ shareToken: req.params.token, isPublic: true });
  if (!session) return res.status(404).json({ message: 'Not found' });
  res.json({ session });
});
```

**Deliverable:** "Share" button generates a public link + PNG download works.

---

### Day 13 — Unit Tests: Backend

**Goal:** Backend has test coverage with a CI-ready test script.

**Install:**
```bash
cd backend && npm install --save-dev jest supertest mongodb-memory-server
```

**`backend/package.json` test config:**
```json
"jest": {
  "testEnvironment": "node",
  "coverageThreshold": {
    "global": { "lines": 60 }
  }
}
```

**Test files to write:**
- `tests/auth.test.js` — register, login, invalid credentials
- `tests/sessions.test.js` — create, read, delete, pagination
- `tests/health.test.js` — /health endpoint

**Example test:**
```js
const request = require('supertest');
const app = require('../app');

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'Test@1234', name: 'Test' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject duplicate email', async () => {
    // register twice
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'Test@1234', name: 'Test' });
    expect(res.statusCode).toBe(409);
  });
});
```

**Deliverable:** `npm test` runs all tests, coverage report generated.

---

### Day 14 — Unit Tests: ML Service + Frontend

**Goal:** Python service and React components have basic test coverage.

**ML Service tests (`ml-services/tests/test_predict.py`):**
```python
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200

def test_predict_valid_input():
    payload = {
        "typing_speed": 45.0,
        "pause_frequency": 3.2,
        "deletion_rate": 12.5,
        "navigation_events": 8
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    assert "cognitive_style" in response.json()
    assert "confidence_score" in response.json()

def test_predict_invalid_input():
    response = client.post("/predict", json={"typing_speed": "fast"})
    assert response.status_code == 422
```

**Run ML tests:**
```bash
cd ml-services && pip install pytest httpx && pytest tests/ -v
```

**Frontend test (`frontend/src/components/__tests__/LoginForm.test.jsx`):**
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';

test('shows error on empty submit', async () => {
  render(<LoginForm />);
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
});
```

**Add coverage badge to README:**
```markdown
![Tests](https://github.com/ShreyasPatel2404/cognitive-pattern-decoder/actions/workflows/ci.yml/badge.svg)
```

**Deliverable:** All 3 services have passing tests. Coverage badges configured.

---

### Day 15 — VS Code Extension Polish

**Goal:** Extension is publishable to VS Code Marketplace.

**Install:**
```bash
npm install -g @vscode/vsce
```

**`vs-code-extension/package.json` marketplace fields:**
```json
{
  "name": "cognitive-pattern-decoder",
  "displayName": "Cognitive Pattern Decoder",
  "description": "Analyzes your coding behavior to detect your cognitive style",
  "version": "1.0.0",
  "publisher": "ShreyasPatel",
  "icon": "images/icon.png",
  "categories": ["Other", "Machine Learning"],
  "keywords": ["productivity", "coding-style", "ml", "telemetry"],
  "repository": {
    "type": "git",
    "url": "https://github.com/ShreyasPatel2404/cognitive-pattern-decoder"
  },
  "engines": { "vscode": "^1.85.0" }
}
```

**Create 128x128 icon:**
- Use Canva (free) or generate with any image editor
- Save as `vs-code-extension/images/icon.png`

**Build the .vsix package:**
```bash
cd vs-code-extension && vsce package
# Outputs: cognitive-pattern-decoder-1.0.0.vsix
```

**Deliverable:** `cognitive-pattern-decoder-1.0.0.vsix` file exists, can be installed in VS Code via "Install from VSIX".

---

### Day 16 — GitHub Actions CI/CD

**Goal:** Automated test + deploy pipeline on every push to main.

**Create `.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: cd backend && npm ci
      - run: cd backend && npm test -- --coverage

  test-ml:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.10' }
      - run: cd ml-services && pip install -r requirements.txt pytest httpx
      - run: cd ml-services && pytest tests/ -v

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --watchAll=false
```

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    needs: [test-backend, test-ml, test-frontend]
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: '--prod'
```

**Note:** Render auto-deploys from GitHub push. No deploy action needed for backend/ML.

**GitHub Secrets to add (Settings → Secrets → Actions):**
- `VERCEL_TOKEN` — from vercel.com/account/tokens
- `VERCEL_ORG_ID` — from .vercel/project.json after `vercel link`
- `VERCEL_PROJECT_ID` — from .vercel/project.json

**Deliverable:** Push to main → tests run → frontend deploys automatically. CI badge shows green in README.

---

## Phase 3 — Deploy + Polish (Days 17–21)

### Day 17 — Deploy ML Service to Render

**Steps:**
1. Go to render.com → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `ml-services`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
6. Add a `Dockerfile` (more reliable than buildpacks):

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 10000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"]
```

**Deliverable:** `https://your-ml-service.onrender.com/health` returns `{"status": "ok"}`.

---

### Day 18 — Deploy Backend to Render

**Steps:**
1. render.com → New → Web Service
2. Root directory: `backend`
3. Build command: `npm ci`
4. Start command: `node server.js`
5. Add environment variables:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://...  (Atlas connection string)
JWT_SECRET=your-super-secret-key-min-32-chars
ML_SERVICE_URL=https://your-ml-service.onrender.com
GEMINI_API_KEY=AIza...
FRONTEND_URL=https://your-app.vercel.app
```

**Deliverable:** `https://your-backend.onrender.com/health` returns 200. Login works from Postman.

---

### Day 19 — Deploy Frontend to Vercel

**Steps:**
1. vercel.com → Add New → Project → Import Git Repository
2. Select your GitHub repo, set **Root Directory** to `frontend`
3. Framework preset: **Vite**
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
5. Deploy

**After deploy:**
1. Go to Render backend → update `FRONTEND_URL` to your Vercel URL
2. Add CORS origin for the Vercel URL in Express

**Uptime monitor (prevents Render cold starts):**
1. Go to uptimerobot.com → New Monitor
2. Type: HTTP(s), URL: `https://your-backend.onrender.com/health`
3. Interval: 5 minutes → keeps backend warm

**Deliverable:** `https://your-app.vercel.app` is live, full flow works end-to-end.

---

### Day 20 — README Final + Demo Video

**Tasks:**
1. Add live demo URL at the very top of README
2. Create architecture diagram PNG (use draw.io — free, export PNG)
3. Record a 2-minute Loom video (loom.com — free)
   - Show VS Code extension collecting data
   - Show dashboard with live update
   - Show AI feedback panel
   - Show shareable card download
4. Add Loom link and a GIF of the demo to README (use ScreenToGif — free)

**README top section template:**
```markdown
# Cognitive Pattern Decoder

> Analyzes your real-time coding behavior to detect and improve your cognitive style.

**[🚀 Live Demo](https://your-app.vercel.app)** · **[📺 Demo Video](https://loom.com/...)** · **[📦 VS Code Extension](link-to-vsix)**

![Tests](https://github.com/ShreyasPatel2404/cognitive-pattern-decoder/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-68%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

![Demo GIF](./docs/demo.gif)
```

**Deliverable:** README is recruiter-ready with live link, demo, and badges.

---

### Day 21 — Final Polish + GitHub Profile

**Tasks:**
1. Pin repository on GitHub profile (GitHub → Profile → Customize pins)
2. Add repository topics: `react`, `nodejs`, `python`, `machine-learning`, `fastapi`, `vscode-extension`, `socket-io`, `gemini-ai`, `jwt`, `mongodb`
3. Add project to LinkedIn (Featured section → Links → live demo URL)
4. Add project to your portfolio website if you have one
5. Final smoke test — run the entire flow one more time from scratch
6. Tag final release: `git tag v1.0.0 && git push --tags`
7. Create GitHub Release with the `.vsix` file as an asset

**Final checklist:**
- [ ] Live URL works and is fast (< 3s load)
- [ ] VS Code extension .vsix is attached to GitHub Release
- [ ] All 3 test suites pass in CI
- [ ] README has live link, demo video, architecture diagram, badges
- [ ] Repo is pinned on GitHub profile
- [ ] LinkedIn updated with live demo link

---

## Free Deployment Stack

| Service | Platform | Free Tier Limits | Purpose |
|---|---|---|---|
| Frontend | Vercel | Unlimited deploys, 100GB bandwidth | React app hosting |
| Backend | Render | 750 hrs/month, spins down after 15min | Node.js API |
| ML Service | Render | 750 hrs/month, spins down after 15min | Python FastAPI |
| Database | MongoDB Atlas | 512MB storage | User data, sessions |
| LLM API | Google Gemini | 15 req/min, 1M tokens/day | AI feedback |
| CI/CD | GitHub Actions | 2000 min/month | Auto test + deploy |
| Uptime Monitor | UptimeRobot | 50 monitors, 5-min interval | Keep Render warm |
| Demo Video | Loom | Unlimited videos (free plan) | Portfolio demo |

**Total monthly cost: ₹0**

---

## Environment Variables Reference

### Backend `.env`
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cognitive-decoder
JWT_SECRET=your-32-char-minimum-secret-key-here
ML_SERVICE_URL=http://localhost:5001
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### VS Code Extension (settings.json)
```json
{
  "cognitivePatternDecoder.serverUrl": "http://localhost:5000",
  "cognitivePatternDecoder.enabled": true
}
```

---

## CI/CD Pipeline

```
Developer pushes to main branch
         │
         ▼
GitHub Actions triggers
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Test Backend  Test ML + Frontend
(Jest)        (pytest + RTL)
    │         │
    └────┬────┘
         │ All tests pass
         ▼
  Deploy Frontend
  (Vercel Action)
         │
         ▼
  Render auto-deploys
  Backend + ML from GitHub
         │
         ▼
  UptimeRobot keeps
  services warm
```

---

## Testing Strategy

| Service | Framework | What to test | Target coverage |
|---|---|---|---|
| Backend | Jest + Supertest | Auth routes, session CRUD, ML proxy, error handling | 60%+ |
| ML Service | pytest + httpx | /predict endpoint, /health, invalid input handling | 70%+ |
| Frontend | React Testing Library | Login form, session list, result card, share button | 50%+ |

**Coverage badges** (add to README after CI setup):
```markdown
![Backend Coverage](https://img.shields.io/badge/backend%20coverage-65%25-brightgreen)
![ML Coverage](https://img.shields.io/badge/ml%20coverage-72%25-brightgreen)
```

---

## Recruiter Talking Points

When asked "Tell me about your project" in an interview:

> "I built a full-stack developer productivity tool called Cognitive Pattern Decoder. It has four components working together: a VS Code extension in TypeScript that collects real-time keystroke telemetry and streams it via WebSockets, a Node.js backend that handles authentication, data storage, and acts as an API gateway, a Python FastAPI ML service that runs K-Means clustering to classify cognitive coding styles, and a React dashboard that shows your trend over time. On top of that, I integrated the Google Gemini LLM API to generate personalized improvement tips based on your coding behavior. The whole system is deployed for free — frontend on Vercel, backend and ML on Render, database on MongoDB Atlas — with a GitHub Actions CI/CD pipeline that runs tests and auto-deploys on every push to main."

**Key technical questions you should be ready for:**
1. Why K-Means and not a supervised model? (No labeled training data — unsupervised is the right choice)
2. Why WebSockets over polling? (Lower latency, less server load, real-time UX)
3. How does JWT auth work? (Stateless token, server validates signature, no session storage)
4. How did you handle the ML service being slow? (Saved model as .pkl, load on startup)
5. What happens if Gemini API is down? (Cached responses in MongoDB, graceful fallback message)
6. How does your CI/CD work? (GitHub Actions runs tests on PR, deploys to Vercel on merge to main)

---

## Daily Execution Rules

1. **One day = one commit** — at the end of each day, commit all your work with a descriptive message like `feat: add WebSocket telemetry streaming (Day 8)`
2. **Never break what works** — test the existing flow after every change
3. **Ask Claude for Day N** — come back here and say "start Day N" for the actual code
4. **Don't skip days** — each day builds on the previous. If you're stuck, ask before moving on
5. **Commit even unfinished work** — a commit with WIP is better than losing a day's work
6. **Keep a simple log** — note what you finished and what you didn't each day in a `PROGRESS.md` file

---

## License

MIT — use this freely for your portfolio, studies, and job applications.

---

*Build plan version 1.0 — Generated June 2026*