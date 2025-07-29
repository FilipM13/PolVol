import React, { useState } from "react";
import { API_ROOT } from "../../apiConfig";
import H from "../shared/H";
import Button from "../shared/Button";
import Form from "../shared/Form";
import Loading from "../shared/Loading";
import Error from "../shared/Error";
import Success from "../shared/Success";

const initialState = {
  name: "",
  date: "",
  description: "",
};

export default function CreateEvent() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_ROOT}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Event created successfully!");
      setForm(initialState);
    } catch (err) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <H>Create Event</H>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          style={{
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
          }}
        />
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          type="date"
          placeholder="Date"
          required
          style={{
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
          }}
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          style={{
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
          }}
        />
        <Button type="submit">Create</Button>
      </Form>
      {error && <Error message={error} />}
      {success && <Success message={success} />}
    </>
  );
}
