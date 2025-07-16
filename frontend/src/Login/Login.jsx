import React, { useState } from "react";
import styles from "../shared/shared.module.css";
import Button from "../shared/Button";
import Error from "../shared/Error";
import Loading from "../shared/Loading";
import Success from "../shared/Success";
import { API_ROOT } from "../../apiConfig";
import Form from "../shared/Form";
import H from "../shared/H";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);
      const res = await fetch(`${API_ROOT}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Login failed");
        throw new Error(data.detail || "Login failed");
      }
      setSuccess("Login successful!");
      console.log(data.token);
      localStorage.setItem("token", data.token);
      if (onLogin) onLogin(data);
      window.location.reload();
    } catch (err) {
      setError(data.detail || "Login failed");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showPassword = () => {
    setPasswordShow((prev) => !prev);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <H level={2}>Login</H>
      <input
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        placeholder="Password"
        type={passwordShow ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input type="checkbox" checked={passwordShow} onChange={showPassword} />
      <Button type="submit">{loading ? "Logging in..." : "Login"}</Button>
      {error && <Error message={error} />}
      {success && <Success message={success} />}
      {loading && <Loading />}
    </Form>
  );
};

export default Login;
