import React from "react";
import { MainPage } from "./pages/MainPage";
import { FeaturePage } from "./pages/FeaturePage";
import { FailedPage } from "./pages/FailedPage";
import { Route, Routes } from "react-router-dom";
import { AppHeader } from "./AppHeader";

export const App = () => {
  return (
    <>
        <AppHeader/>
        <Routes>
            <Route path="/" element={<MainPage/>} />
            <Route path="/feature/:id" element={<FeaturePage/>} />
            <Route path="/failed-scenarios" element={<FailedPage/>} />
        </Routes>
      <footer />
    </>
  );
};
