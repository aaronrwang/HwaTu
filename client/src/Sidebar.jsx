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
    const p1stock = data.stock[player];
    const p2stock = data.stock[(player + 1) % 2];
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
                    <div>{p1name}: {data.scores[player][0]}</div>
                    <div className="used-card">
                        {/* Junk, Ribbons, Animals, Brights */}
                        <div className="used-cards">
                            {(p1stock[0][0]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p1stock[0][1]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                        </div>
                        <div className="used-cards">
                            {(p1stock[1][0]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p1stock[1][1]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p1stock[1][2]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p1stock[1][3]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                        </div>
                        <div className="used-cards">
                            {(p1stock[2][0]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p1stock[2][1]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                        </div>
                        <div className="used-cards">
                            {(p1stock[3]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                        </div>

                    </div>
                </div>
                <div className="player-stats">
                    <div>{p2name}: {data.scores[(player + 1) % 2][0]}</div>
                    <div className="used-card">
                        {/* Junk, Ribbons, Animals, Brights */}
                        <div className="used-cards">
                            {(p2stock[0][0]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p2stock[0][1]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                        </div>
                        <div className="used-cards">
                            {(p2stock[1][0]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p2stock[1][1]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p2stock[1][2]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p2stock[1][3]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                        </div>
                        <div className="used-cards">
                            {(p2stock[2][0]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                            {(p2stock[2][1]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
                        </div>
                        <div className="used-cards">
                            {(p2stock[3]).map((card) => (<Card key={card} cardId={card} mini={true} />))}
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