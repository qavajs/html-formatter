import React from "react";
import { MainPage } from "./pages/MainPage";
import { FeaturePage } from "./pages/FeaturePage";
import { FailedPage } from "./pages/FailedPage";
import { Route } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import css from "./App.module.scss";

export const App = () => {
  return (
    <div className={css.app}>
      <Route component={AppHeader} />
      <main>
        <Route path="/" exact component={MainPage} />
        <Route path="/feature/:id" exact component={FeaturePage} />
        <Route path="/failed-scenarios" exact component={FailedPage} />
      </main>
      <footer />
    </div>
  );
};
