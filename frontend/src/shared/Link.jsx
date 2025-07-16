import styles from "./shared.module.css";
import { Link as RouterLink } from "react-router-dom";

export default function Link({ children, to, ...props }) {
  return (
    <RouterLink to={to} className={styles.ActionButton} {...props}>
      {children}
    </RouterLink>
  );
}
