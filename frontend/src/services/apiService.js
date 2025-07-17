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
   * Login with credentials (TODO: For future use).
   */
  async login(credentials) {
    // Endpoint for user login:
    const response = await this.request("/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Transform response to match UserContext expectations
    return {
      token: response.token,
      user: response.user,
    };
  }

  /**
   * Create a new user account.
   */
  async createAccount(credentials) {
    // Endpoint for user registration:
    const response = await this.request("/user/create", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Transform response to match UserContext expectations
    return {
      token: response.token,
      user: response.user,
    };
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
