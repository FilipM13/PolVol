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
  const [pics, setPics] = useState({});

  async function get_picture(pid) {
    var data = await fetch(`${API_ROOT}/persons/picture/${pid}`);
    var blob = await data.blob();
    if (blob.size > 0) {
      var url = URL.createObjectURL(blob);
    } else {
      var url = null;
    }
    setPics((prev) => ({ ...prev, [pid]: url }));
  }
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
  useEffect(() => {
    fetchPersons();
  }, []);
  useEffect(() => {
    for (let i = 0; i < persons.length; i++) {
      const person = persons[i];
      get_picture(person.id);
    }
  }, [persons]);

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
            {pics[p.id] ? (
              <img
                src={pics[p.id]}
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
            <H level={2}>
              {p.first_name} {p.middle_name && p.middle_name} {p.last_name}
            </H>
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
