const socket = io();

function showRegister() {
    // ... (no changes needed)
}

function showLogin() {
    // ... (no changes needed)
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request to server
    socket.emit('login', { username, password });
}

function register() {
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    // Send registration request to server
    socket.emit('register', { username: newUsername, password: newPassword });
}

socket.on('chat message', (msg) => {
    // Handle incoming chat messages
    console.log(msg);
    // Display the messages in the chat room
});

// Additional logic for sending messages and handling UI in the chat room
