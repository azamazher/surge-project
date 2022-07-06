import jwt from "jsonwebtoken";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const MAX_NOTES_PER_PAGE = 2;
  const history = useHistory();
  const [notes, setNotes] = useState([]);
  const [notesCount, setNotesCount] = useState(0);
  const [notesPage, setNotesPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);

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
        if (user.status === 0) {
          history.push("/profile");
        } else {
          getNotes();
          getUsers();
        }
      }
    }
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
      await getNotes();
    } else {
      alert(data.error);
    }
  };

  const getNotes = async () => {
    const req = await fetch(
      `http://localhost:1337/api/notes?limitTo=${MAX_NOTES_PER_PAGE}&skip=${
        (notesPage - 1) * MAX_NOTES_PER_PAGE
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

  const getUsers = async () => {
    const req = await fetch(
      `http://localhost:1337/api/users?limitTo=${MAX_NOTES_PER_PAGE}&skip=${
        (usersPage - 1) * MAX_NOTES_PER_PAGE
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
      setUsersCount(response.metadata.total);
      setUsers([...response.data]);
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
      setNotes([]);
    } else {
      alert(data.error);
    }
  };

  const showUserDetailsPopup = async (user) => {
    alert(JSON.stringify(user));
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
      {notesCount > MAX_NOTES_PER_PAGE && (
        <div>
          {Array(Math.ceil(notesCount / MAX_NOTES_PER_PAGE))
            .fill()
            .map((x, i) => (
              <input
                key={i + 1}
                type="button"
                onClick={() => setNotesPage(i + 1)}
                value={i + 1}
              />
            ))}
        </div>
      )}
      <input type="button" onClick={() => logoutUser()} value="logout"></input>

      <div className="">
        <div>
          {users.map((user) => (
            <div key={user._id}>
              <span>{user.firstName + " - "}</span>
              <span>{user.lastName}</span>
              <span>
                <input
                  type="button"
                  onClick={() => showUserDetailsPopup(user)}
                  value="Show popup"
                ></input>
              </span>
            </div>
          ))}
        </div>
        {usersCount > MAX_NOTES_PER_PAGE && (
          <div>
            {Array(Math.ceil(usersCount / MAX_NOTES_PER_PAGE))
              .fill()
              .map((x, i) => (
                <input
                  key={i + 1}
                  type="button"
                  onClick={() => setUsersPage(i + 1)}
                  value={i + 1}
                />
              ))}
          </div>
        )}
      </div>

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
