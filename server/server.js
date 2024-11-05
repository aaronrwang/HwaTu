// server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Enable CORS for all routes
app.use(cors());

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
let users = []; //list of user names
let rooms = {}; // stores rooms and their connected sockets
let vacantRooms = []
let fullRooms = []
let vacantPrivateRooms = []
let fullPrivateRooms = []
let sockets = {}

// app.get('/', (req, res) => {
//     res.send('Server is running');
// });
// server.js (Node.js server)

import shortid from 'shortid';

io.on('connection', (socket) => {
    console.log('sockets:', sockets);
    console.log('rooms:', rooms);
    console.log('vacant:', vacantRooms);
    console.log('full:', fullRooms);
    console.log('vacant private:', vacantPrivateRooms);
    console.log('full private:', fullPrivateRooms);
    console.log(socket.id, 'connected');
    users.push(socket.id)
    console.log('users:', users);
    sockets[socket.id] = null;

    // Send message to room
    socket.on('message', (message) => {
        console.log(message, sockets[socket.id]);
        io.to(sockets[socket.id]).emit('message', message);
    });

    // function startGame(room) {
    //     io.to(room).emit("startGame");
    // }
    function startGame(room) {  // Default delay is 1000 ms (1 second)
        setTimeout(() => {
            io.to(room).emit("startGame");
        }, 1000);
    }

    function endGame(room) {
        io.to(room).emit("endGame");
    }
    socket.on('joinRoom', (type, callback) => {
        let id;
        if (type === 'stranger') {
            if (vacantRooms.length > 0) {
                id = vacantRooms[0]
                rooms[vacantRooms[0]].push(socket.id)
                fullRooms.push(vacantRooms.pop(0))
                startGame(id)
            } else {
                id = shortid.generate();
                rooms[id] = [socket.id]
                vacantRooms.push(id)
            }

        } else if (type === 'friend') {
            id = shortid.generate();
            rooms[id] = [socket.id]
            vacantPrivateRooms.push(id)
        }
        sockets[socket.id] = id;
        socket.join(id);
        if (typeof callback === 'function') {
            callback(id);
        } else {
            console.error('Callback is not a function');
        }
    });

    socket.on('leaveRoom', (callback) => {
        leave(socket)
        socket.leave(sockets[socket.id]);
        sockets[socket.id] = null;
        callback(0);
    });

    // 0: Perfectly executed
    // 1: already connected (waiting for friend)
    // 2: already connected (waiting for stranger)
    // 3: Room not available

    // if its a friend room thats open join
    // friend room thats close -> send to home page
    // its the socket that just joined reloading -> do nothing
    // its trying to join a non-existent / not available room
    socket.on('joinFriend', (roomId, callback) => {
        let index = vacantPrivateRooms.indexOf(roomId);
        if (index !== -1) {
            if (rooms[roomId] && rooms[roomId][0] != socket.id) {
                rooms[roomId].push(socket.id);
                vacantPrivateRooms.splice(index, 1);
                fullPrivateRooms.push(roomId);
                socket.join(roomId);
                sockets[socket.id] = roomId;
                startGame(roomId)
                callback(0);
            } else {
                callback(1);
            }
        } else {
            let r = sockets[socket.id]
            if (r == roomId) {
                index = fullPrivateRooms.indexOf(roomId);
                if (index !== -1) {
                    callback(1);
                } else {
                    callback(2);
                }
            } else {
                callback(3);
            }

        }
    });

    function leave(socket) {
        let r = sockets[socket.id];
        endGame(r);
        if (!rooms[r]) {
            delete sockets[socket.id];
            return
        }
        // if first user remove, if not it MUST be second user of that room so remove that
        if (rooms[r][0] === socket.id) {
            rooms[r].splice(0, 1);
        } else {
            rooms[r].splice(1, 1);
        }

        if (rooms[r].length === 0) {
            delete rooms[r];
            let index = vacantPrivateRooms.indexOf(r);
            if (index !== -1) {
                vacantPrivateRooms.splice(index, 1);
            } else {
                index = vacantRooms.indexOf(r);
                vacantRooms.splice(index, 1);
            }
        } else {
            let index = fullPrivateRooms.indexOf(r);
            if (index !== -1) {
                fullPrivateRooms.splice(index, 1);
                vacantPrivateRooms.push(r);
            } else {
                index = vacantRooms.indexOf(r);
                fullRooms.splice(index, 1);
                vacantRooms.push(r)
            }
        }
    }

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        //remove from users list
        const index = users.indexOf(socket.id);
        if (index !== -1) {
            users.splice(index, 1);
        }
        leave(socket)
        delete sockets[socket.id];
    });


});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});