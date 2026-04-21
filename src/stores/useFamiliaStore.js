import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useFamiliaStore = create((set, get) => ({
  familias: [],
  selectedFamilia: null,
  loading: false,

  fetchFamilias: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await axios.get("/familia", { params });
      set({ familias: res.data.familias, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.message || "Erro ao carregar famílias"
      );
    }
  },

  getFamiliaById: async (id) => {
    set({ loading: true, selectedFamilia: null });
    try {
      const res = await axios.get(`/familia/${id}`);
      set({ selectedFamilia: res.data.familia, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "Erro ao buscar família");
    }
  },

  createFamilia: async (data) => {
    set({ loading: true });
    try {
      const res = await axios.post("/familia", data);
      set((state) => ({
        familias: [...state.familias, res.data.familia],
        loading: false,
      }));
      toast.success("Família criada com sucesso!");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "Erro ao criar família");
    }
  },

  updateFamilia: async (id, data) => {
    set({ loading: true });
    try {
      const res = await axios.put(`/familia/${id}`, data);
      set((state) => ({
        familias: state.familias.map((f) =>
          f.id === id ? res.data.familia : f
        ),
        selectedFamilia:
          get().selectedFamilia?.id === id
            ? res.data.familia
            : get().selectedFamilia,
        loading: false,
      }));
      toast.success("Família atualizada com sucesso!");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.message || "Erro ao atualizar família"
      );
    }
  },

  deleteFamilia: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/familia/${id}`);
      set((state) => ({
        familias: state.familias.filter((f) => f.id !== id),
        selectedFamilia:
          get().selectedFamilia?.id === id ? null : get().selectedFamilia,
        loading: false,
      }));
      toast.success("Família removida com sucesso!");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "Erro ao remover família");
    }
  },

  addMembro: async (familiaId, membroData) => {
    set({ loading: true });
    try {
      const res = await axios.post(`/familia/${familiaId}/membros`, membroData);
      set((state) => ({
        selectedFamilia: {
          ...state.selectedFamilia,
          membros: [...(state.selectedFamilia?.membros || []), res.data.membro],
        },
        familias: state.familias.map((f) =>
          f.id === familiaId
            ? { ...f, membros: [...(f.membros || []), res.data.membro] }
            : f
        ),
        loading: false,
      }));
      toast.success("Membro adicionado com sucesso!");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "Erro ao adicionar membro");
    }
  },

  removeMembro: async (membroId) => {
    set({ loading: true });
    try {
      await axios.delete(`/familia/membros/${membroId}`);
      set((state) => ({
        selectedFamilia: {
          ...state.selectedFamilia,
          membros: state.selectedFamilia.membros.filter(
            (m) => m.id !== membroId
          ),
        },
        familias: state.familias.map((f) =>
          f.id === state.selectedFamilia?.id
            ? {
                ...f,
                membros: f.membros.filter((m) => m.id !== membroId),
              }
            : f
        ),
        loading: false,
      }));
      toast.success("Membro removido com sucesso!");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "Erro ao remover membro");
    }
  },

  clearSelectedFamilia: () => set({ selectedFamilia: null }),
}));
