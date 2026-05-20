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

// const allowedOrigins = [''];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
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
