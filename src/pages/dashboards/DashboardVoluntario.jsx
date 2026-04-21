// src/pages/dashboards/DashboardVoluntario.jsx
import React from "react";
import {
  CalendarDays,
  HandHeart,
  MapPin,
  Star,
  ClipboardCheck,
  UserCheck,
  PlusCircle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

const DashboardVoluntario = () => {
  // Dados simulados (depois conectar à API)
  const disponibilidade = {
    dias: ["Segunda", "Quarta", "Sexta"],
    status: "Disponível",
  };

  const atividadesSugeridas = [
    { id: 1, nome: "Regar mudas novas", horta: "Horta da Vila Verde" },
    { id: 2, nome: "Capinar canteiro 3", horta: "Horta Central" },
  ];

  const hortasProximas = [
    { id: 1, nome: "Horta da Escola", distancia: "1.2 km" },
    { id: 2, nome: "Horta do Bairro Azul", distancia: "2.4 km" },
  ];

  const eventos = [
    { id: 1, nome: "Mutirão de limpeza", data: "10/11/2025" },
    { id: 2, nome: "Plantio coletivo", data: "15/11/2025" },
  ];

  return (
    <div className="space-y-8">
      {/* Saudações e status */}
      <div className="alert bg-primary/10 border border-primary/30 text-primary-content flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-full">
          <HandHeart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold">Olá, voluntário!</h3>
          <p className="text-sm opacity-80">
            Obrigado por contribuir com as hortas comunitárias! 💚
          </p>
        </div>
      </div>

      {/* Indicadores principais */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat bg-base-200 rounded-2xl shadow-sm">
          <div className="stat-title">Status</div>
          <div className="stat-value text-success">
            {disponibilidade.status}
          </div>
          <div className="stat-desc">Disponibilidade ativa</div>
        </div>

        <div className="stat bg-base-200 rounded-2xl shadow-sm">
          <div className="stat-title">Dias disponíveis</div>
          <div className="stat-value text-primary">
            {disponibilidade.dias.length}
          </div>
          <div className="stat-desc">{disponibilidade.dias.join(", ")}</div>
        </div>

        <div className="stat bg-base-200 rounded-2xl shadow-sm">
          <div className="stat-title">Atividades sugeridas</div>
          <div className="stat-value text-accent">
            {atividadesSugeridas.length}
          </div>
          <div className="stat-desc">Baseadas no seu interesse</div>
        </div>

        <div className="stat bg-base-200 rounded-2xl shadow-sm">
          <div className="stat-title">Pontuação</div>
          <div className="stat-value text-warning">240</div>
          <div className="stat-desc flex items-center gap-1">
            <Star className="h-4 w-4 text-warning" /> +15 esta semana
          </div>
        </div>
      </div>

      {/* Atividades sugeridas */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-base-content">
          Atividades que combinam com você
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {atividadesSugeridas.map((a) => (
            <div
              key={a.id}
              className="card bg-base-200 border border-base-300 shadow-sm"
            >
              <div className="card-body">
                <h3 className="card-title">{a.nome}</h3>
                <p className="text-sm text-base-content/70">Horta: {a.horta}</p>
                <div className="card-actions justify-end">
                  <Button size="sm" className="btn btn-primary">
                    Participar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hortas próximas */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-base-content">
          Hortas próximas precisando de ajuda
        </h2>
        <div className="flex flex-col gap-3">
          {hortasProximas.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between bg-base-200 border border-base-300 p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{h.nome}</p>
                  <p className="text-sm opacity-70">{h.distancia}</p>
                </div>
              </div>
              <Button size="sm" className="btn btn-accent">
                Ver mais
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos eventos */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-base-content">
          Próximos eventos / mutirões
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {eventos.map((e) => (
            <div
              key={e.id}
              className="card bg-base-200 border border-base-300 shadow-sm"
            >
              <div className="card-body flex flex-row items-center justify-between">
                <div>
                  <h3 className="card-title">{e.nome}</h3>
                  <p className="text-sm opacity-70 flex items-center gap-1">
                    <CalendarDays className="h-4 w-4 text-info" /> {e.data}
                  </p>
                </div>
                <Button size="sm" className="btn btn-success">
                  Participar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ações rápidas */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-base-content">
          Ações rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button className="btn btn-primary">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Registrar ajuda
          </Button>
          <Button className="btn btn-secondary">
            <UserCheck className="h-4 w-4 mr-2" />
            Atualizar disponibilidade
          </Button>
          <Button className="btn btn-accent">
            <PlusCircle className="h-4 w-4 mr-2" />
            Inscrever-se em horta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardVoluntario;
