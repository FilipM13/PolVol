import { Link } from "react-router-dom";
import H from "../shared/H";
import Panel from "../shared/Panel";
import Grid from "../shared/Grid";
import Tile from "../shared/Tile";

function Home() {
  return (
    <Panel size={"large"}>
      <H>Welcome to PolVol</H>
      <H>Measuring Political Volatility</H>
      <p style={{textAlign: "center"}}>
        Opinions of public figures can change rapidly and be dishonest depending on the public's preference.
        PolVol is a platform that allows you to track these changes and see how public figures change their opinions on various topics and events.
        We strive to provide a transparent and open platform for everyone to see how public figures evolve in their views and how volatile their opinions are.
        We hope to help you make informed decisions based on these objective information.
      </p>
      <Grid>
        <Link to="/persons" style={{ textDecoration: "none" }}>
          <Panel size="small">
            <H>Browse People</H>
            <p>See how people change their view on topics and events...</p>
          </Panel>
        </Link>
        <Link to="/events" style={{ textDecoration: "none" }}>
          <Panel size="small">
            <H>Browse Events</H>
            <p>Stay on top of what's happening around the world...</p>
          </Panel>
        </Link>
        <Link to="/spectra" style={{ textDecoration: "none" }}>
          <Panel size="small">
            <H>Browse Spectra</H>
            <p>Check what spectra in people's opinions do we measure...</p>
          </Panel>
        </Link>
        <Link to="/stances" style={{ textDecoration: "none" }}>
          <Panel size="small">
            <H>Browse People's Opinions</H>
            <p>Dive deep and get to know people's opinions...</p>
          </Panel>
        </Link>
      </Grid>
    </Panel>
  );
}

export default Home;