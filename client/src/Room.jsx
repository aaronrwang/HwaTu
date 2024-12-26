import './Room.css';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from './socket';
import Gamelink from './Gamelink.jsx';
import Header from './Header.jsx';
import Card from './Card.jsx';
import back from './assets/Cards/000.jpg';
import Sidebar from './Sidebar.jsx';

const Room = () => {
    const domain = "https://hwatu-gostop-github-io.onrender.com/";
    const navigate = useNavigate();
    const [game, startGame] = useState(false);
    const { roomId } = useParams();
    const [priv, setPrivate] = useState(false);
    const [pub, setPublic] = useState(false);
    const [data, setData] = useState({ deck: [], hand: [[], []], middle: [], stock: [] });
    const playerRef = useRef(null);  // Track player without re-rendering
    const [activePile, setActivePile] = useState(-1);
    const [display, setDisplay] = useState(null)
    // 0: Perfectly executed
    // 1: already connected (waiting for friend)
    // 2: already connected (waiting for stranger)
    // 3: Room not available
    function callback(code) {
        if (code === 3) {
            navigate(`/`);
        } else if (code === 2) {
            setPublic(true);
        } else if (code === 1) {
            setPrivate(true);
        }
    }
    function setFirstCard(card) {
        // setActiveCard(card);
        socket.emit('move', card);
    }
    function setSecondCard(card) {
        if (data.part2 === 0) {
            socket.emit('move2', card);
        } else {
            socket.emit('move3', card);
        }
    }
    useEffect(() => {
        socket.emit('joinFriend', roomId, callback);
        socket.on('leave', () => {
            navigate(`/`);
        });
        socket.on('startGame', (user1, d) => {
            startGame(true);
            playerRef.current = (socket.id === user1 ? 0 : 1);
            setData(d);
        });
        socket.on('data', (d) => {
            setData(d);
            setActivePile(() => Math.floor((d.activeCard - 1) / 4));
        });
        socket.on('endGame', () => {
            startGame(false);
        });
        socket.on('winner', (winner) => {

            if (winner === playerRef.current) {
                setDisplay('winner');
            } else if (winner === (playerRef.current + 1) % 2) {
                setDisplay('loser');
            } else if (winner === 2) {
                setDisplay('draw');
            }
        })

        return () => {
            socket.off('startGame'); // Cleanup
            socket.off('data'); // Cleanup
            socket.off('endGame'); // Cleanup
            socket.off('winner'); // Cleanup
            socket.off('leave'); // Cleanup
        };
    }, [roomId]);

    return (
        <div className='room'>
            <Header page={`Room: ${roomId}`} />
            {display && display === 'winner' && <div className='waiting-screen'>
                <h1>You Won</h1>
            </div>}
            {display && display === 'loser' && <div className='waiting-screen'>
                <h1>You Lost</h1>
            </div>}
            {display && display === 'draw' && <div className='waiting-screen'>
                <h1>Draw</h1>
            </div>}

            {!game && priv && <div className='waiting-screen'>
                <h1>Waiting for friend...</h1>
                <Gamelink link={domain + '#/game/' + roomId} />

            </div>}
            {!game && pub && <div className='waiting-screen'>
                <h1>Waiting for Opponent...</h1>

            </div>}
            {game && !display && <>
                {data.activeCard !== 0 && data.active === playerRef.current && <div className="activeCards">
                    <Card key={data.activeCard} cardId={data.activeCard} />
                </div>}
                {data.active === playerRef.current && <div className="turn-indicator">
                    <h2>Your Turn</h2>
                </div>}
                <div className='game-screen'>
                    <div className="game-main">
                        <div className="p2">
                            {Array.from({ length: (data.hand[(playerRef.current + 1) % 2]).length }, (_, index) => (
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
                                    <div className={`pile ${activePile === index && playerRef.current === data.active ? 'active-pile' : ''}`} id={`pile-${index}`} key={index + 1}>
                                        {(data.middle[index]).map((card) => (<Card key={card} cardId={card} clickable={data.active === playerRef.current && activePile === index} onClick={() => setSecondCard(card)} />))}
                                    </div>
                                ))}
                            </div>
                            {(data.deck).length !== 0 && <div className="deck">
                                <div className="card">
                                    <div className="card-inner flip-it">
                                        <div className="card-back">
                                            <img src={back} alt="Card Back" className="card-img" />
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>
                        <div className="p1">
                            {(data.hand[playerRef.current]).map((card) => (<Card key={card} cardId={card} clickable={data.active === playerRef.current && data.activeCard === 0} onClick={() => setFirstCard(card)} />))}
                        </div>
                    </div>
                    <Sidebar roomId={roomId} data={data} player={playerRef.current} />
                </div><div className="mobile">This game is not mobile compatible.</div></>}
        </div>
    );
};

export default Room;
