import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContent from "../pages/page/dashboardPage/dashboardView.jsx";
import NotFound from "../pages/error/NotFounds";
import AddAccount from "../pages/page/addAccountPage/addAccountView.jsx";
import LoginPage from "../pages/page/loginPage/loginView.jsx";
import ProtectedRoute from "../router/protectedRoute.jsx";
import PublicRoute from "../router/publicRoute.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<MainContent />} />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/AddAccount" element={<ProtectedRoute element={<AddAccount />} />} />
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
