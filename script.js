const socket = io();
let isTyping = false;

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
    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;

    // Send registration request to server
    socket.emit('register', { username: newUsername, email: newEmail, password: newPassword });
}

function authenticate(token) {
    // Authenticate the user with the server
    socket.emit('authenticate', token);
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message !== '') {
        // Send message to the server
        socket.emit('chat message', message);
        isTyping = false;

        // Clear the input field
        messageInput.value = '';
    }
}

function startTyping() {
    if (!isTyping) {
        socket.emit('userTyping');
        isTyping = true;
    }
}

function stopTyping() {
    if (isTyping) {
        socket.emit('userStoppedTyping');
        isTyping = false;
    }
}

// Event listeners for typing notifications
socket.on('typingNotification', (username) => {
    console.log(`${username} is typing...`);
    // Display typing notification on the UI
});

socket.on('stoppedTypingNotification', (username) => {
    console.log(`${username} stopped typing.`);
    // Remove typing notification from the UI
});

// Event listeners for user connection and disconnection
socket.on('userConnected', (username) => {
    console.log(`${username} connected.`);
    // Display user connection on the UI
});

socket.on('userDisconnected', (username) => {
    console.log(`${username} disconnected.`);
    // Display user disconnection on the UI
});

// Event listener for chat messages
socket.on('chat message', (msg) => {
    // Handle incoming chat messages
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p><strong>${msg.username}</strong> (${msg.timestamp}): ${msg.message}</p>`;

    // Scroll to the bottom to show the latest message
    messagesDiv.scrollTop = messagesDiv
