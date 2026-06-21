import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

// Add this line to trust Render's proxy setup
app.set('trust proxy', 1);

// const allowedOrigins = [''];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://mern-auth-gamma-three.vercel.app',
    credentials: true
}));

//api endpoints
app.get('/hello', (req, res) => {
    console.log("Hello endpoint hit");
    res.send('Hello World!');
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
