import { Check, Leaf, MoveRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-base-100 py-20 md:py-32">
        {/* Padrão de fundo (Mock) */}
        <div className="absolute  bg-grid-pattern opacity-[0.05] dark:opacity-[0.025]"></div>

        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                {/* Coluna de Texto e Ações */}
                <div className="flex flex-col justify-center space-y-8">
                  <div className="space-y-4 text-center lg:text-left">
                    <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-base-content">
                      Cultive comunidade, <br />
                      <span className="text-primary">colha abundância</span>
                    </h1>
                    <p className="max-w-[700px] text-base-content/70 md:text-xl mx-auto lg:mx-0">
                      A plataforma completa para gestão de hortas comunitárias.
                      Planeje plantios, organize tarefas, distribua colheitas e
                      fortaleça laços comunitários.
                    </p>
                  </div>

                  {/* Botões de Ação (FIX: Uso de <Link> e 'to') */}
                  <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center lg:justify-start">
                    <Link
                      to="/signup"
                      className="btn btn-primary btn-lg shadow-lg hover:shadow-xl gap-1.5 transition-all duration-300"
                    >
                      Comece sua horta comunitária
                      <MoveRight size={20} />
                    </Link>

                    <Link
                      to="/planos"
                      className="btn btn-outline btn-lg border-2 hover:bg-base-300 transition-colors duration-300"
                    >
                      Ver planos
                    </Link>
                  </div>

                  {/* Destaques de Funcionalidades */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-base-content/80 justify-center lg:justify-start pt-4">
                    <div className="flex items-center gap-1 font-medium">
                      <Check size={18} className="text-primary" />
                      <span>Planejamento inteligente</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <Check size={18} className="text-primary" />
                      <span>Gestão colaborativa</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <Check size={18} className="text-primary" />
                      <span>Distribuição justa</span>
                    </div>
                  </div>
                </div>

                <div className="relative hidden lg:block">
                  <div className="absolute -left-8 -top-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                    <div className="h-full w-full overflow-hidden rounded-2xl border bg-base-100 shadow-xl">
                      <img
                        src="https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=700&q=80"
                        alt="Horta comunitária em funcionamento"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-base-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="badge badge-primary badge-lg">Benefícios</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Transformando hortas em comunidades
                  </h2>
                  <p className="max-w-[900px] text-base-content/70 md:text-xl">
                    Cultive reúne todas as ferramentas necessárias para criar,
                    gerenciar e fazer prosperar hortas comunitárias com menos
                    esforço e mais resultados.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {/* Card 1 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <Leaf size={35} />
                    </div>
                    <h3 className="card-title text-2xl">Gestão Integrada</h3>
                    <p className="text-base-content/70">
                      Todas as ferramentas que você precisa para gerenciar sua
                      horta comunitária em um só lugar. Do planejamento à
                      colheita.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">
                      Colaboração Eficiente
                    </h3>
                    <p className="text-base-content/70">
                      Organize facilmente tarefas entre os membros da
                      comunidade, agende mutirões e mantenha todos informados.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">
                      Planejamento Inteligente
                    </h3>
                    <p className="text-base-content/70">
                      Sugestões de plantio baseadas na sazonalidade, condições
                      locais e preferências da comunidade.
                    </p>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                        <path d="M18 17V9"></path>
                        <path d="M13 17V5"></path>
                        <path d="M8 17v-3"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">
                      Distribuição Transparente
                    </h3>
                    <p className="text-base-content/70">
                      Registre e acompanhe a distribuição das colheitas entre
                      famílias e parceiros de forma justa e transparente.
                    </p>
                  </div>
                </div>

                {/* Card 5 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">
                      Comunicação Centralizada
                    </h3>
                    <p className="text-base-content/70">
                      Chat, anúncios e notificações para manter toda a
                      comunidade conectada и engajada.
                    </p>
                  </div>
                </div>

                {/* Card 6 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 极速加速器 0 0 1-.963 0z"></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">Análises Avançadas</h3>
                    <p className="text-base-content/70">
                      Relatórios detalhados sobre produção, participação
                      comunitária e impacto social da sua horta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-base-200">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                <div>
                  <div className="space-y-2">
                    <div className="badge badge-primary badge-lg">
                      Como funciona
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                      Simples e eficiente do início ao fim
                    </h2>
                    <p className="max-w-[600px] text-base-content/70 md:text-xl">
                      Nossa plataforma foi pensada para facilitar cada etapa da
                      gestão de hortas comunitárias, desde o planejamento
                      inicial até a distribuição das colheitas.
                    </p>
                  </div>
                  <div className="grid gap-4 mt-8">
                    {[
                      {
                        number: "01",
                        title: "Crie",
                        description:
                          "Cadastre sua horta comunitária, defina espaços de cultivo e registre áreas de plantio.",
                      },
                      {
                        number: "02",
                        title: "Conecte",
                        description:
                          "Convide famílias, voluntários e organizações para participar da sua comunidade.",
                      },
                      {
                        number: "03",
                        title: "Cultive",
                        description:
                          "Planeje plantios, organize tarefas e acompanhe o desenvolvimento das culturas.",
                      },
                      {
                        number: "04",
                        title: "Compartilhe",
                        description:
                          "Registre colheitas e distribua os alimentos de forma justa e transparente.",
                      },
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-base-300 bg-base-100 text-sm font-semibold">
                          {step.number}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{step.title}</h3>
                          <p className="text-sm text-base-content/70">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-center lg:text-left">
                    <a href="/signup" className="btn btn-primary">
                      Comece agora mesmo
                      <MoveRight />
                    </a>
                  </div>
                </div>
                <div className="relative hidden lg:block">
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <div className="rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                        <div className="overflow-hidden rounded-2xl border bg-base-100 shadow-xl">
                          <img
                            src="https://images.unsplash.com/photo-1582095128060-e9ca8130cc6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=700&q=80"
                            alt="Pessoas trabalhando juntas em uma horta comunitária"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-base-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="badge badge-primary badge-lg">
                    Histórias de sucesso
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Comunidades que prosperam
                  </h2>
                  <p className="max-w-[900px] text-base-content/70 md:text-xl">
                    Descubra como comunidades estão transformando espaços
                    urbanos em hortas prósperas e fortalecendo laços
                    comunitários com a ajuda da nossa plataforma.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid gap-6 py-12 md:grid-cols-3">
                {[
                  {
                    name: "Maria Silva",
                    role: "Líder comunitária em São Paulo",
                    image: "https://randomuser.me/api/portraits/women/17.jpg",
                    quote:
                      "Nossa horta comunitária mudou completamente depois que começamos a usar o Cultive. O planejamento ficou mais fácil e a distribuição das colheitas é agora totalmente transparente.",
                  },
                  {
                    name: "Carlos Oliveira",
                    role: "Família participante no Rio de Janeiro",
                    image: "https://randomuser.me/api/portraits/men/32.jpg",
                    quote:
                      "Como família participante, é gratificante ver como nossa contribuição na horta é reconhecida. O sistema de distribuição garante que todos recebam de forma justa.",
                  },
                  {
                    name: "Ana Rodrigues",
                    role: "Coordenadora de ONG em Belo Horizonte",
                    image: "https://randomuser.me/api/portraits/women/42.jpg",
                    quote:
                      "Nossa ONG apoia 5 hortas comunitárias diferentes e o Cultive nos ajuda a coordenar todas elas de forma eficiente. Os relatórios são essenciais para nossa prestação de contas.",
                  },
                ].map((testimonial, index) => (
                  <div
                    key={index}
                    className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="card-body items-center text-center">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-base-content/70">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-base-content/80 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-4xl w-full">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Pronto para começar sua jornada?
                  </h2>
                  <p className="max-w-[700px] text-base-content/70 md:text-xl">
                    Junte-se às centenas de comunidades que estão transformando
                    a forma de cultivar e compartilhar alimentos saudáveis.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a href="/signup" className="btn btn-primary btn-lg gap-1.5">
                    Criar uma conta gratuitamente
                    <MoveRight />
                  </a>
                  <a href="/sobre" className="btn btn-outline btn-lg">
                    Saiba mais sobre nós
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
