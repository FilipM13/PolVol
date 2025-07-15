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
          fetch(`${API_ROOT}/spectra/${spectrumId}/average_scores`)
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

  if (loading) return <Loading />
  if (error) return <Error message={error} />;
  if (!spectrum) return null;

  return (
    <Panel>
      <H>Spectrum Details</H>
      <div><strong>Name:</strong> {spectrum.name}</div>
      <div><strong>ID:</strong> {spectrum.id}</div>
      <H>Average Scores</H>
      {scores && (
        <ul>
          <li><strong>Mean:</strong> {scores.mean_value}</li>
          <li><strong>Stdev:</strong> {scores.stdev_value}</li>
          <li><strong>Count:</strong> {scores.count}</li>
        </ul>
      )}
    </Panel>
  );
}
