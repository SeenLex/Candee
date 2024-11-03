import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
interface AdminRouteProps {
    redirectPath?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ redirectPath = '/login' }) => {
    const { token,user } = useAuth();
    if (!token || user?.role !== 'admin') {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
}

export default AdminRoute;

