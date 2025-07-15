import React, { useState, useEffect } from "react";
import { API_ROOT } from "../../apiConfig";
import H from "../shared/H";
import Form from "../shared/Form";
import Error from "../shared/Error";
import Success from "../shared/Success";
import Button from "../shared/Button";
import Loading from "../shared/Loading";

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

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!form) return null;

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <H>Edit Person</H>
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
        <Button type="submit">Update</Button>
      </Form>
      {error && <Error message={error}/>}
      {success && <Success message={success}/>}
    </>
  );
}
