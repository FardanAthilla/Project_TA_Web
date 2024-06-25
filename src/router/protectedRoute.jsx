import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const protectedRoute = ({ element }) => {
  const token = Cookies.get("Token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default protectedRoute;

