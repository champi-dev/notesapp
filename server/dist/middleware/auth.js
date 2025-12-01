import { verifyAccessToken } from '../utils/jwt.js';
export const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
//# sourceMappingURL=auth.js.map