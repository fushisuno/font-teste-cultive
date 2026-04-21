import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      selectedUser: null,
      loading: false,
      checkinAuth: true,

      signup: async ({ name, username, email, password, confirmPassword }) => {
        set({ loading: true });
        if (password !== confirmPassword) {
          set({ loading: false });
          return toast.error("As senhas não coincidem");
        }
        try {
          const res = await axios.post("/auth/signup", {
            nome: name,
            username,
            email,
            senha: password,
          });
          set({ user: res.data.user, loading: false });
        } catch (error) {
          set({ loading: false });
          toast.error(error?.response?.data?.message || "Erro ao criar conta");
        }
      },

      login: async (username, password) => {
        set({ loading: true });
        try {
          const res = await axios.post("/auth/login", {
            username,
            senha: password,
          });
          set({ user: res.data.user, loading: false });
        } catch (error) {
          set({ loading: false });
          toast.error(error?.response?.data?.message || "Erro ao fazer login");
        }
      },

      logout: async () => {
        try {
          await axios.get("/auth/logout");
          set({ user: null });
        } catch (error) {
          toast.error(error?.response?.data?.message || "Erro ao fazer logout");
        }
      },

      checkAuth: async (silent = false) => {
        set({ checkinAuth: true });

        try {
          const res = await axios.get("/auth/me", { silent });

          set({ user: res.data.user, checkinAuth: false });
        } catch (error) {
          set({ user: null, checkinAuth: false });

          const code = error?.response?.data?.code;
          if (
            !silent &&
            [
              "NO_TOKEN",
              "TOKEN_EXPIRED",
              "INVALID_TOKEN",
              "USER_NOT_FOUND",
            ].includes(code)
          ) {
            toast.error(
              error.response?.data?.message || "Faça login novamente"
            );
            window.location.href = "/login";
            return;
          }

          if (!silent) {
            console.warn("Erro ao verificar autenticação:", error?.message);
          }
        }
      },

      forgotPassword: async (email) => {
        set({ loading: true });

        if (!email) {
          toast.error("Email obrigatório");
          set({ loading: false });
          return false;
        }

        try {
          const res = await axios.post("/auth/forgot-password", { email });
          toast.success(res.data.message);
          set({ loading: false });
          return true;
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Erro ao redefinir senha"
          );
          set({ loading: false });
          return false;
        }
      },

      resetPassword: async (token, newPassword) => {
        set({ loading: true });

        if (!token || !newPassword) {
          toast.error("Token e nova senha são obrigatórios");
          set({ loading: false });
          return false;
        }

        try {
          const res = await axios.post("/auth/reset-password", {
            token,
            newPassword,
          });
          toast.success(res.data.message || "Senha redefinida com sucesso!");
          set({ loading: false });
          return true;
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Erro ao redefinir senha"
          );
          set({ loading: false });
          return false;
        }
      },

      fetchUsers: async (params = {}) => {
        set({ loading: true, users: [] });
        try {
          const res = await axios.get("/user", { params });
          set({ users: res.data.usuarios, loading: false });
        } catch (error) {
          set({ loading: false });
          toast.error(
            error?.response?.data?.message || "Erro ao buscar usuários"
          );
        }
      },

      getDashboardData: async () => {
        set({ loading: true });

        try {
          const res = await axios.get("/user/dashboard/data");
          const data = res.data.data;

          const isAdmin = data?.totais !== undefined;

          if (isAdmin) {
            set({
              dashboardData: data,
              loading: false,
              isAdmin,
            });
          } else {
            set({
              user: data,
              loading: false,
              isAdmin,
            });
          }
        } catch (error) {
          set({ loading: false });

          toast.error(
            error?.response?.data?.message || "Erro ao carregar dados completos"
          );

          return null;
        }
      },

      getUser: async (id) => {
        set({ loading: true, selectedUser: null });
        try {
          const res = await axios.get(`/user/${id}`);
          set({ selectedUser: res.data.usuario, loading: false });
        } catch (error) {
          set({ loading: false });
          toast.error(
            error?.response?.data?.message || "Erro ao buscar usuário"
          );
        }
      },

      createUser: async (data) => {
        set({ loading: true });
        try {
          const payload = {
            nome: data.name,
            username: data.username,
            email: data.email,
            telefone: data.telefone || null,
            endereco: data.endereco || null,
            familiaId: data.familiaId || null,
            role: data.role || "cultivador",
            pictureUrl: data.pictureUrl || null,
          };
          const res = await axios.post("/user", payload);
          const novoUsuario = res.data.user;
          set({
            users: [...get().users, novoUsuario],
            loading: false,
          });
          toast.success("Usuário criado com sucesso!");
        } catch (error) {
          set({ loading: false });
          toast.error(
            error?.response?.data?.message || "Erro ao criar usuário"
          );
        }
      },

      updateUser: async (id, data) => {
        set({ loading: true });
        try {
          const payload = {
            nome: data.name,
            username: data.username,
            email: data.email,
            telefone: data.telefone || null,
            endereco: data.endereco || null,
            familiaId: data.familiaId || null,
            role: data.role || "cultivador",
            pictureUrl: data.pictureUrl || null,
          };
          const res = await axios.put(`/user/${id}`, payload);
          const updatedUser = res.data.usuario;

          const users = get().users.map((u) => (u.id === id ? updatedUser : u));
          set({ selectedUser: updatedUser, users, loading: false });
          toast.success("Usuário atualizado com sucesso");
        } catch (error) {
          set({ loading: false });
          toast.error(
            error?.response?.data?.message || "Erro ao atualizar usuário"
          );
        }
      },

      completeOnboarding: async (data) => {
        set({ loading: true });
        try {
          const res = await axios.post("/user/onboarding", data);
          set({ user: res.data.user, loading: false });
          toast.success("Perfil completado com sucesso!");
          return true;
        } catch (error) {
          set({ loading: false });
          toast.error(
            error?.response?.data?.message || "Erro ao completar o perfil"
          );
          return false;
        }
      },

      deleteUser: async (id) => {
        set({ loading: true });
        try {
          await axios.delete(`/user/${id}`);
          const users = get().users.filter((u) => u.id !== id);
          set({ users, loading: false });
          toast.success("Usuário excluído com sucesso");
        } catch (error) {
          set({ loading: false });
          toast.error(
            error?.response?.data?.message || "Erro ao excluir usuário"
          );
        }
      },

      clearSelectedUser: () => set({ selectedUser: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
