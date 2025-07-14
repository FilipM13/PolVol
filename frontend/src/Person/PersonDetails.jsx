import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import Panel from "../shared/Panel";
import Header from "../shared/Header";
import Tile from "../shared/Tile";
import Grid from "../shared/Grid";

function PersonScores({ personId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/persons/${personId}/average_spectra_scores`);
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
    <Grid>
      {scores.map((score, indx) => (
        <Tile key={indx}>
          <Header>{score.spectrum}</Header>
          <div>Mean: {score.mean_value}</div>
          <div>Volatility: {score.stdev_value}</div>
          <div>Number of datapoints: {score.count}</div>
        </Tile>
      ))}
    </Grid>
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
    <Panel>
      <Header>Person Details</Header>
      <div><strong>Name:</strong> {person.name}</div>
      <div><strong>ID:</strong> {person.id}</div>
      <PersonScores personId={personId}/>
    </Panel>
  );
}
