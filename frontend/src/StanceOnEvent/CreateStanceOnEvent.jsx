import React, { useState } from "react";
import { API_ROOT } from "../../apiConfig";
import Form from "../shared/Form";
import H from "../shared/H";
import Error from "../shared/Error";
import Success from "../shared/Success";
import Button from "../shared/Button";
import Loading from "../shared/Loading";

const initialState = {
  event_id: "",
  person_id: "",
  date: "",
  scores: [],
};

export default function CreateStanceOnEvent() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [persons, setPersons] = useState([]);
  const [personsLoading, setPersonsLoading] = useState(false);
  const [personsError, setPersonsError] = useState("");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");
  const [spectra, setSpectra] = useState([]);
  const [spectraLoading, setSpectraLoading] = useState(false);
  const [spectraError, setSpectraError] = useState("");

  React.useEffect(() => {
    async function fetchPersons() {
      setPersonsLoading(true);
      setPersonsError("");
      try {
        const res = await fetch(`${API_ROOT}/persons`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setPersons(data);
      } catch (err) {
        setPersonsError(err.message || "Failed to fetch persons");
      } finally {
        setPersonsLoading(false);
      }
    }
    async function fetchEvents() {
      setEventsLoading(true);
      setEventsError("");
      try {
        const res = await fetch(`${API_ROOT}/events`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setEventsError(err.message || "Failed to fetch events");
      } finally {
        setEventsLoading(false);
      }
    }
    async function fetchSpectra() {
      setSpectraLoading(true);
      setSpectraError("");
      try {
        const res = await fetch(`${API_ROOT}/spectra`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSpectra(data);
      } catch (err) {
        setSpectraError(err.message || "Failed to fetch spectra");
      } finally {
        setSpectraLoading(false);
      }
    }
    fetchPersons();
    fetchEvents();
    fetchSpectra();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // For scores, you may want to add a UI for adding/removing spectrum scores
  // Here is a simple way to add one score
  const handleAddScore = () => {
    setForm((prev) => ({
      ...prev,
      scores: [...prev.scores, { spectrum_id: "", value: "" }],
    }));
  };

  const handleScoreChange = (idx, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const scores = [...prev.scores];
      scores[idx][name] = value;
      return { ...prev, scores };
    });
  };

  const handleRemoveScore = (idx) => {
    setForm((prev) => {
      const scores = [...prev.scores];
      scores.splice(idx, 1);
      return { ...prev, scores };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Prepare payload
    const payload = { ...form };
    payload.scores = payload.scores.map((s) => ({
      ...s,
      value: parseFloat(s.value),
    }));
    try {
      const res = await fetch(`${API_ROOT}/stances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Stance created successfully!");
      setForm(initialState);
    } catch (err) {
      setError(err.message || "Failed to create stance");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <H>Create Stance On Event</H>
        <select
          name="event_id"
          value={form.event_id}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
          }}
        >
          <option value="" disabled>
            {eventsLoading ? "Loading events..." : "Select Event"}
          </option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.date})
            </option>
          ))}
        </select>
        {eventsError && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {eventsError}
          </div>
        )}
        <select
          name="person_id"
          value={form.person_id}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
            width: "100%",
          }}
        >
          <option value="" disabled>
            {personsLoading ? "Loading persons..." : "Select Person"}
          </option>
          {persons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (ID: {p.id})
            </option>
          ))}
        </select>
        {personsError && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {personsError}
          </div>
        )}
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          type="date"
          placeholder="Date"
          required
          style={{
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
          }}
        />
        <H>Spectrum Scores</H>
        {form.scores.map((score, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "0.5rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <select
              name="spectrum_id"
              value={score.spectrum_id}
              onChange={(e) => handleScoreChange(idx, e)}
              required
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #e0d7fa",
              }}
            >
              <option value="" disabled>
                {spectraLoading ? "Loading spectra..." : "Select Spectrum"}
              </option>
              {spectra.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {spectraError && (
              <div style={{ color: "red", marginBottom: "1rem" }}>
                {spectraError}
              </div>
            )}
            <input
              name="value"
              value={score.value}
              onChange={(e) => handleScoreChange(idx, e)}
              placeholder="Value (-50 to 50)"
              type="number"
              min="-50"
              max="50"
              required
              style={{
                width: "110px",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #e0d7fa",
              }}
            />
            <Button type="button" onClick={() => handleRemoveScore(idx)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={handleAddScore}>
          Add Score
        </Button>
        <br />
        <br />
        <Button type="submit">Create</Button>
      </Form>
      {error && <Error message={error} />}
      {success && <Success message={success} />}
    </>
  );
}
