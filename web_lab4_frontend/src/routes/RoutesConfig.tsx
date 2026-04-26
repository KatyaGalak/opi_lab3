import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import { LoginPage } from "../features/loginPage/LoginPage";
import { RegisterPage } from "../features/registerPage/RegisterPage";
import { MainPage } from "../features/mainPage/MainPage";

export const RoutesConfig: React.FC = () => {
  const { isLogin } = useAppSelector(selectAuth);

  return (
    <Routes>
      <Route
        path="/login"
        element={isLogin ? <Navigate to="/main" replace /> : <LoginPage />}
      />

      <Route
        path="/register"
        element={isLogin ? <Navigate to="/main" replace /> : <RegisterPage />}
      />

      <Route
        path="/main"
        element={isLogin ? <MainPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/*"
        element={<Navigate to={isLogin ? "/main" : "/login"} replace />}
      />
    </Routes>
  );
};