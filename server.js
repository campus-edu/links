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
app.use(express.static('frontend'));

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

// GET all links (Sorted by Position)
app.get('/api/links', async (req, res) => {
    try {
        // Sort by 'position' ascending (0, 1, 2...)
        const links = await Link.find().sort({ position: 1 });
        res.json(links);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new link
app.post('/api/links', async (req, res) => {
    try {
        // Auto-assign position to be at the end of the list
        const count = await Link.countDocuments();
        
        const newLink = new Link({
            ...req.body,
            position: count // If there are 5 items, this becomes index 5 (6th item)
        });
        
        const savedLink = await newLink.save();
        res.status(201).json(savedLink);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// NEW: Reorder links (Bulk Update)
app.put('/api/links/reorder', async (req, res) => {
    try {
        const { order } = req.body; // Array of IDs in the new order
        
        if (!order || !Array.isArray(order)) {
            return res.status(400).json({ error: 'Invalid data' });
        }

        // Create a list of operations to perform in bulk
        const operations = order.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { position: index }
            }
        }));

        // Send all updates to MongoDB efficiently
        await Link.bulkWrite(operations);
        
        res.json({ success: true, message: 'Order updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
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

// SPA Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
