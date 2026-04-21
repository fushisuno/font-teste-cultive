import React from "react";

// Mapeamento de cores normalizado (DaisyUI)
const typeColors = {
  // Roles de usuário
  admin: "badge-error",
  gestor: "badge-primary",
  voluntario: "badge-success",
  cultivador: "badge-warning",

  // Tipos de horta
  escolar: "badge-primary",
  comunitaria: "badge-success",
  institucional: "badge-warning",
  ong: "badge-error",
  urbana: "badge-info",
  vertical: "badge-secondary",
  hidroponica: "badge-success",
  organico: "badge-success",
  experimental: "badge-accent",

  // Tipos de solo
  // Tipos de solo (com mais opções)
  argiloso: "badge-primary",
  arenoso: "badge-success",
  humoso: "badge-warning",
  siltoso: "badge-info",
  calcario: "badge-secondary",
  turfa: "badge-accent",
  pedregoso: "badge-error",
  lateritico: "badge-error",
  franco_arenoso: "badge-info",
  franco_argiloso: "badge-warning",
  franco_limoso: "badge-primary",
  loam: "badge-secondary",
  aluvial: "badge-accent",

  // Tipos de plantação
  convencional: "badge-primary",
  hidroponico: "badge-warning",
  aeroponico: "badge-info",
  agroflorestal: "badge-success",
  permacultura: "badge-accent",
  protegido: "badge-secondary",
  terreno_aberto: "badge-outline",
  intensiva: "badge-error",
  extensiva: "badge-secondary",
  estufa: "badge-primary",

  // Dias da semana
  dom: "badge-error",
  seg: "badge-primary",
  ter: "badge-success",
  qua: "badge-warning",
  qui: "badge-info",
  sex: "badge-secondary",
  sab: "badge-outline",

  // Destino da colheita
  consumo: "badge-success",
  doacao: "badge-primary",
  venda: "badge-warning",
  mercado: "badge-info",
  cooperativa: "badge-secondary",
  restaurante: "badge-accent",
  compartilhamento: "badge-outline",

  // Notificações / FAQ
  alerta: "badge-error",
  evento: "badge-primary",
  aviso: "badge-warning",
  plantio: "badge-success",
  sistema: "badge-primary",
  comunidade: "badge-info",
};

// Normaliza qualquer string: lowercase + remove acentos
const normalizeKey = (key) => {
  if (!key) return "";
  return key
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "_"); // espaços viram underline
};

const Badge = ({ children, type, pill = false, className = "", ...props }) => {
  const key = normalizeKey(type);
  const colorClass = typeColors[key] || "badge-outline"; // fallback

  const pillClass = pill ? "rounded-full" : "rounded-lg";

  return (
    <span
      className={`badge ${colorClass} ${pillClass} ${className} px-3 py-1 text-center break-words`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
