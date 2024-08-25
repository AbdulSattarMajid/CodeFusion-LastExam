const UserModel = require('./mongosetup'); 
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json()); 

app.set('view engine', 'ejs');

app.get('/signup', (req, res) => {
    res.render('finalexam', { title: 'Final Exam' });
});
app.get('/signin', (req, res) => {
    res.render('signin', { title: 'Sign In' });
});

app.get('/signin-success', (req, res) => {
    res.render('successignin');
});

app.get('/signup-success', (req, res) => {
    res.render('signupsucces');
});
app.post('/signup', async (req, res) => {
    try {
        const { email, fullName, password, signupAs } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            email,
            name: fullName,
            password: hashedPassword,
            signup_as: signupAs
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({ message: 'Sign-in successful' });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
