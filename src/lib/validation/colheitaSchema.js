import { z } from "zod";

const unidadesValidas = ["kg", "maços", "unidades", "m²"];
const destinosValidos = ["consumo", "doação", "venda"];

export const EUnidadeMedida = z.enum(unidadesValidas);
export const EDestinoColheita = z.enum(destinosValidos);

const colheitaSchema = z
  .object({
    plantioId: z.string().optional(),
    cultura: z.string().min(2).max(100).optional().or(z.literal("")),
    dataColheita: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de colheita inválida",
    }),
    quantidadeColhida: z
      .union([z.string(), z.number()])
      .transform((val) => {
        if (typeof val === "number") return val;
        return parseFloat(val.replace(",", "."));
      })
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Quantidade colhida deve ser um número válido",
      }),
    unidadeMedida: z
      .string()
      .refine((val) => val === "" || unidadesValidas.includes(val), {
        message: "Selecione uma unidade de medida válida",
      }),

    destinoColheita: z.string().refine((val) => destinosValidos.includes(val), {
      message: "Escolha um destino válido",
    }),
    observacoes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const plantio = ctx?.context?.plantio;

    if (!plantio) return;

    const dataColheita = new Date(data.dataColheita);
    const dataInicioPlantio = new Date(plantio.dataInicio);

    if (dataColheita < dataInicioPlantio) {
      ctx.addIssue({
        path: ["dataColheita"],
        code: z.ZodIssueCode.custom,
        message: "A data da colheita não pode ser anterior ao plantio",
      });
    }

    const quantidadeColhida = parseFloat(data.quantidadeColhida);
    if (quantidadeColhida > plantio.quantidadePlantada) {
      ctx.addIssue({
        path: ["quantidadeColhida"],
        code: z.ZodIssueCode.custom,
        message: `Quantidade colhida não pode ser maior que a plantada (${plantio.quantidadePlantada})`,
      });
    }
  });

export default colheitaSchema;
