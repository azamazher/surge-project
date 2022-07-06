import jwt from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import PageItem from 'react-bootstrap/PageItem';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";



const ViewNotes = () => {
  const MAX_NOTES_PER_PAGE = 2;
  const history = useHistory();
  const [notes, setNotes] = useState([]);
  const [notesCount, setNotesCount] = useState(0);
  const [notesPage, setNotesPage] = useState(1);

  const [selectedNote, setSelectedNote] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");


  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSelectedNote(null);
    setTempTitle("");
    setTempDescription("");
  };

  const handleShow = () => setShow(true);

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
        } else {
          getNotes();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notesPage]);


  const updateNote = async () => {
    const req = await fetch(`http://localhost:1337/api/note/${selectedNote._id}`, {
      method: "PATCH",
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
      handleClose();
      await getNotes();
      alert("Updated note successfully");
    } else {
      alert(data.error);
    }
  };

  const getNotes = async () => {
    const req = await fetch(
      `http://localhost:1337/api/notes?limitTo=${MAX_NOTES_PER_PAGE}&skip=${(notesPage - 1) * MAX_NOTES_PER_PAGE
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );

    const response = await req.json();
    if (response.status === "ok") {
      setNotesCount(response.metadata.total);
      setNotes([...response.data]);
    } else {
      alert(response.error);
    }
  };

  const deleteNote = async (noteId) => {
    const req = await fetch(`http://localhost:1337/api/note/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setNotesPage(1);
      getNotes();
    } else {
      alert(data.error);
    }
  };


  const showEditNotePopup = async (note) => {
    setSelectedNote(note);
    setTempTitle(note.title);
    setTempDescription(note.description);
    handleShow();
  };

  return (
    <Container className="mt-4" fluid>
      <h2 className="mb-4">View Notes</h2>
      <Table striped="columns" bordered hover>
        <thead>
          <tr>
            {["#", "Title", "Description", ""].map((key) => {
              return <th>{key}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note._id}>
              <td>{note._id}</td>
              <td>{note.title}</td>
              <td>{note.description}</td>
              <td className="d-flex justify-context-center">
                <span>
                  <button type="button" onClick={() => showEditNotePopup(note)} className="btn btn-warning btn-sm mr-2">Edit</button>
                </span>
                <span>
                  <button type="button" onClick={() => deleteNote(note._id)} className="btn btn-danger btn-sm">Delete</button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div>
        {notesCount > MAX_NOTES_PER_PAGE &&
          <Pagination size="sm" className="d-flex">
            <Pagination.First activeLabel="" onClick={() => setNotesPage(1)} />
            {
              Array(Math.ceil(notesCount / MAX_NOTES_PER_PAGE))
                .fill()
                .map((x, i) => (
                  <PageItem key={i + 1} activeLabel="" onClick={() => setNotesPage(i + 1)} active={(i + 1) === notesPage}>
                    {i + 1}
                  </PageItem>
                ))
            }
            <Pagination.Last activeLabel="" onClick={() => setNotesPage(Math.ceil(notesCount / MAX_NOTES_PER_PAGE))} />
          </Pagination>
        }
      </div>

      {selectedNote && <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={updateNote}>
            Update
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>}
    </Container >
  );
};

export default ViewNotes;
