import Nav from "./Nav";
import styles from "./Header.module.css";
import logo from "../assets/logo.svg";
import { Link } from "react-router";

function Header() {
  return (
    <header className={styles.header}>
      <div style={{ background: "var(--bg1)", color: "black" }}>
        #TerribleCSS
      </div>
      <Link to="/" style={{ textDecoration: "none" }}>
        <img src={logo} height={100} alt="logo" style={{ marginTop: "1rem" }} />
      </Link>
      <Nav navClass={styles.nav} linkClass={styles.navLink} />
    </header>
  );
}

export default Header;
