import jwt from "jsonwebtoken";

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Redirect
} from "react-router-dom";


import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import ViewUsers from "../pages/ViewUsers";
import ViewNotes from "../pages/ViewNotes";
import AddNotes from "../pages/AddNotes";

const Main = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt.decode(token);
      setUser(user);
    } else {
      if (history) history.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Router history={history}>
        <Switch>
          <Route path="/" strict exact component={Home} />
          <Route path="/login" strict exact component={Login} />
          <Route path="/register" strict exact component={Register} />
          {!user && <Redirect path="/*" to={"/"}/>}
          {user && <Route path="/dashboard" strict exact component={Dashboard} />}
          {user && <Route path="/profile" exact component={Profile} />}
          {user && <Route path="/add/notes" exact component={AddNotes} />}
          {user && <Route path="/view/notes" exact component={ViewNotes} />}
          {user && user.accountType === "ADMIN" && <Route path="/view/users" exact component={ViewUsers} />}
        </Switch>
      </Router>
    </>
  );
}

export default Main;