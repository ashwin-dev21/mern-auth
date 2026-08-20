import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Trust Render's reverse proxy for secure cookie handling
app.set('trust proxy', 1);

// Configure dynamic CORS origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4000',
  process.env.CLIENT_URL // Deployed frontend URL from Render environment variables
].filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// API endpoints
app.get('/hello', (req, res) => {
  console.log("Hello endpoint hit");
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});