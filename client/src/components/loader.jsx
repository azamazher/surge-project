import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loader = (message = "Loading...") => {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">{message}</span>
    </Spinner>
  );
}

export default Loader;
