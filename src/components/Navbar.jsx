import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
 const isAuthenticated = false;
 const user = {
    "nome": "kaina",
    "roles": ["admin", "producer"]
  }

  // Determinar o tipo de usuário baseado nas roles
  const isAdmin = user?.roles?.includes('admin');
  const isProducer = user?.roles?.includes('producer');
  
  return (
    <header className="navbar bg-base-100 shadow-sm py-2 px-4">
      <div className="navbar-start">
        {/* Logo e nome da marca */}
        <div className="flex items-center space-x-2">
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
            className="h-6 w-6 text-primary"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
          <span className="text-lg font-semibold">Cultive</span>
        </div>
      </div>

      {/* Menu para desktop - muda conforme autenticação e role */}
      <div className="navbar-center hidden md:flex">
        <nav className="flex gap-6">
          {!isAuthenticated ? (
            // Menu para usuários não autenticados
            <>
              <a href="/planos" className="link link-hover text-base-content">
                Planos
              </a>
              <a href="/sobre" className="link link-hover text-base-content">
                Sobre nós
              </a>
              <a href="/ajuda" className="link link-hover text-base-content">
                Ajuda
              </a>
            </>
          ) : isAdmin ? (
            // Menu para administradores
            <>
              <a href="/dashboard" className="link link-hover text-base-content">
                Dashboard
              </a>
              <a href="/admin/usuarios" className="link link-hover text-base-content">
                Usuários
              </a>
              <a href="/admin/relatorios" className="link link-hover text-base-content">
                Relatórios
              </a>
              <a href="/admin/configuracoes" className="link link-hover text-base-content">
                Configurações
              </a>
            </>
          ) : isProducer ? (
            // Menu para produtores
            <>
              <a href="/dashboard" className="link link-hover text-base-content">
                Dashboard
              </a>
              <a href="/produtos" className="link link-hover text-base-content">
                Meus Produtos
              </a>
              <a href="/vendas" className="link link-hover text-base-content">
                Vendas
              </a>
              <a href="/estatisticas" className="link link-hover text-base-content">
                Estatísticas
              </a>
            </>
          ) : (
            // Menu para usuários comuns (consumidores)
            <>
              <a href="/produtos" className="link link-hover text-base-content">
                Produtos
              </a>
              <a href="/categorias" className="link link-hover text-base-content">
                Categorias
              </a>
              <a href="/ofertas" className="link link-hover text-base-content">
                Ofertas
              </a>
              <a href="/compras" className="link link-hover text-base-content">
                Minhas Compras
              </a>
            </>
          )}
        </nav>
      </div>

      {/* Lado direito da navbar - muda conforme autenticação */}
      <div className="navbar-end gap-2">
        {!isAuthenticated ? (
          // Botões para usuários não autenticados (apenas desktop)
          <>
            <div className="hidden md:flex gap-2">
              <a href="/login" className="btn btn-ghost">
                Entrar
              </a>
              <Link to="/signup" className="btn btn-primary">
                Cadastre-se
              </Link>
            </div>
          </>
        ) : (
          // Perfil do usuário logado
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                {isAdmin && <span className="absolute -top-1 -right-1 badge badge-xs badge-secondary">A</span>}
                {isProducer && <span className="absolute -top-1 -right-1 badge badge-xs badge-accent">P</span>}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li className="menu-title">
                <span>Olá, {user?.name || 'Usuário'}</span>
              </li>
              {isAdmin && <li className="menu-title"><span>Administrador</span></li>}
              {isProducer && <li className="menu-title"><span>Produtor</span></li>}
              
              <li><a href="/perfil">Meu Perfil</a></li>
              <li><a href="/configuracoes">Configurações</a></li>
              
              {isProducer && (
                <>
                  <li><a href="/meus-produtos">Meus Produtos</a></li>
                  <li><a href="/minhas-vendas">Minhas Vendas</a></li>
                </>
              )}
              
              {!isProducer && (
                <li><a href="/minhas-compras">Minhas Compras</a></li>
              )}
              
              <li><a href="/logout">Sair</a></li>
            </ul>
          </div>
        )}

        {/* Menu mobile dropdown (para todos os usuários) */}
        <div className="md:hidden">
          <div className="dropdown dropdown-end">
            <div tabIndex={1} role="button" className="btn btn-ghost btn-circle">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </div>
            <ul 
              tabIndex={1} 
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {!isAuthenticated ? (
                // Menu mobile para não autenticados
                <>
                  <li><a href="/planos">Planos</a></li>
                  <li><a href="/sobre">Sobre nós</a></li>
                  <li><a href="/ajuda">Ajuda</a></li>
                  <li className="menu-title mt-2"><span>Conta</span></li>
                  <li><a href="/login">Entrar</a></li>
                  <li><a href="/signup">Cadastre-se</a></li>
                </>
              ) : isAdmin ? (
                // Menu mobile para administradores
                <>
                  <li><a href="/dashboard">Dashboard</a></li>
                  <li><a href="/admin/usuarios">Usuários</a></li>
                  <li><a href="/admin/relatorios">Relatórios</a></li>
                  <li><a href="/admin/configuracoes">Configurações</a></li>
                  <li className="menu-title mt-2"><span>Minha Conta</span></li>
                  <li><a href="/perfil">Perfil</a></li>
                  <li><a href="/logout">Sair</a></li>
                </>
              ) : isProducer ? (
                // Menu mobile para produtores
                <>
                  <li><a href="/dashboard">Dashboard</a></li>
                  <li><a href="/produtos">Meus Produtos</a></li>
                  <li><a href="/vendas">Vendas</a></li>
                  <li><a href="/estatisticas">Estatísticas</a></li>
                  <li className="menu-title mt-2"><span>Minha Conta</span></li>
                  <li><a href="/perfil">Perfil</a></li>
                  <li><a href="/configuracoes">Configurações</a></li>
                  <li><a href="/logout">Sair</a></li>
                </>
              ) : (
                // Menu mobile para usuários comuns
                <>
                  <li><a href="/produtos">Produtos</a></li>
                  <li><a href="/categorias">Categorias</a></li>
                  <li><a href="/ofertas">Ofertas</a></li>
                  <li><a href="/compras">Minhas Compras</a></li>
                  <li className="menu-title mt-2"><span>Minha Conta</span></li>
                  <li><a href="/perfil">Perfil</a></li>
                  <li><a href="/configuracoes">Configurações</a></li>
                  <li><a href="/logout">Sair</a></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;