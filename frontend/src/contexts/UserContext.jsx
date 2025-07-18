// Importing Dependencies:
import React, { createContext, useState, useEffect, useCallback } from "react";
import { apiService } from "../services/apiService";

/**
 * Context to store user state. Context loads with App.jsx,
 * accessaibile to all other components under its branch structure.
 * Contains (WIP):
 * - userToken: User authentication token, originating from backend.
 * - isLoading: Loading state for user data.
 */
const UserContext = createContext();

function UserProvider({ children }) {
  console.log("UserProvider mounting...");

  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Login with username and password.
   */
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      console.log("Attempting login...");

      const response = await apiService.login(credentials);

      setUserToken(response.token);

      // Store token in sessionStorage for persistence
      sessionStorage.setItem("userToken", response.token);
      console.log("Login successful:", response);

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw so components can handle the error
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new user account.
   */
  const createAccount = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      console.log("Attempting account creation...");

      const response = await apiService.createAccount(credentials);

      setUserToken(response.token);

      // Store token in sessionStorage for persistence
      sessionStorage.setItem("userToken", response.token);
      console.log("Account creation successful:", response);

      return response;
    } catch (error) {
      console.error("Account creation failed:", error);
      throw error; // Re-throw so components can handle the error
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function to clear user data and token.
   */
  const logout = useCallback(() => {
    console.log(`Logging out user with token: ${userToken}...`);
    setUserToken(null);
    sessionStorage.removeItem("userToken");
    console.log("User logged out.");
  }, [userToken]);

  /**
   * Force logout (used for disconnections, session expiry, etc.)
   * This is the same as logout but with different logging for debugging.
   */
  const forceLogout = useCallback((reason = "unknown") => {
    console.log(`Force logout triggered. Reason: ${reason}`);
    console.log(`Logging out user with token: ${userToken}...`);
    setUserToken(null);
    sessionStorage.removeItem("userToken");
    console.log("User force logged out.");
  }, [userToken]);

  /**
   * Check for existing token on app start.
   */
  useEffect(() => {
    const savedToken = sessionStorage.getItem("userToken");
    if (savedToken) {
      setUserToken(savedToken);
      setIsLoading(false);
    } else {
      // No saved token, stay on login page
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        userToken,
        isLoading,
        setIsLoading,
        login,
        createAccount,
        logout,
        forceLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
