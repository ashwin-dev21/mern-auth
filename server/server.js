import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.set('trust proxy', 1);

// Allowed origins list
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4000',
  process.env.CLIENT_URL,
  'https://mern-auth-six-alpha.vercel.app' // Added directly as a fallback
].filter(Boolean);

app.use(express.json());
app.use(cookieParser());

// Robust CORS Middleware configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handlers
app.get('/hello', (req, res) => res.send('Hello World!'));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));