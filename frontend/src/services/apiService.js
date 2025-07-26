// Constants:
import { GAME_API_BASEURL } from "./endpointURLs.js";

/**
 * API Service (Singleton)
 *
 * Manages API requests to the game server. Handles:
 * - Generic API requests
 * - Authentication
 *
 * Note: This is a singleton service. Avoid creating multiple instances.
 */
class ApiService {
  constructor() {
    this.baseURL = GAME_API_BASEURL;
  }

  /**
   * Generic HTTP request method.
   * @param {string} endpoint - API endpoint to call.
   * @param {object} options - Fetch options (method, headers, body, etc.).
   * @returns {Promise<object>} - Parsed JSON response.
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const httpConfig = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, httpConfig);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  /**
   * Login with user credentials.
   * @param {object} credentials - User login credentials.
   * @returns {Promise<object>} - Login response with user data and token.
   */
  async login(credentials) {
    // Endpoint for user login.
    const response = await this.request("/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Transform response to match UserContext expectations.
    return {
      token: response.token,
      user: response.user,
    };
  }

  /**
   * Create a new user account.
   * @param {object} credentials - User registration credentials.
   * @returns {Promise<object>} - Registration response with user data and token.
   */
  async createAccount(credentials) {
    // Endpoint for user registration.
    const response = await this.request("/user/create", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Transform response to match UserContext expectations.
    return {
      token: response.token,
      user: response.user,
    };
  }

  /**
   * Make authenticated requests with bearer token.
   * @param {string} endpoint - API endpoint to call.
   * @param {object} options - Fetch options (method, headers, body, etc.).
   * @param {string} token - Authentication token.
   * @returns {Promise<object>} - Parsed JSON response.
   */
  async authenticatedRequest(endpoint, options = {}, token) {
    return this.request(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  }
}

// Export singleton instance.
export const apiService = new ApiService();
