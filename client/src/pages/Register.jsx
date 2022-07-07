import jwt from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const Register = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt.decode(token);
      setUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerUser = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:1337/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        email,
        accountType,
      }),
    });

    const data = await response.json();
    if (data.status === "ok") {
      if (!user || (user && (user.accountType !== "ADMIN" || !user.status) )) {
        if(history) history.replace("/");
      }
      alert("User Created Successfully")
    }
  };

  return (
    <Container className="mt-4" fluid>
      <h2 className="mb-4">Add new User</h2>
      <div>
        <Form onSubmit={registerUser}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Firstname" value={firstName}
              onChange={(e) => setFirstName(e.target.value)} />
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
          </Form.Text>

          <div className="form-group mt-3">
            <label for="accountTypes">Example select</label>
            <select className="form-control" name="accountTypes"
              id="accountTypes"
              onChange={(event) => setAccountType(event.target.value)}
              value={accountType}>
              <option value="STUDENT">Student</option>
              {user && user.accountType === "ADMIN" && <option value="ADMIN">Admin</option>}
            </select>
          </div>

          <Button variant="primary" type="submit" value="Login">Register</Button>
        </Form>
      </div>
    </Container>
  );
};

export default Register;
