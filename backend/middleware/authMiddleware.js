exports.checkRole = (roles) => (req, res, next) => {
    // In a real app, verify a JWT here. For now, check user object attached to req.
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};