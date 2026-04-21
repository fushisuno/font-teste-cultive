import React, { useState, useRef, useEffect } from "react";
import { useController, useWatch } from "react-hook-form";
import { X, Eye, EyeOff, Plus } from "lucide-react";

export const FormField = ({
  name,
  control,
  type = "input",
  placeholder,
  options = [],
  className = "",
  disabled = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  error: errorProp,
}) => {
  const {
    field,
    fieldState: { error, isDirty, isTouched },
  } = useController({ name, control });

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);

  const isTextArea = type === "textarea";
  const isSelect = type === "select";
  const isSearchable = type === "searchable-select";
  const isPassword = type === "password";
  const isMultiSelect = type === "multi-select";
  const isUserList = type === "user-list";

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  // Validação de erro
  let hasError = !!(error || errorProp);
  let errorMessage = errorProp?.message || error?.message || "";
  if (
    name === "confirmPassword" &&
    confirmPassword &&
    password !== confirmPassword
  ) {
    hasError = true;
    errorMessage = "As senhas não conferem";
  }

  const showSuccess = !hasError && (isDirty || isTouched) && field.value;

  const baseClass = isTextArea
    ? "textarea textarea-bordered w-full"
    : isSelect || isSearchable || isUserList
    ? "select select-bordered w-full"
    : "input input-bordered w-full";

  const stateClass = isTextArea
    ? hasError
      ? "textarea-error"
      : showSuccess
      ? "textarea-success"
      : ""
    : isSelect || isSearchable || isUserList
    ? hasError
      ? "select-error"
      : showSuccess
      ? "select-success"
      : ""
    : hasError
    ? "input-error"
    : showSuccess
    ? "input-success"
    : "";

  const leftPadding = IconLeft ? "pl-10" : "";
  const rightPadding = IconRight || isPassword || isSearchable ? "pr-10" : "";

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Atualiza searchText se houver valor (multi ou user-list)
  useEffect(() => {
    if (!isUserList && !isMultiSelect) return;
    setSearchText("");
  }, [field.value]);

  // Filtra opções para searchable, multi ou user-list
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchText.toLowerCase()) &&
      (isMultiSelect || isUserList
        ? !(field.value || []).some((v) => v.value === opt.value)
        : true)
  );

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {IconLeft && (
        <div className="absolute left-3 top-3 z-10 pointer-events-none">
          <IconLeft className="h-5 w-5 text-base-content/60" />
        </div>
      )}

      {/* --- TEXTAREA --- */}
      {isTextArea && (
        <textarea
          placeholder={placeholder}
          className={`${baseClass} ${stateClass} ${leftPadding} ${rightPadding}`}
          {...field}
          disabled={disabled}
        />
      )}

      {/* --- PASSWORD --- */}
      {isPassword && (
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={`${baseClass} ${stateClass} ${leftPadding} pr-10`}
            {...field}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-3 text-base-content/70 hover:text-base-content z-10 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      )}

      {/* --- INPUT PADRÃO --- */}
      {!isTextArea &&
        !isPassword &&
        !isSelect &&
        !isSearchable &&
        !isMultiSelect &&
        !isUserList && (
          <input
            type={type}
            placeholder={placeholder}
            className={`${baseClass} ${stateClass} ${leftPadding} ${rightPadding}`}
            {...field}
            disabled={disabled}
          />
        )}

      {/* --- SELECT --- */}
      {isSelect && (
        <select
          className={`${baseClass} ${stateClass} ${leftPadding} ${rightPadding}`}
          {...field}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {isSearchable && (
        <div className="relative w-full">
          <input
            type="text"
            placeholder={placeholder}
            className={`${baseClass} ${stateClass} ${leftPadding} ${rightPadding}`}
            value={
              disabled
                ? field.value
                  ? options.find((o) => o.value === field.value)?.label
                  : ""
                : searchText
            }
            onChange={(e) => {
              if (!disabled) {
                setSearchText(e.target.value);
                setIsOpen(true);
              }
            }}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            readOnly={disabled} // garante que não edita se desabilitado
          />
          {!disabled && isOpen && (
            <ul className="absolute left-0 mt-1 z-50 w-full max-h-60 overflow-auto border border-base-300 rounded-md bg-base-100 shadow-lg scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li
                    key={opt.value}
                    className="p-2 cursor-pointer hover:bg-base-200 flex justify-between items-center"
                    onClick={() => {
                      field.onChange(opt.value);
                      setSearchText(opt.label);
                      setIsOpen(false);
                    }}
                  >
                    <span>{opt.label}</span>
                    {field.value === opt.value && (
                      <button
                        type="button"
                        className="ml-2 btn btn-sm btn-ghost btn-square"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange("");
                          setSearchText("");
                          setIsOpen(true);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500 italic">Nenhuma opção</li>
              )}
            </ul>
          )}
        </div>
      )}

      {/* --- MULTI-SELECT --- */}
      {isMultiSelect && (
        <div
          className={`${baseClass} ${stateClass} flex flex-wrap gap-1 items-center p-1 min-h-[2.5rem] cursor-text`}
          onClick={() => !disabled && setIsOpen(true)}
        >
          {(field.value || []).map((val) => {
            const opt = options.find((o) => o.value === val);
            if (!opt) return null;
            return (
              <span
                key={val}
                className="flex items-center gap-1 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs"
              >
                {opt.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange(
                      (field.value || []).filter((v) => v !== val)
                    );
                  }}
                />
              </span>
            );
          })}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={(field.value || []).length === 0 ? placeholder : ""}
            className="flex-1 border-none outline-none p-0 m-0 bg-transparent min-w-[50px]"
            disabled={disabled}
          />
          {isOpen && filteredOptions.length > 0 && (
            <ul className="absolute left-0 mt-1 z-50 w-full max-h-60 overflow-auto border border-base-300 rounded-md bg-base-100 shadow-lg scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100">
              {filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  className="p-2 cursor-pointer flex justify-between items-center hover:bg-base-200"
                  onClick={() => {
                    field.onChange([...(field.value || []), opt.value]);
                    setSearchText("");
                  }}
                >
                  <span>{opt.label}</span>
                  <X
                    className="h-4 w-4 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange(
                        (field.value || []).filter((v) => v !== opt.value)
                      );
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* --- USER-LIST --- */}
      {isUserList && (
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-wrap gap-1 w-full">
            {(field.value || []).map((user) => (
              <span
                key={user.value}
                className="flex items-center gap-1 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs"
              >
                {user.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange(
                      (field.value || []).filter((v) => v.value !== user.value)
                    );
                  }}
                />
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="input input-bordered w-full"
            disabled={disabled}
          />

          <div className="w-full border border-base-300 rounded-md max-h-64 overflow-auto bg-base-100 shadow-sm">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((u) => (
                <div
                  key={u.value}
                  className="p-2 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors w-full"
                  onClick={() => {
                    field.onChange([...(field.value || []), u]);
                  }}
                >
                  <span>{u.label}</span>

                  <button
                    type="button"
                    className="text-green-600 hover:text-green-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange([...(field.value || []), u]);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500 italic w-full">
                Nenhum usuário encontrado
              </div>
            )}
          </div>
        </div>
      )}

      {IconRight && !isPassword && (
        <div className="absolute right-3 top-3 z-10 pointer-events-none">
          <IconRight className="h-5 w-5 text-base-content/60" />
        </div>
      )}
      {hasError && <p className="text-error text-xs mt-1">{errorMessage}</p>}
    </div>
  );
};
