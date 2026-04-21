import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import DashboardLayout from "./DashboardLayout";

import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";

const HomePage = lazy(() => import("@/pages/HomePage"));
const DashboardPage = lazy(() => import("@/pages/dashboards/DashboardPage"));
const HortasPage = lazy(() => import("@/pages/hortas/GardenPage"));
const HortaDetalhesPage = lazy(() =>
  import("@/pages/hortas/HortaDetalhesPage")
);
const PlantingsPage = lazy(() => import("@/pages/plantio/PlantingsPage"));
const FamiliesPage = lazy(() => import("@/pages/familias/FamiliasPage"));
const FamiliaDetalhesPage = lazy(() =>
  import("@/pages/familias/FamiliaDetalhesPage")
);
const UsuariosPage = lazy(() => import("@/pages/usuarios/UsuariosPage"));
const ComunicacaoPage = lazy(() => import("@/pages/aviso/ComunicacaoPage"));
const ColheitasPage = lazy(() => import("@/pages/colheitas/ColheitasPage"));
const HelpPage = lazy(() => import("@/pages/help/HelpPage"));
const NotificationsPage = lazy(() =>
  import("@/pages/notificacoes/NotificationPage")
);
const PerfilPage = lazy(() => import("@/pages/usuarios/ProfilePage"));
const ResetPasswordPage = lazy(() => import("@/pages/usuarios/ResetPassword"));
const ForgotPasswordPage = lazy(() =>
  import("@/pages/usuarios/ForgotPassword")
);
const Onboarding = lazy(() => import("@/pages/usuarios/Onboarding"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPasswordPage />}
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Rotas protegidas (com layout de dashboard) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Hortas */}
            <Route path="/hortas" element={<HortasPage />} />
            <Route path="/hortas/:id" element={<HortaDetalhesPage />} />

            <Route path="/plantios" element={<PlantingsPage />} />
            <Route path="/colheitas" element={<ColheitasPage />} />

            {/* Famílias */}
            <Route path="/familias" element={<FamiliesPage />} />
            <Route path="/familias/:id" element={<FamiliaDetalhesPage />} />

            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/comunicacao" element={<ComunicacaoPage />} />
            <Route path="/ajuda" element={<HelpPage />} />
            <Route path="/notificacoes" element={<NotificationsPage />} />

            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
