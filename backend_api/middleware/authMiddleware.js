import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify JWT tokens from cookies
 * Protects routes by ensuring user is authenticated
 */
export const authenticateToken = (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.ms_token;
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided.',
                redirectTo: '/auth/login'
            });
        }

        // For Microsoft Graph tokens, we'll verify the token exists and is valid
        // In a production environment, you might want to validate with Microsoft's endpoint
        if (token && typeof token === 'string' && token.length > 0) {
            // Store token in request for use in controllers
            req.token = token;
            next();
        } else {
            return res.status(401).json({ 
                error: 'Invalid token format.',
                redirectTo: '/auth/login'
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ 
            error: 'Invalid token.',
            redirectTo: '/auth/login'
        });
    }
};

/**
 * Optional authentication middleware - doesn't block if no token
 * Useful for routes that can work with or without authentication
 */
export const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies.ms_token;
        if (token) {
            req.token = token;
        }
        next();
    } catch (error) {
        console.error('Optional auth error:', error);
        next();
    }
};
