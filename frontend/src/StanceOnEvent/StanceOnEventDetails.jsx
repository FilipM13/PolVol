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

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!stance) return null;

  return (
    <Panel>
      <H>Stance On Event Details</H>
      <div><strong>ID:</strong> {stance.id}</div>
      <div><strong>Event ID:</strong> {stance.event_id}</div>
      <div><strong>Person ID:</strong> {stance.person_id}</div>
      <div><strong>Date:</strong> {stance.date}</div>
      <H>Spectrum Scores</H>
      <ul>
        {stance.scores && stance.scores.map((score, idx) => (
          <li key={idx}>
            Spectrum ID: {score.spectrum_id}, Value: {score.value}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
