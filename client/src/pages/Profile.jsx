import jwt from "jsonwebtoken";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useState } from "react";

const Profile = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        logoutUser();
      }
    }
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    history.replace("/login");
  };

  const updateProfileDetails = async () => {
    const req = await fetch(`http://localhost:1337/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        firstName,
        lastName,
        mobile,
        password,
        dateOfBirth,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      history.push('/dashboard');
    } else {
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Firstname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lastname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          name="dateOfBirth"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="new password"
        />
        <input type="submit" value="Update Details" onClick={updateProfileDetails} />
      </div>
    </div>
  );
};

export default Profile;
