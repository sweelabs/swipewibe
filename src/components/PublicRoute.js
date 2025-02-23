// src/components/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Загрузка...</p>;
  return user ? <Navigate to="/" /> : children;
};

export default PublicRoute;
