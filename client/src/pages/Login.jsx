import jwt from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (user) {
        if(user.status === 0) {
          history.push("/profile");
        } else {
          history.push('/dashboard');
        }
      }
    }
  }, [history]);

  const loginUser = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:1337/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if(data.user) {
      localStorage.setItem('token', data.user);
      history.push('/dashboard');
    } else {
      alert('Please check your username and password')
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={loginUser}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
