import React, { useState } from "react";
import { Megaphone, Search, Plus } from "lucide-react";

// Mock de eventos/anúncios do gestor
const events = [
  {
    id: 1,
    title: "Feira de Legumes",
    description:
      "Sábado às 9h na horta comunitária. Traga suas sacolas e vamos compartilhar os legumes colhidos!",
    date: new Date(2025, 10, 9, 9, 0),
    type: "Feira",
    createdBy: "Gestor",
  },
  {
    id: 2,
    title: "Oficina de Compostagem",
    description:
      "Domingo às 14h, aprenda a compostar resíduos orgânicos da horta. Traga um pote para levar seu composto.",
    date: new Date(2025, 10, 10, 14, 0),
    type: "Oficina",
    createdBy: "Gestor",
  },
];

// Cores por mês
const monthColors = [
  "bg-red-200 text-red-800",
  "bg-orange-200 text-orange-800",
  "bg-amber-200 text-amber-800",
  "bg-lime-200 text-lime-800",
  "bg-green-200 text-green-800",
  "bg-teal-200 text-teal-800",
  "bg-cyan-200 text-cyan-800",
  "bg-blue-200 text-blue-800",
  "bg-indigo-200 text-indigo-800",
  "bg-purple-200 text-purple-800",
  "bg-pink-200 text-pink-800",
  "bg-rose-200 text-rose-800",
];

export default function ComunicacaoPage() {
  const [query, setQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  // mock do perfil do usuário
  const user = { role: "gestor" }; // ou "admin", ou "familia"

  const filteredEvents = events.filter((e) => {
    const matchesQuery = (e.title + " " + e.description)
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesMonth =
      !monthFilter || e.date.getMonth() === parseInt(monthFilter, 10);
    return matchesQuery && matchesMonth;
  });

  const handleAddEvent = () => {
    alert("Aqui abriria o modal de adicionar evento...");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Eventos & Avisos</h1>
          <p className="text-base-content/70 mt-1">
            Confira os próximos eventos e avisos postados pelo gestor da horta.
          </p>
        </div>
        {(user.role === "admin" || user.role === "gestor") && (
          <button className="btn btn-primary w-full sm:w-auto" onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Evento
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Caixa de busca */}
        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="search"
            placeholder="Buscar eventos..."
            className="grow bg-transparent focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filtro de mês */}
        <select
          className="select select-bordered w-full sm:w-[180px] rounded-lg"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="">Todos os meses</option>
          {[
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
          ].map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de eventos */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const monthClass = monthColors[event.date.getMonth()];
            return (
              <div
                key={event.id}
                className="border border-base-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-base-100 flex flex-col justify-between"
              >
                {/* Título isolado */}
                <h2 className="text-lg font-bold mb-3">{event.title}</h2>

                {/* Informações */}
                <div className="flex flex-col gap-2 text-sm text-base-content/70">
                  <div>
                    <span className={`px-2 py-1 rounded ${monthClass} text-xs font-semibold`}>
                      {event.date.toLocaleString("pt-BR", { month: "long" })}
                    </span>{" "}
                    <span>
                      {event.date.toLocaleString("pt-BR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="badge badge-outline text-xs">{event.type}</span>
                  </div>
                  <div>{event.description}</div>
                  <div className="text-xs text-base-content/50">
                    Criado por: {event.createdBy}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-base-content/60 italic">
          Nenhum evento encontrado.
        </div>
      )}
    </div>
  );
}
