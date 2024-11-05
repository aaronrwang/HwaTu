import './Room.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from './socket';
import Gamelink from './Gamelink.jsx';
import Header from './Header.jsx';

const Room = () => {
    const domain = 'http://localhost:5173'
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    const [game, startGame] = useState(false);
    const { roomId } = useParams();
    function callback(code) {
        console.log(code);
        if (code === 2) {
            navigate(`/`);
        }
    }
    useEffect(() => {
        socket.emit('joinFriend', roomId, callback);

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        socket.on('startGame', () => {
            startGame(true);
        });
        socket.on('endGame', () => {
            startGame(false);
        });

        return () => {
            socket.off('message');
            socket.off('startGame'); // Cleanup
        };
    }, [roomId]);
    const sendMessage = () => {
        const message = `Hello from ${socket.id}`;
        socket.emit('message', message);
    };

    return (
        <div className='room'>
            <Header page={`Room: ${roomId}`} />

            {!game && <div className='waiting-screen'>
                <h1>Waiting for friend...</h1>
                <Gamelink link={domain + '/game/' + roomId} />

            </div>}
            {game && <>
                <button onClick={sendMessage}>Send Message</button>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </>}
        </div>
    );
};

export default Room;
