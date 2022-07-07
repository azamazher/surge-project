import jwt from "jsonwebtoken";
import { useHistory } from "react-router-dom";

import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from "react-bootstrap/Navbar";

const Header = () => {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Row className="form-inline">
          <Col>
            <Navbar.Brand>Surge Project</Navbar.Brand>
          </Col>
          <Col>
            {!user && <Button variant="success" onClick={() => history && history.push("/register")} value="Register">Register</Button>}
            {user ? <Button variant="danger" onClick={() => logoutUser()} value="logout">LogOut</Button>
              : <Button variant="primary" onClick={() => history && history.replace("/login")} value="Login">Login</Button>
            }
          </Col>
        </Row>
      </Container>

    </Navbar>
  );
}

export default Header;
