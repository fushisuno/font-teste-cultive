import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "../lib/axios";

export const useHortaStore = create(
  devtools((set, get) => ({
    hortas: [],
    hortaSelecionada: null,
    loading: false,
    error: null,

    normalizeHorta: (horta) => {
      // Normaliza área cultivada
      let areaCultivada = 0;
      if (typeof horta.areaCultivada === "object" && horta.areaCultivada !== null) {
        areaCultivada =
          Number(horta.areaCultivada.d) ||
          Number(horta.areaCultivada.$numberDecimal) ||
          0;
      } else {
        areaCultivada = Number(horta.areaCultivada) || 0;
      }

      // Normaliza datas
      const normalizeDate = (date) => {
        if (!date) return null;
        if (typeof date === "string" || date instanceof Date) {
          const d = new Date(date);
          return isNaN(d.getTime()) ? null : d.toISOString();
        }
        if (date.d) {
          const d = new Date(date.d);
          return isNaN(d.getTime()) ? null : d.toISOString();
        }
        return null;
      };

      const plantiosNormalized =
        (horta.plantios || []).map((p) => ({
          ...p,
          dataInicio: normalizeDate(p.dataInicio),
          previsaoColheita: normalizeDate(p.previsaoColheita),
          dataColheita: normalizeDate(p.dataColheita),
          quantidadePlantada:
            typeof p.quantidadePlantada === "object" && p.quantidadePlantada !== null
              ? Number(p.quantidadePlantada.d) || Number(p.quantidadePlantada.$numberDecimal) || 0
              : Number(p.quantidadePlantada) || 0,
          unidadeMedida: p.unidadeMedida || "",
        }));

      // Normaliza coordenadas
      const coordenada = horta.coordenada || horta.coordenadasGeoJSON || "";

      return {
        ...horta,
        areaCultivada,
        coordenada,
        plantios: plantiosNormalized,
      };
    },

    fetchHortas: async (params = {}) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get("/horta", { params });
        const normalizedHortas = (response.data.hortas || []).map((h) =>
          get().normalizeHorta(h)
        );
        set({ hortas: normalizedHortas });
      } catch (err) {
        console.error("Erro ao buscar hortas:", err);
        set({ error: err.response?.data?.message || "Erro ao buscar hortas" });
      } finally {
        set({ loading: false });
      }
    },

    fetchHortaById: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get(`/horta/${id}`);
        const horta = get().normalizeHorta(response.data.horta);
        set({ hortaSelecionada: horta });
        return horta;
      } catch (err) {
        console.error("Erro ao buscar horta:", err);
        set({ error: err.response?.data?.message || "Erro ao buscar horta" });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    createHorta: async (data) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post("/horta", data);
        const horta = get().normalizeHorta(response.data.horta);
        set((state) => ({ hortas: [horta, ...state.hortas] }));
        return horta;
      } catch (err) {
        console.error("Erro ao criar horta:", err);
        set({ error: err.response?.data?.message || "Erro ao criar horta" });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateHorta: async (id, data) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.put(`/horta/${id}`, data);
        const horta = get().normalizeHorta(response.data.horta);
        set((state) => ({
          hortas: state.hortas.map((h) => (h.id === id ? horta : h)),
        }));
        return horta;
      } catch (err) {
        console.error("Erro ao atualizar horta:", err);
        set({ error: err.response?.data?.message || "Erro ao atualizar horta" });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteHorta: async (id) => {
      set({ loading: true, error: null });
      try {
        await axios.delete(`/horta/${id}`);
        set((state) => ({ hortas: state.hortas.filter((h) => h.id !== id) }));
      } catch (err) {
        console.error("Erro ao deletar horta:", err);
        set({ error: err.response?.data?.message || "Erro ao deletar horta" });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    clearSelectedHorta: () => set({ hortaSelecionada: null }),
  }))
);
