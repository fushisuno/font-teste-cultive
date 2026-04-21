import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "../lib/axios";

export const usePlantioStore = create(
  devtools((set, get) => ({
    plantios: [],
    plantioSelecionado: null,
    loading: false,
    error: null,

    normalizePlantio: (plantio) => {
      let quantidadePlantada = 0;

      if (
        typeof plantio.quantidadePlantada === "object" &&
        plantio.quantidadePlantada !== null
      ) {
        quantidadePlantada =
          Number(plantio.quantidadePlantada.d) ||
          Number(plantio.quantidadePlantada.$numberDecimal) ||
          0;
      } else {
        quantidadePlantada = Number(plantio.quantidadePlantada) || 0;
      }

      const normalizeDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
        return null;
      };

      const dataInicioISO = normalizeDate(plantio.dataInicio);
      const previsaoColheitaISO = normalizeDate(plantio.previsaoColheita);

      return {
        ...plantio,
        dataInicio: dataInicioISO,
        previsaoColheita: previsaoColheitaISO,
        quantidadePlantada,
        unidadeMedida: plantio.unidadeMedida || "",
      };
    },

    fetchPlantios: async (params = {}) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get("/plantio", { params });
        const normalizedPlantios = (response.data.plantios || []).map((p) =>
          get().normalizePlantio(p)
        );
        set({ plantios: normalizedPlantios });
      } catch (err) {
        console.error("Erro ao buscar plantios:", err);
        set({
          error: err.response?.data?.message || "Erro ao buscar plantios",
        });
      } finally {
        set({ loading: false });
      }
    },

    fetchPlantioById: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get(`/plantio/${id}`);
        const plantio = get().normalizePlantio(response.data.plantio);
        set({ plantioSelecionado: plantio });
        return plantio;
      } catch (err) {
        console.error("Erro ao buscar plantio:", err);
        set({
          error: err.response?.data?.message || "Erro ao buscar plantio",
        });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    createPlantio: async (data) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post("/plantio", data);
        const plantio = get().normalizePlantio(response.data.plantio);

        set((state) => ({
          plantios: [plantio, ...state.plantios],
        }));

        return plantio;
      } catch (err) {
        console.error("Erro ao criar plantio:", err);
        set({
          error: err.response?.data?.message || "Erro ao criar plantio",
        });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updatePlantio: async (id, data) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.put(`/plantio/${id}`, data);
        const plantio = get().normalizePlantio(response.data.plantio);

        set((state) => ({
          plantios: state.plantios.map((p) => (p.id === id ? plantio : p)),
        }));

        return plantio;
      } catch (err) {
        console.error("Erro ao atualizar plantio:", err);
        set({
          error: err.response?.data?.message || "Erro ao atualizar plantio",
        });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deletePlantio: async (id) => {
      set({ loading: true, error: null });
      try {
        await axios.delete(`/plantio/${id}`);

        set((state) => ({
          plantios: state.plantios.filter((p) => p.id !== id),
        }));
      } catch (err) {
        console.error("Erro ao deletar plantio:", err);
        set({
          error: err.response?.data?.message || "Erro ao deletar plantio",
        });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    clearSelectedPlantio: () => set({ plantioSelecionado: null }),
  }))
);
