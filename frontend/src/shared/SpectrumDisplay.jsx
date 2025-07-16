import H from "./H";
import styles from "./shared.module.css";

export default function SpectrumDisplay({ spectrum, value }) {
  if (!spectrum) return null;

  return (
    <div className={styles.SpectrumDisplay}>
      <H level={3}>{spectrum.name}</H>
      <div>
        <input
          type="range"
          min={-50}
          max={50}
          value={value}
          style={{ width: "100%", marginTop: "1rem" }}
          disabled
        />
        <span
          style={{
            position: "absolute",
            left: `${((value + 50) / 100) * 100}%`,
            top: "-1.2rem",
            transform: "translateX(-50%)",
            background: "#eceaf6",
            color: "#4b3f72",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "0.95rem",
            boxShadow: "0 1px 4px rgba(80,60,120,0.07)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
