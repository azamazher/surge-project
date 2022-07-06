import React from "react";

const Spinner = (message = "Loading...") => {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">{message}</span>
    </Spinner>
  );
}

export default Spinner;
