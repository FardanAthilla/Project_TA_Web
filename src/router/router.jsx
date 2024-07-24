import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainContent from "../pages/page/dashboardPage/dashboardView.jsx";

import Page1 from "../pages/page/historyanalytics/view.jsx";

import NotFound from "../pages/error/NotFounds";

import AddAccount from "../pages/page/addAccountPage/addAccountView.jsx";
import EditAccount from "../pages/page/addAccountPage/editAccountView.jsx";
import AllData from "../pages/page/addAccountPage/allDataView.jsx";

import ListMachine from "../pages/page/listMachinePage/listMachineView.jsx";
import AddMachine from "../pages/page/listMachinePage/addMachineView.jsx";
import EditMachine from "../pages/page/listMachinePage/editMachineView.jsx";

import ListSparepart from "../pages/page/listSparepartPage/listSparepartView.jsx";
import AddSparepart from "../pages/page/listSparepartPage/addSparepart.jsx";
import EditSparepart from "../pages/page/listSparepartPage/editSparepartView.jsx";

import ListCategory from "../pages/page/listCategoryPage/listCategoryView.jsx";
import AddCategory from "../pages/page/listCategoryPage/addCategoryView.jsx";
import EditCategory from "../pages/page/listCategoryPage/editCategoryView.jsx";

import LoginPage from "../pages/page/loginPage/loginView.jsx";
import ProtectedRoute from "../router/protectedRoute.jsx";
import PublicRoute from "../router/publicRoute.jsx";

import AnalyticsPenjualan from "../pages/page/historyanalytics/penjualan.jsx";
import AnalyticsService from "../pages/page/historyanalytics/service.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<MainContent />} />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />

        <Route path="/history" element={<ProtectedRoute element={<Page1 />} />} />        

        <Route path="/AddAccount" element={<ProtectedRoute element={<AddAccount />} />} />
        <Route path="/AllData" element={<ProtectedRoute element={<AllData />} />} />
        <Route path="/EditAccount" element={<ProtectedRoute element={<EditAccount />} />} />

        <Route path="/ListSparepart" element={<ProtectedRoute element={<ListSparepart />} />} />
        <Route path="/AddSparepart" element={<ProtectedRoute element={<AddSparepart />} />} />
        <Route path="/EditSparepart" element={<ProtectedRoute element={<EditSparepart />} />} />

        <Route path="/ListCategory" element={<ProtectedRoute element={<ListCategory />} />} />
        <Route path="/AddCategory" element={<ProtectedRoute element={<AddCategory />} />} />
        <Route path="/EditCategory" element={<ProtectedRoute element={<EditCategory />} />} />

        <Route path="/ListMachine" element={<ProtectedRoute element={<ListMachine />} />} />
        <Route path="/AddMachine" element={<ProtectedRoute element={<AddMachine />} />} />
        <Route path="/EditMachine" element={<ProtectedRoute element={<EditMachine />} />} />

        {/* Add the new routes for the dropdown menu items */}
        <Route path="/analytics/penjualan" element={<ProtectedRoute element={<AnalyticsPenjualan />} />} />
        <Route path="/analytics/service" element={<ProtectedRoute element={<AnalyticsService />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
