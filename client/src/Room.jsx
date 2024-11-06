import './Room.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from './socket';
import Gamelink from './Gamelink.jsx';
import Header from './Header.jsx';

const Room = () => {
    const domain = "http://localhost:5173";
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    const [game, startGame] = useState(false);
    const { roomId } = useParams();
    const [priv, setPrivate] = useState(false);
    const [pub, setPublic] = useState(false);

    // 0: Perfectly executed
    // 1: already connected (waiting for friend)
    // 2: already connected (waiting for stranger)
    // 3: Room not available
    function callback(code) {
        console.log(code);
        if (code === 3) {
            navigate(`/`);
        } else if (code === 2) {
            setPublic(true);
        } else {
            setPrivate(true);
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
            setMessages([]);
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

            {!game && priv && <div className='waiting-screen'>
                <h1>Waiting for friend...</h1>
                <Gamelink link={domain + '/game/' + roomId} />

            </div>}
            {!game && pub && <div className='waiting-screen'>
                <h1>Waiting for Opponent...</h1>

            </div>}
            {game && <div className='game-screen'>
                <div className="game-main">
                    <div className="p1"></div>
                    <div className="middle"></div>
                    <div className="p2"></div>
                </div>
                <div className="side-bar">
                    <div className="history"></div>
                    <div className="score">
                        <p>P1:10</p>
                        <p>P2:10</p>
                    </div>
                    <div className="chat">
                        <button onClick={sendMessage}>Send Message</button>
                        <ul>{messages.map((msg, index) => (<li key={index}>{msg}</li>))}</ul>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default Room;
