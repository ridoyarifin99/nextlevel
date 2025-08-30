// server.js

const express = require('express');
const path = require('path'); // Node.js module to handle file paths
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Serve Frontend Files ---
// This tells Express to treat the root directory 'NEXTLEVEL' as a place to serve static files from.
// __dirname is a Node variable that gives the absolute path of the directory containing the currently executing file.
app.use(express.static(path.join(__dirname)));

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// This tells the server to use your new auth routes for any request starting with /api/auth
app.use('/api/auth', require('./routes/auth'));

// --- Fallback for Single Page Application ---
// This makes sure that if the user refreshes on a page like /streaming,
// the server still sends index.html.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});