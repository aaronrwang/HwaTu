// src/Chat.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('connect');
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        const message = `Hello from ${socket.id}`;
        socket.emit('message', message);
        navigate()
    };

    return (
        <div>
            <h1>Chat</h1>
            <button onClick={sendMessage}>Send Message</button>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default Chat;
