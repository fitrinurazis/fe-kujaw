import { configureStore } from "@reduxjs/toolkit";
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

export const store = configureStore({
  reducer: {
    auth: authReducer,
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
});
