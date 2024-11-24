// src/socket.js
import { io } from 'socket.io-client';

// const socket = io('https://hwatu.onrender.com'); // Replace with your server URL
// "http://localhost:5173"
const socket = io('http://localhost:3000', {
    transports: ['websocket'],  // This forces WebSocket, disabling fallback to polling
    withCredentials: true  // Ensure credentials (cookies, etc.) are sent
});
export default socket;
