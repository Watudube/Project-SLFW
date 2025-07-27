/**
 * Endpoint URLs Configuration
 *
 * Configure the backend endpoints for different environments.
 * Change the domainURL as required for your development environment.
 */

// Backend host configuration:
// const domainURL = "192.168.1.142"; // For local network development.
const domainURL = "localhost"; // For localhost development.

// API endpoints:
export const WEBSOCKET_BASEURL = `ws://${domainURL}:8000/ws/game`;
export const GAME_API_BASEURL = `http://${domainURL}:8000`;
