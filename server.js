const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Import the 'path' module
const cors = require('cors'); // Add this line

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors()); // Add this line

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public')));

// Set up SQLite database
const db = new sqlite3.Database('database.db');

// Create a table to store photo information
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT)');
});

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: 'public/uploads/', // Store uploads in the public folder
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Serve static files from the "public" directory
app.use(express.static('public'));

// Upload a photo
app.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filename = req.file.filename;

    db.run('INSERT INTO photos (filename) VALUES (?)', [filename], (err) => {
        if (err) {
            return res.status(500).send('Error uploading photo.');
        }
        res.send("Success");
    });
});

// Get a list of uploaded photos
app.get('/photos', (req, res) => {
    db.all('SELECT id, filename FROM photos', (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving photos.');
        }

        res.json(rows);
    });
});

// Delete a photo
app.delete('/photo/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM photos WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).send('Error deleting photo.');
        }

        res.sendStatus(204);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
