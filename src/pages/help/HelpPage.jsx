import React, { useState } from "react";
import {
  Search,
  BookOpen,
  Leaf,
  Sprout,
  Droplets,
  Users,
  Settings,
  Plus,
  HelpCircle,
  X,
} from "lucide-react";

// Mock de usuário
const user = { role: "admin" };

// Categorias de FAQ
const faqCategories = [
  { id: "all", name: "Todas Categorias", icon: HelpCircle },
  { id: "getting-started", name: "Primeiros Passos", icon: BookOpen },
  { id: "garden-management", name: "Gerenciamento de Horta", icon: Leaf },
  { id: "planting", name: "Plantio", icon: Sprout },
  { id: "watering", name: "Irrigação", icon: Droplets },
  { id: "community", name: "Comunidade", icon: Users },
  { id: "account", name: "Conta e Configurações", icon: Settings },
];

// FAQs iniciais
const initialFaqs = [
  {
    id: "1",
    pergunta: "Como posso iniciar minha primeira horta?",
    resposta:
      "Para iniciar sua primeira horta, navegue até a seção 'Hortas' e clique em 'Nova Horta'. Defina nome, localização e tamanho.",
    categoria: "getting-started",
    ordem: 1,
  },
  {
    id: "2",
    pergunta: "Como planejar o plantio de vegetais?",
    resposta:
      "Use o calendário da horta para organizar os plantios, verificando sazonalidade e espaçamento adequado.",
    categoria: "planting",
    ordem: 2,
  },
  {
    id: "3",
    pergunta: "Posso participar de mais de uma horta comunitária?",
    resposta:
      "Sim! Basta ser convidado pelo gestor ou solicitar participação em outras hortas.",
    categoria: "community",
    ordem: 3,
  },
];

export default function FaqPage() {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    pergunta: "",
    resposta: "",
    categoria: "getting-started",
    ordem: 1,
  });

  // Filtra FAQs
  const filteredFaqs = faqs
    .filter(
      (item) =>
        (item.pergunta + " " + item.resposta)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        (activeCategory === "all" || item.categoria === activeCategory)
    )
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  // Modal handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ordem" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.pergunta || !formData.resposta) {
      alert("Preencha pergunta e resposta!");
      return;
    }
    setFaqs((prev) => [
      ...prev,
      {
        ...formData,
        id: crypto.randomUUID(),
        criadoEm: new Date(),
        updatedAt: new Date(),
      },
    ]);
    setFormData({
      pergunta: "",
      resposta: "",
      categoria: "getting-started",
      ordem: 1,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Centro de Ajuda / FAQ</h1>
        {user.role === "admin" && (
          <button
            className="btn btn-primary btn-sm flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar FAQ
          </button>
        )}
      </div>
      <p className="text-base-content/70 mb-6">
        Encontre respostas rápidas para dúvidas frequentes sobre o uso da
        plataforma.
      </p>

      {/* Busca */}
      <div className="mb-6 relative">
        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-base-300 rounded-lg bg-base-100">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="text"
            className="grow bg-transparent focus:outline-none"
            placeholder="Buscar na base de conhecimento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categorias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {faqCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              className={`btn btn-outline justify-start gap-2 ${
                activeCategory === cat.id ? "btn-primary" : ""
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <Icon className="h-4 w-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Lista de FAQs */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="collapse collapse-plus bg-base-200 rounded-lg overflow-hidden border border-base-300"
            >
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-base font-medium p-4 cursor-pointer hover:bg-base-300 transition-colors">
                {faq.pergunta}
              </div>
              <div className="collapse-content !p-0">
                <div className="p-4 bg-base-100 text-sm text-base-content/90">
                  {faq.resposta}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-base-content/60">
            Nenhuma pergunta encontrada.
          </div>
        )}
      </div>

      {/* Modal de Adicionar FAQ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-base-100 rounded-lg w-full max-w-lg p-6 shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-base-content/70 hover:text-base-content transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" /> Adicionar FAQ
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">Pergunta</label>
                <input
                  type="text"
                  name="pergunta"
                  value={formData.pergunta}
                  onChange={handleChange}
                  placeholder="Digite a pergunta"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Resposta</label>
                <textarea
                  name="resposta"
                  value={formData.resposta}
                  onChange={handleChange}
                  placeholder="Digite a resposta"
                  className="textarea textarea-bordered w-full h-32"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Categoria</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  {faqCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">Ordem</label>
                <input
                  type="number"
                  name="ordem"
                  value={formData.ordem}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  min={1}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Adicionar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
