import React from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";
import {
  Bell,
  UserCircle,
  Info,
  CalendarDays,
  Leaf,
  Sprout,
} from "lucide-react";
import DashboardAdmin from "@/pages/dashboards/DashboardAdmin";
import StatCard from "@/components/ui/StatCard";
import DashboardGestor from "@/pages/dashboards/DashboardGestor";
import DashboardCultivador from "@/pages/dashboards/DashboardCultivador";
import DashboardVoluntario from "@/pages/dashboards/DashboardVoluntario";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

const DashboardPage = () => {
  const { user } = useUserStore();

  if (!user)
    return (
      <LoadingOverlay loading={true} message="Carregando dados do usuário..." />
    );

  console.log(user.role?.toUpperCase());
  const renderDashboard = () => {
    const role = user?.role?.toUpperCase() ?? "";

    switch (role) {
      case "ADMIN":
        return <DashboardAdmin />;
      case "GESTOR":
        return <DashboardGestor />;
      case "CULTIVADOR":
        return <DashboardCultivador />;
      case "VOLUNTARIO":
        return <DashboardVoluntario />;
      default:
        return (
          <div className="text-center text-base-content/60 py-8">
            Tipo de usuário desconhecido.
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 relative">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            <span className="font-bold">Bem-vindo(a).</span> Aqui está o resumo
            da sua horta comunitária.
          </p>
        </div>
      </div>

      {/* Perfil e notificações */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        {/* Perfil */}
        <div className="flex items-center gap-4">
          <img
            src={user?.pictureUrl || "https://i.pravatar.cc/100?img=22"}
            alt={user?.nome}
            className="w-16 h-16 rounded-full border-2 border-primary shadow-sm"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user?.nome}</h2>
            <p className="text-sm text-base-content/70">
              {user?.familia
                ? `Família: ${user.familia}`
                : user?.role?.toUpperCase() === "CULTIVADOR"
                ? "Sem família vinculada"
                : ""}
            </p>
          </div>
        </div>

        {/* Notificações */}
        <div className="flex items-center gap-3">
          <div className="indicator">
            {user?.notificacoesNaoLidas > 0 && (
              <span className="indicator-item badge badge-error text-xs">
                {user.notificacoesNaoLidas}
              </span>
            )}
            <button className="btn btn-circle btn-ghost">
              <Bell className="h-6 w-6" />
            </button>
          </div>
          <Link to="/perfil" className="btn btn-outline btn-sm">
            <UserCircle className="h-4 w-4 mr-1" /> Meu Perfil
          </Link>
        </div>
      </div>

      {/* Onboarding incompleto */}
      {!user?.onBoarding && (
        <div className="alert alert-warning mb-8 shadow-sm">
          <Info className="h-5 w-5" />
          <div>
            <h3 className="font-bold">Complete seu cadastro!</h3>
            <p className="text-sm opacity-80">
              Você ainda não concluiu o processo de onboarding. Complete seu
              perfil para aproveitar todas as funcionalidades.
            </p>
          </div>
          <Link to="/onboarding" className="btn btn-sm btn-warning ml-auto">
            Completar agora
          </Link>
        </div>
      )}

      {/* Próximo evento / aviso */}
      {user?.proximoAviso && (
        <div className="alert alert-info shadow-sm mb-8">
          <CalendarDays className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Próximo evento</h3>
            <p className="text-sm opacity-90">{user.proximoAviso}</p>
          </div>
        </div>
      )}

      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
