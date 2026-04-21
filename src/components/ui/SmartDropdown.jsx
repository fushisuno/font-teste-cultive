"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function SmartDropdown({
  trigger,
  items = [],
  buttonClass = "",
  align = "auto",
  userRole,
  showOnlyForRoles, 
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleOpen = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuHeight = menuRef.current?.offsetHeight || 0;
    const menuWidth = menuRef.current?.offsetWidth || 200;

    let top = rect.bottom + scrollY + 4;
    let left = rect.left + scrollX;
    let width = menuWidth;

    if (viewportWidth < 640) {
      left = scrollX + 8;
      width = viewportWidth - 16;
      top = rect.bottom + scrollY + 4;
    } else {
      if (align === "end") {
        left = rect.right + scrollX - menuWidth;
      } else if (align === "auto") {
        if (rect.right + menuWidth > viewportWidth) {
          left = rect.left + scrollX;
        } else {
          left = rect.right + scrollX - menuWidth;
        }
      }

      if (top + menuHeight > viewportHeight + scrollY) {
        const topAbove = rect.top + scrollY - menuHeight - 4;
        if (topAbove >= scrollY) top = topAbove;
      }
    }

    setPosition({ top, left, width });
    setOpen(true);
  };

  // filtra items de acordo com showOnlyForRoles
  const filteredItems = showOnlyForRoles
    ? items.filter(
        (item) =>
          !item.onlyRoles || item.onlyRoles.includes(userRole)
      )
    : items;

  const menu = open ? (
    <div
      ref={menuRef}
      className="absolute z-50 rounded-xl shadow-lg bg-base-100 border border-base-300 py-1"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        whiteSpace: "nowrap",
        position: "absolute",
      }}
    >
      {filteredItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            setOpen(false);
            item.onClick?.();
          }}
          className={`flex items-center gap-2 px-4 py-2 w-full text-left text-sm hover:bg-base-200 transition cursor-pointer ${
            item.danger ? "text-red-600 font-medium" : ""
          }`}
        >
          {item.icon} <span className="truncate">{item.label}</span>
        </button>
      ))}
    </div>
  ) : null;

  return (
    <>
      <div className="inline-block" ref={ref}>
        <button
          type="button"
          onClick={handleOpen}
          className={`focus:outline-none ${buttonClass}`}
        >
          {trigger || "⋯"}
        </button>
      </div>
      {menu && createPortal(menu, document.body)}
    </>
  );
}
