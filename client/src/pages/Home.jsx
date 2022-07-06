import jwt from "jsonwebtoken";
import React, { useEffect } from "react";

import { useHistory } from 'react-router-dom';
import Container from "react-bootstrap/Container";


const Home = () => {
  const history = useHistory();

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
        history.push("/dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Home</h2>
    </Container>
  );
};

export default Home;
