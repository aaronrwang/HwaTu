// server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import shortid from 'shortid';
import { Game } from './game.js';

const app = express();
const server = createServer(app);

// Enable CORS for all routes
app.use(cors());

app.use(express.static('public'));

// Route to send rooms and users data
app.get('/data', (req, res) => {
    res.json({
        rooms: Object.values(rooms), // Convert dictionary to array
        users: Array.from(users)      // Convert set to array
    });
});
// Enable CORS for all HTTP routes
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",  // Allow requests from your frontend (local or production)
    methods: ["GET", "POST"],  // Allow these methods for general API routes
    allowedHeaders: ["my-custom-header"],  // Specify allowed headers if needed
    credentials: true  // Allow cookies and credentials if you're using them
}));

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",  // Allow WebSocket connections from the same frontend URL
        methods: ["GET", "POST"],  // Allow these methods for WebSocket communication
        allowedHeaders: ["my-custom-header"],  // Specify allowed headers if needed
        credentials: true  // Allow credentials (cookies, sessions, etc.)
    }
});

class User {
    constructor(id, name = null, roomid = null) {
        this.id = id;
        this.name = name;
        this.roomid = roomid;
    }
}
class Room {

    // 0:stranger vacant; 1: stranger full; 2: friend vacant; 3: friend full
    static roomsByPrivacy = { 0: new Set(), 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };

    constructor(id, user1 = null, user2 = null, privacy = 0, game = null) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;
        this.privacy = privacy;
        this.game = undefined;
        this.setPrivacy(privacy);
    }

    setPrivacy(newPrivacy) {
        // If the room already exists in the previous privacy set, remove it
        if (Room.roomsByPrivacy[this.privacy]) {
            Room.roomsByPrivacy[this.privacy].delete(this);
        }

        // Update the room's privacy and add it to the appropriate set
        this.privacy = newPrivacy;
        if (Room.roomsByPrivacy[newPrivacy]) {
            Room.roomsByPrivacy[newPrivacy].add(this);
        } else {
            console.warn(`Invalid privacy setting: ${newPrivacy}`);
        }
    }

    // Static method to get all rooms with a specific privacy level
    static getRoomsByPrivacy(privacy) {
        return Array.from(Room.roomsByPrivacy[privacy] || []);
    }

    static deleteRoom(room) {
        // Delete the room from the correct privacy set
        if (Room.roomsByPrivacy[room.privacy]) {
            Room.roomsByPrivacy[room.privacy].delete(room);
            console.log(`Room with id ${room.id} deleted.`);
        }
    }
}

let users = new Set(); //list of user names
let rooms = {};

io.on('connection', (socket) => {
    const user = new User(socket.id);
    users.add(user);
    let room = null;

    // Send message to room
    socket.on('message', (message) => {
        console.log(message, user.id);
        io.to(room.id).emit('message', user.id, message);
    });
    socket.on('name', (name) => {
        user.name = name;
        sendUsers();
    });
    function sendUsers() {
        io.to(room.id).emit('users', [room.user1, room.user2]);
    }

    function startGame(time = 1000) {  // Default delay is 1000 ms (1 second)
        setTimeout(() => {
            try {
                room.game = new Game(room);
                io.to(room.id).emit("startGame", room.user1.id, room.game);
                sendUsers();
                sendData();
            } catch (error) {
                console.log("Room deleted before Game creation")
            }
        }, time);
    }

    function endGame(room) {
        io.to(room).emit("endGame");
    }


    socket.on('joinRoom', (type, callback) => {
        if (type === 'friend') {
            room = new Room(shortid.generate(), user, null, 2, null);
        } else if (type === 'stranger') {
            const openRooms = Room.getRoomsByPrivacy(0);
            if (openRooms.length !== 0) {
                room = openRooms.values().next().value;
                room.user2 = user;
                room.setPrivacy(1);
                startGame();
            } else {
                room = new Room(shortid.generate(), user, null, 0, null);
            }
        } else if (type === 'CPU') {
            const tempid = shortid.generate()
            room = new Room(tempid, user, { id: 'cpu', name: "CPU", roomid: tempid }, 4, null);
        } else {
            console.log('misuse of joinRoom');
        }
        rooms[room.id] = room;
        user.roomid = room.id;
        socket.join(room.id);
        // if (type === 'CPU') {
        //     startGame(0);
        // }
        callback(room.id);
    });

    socket.on('joinFriend', (roomId, callback) => {
        if (room && room.id === roomId) {
            if (room.privacy === 0 || room.privacy === 1) {
                callback(2);
            } else if (room.privacy === 2 || room.privacy === 3) {
                callback(1);
            } else if (room.privacy === 4) {
                startGame(0);
                callback(4);
            } else {
                console.log("This should not happen.");
                callback(3);
            }
        } else if (rooms[roomId] && rooms[roomId].privacy === 2) {
            room = rooms[roomId];
            room.user2 = user;
            room.setPrivacy(3);
            user.roomid = roomId;
            socket.join(room.id);
            callback(0);
            startGame();
        } else {
            callback(3);
        }
    });

    function leave() {
        if (!user.roomid) {
            return;
        }
        socket.leave(room.id);
        endGame(user.roomid);
        user.roomid = null;
        if (room.user1.id === user.id) {
            room.user1 = room.user2;
        }
        room.user2 = null;
        if (room.privacy === 0) {
            Room.deleteRoom(room);
            delete rooms[room.id];
        } else if (room.privacy === 1) {
            room.setPrivacy(0);
        } else if (room.privacy === 2 || room.privacy === 4) {
            Room.deleteRoom(room);
            delete rooms[room.id];
        } else if (room.privacy === 3) {
            room.setPrivacy(2);
        } else {
            console.log("Not an option.");
        }
        room = null;
    }

    socket.on('leaveRoom', (callback) => {
        leave()
        // sockets[socket.id] = null;
        // callback(0);
    });

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        leave()
        users.delete(user);
    });
    function calculateScore() {
        const winner = room.game.calculateScore();
        if (winner === 0) {
            completeGame(0);
        } else if (winner === 1) {
            completeGame(1)
        } else if (winner === 2) {
            completeGame(2)
        }
    }
    function completeGame(winner) {
        io.to(room.id).emit('winner', winner);
        setTimeout(() => {
            io.to(user.roomid).emit('leave');
        }, 3000);

    }
    function moveCPU() {
        if (!room) {
            return;
        }
        if (room.game.active === 0) {
            return;
        }

        // send a random number from what's remaining in the hand
        let l = (room.game.hand[1]).length;
        let rand = Math.floor(Math.random() * l);
        room.game.move(room.game.hand[1][rand]);
        calculateScore();
        if (room.game.activeCard != 0) {
            // send a random number from what's remaining in the active Pile
            let pile = room.game.getPile(room.game.activeCard);
            l = (room.game.middle[pile]).length;
            rand = Math.floor(Math.random() * l);
            room.game.move2(room.game.middle[pile][rand]);
            calculateScore();
        }
        if (room.game.activeCard != 0) {
            // send a random number from what's remaining in the active Pile
            let pile = room.game.getPile(room.game.activeCard);
            l = (room.game.middle[pile]).length;
            rand = Math.floor(Math.random() * l);
            room.game.move2(room.game.middle[pile][rand]);
            room.game.move3();
            calculateScore();
        }
        io.to(room.id).emit("data", room.game);
    }
    socket.on('move', (activeCard) => {
        room.game.move(activeCard);
        calculateScore();
        io.to(room.id).emit("data", room.game);
        setTimeout(() => {
            if (room && room.privacy === 4) {
                moveCPU();
            }

        }, 2000);
    });
    socket.on('move2', (activeCard) => {
        room.game.move2(activeCard);
        calculateScore();
        io.to(room.id).emit("data", room.game);
        setTimeout(() => {
            if (room && room.privacy === 4) {
                moveCPU();
            }
        }, 2000);
    });
    socket.on('move3', (activeCard) => {
        room.game.move3(activeCard);
        calculateScore();
        io.to(room.id).emit("data", room.game);
        setTimeout(() => {
            if (room && room.privacy === 4) {
                moveCPU();
            }
        }, 2000);
    });
    function sendData() {
        io.to(room.id).emit("data", room.game);
    }


});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});