import { ChevronRight } from "lucide-react";

const Dropdown = ({ children, className = "", hover = false, ...props }) => {
  return (
    <div
      className={`dropdown ${hover ? "dropdown-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownTrigger = ({ children, className = "", ...props }) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

const DropdownContent = ({
  children,
  className = "",
  align = "start",
  ...props
}) => {
  return (
    <div
      className={`dropdown-content menu bg-base-200 rounded-box min-w-48 p-2 shadow-lg ${
        align === "end"
          ? "dropdown-end"
          : align === "top"
          ? "dropdown-top"
          : align === "bottom"
          ? "dropdown-bottom"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownItem = ({
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <div
      className={`${disabled ? "disabled" : ""} ${className}`}
      role="menuitem"
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownHeader = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`menu-title text-base-content/70 px-2 py-2 text-sm font-semibold ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownDivider = ({ className = "", ...props }) => {
  return <div className={`divider my-1 ${className}`} {...props} />;
};

const DropdownSubMenu = ({ children, label, className = "", ...props }) => {
  return (
    <div className={`collapse collapse-arrow ${className}`} {...props}>
      <input type="checkbox" className="min-h-0" />
      <div className="collapse-title min-h-0 p-2 flex items-center">
        {label}
        <ChevronRight className="ml-auto h-4 w-4" />
      </div>
      <div className="collapse-content px-2">{children}</div>
    </div>
  );
};

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
  DropdownSubMenu,
};
