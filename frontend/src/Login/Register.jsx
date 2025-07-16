import Form from "../shared/Form";
import H from "../shared/H";
import Button from "../shared/Button";
import { useState } from "react";
import { API_ROOT } from "../../apiConfig";
import Loading from "../shared/Loading";
import Error from "../shared/Error";
import Success from "../shared/Success";

const initialState = {
  event_id: "",
  person_id: "",
  date: "",
  scores: [],
};

const authorizations = ["guest", "data_provider", "data_analyst", "admin"];

function Register() {
  const [authorization, setAuthorization] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    const res = await fetch(`${API_ROOT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      // Handle successful registration, e.g., redirect to login
      setLoading(false);
      setSuccess("Registration Successful");
      window.location.href = "/login";
    } else {
      // Handle errors, e.g., show an error message
      setLoading(false);
      setError("Registration Failed");
      console.error("Registration failed");
    }
  };

  const showPassword = () => {
    setPasswordShow((prev) => !prev);
  };

  if (loading) return <Loading />;
  return (
    <Form onSubmit={handleSubmit}>
      <H level={2}>Register</H>

      <input
        placeholder="Username"
        name="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        placeholder="Password"
        name="password"
        type={passwordShow ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          borderColor: password ? "green" : "red",
        }}
      />
      <input
        style={{
          borderColor:
            password && repeatPassword === password ? "green" : "red",
        }}
        placeholder="Repeat Password"
        type={passwordShow ? "text" : "password"}
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        required
      />
      <input type="checkbox" checked={passwordShow} onChange={showPassword} />
      <select
        name="authorization"
        value={authorization}
        onChange={(e) => setAuthorization((a) => e.target.value)}
        required
      >
        <option value="" disabled>
          Select Authorization Level
        </option>
        {authorizations.map((a, indx) => (
          <option key={indx} value={a}>
            {a}
          </option>
        ))}
      </select>
      <Button type="submit" disabled={password && password !== repeatPassword}>
        {loading ? "Logging in..." : "Register"}
      </Button>
      {error && <Error message={error} />}
      {success && <Success message={success} />}
    </Form>
  );
}

export default Register;
