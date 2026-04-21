import React, { useState } from "react";
import { Edit, User, Mail, Phone, MapPin, Settings, X } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";

export default function MeuPerfil() {
  const { user } = useUserStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalPerfilEspecificoOpen, setModalPerfilEspecificoOpen] =
    useState(false);
  const [formGeral, setFormGeral] = useState({
    nome: user?.nome || "",
    email: user.email || "",
    telefone: user.telefone || "",
    endereco: user.endereco || "",
  });

  const perfilTipo = user.role
    ? "gestor"
    : user.role
    ? "voluntario"
    : user.role
    ? "cultivador"
    : user.role
    ? "admin"
    : null;

  const perfilDados =
    user.PerfilGestor ||
    user.PerfilVoluntario ||
    user.PerfilCultivador ||
    user.PerfilAdmin;

  const [formPerfil, setFormPerfil] = useState(perfilDados || {});

  const handleSaveGeral = () => {
    console.log("Salvar perfil geral", formGeral);
    setModalOpen(false);
  };

  const handleSavePerfil = () => {
    console.log("Salvar perfil específico", formPerfil);
    setModalPerfilEspecificoOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <button
          className="btn btn-primary btn-sm flex items-center gap-2"
          onClick={() => setModalOpen(true)}
        >
          <Edit className="h-4 w-4" /> Editar Perfil
        </button>
      </div>

      {/* Card do perfil */}
      <div className="card bg-base-200 shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row p-6 gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold">
              {user.nome ? user.nome.charAt(0).toUpperCase() : <User />}
            </div>
          </div>

          {/* Informações gerais */}
          <div className="flex-1 space-y-3">
            <h2 className="text-xl font-semibold">
              {user.nome || user.username}
            </h2>
            <p className="text-sm text-base-content/70">@{user.username}</p>

            <div className="flex flex-col md:flex-row md:items-center md:gap-6 mt-2">
              {user.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-base-content/60" />{" "}
                  {user.email}
                </div>
              )}
              {user.telefone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-base-content/60" />{" "}
                  {user.telefone}
                </div>
              )}
              {user.endereco && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-base-content/60" />{" "}
                  {user.endereco}
                </div>
              )}
            </div>

            {/* Perfil específico */}
            {perfilTipo && perfilDados && (
              <div className="mt-4 p-4 bg-base-100 rounded-lg border border-base-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium capitalize">{perfilTipo} info</h3>
                  <button
                    className="btn btn-ghost btn-xs flex items-center gap-1"
                    onClick={() => setModalPerfilEspecificoOpen(true)}
                  >
                    <Settings className="h-4 w-4" /> Editar
                  </button>
                </div>

                <div className="space-y-1 text-sm text-base-content/80">
                  {perfilTipo === "gestor" && (
                    <>
                      <p>
                        <strong>Cargo:</strong> {perfilDados.cargo || "-"}
                      </p>
                      <p>
                        <strong>Organização:</strong>{" "}
                        {perfilDados.organizacaoVinculada || "-"}
                      </p>
                      <p>
                        <strong>Recebe alertas:</strong>{" "}
                        {perfilDados.recebeAlertas ? "Sim" : "Não"}
                      </p>
                      {perfilDados.observacoes && (
                        <p>
                          <strong>Observações:</strong>{" "}
                          {perfilDados.observacoes}
                        </p>
                      )}
                    </>
                  )}

                  {perfilTipo === "voluntario" && (
                    <>
                      <p>
                        <strong>Interesse:</strong>{" "}
                        {perfilDados.interesse || "-"}
                      </p>
                      <p>
                        <strong>Disponível:</strong>{" "}
                        {perfilDados.disponivel ? "Sim" : "Não"}
                      </p>
                      {perfilDados.observacoes && (
                        <p>
                          <strong>Observações:</strong>{" "}
                          {perfilDados.observacoes}
                        </p>
                      )}
                    </>
                  )}

                  {perfilTipo === "cultivador" && (
                    <>
                      <p>
                        <strong>Experiência:</strong>{" "}
                        {perfilDados.tipoExperiencia || "-"}
                      </p>
                      <p>
                        <strong>Habilidades:</strong>{" "}
                        {perfilDados.habilidades || "-"}
                      </p>
                      <p>
                        <strong>Plantas favoritas:</strong>{" "}
                        {perfilDados.plantasFavoritas || "-"}
                      </p>
                      {perfilDados.observacoes && (
                        <p>
                          <strong>Observações:</strong>{" "}
                          {perfilDados.observacoes}
                        </p>
                      )}
                    </>
                  )}

                  {perfilTipo === "admin" && (
                    <>
                      <p>
                        <strong>Cargo:</strong> {perfilDados.cargo || "-"}
                      </p>
                      <p>
                        <strong>Ativo:</strong>{" "}
                        {perfilDados.ativo ? "Sim" : "Não"}
                      </p>
                      {perfilDados.observacoes && (
                        <p>
                          <strong>Observações:</strong>{" "}
                          {perfilDados.observacoes}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Perfil Geral */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 btn btn-ghost btn-sm"
              onClick={() => setModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">Editar Perfil</h2>
            <div className="space-y-3">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Nome"
                value={formGeral.nome}
                onChange={(e) =>
                  setFormGeral({ ...formGeral, nome: e.target.value })
                }
              />
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="E-mail"
                value={formGeral.email}
                onChange={(e) =>
                  setFormGeral({ ...formGeral, email: e.target.value })
                }
              />
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Telefone"
                value={formGeral.telefone}
                onChange={(e) =>
                  setFormGeral({ ...formGeral, telefone: e.target.value })
                }
              />
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Endereço"
                value={formGeral.endereco}
                onChange={(e) =>
                  setFormGeral({ ...formGeral, endereco: e.target.value })
                }
              />
              <button
                className="btn btn-primary w-full"
                onClick={handleSaveGeral}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Perfil Específico */}
      {modalPerfilEspecificoOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 btn btn-ghost btn-sm"
              onClick={() => setModalPerfilEspecificoOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">Editar {perfilTipo}</h2>
            <div className="space-y-3">
              {perfilTipo === "gestor" && (
                <>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Cargo"
                    value={formPerfil.cargo || ""}
                    onChange={(e) =>
                      setFormPerfil({ ...formPerfil, cargo: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Organização Vinculada"
                    value={formPerfil.organizacaoVinculada || ""}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        organizacaoVinculada: e.target.value,
                      })
                    }
                  />
                  <div className="form-control">
                    <label className="cursor-pointer label">
                      <span className="label-text">Recebe Alertas</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={formPerfil.recebeAlertas || false}
                        onChange={(e) =>
                          setFormPerfil({
                            ...formPerfil,
                            recebeAlertas: e.target.checked,
                          })
                        }
                      />
                    </label>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Observações"
                    value={formPerfil.observacoes || ""}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        observacoes: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {perfilTipo === "voluntario" && (
                <>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Interesse"
                    value={formPerfil.interesse || ""}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        interesse: e.target.value,
                      })
                    }
                  />
                  <div className="form-control">
                    <label className="cursor-pointer label">
                      <span className="label-text">Disponível</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={formPerfil.disponivel || false}
                        onChange={(e) =>
                          setFormPerfil({
                            ...formPerfil,
                            disponivel: e.target.checked,
                          })
                        }
                      />
                    </label>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Observações"
                    value={formPerfil.observacoes || ""}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        observacoes: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {perfilTipo === "cultivador" && (
                <>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Experiência"
                    value={formPerfil.tipoExperiencia || ""}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        tipoExperiencia: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Habilidades"
                    value={formPerfil.habilidades || ""}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        habilidades: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Plantas Favoritas"
                    value={formPerfil.plantasFavoritas || ""}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        plantasFavoritas: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Observações"
                    value={formPerfil.observacoes || ""}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        observacoes: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {perfilTipo === "admin" && (
                <>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Cargo"
                    value={formPerfil.cargo || ""}
                    onChange={(e) =>
                      setFormPerfil({ ...formPerfil, cargo: e.target.value })
                    }
                  />
                  <div className="form-control">
                    <label className="cursor-pointer label">
                      <span className="label-text">Ativo</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={formPerfil.ativo || false}
                        onChange={(e) =>
                          setFormPerfil({
                            ...formPerfil,
                            ativo: e.target.checked,
                          })
                        }
                      />
                    </label>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Observações"
                    value={formPerfil.observacoes || ""}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        observacoes: e.target.value,
                      })
                    }
                  />
                </>
              )}

              <button
                className="btn btn-primary w-full"
                onClick={handleSavePerfil}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
