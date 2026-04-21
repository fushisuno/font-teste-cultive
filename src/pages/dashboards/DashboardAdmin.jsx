"use client";

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ChartColumn,
  Leaf,
  Sprout,
  BarChart3,
  Activity,
  Database,
  FileText,
  Megaphone,
} from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import StatCard from "../../components/ui/StatCard";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const DashboardAdmin = () => {
  const { user, dashboardData, getDashboardData, loading } = useUserStore();

  useEffect(() => {
    getDashboardData();
  }, []);

  if (!user) {
    return <LoadingOverlay loading={true} message="Carregando dados..." />;
  }

  const adminStats = {
    usuarios: dashboardData?.totais?.usuarios || 0,
    hortas: dashboardData?.totais?.hortas || 0,
    familias: dashboardData?.totais?.familias || 0,
    plantios: dashboardData?.totais?.plantios || 0,
    colheitas: dashboardData?.totais?.colheitas || 0,
    logs: dashboardData?.totais?.logs || 0,
  };

  const logsSistema = dashboardData?.ultimosLogs || [];

  return (
    <div className="">
      <LoadingOverlay loading={loading} message="Carregando dados..." />

      {/* Sugestão do Sistema */}
      <div className="alert alert-info shadow-sm mb-8">
        <BarChart3 className="h-6 w-6" />
        <div>
          <h3 className="font-bold">Sugestão do Sistema</h3>
          <p className="text-sm opacity-90">
            Verifique os relatórios de desempenho das hortas e aprove novos
            gestores cadastrados.
          </p>
        </div>
      </div>

      {/* Estatísticas Administrativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Usuários Ativos"
          value={adminStats.usuarios}
          description="Total de usuários na plataforma"
          icon={Users}
        />
        <StatCard
          title="Hortas Cadastradas"
          value={adminStats.hortas}
          description="Hortas registradas até o momento"
          icon={Leaf}
        />
        <StatCard
          title="Famílias Ativas"
          value={adminStats.familias}
          description="Participando de hortas comunitárias"
          icon={Sprout}
        />
        <StatCard
          title="Plantios Ativos"
          value={adminStats.plantios}
          description="Distribuídos entre as hortas"
          icon={ChartColumn}
        />
        <StatCard
          title="Colheitas do Mês"
          value={adminStats.colheitas}
          description="Total de registros recentes"
          icon={BarChart3}
        />
        <StatCard
          title="Logs Registrados"
          value={adminStats.logs}
          description="Eventos registrados no sistema"
          icon={Database}
        />
      </div>

      {/* Ferramentas Administrativas */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Ferramentas Administrativas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/usuarios"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Users className="h-5 w-5" /> Gerenciar Usuários
            </Link>
            <Link
              to="/hortas"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Leaf className="h-5 w-5" /> Gerenciar Hortas
            </Link>
            <Link
              to="/familias"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Sprout className="h-5 w-5" /> Gerenciar Famílias
            </Link>
            <Link
              to="/logs"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Activity className="h-5 w-5" /> Acessar Logs
            </Link>
            <Link
              to="/avisos"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Megaphone className="h-5 w-5" /> Criar Avisos Globais
            </Link>
            <Link
              to="/faq"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <FileText className="h-5 w-5" /> Gerenciar FAQs
            </Link>
          </div>
        </div>
      </div>

      {/* Logs do Sistema */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Logs do Sistema</h2>
            <Link to="/logs" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="space-y-4">
            {logsSistema.length > 0 ? (
              logsSistema.map((log) => {
                const usuario = dashboardData.ultimosUsuarios.find(
                  (u) => u.id === log.usuarioId
                );

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {usuario?.nome || log.usuarioId}
                      </p>
                      <p className="text-sm text-base-content/70">{log.acao}</p>
                      <p className="text-xs text-base-content/50 mt-1">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "Sem data"}
                      </p>
                      {log.contexto && (
                        <p className="text-xs text-base-content/50 mt-1">
                          Contexto:{" "}
                          {typeof log.contexto === "string"
                            ? log.contexto
                            : JSON.stringify(log.contexto)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-base-content/60 py-4">
                Nenhum log registrado no sistema.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
