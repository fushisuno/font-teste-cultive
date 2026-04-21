import React from "react";
import { Edit, Trash } from "lucide-react";

/**
 * Componente Table responsivo (desktop + mobile)
 *
 * @param {Array} data - Lista de objetos
 * @param {Array} columns - [{ key, label, render? }]
 * @param {Function} onEdit - Callback de edição (opcional)
 * @param {Function} onDelete - Callback de exclusão (opcional)
 * @param {String} emptyMessage - Texto quando não há dados
 */
const Table = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  emptyMessage = "Nenhum registro encontrado.",
}) => {
  return (
    <div className="card shadow-xl bg-base-100 rounded-xl overflow-x-hidden">
      <div className="card-body p-0">
        {/* Desktop / tablet */}
        <div className="hidden md:block">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="bg-base-200"
                  >
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="bg-base-200 text-right">Ações</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, i) => (
                  <tr key={row.id || i} className="hover">
                    {columns.map((col) => (
                      <td key={col.key} className="whitespace-nowrap">
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          {onEdit && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                              aria-label={`Editar ${row.id || ""}`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm text-error"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row.id);
                              }}
                              aria-label={`Remover ${row.id || ""}`}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="text-center py-6 text-base-content/70"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="block md:hidden divide-y divide-base-200">
          {data.length > 0 ? (
            data.map((row, i) => (
              <div
                key={row.id || i}
                className="p-4 flex flex-col gap-2 hover:bg-base-200/20 transition rounded-lg"
              >
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className="flex justify-between items-center"
                  >
                    <span className="font-semibold text-sm text-base-content/70">
                      {col.label}:
                    </span>
                    <span className="text-sm text-base-content text-right">
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </span>
                  </div>
                ))}

                {(onEdit || onDelete) && (
                  <div className="flex gap-2 mt-2">
                    {onEdit && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => onEdit(row)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => onDelete(row.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-base-content/70">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
