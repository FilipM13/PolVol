import React, { useState } from "react";
import { API_ROOT } from "../../apiConfig";
import styles from "./Spectrum.module.css";
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

  if (loading) return <div className={styles.spectrumForm}>Loading...</div>;
  return (
    <div className={styles.spectrumForm}>
      <h2 className={styles.spectrumDetailsTitle}>Create Spectrum</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.spectrumFormInput}
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <button className={styles.spectrumFormButton} type="submit" disabled={loading}>Create</button>
      </form>
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: "1rem" }}>{success}</div>}
    </div>
  );
}
