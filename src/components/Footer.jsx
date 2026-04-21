import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Send,
  Sprout,
} from "lucide-react";

const Footer = () => {
  const iconConfig = { size: 24, strokeWidth: 1.5 };
  const contactIconConfig = {
    size: 20,
    strokeWidth: 2,
    className: "mr-2 opacity-70",
  };

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-7xl mx-auto text-left">
          <div>
            <div className="flex items-center mb-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6 text-primary"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
              <span className="ml-2 text-xl font-semibold">Cultive</span>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Transformando espaços urbanos em hortas produtivas e comunidades
              mais fortes.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-base-content/80 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook {...iconConfig} />
              </a>
              <a
                href="#"
                className="text-base-content/80 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter {...iconConfig} />
              </a>
              <a
                href="#"
                className="text-base-content/80 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram {...iconConfig} />
              </a>
            </div>
          </div>

          <nav className="flex flex-col space-y-2">
            <h3 className="footer-title">Navegação</h3>
            <Link to="#como-funciona" className="hover:text-primary">
              Como Funciona
            </Link>
            <Link to="#beneficios" className="hover:text-primary">
              Benefícios
            </Link>
            <Link to="#historias" className="hover:text-primary">
              Histórias
            </Link>
            <Link to="/sobre" className="hover:text-primary">
              Sobre
            </Link>
          </nav>

          <nav className="flex flex-col space-y-2">
            <h3 className="footer-title">Recursos</h3>
            <Link to="/blog" className="hover:text-primary">
              Blog
            </Link>
            <Link to="/roadmap" className="hover:text-primary">
              Roadmap
            </Link>
            <a href="#" className="hover:text-primary">
              Guia de Plantio
            </a>
            <a href="#" className="hover:text-primary">
              FAQ
            </a>
            <a href="#" className="hover:text-primary">
              Suporte
            </a>
          </nav>

          <div className="flex flex-col">
            <h3 className="footer-title">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Mail {...contactIconConfig}/>
                <a
                  href="mailto:contato@hortacomm.com.br"
                  className="hover:text-primary"
                >
                  contato@hortacomm.com.br
                </a>
              </li>
              <li className="flex items-center">
                <Phone {...contactIconConfig} />
                <a href="tel:+551198765432" className="hover:text-primary">
                  (11) 9876-5432
                </a>
              </li>
            </ul>

            <h3 className="footer-title mt-6">Newsletter</h3>
            <form className="form-control w-full">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="input input-bordered w-full pr-16 bg-white/10 text-base-content placeholder-base-content/50 border-base-content/20 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="btn btn-primary absolute top-0 right-0 rounded-l-none text-white font-medium transition-colors"
                  aria-label="Inscrever"
                >
                  <Send size={20} strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-base-content/10 pt-8 mt-12 w-full max-w-7xl mx-auto">
          <p className="text-sm opacity-60">
            &copy; {new Date().getFullYear()} Cultive. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
