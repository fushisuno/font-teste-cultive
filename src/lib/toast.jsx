import React, { useEffect, useState } from "react";
import bus from "./toastBus";

export function ToastContainer({ position = "top-right" }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const t = e.detail;
      setToasts((prev) => [t, ...prev]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, t.duration || 3500);
    }

    function onRemove(e) {
      const { id } = e.detail;
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }

    bus.addEventListener("toast", onToast);
    bus.addEventListener("remove-toaster", onRemove);
    return () => {
      bus.removeEventListener("toast", onToast);
      bus.removeEventListener("remove-toaster", onRemove);
    };
  }, []);

  if (toasts.length === 0) return null;

  const posClass = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  }[position];

  return (
    <div className={`fixed z-50 ${posClass} flex flex-col gap-2`}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm w-full shadow-lg rounded-md p-3 bg-base-100 border ${
            t.type === "error"
              ? "border-error"
              : t.type === "success"
              ? "border-success"
              : "border-base-300"
          } `}
        >
          <div className="font-semibold">{t.title}</div>
          {t.description && (
            <div className="text-sm opacity-70">{t.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
