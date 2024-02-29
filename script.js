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
    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;

    // Send registration request to server
    socket.emit('register', { username: newUsername, email: newEmail, password: newPassword });
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message !== '') {
        // Send message to the server
        socket.emit('chat message', message);

        // Clear the input field
        messageInput.value = '';
    }
}

socket.on('chat message', (msg) => {
    // Handle incoming chat messages
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p>${msg}</p>`;

    // Scroll to the bottom to show the latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Additional logic for handling UI in the chat room
