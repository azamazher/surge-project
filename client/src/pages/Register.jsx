import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Register = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("");

  const registerUser = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:1337/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        email,
        accountType,
      }),
    });

    const data = await response.json();
    if (data.status === "ok") history.push("/login");
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerUser}>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
          placeholder="Firstname"
        />
        <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <div>
          <label for="accountTypes">Choose a account type:</label>
          <select
            name="accountTypes"
            id="accountTypes"
            onChange={(event) => setAccountType(event.target.value)}
            value={accountType}
          >
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <br />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};
export default Register;
