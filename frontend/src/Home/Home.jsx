import { Link } from "react-router-dom";
import styles from "./Home.module.css";
function Home() {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.heading}>Welcome to PolVol</h1>
      <h3>Measuring Political Volatility</h3>
      <p className={styles.intro}>
        Opinions of public figures can change rapidly and be dishonest depending on the public's preference.
        PolVol is a platform that allows you to track these changes and see how public figures change their opinions on various topics and events.
        We strive to provide a transparent and open platform for everyone to see how public figures evolve in their views and how volatile their opinions are.
        We hope to help you make informed decisions based on these objective information.
      </p>
      <div className={styles.cardGrid}>
        <Link to="/persons" style={{ textDecoration: "none" }}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Browse People</h2>
            <p className={styles.cardDesc}>See how people change their view on topics and events...</p>
          </div>
        </Link>
        <Link to="/events" style={{ textDecoration: "none" }}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Browse Events</h2>
            <p className={styles.cardDesc}>Stay on top of what's happening around the world...</p>
          </div>
        </Link>
        <Link to="/spectra" style={{ textDecoration: "none" }}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Browse Spectra</h2>
            <p className={styles.cardDesc}>Check what spectra in people's opinions do we measure...</p>
          </div>
        </Link>
        <Link to="/stances" style={{ textDecoration: "none" }}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Browse People's Opinions</h2>
            <p className={styles.cardDesc}>Dive deep and get to know people's opinions...</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;