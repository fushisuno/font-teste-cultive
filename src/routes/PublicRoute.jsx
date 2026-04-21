import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";
import Header from "@/components/Header";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const PublicRoute = () => {
  const { user, checkAuth, checkinAuth } = useUserStore();

  useEffect(() => {
    checkAuth(true);
  }, []);

  if (checkinAuth) {
    return <LoadingOverlay message="Verificando autenticação..." loading />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default PublicRoute;
