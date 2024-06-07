import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContent from "../pages/dashboard_page/homepage";
import NotFound from "../pages/error/NotFounds";
import Apakek from "../pages/apakek/apakek.jsx";
import LoginPage from "../pages/page/loginpage.jsx";
import ProtectedRoute from "../router/protectedRoute.jsx";
import PublicRoute from "../router/publicRoute.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<MainContent />} />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Apakek" element={<ProtectedRoute element={<Apakek />} />} />
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
