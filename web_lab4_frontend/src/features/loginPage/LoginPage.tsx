import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";
import styles from "./LoginPage.module.css";
import { Link } from "react-router-dom";

import { TextInput, Button } from "belle";

export function LoginPage() {
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

        dispatch(login({ username: username.trim(), password: password.trim() }));
    };

    const displayError = error ? 
        (error.includes("invalid") ? "Неверный логин или пароль" :
         "Ошибка входа: попробуйте позже") : null;

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
                <h1 className={styles.title}>Вход</h1>
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
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        primary
                        disabled={loading}
                        className={styles.loginButton}
                    >
                        {loading ? "Выполняется вход" : "Войти"}
                    </Button>

                    {displayError && <div className={styles.error}>{displayError}</div>}

                    <p className={styles.linkText}>
                        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}