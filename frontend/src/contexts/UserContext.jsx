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
   * Guest-login when component mounts (for first iteration).
   * This simulates getting a user token without actual authentication.
   * TODO: Replace with real authentication flow later.
   */
  const guestLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Attempting guest-login...");

      // Call backend to get a temporary user token.
      const response = await apiService.getGuestToken();

      setUserToken(response.token);

      // Store token in sessionStorage for temporary persistence.
      sessionStorage.setItem("userToken", response.token);
      console.log("Guest-login successful:", response);
    } catch (error) {
      console.error("Guest-login failed:", error);
    } finally {
      setIsLoading(false); // This MUST or else some components will not render.
    }
  }, []); // Empty dependency array since this function doesn't depend on any props or state

  //
  // Login Function Goes Here When Implemented.
  //

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
   * Check for existing token on app start and auto-login if none exists.
   */
  useEffect(() => {
    const savedToken = sessionStorage.getItem("userToken");
    if (savedToken) {
      setUserToken(savedToken);
      setIsLoading(false);
    } else {
      // No saved token, automatically attempt guest login
      guestLogin();
    }
  }, [guestLogin]);

  return (
    <UserContext.Provider
      value={{
        userToken,
        isLoading,
        setIsLoading,
        guestLogin,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
