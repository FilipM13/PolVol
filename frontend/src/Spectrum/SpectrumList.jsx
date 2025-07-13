import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ROOT } from "../../apiConfig";
import styles from "./Spectrum.module.css";

export default function SpectrumList() {
  const [spectra, setSpectra] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSpectra() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/spectra`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSpectra(data);
      } catch (err) {
        setError(err.message || "Failed to fetch spectra");
      } finally {
        setLoading(false);
      }
    }
    fetchSpectra();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this spectrum?")) return;
    try {
      const res = await fetch(`${API_ROOT}/spectra/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setSpectra((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete spectrum");
    }
  };

  if (loading) return <div className={styles.spectrumGrid}>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2 style={{ color: '#a259ff', textAlign: 'center', marginBottom: '2rem' }}>Spectra</h2>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/create-spectrum">
          <button className={styles.spectrumFormButton}>Create Spectrum</button>
        </Link>
      </div>
      <div className={styles.spectrumGrid}>
        {spectra.map((s) => (
          <div key={s.id} className={styles.spectrumTile}>
            <div className={styles.spectrumName}>{s.name}</div>
            <div className={styles.spectrumActions}>
              <Link className={styles.spectrumActionLink} to={`/spectrum/${s.id}`}>Details</Link>
              <Link className={styles.spectrumActionLink} to={`/edit-spectrum/${s.id}`}>Edit</Link>
              <button className={styles.spectrumActionLink} style={{ border: "none" }} onClick={() => handleDelete(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
