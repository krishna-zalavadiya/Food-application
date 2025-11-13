import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.id, email: decoded.email };
        next();
    } catch (error) {
        const message = error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
        return res.status(401).json({ success: false, message });
    }
};

export default authMiddleware;
