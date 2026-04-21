import { z } from "zod";

const tiposPlantacaoValidos = [
  "Orgânico",
  "Convencional",
  "Hidropônico",
  "Aeropônico",
  "Agroflorestal",
  "Permacultura",
  "Protegido",
  "Terreno aberto",
  "Intensiva",
  "Extensiva",
  "Estufa",
];

export const ETipoPlantacao = z.enum(tiposPlantacaoValidos);

const plantioSchema = z
  .object({
    cultura: z
      .string()
      .min(4, "A cultura deve ter pelo menos 4 caracteres")
      .max(100, "A cultura é muito longa"),
    tipoPlantacao: z
      .string()
      .refine((val) => tiposPlantacaoValidos.includes(val), {
        message: "Por favor, selecione um tipo de plantação válido",
      }),
    dataInicio: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de início inválida",
    }),
    previsaoColheita: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de previsão de colheita inválida",
    }),
    quantidadePlantada: z.preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z
        .number({
          invalid_type_error: "Quantidade plantada deve ser um número",
        })
        .positive("A quantidade deve ser maior que zero")
    ),
    unidadeMedida: z.enum(["kg", "unidades", "m²"]).optional(),
    hortaId: z.string().min(1, "Selecione uma horta"),
    observacoes: z.string().optional(),
  })
  .refine(
    (data) => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); 
      const dataInicio = new Date(data.dataInicio);
      dataInicio.setHours(0, 0, 0, 0);
      return dataInicio >= hoje;
    },
    {
      message: "A data de início não pode ser anterior à data atual",
      path: ["dataInicio"],
    }
  )

  .refine(
    (data) => {
      const dataInicio = new Date(data.dataInicio);
      const previsaoColheita = new Date(data.previsaoColheita);
      return previsaoColheita >= dataInicio;
    },
    {
      message: "A previsão de colheita não pode ser anterior à data de início",
      path: ["previsaoColheita"],
    }
  );

export default plantioSchema;
