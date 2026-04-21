// components/ui/FloatingButton.jsx
import React from "react";

export default function FloatingButton({
  onClick,
  tooltip,
  color = "btn-primary",
  icon,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        btn ${color} btn-circle
        fixed bottom-6 right-6 z-50
        w-14 h-14 md:w-16 md:h-16
        shadow-xl hover:shadow-2xl
        flex items-center justify-center
        transition-transform transform
        hover:scale-105 active:scale-95
      `}
      aria-label={tooltip || "Criar"}
      title={tooltip || "Criar"}
    >
      {icon}
    </button>
  );
}
