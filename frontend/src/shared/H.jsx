import styles from './shared.module.css';

export default function H({ children }) {
  return (
    <header className={styles.Header}>
      <h1 className={styles.HeaderText}>{children}</h1>
    </header>
  );
}
