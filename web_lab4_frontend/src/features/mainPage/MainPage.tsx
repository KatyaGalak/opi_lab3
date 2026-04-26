import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../auth/authSlice";
import { selectAuth } from "../auth/authSlice";
import { PointForm } from "../pointForm/PointForm";
import { Graph } from "../graph/Graph";
import { ResultTable } from "../resultTable/ResultTable";
import styles from "./MainPage.module.css";

export function MainPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { username, isLogin } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  const handleLogout = () => {
    dispatch(logout(""));
  };
  
  return (
    <div className={styles.container}>
      <table className={styles.headerContainer}>
        <tbody>
          <tr>
            <td className={styles.headerItem}>ФИО: Галак Екатерина Анатольевна</td>
            <td className={styles.headerItem}>Группа: P3215</td>
            <td className={styles.headerItem}>Номер варианта: 300038</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.welcomeBar}>
        <h2 className={styles.welcomeText}>Добро пожаловать, {username}!</h2>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Выйти
        </button>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.formSection}>
          <PointForm />
        </div>

        <div className={styles.graphSection}>
          <Graph />
        </div>

        <div className={styles.tableSection}>
          <ResultTable />
        </div>
      </div>
    </div>
  );
}