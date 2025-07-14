import styles from './shared.module.css';

export default function Error({ message }) {
  return (
    <div className={styles.ErrorWrapper}>
      <div className={styles.ErrorIcon}>!</div>
      <span className={styles.ErrorText}>{message || 'An error occurred.'}</span>
    </div>
  );
}
