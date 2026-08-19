import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.json({
                success: false,
                message: "Authentication token not found"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Handle both token payload formats (id or userId)
        if (decoded.id) {
            req.body.userId = decoded.id;
        } else if (decoded.userId) {
            req.body.userId = decoded.userId;
        } else {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        next();

    } catch (error) {
        console.log("AUTH MIDDLEWARE ERROR:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default userAuth;