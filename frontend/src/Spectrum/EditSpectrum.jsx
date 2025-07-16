import React, { useState, useEffect } from "react";
import { API_ROOT } from "../../apiConfig";
import Form from "../shared/Form";
import H from "../shared/H";
import Button from "../shared/Button";
import Error from "../shared/Error";
import Success from "../shared/Success";
import Loading from "../shared/Loading";

export default function EditSpectrum({ spectrumId }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchSpectrum() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/spectra/${spectrumId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setForm({ name: data.name || "" });
      } catch (err) {
        setError(err.message || "Failed to fetch spectrum");
      } finally {
        setLoading(false);
      }
    }
    fetchSpectrum();
  }, [spectrumId]);

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
      const res = await fetch(`${API_ROOT}/spectra/${spectrumId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Spectrum updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update spectrum");
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
        <H>Edit Spectrum</H>
        <input
          id="name"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <Button type="submit">Update</Button>
      </Form>
      {error && <Error message={error} />}
      {success && <Success message={success} />}
    </>
  );
}
