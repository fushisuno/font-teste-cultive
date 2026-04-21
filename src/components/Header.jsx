import React, { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const handleNavLinkClick = () => setMobileMenuOpen(false);

  return (
    <header className="navbar w-full bg-base-100 shadow-lg top-0 z-50 relative">
      <div className="w-full mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="flex items-center btn-ghost text-lg normal-case"
          >
            <Leaf size={28} className="text-primary" />
            <span className="font-semibold text-base-content ml-1">
              Cultive
            </span>
          </Link>
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex navbar-center">
          <ul className="menu menu-horizontal p-0 space-x-2">
            <li>
              <Link
                to="#como-funciona"
                className="font-medium hover:text-primary"
              >
                Como Funciona
              </Link>
            </li>
            <li>
              <Link to="#beneficios" className="font-medium hover:text-primary">
                Benefícios
              </Link>
            </li>
            <li>
              <Link to="#historias" className="font-medium hover:text-primary">
                Histórias
              </Link>
            </li>
            <li>
              <Link to="/sobre" className="font-medium hover:text-primary">
                Sobre
              </Link>
            </li>
          </ul>
        </nav>

        {/* AÇÕES / MENU MOBILE */}
        <div className="flex items-center space-x-2">
          {/* Botões Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/login"
              className="btn btn-ghost font-medium hover:text-primary"
            >
              Entrar
            </Link>
            <Link to="/signup" className="btn btn-primary font-medium">
              Cadastrar
            </Link>
          </div>

          {/* Toggle Mobile */}
          <button
            className="btn btn-ghost md:hidden"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-base-content" />
            ) : (
              <Menu className="h-6 w-6 text-base-content" />
            )}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div
        className={`absolute left-0 top-full w-full bg-base-100 shadow-xl md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="w-full menu menu-vertical p-4 space-y-1">
          <li className="">
            <Link to="#como-funciona" onClick={handleNavLinkClick} className="text-lg">
              Como Funciona
            </Link>
          </li>
          <li className="">
            <Link to="#beneficios" onClick={handleNavLinkClick} className="text-lg">
              Benefícios
            </Link>
          </li>
          <li className="">
            <Link to="#historias" onClick={handleNavLinkClick} className="text-lg">
              Histórias
            </Link>
          </li>
          <li className="">
            <Link to="/planos" onClick={handleNavLinkClick} className="text-lg">
              Planos
            </Link>
          </li>
          <li className="">
            <Link to="/sobre" onClick={handleNavLinkClick} className="text-lg">
              Sobre
            </Link>
          </li>
          <li className="pt-2 border-t border-base-300 mt-2">
            <Link
              to="/signup"
              className="btn btn-primary btn-block"
              onClick={handleNavLinkClick}
            >
              Cadastrar
            </Link>
          </li>
          <li className="">
            <Link
              to="/login"
              className="btn btn-ghost btn-block text-base-content"
              onClick={handleNavLinkClick}
            >
              Entrar
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
