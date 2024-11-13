// Import required modules
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // To load environment variables

// Initialize express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection setup using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Tp212476@.',
    database: process.env.DB_NAME || 'inventory_system'
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database');
        
        // Test database connection
        db.query('SELECT 1 + 1 AS test', (err, results) => {
            if (err) {
                console.error('Error testing database connection:', err);
            } else {
                console.log('Database connection successful:', results[0].test);
            }
        });
    }
});

// Products API

// Get all products
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new product
app.post('/api/products', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    const sql = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, description, category, price, quantity], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, name, description, category, price, quantity });
    });
});

// Update product quantity
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const sql = 'UPDATE products SET quantity = ? WHERE id = ?';
    db.query(sql, [quantity, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product quantity updated' });
    });
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product deleted' });
    });
});

// Users API

// Get all users (excluding password)
app.get('/api/users', (req, res) => {
    const sql = 'SELECT id, username FROM users';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new user with hashed password
app.post('/api/users', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, username });
    });
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted' });
    });
});

// Start the server
const PORT = process.env.PORT || 5116;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
