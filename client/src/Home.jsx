// src/Home.js
import './Home.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from './socket';
import Header from './Header.jsx';

const Home = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const callback = (id) => {
        setRoomId(id);
        navigate(`/game/${id}`);
    }
    const handleRoomAction = (type) => {
        socket.emit('joinRoom', type, callback);
    };
    const callback2 = () => {
        console.log("Home Page")
    }
    useEffect(() => {
        socket.emit('leaveRoom', callback2);

    }, []);

    return (
        <div className="home-page">
            <Header page="Home" />
            <div className="home-body">
                <h1>HwaTu</h1>
                <div className="home-body-buttons">
                    <button onClick={() => handleRoomAction('friend')}>
                        Friend
                    </button>
                    <button onClick={() => handleRoomAction('stranger')}>
                        Stranger
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
