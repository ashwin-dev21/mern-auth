import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import dotenv from 'dotenv/config';
import transporter from '../config/nodemailer.js';

// console.log("Request received");
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email and password' });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        // res.status(201).json({ message: 'User registered successfully' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sending welcome email

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our App',
            text : `Welcome to our website,your account has been created with the email ${email}. We're glad to have you on board!`
        };
        await transporter.sendMail(mailOptions);

        return res.json({ success: true });

    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        } 
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ success: true, message: 'Login successful' });    
    }catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const logout = (req, res) => {
try {    
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    });
    res.status(200).json({ success: true, message: 'Logout successful' });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });}    
} 

//send verification otp to users email
export const sendVerifyOtp = async (req, res) => {
    try {
        const  userId  = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if(user.isAccountVerified){
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000; // OTP valid for 24 hours

        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text : `Your OTP for account verification is ${otp}. Verify Using this OTP .`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'OTP sent to email' });
    }catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.userId;
        if (!userId || !otp) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        try {
                const user = await userModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                if(user.verifyOtp === '' || user.verifyOtp!== otp){
                    return res.status(400).json({ success: false, message: 'Invalid OTP' });
                }

                if(user.verifyOtpExpiryAt < Date.now()){
                    return res.status(400).json({ success: false, message: 'OTP expired' });
                }
                user.isAccountVerified = true;
                user.verifyOtp = '';
                user.verifyOtpExpiryAt = 0;
                await user.save();
                res.status(200).json({ success: true, message: 'Email verified successfully' });

        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const isAuthenticated = (req, res) => {
    try{
        return res.status(200).json({ success: true, message: 'User is authenticated' });
    }catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}   

//send password reset otp to users email
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes

        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text : `Your OTP for password reset is ${otp}. Use this OTP to reset your password.`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'OTP sent to email' });
    }catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}   

//reset password using otp
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        if(user.resetOtpExpiryAt < Date.now()){
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiryAt = 0;
        await user.save();
        res.status(200).json({ success: true, message: 'Password reset successful' });
    }catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}   
