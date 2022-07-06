import jwt from "jsonwebtoken";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";


const AddNotes = () => {
  const history = useHistory();
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");

  const logoutUser = () => {
    localStorage.removeItem("token");
    if(history) history.replace("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt.decode(token);
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

  const createNote = async () => {
    const req = await fetch("http://localhost:1337/api/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title: tempTitle,
        description: tempDescription,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      setTempTitle("");
      setTempDescription("");
      alert("Added notes successfully");
    } else {
      alert(data.error);
    }
  };

  return (
    <Container className="mt-4" fluid>
      <h2 className="mb-4">Add Notes</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Notes Title" value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)} />
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder="Notes Description" value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={createNote} >Create note</Button>
      </Form>
    </Container >
  );
};

export default AddNotes;
