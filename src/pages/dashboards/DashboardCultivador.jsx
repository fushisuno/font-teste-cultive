import React, { useEffect } from "react";
import {
  Sprout,
  Leaf,
  CalendarDays,
  ClipboardList,
  Info,
  Users,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";
import { useHortaStore } from "@/stores/useHortaStore";
import { useFamiliaStore } from "@/stores/useFamiliaStore";
import StatCard from "@/components/ui/StatCard";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const DashboardCultivador = () => {
  const { user } = useUserStore();
  const { selectedFamilia, getFamiliaById } = useFamiliaStore();
  const { hortas, fetchHortas } = useHortaStore();

  useEffect(() => {
    if (user?.familiaId) getFamiliaById(user.familiaId);
    if (hortas.length === 0) fetchHortas();
  }, [user, getFamiliaById, fetchHortas, hortas.length]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-base-content/70">
          Você precisa estar logado.
        </p>
        <Link to="/login" className="btn btn-primary mt-4">
          Fazer login
        </Link>
      </div>
    );
  }

  const familia = selectedFamilia;
  const horta = hortas.find((h) => h.id === familia?.hortaId);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Contexto Familiar */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-8">
        <div className="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              👨‍🌾 {familia?.nome || "Família não atribuída"}
            </h2>
            <p className="text-sm text-base-content/70">
              Cultivando na{" "}
              <span className="font-semibold text-primary">
                {horta?.nome || "Horta não definida"}
              </span>{" "}
              com {familia?.membros?.length || 0} membros ativos.
            </p>
          </div>

          <Link
            to="/familia"
            className="btn btn-outline btn-primary btn-sm mt-2 sm:mt-0"
          >
            Ver Família
          </Link>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Plantios Ativos"
          value={familia?.plantiosAtivos || 0}
          description="Em andamento pela sua família"
          icon={Sprout}
        />
        <StatCard
          title="Próxima Colheita"
          value={familia?.proximaColheita || "Sem previsão"}
          description="Data prevista"
          icon={CalendarDays}
        />
        <StatCard
          title="Membros na Família"
          value={familia?.membros?.length || 0}
          description="Participando ativamente"
          icon={Users}
        />
      </div>

      {/* Colheitas Recentes */}
      {familia?.colheitasRecentes?.length > 0 && (
        <div className="card bg-base-100 border border-base-300 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Leaf className="h-5 w-5" /> Colheitas Recentes
            </h2>
            <div className="mt-4 space-y-3">
              {familia.colheitasRecentes.map((colheita, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition"
                >
                  <span className="font-medium">{colheita.planta}</span>
                  <span className="text-sm text-base-content/70">
                    {colheita.data}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Habilidades e Preferências */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Activity className="h-5 w-5" /> Suas Habilidades
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {(user.habilidades?.length
                ? user.habilidades
                : ["Nenhuma cadastrada"]
              ).map((hab, i) => (
                <span
                  key={i}
                  className="badge badge-success badge-outline px-3 py-2 text-sm"
                >
                  {hab}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Leaf className="h-5 w-5" /> Plantas Favoritas
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {(user.plantasFavoritas?.length
                ? user.plantasFavoritas
                : ["Nenhuma cadastrada"]
              ).map((planta, i) => (
                <span
                  key={i}
                  className="badge badge-primary badge-outline px-3 py-2 text-sm"
                >
                  {planta}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <Info className="h-5 w-5" /> Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <Link
              to="/plantios"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Sprout className="h-5 w-5" /> Registrar Atividade
            </Link>
            <Link
              to="/colheitas"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Leaf className="h-5 w-5" /> Registrar Colheita
            </Link>
            <Link
              to="/historico"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <ClipboardList className="h-5 w-5" /> Consultar Histórico
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCultivador;
