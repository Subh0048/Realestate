import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Check if the user is authenticated
  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default PrivateRoute;
