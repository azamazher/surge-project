import React, {Suspense, useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Loader from "./loader";


import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";

const Main = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" strict exact component={Login} />
          <Route path="/login" strict exact component={Login} />
          <Route path="/register" strict exact component={Register} />
          <Route path="/dashboard" strict exact component={Dashboard} />
          <Route path="/profile" exact component={Profile} />
        </Switch>
      </Router>
    </>
  );
}

export default Main;