// Importing Dependencies:
import React, { createContext, useState, useEffect } from "react";
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
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Guest-login when component mounts (for first iteration).
   * This simulates getting a user token without actual authentication.
   * TODO: Replace with real authentication flow later.
   */
  const guestLogin = async () => {
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
  };

  //
  // Login Function Goes Here When Implemented.
  //

  /**
   * Logout function to clear user data and token.
   */
  const logout = () => {
    console.log(`Logging out user with token: ${userToken}...`);
    setUserData(null);
    setUserToken(null);
    sessionStorage.removeItem("userToken.");
    console.log("User logged out.");
  };

  /**
   * Check for existing token on app start.
   */
  useEffect(() => {
    const savedToken = sessionStorage.getItem("userToken");
    if (savedToken) {
      // Validate token with backend (optional)
      setUserToken(savedToken);
      // TODO:  When backend login systen is fully implemented, validate token with backend.
      //        If valid, set user data, send user to log in.
    }
  }, []);

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
