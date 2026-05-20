import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();    

const userAuth = (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.userId) {

            req.userId = tokenDecode.userId;

            next();

        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }

    } catch (error) {

        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default userAuth;