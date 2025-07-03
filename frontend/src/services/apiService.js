// Importing Constants:
import { GAME_API_BASEURL } from "./endpointURLs.js";

/**
 * This is a !singleton! service. Avoid multiple instances!
 * It manages API requests to the game server. It handles:
 * - Generic API requests.
 * - Authentication.
 */
class ApiService {
  constructor() {
    this.baseURL = GAME_API_BASEURL;
  }

  /**
   * Generic http request method.
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
      return await response.json(); // Parse and return JSON response into object data.
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  /**
   * Get a guest token (TODO: This for for pre-authentificiation iteration of game).
   */
  async getGuestToken() {
    // Endpoint for guest login:
    return this.request("/auth/guest", {
      method: "POST",
    });
  }

  /**
   * Login with credentials (TODO: For future use).
   */
  async login(credentials) {
    // Endpoint for user login:
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Make authenticated requests.
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

export const apiService = new ApiService();
