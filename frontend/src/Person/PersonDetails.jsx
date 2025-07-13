import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import styles from "./Person.module.css";

function PersonScores({ personId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/persons/${personId}/average_spectra`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setScores(data);
      } catch (err) {
        setError(err.message || "Failed to fetch scores");
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, [personId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!scores || scores.length === 0) return <div>No spectra data available for this person.</div>;

  return (
    <div className={styles.scoresList}>
      {scores.map((score, indx) => (
        <div key={indx} className={styles.scoreItem}>
          <h3>{score.spectrum}</h3>
          <span className={styles.scoreMean}>Mean: {score.mean_value}</span><br/>
          <span className={styles.scoreStdev}>Volatility: {score.stdev_value}</span><br/>
          <span className={styles.scoreValues}>Number of datapoints: {score.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function PersonDetails({ personId }) {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPerson() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/persons/${personId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setPerson(data);
      } catch (err) {
        setError(err.message || "Failed to fetch person");
      } finally {
        setLoading(false);
      }
    }
    fetchPerson();
  }, [personId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!person) return null;

  return (
    <div className={styles.personTile} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2 className={styles.personName} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Person Details</h2>
      <div className={styles.personId}><strong>Name:</strong> {person.name}</div>
      <div className={styles.personId}><strong>ID:</strong> {person.id}</div>
      <PersonScores personId={personId}/>
    </div>
  );
}
