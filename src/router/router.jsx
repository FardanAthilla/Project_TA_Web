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
import ListSparepart from "../pages/page/listSparepartPage/listSparepartView.jsx";
import ListCategory from "../pages/page/listCategoryPage/listCategoryView.jsx";
import LoginPage from "../pages/page/loginPage/loginView.jsx";
import ProtectedRoute from "../router/protectedRoute.jsx";
import PublicRoute from "../router/publicRoute.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<MainContent />} />} />
        <Route path="*" element={<NotFound />} />
<<<<<<< HEAD
        <Route path="/history" element={<ProtectedRoute element={<Page1 />} />} />        
=======

        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />

>>>>>>> 56c495dee8692dc4d9b0eb8df5d9375cd90425cd
        <Route path="/AddAccount" element={<ProtectedRoute element={<AddAccount />} />} />
        <Route path="/AllData" element={<ProtectedRoute element={<AllData />} />} />
        <Route path="/EditAccount" element={<ProtectedRoute element={<EditAccount />} />} />

        <Route path="/ListSparepart" element={<ProtectedRoute element={<ListSparepart />} />} />
        <Route path="/ListCategory" element={<ProtectedRoute element={<ListCategory />} />} />

        <Route path="/ListMachine" element={<ProtectedRoute element={<ListMachine />} />} />
        <Route path="/AddMachine" element={<ProtectedRoute element={<AddMachine />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
