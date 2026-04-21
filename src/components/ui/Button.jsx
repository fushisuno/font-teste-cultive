import React from "react";

const Button = ({ onClick, icon: Icon, children }) => {
  return (
    <button
      className="btn btn-primary flex items-center gap-1 w-full sm:w-auto"
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
};

Button.displayName = "Button";

export { Button };
