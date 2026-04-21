import { z } from "zod";

export const usuarioSchemaCreate = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome é muito longo"),

  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
    .max(30, "O nome de usuário é muito longo"),

  email: z.string().email("E-mail inválido"),

  password: z
    .string()
    .min(12, "A senha deve ter pelo menos 12 caracteres")
    .max(100, "A senha é muito longa"),

  confirmPassword: z.string().min(12, "Confirme sua senha"),

  telefone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido")
    .optional()
    .nullable(),

  endereco: z
    .string()
    .min(5, "Endereço muito curto")
    .max(255, "Endereço muito longo")
    .optional()
    .nullable(),

  familiaId: z.string().uuid("ID de família inválido").optional().nullable(),

  pictureUrl: z.string().url("URL inválida").optional().nullable(),

  role: z
    .enum(["admin", "gestor", "cultivador", "voluntario"])
    .default("cultivador")
    .optional(),

  onBoarding: z.boolean().default(false).optional(),
});

export const usuarioSchemaUpdate = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").optional(),
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
    .optional(),
  email: z.string().email("E-mail inválido").optional(),
  telefone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido")
    .optional()
    .nullable()
    .or(z.literal("")),
  endereco: z
    .string()
    .min(5, "Endereço muito curto")
    .max(255, "Endereço muito longo")
    .optional()
    .nullable()
    .or(z.literal("")),

  familiaId: z
    .string()
    .uuid("ID de família inválido")
    .optional()
    .nullable()
    .or(z.literal("")),
  pictureUrl: z.string().url("URL inválida").optional().nullable(),
  role: z.enum(["admin", "gestor", "cultivador", "voluntario"]).optional(),
  onBoarding: z.boolean().optional(),
});

const baseSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  telefone: z.string().regex(/^\d{10,11}$/, "Telefone inválido"),
  endereco: z.string().min(5, "Endereço muito curto"),
});

// Perfis específicos
const gestorSchema = baseSchema.extend({
  role: z.literal("gestor"),
  cargo: z.string().min(2, "Cargo obrigatório"),
  organizacaoVinculada: z.string().min(2, "Organização obrigatória"),
  recebeAlertas: z.boolean().optional(),
});

const voluntarioSchema = baseSchema.extend({
  role: z.literal("voluntario"),
  interesse: z.string().min(2, "Área de interesse obrigatória"),
  disponivel: z.boolean().optional(),
});

const cultivadorSchema = baseSchema.extend({
  role: z.literal("cultivador"),
  tipoExperiencia: z.string().min(2, "Experiência obrigatória"),
  habilidades: z.string().min(2, "Habilidades obrigatórias"),
});

const adminSchema = baseSchema.extend({
  role: z.literal("admin"),
  cargo: z.string().min(2, "Cargo obrigatório"),
});

export const onboardingSchema = z.discriminatedUnion("role", [
  gestorSchema,
  voluntarioSchema,
  cultivadorSchema,
  adminSchema,
]);

export default usuarioSchemaCreate;
