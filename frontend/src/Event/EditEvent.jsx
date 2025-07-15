import React, { useState, useEffect } from "react";
import { API_ROOT } from "../../apiConfig";
import Button from "../shared/Button";
import Form from "../shared/Form";
import H from "../shared/H";
import Loading from "../shared/Loading";
import Error from "../shared/Error";
import Success from "../shared/Success";

export default function EditEvent({ eventId }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/events/${eventId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setForm({ name: data.name || "", date: data.date || "" });
      } catch (err) {
        setError(err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

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
      const res = await fetch(`${API_ROOT}/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Event updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><Loading /></div>;
  if (error) return <div style={{ color: "red" }}>{<Error message={error} />}</div>;
  if (!form) return null;

  return (
    <>
      <Form onSubmit={handleSubmit}>
      <H>Edit Event</H>
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Name"
          required
          style={{
            padding: '0.7rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #e0d7fa',
            fontSize: '1.1rem'
          }}
        />
        <input
          name="date"
          value={form.date || ""}
          onChange={handleChange}
          type="date"
          placeholder="Date"
          required
          style={{
            padding: '0.7rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #e0d7fa',
            fontSize: '1.1rem'
          }}
        />
        <Button type="submit">Update</Button>
      </Form>
      {error && <div style={{ color: "red", marginTop: '1rem' }}><Error message={error}/></div>}
      {success && <div style={{ color: "green", marginTop: '1rem' }}><Success message={success}/></div>}
    </>
  );
}
