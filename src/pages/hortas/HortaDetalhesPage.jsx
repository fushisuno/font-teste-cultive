import Badge from "@/components/ui/Badge";
import { useNavigate, useParams } from "react-router-dom";
import { useHortaStore } from "@/stores/useHortaStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Award,
  BarChart2,
  CalendarDays,
  Info,
  MapPin,
  Sprout,
  Tractor,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import StatCard from "@/components/ui/StatCard";

const HortaDetalhesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    hortaSelecionada,
    loading,
    error,
    fetchHortaById,
    clearSelectedHorta,
  } = useHortaStore();

  useEffect(() => {
    fetchHortaById(id);
    return () => clearSelectedHorta();
  }, [id, fetchHortaById, clearSelectedHorta]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="text-lg text-base-content/70">
            Carregando dados da horta...
          </span>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-error/80">
        <p>{error}</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    );

  if (!hortaSelecionada)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-base-content/70">
        <p>Horta não encontrada.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    );

  const horta = hortaSelecionada;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-base-content">{horta.nome}</h1>
          <p className="text-base-content/70 mt-2 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" /> {horta.endereco}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </div>

      {/* Informações Gerais */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Lado esquerdo */}
          <div className="flex flex-col gap-4">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> Informações Gerais
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge type={horta.tipoHorta}>{horta.tipoHorta}</Badge>
              <Badge type={horta.tipoSolo}>{horta.tipoSolo}</Badge>
            </div>
            <CardDescription className="whitespace-normal wrap-break-word">
              {horta.descricao || "Sem descrição disponível."}
            </CardDescription>
            {horta.observacoes && (
              <CardDescription className="italic text-base-content/60 mt-1 whitespace-normal wrap-break-word">
                Observações: {horta.observacoes}
              </CardDescription>
            )}
          </div>

          {/* Lado direito */}
          <div className="flex flex-col gap-4 items-start md:items-start">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-success" />
              <span>
                <strong>Área cultivada:</strong> {horta.areaCultivada} m²
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tractor className="h-5 w-5 text-primary" />
              <span>
                <strong>Gestor:</strong> {horta.gestor?.nome || "Não definido"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              <span>
                <strong>Família:</strong>{" "}
                {horta.familia?.nome || "Sem família vinculada"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats da Horta */}
      <ResponsiveGrid columns={2}>
        {/* Produção da horta */}
        <StatCard
          title="Produção prevista"
          value={
            horta.plantios?.reduce((acc, p) => {
              // considera apenas plantios não colhidos
              return p.dataColheita ? acc : acc + Number(p.quantidadePlantada);
            }, 0) || 0
          }
          description="Quantidade ainda a ser colhida"
          icon={Sprout}
        />

        <StatCard
          title="Produção colhida"
          value={
            horta.plantios?.reduce((acc, p) => {
              // se houver colheita, soma a quantidade
              return (
                acc +
                (p.colheita?.quantidadeColhida
                  ? Number(p.colheita.quantidadeColhida)
                  : 0)
              );
            }, 0) || 0
          }
          description="Quantidade já colhida"
          icon={Award}
        />
        <StatCard
          title="Produtividade média"
          value={
            (
              (horta.plantios?.reduce(
                (acc, p) =>
                  acc +
                  (p.colheita?.quantidadeColhida
                    ? Number(p.colheita.quantidadeColhida)
                    : 0),
                0
              ) || 0) / (Number(horta.areaCultivada) || 1)
            ).toFixed(2) + " /m²"
          }
          description="Produção por m²"
          icon={BarChart2}
        />
        <StatCard
          title="Plantios ativos"
          value={
            horta.plantios?.filter((p) => !p.dataColheita).length.toString() ||
            "0"
          }
          description="Plantios ainda em andamento"
          icon={Tractor}
        />
      </ResponsiveGrid>

      {/* Plantios Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Sprout className="h-5 w-5 text-success" /> Plantios Recentes
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {horta.plantios && horta.plantios.length > 0 ? (
            horta.plantios.map((p) => (
              <Card
                key={p.id}
                className="bg-base-50 hover:bg-base-100 transition p-4"
              >
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>{p.cultura}</CardTitle>
                  <Badge type={p.tipoPlantacao}>{p.tipoPlantacao}</Badge>
                </CardHeader>

                <CardContent className="flex flex-col gap-2 text-sm text-base-content/70">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" /> Início:{" "}
                    {p.dataInicio
                      ? new Date(p.dataInicio).toLocaleDateString("pt-BR")
                      : "-"}
                  </div>

                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" /> Previsão:{" "}
                    {p.previsaoColheita
                      ? new Date(p.previsaoColheita).toLocaleDateString("pt-BR")
                      : "-"}
                  </div>

                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" /> Colheita:{" "}
                    {p.dataColheita
                      ? new Date(p.dataColheita).toLocaleDateString("pt-BR")
                      : "-"}
                  </div>

                  <div className="flex items-center gap-1">
                    <Sprout className="h-4 w-4" /> Quantidade plantada:{" "}
                    {p.quantidadePlantada} {p.unidadeMedida}
                  </div>

                  {p.observacoes && (
                    <CardDescription className="italic text-base-content/60 mt-1 whitespace-normal wrap-break-word">
                      {p.observacoes}
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <CardDescription className="italic text-base-content/60 whitespace-normal wrap-break-word">
              Nenhum plantio registrado nesta horta.
            </CardDescription>
          )}
        </CardContent>
      </Card>

      {/* Logs da Horta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Info className="h-5 w-5 text-primary" /> Logs da Horta
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {horta.logs && horta.logs.length > 0 ? (
            horta.logs
              .sort((a, b) => new Date(b.data) - new Date(a.data)) // mais recentes primeiro
              .map((log) => (
                <Card key={log.id} className="bg-base-50 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-content/80">
                      {log.acao}
                    </span>
                    <span className="text-xs text-base-content/50">
                      {new Date(log.data).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  {log.contexto && (
                    <CardDescription className="text-xs italic text-base-content/60 mt-1">
                      Contexto: {log.contexto}
                    </CardDescription>
                  )}
                </Card>
              ))
          ) : (
            <CardDescription className="italic text-base-content/60">
              Nenhum log registrado para esta horta.
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HortaDetalhesPage;
