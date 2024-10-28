// index.js

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the 'public' directory (e.g., your HTML files)
app.use(express.static('public'));

// Function to read users from JSON file
const readUsers = () => {
    try {
        const data = fs.readFileSync('users.json');
        return JSON.parse(data);
    } catch (error) {
        return []; // Return an empty array if the file does not exist or can't be read
    }
};

// Function to write users to JSON file
const writeUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// User Registration Route
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const users = readUsers();

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists!' });
    }

    // Create a new user object
    const newUser = { name, email, password };
    users.push(newUser); // Add the new user to the array

    writeUsers(users); // Save users to JSON file

    res.status(201).json({ message: 'User registered successfully!' });
});

// User Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const users = readUsers();
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        res.status(200).json({ message: `Welcome back, ${user.name}!` });
    } else {
        res.status(401).json({ message: 'Invalid credentials!' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
