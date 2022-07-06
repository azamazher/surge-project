import jwt from "jsonwebtoken";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const Profile = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    if(history) history.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        logoutUser();
      } else {
        getProfileDetails();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const toDateInputValue = (date) => {
    var local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toJSON().slice(0,10);
  };

  const getProfileDetails = async () => {
    const req = await fetch(`http://localhost:1337/api/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setFirstName(data.user.firstName);
      setLastName(data.user.lastName);
      setMobile(data.user.mobile);
      setDateOfBirth(toDateInputValue(data.user.dateOfBirth));
    } else {
      alert(data.error);
    }
  };

  const updateProfileDetails = async () => {
    if (password.trim().length < 2) { 
      alert("Password should be atleast 3 non-space characters"); 
      return; 
    }

    const req = await fetch(`http://localhost:1337/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        firstName,
        lastName,
        mobile,
        password,
        dateOfBirth,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      history.push('/dashboard');
    } else {
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Update Profile</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" placeholder="Firstname" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} />
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" placeholder="Lastname" value={lastName}
            onChange={(e) => setLastName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control type="text" placeholder="Mobile Number" value={mobile}
            onChange={(e) => setMobile(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" placeholder="Date of Birth" defaultValue={dateOfBirth} value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            name="dateOfBirth" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control type="password" placeholder="New Password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Button variant="primary" type="button" value="Update Details" onClick={updateProfileDetails} >Update Details</Button>
      </Form>
    </Container>
  );
};

export default Profile;
