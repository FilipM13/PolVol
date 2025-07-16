import styles from "./shared.module.css";

export default function Button({ children, type = "button", ...props }) {
  return (
    <button type={type} className={styles.ActionButton} {...props}>
      {children}
    </button>
  );
}
