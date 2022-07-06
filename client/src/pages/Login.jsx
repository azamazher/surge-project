import jwt from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (user) {
        if (user.status === 0) {
          history.push("/profile");
        } else {
          history.push("/dashboard");
        }
      }
    }
  }, [history]);

  const loginUser = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:1337/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.user) {
      localStorage.setItem("token", data.user);
      history.push("/dashboard");
    } else {
      alert("Please check your username and password");
    }
  };

  return (
    <Container className="mt-4" fluid>
      <h2 className="mb-4">Login</h2>
      <div>
        <Form onSubmit={loginUser}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit" value="Login">Login</Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
