import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContent from "../pages/page/dashboardPage/dashboardView.jsx";
import NotFound from "../pages/error/NotFounds";
import AddAccount from "../pages/page/addAccountPage/addAccountView.jsx";
import AllData from "../pages/page/addAccountPage/allDataView.jsx";
import ListMachine from "../pages/page/listMachinePage/listMachineView.jsx";
import ListSparepart from "../pages/page/listSparepartPage/listSparepartView.jsx";
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
        <Route path="/AllData" element={<ProtectedRoute element={<AllData />} />} />
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
        <Route path="/ListMachine" element={<ProtectedRoute element={<ListMachine />} />} />
        <Route path="/ListSparepart" element={<ProtectedRoute element={<ListSparepart />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
