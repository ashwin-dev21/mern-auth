import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        console.log("COOKIE TOKEN:", token ? "FOUND" : "NOT FOUND");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token not found"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("TOKEN VERIFIED");
        console.log("USER ID:", decoded.userId);

        req.userId = decoded.userId;

        next();

    } catch (error) {
        console.error(" AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
};

export default userAuth;