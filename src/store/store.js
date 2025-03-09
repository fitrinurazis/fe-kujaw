import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import classReducer from "./slices/classSlice";
import categoryReducer from "./slices/categorySlice";
import progdiReducer from "./slices/progdiSlice";
import productReducer from "./slices/productSlide";
import customerReducer from "./slices/customerSlice";
import transactionReducer from "./slices/transactionSlice";
import dashboardReducer from "./slices/dashboardSlice";
import reportReducer from "./slices/reportSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    user: userReducer,
    classes: classReducer,
    categories: categoryReducer,
    progdis: progdiReducer,
    products: productReducer,
    customers: customerReducer,
    transactions: transactionReducer,
    dashboard: dashboardReducer,
    reports: reportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
