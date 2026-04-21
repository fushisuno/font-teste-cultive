import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, checkAuth, checkinAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkinAuth) {
    return <LoadingOverlay message="Verificando autenticação..." loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="*" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
