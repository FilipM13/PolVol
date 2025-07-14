import { Link } from "react-router-dom";
import Header from "../shared/Header";
import Panel from "../shared/Panel";
import Grid from "../shared/Grid";
import Tile from "../shared/Tile";

function Home() {
  return (
    <Panel>
      <Header>Welcome to PolVol</Header>
      <Header>Measuring Political Volatility</Header>
      <p style={{textAlign: "center"}}>
        Opinions of public figures can change rapidly and be dishonest depending on the public's preference.
        PolVol is a platform that allows you to track these changes and see how public figures change their opinions on various topics and events.
        We strive to provide a transparent and open platform for everyone to see how public figures evolve in their views and how volatile their opinions are.
        We hope to help you make informed decisions based on these objective information.
      </p>
      <Grid>
        <Link to="/persons" style={{ textDecoration: "none" }}>
          <Tile>
            <Header>Browse People</Header>
            <p>See how people change their view on topics and events...</p>
          </Tile>
        </Link>
        <Link to="/events" style={{ textDecoration: "none" }}>
          <Tile>
            <Header>Browse Events</Header>
            <p>Stay on top of what's happening around the world...</p>
          </Tile>
        </Link>
        <Link to="/spectra" style={{ textDecoration: "none" }}>
          <Tile>
            <Header>Browse Spectra</Header>
            <p>Check what spectra in people's opinions do we measure...</p>
          </Tile>
        </Link>
        <Link to="/stances" style={{ textDecoration: "none" }}>
          <Tile>
            <Header>Browse People's Opinions</Header>
            <p>Dive deep and get to know people's opinions...</p>
          </Tile>
        </Link>
      </Grid>
    </Panel>
  );
}

export default Home;