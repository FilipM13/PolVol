import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_ROOT } from "../../apiConfig";
import styles from "./StanceOnEvent.module.css";

export default function StanceOnEventList() {
  const [stances, setStances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [persons, setPersons] = useState([]);
  const [events, setEvents] = useState([]);
  const [spectrums, setSpectrums] = useState([]);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const [stancesRes, personsRes, eventsRes, spectrumsRes] = await Promise.all([
          fetch(`${API_ROOT}/stances`),
          fetch(`${API_ROOT}/persons`),
          fetch(`${API_ROOT}/events`),
          fetch(`${API_ROOT}/spectra`)
        ]);
        if (!stancesRes.ok) throw new Error(await stancesRes.text());
        if (!personsRes.ok) throw new Error(await personsRes.text());
        if (!eventsRes.ok) throw new Error(await eventsRes.text());
        if (!spectrumsRes.ok) throw new Error(await spectrumsRes.text());
        const stancesData = await stancesRes.json();
        const personsData = await personsRes.json();
        const eventsData = await eventsRes.json();
        const spectrumsData = await spectrumsRes.json();
        setStances(stancesData);
        setPersons(personsData);
        setEvents(eventsData);
        setSpectrums(spectrumsData);
      } catch (err) {
        setError(err.message || "Failed to fetch stances/persons/events/spectrums");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stance?")) return;
    try {
      const res = await fetch(`${API_ROOT}/stances/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setStances((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete stance");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2 style={{ color: '#a259ff', textAlign: 'center', marginBottom: '2rem' }}>Stances On Event</h2>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/create-stance" className={styles.stanceActionLink}>Create New Stance</Link>
      </div>
      <ul className={styles.stanceList}>
        {stances.map((s) => {
          const person = persons.find(p => p.id === s.person_id);
          const event = events.find(e => e.id === s.event_id);
          return (
            <li key={s.id} className={styles.stanceListItem}>
              <span>
                <small>DATE: {s.date}</small><br/> 
                Person: {person ? person.name : s.person_id}<br/>
                Event: {event ? `${event.name} (${event.date})` : s.event_id}<br/> 
                <ul className={styles.stanceScores}>
                  {s.scores && s.scores.map((score, idx) => {
                    const spectrum = spectrums.find(sp => sp.id === score.spectrum_id);
                    return (
                      <li key={idx}>
                        {spectrum ? spectrum.name : score.spectrum_id}: {score.value}
                      </li>
                    );
                  })}
                </ul>
              </span>
              <span className={styles.stanceListActions}>
                <Link to={`/edit-stance/${s.id}`} className={styles.stanceActionLink}>Edit</Link>
                <Link to={`/stance/${s.id}`} className={styles.stanceActionLink}>Details</Link>
                <button className={styles.stanceActionLink} onClick={() => handleDelete(s.id)}>Delete</button>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
