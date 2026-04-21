"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFamiliaStore } from "@/stores/useFamiliaStore";
import { useUserStore } from "@/stores/useUserStore";
import { FormModal } from "@/components/ui/FormModal";
import { FormField } from "@/components/layout/FormField";
import { Button } from "@/components/ui/Button";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import StatCard from "@/components/ui/StatCard";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Badge from "@/components/ui/Badge";
import FloatingButton from "@/components/layout/FloatingActionButton";
import SmartDropdown from "@/components/ui/SmartDropdown";

import {
  Users,
  Edit,
  Trash,
  Plus,
  Search,
  Award,
  UserCheck,
  Table,
  LayoutGrid,
  User,
  Eye,
} from "lucide-react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  familiaSchemaAdmin,
  familiaSchemaGestor,
} from "@/lib/validation/familiaSchema";

const Familias = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const userModalRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingFamilia, setEditingFamilia] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  const {
    familias,
    fetchFamilias,
    createFamilia,
    updateFamilia,
    deleteFamilia,
    addMembro,
    loading,
  } = useFamiliaStore();

  const { user, users, fetchUsers } = useUserStore();

  const schema =
    user?.role === "admin" ? familiaSchemaAdmin : familiaSchemaGestor;

  const userForm = useForm({ defaultValues: { userIds: [] } });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      representante: "",
      qtdMembros: 1,
      descricao: "",
      gestorId: "",
    },
    mode: "all",
    reValidateMode: "all",
  });

  const { reset } = form;

  useEffect(() => {
    fetchFamilias();
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

  const handleOpenModal = async (familia = null) => {
    setModalLoading(true);

    try {
      setEditingFamilia(familia);

      if (!loadingUsers || users.length === 0) {
        setLoadingUsers(true);
        await fetchUsers();
        setLoadingUsers(false);
      }

      reset({
        nome: familia?.nome || "",
        representante: familia?.representante || "",
        qtdMembros: familia?.qtdMembros || 1,
        descricao: familia?.descricao || "",
        gestorId: familia?.gestorId || "",
      });

      modalRef.current?.open();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao abrir o modal.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveFamilia = async (data) => {
    setSaving(true);

    try {
      const payload = {
        ...data,
        gestorId: user.role === "gestor" ? user.id : data.gestorId,
      };
      if (editingFamilia) await updateFamilia(editingFamilia.id, payload);
      else await createFamilia(payload);

      modalRef.current?.close();
      setEditingFamilia(null);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar família.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAddMembersModal = async (familia) => {
    if (!familia) return;
    setEditingFamilia(familia);
    setLoadingUsers(true);

    try {
      await fetchUsers();
      const allUsers = useUserStore.getState().users;

      const available = allUsers.filter(
        (u) =>
          !["admin"].includes(u.role) &&
          u.familiaId !== familia.id &&
          u.id !== user.id
      );

      setAvailableUsers(available);
      userForm.reset({ userIds: [] });
      userModalRef.current?.open();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddExistingUsers = async () => {
    const selectedUsers = userForm.getValues("userIds");
    if (!editingFamilia || selectedUsers.length === 0) {
      toast.error("Selecione ao menos um usuário.");
      return;
    }

    setLoadingUsers(true);

    try {
      const userIds = selectedUsers.map((u) => u.value);

      await Promise.all(
        userIds.map((id) => addMembro(editingFamilia.id, { userId: id }))
      );

      toast.success("Usuários adicionados à família!");
      userModalRef.current?.close();
      userForm.reset({ userIds: [] });
      fetchFamilias();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar usuários à família.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteFamilia = async (id) => {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir esta família? Esta ação não pode ser desfeita."
    );
    if (!confirm) return;

    try {
      await deleteFamilia(id);
      await fetchFamilias();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir família.");
    }
  };

  const totalFamilias = familias.length;
  const mediaMembros = totalFamilias
    ? Math.round(
        familias.reduce((acc, f) => acc + (f.qtdMembros || 0), 0) /
          totalFamilias
      )
    : 0;
  const gestoresComFamilias = [
    ...new Set(familias.map((f) => f.gestor?.id).filter(Boolean)),
  ].length;

  const gestores = users.filter((u) => u.role === "gestor");
  const usuarios = users.filter((u) =>
    ["cultivador", "voluntario"].includes(u.role)
  );

  const visibleFamilias =
    user.role === "gestor"
      ? familias.filter((f) => f.gestorId === user.id)
      : familias;

  const filteredFamilias = visibleFamilias.filter((f) => {
    const query = searchQuery.toLowerCase();
    return (
      f.nome?.toLowerCase().includes(query) ||
      f.representante?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 relative">
      <LoadingOverlay loading={loading} message="Carregando famílias..." />
      <LoadingOverlay loading={loadingUsers} message="Carregando usuários..." />
      <LoadingOverlay
        loading={modalLoading}
        message="Preparando formulário..."
      />

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Famílias</h1>
          <p className="text-base-content/70 mt-1">
            Gerencie as famílias participantes da horta comunitária.
          </p>
        </div>

        {(user?.role === "admin" || user?.role === "gestor") && (
          <Button onClick={() => handleOpenModal(null)} icon={Plus}>
            Adicionar Família
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      {!loading && (
        <ResponsiveGrid columns={user.role === "admin" ? 3 : 2}>
          <StatCard
            title="Total"
            value={totalFamilias.toString()}
            description="Famílias cadastradas"
            icon={Users}
          />
          <StatCard
            title="Média de Membros"
            value={mediaMembros.toString()}
            description="Por família"
            icon={UserCheck}
          />
          {user.role === "admin" && (
            <StatCard
              title="Gestores Ativos"
              value={gestoresComFamilias.toString()}
              description="Com famílias vinculadas"
              icon={Award}
            />
          )}
        </ResponsiveGrid>
      )}

      {/* Filtro */}
      <div className="flex flex-col gap-4 mb-6 mt-4">
        <div className="flex items-center gap-2 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100 w-full">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="text"
            className="grow bg-transparent focus:outline-none text-base-content"
            placeholder="Buscar por nome ou representante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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

      {/* Renderização da lista */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto shadow-xl rounded-xl border border-base-200">
          <table className="table w-full table-zebra table-fixed">
            <thead>
              <tr>
                {[
                  "Nome",
                  "Representante",
                  "Membros",
                  user?.role === "admin" && "Gestor",
                  "Descrição",
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
              {filteredFamilias.length > 0 ? (
                filteredFamilias.map((f) => (
                  <tr key={f.id}>
                    <td>{f.nome}</td>
                    <td>{f.representante}</td>
                    <td>{f.qtdMembros}</td>
                    {user.role === "admin" && <td>{f.gestor?.nome || "-"}</td>}
                    <td>{f.descricao || "-"}</td>
                    <td>
                      <SmartDropdown
                        buttonClass="btn btn-ghost btn-sm text-base-content/70"
                        items={[
                          {
                            icon: <Eye className="h-4 w-4" />,
                            label: "Visualizar",
                            onClick: () => navigate(`/familias/${f.id}`),
                          },
                          ...(user.role === "admin" || user.role === "gestor"
                            ? [
                                {
                                  label: "Adicionar membros",
                                  icon: <Users className="h-4 w-4" />,
                                  onClick: () => handleOpenAddMembersModal(f),
                                },
                                {
                                  label: "Editar",
                                  icon: <Edit className="h-4 w-4" />,
                                  onClick: () => handleOpenModal(f),
                                },
                                {
                                  label: "Excluir",
                                  icon: <Trash className="h-4 w-4" />,
                                  danger: true,
                                  onClick: () => handleDeleteFamilia(f.id),
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
                    Nenhuma familia encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFamilias.map((f) => (
            <div
              key={f.id}
              className="p-4 border border-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="absolute top-2 right-2">
                <SmartDropdown
                  buttonClass="btn btn-ghost btn-xs text-base-content/70"
                  items={[
                    {
                      icon: <Eye className="h-4 w-4" />,
                      label: "Visualizar",
                      onClick: () => navigate(`/familias/${f.id}`),
                    },
                    ...(user.role === "admin" || user.role === "gestor"
                      ? [
                          {
                            label: "Adicionar membros",
                            icon: <Users className="h-4 w-4" />,
                            onClick: () => handleOpenAddMembersModal(f),
                          },
                          {
                            label: "Editar",
                            icon: <Edit className="h-4 w-4" />,
                            onClick: () => handleOpenModal(f),
                          },
                          {
                            label: "Excluir",
                            icon: <Trash className="h-4 w-4" />,
                            danger: true,
                            onClick: () => handleDeleteFamilia(f.id),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
              <div className="font-bold text-lg flex items-center gap-2">
                <User className="h-4 w-4 text-primary/70" />
                {f.nome}
              </div>
              <div className="text-xs opacity-60">
                Representante: {f.representante}
              </div>
              <div className="mt-2">
                <Badge type="info">{f.qtdMembros} membros</Badge>
              </div>
              {user.role === "admin" && f.gestor && (
                <div className="mt-1 text-xs opacity-60">
                  Gestor: <span className="font-medium">{f.gestor.nome}</span>
                </div>
              )}
              {f.descricao && (
                <p className="mt-2 text-sm text-base-content/70">
                  {f.descricao}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Família */}
      {(user?.role === "admin" || user?.role === "gestor") && (
        <FormModal
          ref={modalRef}
          title={editingFamilia ? "Editar Família" : "Adicionar Nova Família"}
          onSubmit={form.handleSubmit(handleSaveFamilia)}
          submitLabel={
            saving
              ? "Salvando..."
              : editingFamilia
              ? "Salvar Alterações"
              : "Criar Familia"
          }
          submitLoading={saving}
        >
          {loadingUsers ? (
            <p className="text-center text-base-content/60 italic py-4">
              Carregando usuarios...
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">
                  Nome da Família <span className="text-error">*</span>
                </label>
                <FormField
                  type="input"
                  name="nome"
                  placeholder="Ex: Família Santos"
                  control={form.control}
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">
                  Representante <span className="text-error">*</span>
                </label>
                <FormField
                  type="searchable-select"
                  name="representante"
                  placeholder="Selecione o representante"
                  control={form.control}
                  options={usuarios.map((u) => ({
                    value: u.nome,
                    label: u.nome,
                  }))}
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">
                  Quantidade de Membros <span className="text-error">*</span>
                </label>
                <FormField
                  type="number"
                  name="qtdMembros"
                  placeholder="Ex: 4"
                  control={form.control}
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">
                  Descrição (opcional)
                </label>
                <FormField
                  type="textarea"
                  name="descricao"
                  placeholder="Informações adicionais..."
                  control={form.control}
                />
              </div>

              {user?.role === "admin" && (
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm font-medium">
                    Gestor Responsável <span className="text-error">*</span>
                  </label>
                  <FormField
                    type="searchable-select"
                    name="gestorId"
                    placeholder="Selecione o gestor"
                    control={form.control}
                    options={gestores.map((g) => ({
                      value: g.id,
                      label: g.nome || g.username,
                    }))}
                  />
                </div>
              )}
            </>
          )}
        </FormModal>
      )}

      {/* Modal Adicionar Membros */}
      <FormModal
        ref={userModalRef}
        title={`Adicionar Membros à ${editingFamilia?.nome || ""}`}
        onSubmit={userForm.handleSubmit(handleAddExistingUsers)}
        submitLabel="Adicionar"
      >
        {loadingUsers ? (
          <LoadingOverlay loading={true} message="Carregando usuários..." />
        ) : availableUsers.length === 0 ? (
          <p className="text-sm text-center text-base-content/70">
            Nenhum usuário disponível para adicionar.
          </p>
        ) : (
          <FormField
            type="user-list"
            name="userIds"
            className="col-span-2 w-full"
            placeholder="Pesquise ou adicione usuários"
            control={userForm.control}
            options={availableUsers.map((u) => ({
              value: u.id,
              label: u.nome || u.username,
            }))}
          />
        )}
      </FormModal>

      {/* Floating Button */}
      {(user?.role === "admin" || user?.role === "gestor") && (
        <FloatingButton
          onClick={() => handleOpenModal(null)}
          tooltip="Adicionar Família"
          icon={<Plus className="h-6 w-6 md:h-7 md:w-7" />}
        />
      )}
    </div>
  );
};

export default Familias;
