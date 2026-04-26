import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./app/store";
import "./index.css";
import { App } from "./App";

import { Spinner } from "belle";
import styles from "./App.module.css";
// import logo from "./logo.png";
import { PersistGate } from "redux-persist/integration/react";

const logoPath = "/app/resources/logo.png";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div className={styles.persistLoading}>
            <img src={logoPath} alt="Logo" className={styles.persistLoadingLogo} />
            <Spinner size={80} color="#c1ecf0ff"/>
            <div className={styles.loadingText}>Загрузка приложения...</div>
          </div>
        }
        persistor={persistor}
      >
        <BrowserRouter basename="/app">
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);