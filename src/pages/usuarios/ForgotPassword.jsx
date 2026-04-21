import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserStore } from "@/stores/useUserStore";
import { FormField } from "@/components/layout/FormField";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useNavigate } from "react-router-dom";

// Schema Zod para validação de email
const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useUserStore();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, reset, control } = form;

  const onSubmit = async (data) => {
    if (!data.email) {
      toast.error("Token de redefinição inválido");
      return;
    }

    const success = await forgotPassword(data.email);

    if (success) {
      reset();
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <LoadingOverlay loading={loading} message="Enviando e-mail..." />
      <div className="max-w-md w-full bg-base-100 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Esqueceu sua senha?
        </h1>
        <p className="text-center text-base-content/70 mb-6">
          Insira o e-mail associado à sua conta. Enviaremos instruções para
          redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            type="email"
            placeholder="Seu e-mail"
            name="email"
            control={control}
          />
          <Button type="submit" className="w-full">
            Enviar instruções
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
