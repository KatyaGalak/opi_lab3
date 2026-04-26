import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";
import styles from "./RegisterPage.module.css";

import { TextInput, Button } from "belle";
import { Link } from "react-router-dom";

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLogin, loading, error } = useAppSelector(selectAuth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLogin) {
      navigate("/main");
    }
  }, [isLogin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      return;
    }

    dispatch(register({ username: username.trim(), password: password.trim() }));
  };

  let usernameError: string | null = null;
  let passwordError: string | null = null;
  let commonError: string | null = null;

  if (error) {
    const lowerError = error.toLowerCase();

    if (lowerError.includes("username is required") ||
            lowerError.includes("username must be at least 3")) {
        usernameError = "Логин должен содержать минимум 3 символа";
    } else if (lowerError.includes("password is required") ||
                lowerError.includes("password must be at least")) {
        passwordError = "Пароль должен содержать минимум 5 символов";
    } else if (lowerError.includes("exists")) {
        commonError = "Пользователь с таким логином уже существует";
    } else {
        commonError = "Ошибка регистрации: попробуйте позже";
    }
  }

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

      <div className={styles.content}> 
        <h1 className={styles.title}>Регистрация</h1>
        <p className={styles.subtitle}>Введите логин и пароль</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Логин
            </label>
            <TextInput
              id="username"
              type="text"
              value={username}
              onUpdate={({ value }: { value: string }) => setUsername(value)}
              placeholder="Введите логин"
              style={{ width: "100%" }}
              autoComplete="username"
              required
            />
            {usernameError && <div className={styles.error}>{usernameError}</div>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>
            <TextInput
              id="password"
              type="password"
              value={password}
              onUpdate={({ value }: { value: string }) => setPassword(value)}
              placeholder="Введите пароль"
              style={{ width: "100%" }}
              autoComplete="new-password"
              required
            />
            {passwordError && <div className={styles.error}>{passwordError}</div>}
          </div>

          <Button
            type="submit"
            primary
            disabled={loading}
            className={styles.registerButton}
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>

          {commonError && <div className={styles.error}>{commonError}</div>}

          <p className={styles.linkText}>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </form>
      </div>
    </div>
  );
}