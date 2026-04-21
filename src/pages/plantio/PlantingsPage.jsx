import { toast } from "react-hot-toast";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import StatCard from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import {
  Edit,
  LayoutGrid,
  Plus,
  Search,
  Sprout,
  Tractor,
  Trash,
  Table,
  Eye,
} from "lucide-react";
import FloatingButton from "@/components/layout/FloatingActionButton";
import { FormModal } from "@/components/ui/FormModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import plantioSchema from "@/lib/validation/plantioSchema";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormField } from "@/components/layout/FormField";
import Badge from "@/components/ui/Badge";
import { usePlantioStore } from "@/stores/usePlantioStore";
import SmartDropdown from "@/components/ui/SmartDropdown";
import { useHortaStore } from "@/stores/useHortaStore";
import { useUserStore } from "@/stores/useUserStore";

import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { ETipoPlantacao } from "../../lib/validation/plantioSchema";

const PlantiosPage = () => {
  const modalRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loadingHortas, setLoadingHortas] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingPlantio, setEditingPlantio] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    plantios,
    fetchPlantios,
    updatePlantio,
    createPlantio,
    deletePlantio,
    loading,
  } = usePlantioStore();

  const { hortas, fetchHortas } = useHortaStore();

  const { user } = useUserStore();

  const form = useForm({
    resolver: zodResolver(plantioSchema),
    defaultValues: {
      cultura: "",
      tipoPlantacao: "",
      dataInicio: "",
      previsaoColheita: "",
      quantidadePlantada: "",
      unidadeMedida: "kg",
      observacoes: "",
      hortaId: "",
    },
    mode: "all",
    reValidateMode: "all",
  });

  const { reset } = form;

  useEffect(() => {
    fetchPlantios();
    fetchHortas();
  }, []);

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

  const handleOpenModal = async (plantio = null) => {
    setModalLoading(true);

    try {
      setEditingPlantio(plantio);

      if (!hortas || hortas.length === 0) {
        setLoadingHortas(true);
        await fetchHortas();
        setLoadingHortas(false);
      }

      reset({
        cultura: plantio?.cultura || "",
        tipoPlantacao: plantio?.tipoPlantacao || "",
        dataInicio: plantio?.dataInicio || "",
        previsaoColheita: plantio?.previsaoColheita || "",
        quantidadePlantada: plantio?.quantidadePlantada || "",
        unidadeMedida: plantio?.unidadeMedida || "kg",
        observacoes: plantio?.observacoes || "",
        hortaId: plantio?.hortaId || "",
      });

      modalRef.current?.open();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao abrir modal de plantio");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSavePlantio = async (data) => {
    setSaving(true);

    try {
      const payload = {
        ...data,
        quantidadePlantada: parseFloat(data.quantidadePlantada),
      };

      if (editingPlantio) {
        await updatePlantio(editingPlantio.id, payload);
      } else {
        await createPlantio(payload);
      }

      modalRef.current?.close();
      setEditingPlantio(null);
    } catch {
      console.error("Erro ao salvar plantio");
      toast.error("Erro ao salvar plantio");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlantio = async (id) => {
    if (!confirm("Deseja realmente excluir este plantio?")) return;
    try {
      await deletePlantio(id);
      toast.success("Plantio removido!");
    } catch {
      toast.error("Erro ao remover plantio");
    }
  };

  const filteredPlantios = useMemo(() => {
    return plantios.filter((p) => {
      const query = searchQuery.toLowerCase();
      const hortaNome = hortas.find((h) => h.id === p.hortaId)?.nome || "";
      const matchesSearch =
        p.cultura.toLowerCase().includes(query) ||
        p.tipoPlantacao.toLowerCase().includes(query) ||
        hortaNome.toLowerCase().includes(query);
      return matchesSearch;
    });
  }, [hortas, plantios, searchQuery]);

  const canEditOrDelete = user.role === "admin" || user.role === "gestor";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 relative">
      <LoadingOverlay loading={loading} message="Carregando plantios..." />
      <LoadingOverlay
        loading={modalLoading}
        message="Preparando formulário..."
      />

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Gerenciamento de Plantios
          </h1>
          <p className="text-base-content/70 mt-1">
            Visualize seus plantios, acompanhe o progresso e receba alertas
            importantes.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Adicionar Plantio
        </Button>
      </div>

      {/* Stats */}
      <ResponsiveGrid>
        <StatCard
          title="Plantios Totais"
          value={plantios.length.toString()}
          description="Plantios cadastrados"
          icon={LayoutGrid}
        />
        <StatCard
          title="Culturas Diferentes"
          value={new Set(plantios.map((p) => p.cultura)).size.toString()}
          description="Tipos de culturas"
          icon={Sprout}
        />
        {/* <StatCard
          title="Plantios Ativos"
          value={plantios.filter((p) => p.status === "ativo").length.toString()}
          description="Em andamento"
          icon={Tractor }
        /> */}
        {/* <StatCard
          title="Plantios Inativos"
          value={plantios
            .filter((p) => p.status === "inativo")
            .length.toString()}
          description="Finalizados ou pausados"
          icon={Tractor }
        /> */}
      </ResponsiveGrid>

      {/* Filtros */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="text"
            className="grow bg-transparent focus:outline-none text-base-content"
            placeholder="Buscar por cultura..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/*         <div className="flex flex-wrap gap-2">
          <select
            className="select select-bordered flex-1 w-full sm:w-auto rounded-lg"
            value={typeFilter || ""}
            onChange={(e) => setTypeFilter(e.target.value || "")}
          >
            <option value="">Filtrar por status</option>
            {uniquePlantioStatus.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Botões de visualização (Mantidos) */}
      <div className="flex justify-start gap-2 mb-4">
        <button
          className={`btn btn-sm ${
            viewMode === "table" ? "btn-primary" : "btn-outline border-base-300"
          }`}
          onClick={() => setViewMode("table")}
          disabled={isMobile || sidebarOpen}
        >
          <Table className="h-4 w-4 mr-1" /> Tabela
        </button>
        <button
          className={`btn btn-sm ${
            viewMode === "cards" ? "btn-primary" : "btn-outline border-base-300"
          }`}
          onClick={() => setViewMode("cards")}
        >
          <LayoutGrid className="h-4 w-4 mr-1" /> Cards
        </button>
      </div>

      {/* Tabela ou Cards */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto shadow-xl rounded-xl border border-base-200">
          <table className="table w-full table-zebra table-fixed">
            <thead>
              <tr>
                {[
                  "Cultura",
                  "Tipo Plantio",
                  "Data Início",
                  "Previsão Colheita",
                  "Quantidade",
                  "Observações",
                  "Ações",
                ]
                  .filter(Boolean)
                  .map((col) => (
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
              {filteredPlantios.length > 0 ? (
                filteredPlantios.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="font-semibold">{p.cultura}</div>
                      <div className="text-xs opacity-60">
                        {hortas.find((h) => h.id === p.horta.id)?.nome}
                      </div>
                    </td>
                    <td>
                      <Badge type={p.tipoPlantacao}>{p.tipoPlantacao}</Badge>
                    </td>
                    <td>
                      {p.dataInicio
                        ? new Date(p.dataInicio).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td>
                      {p.previsaoColheita
                        ? new Date(p.previsaoColheita).toLocaleDateString(
                            "pt-BR"
                          )
                        : "-"}
                    </td>

                    <td>{`${p.quantidadePlantada} ${p.unidadeMedida}`}</td>
                    {/* <td className="text-center">
                        <Badge type={p.status}>{p.status}</Badge>
                      </td> */}
                    <td className="truncate max-w-[150px]">
                      {p.observacoes || "-"}
                    </td>
                    <td>
                      <SmartDropdown
                        buttonClass="btn btn-ghost btn-sm text-base-content/70"
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
                                  onClick: () => handleOpenModal(p),
                                },
                                {
                                  label: "Excluir",
                                  icon: <Trash className="h-4 w-4" />,
                                  danger: true,
                                  onClick: () => handleDeletePlantio(p.id),
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
                    colSpan={9}
                    className="text-center py-6 text-base-content/60 italic"
                  >
                    Nenhum plantio encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlantios.length > 0 ? (
            filteredPlantios.map((p) => (
              <div
                key={p.id}
                className="p-4 border border-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
              >
                {" "}
                <SmartDropdown
                  buttonClass="btn btn-ghost btn-sm text-base-content/70"
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
                            onClick: () => handleOpenModal(p),
                          },
                          {
                            label: "Excluir",
                            icon: <Trash className="h-4 w-4" />,
                            danger: true,
                            onClick: () => handleDeletePlantio(p.id),
                          },
                        ]
                      : []),
                  ]}
                />
                <div className="font-bold text-lg">{p.cultura}</div>
                <div className="text-xs opacity-60">
                  {hortas.find((h) => h.id === p.hortaId)?.nome}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge type={p.tipoPlantacao}>{p.tipoPlantacao}</Badge>
                  {/*                   <Badge type={p.status}>{p.status}</Badge>
                   */}{" "}
                </div>
                <div className="flex flex-col gap-1 text-sm mt-2">
                  <div className="flex gap-1">
                    <span className="font-medium">Início:</span>{" "}
                    {p.dataInicio
                      ? new Date(p.dataInicio).toLocaleDateString("pt-BR")
                      : "-"}
                  </div>

                  <div className="flex gap-1">
                    <span className="font-medium">Previsão:</span>{" "}
                    {p.previsaoColheita ? new Date(p.previsaoColheita) : "-"}
                  </div>
                  <div className="flex gap-1">
                    <span className="font-medium">Colheita:</span>{" "}
                    {p.dataColheita
                      ? new Date(p.dataColheita).toLocaleDateString("pt-BR")
                      : "-"}
                  </div>
                  <div className="flex gap-1">
                    <span className="font-medium">Qtd:</span>{" "}
                    {p.quantidadePlantada} {p.unidadeMedida}
                  </div>
                  {p.observacoes && (
                    <div className="flex gap-1">
                      <span className="font-medium">Obs:</span> {p.observacoes}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-base-content/60 italic col-span-full">
              Nenhum plantio encontrado.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <FormModal
        ref={modalRef}
        title={editingPlantio ? "Editar Plantio" : "Adicionar Plantio"}
        onSubmit={form.handleSubmit(handleSavePlantio)}
        submitLabel={
          saving
            ? "Salvando..."
            : editingPlantio
            ? "Salvar Alterações"
            : "Adicionar Plantio"
        }
        submitLoading={saving}
      >
        {loadingHortas ? (
          <div className="text-center text-base-content/60 italic py-4">
            Carregando hortas...
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">
                Cultura <span className="text-error">*</span>
              </label>
              <FormField
                type="input"
                name="cultura"
                placeholder="Ex: Alface Crespa"
                control={form.control}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">
                Tipo de Plantio <span className="text-error">*</span>
              </label>
              <FormField
                type="select"
                name="tipoPlantacao"
                placeholder="Selecione o tipo de plantio"
                control={form.control}
                options={ETipoPlantacao.options.map((tipo) => ({
                  value: tipo,
                  label:
                    tipo.charAt(0).toUpperCase() +
                    tipo.slice(1).replace("_", " "),
                }))}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">
                Data de Início <span className="text-error">*</span>
              </label>
              <FormField
                type="date"
                name="dataInicio"
                placeholder="Selecione a data de início"
                control={form.control}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">
                Previsão de Colheita <span className="text-error">*</span>
              </label>
              <FormField
                type="date"
                name="previsaoColheita"
                placeholder="Selecione a previsão de colheita"
                control={form.control}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">
                Quantidade Plantada <span className="text-error">*</span>
              </label>
              <FormField
                type="number"
                name="quantidadePlantada"
                placeholder="Ex: 10.5"
                control={form.control}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">
                Unidade de Medida <span className="text-error">*</span>
              </label>
              <FormField
                type="select"
                name="unidadeMedida"
                control={form.control}
                options={[
                  { value: "kg", label: "kg" },
                  { value: "unidades", label: "unidades" },
                  { value: "m²", label: "m²" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">
                Horta <span className="text-error">*</span>
              </label>
              <FormField
                type="select"
                name="hortaId"
                placeholder="Selecione a horta"
                control={form.control}
                options={hortas.map((h) => ({
                  value: h.id,
                  label: h.nome,
                }))}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">
                Observações (opcional)
              </label>
              <FormField
                type="textarea"
                name="observacoes"
                placeholder="Informações adicionais sobre o plantio"
                control={form.control}
              />
            </div>
          </>
        )}
      </FormModal>

      <FloatingButton
        onClick={() => modalRef.current?.open()}
        tooltip="Adicionar Plantio"
        icon={<Plus className="h-6 w-6 md:h-7 md:w-7" />}
      />
    </div>
  );
};

export default PlantiosPage;
