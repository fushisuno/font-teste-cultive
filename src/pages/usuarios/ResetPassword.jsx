import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserStore } from "@/stores/useUserStore";
import { FormField } from "@/components/layout/FormField";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

// Schema Zod para validação de senha
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, "A senha deve ter pelo menos 12 caracteres")
      .max(100, "A senha é muito longa"),

    confirmPassword: z.string().min(12, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading } = useUserStore();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "all",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, reset, control } = form;

  const onSubmit = async (data) => {
    if (!resetToken) {
      toast.error("Token de redefinição inválido");
      return;
    }

    const success = await resetPassword(resetToken, data.password);

    if (success) {
      reset();
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <LoadingOverlay loading={loading} message="Processando..." />
      <div className="max-w-md w-full bg-base-100 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Redefinir Senha</h1>
        <p className="text-center text-base-content/70 mb-6">
          Insira sua nova senha abaixo.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            type="password"
            placeholder="Nova senha"
            name="password"
            control={control}
          />
          <FormField
            type="password"
            placeholder="Confirmar nova senha"
            name="confirmPassword"
            control={control}
          />
          <Button type="submit" className="w-full">
            Redefinir Senha
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
