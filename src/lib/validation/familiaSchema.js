import { z } from "zod";

export const familiaSchemaGestor = z.object({
  nome: z.string().min(2, "O nome da família é obrigatório"),
  representante: z.string().min(2, "O representante é obrigatório"),
  qtdMembros: z.coerce.number().int().min(1, "Deve haver ao menos 1 membro"),
  descricao: z.string().max(255).optional().nullable(),
});

export const familiaSchemaAdmin = familiaSchemaGestor.extend({
  gestorId: z.string().uuid("Selecione um gestor válido"),
});
