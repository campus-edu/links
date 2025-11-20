require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Link = require('./models/Link');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend')); // Serves your index.html from the frontend folder

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// API Routes

// GET all links
app.get('/api/links', async (req, res) => {
    try {
        const links = await Link.find().sort({ createdAt: -1 });
        res.json(links);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new link
app.post('/api/links', async (req, res) => {
    try {
        const newLink = new Link(req.body);
        const savedLink = await newLink.save();
        res.status(201).json(savedLink);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a link
app.delete('/api/links/:id', async (req, res) => {
    try {
        const result = await Link.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Link not found' });
        res.json({ message: 'Link deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fallback to index.html for any other route (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Connect to DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
