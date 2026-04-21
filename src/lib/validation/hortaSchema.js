import { z } from "zod";

const tiposHortaValidos = [
  "escolar",
  "comunitaria",
  "institucional",
  "ong",
  "familiar",
];
const tiposSoloValidos = [
  "Argiloso",
  "Arenoso",
  "Humoso",
  "Calcário",
  "Laterítico",
  "Siltoso",
  "Turfa",
  "Pedregoso",
  "Franco-arenoso",
  "Franco-argiloso",
  "Franco-limoso",
  "Loam",
  "Orgânico",
  "Aluvial",
];

export const EHortaEnum = z.enum(tiposHortaValidos);
export const ESoloEnum = z.enum(tiposSoloValidos);


const hortaSchema = z.object({
  nome: z
    .string()
    .min(4, "O nome deve ter pelo menos 4 caracteres")
    .max(100, "O nome é muito longo"),

  endereco: z
    .string()
    .min(4, "O endereço deve ter pelo menos 4 caracteres")
    .max(200, "O endereço é muito longo"),

  tipoHorta: z
    .string()
    .refine((val) => tiposHortaValidos.includes(val), {
      message:
        "Por favor, selecione um tipo de horta válido",
    }),

  tipoSolo: z
    .string()
    .refine((val) => tiposSoloValidos.includes(val), {
      message:
        "Por favor, selecione um tipo de solo válido",
    }),

  areaCultivada: z
    .string()
    .transform((val) => parseFloat(val.replace(",", ".")))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "A área cultivada deve ser um número válido e maior que zero",
    }),

  coordenada: z.string().optional().or(z.literal("")),

  gestorId: z.string().uuid(1, "Selecione um gestor"),
  familiaId: z.string().uuid(1, "Selecione uma família"),

  descricao: z.string().optional(),
  observacoes: z.string().optional(),
});

export default hortaSchema;
