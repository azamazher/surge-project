import jwt from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import PageItem from 'react-bootstrap/PageItem';
import Modal from 'react-bootstrap/Modal';


const ViewUsers = () => {
  const MAX_USERS_PER_PAGE = 2;
  const history = useHistory();
  const [usersPage, setUsersPage] = useState(1);
 const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);


  const [show, setShow] = useState(false);

  const handleClose = () => { setShow(false); setSelectedUser(null); };
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
          getUsers();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersPage]);

  const getUsers = async () => {
    const req = await fetch(
      `http://localhost:1337/api/users?limitTo=${MAX_USERS_PER_PAGE}&skip=${(usersPage - 1) * MAX_USERS_PER_PAGE
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

  const showUserDetailsPopup = async (user) => {
    setSelectedUser(user);
    handleShow();
  };

  const fromCamelCaseToTitleCase = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  return (
    <Container className="mt-4" fluid>
      <h2 className="mb-4">View Users</h2>
      <Table striped="columns" bordered hover>
        <thead>
          <tr>
            {["#", "Firstname", "Account Type", ""].map((key) => {
              return <th>{key}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.firstName}</td>
              <td>{user.accountType}</td>
              <td className="d-flex justify-context-center">
                <span>
                  <button type="button" onClick={() => showUserDetailsPopup(user)} className="btn btn-primary btn-sm">View</button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div>
        {usersCount > MAX_USERS_PER_PAGE &&
          <Pagination size="sm" className="d-flex">
            <Pagination.First activeLabel="" onClick={() => setUsersPage(1)} />
            {
              Array(Math.ceil(usersCount / MAX_USERS_PER_PAGE))
                .fill()
                .map((x, i) => (
                  <PageItem key={i + 1} activeLabel="" onClick={() => setUsersPage(i + 1)} active={(i + 1) === usersPage}>
                    {i + 1}
                  </PageItem>
                ))
            }
            <Pagination.Last activeLabel="" onClick={() => setUsersPage(Math.ceil(usersCount / MAX_USERS_PER_PAGE))} />
          </Pagination>
        }
      </div>

      {selectedUser && <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>View User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            Object.keys(selectedUser).map((key) => {
              return <h6>{`${fromCamelCaseToTitleCase(key)}: ${selectedUser[key]}`}</h6>
            })
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>}
    </Container >
  );
};

export default ViewUsers;
