import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import Panel from "../shared/Panel";
import H from "../shared/H";
import Tile from "../shared/Tile";
import Grid from "../shared/Grid";
import Loading from "../shared/Loading";
import Error from "../shared/Error";

function PersonScores({ personId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_ROOT}/persons/${personId}/average_spectra_scores`
        );
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
  if (!scores || scores.length === 0)
    return <div>No spectra data available for this person.</div>;

  return (
    <Grid>
      {scores.map((score, indx) => (
        <Tile key={indx}>
          <H level={2}>{score.spectrum}</H>
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!person) return null;

  return (
    <Panel>
      <H>Person Details</H>
      <div>
        <strong>Name:</strong> {person.name}
      </div>
      <div>
        <strong>ID:</strong> {person.id}
      </div>
      <PersonScores personId={personId} />
    </Panel>
  );
}
