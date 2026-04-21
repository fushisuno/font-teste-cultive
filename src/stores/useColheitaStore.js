import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "../lib/axios";

export const useColheitaStore = create(
  devtools((set, get) => ({
    colheitas: [],
    colheitaSelecionada: null,
    loading: false,
    error: null,

    normalizeColheita: (colheita) => {
      let quantidadeColhida = 0;

      if (
        typeof colheita.quantidadeColhida === "object" &&
        colheita.quantidadeColhida !== null
      ) {
        quantidadeColhida =
          Number(colheita.quantidadeColhida.d) ||
          Number(colheita.quantidadeColhida.$numberDecimal) ||
          0;
      } else {
        quantidadeColhida = Number(colheita.quantidadeColhida) || 0;
      }

      let dataColheitaISO = null;
      if (colheita.dataColheita) {
        const date = new Date(colheita.dataColheita);
        if (!isNaN(date.getTime())) {
          dataColheitaISO = date.toISOString();
        } else {
          console.warn("Colheita com data inválida detectada:", colheita);
        }
      }

      return {
        ...colheita,
        dataColheita: dataColheitaISO,
        quantidadeColhida,
      };
    },

    fetchColheitas: async (params = {}) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get("/colheita", { params });
        const normalizedColheitas = (response.data.colheitas || []).map((c) =>
          get().normalizeColheita(c)
        );
        set({ colheitas: normalizedColheitas });
      } catch (err) {
        console.error("Erro ao buscar colheitas:", err);
        set({
          error: err.response?.data?.message || "Erro ao buscar colheitas",
        });
      } finally {
        set({ loading: false });
      }
    },

    fetchColheitaById: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get(`/colheita/${id}`);
        set({
          colheitaSelecionada: get().normalizeColheita(response.data.colheita),
        });
        return response.data.colheita;
      } catch (err) {
        console.error("Erro ao buscar colheita:", err);
        set({
          error: err.response?.data?.message || "Erro ao buscar colheita",
        });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    createColheita: async (data) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post("/colheita", data);
        const colheita = get().normalizeColheita(response.data.colheita);

        set((state) => ({
          colheitas: [colheita, ...state.colheitas],
        }));

        return colheita;
      } catch (err) {
        console.error("Erro ao criar colheita:", err);
        set({ error: err.response?.data?.message || "Erro ao criar colheita" });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateColheita: async (id, data) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.put(`/colheita/${id}`, data);
        const colheita = get().normalizeColheita(response.data.colheita);

        set((state) => ({
          colheitas: state.colheitas.map((c) => (c.id === id ? colheita : c)),
        }));

        return colheita;
      } catch (err) {
        console.error("Erro ao atualizar colheita:", err);
        set({
          error: err.response?.data?.message || "Erro ao atualizar colheita",
        });
        throw err;
      } finally {
        set({ loading: false });
      }
    },
    deleteColheita: async (id) => {
      set({ loading: true, error: null });
      try {
        await axios.delete(`/colheita/${id}`);

        set((state) => ({
          colheitas: state.colheitas.filter((c) => c.id !== id),
        }));
      } catch (err) {
        console.error("Erro ao deletar colheita:", err);
        set({
          error: err.response?.data?.message || "Erro ao deletar colheita",
        });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    clearSelectedColheita: () => set({ colheitaSelecionada: null }),
  }))
);
