import React from "react";

export const UserSearchInput = ({ value, onChange, placeholder = "Pesquisar usuário..." }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input input-bordered w-full mb-2"
    />
  );
};
