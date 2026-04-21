"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFamiliaStore } from "@/stores/useFamiliaStore";
import { useUserStore } from "@/stores/useUserStore";
import { FormModal } from "@/components/ui/FormModal";
import { FormField } from "@/components/layout/FormField";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import {
  ArrowLeft,
  Users,
  Sprout,
  ClipboardList,
  UserCog,
  Plus,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/Card";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import StatCard from "@/components/ui/StatCard";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const FamiliaDetalhesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedFamilia, getFamiliaById, loading } = useFamiliaStore();
  const { fetchUsers, updateUser, user } = useUserStore();

  const addMemberModalRef = useRef(null);
  const userForm = useForm({ defaultValues: { userIds: [] } });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (id) getFamiliaById(id);
  }, [id]);

  if (loading)
    return <LoadingOverlay loading={loading} message="Carregando família..." />;
  if (!selectedFamilia)
    return (
      <div className="text-center mt-20 text-base-content/70">
        Família não encontrada.
      </div>
    );

  const familia = selectedFamilia;

  const handleOpenAddMemberModal = async () => {
    setModalLoading(true);
    try {
      if (!loadingUsers) {
        setLoadingUsers(true);
        await fetchUsers();
        setLoadingUsers(false);
      }

      const updatedUsers = useUserStore.getState().users;
      const available = updatedUsers.filter(
        (u) =>
          !["admin"].includes(u.role) &&
          u.familiaId !== familia.id &&
          u.id !== user.id
      );
      setAvailableUsers(available);
      userForm.reset({ userIds: [] });
      addMemberModalRef.current?.open();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddMembers = async (data) => {
    const userIds = data.userIds.map((u) => u.value);
    if (userIds.length === 0)
      return toast.error("Selecione ao menos um usuário.");
    try {
      setSubmitting(true);
      await Promise.all(
        userIds.map((uid) => updateUser(uid, { familiaId: familia.id }))
      );
      toast.success("Membros adicionados com sucesso!");
      addMemberModalRef.current?.close();
      userForm.reset({ userIds: [] });
      getFamiliaById(id);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar membros.");
    } finally {
      setSubmitting(false);
    }
  };

  // Cálculos de stats
  const totalPlantios =
    familia.hortas?.flatMap((h) => h.plantios || []).length || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <LoadingOverlay loading={loading} message="Carregando familia ..." />

      <LoadingOverlay
        loading={modalLoading}
        message="Preparando formulário..."
      />
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-base-content">
            {familia.nome}
          </h1>
          <p className="text-base-content/70 mt-2">
            {familia.descricao || "Sem descrição disponível."}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </div>

      {/* Stats da Família */}
      <ResponsiveGrid columns={2}>
        <StatCard
          title="Membros"
          value={(familia.membros?.length || 0).toString()}
          description="Total de membros na família"
          icon={Users}
        />
        <StatCard
          title="Hortas"
          value={(familia.hortas?.length || 0).toString()}
          description="Hortas associadas à família"
          icon={Sprout}
        />
        <StatCard
          title="Plantios ativos"
          value={totalPlantios.toString()}
          description="Plantios registrados nas hortas da família"
          icon={ClipboardList}
        />
        <StatCard
          title="Produção já colhida"
          value={(
            familia.hortas
              ?.flatMap((h) => h.plantios || [])
              .reduce(
                (acc, p) => acc + (p.colheita?.quantidadeColhida || 0),
                0
              ) || 0
          ).toString()}
          description="Quantidade já colhida"
          icon={Award}
        />
      </ResponsiveGrid>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gestor */}
        {familia.gestor && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-primary" /> Gestor Responsável
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <span className="font-semibold">{familia.gestor.nome}</span> —{" "}
                <span className="text-base-content/60 capitalize">
                  {familia.gestor.role}
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Membros */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" /> Membros (
              {familia.membros?.length || 0})
            </CardTitle>
            {(user.role === "admin" || user.role === "gestor") && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAddMemberModal}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            )}
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto space-y-2 text-sm">
            {familia.membros?.map((m) => (
              <div
                key={m.id}
                className="flex justify-between border-b border-base-200 pb-1"
              >
                <span>{m.nome || m.username}</span>
                <span className="text-base-content/60 capitalize">
                  {m.role}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hortas */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-success" /> Hortas Associadas
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto space-y-2 text-sm">
            {familia.hortas?.map((h) => (
              <div key={h.id}>
                <strong>{h.nome}</strong> — {h.tipoHorta || "N/A"}
              </div>
            )) || (
              <p className="italic text-base-content/60">
                Nenhuma horta registrada.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Plantios */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-warning" /> Plantios
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {familia.hortas?.flatMap((h) => h.plantios || []).length > 0 ? (
              familia.hortas
                .flatMap((h) => h.plantios || [])
                .map((p) => (
                  <div key={p.id} className="border rounded-md p-2 shadow-sm">
                    <p className="font-semibold">{p.cultura}</p>
                    <p className="text-sm text-base-content/70">
                      {p.tipoPlantacao || "N/A"} — {p.quantidadePlantada || "0"}{" "}
                      {p.unidadeMedida || ""}
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-base-content/60 text-sm">
                Nenhum plantio registrado.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Adicionar Membros */}
      <FormModal
        ref={addMemberModalRef}
        title={`Adicionar Membros à ${familia.nome}`}
        submitLabel="Adicionar"
        onSubmit={userForm.handleSubmit(handleAddMembers)}
      >
        {!loadingUsers && !submitting && (
          <FormField
            type="user-list"
            name="userIds"
            className="col-span-2 w-full"
            placeholder="Pesquise ou selecione usuários"
            control={userForm.control}
            options={availableUsers.map((u) => ({
              value: u.id,
              label: u.nome || u.username,
            }))}
          />
        )}
      </FormModal>
    </div>
  );
};

export default FamiliaDetalhesPage;
