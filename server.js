const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const users = {};

app.post('/register', express.json(), (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        users[username] = hash;
        res.status(200).json({ message: 'User registered successfully' });
    });
});

app.post('/login', express.json(), (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = users[username];

    if (!hashedPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err || !result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
