import React, { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { User, CheckCircle2 } from "lucide-react";
import { onboardingSchema } from "@/lib/validation/usuarioSchema";

export default function Onboarding() {
  const { user, completeOnboarding } = useUserStore();
  const perfilTipo = user?.role;
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      role: user?.role,
      nome: user?.nome || "",
      telefone: user?.telefone || "",
      endereco: user?.endereco || "",
    },
    mode: "all",
    reValidateMode: "all",
  });

  const onSubmit = async (values) => {
    try {
      await completeOnboarding(values);
      toast.success("Perfil completo! Bem-vindo 🎉");
      window.location.href = "/dashboard";
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Erro ao completar o onboarding. Verifique os campos.";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <User className="w-12 h-12 mx-auto text-primary" />
        <h1 className="text-2xl font-bold mt-3">
          Bem-vindo(a), {user?.username}!
        </h1>
        <p className="text-base-content/70">
          Vamos configurar seu perfil de <strong>{perfilTipo}</strong>.
        </p>
      </div>

      {/* Etapa 1 - Informações gerais */}
      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
          className="card bg-base-200 shadow p-6 space-y-4"
        >
          <h2 className="font-semibold text-lg">Informações Gerais</h2>

          <div>
            <input
              type="text"
              placeholder="Nome completo"
              className="input input-bordered w-full"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-error text-sm mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Telefone"
              className="input input-bordered w-full"
              {...register("telefone")}
            />
            {errors.telefone && (
              <p className="text-error text-sm mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Endereço"
              className="input input-bordered w-full"
              {...register("endereco")}
            />
            {errors.endereco && (
              <p className="text-error text-sm mt-1">
                {errors.endereco.message}
              </p>
            )}
          </div>

          <button className="btn btn-primary w-full mt-4">Próximo</button>
        </form>
      )}

      {/* Etapa 2 - Perfil específico */}
      {step === 2 && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card bg-base-200 shadow p-6 space-y-4"
        >
          <h2 className="font-semibold text-lg capitalize">
            Informações do Perfil ({perfilTipo})
          </h2>

          {perfilTipo === "gestor" && (
            <>
              <input
                type="text"
                placeholder="Cargo"
                className="input input-bordered w-full"
                {...register("cargo")}
              />
              <input
                type="text"
                placeholder="Organização vinculada"
                className="input input-bordered w-full"
                {...register("organizacaoVinculada")}
              />
              <label className="label cursor-pointer justify-start gap-2">
                <span className="label-text">Receber alertas?</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  {...register("recebeAlertas")}
                />
              </label>
            </>
          )}

          {perfilTipo === "voluntario" && (
            <>
              <input
                type="text"
                placeholder="Área de interesse"
                className="input input-bordered w-full"
                {...register("interesse")}
              />
              <label className="label cursor-pointer justify-start gap-2">
                <span className="label-text">Está disponível?</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  {...register("disponivel")}
                />
              </label>
            </>
          )}

          {perfilTipo === "cultivador" && (
            <>
              <input
                type="text"
                placeholder="Tipo de experiência"
                className="input input-bordered w-full"
                {...register("tipoExperiencia")}
              />
              <input
                type="text"
                placeholder="Habilidades"
                className="input input-bordered w-full"
                {...register("habilidades")}
              />
            </>
          )}

          {perfilTipo === "admin" && (
            <input
              type="text"
              placeholder="Cargo"
              className="input input-bordered w-full"
              {...register("cargo")}
            />
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep(1)}
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-success"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-1" /> Finalizar
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
