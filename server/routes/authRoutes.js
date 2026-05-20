import express from 'express';
import { register, login, logout, sendVerifyOtp , verifyEmail,resetPassword, sendResetOtp, isAuthenticated} from '../controllers/authController.js';
import userAuth  from '../middleware/userAuth.js';


const authrouter = express.Router();

// Register a new user
authrouter.post('/register', register);

// Login a user
authrouter.post('/login', login);

//logout a user
authrouter.post('/logout', logout);

//send verification otp to users email
authrouter.post('/send-verify-otp', userAuth, sendVerifyOtp);

//verify email using otp
authrouter.post('/verify-account', userAuth, verifyEmail);

//isAuthinticated 
authrouter.get('/is-auth', userAuth, isAuthenticated);
 
//send reset otp
authrouter.post('/send-reset-otp', sendResetOtp);

//send reset password using otp
authrouter.post('/reset-password', resetPassword);


export default authrouter;