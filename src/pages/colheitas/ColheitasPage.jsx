import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash,
  Calendar,
  Sprout,
  Scale,
  Truck,
  Search,
  Table,
  LayoutGrid,
  Eye,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormModal } from "@/components/ui/FormModal";
import { FormField } from "@/components/layout/FormField";
import colheitaSchema from "@/lib/validation/colheitaSchema";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import FloatingButton from "@/components/layout/FloatingActionButton";
import Badge from "@/components/ui/Badge";
import SmartDropdown from "../../components/ui/SmartDropdown";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

import { useColheitaStore } from "@/stores/useColheitaStore";
import { usePlantioStore } from "@/stores/usePlantioStore";
import { useUserStore } from "@/stores/useUserStore";
import {
  EDestinoColheita,
  EUnidadeMedida,
} from "../../lib/validation/colheitaSchema";

const ColheitasPage = () => {
  const modalRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [destinoFilter, setDestinoFilter] = useState("");
  const [culturaFilter, setCulturaFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [loadingPlantios, setLoadingPlantios] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingColheita, setEditingColheita] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    colheitas,
    fetchColheitas,
    createColheita,
    updateColheita,
    deleteColheita,
    loading,
  } = useColheitaStore();

  const { plantios, fetchPlantios } = usePlantioStore();
  const { user } = useUserStore();

  const form = useForm({
    resolver: zodResolver(colheitaSchema),
    defaultValues: {
      cultura: "",
      dataColheita: "",
      quantidadeColhida: "",
      unidadeMedida: "",
      destinoColheita: "Consumo", // ✔ Enum correto
      observacoes: "",
      plantioId: "",
    },
    mode: "all",
    reValidateMode: "all",
  });

  const { reset, watch } = form;

  const selectedPlantioId = watch("plantioId");

  useEffect(() => {
    fetchColheitas();
  }, []);

  useEffect(() => {
    if (!selectedPlantioId) {
      form.setValue("cultura", "", { shouldValidate: true });
      form.setValue("unidadeMedida", "", { shouldValidate: true });
      return;
    }

    const selectedPlantio = plantios.find((p) => p.id === selectedPlantioId);

    if (selectedPlantio) {
      form.setValue("cultura", selectedPlantio.cultura, {
        shouldValidate: true,
      });

      if (!editingColheita) {
        form.setValue("unidadeMedida", selectedPlantio.unidadeMedida, {
          shouldValidate: true,
        });
      }
    }
  }, [selectedPlantioId, plantios, editingColheita]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setViewMode("cards");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleSidebarToggle = (e) => {
      const sidebarOpenState = e.detail;
      setSidebarOpen(sidebarOpenState);

      const isMedium = window.innerWidth < 1024;

      if (!sidebarOpenState && !isMobile) setViewMode("table");
      if (sidebarOpenState && isMedium) setViewMode("cards");
    };

    window.addEventListener("sidebar-toggle", handleSidebarToggle);
    return () =>
      window.removeEventListener("sidebar-toggle", handleSidebarToggle);
  }, [isMobile]);

  const handleOpenModal = async (colheita = null) => {
    setModalLoading(true);

    try {
      setEditingColheita(colheita);

      if (!plantios || plantios.length === 0) {
        setLoadingPlantios(true);
        await fetchPlantios();
        setLoadingPlantios(false);
      }

      reset({
        cultura: colheita?.cultura || "",
        dataColheita: colheita?.dataColheita
          ? new Date(colheita.dataColheita).toISOString().split("T")[0]
          : "",
        quantidadeColhida: colheita?.quantidadeColhida + "" || "",
        unidadeMedida: colheita?.unidadeMedida || "",
        destinoColheita: colheita?.destinoColheita || "Consumo", // ✔ Corrigido
        observacoes: colheita?.observacoes || "",
        plantioId: colheita?.plantioId || "",
      });

      modalRef.current?.open();
    } catch (err) {
      console.error("Erro ao preparar formulário de colheita:", err);
      toast.error("Erro ao preparar formulário de colheita");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveColheita = async (data) => {
    setSaving(true);

    const plantio = plantios.find((p) => p.id === data.plantioId);

    try {
      colheitaSchema.parse(data, { context: { plantio } });

      const dataToSave = {
        ...data,
        quantidadeColhida: parseFloat(data.quantidadeColhida),
      };

      
      if (editingColheita) {
        await updateColheita(editingColheita.id, dataToSave);
      } else {
        await createColheita(dataToSave);
      }

      modalRef.current?.close();
      setEditingColheita(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Falha ao salvar a colheita. Tente novamente.";
      console.error("Erro ao salvar colheita:", err);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteColheita = async (id) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este registro de colheita? Esta ação é irreversível."
    );
    if (!confirmDelete) return;

    try {
      await deleteColheita(id);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Falha ao excluir a colheita. Tente novamente.";
      console.error("Erro ao excluir colheita:", err);
      toast.error(errorMessage);
    }
  };

  const filteredColheitas = useMemo(() => {
    return colheitas
      .filter((c) => c && typeof c === "object")
      .filter((c) => {
        const query = searchQuery.toLowerCase();

        const matchesSearch =
          c.cultura.toLowerCase().includes(query) ||
          c.destinoColheita.toLowerCase().includes(query) ||
          c.observacoes?.toLowerCase().includes(query);

        const matchesCultura = culturaFilter
          ? c.cultura.toLowerCase() === culturaFilter.toLowerCase()
          : true;

        const matchesDate = dateFilter
          ? new Date(c.dataColheita).toISOString().split("T")[0] === dateFilter
          : true;

        const matchesDestino = destinoFilter
          ? c.destinoColheita.toLowerCase() === destinoFilter.toLowerCase()
          : true;

        return matchesSearch && matchesCultura && matchesDate && matchesDestino;
      });
  }, [colheitas, searchQuery, destinoFilter, culturaFilter, dateFilter]);

  const totalQuantity = filteredColheitas.reduce(
    (acc, c) => acc + (c.quantidadeColhida || 0),
    0
  );
  const unitsSet = new Set(
    filteredColheitas.map((c) => c.unidadeMedida).filter(Boolean)
  );
  const unitsUsed = unitsSet.size > 0 ? [...unitsSet].join("/") : "kg";

  const lastHarvestDate =
    filteredColheitas.length > 0
      ? new Date(
          Math.max(...filteredColheitas.map((c) => new Date(c.dataColheita)))
        ).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const canEditOrDelete = user.role === "admin" || user.role === "gestor";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 relative">
      <LoadingOverlay loading={loading} message="Carregando colheitas..." />
      <LoadingOverlay
        loading={modalLoading}
        message="Preparando formulário..."
      />

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Registro de Colheitas
          </h1>
          <p className="text-base-content/70 mt-1">
            Acompanhe e gerencie as colheitas realizadas no sistema.
          </p>
        </div>
        {canEditOrDelete && (
          <Button onClick={() => handleOpenModal(null)} icon={Plus}>
            Adicionar Colheita
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      {!loading && (
        <>
          <ResponsiveGrid columns={4}>
            <StatCard
              title="Colheitas Totais"
              value={colheitas.length.toString()}
              description="Colheitas registradas"
              icon={Sprout}
            />
            <StatCard
              title="Quantidade Total"
              value={`${totalQuantity} ${unitsUsed}`}
              description="Quantidade total colhida"
              icon={Scale}
            />
            <StatCard
              title="Última Colheita"
              value={lastHarvestDate}
              description="Data da colheita mais recente"
              icon={Calendar}
              smallValue
            />
            <StatCard
              title="Destinos Diferentes"
              value={new Set(
                colheitas.map((c) => c.destinoColheita).filter(Boolean)
              ).size.toString()}
              description="Para onde a produção foi"
              icon={Truck}
            />
          </ResponsiveGrid>

          {/* Filtros */}
          <div className="flex flex-col gap-4 mt-6 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100 w-full">
              <Search className="h-4 w-4 text-primary/70" />
              <input
                type="text"
                className="grow bg-transparent focus:outline-none text-base-content"
                placeholder="Buscar por cultura, destino ou observações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                className="input input-bordered flex-1 w-full sm:w-auto rounded-lg text-base-content/70"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />

              <select
                className="select select-bordered flex-1 w-full sm:w-auto rounded-lg text-base-content/70"
                value={culturaFilter}
                onChange={(e) => setCulturaFilter(e.target.value)}
              >
                <option value="">Todas as Culturas</option>
                {[...new Set(colheitas.map((c) => c.cultura))].map(
                  (cultura) => (
                    <option key={cultura} value={cultura}>
                      {cultura}
                    </option>
                  )
                )}
              </select>

              <select
                className="select select-bordered flex-1 w-full sm:w-auto rounded-lg text-base-content/70"
                value={destinoFilter}
                onChange={(e) => setDestinoFilter(e.target.value)}
              >
                <option value="">Todos os Destinos</option>
                {[...new Set(colheitas.map((c) => c.destinoColheita))].map(
                  (destino) => (
                    <option key={destino} value={destino}>
                      {destino}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Botões de visualização */}
          <div className="flex justify-start gap-2 mb-4">
            <button
              className={`btn btn-sm ${
                viewMode === "table"
                  ? "btn-primary"
                  : "btn-outline border-base-300"
              }`}
              onClick={() => setViewMode("table")}
              disabled={isMobile || sidebarOpen}
            >
              <Table className="h-4 w-4 mr-1" /> Tabela
            </button>
            <button
              className={`btn btn-sm ${
                viewMode === "cards"
                  ? "btn-primary"
                  : "btn-outline border-base-300"
              }`}
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="h-4 w-4 mr-1" /> Cards
            </button>
          </div>

          {/* Lista de colheitas */}
          {viewMode === "table" ? (
            <div className="overflow-x-auto shadow-xl rounded-xl border border-base-200">
              <table className="table w-full table-zebra table-fixed">
                <thead>
                  <tr>
                    {[
                      "Cultura",
                      "Destino",
                      "Data Colheita",
                      "Quantidade",
                      "Observações",
                      "Ações",
                    ].map((col) => (
                      <th
                        key={col}
                        className="text-xs uppercase font-semibold tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredColheitas.length > 0 ? (
                    filteredColheitas.map((c) => (
                      <tr key={c.id}>
                        <td>{c.cultura}</td>
                        <td>
                          <Badge type={c.destinoColheita}>
                            {c.destinoColheita}
                          </Badge>
                        </td>
                        <td>
                          {new Date(c.dataColheita).toLocaleDateString("pt-BR")}
                        </td>
                        <td>
                          {c.quantidadeColhida} {c.unidadeMedida}
                        </td>
                        <td>{c.observacoes || "-"}</td>
                        <td>
                          <SmartDropdown
                            buttonClass="btn btn-ghost btn-sm text-base-content/70"
                            items={[
                              {
                                icon: <Eye className="h-4 w-4" />,
                                label: "Visualizar",
                                onClick: () =>
                                  toast("Visualizar não implementado"),
                              },
                              ...(canEditOrDelete
                                ? [
                                    {
                                      label: "Editar",
                                      icon: <Edit className="h-4 w-4" />,
                                      onClick: () => handleOpenModal(c),
                                    },
                                    {
                                      label: "Excluir",
                                      icon: <Trash className="h-4 w-4" />,
                                      danger: true,
                                      onClick: () => handleDeleteColheita(c.id),
                                    },
                                  ]
                                : []),
                            ]}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-base-content/60 italic"
                      >
                        Nenhum registro de colheita encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredColheitas.map((c) => (
                <div
                  key={c.id}
                  className="p-4 border border-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="absolute top-2 right-2">
                    <SmartDropdown
                      buttonClass="btn btn-ghost btn-xs text-base-content/70"
                      items={[
                        {
                          icon: <Eye className="h-4 w-4" />,
                          label: "Visualizar",
                          onClick: () => toast("Visualizar não implementado"),
                        },
                        ...(canEditOrDelete
                          ? [
                              {
                                label: "Editar",
                                icon: <Edit className="h-4 w-4" />,
                                onClick: () => handleOpenModal(c),
                              },
                              {
                                label: "Excluir",
                                icon: <Trash className="h-4 w-4" />,
                                danger: true,
                                onClick: () => handleDeleteColheita(c.id),
                              },
                            ]
                          : []),
                      ]}
                    />
                  </div>

                  <div className="font-bold text-lg">{c.cultura}</div>
                  <div className="text-sm text-base-content/70">
                    {c.quantidadeColhida} {c.unidadeMedida} -{" "}
                    {new Date(c.dataColheita).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="text-sm mt-1">
                    {c.observacoes || "Usuário não informou"}
                  </div>

                  <div className="mt-2">
                    <Badge type={c.destinoColheita}>{c.destinoColheita}</Badge>
                  </div>
                </div>
              ))}
              {filteredColheitas.length === 0 && (
                <p className="py-6 text-base-content/60 italic col-span-full">
                  Nenhum registro de colheita encontrado.
                </p>
              )}
            </div>
          )}

          <FormModal
            ref={modalRef}
            title={editingColheita ? "Editar Colheita" : "Registrar Colheita"}
            onSubmit={form.handleSubmit(handleSaveColheita)}
            submitLabel={
              saving
                ? "Salvando..."
                : editingColheita
                ? "Salvar Alterações"
                : "Registrar Colheita"
            }
            submitLoading={saving}
          >
            {loadingPlantios ? (
              <p className="text-center text-base-content/60 italic py-4">
                Carregando plantios...
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm font-medium">
                    Plantio de Origem (opcional)
                  </label>
                  <FormField
                    type="searchable-select"
                    placeholder="Selecione o Plantio"
                    name="plantioId"
                    control={form.control}
                    options={plantios.map((p) => ({
                      value: p.id,
                      label: p.cultura,
                    }))}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm font-medium">
                    Cultura Colhida <span className="text-error">*</span>
                  </label>
                  <FormField
                    type="input"
                    placeholder="Ex: Tomate, Alface"
                    name="cultura"
                    control={form.control}
                    disabled={!!selectedPlantioId}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">
                    Data da Colheita <span className="text-error">*</span>
                  </label>
                  <FormField
                    type="date"
                    name="dataColheita"
                    control={form.control}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">
                    Quantidade <span className="text-error">*</span>
                  </label>
                  <FormField
                    type="number"
                    placeholder="Ex: 5.5"
                    name="quantidadeColhida"
                    control={form.control}
                  />
                </div>

                <div className="flex gap-4 w-full">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm font-medium">
                      Unidade <span className="text-error">*</span>
                    </label>
                    <FormField
                      type="select"
                      name="unidadeMedida"
                      placeholder="Unidade de Medida"
                      disabled={!!selectedPlantioId}
                      control={form.control}
                      options={EUnidadeMedida.options.map((u) => ({
                        value: u,
                        label:
                          u.charAt(0).toUpperCase() +
                          u.slice(1).replace("_", " "),
                      }))}
                      defaultValue={
                        selectedPlantioId
                          ? plantios.find((p) => p.id === selectedPlantioId)
                              ?.unidadeMedida
                          : ""
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm font-medium">
                    Destino da Colheita <span className="text-error">*</span>
                  </label>
                  <FormField
                    type="select"
                    name="destinoColheita"
                    control={form.control}
                    placeholder="Destino da Colheita"
                    options={EDestinoColheita.options.map((d) => ({
                      value: d,
                      label:
                        d.charAt(0).toUpperCase() +
                        d.slice(1).replace("_", " "),
                    }))}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1 w-full">
                  <label className="text-sm font-medium">Observações</label>
                  <FormField
                    type="textarea"
                    placeholder="Detalhes adicionais sobre a colheita..."
                    name="observacoes"
                    control={form.control}
                  />
                </div>
              </>
            )}
          </FormModal>

          {canEditOrDelete && (
            <FloatingButton
              onClick={() => handleOpenModal(null)}
              tooltip="Adicionar Colheita"
              icon={<Plus className="h-6 w-6 md:h-7 md:w-7" />}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ColheitasPage;
