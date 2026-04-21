import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

export default function DashboardLayout() {
  const { user } = useUserStore((state) => state);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", { detail: sidebarOpen })
    );
  }, [sidebarOpen]);

  if (!user) return null; 

  return (
    <div className="flex min-h-screen bg-base-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : ""
        } lg:ml-64`}
      >
        <header className="lg:hidden p-3 border-b border-base-300 bg-base-100 flex-shrink-0">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost btn-square"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
