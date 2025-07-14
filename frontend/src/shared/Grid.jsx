import styles from './shared.module.css';

export default function Grid({ children }) {
  return (
    <div className={styles.Grid}>
      {children}
    </div>
  );
}