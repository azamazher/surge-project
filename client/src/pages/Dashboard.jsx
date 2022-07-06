import jwt from "jsonwebtoken";
import React, { useEffect, useState } from "react";

import { MemoryRouter, useHistory, Route, Switch } from 'react-router-dom';

import { LinkContainer } from 'react-router-bootstrap';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import AddNotes from "./AddNotes";
import ViewNotes from "./ViewNotes";
import Register from "./Register";
import Profile from "./Profile";
import ViewUsers from "./ViewUsers";


const Dashboard = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);

  const logoutUser = () => {
    localStorage.removeItem("token");
    if(history) history.replace("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt.decode(token);
      setUser(user);
      if (!user) {
        logoutUser();
      } else {
        if (user.status === 0) {
          history.push("/profile");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <MemoryRouter>
      <Container className="p-3">
        <h2 className="mb-4 center">Dashboard</h2>
        <ButtonToolbar className="custom-btn-toolbar center">
          {user && user.accountType === "ADMIN" && <LinkContainer to="/register">
            <Button className="mr-2">Add User</Button>
          </LinkContainer>}
          <LinkContainer to="/profile">
            <Button className="mr-2">Update Profile</Button>
          </LinkContainer>
          <LinkContainer to="/add/notes">
            <Button className="mr-2">Add notes</Button>
          </LinkContainer>
          <LinkContainer to="/view/notes">
            <Button className="mr-2">View notes</Button>
          </LinkContainer>
          {user && user.accountType === "ADMIN" && <LinkContainer to="/view/users">
            <Button className="mr-2">View users</Button>
          </LinkContainer>}
        </ButtonToolbar>
        <Switch>
          {user && user.accountType === "ADMIN" && <Route path="/register">
            <Register />
          </Route>}
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/add/notes">
            <AddNotes />
          </Route>
          <Route path="/view/notes">
            <ViewNotes />
          </Route>
          {user && user.accountType === "ADMIN" && <Route path="/view/users">
            <ViewUsers />
          </Route>}
        </Switch>
      </Container>
    </MemoryRouter>
  );
};

export default Dashboard;
