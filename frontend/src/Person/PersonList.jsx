import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_ROOT } from "../../apiConfig";
import styles from "./Person.module.css";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this person?")) return;
    try {
      const res = await fetch(`${API_ROOT}/persons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setPersons((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete person");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2 style={{ color: '#a259ff', textAlign: 'center', marginBottom: '2rem' }}>Persons</h2>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/create-person" className={styles.personActionLink}>Create New Person</Link>
      </div>
      <div className={styles.personGrid}>
        {persons.map((p) => (
          <div key={p.id} className={styles.personTile}>
            <div className={styles.personName}>{p.name}</div>
            <div className={styles.personActions}>
              <Link to={`/edit-person/${p.id}`} className={styles.personActionLink}>Edit</Link>
              <Link to={`/person/${p.id}`} className={styles.personActionLink}>Details</Link>
              <button className={styles.personActionLink} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
