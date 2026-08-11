import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userAuth = (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please login"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token"
            });
        }

        // Attach userId to request
        req.userId = decoded.userId;

        next();

    } catch (error) {
        console.error("userAuth Error:", error);

        return res.status(401).json({
            success: false,
            message: "Unauthorized: Token expired or invalid"
        });
    }
    console.log("Cookies:", req.cookies);
};

export default userAuth;