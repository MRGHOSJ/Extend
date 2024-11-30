import React from "react";

const Toast = ({ message, type, visible }) => {
  if (!visible) return null;

  const toastStyles = {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    borderRadius: "5px",
    zIndex: 1000,
    color: "#fff",
    backgroundColor: type === "success" ? "#28a745" : "#dc3545", // Green for success, red for error
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    transition: "opacity 0.3s ease",
    fontSize: "14px",
  };

  return <div style={toastStyles}>{message}</div>;
};

export default Toast;
