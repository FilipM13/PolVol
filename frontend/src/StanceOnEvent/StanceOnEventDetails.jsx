import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import styles from "./StanceOnEvent.module.css";

export default function StanceOnEventDetails({ stanceId }) {
  const [stance, setStance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStance() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/stances/${stanceId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setStance(data);
      } catch (err) {
        setError(err.message || "Failed to fetch stance");
      } finally {
        setLoading(false);
      }
    }
    fetchStance();
  }, [stanceId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!stance) return null;

  return (
    <div className={styles.stanceTile}>
      <h2 className={styles.stanceTitle} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Stance On Event Details</h2>
      <div className={styles.stanceId}><strong>ID:</strong> {stance.id}</div>
      <div className={styles.stanceId}><strong>Event ID:</strong> {stance.event_id}</div>
      <div className={styles.stanceId}><strong>Person ID:</strong> {stance.person_id}</div>
      <div className={styles.stanceId}><strong>Date:</strong> {stance.date}</div>
      <h4 style={{ marginTop: '1.2rem', color: '#a259ff' }}>Spectrum Scores</h4>
      <ul className={styles.stanceScores}>
        {stance.scores && stance.scores.map((score, idx) => (
          <li key={idx}>
            Spectrum ID: {score.spectrum_id}, Value: {score.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
