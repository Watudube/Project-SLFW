// Dependencies:
import React, { createContext, useState, useEffect, useCallback } from "react";
import { apiService } from "../services/apiService";

/**
 * User Context
 *
 * Global user state management context accessible to all components.
 *
 * Provides:
 * - userToken: User authentication token from backend
 * - isLoading: Loading state for user data
 * - setUserToken: Function to update user token
 * - setIsLoading: Function to update loading state
 * - login: Function to authenticate user with credentials
 * - createAccount: Function to create a new user account
 * - logout: Function to clear user data and token
 * - forceLogout: Function to forcibly log out user (e.g., on disconnection)
 */
const UserContext = createContext();

function UserProvider({ children }) {
  console.log("UserProvider mounting...");

  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Login with username and password.
   * @param {object} credentials - User login credentials.
   * @returns {Promise<boolean>} - Success status.
   */
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      console.log("Attempting login...");

      const response = await apiService.login(credentials);

      setUserToken(response.token);

      // Store token in sessionStorage for persistence.
      sessionStorage.setItem("userToken", response.token);
      console.log("Login successful:", response);

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw so components can handle the error.
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new user account.
   * @param {object} credentials - User registration credentials.
   * @returns {Promise<object>} - Registration response.
   */
  const createAccount = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      console.log("Attempting account creation...");

      const response = await apiService.createAccount(credentials);

      setUserToken(response.token);

      // Store token in sessionStorage for persistence.
      sessionStorage.setItem("userToken", response.token);
      console.log("Account creation successful:", response);

      return response;
    } catch (error) {
      console.error("Account creation failed:", error);
      throw error; // Re-throw so components can handle the error.
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
   * Force logout for disconnections, session expiry, etc.
   * @param {string} reason - Reason for forced logout.
   */
  const forceLogout = useCallback(
    (reason = "unknown") => {
      console.log(`Force logout triggered. Reason: ${reason}`);
      console.log(`Logging out user with token: ${userToken}...`);
      setUserToken(null);
      sessionStorage.removeItem("userToken");
      console.log("User force logged out.");
    },
    [userToken]
  );

  /**
   * Check for existing token on app start.
   */
  useEffect(() => {
    const savedToken = sessionStorage.getItem("userToken");
    if (savedToken) {
      setUserToken(savedToken);
      setIsLoading(false);
    } else {
      // No saved token, stay on login page.
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
