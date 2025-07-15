import styles from './shared.module.css';

export default function Panel({ children, size}) {
  const sizes = {
    small: styles.PanelSmall,
    medium: styles.PanelMedium,
    large: styles.PanelLarge,
  };
  const panelSize = sizes[size] || styles.PanelMedium;
  return (
    <div className={`${styles.Panel} ${panelSize}`}>
      {children}
    </div>
  );
}