import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import NotFoundPage from "../pages/error/error";
import MainContent from "../pages/page/homepage";
import NotFound from "../pages/error/NotFounds";
import LoginPage from "../pages/page/loginpage";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainContent/>} />
                <Route path="*" element={<NotFound/>} />\
                <Route path="/login" element={<LoginPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
