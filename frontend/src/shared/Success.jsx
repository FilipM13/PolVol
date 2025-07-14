import styles from './shared.module.css';

export default function Success({ message }) {
  return (
    <div className={styles.SuccessWrapper}>
      <div className={styles.SuccessIcon}>✓</div>
      <span className={styles.SuccessText}>{message || 'Success!'}</span>
    </div>
  );
}
