import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import NotFoundPage from "../pages/error/error";
import MainContent from "../pages/dashboard_page/homepage";
import NotFound from "../pages/error/NotFounds";
import Apakek from "../pages/apakek/apakek.jsx"

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainContent/>} />
                <Route path="*" element={<NotFound/>} />
                <Route path="/Apakek" element={<Apakek/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
