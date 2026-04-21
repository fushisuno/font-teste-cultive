import React, { useState } from "react";
import { Bell, Check } from "lucide-react";

// Mock de notificações
const mockNotifications = [
  {
    id: "1",
    titulo: "Feira de Legumes",
    mensagem:
      "Sábado às 9h na horta comunitária. Não esqueça de trazer suas sacolas!",
    lida: false,
    createdAt: new Date(2025, 10, 5, 9, 0),
    tipo: "evento",
  },
  {
    id: "2",
    titulo: "Oficina de Compostagem",
    mensagem: "Domingo às 14h. Traga um pote para levar seu composto.",
    lida: true,
    createdAt: new Date(2025, 10, 4, 14, 0),
    tipo: "aviso",
  },
  {
    id: "3",
    titulo: "Novo usuário cadastrado",
    mensagem: "O usuário 'Ana Silva' se cadastrou recentemente.",
    lida: false,
    createdAt: new Date(2025, 10, 3, 10, 30),
    tipo: "alerta",
  },
];

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [query, setQuery] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");

  const filteredNotifications = notifications.filter(
    (n) =>
      (n.titulo + " " + n.mensagem)
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!tipoFilter || n.tipo === tipoFilter)
  );

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" /> Notificações
        </h1>
        <button
          className="btn btn-sm btn-outline"
          onClick={handleMarkAllAsRead}
        >
          Marcar todas como lidas
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100">
          <input
            type="search"
            placeholder="Buscar notificações..."
            className="grow bg-transparent focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="select select-bordered w-full sm:w-[180px] rounded-lg"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          <option value="evento">Evento</option>
          <option value="aviso">Aviso</option>
          <option value="alerta">Alerta</option>
        </select>
      </div>

      {/* Lista de notificações */}
      {filteredNotifications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-base-100 flex flex-col gap-2 ${
                !n.lida ? "border-primary" : "border-base-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-base">{n.titulo}</div>
                  <div className="text-sm text-base-content/70">
                    {n.mensagem}
                  </div>
                  <div className="text-xs text-base-content/50">
                    {n.createdAt.toLocaleString("pt-BR")}
                  </div>
                </div>
                {!n.lida && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-base-content/60 italic">
          Nenhuma notificação encontrada.
        </div>
      )}
    </div>
  );
}
