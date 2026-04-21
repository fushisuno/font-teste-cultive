import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/useUserStore";
import { Loader, Lock, LogIn, Mail, User, Eye, EyeOff, AtSign } from "lucide-react";
import { Link } from "react-router-dom";
import usuarioSchema from "@/lib/validation/usuarioSchema";
import { FormField } from "@/components/layout/FormField";

const SignupPage = () => {
  const { signup, loading } = useUserStore();
  const [isMobile, setIsMobile] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
    reValidateMode: "all",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (data) => {
    await signup(data);
    reset()
  };

  return (
    <div className="h-full bg-base-100 flex flex-col">
      <main className="w-full min-h-screen flex-1 flex items-center justify-center bg-base-200 transition-all duration-300">
        <div className="card bg-base-100 border border-base-300 shadow-lg w-full max-w-md mx-4 relative">
          {/* Cabeçalho */}
          <div className="card-body p-6 space-y-1 text-center">
            <h2 className="text-2xl font-bold text-base-content">
              Criar conta
            </h2>
            <p className="text-base-content/70 text-sm">
              Comece sua jornada na HortaComm
            </p>
          </div>

          {/* Formulário */}
          <div className="card-body p-6 pt-0 space-y-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Nome */}
              <FormField
                name="name"
                control={control}
                placeholder="Nome completo"
                className="md:col-span-2"
                iconLeft={User}
              />

              {/* Username */}
              <FormField
                name="username"
                control={control}
                placeholder="Nome de usuário"
                className="md:col-span-2"
                iconLeft={AtSign}
              />

              {/* Email */}
              <FormField
                name="email"
                control={control}
                placeholder="Email"
                type="email"
                className="md:col-span-2"
                iconLeft={Mail}
              />

              {/* Password */}
              <FormField
                name="password"
                control={control}
                placeholder="Crie uma senha"
                type="password"
                className="md:col-span-2"
                iconLeft={Lock}
              />

              {/* Confirm Password */}
              <FormField
                name="confirmPassword"
                control={control}
                placeholder="Confirme sua senha"
                type="password"
                className="md:col-span-2"
                iconLeft={Lock}
              />

              {/* Termos */}
              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                />
                <label htmlFor="terms" className="text-sm text-base-content/70">
                  Concordo com os{" "}
                  <a href="/termos" className="text-primary hover:underline">
                    Termos de Serviço
                  </a>{" "}
                  e{" "}
                  <a
                    href="/privacidade"
                    className="text-primary hover:underline"
                  >
                    Política de Privacidade
                  </a>
                </label>
              </div>

              {/* Botão de submit */}
              <button
                type="submit"
                className="btn btn-primary w-full md:col-span-2 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Criar conta
                  </>
                )}
              </button>
            </form>

            {/* Link para login */}
            <div className="text-center mt-2 md:col-span-2">
              <p className="text-sm text-base-content/70">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
