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

 
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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