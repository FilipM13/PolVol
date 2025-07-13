import React, { useState } from "react";
import { API_ROOT } from "../../apiConfig";
import styles from "./Event.module.css";
const initialState = {
  name: "",
  date: ""
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
        body: JSON.stringify(form)
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

  return (
    <div className={styles.eventTile}>
      <h2 className={styles.eventTitle} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
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
          value={form.date}
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
        <button type="submit" disabled={loading} className={styles.eventActionLink} style={{ width: '100%' }}>Create</button>
      </form>
      {error && <div style={{ color: "red", marginTop: '1rem' }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: '1rem' }}>{success}</div>}
    </div>
  );
}
