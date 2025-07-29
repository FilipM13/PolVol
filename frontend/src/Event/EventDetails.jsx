import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import Panel from "../shared/Panel";
import H from "../shared/H";
import Loading from "../shared/Loading";
import Error from "../shared/Error";

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

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!event) return null;

  return (
    <Panel>
      <H>{event.name}</H>
      <H level={2}>Details</H>
      <div>
        <strong>Name:</strong> {event.name}
      </div>
      <div>
        <strong>Date:</strong> {event.date}
      </div>
      <div>
        <strong>Description:</strong> {event.description}
      </div>
      <div>
        <strong>ID:</strong> {event.id}
      </div>
    </Panel>
  );
}
