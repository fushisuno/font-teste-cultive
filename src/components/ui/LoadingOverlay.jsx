import React from "react";
const LoadingOverlay = ({ loading = false, message = "Carregando..." }) => {
  if (!loading) return null;
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-sm z-50">
      {" "}
      <div className="loading loading-spinner loading-lg text-primary"></div>{" "}
      <span className="text-lg text-base-content/70 mt-4">{message}</span>{" "}
    </div>
  );
};
export default LoadingOverlay;
