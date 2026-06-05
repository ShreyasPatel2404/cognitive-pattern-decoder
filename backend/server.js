require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Import Routes
const authRoutes = require("./routes/auth.routes");
const sessionRoutes = require("./routes/session.routes");
const projectRoutes = require("./routes/project.routes");
const mlResultRoutes = require("./routes/mlresult.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

const corsOptions = {
  origin: '*', // Allows any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allows all standard methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Ensures headers for JSON/Auth work
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect Database
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/predict", require("./routes/predict")); // New Predict Route
app.use("/api/mlresults", mlResultRoutes); // Keep for legacy if needed, or remove
app.use("/api/users", userRoutes);
app.use("/api/compare", require("./routes/compare.routes"));

app.get("/", (req, res) => {
  res.send("Cognitive Pattern Decoder Backend Running");
});

// Error handler (must be last)
app.use(errorHandler);
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

// Global error handler — must be last
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

//testing extension connection with backend
//test connection with NGROK