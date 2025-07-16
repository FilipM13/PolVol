import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import Tile from "../shared/Tile";
import Grid from "../shared/Grid";
import Loading from "../shared/Loading";
import Error from "../shared/Error";
import Button from "../shared/Button";
import Link from "../shared/Link";
import H from "../shared/H";

export default function PersonList() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPersons() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/persons`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setPersons(data);
      } catch (err) {
        setError(err.message || "Failed to fetch persons");
      } finally {
        setLoading(false);
      }
    }
    fetchPersons();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this person?")) return;
    try {
      const res = await fetch(`${API_ROOT}/persons/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setPersons((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete person");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <H>People</H>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/create-person">Create New Person</Link>
      </div>
      <Grid>
        {persons.map((p) => (
          <Tile key={p.id}>
            <H level={2}>{p.name}</H>
            <div style={{ gap: "1rem", display: "flex" }}>
              <Link to={`/edit-person/${p.id}`}>Edit</Link>
              <Link to={`/person/${p.id}`}>Details</Link>
              <Button onClick={() => handleDelete(p.id)}>Delete</Button>
            </div>
          </Tile>
        ))}
      </Grid>
    </div>
  );
}
