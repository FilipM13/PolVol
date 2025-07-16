import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import H from "../shared/H";
import Loading from "../shared/Loading";
import Error from "../shared/Error";
import Button from "../shared/Button";
import Link from "../shared/Link";
import Tile from "../shared/Tile";
import Grid from "../shared/Grid";

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

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <H>Events</H>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/create-event">Create New Event</Link>
      </div>
      <Grid>
        {events.map((e) => (
          <Tile key={e.id}>
            <H level={2}>{e.name}</H>
            <div>({e.date})</div>
            <div style={{ gap: "1rem", display: "flex" }}>
              <Link to={`/edit-event/${e.id}`}>Edit</Link>
              <Link to={`/event/${e.id}`}>Details</Link>
              <Button onClick={() => handleDelete(e.id)}>Delete</Button>
            </div>
          </Tile>
        ))}
      </Grid>
    </div>
  );
}
