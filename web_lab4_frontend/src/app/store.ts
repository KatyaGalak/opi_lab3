import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../features/auth/authSlice";
import pointFormReducer from "../features/pointForm/PointFormSlice";
import resultTableReducer from "../features/resultTable/ResultTableSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    pointForm: pointFormReducer,
    resultTable: resultTableReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "pointForm", "resultTable"],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PAUSE", "persist/PURGE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);