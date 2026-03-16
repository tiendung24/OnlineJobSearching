const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rjkghfjkguh');
        req.user = decoded; // Contains { userId, role }
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

const isEmployer = (req, res, next) => {
    // roleId = 3 is Employer
    if (req.user && req.user.role === 3) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Employer role required.' });
    }
};

const isAdmin = (req, res, next) => {
    // roleId = 1 is Admin
    if (req.user && req.user.role === 1) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

const isJobSeeker = (req, res, next) => {
    // roleId = 2 is JobSeeker
    if (req.user && req.user.role === 2) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Job Seeker role required.' });
    }
};

module.exports = {
    verifyToken,
    isEmployer,
    isAdmin,
    isJobSeeker
};
