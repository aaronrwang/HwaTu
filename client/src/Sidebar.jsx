import './Sidebar.css';
import { useEffect, useRef, useState } from 'react';
import Card from './Card.jsx';
import socket from './socket';

export default function Sidebar({ roomId, data, player }) {
    const outgoingMessage = useRef();
    const name = useRef();
    const [messages, setMessages] = useState([]);
    const [p1name, setp1name] = useState(socket.id.slice(0, 5));
    const [p2name, setp2name] = useState(undefined);
    useEffect(() => {
        socket.emit('name', p1name);
        socket.on('message', (id, message) => {
            setMessages((prevMessages) => [...prevMessages, [id, message]]);
        });
        socket.on('users', (users) => {
            if (users[0].id === socket.id) {
                setp1name(users[0].name);
                setp2name(users[1].name);
            } else {
                setp1name(users[1].name);
                setp2name(users[0].name);
            }
        })

        return () => {
            socket.off('message');
            socket.off('users');
        };
    }, [roomId]);
    const sendMessage = () => {
        const message = `${outgoingMessage.current.value}`;
        outgoingMessage.current.value = '';
        socket.emit('message', message);
    };
    const sendName = () => {
        const nameToBe = `${name.current.value}`;
        name.current.value = '';
        socket.emit('name', nameToBe);
    };

    return (
        <div className="side-bar">
            <div className="stats">
                <div className="player-stats">
                    <div>{p1name}:10</div>
                    <div className="used-card">
                        {/* Junk, Ribbons, Animals, Brights */}
                        <div className="used-cards">
                            {(data.stock[player]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
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
                    <div>{p2name}:10</div>
                    <div className="used-card">
                        {/* Junk, Ribbons, Animals, Brights */}
                        <div className="used-cards">
                            {(data.stock[(player + 1) % 2]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
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
                <div>
                    <input type='text' ref={name}></input>
                    <button onClick={sendName}>Change Name</button>
                </div>
                <div>
                    <input type='text' ref={outgoingMessage}></input>
                    <button onClick={sendMessage}>Send Message</button>
                </div>
                <ul>{messages.map((msg, index) => (<li key={index}>{msg[0] === socket.id ? p1name : p2name}: {msg[1]}</li>))}</ul>
            </div>
        </div>
    );
}