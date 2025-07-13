import React, { useState, useEffect } from "react";
import { API_ROOT } from "../../apiConfig";
import styles from "./Person.module.css";

export default function EditPerson({ personId }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchPerson() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/persons/${personId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setForm({ name: data.name || "" });
      } catch (err) {
        setError(err.message || "Failed to fetch person");
      } finally {
        setLoading(false);
      }
    }
    fetchPerson();
  }, [personId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const payload = { ...form };
    try {
      const res = await fetch(`${API_ROOT}/persons/${personId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Person updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update person");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!form) return null;

  return (
    <div className={styles.personTile} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2 className={styles.personName} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Edit Person</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading} className={styles.personActionLink} style={{ width: '100%' }}>Update</button>
      </form>
      {error && <div style={{ color: "red", marginTop: '1rem' }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: '1rem' }}>{success}</div>}
    </div>
  );
}
