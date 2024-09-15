import { io } from "socket.io-client";

// The URL will be computed from `window.location` if in production, otherwise it points to localhost
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:4200";

// Create a socket instance with autoConnect set to false
export const socket = io(URL, {
  autoConnect: false, // Prevents the socket from connecting automatically
});
