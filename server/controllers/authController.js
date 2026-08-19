import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import dotenv from 'dotenv/config';
import axios from 'axios';
import transporter from '../config/nodemailer.js';

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide name, email and password"
        });
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // false in local dev
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password"
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });  

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Use 'lax' on localhost
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* =========================
   LOGOUT (frontend handles token removal)
========================= */
export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        // 1. Use clearCookie instead of res.cookie
        // 2. Pass 'token' as a string literal
        // 3. Match the sameSite settings used during login ('lax' for local dev)
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
/* =========================
   SEND VERIFY OTP
========================= */
export const sendVerifyOtp = async (req, res) => {
    try {
        // Matches req.userId attached by your userAuth middleware
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID missing from request"
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({
                success: false,
                message: "Account is already verified"
            });
        }

        // Generate 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours validity

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your verification OTP is ${otp}. Use this code to verify your account.`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Verification OTP Sent to Email"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
/* =========================
   VERIFY EMAIL
========================= */
export const verifyEmail = async (req, res) => {
    // Read otp from body, and userId directly from req.userId
    const { otp } = req.body;
    const userId = req.userId;

    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message: "Missing required details"
        });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* =========================
   AUTH CHECK
========================= */
export const isAuthenticated = (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'User is authenticated'
    });
};


/* =========================
   SEND RESET OTP
========================= */
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}`
        });

        return res.status(200).json({
            success: true,
            message: 'OTP sent to email'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (user.resetOtpExpiryAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired'
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = '';
        user.resetOtpExpiryAt = 0;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};