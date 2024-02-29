const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const uuid = require('uuid').v4;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key'; // Replace with a secure secret key

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const users = {};
const emailVerifications = {};

const onlineUsers = {}; // Store online users and their socket IDs
const typingUsers = {}; // Store users who are typing

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const verificationToken = uuid();
    emailVerifications[verificationToken] = { username, email, password };

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: http://localhost:${PORT}/verify/${verificationToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error sending verification email' });
        }

        console.log('Verification email sent: ' + info.response);
        res.status(200).json({ message: 'Check your email for verification instructions' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = users[username]?.password;

    if (!hashedPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err || !result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token for authentication
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');

        const username = onlineUsers[socket.id];
        if (username) {
            delete onlineUsers[socket.id];
            io.emit('userDisconnected', username);
        }
    });

    socket.on('chat message', (msg) => {
        const username = onlineUsers[socket.id];

        if (username) {
            const timestamp = moment().format('h:mm A');
            io.emit('chat message', { username, message: msg, timestamp });
        }
    });

    socket.on('userTyping', () => {
        const username = onlineUsers[socket.id];

        if (username && !typingUsers[username]) {
            typingUsers[username] = true;
            io.emit('typingNotification', username);
        }
    });

    socket.on('userStoppedTyping', () => {
        const username = onlineUsers[socket.id];

        if (username && typingUsers[username]) {
            delete typingUsers[username];
            io.emit('stoppedTypingNotification', username);
        }
    });

    socket.on('authenticate', (token) => {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);

            const username = decoded.username;
            onlineUsers[socket.id] = username;

            io.emit('userConnected', username);
        } catch (err) {
            console.error('Authentication failed:', err.message);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
