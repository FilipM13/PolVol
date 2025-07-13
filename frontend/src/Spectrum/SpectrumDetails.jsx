import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import styles from "./Spectrum.module.css";

export default function SpectrumDetails({ spectrumId }) {
  const [spectrum, setSpectrum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSpectrum() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/spectra/${spectrumId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSpectrum(data);
      } catch (err) {
        setError(err.message || "Failed to fetch spectrum");
      } finally {
        setLoading(false);
      }
    }
    fetchSpectrum();
  }, [spectrumId]);

  if (loading) return <div className={styles.spectrumDetailsCard}>Loading...</div>;
  if (error) return <div className={styles.spectrumDetailsCard} style={{ color: "red" }}>{error}</div>;
  if (!spectrum) return null;

  return (
    <div className={styles.spectrumDetailsCard}>
      <h2 className={styles.spectrumDetailsTitle}>Spectrum Details</h2>
      <div className={styles.spectrumDetailsText}><strong>Name:</strong> {spectrum.name}</div>
      <div className={styles.spectrumDetailsText}><strong>ID:</strong> {spectrum.id}</div>
    </div>
  );
}
