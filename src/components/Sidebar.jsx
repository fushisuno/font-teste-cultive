import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Globe,
  Leaf,
  MessageSquare,
  Users,
  Settings,
  Bell,
  HelpCircle,
  ChevronLeft,
  LogOut,
  GraduationCap,
  Wheat,
  Sprout,
} from "lucide-react";

import { useUserStore } from "@/stores/useUserStore";

const Sidebar = ({ user, isOpen, onToggle }) => {
  const { logout } = useUserStore((state) => state);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

    const handleLinkClick = () => {
    if (isMobile && isOpen) {
      onToggle?.();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  const role = user?.role ?? "cultivador";
  const displayName = user?.nome || user?.name || "Usuário";

  const baseMenu = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/hortas", icon: Leaf, label: "Hortas" },
    { path: "/plantios", icon: Sprout, label: "Plantios" },
    { path: "/colheitas", icon: Wheat, label: "Colheitas" },
  ];

  const roleMenus = {
    admin: [
      { path: "/usuarios", icon: Users, label: "Usuários" },
      { path: "/familias", icon: Users, label: "Famílias" },
    ],
    gestor: [{ path: "/familias", icon: Users, label: "Famílias" }],
    cultivador: [],
    voluntario: [],
  };


  const baseMenu2 = [
    { path: "/comunicacao", icon: MessageSquare, label: "Comunicação" },
    { path: "/notificacoes", icon: Bell, label: "Notificações" },
    { path: "/ajuda", icon: HelpCircle, label: "Ajuda" },
    { path: "/configuracoes", icon: Settings, label: "Configurações" },
  ];
  const menuItems = [...baseMenu, ...(roleMenus[role.toLowerCase()] || []), ...baseMenu2];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:flex`}
    >
      <div className="flex flex-col bg-base-100 border-r border-base-300 h-full relative w-64 shadow-xl">
        <div className="p-4 border-b border-base-300 flex items-center justify-between flex-shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Leaf size={28} className="text-primary" />
            <span className="text-xl font-bold text-base-content">Cultive</span>
          </Link>
          <button
            className="btn btn-ghost btn-sm p-1 lg:hidden"
            onClick={onToggle}
            aria-label="Toggle Sidebar"
          >
            <ChevronLeft className="h-5 w-5 text-base-content/70" />
          </button>
        </div>

        <div className="py-2 flex-grow overflow-y-auto">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }`
                  }
                >
                  <div className="mr-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Perfil do usuário / Logout */}
        <div className="p-4 border-t border-base-300 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-base-content truncate">
                {displayName}
              </p>
              <p className="text-xs text-base-content/70 truncate capitalize">
                {role}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              to="/perfil"
              onClick={onToggle}
              className="flex items-center px-3 py-2 text-sm rounded-lg text-base-content/70 hover:bg-base-200 transition-colors"
            >
              <Settings className="h-4 w-4 mr-3 text-base-content/60" />
              Meu Perfil
            </Link>
            <Link
              to=""
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm rounded-lg text-error hover:bg-error/10 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
