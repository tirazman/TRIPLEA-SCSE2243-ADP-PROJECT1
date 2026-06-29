const jwt = require('jsonwebtoken');

exports.authorizeRole = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ message: "No token provided" });

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid token" });

            // Check if user role is included in authorized roles
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            }

            req.user = user; 
            next();
        });
    };
};