import styles from './shared.module.css';

export default function Tile({ children }) {
  return (
    <div className={styles.Tile}>
      {children}
    </div>
  );
}