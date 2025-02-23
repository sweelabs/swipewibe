// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Загрузка...</p>;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
