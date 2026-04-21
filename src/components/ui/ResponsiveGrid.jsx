import React, { useState, useEffect } from "react";

const ResponsiveGrid = ({
  children,
  columns = 4,
  gap = "1rem",
  className = "",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMedium, setIsMedium] = useState(false);

  // Ouve o evento vindo do layout principal (abrir/fechar sidebar)
  useEffect(() => {
    const handleSidebarToggle = (e) => setSidebarOpen(e.detail);
    window.addEventListener("sidebar-toggle", handleSidebarToggle);
    return () =>
      window.removeEventListener("sidebar-toggle", handleSidebarToggle);
  }, []);

  // Detecta largura da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm
      setIsMedium(window.innerWidth >= 640 && window.innerWidth < 1024); // md
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Classes de grid padrão
  const colsClasses = {
    1: "grid-cols-1",
    2: "sm:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  // Se sidebar estiver aberta e for tela média → 2 colunas
  // Se for mobile → 1 coluna
  let responsiveCols = colsClasses[columns] ?? "";
  if (isMobile) {
    responsiveCols = "grid-cols-1";
  } else if (isMedium && sidebarOpen) {
    responsiveCols = "grid-cols-2";
  }

  return (
    <div
      className={`w-full grid mb-8 max-w-7xl mx-auto ${responsiveCols} ${className}`}
      style={{ gap }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
