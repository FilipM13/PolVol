import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import H from "../shared/H";
import Loading from "../shared/Loading";
import Error from "../shared/Error";
import Button from "../shared/Button";
import Link from "../shared/Link";
import Grid from "../shared/Grid";
import Tile from "../shared/Tile";
import SpectrumDisplay from "../shared/SpectrumDisplay";

export default function StanceOnEventList() {
  const [stances, setStances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [persons, setPersons] = useState([]);
  const [events, setEvents] = useState([]);
  const [spectrums, setSpectrums] = useState([]);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const [stancesRes, personsRes, eventsRes, spectrumsRes] =
          await Promise.all([
            fetch(`${API_ROOT}/stances`),
            fetch(`${API_ROOT}/persons`),
            fetch(`${API_ROOT}/events`),
            fetch(`${API_ROOT}/spectra`),
          ]);
        if (!stancesRes.ok) throw new Error(await stancesRes.text());
        if (!personsRes.ok) throw new Error(await personsRes.text());
        if (!eventsRes.ok) throw new Error(await eventsRes.text());
        if (!spectrumsRes.ok) throw new Error(await spectrumsRes.text());
        const stancesData = await stancesRes.json();
        const personsData = await personsRes.json();
        const eventsData = await eventsRes.json();
        const spectrumsData = await spectrumsRes.json();
        setStances(stancesData);
        setPersons(personsData);
        setEvents(eventsData);
        setSpectrums(spectrumsData);
      } catch (err) {
        setError(
          err.message || "Failed to fetch stances/persons/events/spectrums"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stance?")) return;
    try {
      const res = await fetch(`${API_ROOT}/stances/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setStances((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete stance");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <H>Stances On Event</H>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/create-stance">Create New Stance</Link>
      </div>
      <Grid>
        {stances.map((s) => {
          const person = persons.find((p) => p.id === s.person_id);
          const event = events.find((e) => e.id === s.event_id);
          return (
            <Tile key={s.id}>
              <span>
                <small>DATE: {s.date}</small>
                <br />
                Person: {person ? person.name : s.person_id}
                <br />
                Event: {event ? `${event.name} (${event.date})` : s.event_id}
                <br />
                <ul>
                  {s.scores &&
                    s.scores.map((score, idx) => {
                      const spectrum = spectrums.find(
                        (sp) => sp.id === score.spectrum_id
                      );
                      return (
                        <SpectrumDisplay
                          key={idx}
                          spectrum={spectrum}
                          value={score.value}
                        />
                      );
                    })}
                </ul>
              </span>
              <div style={{ gap: "1rem", display: "flex" }}>
                <Link to={`/edit-stance/${s.id}`}>Edit</Link>
                <Link to={`/stance/${s.id}`}>Details</Link>
                <Button onClick={() => handleDelete(s.id)}>Delete</Button>
              </div>
            </Tile>
          );
        })}
      </Grid>
    </div>
  );
}
