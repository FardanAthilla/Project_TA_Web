import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ element }) => {
  const token = Cookies.get("Token");

  if (token) {
    return <Navigate to="/" />;
  }

  return element;
};

export default PublicRoute;
