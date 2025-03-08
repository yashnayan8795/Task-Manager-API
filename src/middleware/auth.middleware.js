import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import 'dotenv/config';
import asyncWrapper from '../utils/asyncWrapper.js';

const authMiddleware = asyncWrapper( async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user) 
            return res.status(401).json({ message: "User no longer exists" });
        req.user = decoded.user; 
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid Token" });
    }
});

export default authMiddleware;