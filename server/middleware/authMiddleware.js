import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            // Ghost Login Prevention: Check if the token was issued BEFORE the user's details/password were updated
            if (req.user.updatedAt && decoded.iat) {
                const updatedTimestamp = parseInt(req.user.updatedAt.getTime() / 1000, 10);
                if (updatedTimestamp > decoded.iat + 5) { // 5 second buffer
                    res.status(401);
                    throw new Error('Not authorized, token invalidated due to account update');
                }
            }
            
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export const teacher = (req, res, next) => {
    if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a teacher' });
    }
};

export const verifyCSRF = (req, res, next) => {
    // Exempt public POST routes that seed the initial CSRF token
    const exemptedRoutes = [
        '/api/users/login',
        '/api/users/forgot-password',
        '/api/users/reset-password'
    ];

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        if (exemptedRoutes.some(route => req.originalUrl.includes(route))) {
            return next();
        }

        const csrfTokenInCookie = req.cookies.csrfToken;
        const csrfTokenInHeader = req.headers['x-csrf-token'];

        if (!csrfTokenInCookie || !csrfTokenInHeader || csrfTokenInCookie !== csrfTokenInHeader) {
            return res.status(403).json({ message: 'CSRF token mismatch or missing' });
        }
    }
    next();
};
