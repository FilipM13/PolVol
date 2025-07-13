import React, { useState, useEffect } from "react";
import { API_ROOT } from "../../apiConfig";
import styles from "./Spectrum.module.css";

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
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Spectrum updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update spectrum");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.spectrumForm}>Loading...</div>;
  if (error) return <div className={styles.spectrumForm} style={{ color: "red" }}>{error}</div>;
  if (!form) return null;

  return (
    <div className={styles.spectrumForm}>
      <h2 className={styles.spectrumDetailsTitle}>Edit Spectrum</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.spectrumFormInput}
          id="name"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <button className={styles.spectrumFormButton} type="submit" disabled={loading}>Update</button>
      </form>
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: "1rem" }}>{success}</div>}
    </div>
  );
}
