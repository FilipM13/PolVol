import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import styles from "./Event.module.css";
export default function EventDetails({ eventId }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/events/${eventId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!event) return null;

  return (
    <div className={styles.eventTile}>
      <h2 className={styles.eventTitle} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Event Details</h2>
      <div className={styles.eventId}><strong>Name:</strong> {event.name}</div>
      <div className={styles.eventId}><strong>Date:</strong> {event.date}</div>
      <div className={styles.eventId}><strong>ID:</strong> {event.id}</div>
    </div>
  );
}
