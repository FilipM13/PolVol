import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import Panel from "../shared/Panel";
import H from "../shared/H";
import Loading from "../shared/Loading";
import Error from "../shared/Error";

export default function StanceOnEventDetails({ stanceId }) {
  const [stance, setStance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [person, setPerson] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/stances/${stanceId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setStance(data);

        // Fetch person and event details in parallel
        const [personRes, eventRes] = await Promise.all([
          fetch(`${API_ROOT}/persons/${data.person_id}`),
          fetch(`${API_ROOT}/events/${data.event_id}`),
        ]);
        if (!personRes.ok) throw new Error(await personRes.text());
        if (!eventRes.ok) throw new Error(await eventRes.text());
        setPerson(await personRes.json());
        setEvent(await eventRes.json());
      } catch (err) {
        setError(err.message || "Failed to fetch stance/person/event");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [stanceId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!stance || !person || !event) return null;

  return (
    <Panel>
      <H level={2}>Stance On Event Details</H>
      <div>
        <strong>ID:</strong> {stance.id}
      </div>
      <div>
        <strong>Person:</strong> {person.first_name} {person.middle_name}{" "}
        {person.last_name}
      </div>
      <div>
        <strong>Date:</strong> {stance.date}
      </div>
      <div>
        <strong>Event:</strong> {event.name} ({event.date})
      </div>
      <H level={2}>Spectrum Scores</H>
      <ul>
        {stance.scores &&
          stance.scores.map((score, idx) => (
            <li key={idx}>
              Spectrum ID: {score.spectrum_id}, Value: {score.value}
            </li>
          ))}
      </ul>
    </Panel>
  );
}
