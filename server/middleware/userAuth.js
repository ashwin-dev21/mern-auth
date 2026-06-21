import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userAuth = (req, res, next) => {
    try {
        //  Get token from Authorization header
        const authHeader = req.headers.authorization;

        console.log("Auth Header:", authHeader);

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
        }

        // Format: "Bearer <token>"
        const token = authHeader.split(' ')[1];

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid token format'
            });
        }

        // 🔐 Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid token'
            });
        }

        //  Attach userId to request
        req.userId = decoded.userId;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Token invalid or expired'
        });
    }
};

export default userAuth;