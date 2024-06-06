import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import NotFoundPage from "../pages/error/error";
import MainContent from "../pages/page/homepage";
import NotFound from "../pages/error/NotFounds";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainContent/>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
