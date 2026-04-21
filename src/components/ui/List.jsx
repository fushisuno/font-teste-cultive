import React from "react";
import { X } from "lucide-react";

export const UserList = ({ users, selectedIds, onAdd, onRemove, searchText }) => {
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ul className="max-h-60 overflow-auto border rounded-md bg-base-100 shadow-sm">
      {filtered.length > 0 ? (
        filtered.map((user) => {
          const isSelected = selectedIds.includes(user.id);
          return (
            <li
              key={user.id}
              className="flex justify-between items-center p-2 hover:bg-base-200 cursor-pointer"
            >
              <span>{user.name}</span>
              {isSelected ? (
                <X
                  className="h-4 w-4 text-red-500"
                  onClick={() => onRemove(user)}
                />
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => onAdd(user)}
                >
                  +
                </button>
              )}
            </li>
          );
        })
      ) : (
        <li className="p-2 text-gray-500 italic">Nenhum usuário encontrado</li>
      )}
    </ul>
  );
};
