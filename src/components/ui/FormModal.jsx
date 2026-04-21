import { X } from "lucide-react";
import React, { useState, forwardRef, useImperativeHandle } from "react";

export const FormModal = forwardRef(
  (
    { title, children, submitLabel = "Salvar", submitLoading, onSubmit },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    return (
      <>
        {open && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto">
            <div className="bg-base-100 w-full max-w-2xl max-h-[95vh] rounded-xl shadow-xl flex flex-col p-4">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-base-300 bg-base-100 px-6 py-4">
                <h2 className="text-xl font-semibold text-base-content">
                  {title}
                </h2>
                <X
                  className="h-6 w-6 cursor-pointer text-base-content/70 hover:text-error transition-colors"
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Conteúdo do modal passado via children */}
              <div className="p-4 overflow-y-auto flex-1">
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onSubmit={onSubmit}
                >
                  {children}

                  {/* Botão de ação (opcional) */}
                  {submitLabel && (
                    <div className="col-span-1 md:col-span-2 mt-4">
                      <button
                        type="submit"
                        disabled={submitLoading}
                        className="btn btn-primary mt-2 w-full"
                      >
                        {submitLabel}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);
