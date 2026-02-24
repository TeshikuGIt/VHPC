const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

const config = {
  host: "localhost",
  user: "root",
  password: "VHPTDB123",
  database: "vhptest"
};

app.use(express.static('.')); // serve static files

app.get('/api/data', async (req, res) => {
  try {
    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute('SELECT * FROM reading_list LIMIT 20'); // limit for demo
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});