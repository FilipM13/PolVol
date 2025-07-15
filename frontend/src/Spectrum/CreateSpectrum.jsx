import React, { useState } from "react";
import { API_ROOT } from "../../apiConfig";
import H from "../shared/H";
import Form from "../shared/Form";
import Button from "../shared/Button";
import Error from "../shared/Error";
import Success from "../shared/Success";
import Loading from "../shared/Loading";

const initialState = {
  name: ""
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
        body: JSON.stringify(form)
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
        <Button type="submit">Create</Button>
      </Form>
      {error && <Error message={error}/>}
      {success && <Success message={success}/>}
    </>
  );
}
