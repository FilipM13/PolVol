import styles from './shared.module.css';

export default function Loading() {
  return (
    <div className={styles.LoadingWrapper}>
      <div className={styles.Spinner}></div>
      <span className={styles.LoadingText}>Loading...</span>
    </div>
  );
}
