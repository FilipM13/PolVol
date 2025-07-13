import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_ROOT } from "../../apiConfig";
import styles from "./Event.module.css";
export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/events`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_ROOT}/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete event");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2 style={{ color: '#a259ff', textAlign: 'center', marginBottom: '2rem' }}>Events</h2>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/create-event" className={styles.eventActionLink}>Create New Event</Link>
      </div>
      <div className={styles.eventTileGrid}>
        {events.map((e) => (
          <div key={e.id} className={styles.eventTile}>
            <div className={styles.eventTileHeader}>
              <span className={styles.eventTileName}>{e.name}</span><br/>
              <span className={styles.eventTileDate}>({e.date})</span>
            </div>
            <div className={styles.eventActions}>
              <Link to={`/edit-event/${e.id}`} className={styles.eventActionLink}>Edit</Link>
              <Link to={`/event/${e.id}`} className={styles.eventActionLink}>Details</Link>
              <button className={styles.eventActionLink} onClick={() => handleDelete(e.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
