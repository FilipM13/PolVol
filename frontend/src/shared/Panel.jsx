import styles from './shared.module.css';

export default function Panel({ children }) {
  return (
    <div className={styles.Panel}>
      {children}
    </div>
  );
}