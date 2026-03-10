const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user && (req.user.role === requiredRole || req.user.role === 'ADMIN')) {
            next();
        } else {
            res.status(403).json({ message: `Access denied. Requires role: ${requiredRole}` });
        }
    };
};

const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        const hasPermission = (perm) => req.user && (req.user.role === 'ADMIN' || req.user.permissions?.includes(perm));

        if (Array.isArray(requiredPermission)) {
            if (requiredPermission.some(perm => hasPermission(perm))) {
                return next();
            }
        } else if (hasPermission(requiredPermission)) {
            return next();
        }

        res.status(403).json({ message: `Access denied. Requires permission: ${requiredPermission}` });
    };
};

module.exports = { checkRole, checkPermission };
