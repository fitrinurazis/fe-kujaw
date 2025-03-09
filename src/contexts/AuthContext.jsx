import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const USER_KEY = import.meta.env.VITE_USER_KEY;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user: reduxUser, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [user, setUser] = useState(() => {
    try {
      const savedUser = Cookies.get(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });

  // Sync with Redux state
  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
      dispatch({ type: "SET_USER", payload: reduxUser });
    }
  }, [reduxUser, dispatch]);

  useEffect(() => {
    if (user) {
      try {
        Cookies.set(USER_KEY, JSON.stringify(user), {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    }
  }, [user]);

  const login = useCallback(
    async (userData) => {
      setUser(userData);
      dispatch({ type: "SET_USER", payload: userData });
      Cookies.set(USER_KEY, JSON.stringify(userData), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      return Promise.resolve();
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    setUser(null);
    dispatch({ type: "LOGOUT" });
    Cookies.remove(USER_KEY);
    Cookies.remove(TOKEN_KEY);
  }, [dispatch]);

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Move useAuth to a separate file: src/hooks/useAuth.js
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
