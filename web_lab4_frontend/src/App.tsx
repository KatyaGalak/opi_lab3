import { useAppSelector } from "./app/hooks";
import { selectAuth } from "./features/auth/authSlice";
import styles from "./App.module.css";
import { RoutesConfig } from "./routes/RoutesConfig";

import { Spinner } from "belle";

const logoPath = "/app/resources/logo.png";

export function App() {
  const { loading } = useAppSelector(selectAuth);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={logoPath} alt="Logo" className={styles.loadingLogo} />
        <Spinner size={60}  color="#a6ebf3ff"/>
        <div className={styles.loadingText}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <RoutesConfig/>
    </div>
  );
}