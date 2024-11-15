import './Room.css';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from './socket';
import Gamelink from './Gamelink.jsx';
import Header from './Header.jsx';
import Card from './Card.jsx';
import back from './assets/Cards/000.png';
import Sidebar from './Sidebar.jsx';

const Room = () => {
    const domain = "http://localhost:5173";
    const navigate = useNavigate();
    const [game, startGame] = useState(false);
    const { roomId } = useParams();
    const [priv, setPrivate] = useState(false);
    const [pub, setPublic] = useState(false);
    const [data, setData] = useState({ deck: [], hand: [[], []], middle: [], stock: [] });
    const [player, setPlayer] = useState(undefined);
    const [activePile, setActivePile] = useState(-1);
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
    function setFirstCard(card) {
        console.log('yes')
        // setActiveCard(card);
        socket.emit('move', card);
    }
    function setSecondCard(card) {
        console.log('maybe')
        if (data.part2 === 0) {
            // socket.emit('move2', card);
        } else {
            // socket.emit('move3', card);  
        }
    }
    useEffect(() => {
        socket.emit('joinFriend', roomId, callback);

        socket.on('startGame', (user1, d) => {
            startGame(true);
            setPlayer(socket.id === user1 ? 0 : 1);
            setData(d);
        });
        socket.on('data', (d) => {
            console.log(d);
            setData(d);
            setActivePile(() => Math.floor((d.activeCard - 1) / 4));
        });
        socket.on('endGame', () => {
            startGame(false);
        });

        return () => {
            socket.off('startGame'); // Cleanup
            socket.off('data'); // Cleanup
            socket.off('endGame'); // Cleanup
        };
    }, [roomId]);

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
            {game && <>
                {data.activeCard !== 0 && data.active === player && <div className="activeCards">
                    <Card key={data.activeCard} cardId={data.activeCard} />
                </div>}
                <div className='game-screen'>
                    <div className="game-main">
                        <div className="p2">
                            {Array.from({ length: (data.hand[(player + 1) % 2]).length }, (_, index) => (
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
                                    <div className={`pile ${activePile === index ? 'active-pile' : ''}`} id={`pile-${index}`} key={index + 1}>
                                        {(data.middle[index]).map((card) => (<Card key={card} cardId={card} clickable={data.active === player && activePile === index} onClick={() => setSecondCard(card)} />))}
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
                        <div className="p1">
                            {(data.hand[player]).map((card) => (<Card key={card} cardId={card} clickable={data.active === player} onClick={() => setFirstCard(card)} />))}
                        </div>
                    </div>
                    <Sidebar roomId={roomId} />
                </div><div className="mobile">{player}</div></>}
        </div>
    );
};

export default Room;
