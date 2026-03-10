import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, permission, role }) => {
    const { user, loading, hasPermission } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (permission) {
        let hasAccess = false;
        if (Array.isArray(permission)) {
            hasAccess = permission.some(p => hasPermission(p));
        } else {
            hasAccess = hasPermission(permission);
        }

        if (!hasAccess) {
            return <div className="p-8 text-center text-red-600">You do not have permission to view this page.</div>;
        }
    }

    if (role && user.role !== role && user.role !== 'ADMIN') {
        return <div className="p-8 text-center text-red-600">Access Restricted to {role}.</div>;
    }

    return children;
};

export default ProtectedRoute;
