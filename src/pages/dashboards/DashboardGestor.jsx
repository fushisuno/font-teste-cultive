import React, { useEffect, useMemo } from "react";
import { useUserStore } from "@/stores/useUserStore";
import StatCard from "@/components/ui/StatCard";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import {
  Sprout,
  Tractor,
  Users,
  Table,
  CheckCircle2,
  CalendarDays,
  Megaphone,
  Clock,
  Leaf,
  ClipboardList,
} from "lucide-react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Link } from "react-router-dom";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const DashboardGestor = () => {
  const { user, getDashboardData, loading } = useUserStore();

  useEffect(() => {
    getDashboardData();
  }, []);

  const familiasDoGestor = useMemo(
    () => user?.familiasGestor || [],
    [user?.familiasGestor]
  );
  const hortasDoGestor = useMemo(
    () => user?.hortasGestor || [],
    [user?.hortasGestor]
  );

  const plantiosAtivos = useMemo(
    () =>
      hortasDoGestor
        .flatMap((h) => h.plantios || [])
        .filter((p) => !p.dataColheita),
    [hortasDoGestor]
  );

  const colheitas = useMemo(
    () =>
      hortasDoGestor
        .flatMap((h) => (h.plantios || []).map((p) => p.colheita))
        .filter((c) => c),
    [hortasDoGestor]
  );

  const ultimasColheitas = useMemo(
    () =>
      colheitas
        .sort(
          (a, b) =>
            new Date(b.dataColheita).getTime() -
            new Date(a.dataColheita).getTime()
        )
        .slice(0, 5)
        .map((c) => ({
          nome: c.cultura,
          quantidade: `${c.quantidadeColhida?.d?.[0] || 0}${c.unidadeMedida}`,
          data: formatDate(c.dataColheita),
        })),
    [colheitas]
  );

  const hoje = new Date();

  const plantiosAtrasados = useMemo(
    () =>
      plantiosAtivos
        .filter(
          (p) => p.previsaoColheita && new Date(p.previsaoColheita) < hoje
        )
        .map((p) => {
          const horta = hortasDoGestor.find((h) => h.id === p.hortaId);
          return {
            nome: `${p.cultura} - ${horta?.nome || "Horta não encontrada"}`,
            diasAtraso: Math.ceil(
              (hoje.getTime() - new Date(p.previsaoColheita).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          };
        })
        .slice(0, 5),
    [plantiosAtivos, hoje, hortasDoGestor]
  );

  const proximasColheitas = useMemo(
    () =>
      plantiosAtivos
        .filter(
          (p) => p.previsaoColheita && new Date(p.previsaoColheita) > hoje
        )
        .map((p) => {
          const horta = hortasDoGestor.find((h) => h.id === p.hortaId);
          return {
            nome: `${p.cultura} - ${horta?.nome || "Horta não encontrada"}`,
            data: formatDate(p.previsaoColheita),
          };
        })
        .slice(0, 5),
    [plantiosAtivos, hoje, hortasDoGestor]
  );

  const gestorStats = {
    hortasGestor: hortasDoGestor.length,
    familiasGestor: familiasDoGestor.length,
    plantiosAtivos: plantiosAtivos.length,
    colheitasRecentes: colheitas.length,
    plantiosAtrasados,
    proximasColheitas,
    ultimasColheitasLista: ultimasColheitas,
    proximosAvisos: [],
  };

  return (
    <div className="">
      <LoadingOverlay loading={loading} message="Carregando dados..." />

      {/* Estatísticas */}
      <ResponsiveGrid>
        <StatCard
          title="Hortas Gerenciadas"
          value={gestorStats.hortasGestor}
          description="Você é responsável por essas hortas"
          icon={Sprout}
        />
        <StatCard
          title="Famílias Vinculadas"
          value={gestorStats.familiasGestor}
          description="Famílias sob sua gestão"
          icon={Users}
        />
        <StatCard
          title="Plantios Ativos"
          value={gestorStats.plantiosAtivos}
          description="Em andamento nas suas hortas"
          icon={Tractor}
        />
        <StatCard
          title="Colheitas Registradas"
          value={gestorStats.colheitasRecentes}
          description="Registradas nos últimos 30 dias"
          icon={Table}
        />
      </ResponsiveGrid>

      {/* Plantios atrasados */}
      <div className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">Alertas de Atenção 🚨</h2>
        {gestorStats.plantiosAtrasados.length > 0 ? (
          <div className="alert alert-warning shadow-sm">
            <Clock className="h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-bold">Plantios atrasados</h3>
              <p className="text-sm opacity-90">
                Existem {gestorStats.plantiosAtrasados.length} plantios
                atrasados.
              </p>
              <ul className="text-xs mt-1 ml-3 list-disc">
                {gestorStats.plantiosAtrasados.map((p, i) => (
                  <li key={i}>
                    {p.nome} —{" "}
                    <span className="text-warning font-medium">
                      {p.diasAtraso} dias de atraso
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/plantios" className="btn btn-sm btn-warning">
              Revisar
            </Link>
          </div>
        ) : (
          <div className="alert alert-success shadow-sm">
            <CheckCircle2 className="h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-bold">Status do Plantio</h3>
              <p className="text-sm">
                Nenhum plantio está atrasado. Ótimo trabalho!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cards de informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Próximas Colheitas */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg">
              <CalendarDays className="h-5 w-5 mr-1" /> Próximas Colheitas
            </h2>

            <ul className="mt-3 space-y-2">
              {gestorStats.proximasColheitas.length > 0 ? (
                gestorStats.proximasColheitas.map((c, i) => (
                  <li
                    key={i}
                    className="flex justify-between p-2 bg-base-200/60 rounded-md"
                  >
                    <span className="truncate">{c.nome}</span>
                    <span className="text-sm text-base-content/70 font-medium">
                      {c.data}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-base-content/60">
                  Nenhuma colheita prevista.
                </li>
              )}
            </ul>

            <div className="card-actions justify-end mt-4">
              <Link to="/plantios" className="btn btn-sm btn-ghost">
                Ver todos
              </Link>
            </div>
          </div>
        </div>

        {/* Próximos Avisos */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg">
              <Megaphone className="h-5 w-5 mr-1" /> Próximos Avisos
            </h2>

            <ul className="mt-3 space-y-2">
              {gestorStats.proximosAvisos.length > 0 ? (
                gestorStats.proximosAvisos.map((a, i) => (
                  <li
                    key={i}
                    className="flex justify-between p-2 bg-base-200/60 rounded-md"
                  >
                    <span className="truncate">{a.titulo}</span>
                    <span className="text-sm text-base-content/70 font-medium">
                      {a.data}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-base-content/60">
                  Nenhum aviso pendente.
                </li>
              )}
            </ul>

            <div className="card-actions justify-end mt-4">
              <Link to="/avisos" className="btn btn-sm btn-ghost">
                Gerenciar Avisos
              </Link>
            </div>
          </div>
        </div>

        {/* Últimas Colheitas */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg">
              <CheckCircle2 className="h-5 w-5 mr-1" /> Últimas Colheitas
            </h2>

            <ul className="mt-3 space-y-2">
              {gestorStats.ultimasColheitasLista.length > 0 ? (
                gestorStats.ultimasColheitasLista.map((c, i) => (
                  <li
                    key={i}
                    className="flex justify-between p-2 bg-base-200/60 rounded-md"
                  >
                    <span className="truncate">{c.nome}</span>
                    <span className="text-sm text-base-content/70 font-medium">
                      {c.quantidade} em {c.data}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-base-content/60">
                  Nenhuma colheita recente.
                </li>
              )}
            </ul>

            <div className="card-actions justify-end mt-4">
              <Link to="/colheitas" className="btn btn-sm btn-ghost">
                Ver Registros
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Painel de Gestão Rápida */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-12">
        <div className="card-body">
          <h2 className="card-title">Painel de Gestão Rápida</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Acesso rápido às principais ferramentas de gestão.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/hortas"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Leaf className="h-5 w-5" />
              Gerenciar Hortas
            </Link>

            <Link
              to="/avisos"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Megaphone className="h-5 w-5" />
              Criar Aviso
            </Link>

            <Link
              to="/colheitas"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <ClipboardList className="h-5 w-5" />
              Registrar Colheita
            </Link>

            <Link
              to="/plantios"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Sprout className="h-5 w-5" />
              Gerenciar Plantios
            </Link>

            <Link
              to="/familias"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Users className="h-5 w-5" />
              Gerenciar Famílias
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGestor;
