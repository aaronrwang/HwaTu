// src/socket.js
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ['websocket'],  // This forces WebSocket, disabling fallback to polling
    withCredentials: true  // Ensure credentials (cookies, etc.) are sent
});
export default socket;
