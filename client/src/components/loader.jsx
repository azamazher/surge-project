import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loader = (message = "Loading...") => {
  return (
    <div className="spinnerwork">

    <Spinner animation="border" role="status">
      <span className="visually-hidden"></span>
    </Spinner>
    </div>
  );
}

export default Loader;
