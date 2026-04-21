import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutGrid,
  Sprout,
  Tractor,
  Edit,
  Trash,
  MapPin,
  AreaChart,
  Search,
  Plus,
  Table,
  X,
  Eye,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import { toast, Toaster } from "react-hot-toast";
import FloatingButton from "@/components/layout/FloatingActionButton";
import hortaSchema from "@/lib/validation/hortaSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/layout/FormField";
import { FormModal } from "@/components/ui/FormModal";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useNavigate } from "react-router-dom";
import { useHortaStore } from "@/stores/useHortaStore";
import { useUserStore } from "@/stores/useUserStore";
import { useFamiliaStore } from "@/stores/useFamiliaStore";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { EHortaEnum, ESoloEnum } from "../../lib/validation/hortaSchema";
import SmartDropdown from "../../components/ui/SmartDropdown";

const GardenPage = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");

  const [loadingFamilias, setLoadingFamilias] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [modalLoading, setModalLoading] = useState(false);
  const [editingHorta, setEditingHorta] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    hortas,
    fetchHortas,
    createHorta,
    updateHorta,
    deleteHorta,
    loading,
  } = useHortaStore();

  const { user, users, fetchUsers } = useUserStore();

  const { familias, fetchFamilias } = useFamiliaStore();

  const form = useForm({
    resolver: zodResolver(hortaSchema),
    defaultValues: {
      nome: "",
      endereco: "",
      coordenada: "",
      areaCultivada: "",
      tipoSolo: "",
      tipoHorta: "",
      descricao: "",
      observacoes: "",
      gestorId: user?.role === "gestor" ? user?.id : "",
      familiaId: "",
    },
    mode: "all",
    reValidateMode: "all",
  });

  const { reset } = form;

  useEffect(() => {
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

  const handleOpenModal = async (horta = null) => {
    setModalLoading(true);

    try {
      setEditingHorta(horta);

      if (!familias || familias.length === 0) {
        setLoadingFamilias(true);
        await fetchFamilias();
        setLoadingFamilias(false);
      }

      if (!users || users.length === 0) {
        setLoadingUsers(true);
        await fetchUsers(user?.role === "admin" ? { role: "gestor" } : {});
        setLoadingUsers(false);
      }

      reset({
        nome: horta?.nome || "",
        endereco: horta?.endereco || "",
        coordenada: horta?.coordenada || "",
        areaCultivada: horta?.areaCultivada + "" || "",
        tipoSolo: horta?.tipoSolo || "",
        tipoHorta: horta?.tipoHorta || "",
        descricao: horta?.descricao || "",
        observacoes: horta?.observacoes || "",
        gestorId: user?.role === "gestor" ? user.id : "",
        familiaId: horta?.familia?.id || "",
      });

      modalRef.current?.open();
    } catch (err) {
      console.error("Erro ao preparar formulário:", err);
      toast.error("Erro ao preparar formulário");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveHorta = async (data) => {
    setSaving(true);
    try {
      if (editingHorta) await updateHorta(editingHorta.id, data);
      else await createHorta(data);

      modalRef.current?.close();
      setEditingHorta(null);
    } catch (err) {
      console.error("Erro ao salvar horta:", err);
      toast.error("Erro ao salvar horta");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHorta = async (id) => {
    const confirm = window.confirm(
      "Tem certeza que deseja deletar esta horta? Esta ação não pode ser desfeita."
    );
    if (!confirm) return;

    try {
      await deleteHorta(id);
      toast.success("Horta deletada com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar horta:", err);
      toast.error("Erro ao deletar horta");
    }
  };

  const filteredHortas = useMemo(() => {
    return hortas.filter((h) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        h.nome.toLowerCase().includes(query) ||
        h.endereco.toLowerCase().includes(query) ||
        h.gestor?.nome?.toLowerCase().includes(query);
      const matchesType = typeFilter ? h.tipoHorta === typeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [hortas, searchQuery, typeFilter]);

  const uniqueHortaTypes = useMemo(() => EHortaEnum.options, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 relative">
      <LoadingOverlay loading={loading} message="Carregando hortas..." />
      <LoadingOverlay
        loading={loadingFamilias}
        message="Carregando familias..."
      />
      <LoadingOverlay loading={loadingUsers} message="Carregando usuarios..." />
      <LoadingOverlay
        loading={modalLoading}
        message="Preparando formulário..."
      />
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Minhas Hortas
          </h1>
          <p className="text-base-content/70 mt-1">
            Gerencie seus canteiros, acompanhe o progresso e receba alertas
            importantes.
          </p>
        </div>
        {["admin", "gestor"].includes(user?.role) && (
          <Button onClick={() => handleOpenModal(null)} icon={Plus}>
            Adicionar Horta
          </Button>
        )}
      </div>
      {/* Estatísticas */}
      {!loading && (
        <>
          <ResponsiveGrid columns={3}>
            {user?.role === "admin" && (
              <>
                <StatCard
                  title="Hortas Totais"
                  value={hortas.length.toString()}
                  description="Hortas cadastradas no sistema"
                  icon={LayoutGrid}
                />
                <StatCard
                  title="Área Total Cultivada"
                  value={`${hortas
                    .reduce((acc, h) => acc + h.areaCultivada, 0)
                    .toFixed(1)} m²`}
                  description="Somatório da área de todas as hortas"
                  icon={Sprout}
                />
                <StatCard
                  title="Gestores Ativos"
                  value={new Set(
                    hortas.map((h) => h.gestor.nome)
                  ).size.toString()}
                  description="Gestores com hortas registradas"
                  icon={Tractor}
                />
              </>
            )}

            {user?.role === "gestor" && (
              <>
                <StatCard
                  title="Minhas Hortas"
                  value={hortas.length.toString()}
                  description="Hortas sob minha gestão"
                  icon={LayoutGrid}
                />
                <StatCard
                  title="Área Cultivada Total"
                  value={`${hortas
                    .reduce((acc, h) => acc + h.areaCultivada, 0)
                    .toFixed(1)} m²`}
                  description="Soma das áreas das suas hortas"
                  icon={Sprout}
                />
                <StatCard
                  title="Média por Horta"
                  value={`${(
                    hortas.reduce((acc, h) => acc + h.areaCultivada, 0) /
                    (hortas.length || 1)
                  ).toFixed(1)} m²`}
                  description="Média da área cultivada por horta"
                  icon={AreaChart}
                />
              </>
            )}

            {["cultivador", "voluntario"].includes(user?.role) && (
              <>
                <StatCard
                  title="Hortas da Família"
                  value={hortas.length.toString()}
                  description="Hortas em que você atua"
                  icon={LayoutGrid}
                />
                <StatCard
                  title="Área Total Envolvida"
                  value={`${hortas
                    .reduce((acc, h) => acc + h.areaCultivada, 0)
                    .toFixed(1)} m²`}
                  description="Área total cultivada pela família"
                  icon={Sprout}
                />
                <StatCard
                  title="Tipo de Horta Mais Comum"
                  value={
                    hortas.length
                      ? Object.entries(
                          hortas.reduce((acc, h) => {
                            acc[h.tipoHorta] = (acc[h.tipoHorta] || 0) + 1;
                            return acc;
                          }, {})
                        ).sort((a, b) => b[1] - a[1])[0][0]
                      : "—"
                  }
                  description="Tipo predominante entre suas hortas"
                  icon={LayoutGrid}
                />
              </>
            )}
          </ResponsiveGrid>
        </>
      )}
      {/* Filtros */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100 w-full">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="text"
            className="grow bg-transparent focus:outline-none text-base-content"
            placeholder="Buscar nome, endereço ou gestor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="select select-bordered flex-1 w-full sm:w-auto rounded-lg"
            value={typeFilter || ""}
            onChange={(e) => setTypeFilter(e.target.value || "")}
          >
            <option value="">Todos os Tipos</option>
            {uniqueHortaTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Botões de visualização */}
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
                  "Horta",
                  "Tipo",
                  user.role === "gestor" ? null : "Gestor",
                  "Área (m²)",
                  "Solo",
                  "Família",
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
              {filteredHortas.length > 0 ? (
                filteredHortas.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <div className="font-semibold">{h.nome}</div>
                      <div className="text-xs opacity-60 flex items-center justify-center gap-1">
                        <MapPin className="h-3 w-3" /> {h.endereco}
                      </div>
                    </td>

                    <td>
                      <Badge type={h.tipoHorta}>{h.tipoHorta}</Badge>
                    </td>

                    {user.role === "admin" && <td>{h.gestor.nome}</td>}

                    <td>
                      <div className="flex gap-1">
                        <AreaChart className="h-4 w-4 text-info" />{" "}
                        {h.areaCultivada.toFixed(1)}
                      </div>
                    </td>

                    <td>
                      <Badge type={h.tipoSolo}>{h.tipoSolo}</Badge>
                    </td>

                    <td>{h.familia.nome}</td>

                    <td>
                      <SmartDropdown
                        buttonClass="btn btn-ghost btn-sm text-base-content/70"
                        items={[
                          {
                            icon: <Eye className="h-4 w-4" />,
                            label: "Visualizar",
                            onClick: () => navigate(`/hortas/${h.id}`),
                          },
                          ...(user.role === "admin" || user.role === "gestor"
                            ? [
                                {
                                  label: "Editar",
                                  icon: <Edit className="h-4 w-4" />,
                                  onClick: () => handleOpenModal(h),
                                },
                                {
                                  label: "Excluir",
                                  icon: <Trash className="h-4 w-4" />,
                                  danger: true,
                                  onClick: () => handleDeleteHorta(h.id),
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
                  <td colSpan={6} className="py-6 text-base-content/60 italic">
                    Nenhuma horta encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHortas.map((h) => (
            <div
              key={h.id}
              className="p-4 border border-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="absolute top-2 right-2">
                <SmartDropdown
                  buttonClass="btn btn-ghost btn-xs text-base-content/70"
                  items={[
                    {
                      icon: <Eye className="h-4 w-4" />,
                      label: "Visualizar",
                      onClick: () => navigate(`/hortas/${h.id}`),
                    },
                    ...(user.role === "admin" || user.role === "gestor"
                      ? [
                          {
                            label: "Editar",
                            icon: <Edit className="h-4 w-4" />,
                            onClick: () => handleOpenModal(h),
                          },
                          {
                            label: "Excluir",
                            icon: <Trash className="h-4 w-4" />,
                            danger: true,
                            onClick: () => handleDeleteHorta(h.id),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>

              <div className="font-bold text-lg">{h.nome}</div>
              <div className="text-xs opacity-60 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {h.endereco}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge type={h.tipoHorta}>{h.tipoHorta}</Badge>
                <Badge type={h.tipoSolo}>{h.tipoSolo}</Badge>
              </div>

              <div className="flex flex-col gap-1 text-sm mt-2">
                <div className="flex gap-1">
                  <span className="font-medium">Gestor:</span> {h.gestor.nome}
                </div>
                <div className="flex gap-1">
                  <span className="font-medium">Área:</span>{" "}
                  {h.areaCultivada.toFixed(1)} m²
                </div>
                <div className="flex gap-1">
                  <span className="font-medium">Família:</span> {h.familia.nome}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(user?.role === "admin" || user?.role === "gestor") && (
        <FormModal
          ref={modalRef}
          title={editingHorta ? "Editar Horta" : "Adicionar Horta"}
          onSubmit={form.handleSubmit(handleSaveHorta)}
          submitLabel={
            saving
              ? "Salvando..."
              : editingHorta
              ? "Salvar Alterações"
              : "Adicionar Horta"
          }
          submitLoading={saving}
        >
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">
              Nome da Horta <span className="text-error">*</span>
            </label>
            <FormField
              type="input"
              placeholder="Nome da Horta"
              name="nome"
              control={form.control}
              className="md:col-span-2"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">
              Endereço <span className="text-error">*</span>
            </label>
            <FormField
              type="input"
              placeholder="Endereço"
              name="endereco"
              control={form.control}
              className="md:col-span-2"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">Gestor</label>
            {user?.role === "admin" ? (
              <FormField
                type="searchable-select"
                placeholder="Selecione um Gestor"
                name="gestorId"
                control={form.control}
                options={users
                  .filter((u) => u.role === "gestor")
                  .map((g) => ({
                    value: g.id,
                    label: g.nome,
                  }))}
              />
            ) : (
              <input
                type="text"
                value={user?.nome}
                disabled
                className="input input-bordered w-full bg-base-200 cursor-not-allowed col-span-1"
              />
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">Família</label>
            <FormField
              type="searchable-select"
              placeholder="Selecione uma Família"
              name="familiaId"
              control={form.control}
              options={familias.map((f) => ({
                value: f.id,
                label: f.nome,
              }))}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">
              Coordenadas (opcional)
            </label>
            <FormField
              type="input"
              placeholder="Coordenadas (opcional)"
              name="coordenada"
              control={form.control}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">
              Área cultivada (m²) <span className="text-error">*</span>
            </label>
            <FormField
              type="number"
              placeholder="Área cultivada (m²)"
              name="areaCultivada"
              control={form.control}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">
              Tipo de Solo <span className="text-error">*</span>
            </label>
            <FormField
              type="select"
              placeholder="Tipo de Solo"
              name="tipoSolo"
              control={form.control}
              options={ESoloEnum.options.map((u) => ({
                value: u,
                label: u.charAt(0).toUpperCase() + u.slice(1).replace("_", " "),
              }))}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">
              Tipo de Horta <span className="text-error">*</span>
            </label>
            <FormField
              type="select"
              name="tipoHorta"
              control={form.control}
              placeholder="Selecione o tipo de horta"
              options={EHortaEnum.options.map((tipo) => ({
                value: tipo,
                label:
                  tipo.charAt(0).toUpperCase() +
                  tipo.slice(1).replace("_", " "),
              }))}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <FormField
              type="textarea"
              placeholder="Descrição (opcional)"
              name="descricao"
              control={form.control}
              className="md:col-span-2"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">
              Observações (opcional)
            </label>
            <FormField
              type="textarea"
              placeholder="Observações (opcional)"
              name="observacoes"
              control={form.control}
              className="md:col-span-2"
            />
          </div>
        </FormModal>
      )}

      {["admin", "gestor"].includes(user?.role) && (
        <FloatingButton
          onClick={() => handleOpenModal(null)}
          tooltip="Adicionar Horta"
          icon={<Plus className="h-6 w-6 md:h-7 md:w-7" />}
        />
      )}
    </div>
  );
};

export default GardenPage;
