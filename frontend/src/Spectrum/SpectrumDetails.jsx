import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import styles from "./Spectrum.module.css";

export default function SpectrumDetails({ spectrumId }) {
  const [spectrum, setSpectrum] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSpectrumAndScores() {
      setLoading(true);
      setError("");
      try {
        const [spectrumRes, scoresRes] = await Promise.all([
          fetch(`${API_ROOT}/spectra/${spectrumId}`),
          fetch(`${API_ROOT}/spectra/${spectrumId}/average_scores`)
        ]);
        if (!spectrumRes.ok) throw new Error(await spectrumRes.text());
        if (!scoresRes.ok) throw new Error(await scoresRes.text());
        const spectrumData = await spectrumRes.json();
        const scoresData = await scoresRes.json();
        setSpectrum(spectrumData);
        setScores(scoresData);
      } catch (err) {
        setError(err.message || "Failed to fetch spectrum or scores");
      } finally {
        setLoading(false);
      }
    }
    fetchSpectrumAndScores();
  }, [spectrumId]);

  if (loading) return <div className={styles.spectrumDetailsCard}>Loading...</div>;
  if (error) return <div className={styles.spectrumDetailsCard} style={{ color: "red" }}>{error}</div>;
  if (!spectrum) return null;

  return (
    <div className={styles.spectrumDetailsCard}>
      <h2 className={styles.spectrumDetailsTitle}>Spectrum Details</h2>
      <div className={styles.spectrumDetailsText}><strong>Name:</strong> {spectrum.name}</div>
      <div className={styles.spectrumDetailsText}><strong>ID:</strong> {spectrum.id}</div>
      {scores && (
        <div className={styles.spectrumScoresSection}>
          <h3 className={styles.spectrumScoresTitle}>Average Scores</h3>
          <ul className={styles.spectrumScoresList}>
            <li><strong>Mean:</strong> {scores.mean_value}</li>
            <li><strong>Stdev:</strong> {scores.stdev_value}</li>
            <li><strong>Count:</strong> {scores.count}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
