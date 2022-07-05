import jwt from "jsonwebtoken";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const history = useHistory();
  const [notes, setNotes] = useState([]);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");

  const logoutUser = () => {
    localStorage.removeItem("token");
    history.replace("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        logoutUser();
      } else {
        getNotes();
      }
    }
  }, [history, logoutUser]);

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
      await getNotes();
      setTempTitle("");
      setTempDescription("");
    } else {
      alert(data.error);
    }
  };

  const updateNote = async (noteId) => {
    const req = await fetch(`http://localhost:1337/api/note/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title: "112",
        description: "113",
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      getNotes();
    } else {
      alert(data.error);
    }
  };

  const getNotes = async () => {
    const req = await fetch("http://localhost:1337/api/notes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      }
    });

    const data = await req.json();
    if (data.status === "ok") {
      setNotes([...data.notes]);
    } else {
      alert(data.error);
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
      setNotes([]);
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <div>
        {notes.map((note) => (
          <div key={note._id}>
            <span>{note.title + " - "}</span>
            <span>{note.description}</span>
            <span>
              <input
                type="button"
                onClick={() => deleteNote(note._id)}
                value="Delete note"
              ></input>
            </span>
            <span>
              <input
                type="button"
                onClick={() => updateNote(note._id)}
                value="Update note"
              ></input>
            </span>
          </div>
        ))}
      </div>
      <input
        type="button"
        onClick={() => logoutUser()}
        value="logout"
      ></input>
        
        <div>
        <input
          type="text"
          placeholder="Notes Title"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes Description"
          value={tempDescription}
          onChange={(e) => setTempDescription(e.target.value)}
        />
        <input type="button" value="Create note" onClick={createNote} />
        </div>
        
      
    </div>
  );
};

export default Dashboard;
