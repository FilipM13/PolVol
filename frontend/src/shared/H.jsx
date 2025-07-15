import styles from './shared.module.css';

export default function H({ children, level = 1 }) {
  const levels = {
    1: styles.H1,
    2: styles.H2,
    3: styles.H3,
  }
  return (
    <header className={styles.Header}>
      <h1 className={levels[level]}>{children}</h1>
    </header>
  );
}
