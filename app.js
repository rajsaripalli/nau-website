const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ UPDATED DB CREDENTIALS (based on Docker config)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

app.get('/admin/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, firstname, lastname, email, nauid FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
});

app.post('/submit', async (req, res) => {
    const { firstname, lastname, email, nauid, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const duplicateCheck = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR nauid = $2',
            [email, nauid]
        );

        if (duplicateCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email or NAU ID already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (firstname, lastname, email, nauid, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstname, lastname, email, nauid, hashedPassword]
        );

        res.json({ message: 'Signup successful', data: result.rows[0] });

    } catch (err) {
        console.error('Error signing up:', err);
        res.status(500).json({ message: 'Error inserting data', error: err });
    }
});

app.post('/login', async (req, res) => {
    const { nauid, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE nauid = $1', [nauid]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid NAU ID or password' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid NAU ID or password' });
        }

        res.json({ message: 'Login successful', user: user });

    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Error logging in', error: err });
    }
});

// ✅ Updated to bind to all network interfaces (so EC2 IP works)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at: http://3.17.76.52:${PORT}`);
});
