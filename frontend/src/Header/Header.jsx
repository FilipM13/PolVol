import Nav from "./Nav";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>PolVol</h1>
      <Nav navClass={styles.nav} linkClass={styles.navLink} />
    </header>
  );
}

export default Header;