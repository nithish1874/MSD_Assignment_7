const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static('public'));

const readUsers = () => {
    try {
        const data = fs.readFileSync('users.json');
        return JSON.parse(data);
    } catch (error) {
        return []; 
    }
};

const writeUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};


app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const users = readUsers();

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists!' });
    }

    const newUser = { name, email, password };
    users.push(newUser); 

    writeUsers(users);

    res.status(201).json({ message: 'User registered successfully!' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
