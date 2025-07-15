import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import H from "../shared/H";
import Loading from "../shared/Loading";
import Error from "../shared/Error";
import Button from "../shared/Button";
import Link from "../shared/Link";
import Grid from "../shared/Grid";
import Tile from "../shared/Tile";

export default function SpectrumList() {
  const [spectra, setSpectra] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSpectra() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/spectra`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSpectra(data);
      } catch (err) {
        setError(err.message || "Failed to fetch spectra");
      } finally {
        setLoading(false);
      }
    }
    fetchSpectra();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this spectrum?")) return;
    try {
      const res = await fetch(`${API_ROOT}/spectra/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setSpectra((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete spectrum");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <H>Spectra</H>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/create-spectrum">Create Spectrum</Link>
      </div>
      <Grid>
        {spectra.map((s) => (
          <Tile key={s.id}>
            <H>{s.name}</H>
            <div style={{gap: '1rem', display: 'flex'}}>
              <Link to={`/spectrum/${s.id}`}>Details</Link>
              <Link to={`/edit-spectrum/${s.id}`}>Edit</Link>
              <Button onClick={() => handleDelete(s.id)}>Delete</Button>
            </div>
          </Tile>
        ))}
      </Grid>
    </div>
  );
}
