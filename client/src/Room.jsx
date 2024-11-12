import './Room.css';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from './socket';
import Gamelink from './Gamelink.jsx';
import Header from './Header.jsx';
import Card from './Card.jsx';
import back from './assets/Cards/000.png';

const Room = () => {
    const domain = "http://localhost:5173";
    const outgoingMessage = useRef();
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
        const message = `${socket.id}: ${outgoingMessage.current.value}`;
        outgoingMessage.current.value = '';
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
            {game && <><div className='game-screen'>
                <div className="game-main">
                    <div className="p1">
                        {Array.from({ length: 1 }, (_, index) => (
                            <div className="card" key={index + 1}>
                                <div className="card-inner flip-it">
                                    <div className="card-back">
                                        <img src={back} alt="Card Back" className="card-img" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="middle">
                        <div className="piles">
                            {Array.from({ length: 12 }, (_, index) => (
                                <div className="pile" id={`pile-${index}`} key={index + 1}>
                                    {Array.from({ length: 4 }, (_, index2) => (
                                        <Card key={`${index * 4 + index2 + 1}`} cardId={`${index * 4 + index2 + 1}`} />
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="deck">
                            <div className="card">
                                <div className="card-inner flip-it">
                                    <div className="card-back">
                                        <img src={back} alt="Card Back" className="card-img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p2">
                        {Array.from({ length: 10 }, (_, index) => (
                            <Card key={index + 1} cardId={index + 1} clickable={true} />
                        ))}
                    </div>
                </div>
                <div className="side-bar">
                    <div className="stats">
                        <div className="player-stats">
                            <div>P1:10</div>
                            <div className="used-card">
                                {/* Junk, Ribbons, Animals, Brights */}
                                <div className="used-cards">
                                    {Array.from({ length: 10 }, (_, index) => (
                                        <Card key={index + 1} cardId={index + 1} mini={true} />
                                    ))}
                                </div>
                                <div className="used-cards">
                                    {Array.from({ length: 10 }, (_, index) => (
                                        <Card key={index + 1} cardId={index + 1} mini={true} />
                                    ))}
                                </div>
                                <div className="used-cards">
                                    {Array.from({ length: 10 }, (_, index) => (
                                        <Card key={index + 1} cardId={index + 1} mini={true} />
                                    ))}
                                </div>
                                <div className="used-cards">
                                    {Array.from({ length: 10 }, (_, index) => (
                                        <Card key={index + 1} cardId={index + 1} mini={true} />
                                    ))}
                                </div>

                            </div>
                        </div>
                        <div className="player-stats">
                            <div>P2:10</div>
                            <div className="used-card">
                                {/* Junk, Ribbons, Animals, Brights */}
                                <div className="used-cards">
                                    {Array.from({ length: 10 }, (_, index) => (
                                        <Card key={index + 1} cardId={index + 1} mini={true} />
                                    ))}
                                </div>
                                <div className="used-cards">
                                    {Array.from({ length: 10 }, (_, index) => (
                                        <Card key={index + 1} cardId={index + 1} mini={true} />
                                    ))}
                                </div>
                                <div className="used-cards">
                                    {Array.from({ length: 10 }, (_, index) => (
                                        <Card key={index + 1} cardId={index + 1} mini={true} />
                                    ))}
                                </div>
                                <div className="used-cards">
                                    {Array.from({ length: 10 }, (_, index) => (
                                        <Card key={index + 1} cardId={index + 1} mini={true} />
                                    ))}
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="chat">
                        <input type='text' ref={outgoingMessage}></input>
                        <button onClick={sendMessage}>Send Message</button>
                        <ul>{messages.map((msg, index) => (<li key={index}>{msg}</li>))}</ul>
                    </div>
                </div>
            </div><div className="mobile">Not Mobile Compatible</div></>}
        </div>
    );
};

export default Room;
