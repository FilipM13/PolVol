import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../apiConfig";
import Panel from "../shared/Panel";
import H from "../shared/H";
import Loading from "../shared/Loading";
import Error from "../shared/Error";

export default function SpectrumDetails({ spectrumId }) {
  const [spectrum, setSpectrum] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSpectrumAndScores() {
      setLoading(true);
      setError("");
      try {
        const [spectrumRes, scoresRes] = await Promise.all([
          fetch(`${API_ROOT}/spectra/${spectrumId}`),
          fetch(`${API_ROOT}/spectra/${spectrumId}/average_scores`),
        ]);
        if (!spectrumRes.ok) throw new Error(await spectrumRes.text());
        if (!scoresRes.ok) throw new Error(await scoresRes.text());
        const spectrumData = await spectrumRes.json();
        const scoresData = await scoresRes.json();
        setSpectrum(spectrumData);
        setScores(scoresData);
      } catch (err) {
        setError(err.message || "Failed to fetch spectrum or scores");
      } finally {
        setLoading(false);
      }
    }
    fetchSpectrumAndScores();
  }, [spectrumId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!spectrum) return null;

  return (
    <Panel>
      <H>{spectrum.name}</H>
      <H level={2}>Details</H>
      <div>
        <strong>Name:</strong> {spectrum.name}
      </div>
      <div>
        <strong>Description:</strong> {spectrum.description}
      </div>
      <div>
        <strong>Left Label:</strong> {spectrum.left_label}
      </div>
      <div>
        <strong>Middle Label:</strong> {spectrum.middle_label}
      </div>
      <div>
        <strong>Right Label:</strong> {spectrum.right_label}
      </div>
      <div>
        <strong>ID:</strong> {spectrum.id}
      </div>
      <H level={2}>Scores</H>
      {scores && (
        <ul>
          <li>
            <strong>Mean:</strong> {scores.mean_value}
          </li>
          <li>
            <strong>Stdev:</strong> {scores.stdev_value}
          </li>
          <li>
            <strong>Count:</strong> {scores.count}
          </li>
        </ul>
      )}
    </Panel>
  );
}
