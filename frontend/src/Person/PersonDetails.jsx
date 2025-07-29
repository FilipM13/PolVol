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
          `${API_ROOT}/persons/${personId}/average_spectra_scores`,
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
  const [pic, setPic] = useState(null);

  useEffect(() => {
    async function get_picture(pid) {
      var data = await fetch(`${API_ROOT}/persons/picture/${pid}`);
      var blob = await data.blob();
      if (blob.size > 0) {
        var url = URL.createObjectURL(blob);
      } else {
        var url = null;
      }
      setPic((prev) => url);
    }
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
    get_picture(personId);
  }, [personId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!person) return null;

  return (
    <Panel>
      <H>Person Details</H>
      {pic ? (
        <img
          src={pic}
          alt="picture"
          height={80}
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "1.2rem",
          }}
        />
      ) : (
        <div
          style={{
            height: 80,
            width: 80,
            background: "var(--bg1)",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "1.2rem",
          }}
        />
      )}
      <div>
        <strong>First Name:</strong> {person.first_name}
      </div>
      <div>
        <strong>Middle Name:</strong> {person.middle_name}
      </div>
      <div>
        <strong>Last Name:</strong> {person.last_name}
      </div>
      <div>
        <strong>Description:</strong> {person.description_md}
      </div>
      <div>
        <strong>Date of Birth:</strong> {person.date_of_birth}
      </div>
      <div>
        <strong>ID:</strong> {person.id}
      </div>
      <PersonScores personId={personId} />
    </Panel>
  );
}
