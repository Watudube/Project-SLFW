// NOTE TO DEVS: Change I.P.s as required!!! Make sure to comment out/in the correct line for your environment.

// IMPORTANT: Change the string to the local network backend host I.P.:
const domainURL = "10.89.100.213"; // This is for local network development.
//const domainURL = "localhost"; // This is for localhost development.

// Endpoint templates:
export const WEBSOCKET_BASEURL = `ws://${domainURL}:8000/ws/game`;
export const GAME_API_BASEURL = `http://${domainURL}:8000`;
