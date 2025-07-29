import React, { useState } from "react";
import { API_ROOT } from "../../apiConfig";
import H from "../shared/H";
import Form from "../shared/Form";
import Button from "../shared/Button";
import Error from "../shared/Error";
import Success from "../shared/Success";
import Loading from "../shared/Loading";

const initialState = {
  name: "",
  description: "",
  left_label: "",
  middle_label: "",
  right_label: "",
};

export default function CreateSpectrum() {
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
      const res = await fetch(`${API_ROOT}/spectra`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Spectrum created successfully!");
      setForm(initialState);
    } catch (err) {
      setError(err.message || "Failed to create spectrum");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <H>Create Spectrum</H>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          id="left_label"
          name="left_label"
          value={form.left_label}
          onChange={handleChange}
          placeholder="Left Label"
          required
        />
        <input
          id="middle_label"
          name="middle_label"
          value={form.middle_label}
          onChange={handleChange}
          placeholder="Middle Label"
        />
        <input
          id="right_label"
          name="right_label"
          value={form.right_label}
          onChange={handleChange}
          placeholder="Right Label"
          required
        />
        <Button type="submit">Create</Button>
      </Form>
      {error && <Error message={error} />}
      {success && <Success message={success} />}
    </>
  );
}
