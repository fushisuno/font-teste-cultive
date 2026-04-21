import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/useUserStore";
import { LogIn, Lock, User, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import usuarioSchema from "@/lib/validation/usuarioSchema";
import { FormField } from "@/components/layout/FormField";

const LoginPage = () => {
  const { login, loading } = useUserStore();
  const [isMobile, setIsMobile] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(
      usuarioSchema.pick({ username: true, password: true })
    ),
    defaultValues: {
      username: "",
      password: "",
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
    await login(data.username, data.password);
    reset();
  };

  return (
    <div className="min-h-screen w-full bg-base-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center bg-base-200 transition-all duration-300">
        <div className="card bg-base-100 border border-base-300 shadow-lg w-full max-w-md mx-4 relative">
          {/* Cabeçalho */}
          <div className="card-body p-6 space-y-1 text-center">
            <h2 className="text-2xl font-bold text-base-content">Entrar</h2>
            <p className="text-base-content/70 text-sm">
              Volte a cultivar com sua comunidade
            </p>
          </div>

          {/* Formulário */}
          <div className="card-body p-6 pt-0 space-y-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Username */}
              <FormField
                name="username"
                control={control}
                placeholder="Seu nome de usuário"
                className="md:col-span-2"
                iconLeft={User}
              />

              {/* Password */}
              <div className="md:col-span-2 flex flex-col space-y-1">
                <div className="flex justify-end text-xs text-primary hover:underline">
                  <Link to="/forgot-password">Esqueceu a senha?</Link>
                </div>
                <FormField
                  name="password"
                  control={control}
                  placeholder="Sua senha"
                  type="password"
                  className="w-full"
                  iconLeft={Lock}
                />
              </div>

              {/* Botão de login */}
              <button
                type="submit"
                className="btn btn-primary w-full md:col-span-2 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading loading-spinner loading-sm mr-2"></div>
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Rodapé */}
          <div className="card-body p-6 pt-0 flex flex-col space-y-4 items-center">
            <div className="text-center text-sm text-base-content/70">
              Não tem uma conta?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Cadastre-se
              </Link>
            </div>
            <div className="text-center text-xs text-base-content/60">
              Ao fazer login, você concorda com nossos{" "}
              <a href="/termos" className="hover:underline">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="/privacidade" className="hover:underline">
                Política de Privacidade
              </a>
              .
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
